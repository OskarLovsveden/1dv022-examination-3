const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
:host {
  position: absolute;
  left: 0;
  top: 0;
  min-height: 410px;
  max-height: 410px;
  min-width: 300px;
  max-width: 300px;
  background-color: #f5f5f5;
  border: 2px solid lightgrey;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
header {
  width: 100%;
  height: 40px;
}
header img {
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
}
#desktopWindow {
  height: 370px;
}
</style>
<header id="headerWindow">
<img id="closeWindow" src="./image/x.svg" alt="An X">
</header>
<div id="desktopWindow">
</div>
`

export default class DesktopWindow extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopWindowTemplate.content.cloneNode(true))

    this._desktopWindow = this.shadowRoot.querySelector('#desktopWindow')
    this._headerWindow = this.shadowRoot.querySelector('#headerWindow')

    this.mousePosition = {}
    this.offset = [0, 0]
    this.isDown = false
  }

  connectedCallback () {
    // const newTop = document.createElement('top-window')
    // this._desktopWindow.appendChild(newTop)

    const newChat = document.createElement('chat-app')
    this._desktopWindow.appendChild(newChat)

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

    this._headerWindow.addEventListener('mousemove', (event) => {
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
}

window.customElements.define('desktop-window', DesktopWindow)
