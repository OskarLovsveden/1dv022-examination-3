const pokeAppTemplate = document.createElement('template')
pokeAppTemplate.innerHTML = `
<style>
:host {
  width: 100%;
  height: 100%;
  background-color: white;
  font-family: Verdana, sans-serif;
  background-color: white;
  color: #000000;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}
#searchDiv {
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}
#searchDiv input {
  width: 80%;
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
#searchDiv button {
  width: 80%;
  background-color: lightseagreen;
  color: white;
  padding: 14px 20px;
  border: none;
  cursor: pointer;
}
#pokeDiv {
  width: 100%;
  height: 70%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#pokeDivTopLeft {
  width: 50%;
  height: 30%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#pokeDivTopRight {
  width: 50%;
  height: 30%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
h4, h5 {
  margin: 0;
}
#pokeDesc {
  width: 94%;
  height: 70%;
  margin: 0 3%;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
<div id="searchDiv">
  <input type="text" id="searchbar" placeholder="Enter a Pokémons name or dex#">
  <button id="submitSearch">Search</button>
</div>
<div id="pokeDiv">
  <div id="pokeDivTopRight">
    <img id="pokeImg" src="#">
  </div>
  <div id="pokeDivTopLeft">
      <h4 id="pokeTitle"># -</h4>
      <h5 id="pokeType1">Type1: -</h5>
      <h5 id="pokeType2">Type2: -</h5>
  </div>
  <p id="pokeDesc">Description</p>
</div>
`

export default class PokeApp extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(pokeAppTemplate.content.cloneNode(true))

    this._searchDiv = this.shadowRoot.querySelector('#searchDiv')
    this._searchbar = this.shadowRoot.querySelector('#searchbar')
    this._submitSearch = this.shadowRoot.querySelector('#submitSearch')

    this._pokeDiv = this.shadowRoot.querySelector('#pokeDiv')
    this._img = this.shadowRoot.querySelector('#pokeImg')
    this._title = this.shadowRoot.querySelector('#pokeTitle')
    this._description = this.shadowRoot.querySelector('#pokeDesc')

    this._pokemonUrl = ''
    this._descUrl = ''
    this._input = ''
  }

  connectedCallback () {
    this._searchbar.focus()
    this._submitSearch.addEventListener('click', () => {
      if (/\S/.test(this._searchbar.value)) {
        this._pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this._searchbar.value}`
        this._descUrl = `https://pokeapi.co/api/v2/pokemon-species/${this._searchbar.value}`
        this._getPokemon()
        this._getDescription()
        this._searchbar.value = ''
      }
    })
    this._searchDiv.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        if (/\S/.test(this._searchbar.value)) {
          this._pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this._searchbar.value}`
          this._descUrl = `https://pokeapi.co/api/v2/pokemon-species/${this._searchbar.value}`
          this._getPokemon()
          this._getDescription()
          this._searchbar.value = ''
        }
      }
    })
  }

  /**
   *  Gets information on a Pokémon from the server based of the given input.
   *
   * @returns a response from the server.
   * @memberof PokeApp
   */
  async _getPokemon () {
    const response = await window.fetch(this._pokemonUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
      .then((data) => {
        console.log(data)
        const order = ['Primary', 'Secondary']
        const types = this.shadowRoot.querySelectorAll('h5')
        const secondary = types[1]
        if (data.types.length === 1) {
          secondary.innerText = 'Secondary: -'
        }
        for (let i = 0; i < data.types.length; i++) {
          types[i].innerText = `${order[i]}: ${data.types[i].type.name}`
        }

        this._descUrl = `https://pokeapi.co/api/v2/pokemon-species/${data.id}`
        this._title.innerText = `#${data.id} ${data.name}`
        this._img.src = data.sprites.front_default
      }).catch((error) => {
        console.error('There has been a problem with your fetch operation:', error)
      })
  }

  /**
   * Gets the description of the given Pokémon.
   *
   * @returns a response from the server.
   * @memberof PokeApp
   */
  async _getDescription () {
    const response = await window.fetch(this._descUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
      .then((data) => {
        const allTextEntries = data.flavor_text_entries
        const englishTextEntries = []
        allTextEntries.forEach((i) => {
          if (i.language.name === 'en') {
            englishTextEntries.push(i)
          }
        })
      }).catch((error) => {
        console.error('There has been a problem with your fetch operation:', error)
      })
  }
}

window.customElements.define('poke-app', PokeApp)
