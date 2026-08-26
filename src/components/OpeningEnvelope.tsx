import { useEffect, useRef, useState } from 'react'
import envelopeImage from '../assets/intro-envelope.png'
import introPhoto from '../assets/intro-photo.png'
import monogram from '../assets/monogram.png'
import { wedding } from '../config/wedding'

type IntroState = 'closed' | 'opening' | 'leaving'

interface OpeningEnvelopeProps {
  onComplete: () => void
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

export function OpeningEnvelope({ onComplete }: OpeningEnvelopeProps) {
  const [state, setState] = useState<IntroState>('closed')
  const reducedMotion = useReducedMotion()
  const timers = useRef<number[]>([])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    ;[envelopeImage, monogram, introPhoto].forEach((source) => {
      const image = new Image()
      image.src = source
    })

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const openInvitation = () => {
    if (state !== 'closed') return

    if (reducedMotion) {
      setState('leaving')
      timers.current.push(window.setTimeout(onComplete, 500))
      return
    }

    setState('opening')
    timers.current.push(window.setTimeout(() => setState('leaving'), 2900))
    timers.current.push(window.setTimeout(onComplete, 3600))
  }

  return (
    <div className={`intro intro--${state}`} aria-label="Wedding invitation opening">
      <img
        className="intro__background"
        src={introPhoto}
        alt=""
        width="1102"
        height="2048"
      />
      <div className="intro__scrim" aria-hidden="true" />

      <div className="intro__content">
        <p className="intro__eyebrow">YOU&apos;RE INVITED</p>
        <p className="intro__names">{wedding.couple.first} &amp; {wedding.couple.second}</p>

        <button
          className="envelope-button"
          type="button"
          onClick={openInvitation}
          disabled={state !== 'closed'}
          aria-label={`Open ${wedding.couple.first} and ${wedding.couple.second}’s wedding invitation`}
        >
          <span className="envelope-stage" aria-hidden="true">
            <span className="envelope-back" />
            <span className="envelope-lining" />
            <span className="envelope-flap" />
            <span className="envelope-card">
              <img src={monogram} alt="" />
              <span>{wedding.couple.first} &amp; {wedding.couple.second}</span>
              <small>19 June 2027</small>
            </span>
            <img className="envelope-pocket" src={envelopeImage} alt="" />
            <img className="envelope-closed" src={envelopeImage} alt="" />
            <img className="envelope-monogram" src={monogram} alt="" />
          </span>
        </button>

        <p className="intro__instruction" aria-live="polite">
          {state === 'closed' ? 'Tap to open' : 'Opening invitation…'}
        </p>
      </div>
    </div>
  )
}
