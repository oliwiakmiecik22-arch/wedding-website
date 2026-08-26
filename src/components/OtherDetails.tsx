import { useState } from 'react'

const details = [
  {
    id: 'accommodation',
    title: 'Accommodation',
    body: 'Accommodation for the night of the wedding will be provided for our guests. If you would like to stay for any additional nights, please let us know in your RSVP.',
  },
  {
    id: 'following-day',
    title: 'The following day',
    body: 'The celebrations will continue the following day. Breakfast will be provided for all guests staying overnight at the wedding accommodation. In the afternoon, we’ll gather again for dinner and a relaxed continuation of the celebrations, with plenty of time to enjoy the beautiful surroundings.',
  },
  {
    id: 'transport',
    title: 'Transport',
    body: 'A coach from Kraków will be available on the morning of the wedding, with return transport after the second-day celebration. Please reserve the seats you need in your RSVP.',
  },
  {
    id: 'airport',
    title: 'Closest airport',
    body: 'The closest airport is Kraków John Paul II International Airport. Further travel information will be shared with guests who request transport.',
  },
  {
    id: 'dress-code',
    title: 'Dress-code',
    body: 'Please choose elegant attire that will also feel comfortable in the mountain surroundings. We recommend bringing a light layer for the evening.',
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
