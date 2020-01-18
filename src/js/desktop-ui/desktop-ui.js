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

    this.shadowRoot.addEventListener('click', (event) => {
      if (event.target.nodeName === 'DESKTOP-WINDOW') {
        const windows = this.shadowRoot.querySelectorAll('desktop-window')
        for (let i = 0; i < windows.length; i++) {
          windows[i].style.zIndex = '0'
        }
        event.target.style.zIndex = '1'

        const index = this._windowOrder.indexOf(parseInt(event.target.id))
        const copy = this._windowOrder[index]
        this._windowOrder.splice(index, 1)
        this._windowOrder.splice(0, 0, copy)
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
      newWindow.setAttribute('name', event.detail.name)
      newWindow.setAttribute('src', event.detail.src)
      newWindow.tabIndex = -1
      newWindow.id = this._windowCounter
      this._windowOrder.push(this._windowCounter)

      this._desktopUI.appendChild(newWindow)

      this._windowCounter++
    })
    this._desktopUI.appendChild(newTaskbar)
  }
}

window.customElements.define('desktop-ui', DesktopUI)
