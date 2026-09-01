import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import monogram from '../assets/monogram.png'
import rsvpEnvelope from '../assets/rsvp-envelope.png'
import { wedding } from '../config/wedding'
import { PillButton } from './PillButton'

type Choice = '' | 'yes' | 'no'
type FormStep = 0 | 1 | 2 | 3

interface FormValues {
  leadGuestName: string
  attendance: Choice
  guestCount: string
  attendeeNames: string
  dietaryRequirements: string
  accommodation: Choice
  additionalNights: Choice
  checkInDate: string
  checkOutDate: string
  followingDay: Choice
  coachFromKrakow: Choice
  coachSeats: string
  returnTransport: Choice
  danceFloorSong: string
  website: string
}

const initialValues: FormValues = {
  leadGuestName: '', attendance: '', guestCount: '1', attendeeNames: '', dietaryRequirements: '',
  accommodation: '', additionalNights: '', checkInDate: '', checkOutDate: '', followingDay: '',
  coachFromKrakow: '', coachSeats: '', returnTransport: '', danceFloorSong: '', website: '',
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const stepNames: Record<FormStep, string> = {
  0: 'Your reply', 1: 'Your party', 2: 'Stay & travel', 3: 'One last question',
}

const validateStep = (values: FormValues, step: FormStep): FormErrors => {
  const errors: FormErrors = {}
  if (step === 0) {
    if (values.leadGuestName.trim().length < 2) errors.leadGuestName = 'Please enter your full name.'
    if (!values.attendance) errors.attendance = 'Please let us know whether you can join us.'
  }
  if (values.attendance === 'yes' && step === 1) {
    const count = Number(values.guestCount)
    if (!Number.isInteger(count) || count < 1 || count > 12) errors.guestCount = 'Enter a guest count between 1 and 12.'
    if (values.attendeeNames.trim().length < 2) errors.attendeeNames = 'Please list everyone attending.'
  }
  if (values.attendance === 'yes' && step === 2) {
    if (!values.accommodation) errors.accommodation = 'Please select an accommodation option.'
    if (!values.additionalNights) errors.additionalNights = 'Please select an option.'
    if (values.additionalNights === 'yes') {
      if (!values.checkInDate) errors.checkInDate = 'Please select a check-in date.'
      if (!values.checkOutDate) errors.checkOutDate = 'Please select a check-out date.'
      if (values.checkInDate && values.checkOutDate && values.checkOutDate <= values.checkInDate) {
        errors.checkOutDate = 'Check-out must be after check-in.'
      }
    }
    if (!values.followingDay) errors.followingDay = 'Please select an option.'
    if (!values.coachFromKrakow) errors.coachFromKrakow = 'Please select an option.'
    if (values.coachFromKrakow === 'yes') {
      const seats = Number(values.coachSeats)
      if (!Number.isInteger(seats) || seats < 1 || seats > 12) errors.coachSeats = 'Enter the number of seats required.'
    }
    if (!values.returnTransport) errors.returnTransport = 'Please select an option.'
  }
  if (step === 3 && values.website) errors.website = 'Unable to submit this response.'
  return errors
}

const validateAll = (values: FormValues): FormErrors => ({
  ...validateStep(values, 0), ...validateStep(values, 1), ...validateStep(values, 2), ...validateStep(values, 3),
})

interface ChoiceFieldProps {
  legend: string
  name: keyof FormValues
  value: Choice
  onChange: (name: keyof FormValues, value: string) => void
  error?: string
  hint?: string
  yesLabel?: string
  noLabel?: string
}

function ChoiceField({ legend, name, value, onChange, error, hint, yesLabel = 'Yes', noLabel = 'No' }: ChoiceFieldProps) {
  const hintId = useId()
  const errorId = useId()
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  return (
    <fieldset className="form-field form-field--choice" aria-describedby={describedBy}>
      <legend>{legend}</legend>
      {hint && <span className="field-hint" id={hintId}>{hint}</span>}
      <div className="choice-row">
        <label className={value === 'yes' ? 'choice-card is-selected' : 'choice-card'}>
          <input type="radio" name={name} value="yes" checked={value === 'yes'} onChange={(event) => onChange(name, event.target.value)} />
          <span className="choice-card__mark" aria-hidden="true" /><span>{yesLabel}</span>
        </label>
        <label className={value === 'no' ? 'choice-card is-selected' : 'choice-card'}>
          <input type="radio" name={name} value="no" checked={value === 'no'} onChange={(event) => onChange(name, event.target.value)} />
          <span className="choice-card__mark" aria-hidden="true" /><span>{noLabel}</span>
        </label>
      </div>
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </fieldset>
  )
}

export function RSVPSection() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<FormStep>(0)
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const formBodyRef = useRef<HTMLDivElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  const visibleSteps: FormStep[] = values.attendance === 'no' ? [0, 3] : [0, 1, 2, 3]
  const stepPosition = Math.max(0, visibleSteps.indexOf(step))
  const isLastStep = stepPosition === visibleSteps.length - 1

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      openButtonRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    formBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    const timer = window.setTimeout(() => stepHeadingRef.current?.focus(), 180)
    return () => window.clearTimeout(timer)
  }, [open, step])

  const updateValue = (name: keyof FormValues, value: string) => {
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === 'attendance' && value === 'no') {
        return { ...next, guestCount: '0', attendeeNames: '', dietaryRequirements: '', accommodation: '', additionalNights: '', checkInDate: '', checkOutDate: '', followingDay: '', coachFromKrakow: '', coachSeats: '', returnTransport: '' }
      }
      if (name === 'attendance' && value === 'yes' && current.guestCount === '0') next.guestCount = '1'
      if (name === 'coachFromKrakow' && value === 'no') next.coachSeats = ''
      if (name === 'additionalNights' && value === 'no') { next.checkInDate = ''; next.checkOutDate = '' }
      return next
    })
    setErrors((current) => ({ ...current, [name]: undefined }))
    if (status === 'error') { setStatus('idle'); setStatusMessage('') }
  }

  const openForm = () => { setStep(0); setOpen(true) }
  const closeForm = () => setOpen(false)

  const goNext = () => {
    const stepErrors = validateStep(values, step)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length) {
      setStatus('error')
      setStatusMessage('Please complete the highlighted answer before continuing.')
      return
    }
    setStatus('idle'); setStatusMessage('')
    const nextStep = visibleSteps[stepPosition + 1]
    if (nextStep !== undefined) setStep(nextStep)
  }

  const goBack = () => {
    setStatus('idle'); setStatusMessage('')
    const previousStep = visibleSteps[stepPosition - 1]
    if (previousStep !== undefined) setStep(previousStep)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    const nextErrors = validateAll(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidStep = visibleSteps.find((candidate) => Object.keys(validateStep(values, candidate)).length > 0)
      if (firstInvalidStep !== undefined) setStep(firstInvalidStep)
      setStatus('error'); setStatusMessage('Please check the highlighted answers and try again.')
      return
    }
    const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim()
    if (!endpoint) { setStatus('error'); setStatusMessage('RSVP is not connected yet. Please contact Kasia or Jake directly.'); return }
    setStatus('submitting'); setStatusMessage('Sending your reply…')
    const payload = { ...values, submissionId: crypto.randomUUID(), submittedAtClient: new Date().toISOString(), rsvpDeadline: wedding.rsvpDeadline }
    try {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      setStatus('success'); setStatusMessage('Thank you - your RSVP has been sent.')
    } catch {
      setStatus('error'); setStatusMessage('We couldn’t send your reply. Your answers are still here, so please try again.')
    }
  }

  const reset = () => { setValues(initialValues); setErrors({}); setStep(0); setStatus('idle'); setStatusMessage('') }

  return (
    <section className="rsvp-section" id="rsvp" aria-labelledby="rsvp-heading">
      <h2 className="sr-only" id="rsvp-heading">RSVP</h2>
      <div className="rsvp-envelope-wrap">
        <img src={rsvpEnvelope} alt="RSVP card in an olive green envelope" />
        <PillButton buttonRef={openButtonRef} className="rsvp-envelope-button" onClick={openForm} ariaLabel="Open RSVP form">RSVP</PillButton>
      </div>

      {open && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm() }}>
          <section ref={dialogRef} className="rsvp-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <header className="rsvp-dialog__header">
              <div className="rsvp-dialog__brand">
                <img src={monogram} alt="" />
                <div><p className="eyebrow">Kasia &amp; Jake</p><h2 id="dialog-title">RSVP</h2><p>Kindly reply before {wedding.rsvpDeadline}</p></div>
              </div>
              <div className="rsvp-progress" aria-label={`Step ${stepPosition + 1} of ${visibleSteps.length}`}>
                <span>Step {stepPosition + 1} of {visibleSteps.length}</span><strong>{stepNames[step]}</strong>
                <span className="rsvp-progress__track" aria-hidden="true"><span style={{ width: `${((stepPosition + 1) / visibleSteps.length) * 100}%` }} /></span>
              </div>
              <button ref={closeButtonRef} type="button" className="dialog-close" onClick={closeForm} aria-label="Close RSVP form"><span aria-hidden="true">×</span></button>
            </header>

            {status === 'success' ? (
              <div className="rsvp-success" aria-live="polite">
                <img src={monogram} alt="" /><p className="eyebrow">Kasia &amp; Jake</p><h3>Thank you</h3><p>{statusMessage}</p>
                <div className="success-actions"><button type="button" className="button button--dark" onClick={closeForm}>Close</button><button type="button" className="text-button" onClick={reset}>Send another reply</button></div>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={submit} noValidate>
                <div className="rsvp-form__body" ref={formBodyRef}>
                  <section className="form-step" aria-labelledby={`rsvp-step-${step}`}>
                    {step === 0 && (
                      <><div className="form-step__intro"><p className="form-step__number">01</p><div><h3 ref={stepHeadingRef} tabIndex={-1} id="rsvp-step-0">Your reply</h3><p>Let us know whether we will have the pleasure of celebrating with you.</p></div></div>
                        <div className="form-field"><label htmlFor="leadGuestName">Lead guest’s full name</label><input id="leadGuestName" name="leadGuestName" value={values.leadGuestName} onChange={(event) => updateValue('leadGuestName', event.target.value)} aria-invalid={Boolean(errors.leadGuestName)} maxLength={120} autoComplete="name" placeholder="First and last name" />{errors.leadGuestName && <span className="field-error">{errors.leadGuestName}</span>}</div>
                        <ChoiceField legend="Will you be joining us?" name="attendance" value={values.attendance} onChange={updateValue} error={errors.attendance} yesLabel="Yes, we’d love to attend." noLabel="Sadly, we can’t make it." /></>
                    )}

                    {step === 1 && (
                      <><div className="form-step__intro"><p className="form-step__number">02</p><div><h3 ref={stepHeadingRef} tabIndex={-1} id="rsvp-step-1">Your party</h3><p>Tell us who will be joining so we can prepare everything with care.</p></div></div>
                        <div className="form-field form-field--short"><label htmlFor="guestCount">Total number of guests attending</label><span className="field-hint">Please include yourself and any children.</span><input id="guestCount" type="number" min="1" max="12" inputMode="numeric" value={values.guestCount} onChange={(event) => updateValue('guestCount', event.target.value)} aria-invalid={Boolean(errors.guestCount)} />{errors.guestCount && <span className="field-error">{errors.guestCount}</span>}</div>
                        <div className="form-field"><label htmlFor="attendeeNames">Full names of everyone attending</label><span className="field-hint">Please include the age of each child if applicable.</span><textarea id="attendeeNames" rows={3} maxLength={800} value={values.attendeeNames} onChange={(event) => updateValue('attendeeNames', event.target.value)} aria-invalid={Boolean(errors.attendeeNames)} placeholder="One guest per line" />{errors.attendeeNames && <span className="field-error">{errors.attendeeNames}</span>}</div>
                        <div className="form-field"><label htmlFor="dietaryRequirements">Please provide any dietary requirements or allergies?</label><span className="field-hint">Please include the guest’s name and details.</span><textarea id="dietaryRequirements" rows={3} maxLength={1000} value={values.dietaryRequirements} onChange={(event) => updateValue('dietaryRequirements', event.target.value)} placeholder="Leave blank if there are none" /></div></>
                    )}

                    {step === 2 && (
                      <><div className="form-step__intro"><p className="form-step__number">03</p><div><h3 ref={stepHeadingRef} tabIndex={-1} id="rsvp-step-2">Stay &amp; travel</h3><p>A few practical details to help us arrange your weekend.</p></div></div>
                        <div className="form-subsection"><h4>Accommodation</h4>
                          <ChoiceField legend="Will you require accommodation for the night of the wedding?" name="accommodation" value={values.accommodation} onChange={updateValue} error={errors.accommodation} />
                          <ChoiceField legend="Would you like us to arrange any additional nights?" name="additionalNights" value={values.additionalNights} onChange={updateValue} error={errors.additionalNights} hint="Accommodation for the wedding night is provided. Additional nights can be arranged separately at your own expense." />
                          {values.additionalNights === 'yes' && <div className="date-grid"><div className="form-field"><label htmlFor="checkInDate">Preferred check-in date</label><input id="checkInDate" type="date" value={values.checkInDate} onChange={(event) => updateValue('checkInDate', event.target.value)} aria-invalid={Boolean(errors.checkInDate)} />{errors.checkInDate && <span className="field-error">{errors.checkInDate}</span>}</div><div className="form-field"><label htmlFor="checkOutDate">Preferred check-out date</label><input id="checkOutDate" type="date" value={values.checkOutDate} onChange={(event) => updateValue('checkOutDate', event.target.value)} aria-invalid={Boolean(errors.checkOutDate)} />{errors.checkOutDate && <span className="field-error">{errors.checkOutDate}</span>}</div></div>}
                        </div>
                        <div className="form-subsection"><h4>The Following Day</h4><ChoiceField legend="Will you be joining us for the second-day celebration?" name="followingDay" value={values.followingDay} onChange={updateValue} error={errors.followingDay} /></div>
                        <div className="form-subsection"><h4>Transport</h4><ChoiceField legend="Would you like to use the coach from Kraków on the morning of the wedding?" name="coachFromKrakow" value={values.coachFromKrakow} onChange={updateValue} error={errors.coachFromKrakow} />
                          {values.coachFromKrakow === 'yes' && <div className="form-field form-field--short"><label htmlFor="coachSeats">How many seats will you require?</label><input id="coachSeats" type="number" min="1" max="12" inputMode="numeric" value={values.coachSeats} onChange={(event) => updateValue('coachSeats', event.target.value)} aria-invalid={Boolean(errors.coachSeats)} />{errors.coachSeats && <span className="field-error">{errors.coachSeats}</span>}</div>}
                          <ChoiceField legend="Will your party require return transport to Kraków on the evening of the second day?" name="returnTransport" value={values.returnTransport} onChange={updateValue} error={errors.returnTransport} />
                        </div></>
                    )}

                    {step === 3 && (
                      <><div className="form-step__intro"><p className="form-step__number">{values.attendance === 'no' ? '02' : '04'}</p><div><h3 ref={stepHeadingRef} tabIndex={-1} id="rsvp-step-3">One Last Question…</h3><p>{values.attendance === 'no' ? 'We will miss you, but we would still love your song recommendation.' : 'Help us make the dance floor impossible to resist.'}</p></div></div>
                        <div className="form-field form-field--song"><label htmlFor="danceFloorSong">What song is guaranteed to get you on the dance floor?</label><span className="field-hint">Optional — artist and song title</span><input id="danceFloorSong" value={values.danceFloorSong} onChange={(event) => updateValue('danceFloorSong', event.target.value)} maxLength={200} placeholder="Your song" /></div></>
                    )}
                  </section>
                  <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => updateValue('website', event.target.value)} /></div>
                </div>

                <footer className="rsvp-form__footer">
                  <div className="rsvp-form__feedback">{statusMessage && <p className={`form-status form-status--${status}`} role="status" aria-live="polite">{statusMessage}</p>}</div>
                  <div className="rsvp-form__actions">{stepPosition > 0 && <button className="button button--quiet" type="button" onClick={goBack}>Back</button>}{!isLastStep ? <button className="button button--dark" type="button" onClick={goNext}>Continue</button> : <button className="button button--dark" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : 'Send RSVP'}</button>}</div>
                </footer>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
