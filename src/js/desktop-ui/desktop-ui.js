import { desktopUiTemplate } from './desktop-template.js'

/**
 * Web-component for a desktop UI
 *
 * @export
 * @class DesktopUI
 * @extends {window.HTMLElement}
 */
export default class DesktopUI extends window.HTMLElement {
  /**
   * Creates an instance of DesktopUI.
   * @memberof DesktopUI
   */
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopUiTemplate.content.cloneNode(true))

    this._windowOrder = []

    this.shadowRoot.addEventListener('mousedown', (event) => {
      if (event.target.nodeName === 'DESKTOP-WINDOW') {
        const index = this._windowOrder.indexOf(parseInt(event.target.id))
        const copy = this._windowOrder[index]
        this._windowOrder.splice(index, 1)
        this._windowOrder.splice(0, 0, copy)

        let counter = 0
        for (let i = this._windowOrder.length - 1; i >= 0; i--) {
          const windowID = this._windowOrder[i]
          const currWindow = this.shadowRoot.getElementById(windowID)
          currWindow.style.zIndex = counter
          counter++
        }
      }
    })

    this._desktopUI = this.shadowRoot.querySelector('#desktop')
    this._windowCounter = 0
  }

  /**
   * Creates and appends a taskbar to the UI.
   * Adds event listeners to the taskbar for iconclicked, determining what app to open.
  */
  connectedCallback () {
    const newTaskbar = document.createElement('desktop-taskbar')

    newTaskbar.addEventListener('iconclicked', (event) => {
      const newWindow = document.createElement('desktop-window')
      newWindow.addEventListener('closewindow', event => {
        const index = this._windowOrder.indexOf(parseInt(event.detail.id))
        this._windowOrder.splice(index, 1)
      })
      newWindow.setAttribute('name', event.detail.name)
      newWindow.setAttribute('src', event.detail.src)
      newWindow.tabIndex = -1

      if (this._windowOrder.length < this._windowCounter) {
        for (let i = 0; i < this._windowCounter; i++) {
          if (!this._windowOrder.includes(i)) {
            this._windowOrder.splice(0, 0, i)
            newWindow.id = i
            break
          }
        }
      } else {
        this._windowOrder.unshift(this._windowCounter)
        newWindow.id = this._windowCounter
        this._windowCounter++
      }

      newWindow.style.zIndex = this._windowOrder.length
      this._desktopUI.appendChild(newWindow)
    })
    this._desktopUI.appendChild(newTaskbar)
  }
}

window.customElements.define('desktop-ui', DesktopUI)
