import { useState } from 'react'

const details = [
  {
    id: 'accommodation',
    title: 'Accommodation',
    body: 'We truly appreciate you travelling so far to celebrate with us, so accommodation will be provided for the night of the wedding. If you would like to arrive earlier or extend your stay, we would be very happy to help arrange additional nights, which can be booked separately at your own expense.',
  },
  {
    id: 'following-day',
    title: 'The following day',
    body: 'The celebrations will continue the following day. Breakfast will be provided for all guests staying overnight at the wedding accommodation. In the afternoon, we’ll gather again for dinner and a relaxed continuation of the celebrations, with plenty of time to enjoy the beautiful surroundings.',
  },
  {
    id: 'transport',
    title: 'Transport',
    body: 'A coach from Kraków will be organised on the morning of the wedding for anyone who would like to use it. Return transport to Kraków will also be provided on the evening of the second day. If you prefer to travel independently, the venue has a free car park. There is plenty to explore in the surrounding area, so hiring a car is a great option if you would like to do some sightseeing during your stay.',
  },
  {
    id: 'airport',
    title: 'Closest airport',
    body: 'The nearest airport is Kraków John Paul II International Airport (KRK), approximately a 1½-hour drive from the venue. The airport is well connected to Kraków city centre by train, bus and taxi. Guests staying in Kraków can also use the coach provided on the morning of the wedding.',
  },
  {
    id: 'dress-code',
    title: 'Dress-code',
    body: 'The dress code is formal attire. All colours are welcome; however, we kindly ask guests to avoid white, ivory, cream, pale yellow and other very light shades that may appear white.',
  },
  {
    id: 'gifts',
    title: 'Gifts',
    body: 'Your presence is the greatest gift of all. If you would like to give a wedding gift, we would be very grateful for a contribution toward our future together.',
  },
] as const

export function OtherDetails() {
  const [openItem, setOpenItem] = useState<string>('')

  return (
    <div className="accordion">
      {details.map((item) => {
        const isOpen = item.id === openItem
        return (
          <div className={`accordion__item${isOpen ? ' is-open' : ''}`} key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={() => setOpenItem((current) => current === item.id ? '' : item.id)}
              >
                <span>{item.title}</span>
                <span className="accordion__chevron" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="accordion__panel"
              id={`${item.id}-panel`}
              aria-hidden={!isOpen}
            >
              <div className="accordion__panel-inner">
                <p>{item.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
