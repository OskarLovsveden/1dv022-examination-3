const chatAppTemplate = document.createElement('template')
chatAppTemplate.innerHTML = `
<style>
:host {
  font-family: Verdana, sans-serif;
  color: #000000;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}
#chatDiv {
  text-align: center;
  width: 100%;
  height: 100%;
}
#messages {
  width: 100%;
  height: 70%;
  background-color: white;
  overflow: auto;
  display: inline-block;
}
#messageSend {
  width: 100%;
  height: 30%;
  text-align: center;
  display: inline-block;
}
#messageSend textarea {
  width: 95%;
  height: 55%;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none;
}
#messageSend button {
  background-color: lightseagreen;
  color: white;
  padding: 14px 20px;
  border: none;
  cursor: pointer;
  width: 95%;
}
#messageSend button:hover {
  opacity: 0.8#
}
#usernameDiv {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
}
#usernameDiv input {
  width: 80%;
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
#usernameDiv button {
  background-color: lightseagreen;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 80%;
}
#usernameDiv button:hover {
  opacity: 0.8#
}
.hidden {
  display: none !important;
}
</style>
<div id="chatDiv">
  <div id="messages">
  </div>
  <div id="messageSend">
    <textarea id="messageArea"></textarea>
    <button>Send</button>
  </div>
  <div id="usernameDiv">
    <input id="usernameInput" type="text" placeholder="Enter username">
    <button>Enter Chat</button>
  </div>
</div>
`

const messageTemplate = document.createElement('template')
messageTemplate.innerHTML = `
<style>
.message {
  margin: 1%;
  text-align: left;
}
.author {
  font-size: 1em;
  margin: 0
}
.text {
  display: inline-block;
  padding: 3%;
  border-radius: 15px;
  background-color: lightblue;
  margin: 0;
  overflow-wrap: break-word;
}
</style>
<div class="message">
    <p class="author"></p>
    <p class="text"></p>
</div>
`

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

  connectedCallback () {
    this._chatDiv.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        if (this._usernameInput.value) {
          this._submitUsername()
        }
        if (this._messageArea.value) {
          this._sendMessage(this._messageArea.value)
          this._messageArea.value = ''
        }
        event.preventDefault()
      }
    })

    this._chatDiv.addEventListener('click', (event) => {
      if (event.target.nodeName === 'BUTTON') {
        if (this._usernameInput.value) {
          this._submitUsername()
        }
        if (this._messageArea.value) {
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

  _setUsername () {
    const chatUser = {
      chatUser: this._username
    }
    window.localStorage.setItem('chatUser', JSON.stringify(chatUser))
  }

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
      console.log('Something went wrong', error)
    })
  }

  /**
   * Prints a message in the DOM.
   *
   * @param {string} message - The message to be sent
   * @memberof ChatApp
   */
  _printMessage (message) {
    const messageDiv = messageTemplate.content.cloneNode(true)

    messageDiv.querySelector('.author').textContent = `${message.username}:`
    messageDiv.querySelector('.text').textContent = message.data

    this._chatDiv.querySelector('#messages').appendChild(messageDiv)
  }
}

window.customElements.define('chat-app', ChatApp)
