import {useState} from 'react';
import './nichols.css';

const official = 'https://kimnicholsmd.com';
const treatments = [
  ['Medical dermatology', 'Explore medical services for skin concerns.', 'medical-treatments'],
  ['Facials & peels', 'Browse the practice’s facial and peel offerings.', 'facials-and-peels'],
  ['Laser treatments', 'Explore the laser technologies offered by the practice.', 'laser-treatments'],
  ['Injectables', 'Read about Botox and other wrinkle reducers.', 'botox-wrinkle-reducers'],
] as const;
const locations = [
  ['Greenwich', '32 Field Point Road', 'greenwich'],
  ['Stamford · SkinLab', '24 Harbor Point Road', 'skinlab-at-harbor-point'],
  ['Fairfield', '1215 Post Road', 'fairfield'],
] as const;

function Services() {
  const [selected, setSelected] = useState(0);
  const [title, description, slug] = treatments[selected];

  return (
    <section id="services" className="dark">
      <div className="wrap section">
        <h2>Explore treatments</h2>
        <div className="split explorer">
          <div className="choices" role="group" aria-label="Treatment categories">
            {treatments.map(([name], index) => (
              <button key={name} type="button" aria-pressed={selected === index}
                aria-controls="treatment-details" onClick={() => setSelected(index)}>{name}</button>
            ))}
          </div>
          <div id="treatment-details" className="panel" aria-live="polite">
            <h3>{title}</h3>
            <p>{description}</p>
            <a className="action" href={official + '/discover-our-treatments/' + slug + '/'}>Details on the official site ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="nichols" id="top">
      <p className="notice">This website was created for educational purposes only and does not represent or reflect the official website of the business.</p>
      <header className="wrap masthead">
        <a className="brand" href="#top">NicholsMD</a>
        <nav aria-label="Main navigation">
          <a href="#manifesto">About</a><a href="#services">Treatments</a><a href="#process">Locations</a>
        </nav>
        <a href={official}>Official site ↗</a>
      </header>
      <main>
        <section className="wrap split hero" aria-labelledby="intro">
          <div>
            <p className="eyebrow">Dermatology in Fairfield County</p>
            <h1 id="intro">Get to know<br />Dr. Kim Nichols</h1>
            <p>Explore the medical and cosmetic dermatology practice Dr. Nichols founded in Greenwich, Connecticut.</p>
            <a className="action" href="#services">Explore treatments ↓</a>
          </div>
          <figure>
            <img src={import.meta.env.BASE_URL + 'nichols/dr-kim-nichols.png'} alt="Dr. Kim Nichols" fetchPriority="high" />
            <figcaption>Dr. Kim Nichols, founder of NicholsMD</figcaption>
          </figure>
        </section>
        <section id="manifesto" className="muted">
          <div className="wrap section split">
            <h2>About Dr. Nichols</h2>
            <div>
              <p>Dr. Kim Nichols is a board-certified dermatologist whose practice spans medical and cosmetic skin care. She opened NicholsMD in Greenwich in 2013 and has since expanded to Stamford and Fairfield.</p>
              <a className="text-link" href={official + '/dr-kim-nichols/'}>Read her official biography ↗</a>
            </div>
          </div>
        </section>
        <Services />
        <section id="process" className="wrap section">
          <h2>Practice locations</h2>
          <ul className="locations">
            {locations.map(([name, address, slug]) => (
              <li className="panel" key={slug}><h3>{name}</h3><p>{address}</p>
                <a className="text-link" href={official + '/location/' + slug + '/'}>View {name} location ↗</a>
              </li>
            ))}
          </ul>
        </section>
        <section id="contact" className="muted">
          <div className="wrap section split">
            <h2>Planning a visit?</h2>
            <div><p>Visit NicholsMD’s official site for appointment information.</p>
              <a className="action" href={official + '/book-an-appointment/'}>Official appointment page ↗</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="wrap foot">
        <p>Ashley Vallila · Fairfield University</p>
        <a className="text-link" href={official + '/dr-kim-nichols/'}>Biography and portrait source ↗</a>
        <a className="text-link" href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
