import { desktopWindowTemplate } from './desktop-template.js'

/**
 * Web-component for a desktop window
 *
 * @export
 * @class DesktopWindow
 * @extends {window.HTMLElement}
 */
export default class DesktopWindow extends window.HTMLElement {
  /**
   * Creates an instance of DesktopWindow.
   * @memberof DesktopWindow
   */
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

  /**
   * Opens the application corresponding to this._name.
   * Adds event listener for mousedown, mouseup and mousemove to move the windows.
   * Adds event listener for click to close the windows.
   */
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
      this.dispatchEvent(new window.CustomEvent('closewindow', {
        detail: {
          id: this.id
        }
      }))
      this.parentNode.removeChild(this)
    })
  }

  /** Tells the web-component what attributes to watch for changes */
  static get observedAttributes () {
    return ['name', 'src', 'id']
  }

  /**
   * When an attribute is updated, check if the value is different
   *
   * @param {string} attributes - The attribute that changed
   * @param {string} oldValue - The old value
   * @param {string} newValue - The new value
   * @memberof DesktopWindow
   */
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
