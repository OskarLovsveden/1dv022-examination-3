const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
    #desktop-window {
    display: inline-block;
    border: solid black 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: whitesmoke;
}
</style>
<div id="desktopWindow">
</div>
`

export class DesktopWindow extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopWindowTemplate.content.cloneNode(true))

    this._desktopWindow = this.shadowRoot.querySelector('#desktopWindow')
  }
}

window.customElements.define('desktop-window', DesktopWindow)
