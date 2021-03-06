import { gameTemplate, tileTemplate } from './memory-game-template.js'
import { fisherYatesShuffle, getFact } from './utils.js'

/**
 *  A Class representing a game of Memory
 *
 * @export
 * @class Memory
 * @extends {window.HTMLElement}
 */
export default class MemoryGame extends window.HTMLElement {
  /**
   *Creates an instance of MemoryGame.
   *
   * @memberof MemoryGame
   */
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })

    this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true))

    this._optionsDiv = this.shadowRoot.querySelector('#optionsDiv')
    this._gamediv = this.shadowRoot.querySelector('#gamediv')

    this._rows = null
    this._cols = null
    this._tiles = []
    this._turn1 = null
    this._turn2 = null
    this._lastTile = null
    this._currentImg = null
    this._tries = 0
    this._pairs = 0
    this._index = 0
    this._tileLimit = 0
    this._winCondition = 0
  }

  /**
   * Adds event listener click for starting/resetting game or turning gametiles.
   * Adds event listener keydown for moving between tiles.
   */
  connectedCallback () {
    this._optionsDiv.addEventListener('click', event => {
      this._tiles = []
      this._turn1 = null
      this._turn2 = null
      this._lastTile = null
      this._tries = 0
      this._pairs = 0
      this._index = 0
      this._tileLimit = 0

      if (event.target.nodeName === 'BUTTON') {
        this._rows = parseInt(event.target.getAttribute('data-rows'))
        this._cols = parseInt(event.target.getAttribute('data-cols'))
        this._tiles = this._getPictureArray()
        this._winCondition = (this._rows * this._cols) / 2
        this._renderGame()
      }
    })

    this._gamediv.addEventListener('click', event => {
      event.preventDefault()

      let imgReference = null

      if (event.target.nodeName === 'IMG') {
        imgReference = event.target
      } else {
        return
      }
      this._index = parseInt(imgReference.getAttribute('data-tilenumber'))
      this._turnTile(this._tiles[this._index], imgReference)
      event.target.parentNode.focus()
    })

    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code - Inspiration
    this._gamediv.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) {
        return
      }

      switch (event.code) {
        case 'KeyS':
        case 'ArrowDown':
          this._arrowDown(this._index)
          break
        case 'KeyW':
        case 'ArrowUp':
          this._arrowUp(this._index)
          break
        case 'KeyA':
        case 'ArrowLeft':
          this._arrowLeft(this._index)
          break
        case 'KeyD':
        case 'ArrowRight':
          this._arrowRight(this._index)
          break
        case 'Enter' :
          if (event.target.firstElementChild.classList.contains('removed')) {
            break
          }
          this._turnTile(this._tiles[this._index], event.target.firstElementChild)
          break
      }
      event.preventDefault()
    }, true)
  }

  /**
   * Renders the game with the current number of rows and cols.
   *
   * @memberof MemoryGame
   */
  _renderGame () {
    this._gamediv.textContent = ''
    this.shadowRoot.querySelector('#tries').textContent = `Number of tries: ${this._tries}`

    this._tiles.forEach((tile, index) => {
      const img = tileTemplate.content.cloneNode(true)
      this._gamediv.appendChild(img)

      const listOfImg = this._gamediv.getElementsByTagName('img')
      this._currentImg = listOfImg[index]

      this._currentImg.setAttribute('data-tilenumber', index)

      if ((index + 1) % this._cols === 0) {
        this._gamediv.appendChild(document.createElement('br'))
      }
    })

    this._tileLimit = this._gamediv.getElementsByTagName('a').length - 1
    this._gamediv.getElementsByTagName('a')[0].focus()
  }

  /**
   * Method for when arrow down, or S is pressed on the keyboard.
   *
   * @param {number} index of the current tile in focus.
   * @memberof MemoryGame
   */
  _arrowDown (index) {
    const nextTile = index + this._cols
    if (nextTile <= this._tileLimit) {
      this._gamediv.getElementsByTagName('a')[nextTile].focus()
    } else {
      return
    }
    this._index = nextTile
  }

  /**
   * Method for when arrow up, or W is pressed on the keyboard.
   *
   * @param {number} index of the current tile in focus.
   * @memberof MemoryGame
   */
  _arrowUp (index) {
    const nextTile = index - this._cols
    if (nextTile >= 0) {
      this._gamediv.getElementsByTagName('a')[nextTile].focus()
    } else {
      return
    }
    this._index = nextTile
  }

  /**
   * Method for when arrow left, or A is pressed on the keyboard.
   *
   * @param {number} index of the current tile in focus.
   * @memberof MemoryGame
   */
  _arrowLeft (index) {
    const nextTile = index - 1
    if (nextTile >= 0) {
      this._gamediv.getElementsByTagName('a')[nextTile].focus()
    } else {
      return
    }
    this._index = nextTile
  }

  /**
   * Method for when arrow right, or D is pressed on the keyboard.
   *
   * @param {number} index of the current tile in focus.
   * @memberof MemoryGame
   */
  _arrowRight (index) {
    const nextTile = index + 1
    if (nextTile <= this._tileLimit) {
      this._gamediv.getElementsByTagName('a')[nextTile].focus()
    } else {
      return
    }
    this._index = nextTile
  }

  /**
   * Method for turning a tile.
   *
   * @param {number} - Index of an array of tiles.
   * @param {HTMLImageElement} - The current tile's reference to an image.
   * @memberof MemoryGame
   */
  _turnTile (tile, img) {
    if (this._turn2) {
      return
    }

    img.src = '../../image/memory-game/' + tile + '.png'

    if (!this._turn1) {
      this._turn1 = img
      this._lastTile = tile
    } else {
      if (img === this._turn1) {
        return
      }

      this._tries += 1
      this.shadowRoot.querySelector('#tries').textContent = `Number of tries: ${this._tries}`

      this._turn2 = img
      if (tile === this._lastTile) {
        this._pairs += 1
        if (this._pairs === this._winCondition) {
          getFact(this._tries, this.printData.bind(this))
        }
        this._pair(300)
      } else {
        this._noPair(1000)
      }
    }
  }

  /**
   * Method handling two tiles matching.
   *
   * @param {number} - Timelimit for the setTimeout.
   * @memberof MemoryGame
   */
  _pair (time) {
    setTimeout(() => {
      this._turn1.classList.add('removed')
      this._turn2.classList.add('removed')

      this._turn1 = null
      this._turn2 = null
    }, time)
  }

  /**
   * Method handling two tiles not matching.
   *
   * @param {number} - Timelimit for the setTimeout.
   * @memberof MemoryGame
   */
  _noPair (time) {
    setTimeout(() => {
      this._turn1.src = '../../image/memory-game/0.png'
      this._turn2.src = '../../image/memory-game/0.png'

      this._turn1 = null
      this._turn2 = null
    }, time)
  }

  /**
   * Creates and returns a shuffled array
   * Based of rows * columns of the game with each number adding twice.
   *
   * @returns A shuffled array.
   * @memberof MemoryGame
   */
  _getPictureArray () {
    const arr = []

    for (let i = 1; i <= (this._rows * this._cols) / 2; i++) {
      arr.push(i)
      arr.push(i)
    }

    fisherYatesShuffle(arr)
    return arr
  }

  /**
   * Takes an object as parameter and prints the data in the app.
   *
   * @param {Object} data - The data to print in the app.
   * @memberof MemoryGame
   */
  printData (data) {
    console.log(typeof data)
    const playAgain = document.createElement('h2')
    playAgain.innerText = 'Press a button above to play again!'

    const fact = document.createElement('h3')
    fact.innerText = data.text

    this._gamediv.textContent = ''
    this._gamediv.appendChild(playAgain)
    this._gamediv.appendChild(fact)
  }
}

window.customElements.define('memory-game', MemoryGame)
