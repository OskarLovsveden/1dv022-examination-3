const gameUnknownTemplate = document.createElement('template')
gameUnknownTemplate.innerHTML = `
<style>
#gameUnknown {
    display: block;
    height: 200px;
    width: 200px;
    background-color: blue;
}
</style>
<div id="gameUnknown">
</div>
`

export default class GameUnknown extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(gameUnknownTemplate.content.cloneNode(true))

    this._gameUnknown = this.shadowRoot.querySelector('#gameUnknown')
  }
}

window.customElements.define('game-unknown', GameUnknown)
