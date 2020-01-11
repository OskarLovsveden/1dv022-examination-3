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
    const newTaskbar = document.createElement('desktop-taskbar')

    newTaskbar.addEventListener('iconclicked', (event) => {
      const newWindow = document.createElement('desktop-window')

      newWindow.setAttribute('name', event.detail.name)
      newWindow.setAttribute('src', event.detail.src)

      this._desktopUI.appendChild(newWindow)
    })

    this._desktopUI.appendChild(newTaskbar)
  }
}

window.customElements.define('desktop-ui', DesktopUI)
