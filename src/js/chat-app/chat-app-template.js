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
::-webkit-scrollbar {
    width: 1em;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
}
::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
#messageSend {
  width: 100%;
  height: 30%;
  text-align: center;
  display: inline-block;
}
#messageSend textarea {
  width: 80%;
  height: 55%;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none;
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
.hidden {
  display: none !important;
}
</style>
<link rel="stylesheet" type="text/css" href="../css/style.css">
<div id="chatDiv">
  <div id="messages">
  </div>
  <div id="messageSend">
    <textarea id="messageArea"></textarea>
    <button class="bigBtn">Send</button>
  </div>
  <div id="usernameDiv">
    <input id="usernameInput" type="text" placeholder="Enter username">
    <button class="bigBtn">Enter Chat</button>
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
.messageBox {
  display: inline-block;
  padding: 3%;
  border-radius: 15px;
  background-color: lightblue;
}
.text {
  margin: 0;
  word-break: break-word;
}
.time {
  font-size: 70%;
  margin: 0;
}
</style>
<div class="message">
    <p class="author"></p>
    <div class="messageBox">
      <p class="text"></p>
      <p class="time"></p>
    </div>
</div>
`

export { chatAppTemplate, messageTemplate }
