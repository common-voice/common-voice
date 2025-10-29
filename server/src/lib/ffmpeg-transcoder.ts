import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import { PassThrough } from 'stream'

interface TranscodeOptions {
  ffmpegPath?: string
}

interface TranscodeResult {
  stream: PassThrough
  completed: Promise<void>
  childProcess: ChildProcessWithoutNullStreams
}

const DEFAULT_FFMPEG_ARGS = [
  '-loglevel',
  'error',
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

export const transcodeToMp3 = (
  input: NodeJS.ReadableStream,
  options: TranscodeOptions = {}
): TranscodeResult => {
  const ffmpegPath = options.ffmpegPath ?? 'ffmpeg'

  const ffmpeg = spawn(ffmpegPath, DEFAULT_FFMPEG_ARGS, {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  })

  const stderrChunks: string[] = []
  ffmpeg.stderr.on('data', chunk => {
    stderrChunks.push(chunk.toString())
  })

  const stream = new PassThrough()

  ffmpeg.stdout.on('error', error => {
    stream.destroy(error)
  })

  ffmpeg.stdout.pipe(stream)

  input.pipe(ffmpeg.stdin)

  ffmpeg.stdin.on('error', error => {
    // Ignore the EPIPE error that occurs when ffmpeg exits before the input completes.
    if ((error as NodeJS.ErrnoException).code === 'EPIPE') return
    stream.destroy(error)
  })

  input.on('error', error => {
    stream.destroy(error)
    ffmpeg.kill('SIGKILL')
  })

  const completed = new Promise<void>((resolve, reject) => {
    ffmpeg.once('error', err => {
      stream.destroy(err)
      reject(err)
    })

    ffmpeg.once('close', (code, signal) => {
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

  ffprobe.stdout.on('error', error => {
    if ('destroy' in input && typeof input.destroy === 'function') {
      input.destroy(error)
    }
  })

  const probeStdin = ffprobe.stdin as NodeJS.WritableStream
  input.pipe(probeStdin)

  probeStdin.on('error', error => {
    if ((error as NodeJS.ErrnoException).code === 'EPIPE') return
    if ('destroy' in input && typeof input.destroy === 'function') {
      input.destroy(error)
    }
  })

  input.on('error', error => {
    ffprobe.kill('SIGKILL')
  })

  const completed = new Promise<ProbeMeasurement>((resolve, reject) => {
    ffprobe.once('error', err => {
      reject(err)
    })

    ffprobe.once('close', (code, signal) => {
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
          const codecName = typeof primaryStream?.codec_name === 'string'
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

interface Mp3TranscodeJob {
  outputStream: PassThrough
  transcodeCompleted: Promise<void>
  durationSeconds: Promise<number | null>
  abort: (reason?: Error) => void
  getTotalBytes: () => number
}

export const createMp3TranscodeJob = (
  input: NodeJS.ReadableStream,
  options: Mp3TranscodeOptions = {}
): Mp3TranscodeJob => {
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

  const durationSeconds = probeCompleted
    .then(({ duration, bitRate }) => {
      if (duration != null) return duration
      if (bitRate && totalBytes > 0) {
        return (totalBytes * 8) / bitRate
      }
      return null
    })

  return {
    outputStream,
    transcodeCompleted,
    durationSeconds,
    abort,
    getTotalBytes: () => totalBytes,
  }
}
