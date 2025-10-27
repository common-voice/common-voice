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
