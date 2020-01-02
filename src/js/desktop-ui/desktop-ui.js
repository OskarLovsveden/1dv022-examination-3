const desktopUiTemplate = document.createElement('template')
desktopUiTemplate.innerHTML = `
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
  }

  connectedCallback () {
    const newWindow = document.createElement('desktop-window')
    this._desktopUI.appendChild(newWindow)

    const newWindow1 = document.createElement('desktop-window')
    this._desktopUI.appendChild(newWindow1)

    const newTaskbar = document.createElement('desktop-taskbar')
    this._desktopUI.appendChild(newTaskbar)
  }
}

window.customElements.define('desktop-ui', DesktopUI)
