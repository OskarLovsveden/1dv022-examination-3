const desktopUiTemplate = document.createElement('template')
desktopUiTemplate.innerHTML = `
<div id="desktop">
</div>
`

export class DesktopUI extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopUiTemplate.content.cloneNode(true))

    this._desktopUI = this.shadowRoot.querySelector('#desktop')
  }
}

window.customElements.define('desktop-ui', DesktopUI)
