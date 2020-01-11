const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
:host {
  min-height: 410px;
  min-width: 300px;
  /* max-height: 410px; */
  /* max-width: 300px; */
  position: absolute;
  left: 0;
  top: 0;
  background-color: #f5f5f5;
  border: 2px solid lightgrey;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10%;
  text-align: center;
  background-color: rgb(125, 125, 125, 0.1);
}
header img {
  width: 45px;
  height: 45px;
  margin: 0;
  padding: 0;
}
#contentWindow {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 90%;
}
#closeBtn {
  position: absolute;
  top: 0;
  left: 0;
}
#appIcon {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<header id="headerWindow">
<img id="closeBtn" src="./image/x.svg" alt="An X">
<p id="appName"></p>
<img id="appIcon" src="" alt="current app">
</header>
<div id="contentWindow">
</div>
`

export default class DesktopWindow extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopWindowTemplate.content.cloneNode(true))

    this._contentWindow = this.shadowRoot.querySelector('#contentWindow')
    this._headerWindow = this.shadowRoot.querySelector('#headerWindow')
    this._appName = this.shadowRoot.querySelector('#appName')
    this._appIcon = this.shadowRoot.querySelector('#appIcon')

    this._name = ''

    this.mousePosition = {}
    this.offset = [0, 0]
    this.isDown = false
  }

  connectedCallback () {
    const newApp = document.createElement(this._name)
    this._contentWindow.appendChild(newApp)

    this._headerWindow.addEventListener('mousedown', (event) => {
      this.isDown = true
      this.offset = [
        this.offsetLeft - event.clientX,
        this.offsetTop - event.clientY
      ]
    })

    this._headerWindow.addEventListener('mouseup', (event) => {
      this.isDown = false
    })

    document.addEventListener('mousemove', (event) => {
      event.preventDefault()
      if (this.isDown) {
        this.mousePosition = {

          x: event.clientX,
          y: event.clientY

        }
        this.style.left = (this.mousePosition.x + this.offset[0]) + 'px'
        this.style.top = (this.mousePosition.y + this.offset[1]) + 'px'
      }
    }, true)
  }

  static get observedAttributes () {
    return ['name', 'src']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'name':
        this._name = newValue
        this._appName.innerText = newValue
        break
      case 'src':
        this._appIcon.setAttribute('src', newValue)
        break
    }
  }
}

window.customElements.define('desktop-window', DesktopWindow)
