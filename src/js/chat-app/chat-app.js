const chatAppTemplate = document.createElement('template')
chatAppTemplate.innerHTML = `
<style>
#chatApp {
    display: block;
}
.chat {

}
.messages {

}
.messageArea {

}
</style>
<div id="chatApp">
    <div class="chat">
        <div class="messages">
        </div>
        <textarea class="messageArea"></textarea>
    </div>
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

    this._chatApp = this.shadowRoot.querySelector('#chatApp')
    this._chatApp.querySelector('.messages').appendChild(messageTemplate.content.cloneNode(true))

    this._socket = null
    this._address = 'ws://vhost3.lnu.se:20080/socket/'
    this._key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  }

  connectedCallback () {
    this._chatApp.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        this._sendMessage(event.target.value)
        event.target.value = ''
        event.preventDefault()
      }
    })

    this._connect().then((socket) => {
      this._sendMessage('yo')
    })
  }

  _connect () {
    return new Promise((resolve, reject) => {
      if (this._socket && this._socket.readyState === 1) {
        resolve(this._socket)
        return
      }

      try {
        this._socket = new window.WebSocket(this._address)
      } catch (error) {
        reject(error)
      }

      this._socket.addEventListener('open', () => {
        resolve(this._socket)
      })
    })
  }

  _sendMessage (text) {
    const data = {
      type: 'message',
      data: text,
      username: 'Username',
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

  _printMessage () {

  }
}

window.customElements.define('chat-app', ChatApp)
