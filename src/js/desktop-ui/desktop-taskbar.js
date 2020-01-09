const desktopTaskbarTemplate = document.createElement('template')
desktopTaskbarTemplate.innerHTML = `
<style>
#desktopTaskbar {
    bottom: 0;
    left: 0;
    position: fixed;
    width: 100%;
    background-color: rgba(255,255,255,0.5);
}

#desktopTaskbar img {
    width: 50px;
}
</style>
<div id="desktopTaskbar">
      <img id="chatApp" src="./image/chat.svg" alt="chat bubble">
      <img id="memoryGame" src="./image/grid.svg" alt="grid">
  </div>
`

export default class DesktopTaskbar extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopTaskbarTemplate.content.cloneNode(true))

    this._desktopTaskbar = this.shadowRoot.querySelector('#desktopTaskbar')
  }

  connectedCallback () {

  }
}

window.customElements.define('desktop-taskbar', DesktopTaskbar)
