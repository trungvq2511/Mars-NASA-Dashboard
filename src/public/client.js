let store = Immutable.Map({
    user: Immutable.Map({name: "Student"}),
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let {rovers, apod} = state

    return `
        <header></header>
        <main>
            ${Greeting((store.get('user')).get('name'))}
            ${renderRoversButton()}
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome to Mars dashboard, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const renderRoversButton = () => {
    const rovers = () => store.get("rovers");
    return rovers().map(rover => {
        return `<div class = rover>
        <button type="button" id="${rover.toLowerCase()}" href=${rover} onclick="roverOnClick(${rover.toLowerCase()})"><img id='${rover.toLowerCase()}-img'><h2>${rover}</h2></img></button>
        </div>
        `;
    }).join(" ");
};

function roverOnClick(button) {
    const roverId = button.id;
    fetch(`http://localhost:3000/rover/${roverId}`)
        .then(res => res.json())
        .then(data => {
            renderHoverDetail(data.latest_photos);
        })
}

function renderHoverDetail(state) {
    const body = document.querySelector('#body');
    console.log(body);
    body.innerHTML = `
        <div id="roverDetails">
            ${renderHoverInfo(state)}
        </div>
    `
}

// Get first 5 rovers
function renderHoverInfo(state) {
    console.log(state);
    const images = state.slice(0, 5);
    return images.map(image => {
        return (`
          <p>${image.rover.name}</p>
          <p>${image.rover.launch_date}</p>
          <p>${image.rover.landing_date}</p>
          <p>${image.rover.status}</p>
          <p>${images.slice(-1).pop().earth_date}</p>
        `)
    })
}