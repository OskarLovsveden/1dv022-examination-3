const gameUnknownTemplate = document.createElement('template')
gameUnknownTemplate.innerHTML = `
<style>
#gameUnknown {
    display: block;
}
</style>
<div id="gameUnknown">
</div>
`

export class GameUnknown extends window.HTMLElement {
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
