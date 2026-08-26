import { useState } from 'react'
import { Countdown } from './components/Countdown'
import { OpeningEnvelope } from './components/OpeningEnvelope'
import { OtherDetails } from './components/OtherDetails'
import { RSVPSection } from './components/RSVPForm'
import beskid from './assets/beskid.png'
import bouquet from './assets/bouquet.png'
import celebration from './assets/celebration.png'
import church from './assets/church.png'
import coupleWalking from './assets/couple-walking.png'
import introPhoto from './assets/intro-photo.png'
import monogram from './assets/monogram.png'
import polaroidCouple from './assets/polaroid-couple.png'
import polaroidRings from './assets/polaroid-rings.png'
import { wedding } from './config/wedding'

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (wedding.showIntroEveryVisit) return true
    return sessionStorage.getItem('wedding-intro-seen') !== 'true'
  })

  const completeIntro = () => {
    sessionStorage.setItem('wedding-intro-seen', 'true')
    setShowIntro(false)
  }

  return (
    <>
      {showIntro && <OpeningEnvelope onComplete={completeIntro} />}

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero__image"
            src={coupleWalking}
            alt="Kasia and Jake walking together through a green landscape"
            width="1600"
            height="953"
          />
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__content">
            <img className="hero__monogram" src={monogram} alt="" />
            <h1 id="hero-title">{wedding.couple.first} &amp; {wedding.couple.second}</h1>
            <p>{wedding.dateLabel}</p>
          </div>
        </section>

        <section className="invitation" aria-labelledby="invitation-title">
          <div className="invitation__inner">
            <img
              className="invitation__polaroid"
              src={polaroidRings}
              alt="Kasia and Jake holding their wedding rings"
              width="540"
              height="658"
            />
            <div className="invitation__copy">
              <h2 className="script-title" id="invitation-title">You’re invited!</h2>
              <p>Together with our families, we have the pleasure of inviting you to celebrate our wedding with us.</p>
              <p className="invitation__date">19 June 2027 at 3:00 pm</p>
              <p>We cannot wait to celebrate with you!</p>
              <p className="invitation__signoff">With love,<br /><strong>Kasia &amp; Jake</strong></p>
            </div>
          </div>
        </section>

        <section className="countdown-section" aria-labelledby="countdown-title">
          <img
            className="countdown-section__background"
            src={introPhoto}
            alt=""
            width="1102"
            height="2048"
            aria-hidden="true"
          />
          <div className="countdown-section__scrim" aria-hidden="true" />
          <h2 className="sr-only" id="countdown-title">Countdown to the wedding</h2>
          <Countdown />
        </section>

        <RSVPSection />

        <section className="venue" aria-labelledby="venue-title">
          <h2 className="script-title" id="venue-title">The Venue</h2>
          <div className="venue__grid">
            <article className="venue-card">
              <img src={church} alt="The wooden church in Jurków" width="508" height="619" loading="lazy" />
              <h3 className="script-title">Ceremony</h3>
              <p>The ceremony will take place at 3:00 pm at the Church of Our Lady of Perpetual Help in Jurków, Poland.</p>
              <a className="outline-link" href={wedding.ceremony.mapUrl} target="_blank" rel="noreferrer">See details</a>
            </article>
            <article className="venue-card">
              <img src={celebration} alt="The celebration venue in Słopnice" width="508" height="619" loading="lazy" />
              <h3 className="script-title">Celebration</h3>
              <p>The party will take place at Szałas Beskida in Słopnice, Poland, with plenty of food, drinks and dancing until 5:00 am.</p>
              <a className="outline-link" href={wedding.celebration.mapUrl} target="_blank" rel="noreferrer">See details</a>
            </article>
          </div>
        </section>

        <section className="other" aria-labelledby="other-title">
          <img className="other__background" src={bouquet} alt="Wedding bouquet held against a blue sky" width="1600" height="1718" loading="lazy" />
          <div className="other__content">
            <h2 className="script-title" id="other-title">Other details</h2>
            <OtherDetails />
          </div>
          <img className="other__polaroid" src={polaroidCouple} alt="Kasia and Jake together" width="571" height="628" loading="lazy" />
        </section>

        <section className="closing-message">
          <p className="script-title">We look forward to celebrating with you!</p>
        </section>

        <figure className="closing-landscape">
          <img src={beskid} alt="Painted view of Szałas Beskida and the surrounding mountains" width="1600" height="719" loading="lazy" />
        </figure>
      </main>
    </>
  )
}

export default App
