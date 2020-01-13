const desktopUiTemplate = document.createElement('template')
desktopUiTemplate.innerHTML = `
<style>
:host {
    font-family: Verdana, sans-serif;
    color: #000000;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
  }
</style>
<div id="desktop">
</div>
`

export default class DesktopUI extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopUiTemplate.content.cloneNode(true))

    this._desktopUI = this.shadowRoot.querySelector('#desktop')

    this._windowCounter = 0
  }

  connectedCallback () {
    const newTaskbar = document.createElement('desktop-taskbar')

    newTaskbar.addEventListener('iconclicked', (event) => {
      const newWindow = document.createElement('desktop-window')
      newWindow.setAttribute('name', event.detail.name)
      newWindow.setAttribute('src', event.detail.src)
      newWindow.tabIndex = this._windowCounter
      this._desktopUI.appendChild(newWindow)

      this._windowCounter++
    })
    this._desktopUI.appendChild(newTaskbar)

    document.addEventListener('mousedown', (event) => {

    })
  }
}

window.customElements.define('desktop-ui', DesktopUI)
