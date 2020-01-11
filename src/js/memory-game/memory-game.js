// Template for the "game-window" within memory-game.
const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<style>
  #triesDiv {
    text-align: center;
  }
  #gamediv {
    /* width: 100%;
    height: 60%; */
    text-align: center
  }
  #gamediv img {
    width: 65px;
  }
  a {
    border-radius: 3%;
  }
  a:focus {
    background-color: green;
    outline: none;
  }
</style>
<div id="triesDiv">
  <h3 id="tries">
    Number of tries: 0
  </h3>
</div>
<div id="gamediv">
</div>
`

// Template for the tiles.
const tileTemplate = document.createElement('template')
tileTemplate.innerHTML = `
<a href="#"><img src="../../image/memory-game/0.png" alt="A memory tile" /></a>
`

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

    this.rows = 4
    this.cols = 4
    this._tiles = this._getPictureArray()
    this._gamediv = this.shadowRoot.querySelector('#gamediv')
    this._turn1 = null
    this._turn2 = null
    this._lastTile = null
    this._currentImg = null
    this._tries = 0
    this._pairs = 0
    this._index = 0

    this._tiles.forEach((tile, index) => {
      const img = tileTemplate.content.cloneNode(true)
      this._gamediv.appendChild(img)

      const listOfImg = this._gamediv.getElementsByTagName('img')
      this._currentImg = listOfImg[index]

      this._currentImg.setAttribute('data-tilenumber', index)

      if ((index + 1) % this.cols === 0) {
        this._gamediv.appendChild(document.createElement('br'))
      }
    })

    this._tileLimit = this._gamediv.getElementsByTagName('a').length - 1
  }

  /**
   * Method for when arrow down, or S is pressed on the keyboard.
   *
   * @param {number} index of the current tile in focus.
   * @memberof MemoryGame
   */
  _arrowDown (index) {
    const nextTile = index + this.cols
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
    const nextTile = index - this.cols
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
        if (this._pairs === (this.cols * this.rows) / 2) {
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
      this._turn1.style.visibility = 'hidden'
      this._turn2.style.visibility = 'hidden'

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

    for (let i = 1; i <= (this.rows * this.cols) / 2; i++) {
      arr.push(i)
      arr.push(i)
    }

    this.fisherYatesShuffle(arr)
    return arr
  }

  /**
   * Takes an array of numbers and returns it shuffled.
   *
   * @param {[Array]} - An array of numbers.
   * @returns A the passed array shuffled.
   * @memberof MemoryGame
   */
  fisherYatesShuffle (array) {
    let m = array.length

    while (m) {
      const i = Math.floor(Math.random() * m--)

      const t = array[m]
      array[m] = array[i]
      array[i] = t
    }

    return array
  }

  connectedCallback () {
    this._gamediv.getElementsByTagName('a')[0].focus()

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
        return // Do nothing if event already handled
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
          this._turnTile(this._tiles[this._index], event.target.firstElementChild)
          break
      }
      // Consume the event so it doesn't get handled twice
      event.preventDefault()
    }, true)
  }

  disconnectedCallback () {
    this._gamediv.addEventListener('click')
    this._gamediv.addEventListener('keydown')
  }
}

window.customElements.define('memory-game', MemoryGame)
