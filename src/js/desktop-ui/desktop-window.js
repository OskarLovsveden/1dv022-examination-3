const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
:host {
  min-height: 410px;
  min-width: 300px;
  position: absolute;
  background-color: #f5f5f5;
  border: 2px solid lightgrey;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  font-family: Verdana, sans-serif;
  color: #000000;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}
:host(:focus) {
  outline: none;
}
header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(125, 125, 125, 0.1);
}
header img {
  width: 45px;
  height: 45px;
  margin: 0;
  padding: 0;
}
header p:hover {
  cursor: default;
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
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: .3s ease-in-out;
  transition: .3s ease-in-out;
}
#closeBtn:hover {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
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
    this._closeBtn = this.shadowRoot.querySelector('#closeBtn')

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
      if (event.target === this._closeBtn) {
        return
      }
      this.isDown = true
      this.offset = [
        this.offsetLeft - event.clientX,
        this.offsetTop - event.clientY
      ]
    })

    this._headerWindow.addEventListener('mouseup', () => {
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
    })

    this._closeBtn.addEventListener('click', () => {
      this.parentNode.removeChild(this)
    })
  }

  static get observedAttributes () {
    return ['name', 'src', 'id']
  }

  attributeChangedCallback (attributes, oldValue, newValue) {
    switch (attributes) {
      case 'name':
        this._name = newValue
        this._appName.innerText = newValue
        break
      case 'src':
        this._appIcon.setAttribute('src', newValue)
        break
      case 'id':
        this.style.left = (this.id * 10) + 'px'
        this.style.top = (this.id * 10) + 'px'
        break
    }
  }
}

window.customElements.define('desktop-window', DesktopWindow)
