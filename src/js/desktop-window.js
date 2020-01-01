const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
#desktopWindow {
    display: inline-block;
    border: solid black 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: grey;
}
</style>
<div id="desktopWindow">
</div>
`

export default class DesktopWindow extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopWindowTemplate.content.cloneNode(true))

    this._desktopWindow = this.shadowRoot.querySelector('#desktopWindow')
  }

  connectedCallback () {
    const newTop = document.createElement('top-window')
    this._desktopWindow.appendChild(newTop)

    const newGame = document.createElement('game-unknown')
    this._desktopWindow.appendChild(newGame)
  }
}

window.customElements.define('desktop-window', DesktopWindow)
