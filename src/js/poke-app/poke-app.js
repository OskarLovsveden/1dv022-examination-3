import { pokeAppTemplate } from './poke-app-template.js'

/**
 * Web-component for a Pokémon database application.
 *
 * @export
 * @class PokeApp
 * @extends {window.HTMLElement}
 */
export default class PokeApp extends window.HTMLElement {
  /**
   * Creates an instance of PokeApp.
   * @memberof PokeApp
   */
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(pokeAppTemplate.content.cloneNode(true))

    this._searchForm = this.shadowRoot.querySelector('#searchForm')
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

  /**
   * Sets focus on the input for search
   * Adds event listeners for click and keypress(enter) to submit search.
   */
  connectedCallback () {
    this._searchbar.focus()
    this._submitSearch.addEventListener('click', () => {
      if (/\S/.test(this._searchbar.value)) {
        this._pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this._searchbar.value}`
        this._descUrl = `https://pokeapi.co/api/v2/pokemon-species/${this._searchbar.value}`
        this._getPokemon()
        this._getDescription()
      }
      this._searchbar.value = ''
      this._searchbar.focus()
    })
    this._searchForm.addEventListener('keypress', (event) => {
      if (!event.keyCode === 13) {
        if (/\S/.test(this._searchbar.value)) {
          this._pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this._searchbar.value}`
          this._descUrl = `https://pokeapi.co/api/v2/pokemon-species/${this._searchbar.value}`
          this._getPokemon()
          this._getDescription()
        }
        this._searchbar.value = ''
        this._searchbar.focus()
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
        if (!data.sprites.front_default) {
          this._img.src = '././image/ghost.svg'
        } else {
          this._img.src = data.sprites.front_default
        }
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
        const randomIndex = Math.floor(Math.random() * (englishTextEntries.length - 0)) + 0
        this._description.innerText = this.cleanStr(englishTextEntries[randomIndex].flavor_text)
      }).catch((error) => {
        console.error('There has been a problem with your fetch operation:', error)
      })
  }

  /**
   * "Cleans" a string to get rid of new lines.
   *
   * @param {String} str - The string to "clean"
   * @returns A string without newlines
   * @memberof PokeApp
   */
  cleanStr (str) {
    str.replace(/\n/g, '')
    return str
  }
}

window.customElements.define('poke-app', PokeApp)
