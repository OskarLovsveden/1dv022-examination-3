const topWindowTemplate = document.createElement('template')
topWindowTemplate.innerHTML = `
<style>
#topWindow {
    display: block;
    min-width: 200px;
}

#topWindow img {
    width: 30px;
    margin-left: 5px;
    margin-top: 5px;
}
</style>
<div id="topWindow">
      <img src="../image/x.png" alt="close window">
</div>
`

export class TopWindow extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(topWindowTemplate.content.cloneNode(true))

    this._topWindow = this.shadowRoot.querySelector('#topWindow')
  }
}

window.customElements.define('top-window', TopWindow)
