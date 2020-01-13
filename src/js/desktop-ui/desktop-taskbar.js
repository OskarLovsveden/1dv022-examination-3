const desktopTaskbarTemplate = document.createElement('template')
desktopTaskbarTemplate.innerHTML = `
<style>
:host {
    font-family: Verdana, sans-serif;
    color: #000000;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
  }
#desktopTaskbar {
    bottom: 0;
    left: 0;
    position: fixed;
    width: 100%;
    background-color: rgba(255,255,255,0.5);
}

#desktopTaskbar img {
  width: 50px;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: .3s ease-in-out;
  transition: .3s ease-in-out;
}
#desktopTaskbar img:hover {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}
</style>
<div id="desktopTaskbar">
      <img id="chat-app" src="./image/chat.svg" alt="chat bubble">
      <img id="memory-game" src="./image/grid.svg" alt="grid">
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
    this._desktopTaskbar.addEventListener('click', (event) => {
      if (event.target.nodeName === 'IMG') {
        this.dispatchEvent(new window.CustomEvent('iconclicked', {
          detail: {
            name: event.target.id,
            src: event.target.src
          }
        }))
      }
    })
  }
}

window.customElements.define('desktop-taskbar', DesktopTaskbar)
