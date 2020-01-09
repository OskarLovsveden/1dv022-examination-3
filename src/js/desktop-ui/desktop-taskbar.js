const desktopTaskbarTemplate = document.createElement('template')
desktopTaskbarTemplate.innerHTML = `
<style>
#desktopTaskbar {
    padding: 0;
    margin: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 55px;
    background-color: grey;
}

#desktopTaskbar img {
    width: 50px;
    margin: 5px;
}
</style>
<div id="desktopTaskbar">
      <img id="chatApp" src="./image/chat.png" alt="chat">
      <img src="./image/fruit.png" alt="fruit">
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
