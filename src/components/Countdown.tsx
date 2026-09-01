import { Fragment, useEffect, useMemo, useState } from 'react'
import { wedding } from '../config/wedding'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  complete: boolean
}

const calculateTimeLeft = (target: number): TimeLeft => {
  const difference = Math.max(0, target - Date.now())
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
    complete: difference === 0,
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

export function Countdown() {
  const target = useMemo(() => new Date(wedding.dateTime).getTime(), [])
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(target))

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft(target))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [target])

  if (timeLeft.complete) {
    return <p className="countdown__complete">Our day is here!</p>
  }

  const values = [
    { label: 'days', value: String(timeLeft.days) },
    { label: 'hours', value: pad(timeLeft.hours) },
    { label: 'minutes', value: pad(timeLeft.minutes) },
    { label: 'seconds', value: pad(timeLeft.seconds) },
  ]

  return (
    <div className="countdown" role="timer">
      <p className="sr-only" aria-live="polite">
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes and{' '}
        {timeLeft.seconds} seconds until the wedding
      </p>
      <div className="countdown__values" aria-hidden="true">
        {values.map((item, index) => (
          <Fragment key={item.label}>
            <div className="countdown__unit">
              <span className="countdown__number">{item.value}</span>
              <span className="countdown__label">{item.label}</span>
            </div>
            {index < values.length - 1 && <span className="countdown__separator">:</span>}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
