import { chatAppTemplate, messageTemplate } from './chat-app-template.js'

/**
 * Custom element for a chat application.
 *
 * @export
 * @class ChatApp
 * @extends {window.HTMLElement}
 */
export default class ChatApp extends window.HTMLElement {
  /**
   * Creates an instance of ChatApp.
   * @memberof ChatApp
   */
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })
    this.shadowRoot.appendChild(chatAppTemplate.content.cloneNode(true))

    // Main div
    this._chatDiv = this.shadowRoot.querySelector('#chatDiv')
    this._messagesDiv = this.shadowRoot.querySelector('#messages')

    // Send message
    this._sendMessageDiv = this.shadowRoot.querySelector('#messageSend')
    this._messageArea = this.shadowRoot.querySelector('#messageArea')

    // Username/channel
    this._usernameDiv = this.shadowRoot.querySelector('#usernameDiv')
    this._usernameInput = this.shadowRoot.querySelector('#usernameInput')

    this._socket = null
    this._address = 'ws://vhost3.lnu.se:20080/socket/'
    this._key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    this._username = ''
    this._channel = ''
  }

  /** Adds event listeners for click and keypress(enter) to submit username or the message. */
  connectedCallback () {
    this._chatDiv.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        if (/\S/.test(this._usernameInput.value)) {
          this._submitUsername()
        }
        if (/\S/.test(this._messageArea.value)) {
          this._sendMessage(this._messageArea.value)
          this._messageArea.value = ''
        }
        event.preventDefault()
      }
    })

    this._chatDiv.addEventListener('click', (event) => {
      if (event.target.nodeName === 'BUTTON') {
        if (/\S/.test(this._usernameInput.value)) {
          this._submitUsername()
        }
        if (/\S/.test(this._messageArea.value)) {
          this._sendMessage(this._messageArea.value)
          this._messageArea.value = ''
        }
      }
    })
    this._getUsername()
  }

  /**
   * Submits the given username to the chat application.
   *
   * @memberof ChatApp
   */
  _submitUsername () {
    this._username = this._usernameInput.value
    this._usernameInput.value = ''
    this._usernameInput.disabled = true

    this._usernameDiv.classList.add('hidden')

    this._setUsername()
    this._connect()
  }

  /**
   * If the user provided a username, it is set to localstorage.
   *
   * @memberof ChatApp
   */
  _setUsername () {
    const chatUser = {
      chatUser: this._username
    }
    window.localStorage.setItem('chatUser', JSON.stringify(chatUser))
  }

  /**
   * If localstorage has a username saved, this is used for the application.
   *
   * @memberof ChatApp
   */
  _getUsername () {
    if (window.localStorage.key('chatUser')) {
      const data = JSON.parse(window.localStorage.getItem('chatUser'))
      this._username = data.chatUser
      this._usernameInput.disabled = true
      this._usernameDiv.classList.add('hidden')
      this._connect()
    }
  }

  /**
   * Scrolls the overflow of an element to the bottom.
   *
   * @param {HTMLElement} element - The element to be scrolled down.
   * @memberof ChatApp
   */
  _scrollDown (element) {
    element.scrollTop = element.scrollHeight
  }

  /**
   * Connects to chat application.
   *
   * @returns a resolved or rejected Promise.
   * @memberof ChatApp
   */
  _connect () {
    return new Promise((resolve, reject) => {
      if (this._socket && this._socket.readyState === 1) {
        resolve(this._socket)
        return
      }

      this._socket = new window.WebSocket(this._address)

      this._socket.addEventListener('open', () => {
        resolve(this._socket)
      })

      this._socket.addEventListener('error', () => {
        reject(new Error('Could not connect'))
      })

      this._socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'message') {
          const date = new Date()
          const hour = `0${date.getHours()}`.slice(-2)
          const minute = `0${date.getMinutes()}`.slice(-2)
          const timeStamp = `${hour}:${minute}`
          message.time = timeStamp
          this._printMessage(message)
        }
      })
    })
  }

  /**
   * Sends message to the chat application. Connects to chat if not connected.
   *
   * @param {string} text - The text of a message
   * @memberof ChatApp
   */
  _sendMessage (text) {
    const data = {
      type: 'message',
      data: text,
      username: this._username,
      channel: this._channel,
      key: this._key
    }

    this._connect().then((socket) => {
      socket.send(JSON.stringify(data))
    }).catch((error) => {
      console.error('Something went wrong', error)
    })
  }

  /**
   * Prints a message in the DOM.
   *
   * @param {string} message - The message to be sent
   * @memberof ChatApp
   */
  _printMessage (message) {
    const newMessage = messageTemplate.content.cloneNode(true)

    newMessage.querySelector('.author').textContent = `${message.username}:`
    newMessage.querySelector('.text').textContent = message.data
    newMessage.querySelector('.time').textContent = message.time

    this._messagesDiv.appendChild(newMessage)
    this._scrollDown(this._messagesDiv)
  }
}

window.customElements.define('chat-app', ChatApp)
