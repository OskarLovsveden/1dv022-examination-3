import { desktopTaskbarTemplate } from './desktop-template.js'

/**
 * Web-component for a desktop taskbar
 *
 * @export
 * @class DesktopTaskbar
 * @extends {window.HTMLElement}
 */
export default class DesktopTaskbar extends window.HTMLElement {
  /**
   * Creates an instance of DesktopTaskbars.
   * @memberof DesktopTaskbar
   */
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(desktopTaskbarTemplate.content.cloneNode(true))

    this._desktopTaskbar = this.shadowRoot.querySelector('#desktopTaskbar')
  }

  /** Adds event listeners for clicking an icon in the taskbar */
  connectedCallback () {
    this._desktopTaskbar.addEventListener('click', (event) => {
      if (event.target.nodeName === 'IMG') {
        this.dispatchEvent(new window.CustomEvent('iconclicked', {
          detail: {
            name: event.target.id,
            src: event.target.src
          }
        }))
      }
    })
  }
}

window.customElements.define('desktop-taskbar', DesktopTaskbar)
