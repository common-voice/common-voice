import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import * as React from 'react'
import { useRef, useState } from 'react'
import { trackRecording } from '../../../../services/tracker'
import { useLocale } from '../../../locale-helpers'
import { PlayOutlineIcon, RedoIcon, StopIcon } from '../../../ui/icons'
import { ContributionPillProps } from '../contribution'
import Pill, { PillStatus } from '../pill'
import { SentenceRecording } from './sentence-recording'

import './recording-pill.css'

const { Tooltip } = require('react-tippy')

interface Props extends ContributionPillProps, WithLocalizationProps {
  children?: React.ReactNode
  clip: SentenceRecording
  onRerecord: () => any
  status: PillStatus
}

function RecordingPill({
  children,
  clip,
  getString,
  onRerecord,
  onShare,
  status,
  ...props
}: Props) {
  const [locale] = useLocale()
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSentenceTooltip, setShowSentenceTooltip] = useState(false)
  const audioContext = useRef(null)
  const source = useRef(null)
  const shouldPlay = useRef(false) // Track if playback should proceed (survive re-render)

  const toggleIsPlaying = () => {
    const nextIsPlaying = !isPlaying

    if (nextIsPlaying) {
      trackRecording('listen', locale)
      shouldPlay.current = true // Mark that playback should proceed

      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)()
      source.current = audioContext.current.createBufferSource()

      clip.recording.blob
        .arrayBuffer()
        .then(arrayBuffer => {
          audioContext.current
            .decodeAudioData(arrayBuffer)
            .then((audioBuffer: any) => {
              // Check if user didn't click stop while decoding (use ref, not stale state)
              if (!shouldPlay.current) {
                return // User stopped playback before audio finished decoding
              }
              source.current.buffer = audioBuffer
              source.current.onended = () => {
                source.current = audioContext.current.createBufferSource()
                setShowSentenceTooltip(false)
                setIsPlaying(false)
              }
              source.current.connect(audioContext.current.destination)
              source.current.start(0)
            })
            .catch((error: any) => {
              console.error('[RecordingPill] Failed to decode audio:', error)
              // Reset state on decode failure
              setIsPlaying(false)
              setShowSentenceTooltip(false)
            })
        })
        .catch((error: any) => {
          console.error('[RecordingPill] Failed to read blob:', error)
          setIsPlaying(false)
          setShowSentenceTooltip(false)
        })
    } else {
      shouldPlay.current = false // Mark that playback should stop
      // Only stop if source exists and has been started
      if (source.current) {
        try {
          source.current.stop(0)
        } catch (error) {
          // Ignore InvalidStateError if stop() called before start()
          console.warn('[RecordingPill] Could not stop audio source:', error)
        }
      }
      setShowSentenceTooltip(false)
    }
    setIsPlaying(nextIsPlaying)
  }

  return (
    <Pill {...props} className="recording" openable status={status}>
      {children}

      {!children && status === 'active' && (
        <Localized id="record-cta">
          <div className="text" />
        </Localized>
      )}

      {!children && status === 'done' && (
        <>
          <Tooltip
            arrow
            open={isPlaying || showSentenceTooltip}
            theme="dark"
            title={clip.sentence.text}>
            <button
              className="play"
              type="button"
              onClick={toggleIsPlaying}
              onMouseEnter={() => setShowSentenceTooltip(true)}
              onMouseLeave={() => setShowSentenceTooltip(false)}>
              <span className="padder">
                {isPlaying ? <StopIcon /> : <PlayOutlineIcon />}
              </span>
            </button>
          </Tooltip>
          {isPlaying ? (
            <div className="placeholder" />
          ) : (
            <>
              <Tooltip arrow title={getString('review-tooltip')}>
                <button className="redo" type="button" onClick={onRerecord}>
                  <span className="padder">
                    <RedoIcon />
                  </span>
                </button>
              </Tooltip>
            </>
          )}
        </>
      )}
    </Pill>
  )
}

export default withLocalization(RecordingPill)
