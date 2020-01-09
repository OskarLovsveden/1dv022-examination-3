const chatAppTemplate = document.createElement('template')
chatAppTemplate.innerHTML = `
<style>
:host {
  }
#chatDiv {
  text-align: center;
  width: 100%;
  height: 100%;
}
#chatDiv p {
  font-family: Verdana, Geneva, sans-serif;
  color: #000000;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}
#chatDiv hr {
  border: 1px black solid;
  width: 90%;
  margin: 0 auto;
}
.messages {
  width: 100%;
  height: 75%;
  background-color: white;
  overflow: auto;
}
.messageSend {
  width: 100%;
  height: 20%;
  text-align: center;
  position: absolute;
  bottom: 0;
}
.messageArea {
  width: 90%;
  height: 60%;
  resize: none;
}
#messageButton {
  width: 90%;
}
</style>
<div id="chatDiv">
  <div class="messages">
  </div>
  <hr>
  <div class="messageSend">
    <textarea class="messageArea"></textarea>
    <button id="messageButton">Send</button>
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
}
.text {
  display: inline-block;
  padding: 3%;
  border-radius: 15px;
  background-color: blue;
  margin: auto 0;
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

    this._chatDiv = this.shadowRoot.querySelector('#chatDiv')

    this._socket = null
    this._address = 'ws://vhost3.lnu.se:20080/socket/'
    this._key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  }

  connectedCallback () {
    this._chatDiv.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        this._sendMessage(event.target.value)
        event.target.value = ''
        event.preventDefault()
      }
    })

    this._connect().then(() => {
      // this._sendMessage('yo')
    })
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
      username: 'oskar!',
      channel: 'test1',
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

    this._chatDiv.querySelector('.messages').appendChild(messageDiv)
  }
}

window.customElements.define('chat-app', ChatApp)
