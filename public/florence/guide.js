const places = [
  { id:'market', name:'Mercato Centrale', area:'San Lorenzo', type:'Food', x:34, y:21, text:'Browse the covered market for Tuscan produce and a bite of something local.', tip:'Make this your lunch stop. Look for lampredotto if you want to try a Florentine classic.' },
  { id:'duomo', name:'Piazza del Duomo', area:'Historic center', type:'Landmarks', x:52, y:32, text:'Look up at the marble cathedral and the terracotta dome designed by Filippo Brunelleschi.', tip:'Give yourself time to walk around the cathedral before choosing which part of the complex to visit.' },
  { id:'uffizi', name:'Uffizi Gallery', area:'Historic center', type:'Art', x:60, y:49, text:'Step inside the former Medici offices to see Renaissance paintings, including Botticelli’s Primavera.', tip:'Check the museum’s official ticket options before you go.', site:'https://www.uffizi.it/en/the-uffizi' },
  { id:'ponte', name:'Ponte Vecchio', area:'Arno river', type:'Landmarks', x:43, y:53, text:'Cross the Arno on the bridge lined with goldsmiths’ shops.', tip:'For a view of the bridge itself, continue west to Ponte Santa Trinita.' },
  { id:'boboli', name:'Boboli Gardens', area:'Oltrarno', type:'Outdoors', x:35, y:79, text:'Behind Palazzo Pitti, paths lead past sculpture, fountains and formal garden terraces.', tip:'Allow extra time for the uphill paths and check the garden’s visitor information.', site:'https://www.uffizi.it/en/boboli-garden' },
  { id:'piazzale', name:'Piazzale Michelangelo', area:'Oltrarno hills', type:'Outdoors', x:82, y:74, text:'See the cathedral dome, the Arno and the whole sweep of the historic center from this hilltop terrace.', tip:'Save it for the end of the walk if you want to catch the evening light.' }
];

const walks = {
  'First visit': ['market', 'duomo', 'uffizi', 'ponte', 'piazzale'],
  'Art and gardens': ['duomo', 'uffizi', 'ponte', 'boboli'],
  'Market to sunset': ['market', 'ponte', 'piazzale']
};

const get = (id) => document.getElementById(id);
const byId = new Map(places.map((place) => [place.id, place]));
const storageKey = 'firenze-on-foot-stops';
let saved = [];
try {
  const previous = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (Array.isArray(previous)) saved = [...new Set(previous.filter((id) => byId.has(id)))];
} catch {
  // The itinerary still works when storage is unavailable.
}

let filter = 'All places';
let selected = 'duomo';

function makeButton(label, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function setSaved(ids, message) {
  saved = ids;
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    message += ' Browser storage is unavailable.';
  }
  get('feedback').textContent = message;
  renderPlan();
  updateSaveButton();
}

function toggleStop(place) {
  const included = saved.includes(place.id);
  const ids = included ? saved.filter((id) => id !== place.id) : [...saved, place.id];
  setSaved(ids, place.name + (included ? ' removed.' : ' added.'));
}

function updateSaveButton() {
  const button = get('save-place');
  const included = saved.includes(selected);
  button.textContent = included ? 'Remove from itinerary' : 'Add to itinerary';
}

function selectPlace(id) {
  selected = id;
  const place = byId.get(id);
  for (const pin of get('pins').children) {
    pin.setAttribute('aria-pressed', String(pin.dataset.id === selected));
  }

  const details = get('place');
  const category = document.createElement('p');
  category.className = 'eyebrow';
  category.textContent = place.type + ' · ' + place.area;
  const heading = document.createElement('h3');
  heading.textContent = place.name;
  const description = document.createElement('p');
  description.textContent = place.text;
  const tip = document.createElement('p');
  tip.className = 'hint';
  tip.textContent = place.tip;
  const actions = document.createElement('div');
  actions.className = 'actions';
  const save = makeButton('', () => toggleStop(place));
  save.id = 'save-place';
  save.className = 'primary';
  actions.append(save);
  if (place.site) {
    const link = document.createElement('a');
    link.href = place.site;
    link.textContent = 'Official visitor info';
    actions.append(link);
  }
  details.replaceChildren(category, heading, description, tip, actions);
  updateSaveButton();
}

function applyFilter(category) {
  filter = category;
  const visible = places.filter((place) => filter === 'All places' || place.type === filter);
  for (const button of get('filters').children) {
    button.setAttribute('aria-pressed', String(button.textContent === filter));
  }
  for (const pin of get('pins').children) {
    pin.hidden = !visible.some((place) => place.id === pin.dataset.id);
  }
  selectPlace(visible.some((place) => place.id === selected) ? selected : visible[0].id);
}

function renderPlan() {
  const list = get('stops');
  list.replaceChildren();
  get('count').textContent = saved.length;
  get('empty').hidden = saved.length > 0;
  for (const id of saved) {
    const place = byId.get(id);
    const item = document.createElement('li');
    const row = document.createElement('div');
    row.className = 'stop';
    const label = document.createElement('span');
    label.textContent = place.name;
    const remove = makeButton('Remove', () => {
      const index = saved.indexOf(id);
      toggleStop(place);
      const buttons = [...list.querySelectorAll('button')];
      const next = buttons[Math.min(index, buttons.length - 1)] ?? get('presets').firstElementChild;
      next.focus();
    });
    remove.className = 'remove';
    remove.setAttribute('aria-label', 'Remove ' + place.name);
    row.append(label, remove);
    item.append(row);
    list.append(item);
  }

  const directions = get('directions');
  directions.hidden = saved.length < 2;
  directions.removeAttribute('href');
  if (saved.length >= 2) {
    const names = saved.map((id) => byId.get(id).name + ', Florence, Italy');
    const params = new URLSearchParams({
      api: '1', travelmode: 'walking', origin: names[0], destination: names.at(-1)
    });
    if (names.length > 2) params.set('waypoints', names.slice(1, -1).join('|'));
    directions.href = 'https://www.google.com/maps/dir/?' + params;
  }
}

for (const category of ['All places', ...new Set(places.map((place) => place.type))]) {
  get('filters').append(makeButton(category, () => applyFilter(category)));
}

for (const [index, place] of places.entries()) {
  const pin = makeButton(String(index + 1), () => selectPlace(place.id));
  pin.className = 'pin';
  pin.dataset.id = place.id;
  pin.title = place.name;
  pin.setAttribute('aria-label', place.name);
  pin.style.setProperty('--x', place.x + '%');
  pin.style.setProperty('--y', place.y + '%');
  get('pins').append(pin);
}

for (const [name, ids] of Object.entries(walks)) {
  get('presets').append(makeButton(name, () => {
    const combined = [...new Set([...saved, ...ids])];
    const added = combined.length - saved.length;
    setSaved(combined, added ? name + ' added ' + added + (added === 1 ? ' stop.' : ' stops.') : 'All stops on ' + name + ' are already in your itinerary.');
  }));
}

applyFilter(filter);
renderPlan();
