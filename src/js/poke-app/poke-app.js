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
}
#pokeDivTop {
  width: 100%;
  height: 30%;
}
#pokeDesc {
  width: 100%;
  height: 70%;
  margin: 0;
}
</style>
<div id="searchDiv">
  <input type="text" id="searchbar" placeholder="Enter a Pokémons name or dex#">
  <button id="submitSearch">Search</button>
</div>
<div id="pokeDiv">
  <div id="pokeDivTop">
    <img id="pokeImg" src="#">
    <h3 id="pokeTitle"># -</h3>
    <h4 id="pokeType">Type: -</h4>
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
    this._title = this.shadowRoot.querySelector('#pokeTitle')
    this._type = this.shadowRoot.querySelector('#pokeType')
    this._description = this.shadowRoot.querySelector('#pokeDesc')

    this._pokemonUrl = ''
    this._input = ''
  }

  connectedCallback () {
    this._submitSearch.addEventListener('click', () => {
      if (/\S/.test(this._searchbar.value)) {
        this._pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this._searchbar.value}`
        this._getPokemon()
      }
    })
    this._searchDiv.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        if (/\S/.test(this._searchbar.value)) {
          this._pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this._searchbar.value}`
          this._getPokemon()
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
    console.log(this._pokemonUrl)
    const response = await window.fetch(this._pokemonUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
      .then((myJson) => {
        console.log(myJson)
      }).catch((error) => {
        console.error('There has been a problem with your fetch operation:', error)
      })
  }
}

window.customElements.define('poke-app', PokeApp)
