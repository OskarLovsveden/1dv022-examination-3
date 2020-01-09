const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
:host {
    position: absolute;
    left: 0;
    top: 0;
}
#desktopWindow {
    display: inline-block;
    border: solid black 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: grey;
}
</style>
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

    this.mousePosition = {}
    this.offset = [0, 0]
    this.isDown = false
  }

  connectedCallback () {
    const newTop = document.createElement('top-window')
    this._desktopWindow.appendChild(newTop)

    const newChat = document.createElement('chat-app')
    this._desktopWindow.appendChild(newChat)

    // const newGame = document.createElement('game-unknown')
    // this._desktopWindow.appendChild(newGame)

    this.addEventListener('mousedown', function (e) {
      this.isDown = true
      this.offset = [
        this.offsetLeft - e.clientX,
        this.offsetTop - e.clientY
      ]
    }, true)

    document.addEventListener('mouseup', () => {
      this.isDown = false
    }, true)

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
}

window.customElements.define('desktop-window', DesktopWindow)
