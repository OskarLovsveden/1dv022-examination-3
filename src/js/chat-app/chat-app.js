const chatAppTemplate = document.createElement('template')
chatAppTemplate.innerHTML = `
<style>
#chatDiv {
    display: block;
}
.chat {

}
.messages {

}
.messageArea {

}
</style>
<div id="chatDiv">
    <div class="messages">
    </div>
    <textarea class="messageArea"></textarea>
</div>
`

const messageTemplate = document.createElement('template')
messageTemplate.innerHTML = `
<style>
#message {
    display: block;
}
.text {

}
.author {

}
</style>
<div id="message">
    <p class="text"></p>
    <p class="author"></p>
</div>
`

export default class ChatApp extends window.HTMLElement {
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

  _sendMessage (text) {
    const data = {
      type: 'message',
      data: text,
      username: 'Ogge',
      channel: '',
      key: this._key
    }

    this._connect().then((socket) => {
      socket.send(JSON.stringify(data))
      console.log('sending message...', text)
    }).catch((error) => {
      console.log('Something went wrong', error)
    })
  }

  _printMessage (message) {
    const messageDiv = messageTemplate.content.cloneNode(true)

    messageDiv.querySelector('.text').textContent = message.data
    messageDiv.querySelector('.author').textContent = message.username

    this._chatDiv.querySelector('.messages').appendChild(messageDiv)
  }
}

window.customElements.define('chat-app', ChatApp)
