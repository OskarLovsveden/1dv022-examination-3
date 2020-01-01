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
</style>
<div id="chatApp">
    <div class="chat">
        <div class="messages">
        </div>
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
  }
}

window.customElements.define('chat-app', ChatApp)
