import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import { PassThrough } from 'stream'
import { Semaphore } from 'async-mutex'
import {
  CLIP_TRANSCODE_TIMEOUT_MS,
  MAX_RECORDING_MS_WITH_HEADROOM,
} from 'common'
import { getConfig } from '../config-helper'

interface TranscodeOptions {
  ffmpegPath?: string
  timeoutMs?: number // Maximum time to allow for transcoding
}

interface TranscodeResult {
  stream: PassThrough
  completed: Promise<void>
  childProcess: ChildProcessWithoutNullStreams
}

const DEFAULT_FFMPEG_ARGS = [
  '-loglevel',
  'error',
  // Resilience flags for piped input from mobile browsers:
  //  genpts        - regenerate missing/broken PTS timestamps (common in fMP4 chunks)
  //  discardcorrupt - drop corrupt packets instead of aborting the whole transcode
  '-fflags',
  '+genpts+discardcorrupt',
  // Give ffmpeg enough data/time to detect format from piped input.
  // Defaults can be too short for MP4 containers with padding after the header.
  '-analyzeduration',
  '20000000',
  // Max recording: 17s at 128 kbps = ~275 KB
  '-probesize',
  '1048576',
  '-i',
  'pipe:0',
  '-vn',
  '-ac',
  '1',
  '-ar',
  '32000',
  '-c:a',
  'libmp3lame',
  '-f',
  'mp3',
  'pipe:1',
]

const DEFAULT_CONCURRENCY_LIMIT = 4

const configuredConcurrency =
  getConfig().CLIP_TRANSCODE_CONCURRENCY_LIMIT || DEFAULT_CONCURRENCY_LIMIT

const transcodeSemaphore = new Semaphore(Math.max(1, configuredConcurrency))

export const transcodeToMp3 = (
  input: NodeJS.ReadableStream,
  options: TranscodeOptions = {}
): TranscodeResult => {
  const ffmpegPath = options.ffmpegPath ?? 'ffmpeg'
  const timeoutMs = options.timeoutMs ?? CLIP_TRANSCODE_TIMEOUT_MS

  const ffmpeg = spawn(ffmpegPath, DEFAULT_FFMPEG_ARGS, {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  })

  const stderrChunks: string[] = []
  ffmpeg.stderr.on('data', chunk => {
    stderrChunks.push(chunk.toString())
  })

  const stream = new PassThrough()

  // Set up timeout to prevent hanging processes
  let timeoutHandle: NodeJS.Timeout | null = null
  let isTimedOut = false

  const clearTimeoutIfExists = () => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }
  }

  ffmpeg.stdout.on('error', error => {
    clearTimeoutIfExists()
    stream.destroy(error)
  })

  ffmpeg.stdout.pipe(stream)

  input.pipe(ffmpeg.stdin)

  ffmpeg.stdin.on('error', error => {
    clearTimeoutIfExists()
    // Ignore the EPIPE error that occurs when ffmpeg exits before the input completes.
    if ((error as NodeJS.ErrnoException).code === 'EPIPE') return
    stream.destroy(error)
  })

  input.on('error', error => {
    clearTimeoutIfExists()
    stream.destroy(error)
    if (!ffmpeg.killed) {
      ffmpeg.kill('SIGKILL')
    }
  })

  const completed = new Promise<void>((resolve, reject) => {
    // Set timeout handler
    timeoutHandle = setTimeout(() => {
      isTimedOut = true
      const timeoutError = new Error(
        `[ffmpeg] Transcoding timed out after ${timeoutMs}ms`
      )
      stream.destroy(timeoutError)
      if (!ffmpeg.killed) {
        ffmpeg.kill('SIGTERM') // Try graceful termination first
        setTimeout(() => {
          if (!ffmpeg.killed) {
            ffmpeg.kill('SIGKILL') // Force kill if still running
          }
        }, 2000)
      }
      reject(timeoutError)
    }, timeoutMs)

    ffmpeg.once('error', err => {
      clearTimeoutIfExists()
      stream.destroy(err)
      reject(err)
    })

    ffmpeg.once('close', (code, signal) => {
      clearTimeoutIfExists()

      if (isTimedOut) {
        // Already rejected due to timeout
        return
      }

      if (code === 0 && !signal) {
        resolve()
        return
      }

      const errorMessage = stderrChunks.join('').trim()
      const descriptiveError = new Error(
        `ffmpeg exited with code ${code ?? 'null'} and signal ${
          signal ?? 'null'
        }${errorMessage ? `: ${errorMessage}` : ''}`
      )
      stream.destroy(descriptiveError)
      reject(descriptiveError)
    })
  })

  return { stream, completed, childProcess: ffmpeg }
}

interface ProbeOptions {
  ffprobePath?: string
  timeoutMs?: number // Maximum time to allow for probing
}

interface ProbeMeasurement {
  duration: number | null
  bitRate: number | null
}

interface ProbeResult {
  completed: Promise<ProbeMeasurement>
  childProcess: ChildProcessWithoutNullStreams
}

const DEFAULT_FFPROBE_ARGS = [
  '-v',
  'error',
  '-of',
  'json',
  '-show_format',
  '-show_entries',
  'format=duration:stream=duration,bit_rate,nb_frames,nb_read_frames,sample_rate,codec_name,codec_type',
  '-select_streams',
  'a:0',
  '-count_frames',
  '-f',
  'mp3',
  'pipe:0',
]

export const probeDurationFromStream = (
  input: NodeJS.ReadableStream,
  options: ProbeOptions = {}
): ProbeResult => {
  const ffprobePath = options.ffprobePath ?? 'ffprobe'
  const timeoutMs = options.timeoutMs ?? MAX_RECORDING_MS_WITH_HEADROOM

  const ffprobe = spawn(ffprobePath, DEFAULT_FFPROBE_ARGS, {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  })

  const stderrChunks: string[] = []
  ffprobe.stderr.on('data', chunk => {
    stderrChunks.push(chunk.toString())
  })

  const stdoutChunks: Buffer[] = []
  ffprobe.stdout.on('data', chunk => {
    stdoutChunks.push(chunk as Buffer)
  })

  // Set up timeout to prevent hanging processes
  let timeoutHandle: NodeJS.Timeout | null = null
  let isTimedOut = false

  const clearTimeoutIfExists = () => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }
  }

  ffprobe.stdout.on('error', error => {
    clearTimeoutIfExists()
    if ('destroy' in input && typeof input.destroy === 'function') {
      input.destroy(error)
    }
  })

  const probeStdin = ffprobe.stdin as NodeJS.WritableStream
  input.pipe(probeStdin)

  probeStdin.on('error', error => {
    clearTimeoutIfExists()
    if ((error as NodeJS.ErrnoException).code === 'EPIPE') return
    if ('destroy' in input && typeof input.destroy === 'function') {
      input.destroy(error)
    }
  })

  input.on('error', error => {
    clearTimeoutIfExists()
    if (!ffprobe.killed) {
      ffprobe.kill('SIGKILL')
    }
  })

  const completed = new Promise<ProbeMeasurement>((resolve, reject) => {
    // Set timeout handler
    timeoutHandle = setTimeout(() => {
      isTimedOut = true
      const timeoutError = new Error(`[ffprobe] Timed out after ${timeoutMs}ms`)
      if (!ffprobe.killed) {
        ffprobe.kill('SIGTERM') // Try graceful termination first
        setTimeout(() => {
          if (!ffprobe.killed) {
            ffprobe.kill('SIGKILL') // Force kill if still running
          }
        }, 2000)
      }
      reject(timeoutError)
    }, timeoutMs)

    ffprobe.once('error', err => {
      clearTimeoutIfExists()
      reject(err)
    })

    ffprobe.once('close', (code, signal) => {
      clearTimeoutIfExists()

      if (isTimedOut) {
        // Already rejected due to timeout
        return
      }

      if (code === 0 && !signal) {
        try {
          const rawOutput = Buffer.concat(stdoutChunks).toString().trim()
          const parsedOutput = rawOutput ? JSON.parse(rawOutput) : {}
          const streams = Array.isArray(parsedOutput?.streams)
            ? parsedOutput.streams
            : []
          const primaryStream =
            streams.find((stream: any) => stream?.codec_type === 'audio') ??
            streams[0] ??
            {}

          const durationStr =
            parsedOutput?.format?.duration ?? primaryStream?.duration
          const duration = Number.parseFloat(durationStr)

          const bitRateStr =
            parsedOutput?.format?.bit_rate ?? primaryStream?.bit_rate
          const bitRate = Number.parseFloat(bitRateStr)

          const frameCountStr =
            primaryStream?.nb_read_frames ?? primaryStream?.nb_frames
          const frameCount = Number.parseFloat(frameCountStr)

          const sampleRate = Number.parseFloat(primaryStream?.sample_rate)
          const codecName =
            typeof primaryStream?.codec_name === 'string'
              ? primaryStream.codec_name
              : ''

          let derivedDuration: number | null = null
          if (
            Number.isFinite(frameCount) &&
            Number.isFinite(sampleRate) &&
            sampleRate > 0 &&
            frameCount > 0
          ) {
            let samplesPerFrame: number | null = null
            const normalizedCodec = codecName?.toLowerCase()

            if (normalizedCodec?.includes('mp3')) {
              // MPEG Layer III uses 1152 samples per frame for MPEG-1 (sample_rate >= 32000),
              // otherwise 576 samples. Our transcoder enforces 32kHz so MPEG-1 applies.
              samplesPerFrame = sampleRate >= 32000 ? 1152 : 576
            }

            if (samplesPerFrame) {
              derivedDuration = (frameCount * samplesPerFrame) / sampleRate
            }
          }

          resolve({
            duration: Number.isFinite(duration)
              ? duration
              : derivedDuration ?? null,
            bitRate: Number.isFinite(bitRate) ? bitRate : null,
          })
          return
        } catch (error) {
          const parsingError =
            error instanceof Error ? error : new Error(String(error))
          reject(parsingError)
          return
        }
      }

      const errorMessage = stderrChunks.join('').trim()
      reject(
        new Error(
          `ffprobe exited with code ${code ?? 'null'} and signal ${
            signal ?? 'null'
          }${errorMessage ? `: ${errorMessage}` : ''}`
        )
      )
    })
  })

  return { completed, childProcess: ffprobe }
}

type Mp3TranscodeOptions = TranscodeOptions & ProbeOptions

export interface Mp3TranscodeJob {
  outputStream: PassThrough
  transcodeCompleted: Promise<void>
  durationSeconds: Promise<number | null>
  abort: (reason?: Error) => void
  getTotalBytes: () => number
}

export const createMp3TranscodeJob = async (
  input: NodeJS.ReadableStream,
  options: Mp3TranscodeOptions = {}
): Promise<Mp3TranscodeJob> => {
  const [, releasePermit] = await transcodeSemaphore.acquire()
  let permitReleased = false
  const releaseOnce = () => {
    if (permitReleased) return
    permitReleased = true
    releasePermit()
  }

  try {
    const {
      stream: transcodedStream,
      completed: transcodeCompleted,
      childProcess: ffmpegProcess,
    } = transcodeToMp3(input, { ffmpegPath: options.ffmpegPath })

    const countingStream = new PassThrough()
    const outputStream = new PassThrough()
    const probeStream = new PassThrough()
    let totalBytes = 0

    const { completed: probeCompleted, childProcess: ffprobeProcess } =
      probeDurationFromStream(probeStream, { ffprobePath: options.ffprobePath })

    let aborted = false

    const abort = (reason?: Error) => {
      if (aborted) return
      aborted = true

      const error = reason ?? new Error('Transcode job aborted')

      if (!transcodedStream.destroyed) {
        transcodedStream.destroy(error)
      }
      if (!outputStream.destroyed) {
        outputStream.destroy(error)
      }
      if (!probeStream.destroyed) {
        probeStream.destroy(error)
      }
      if (!countingStream.destroyed) {
        countingStream.destroy(error)
      }

      if (!ffmpegProcess.killed) {
        ffmpegProcess.kill('SIGKILL')
      }
      if (!ffprobeProcess.killed) {
        ffprobeProcess.kill('SIGKILL')
      }
    }

    const forwardError = (err: Error) => {
      abort(err)
    }

    transcodedStream.on('error', forwardError)
    countingStream.on('error', forwardError)
    outputStream.on('error', forwardError)
    probeStream.on('error', forwardError)

    transcodedStream.pipe(countingStream)

    countingStream.on('data', chunk => {
      totalBytes += (chunk as Buffer).length
    })

    countingStream.pipe(outputStream)
    countingStream.pipe(probeStream)

    const wrappedTranscodeCompleted = transcodeCompleted
      .then(() => {
        releaseOnce()
      })
      .catch(err => {
        releaseOnce()
        throw err
      })

    const durationSeconds = probeCompleted.then(({ duration, bitRate }) => {
      if (duration != null) return duration
      if (bitRate && totalBytes > 0) {
        return (totalBytes * 8) / bitRate
      }
      return null
    })

    const abortWithRelease = (reason?: Error) => {
      abort(reason)
      releaseOnce()
    }

    return {
      outputStream,
      transcodeCompleted: wrappedTranscodeCompleted,
      durationSeconds,
      abort: abortWithRelease,
      getTotalBytes: () => totalBytes,
    }
  } catch (error) {
    releaseOnce()
    throw error instanceof Error ? error : new Error(String(error))
  }
}
