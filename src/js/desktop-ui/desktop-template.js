const desktopTaskbarTemplate = document.createElement('template')
desktopTaskbarTemplate.innerHTML = `
<style>
:host {
    font-family: Verdana, sans-serif;
    color: #000000;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
  }
#desktopTaskbar {
    bottom: 0;
    left: 0;
    position: fixed;
    width: 100%;
    background-color: rgba(255,255,255,0.5);
}

#desktopTaskbar img {
  width: 50px;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: .3s ease-in-out;
  transition: .3s ease-in-out;
}
#desktopTaskbar img:hover {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}
</style>
<div id="desktopTaskbar">
      <img id="chat-app" src="./image/chat.svg" alt="chat bubble">
      <img id="memory-game" src="./image/grid.svg" alt="grid">
      <img id="poke-app" src="./image/search.svg" alt="search">
  </div>
`

const desktopUiTemplate = document.createElement('template')
desktopUiTemplate.innerHTML = `
<style>
:host {
    font-family: Verdana, sans-serif;
    color: #000000;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
    overflow: hidden;
  }
</style>
<div id="desktop">
</div>
`

const desktopWindowTemplate = document.createElement('template')
desktopWindowTemplate.innerHTML = `
<style>
:host {
  min-height: 410px;
  min-width: 300px;
  position: absolute;
  background-color: #f5f5f5;
  border: 2px solid lightgrey;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  font-family: Verdana, sans-serif;
  color: #000000;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}
:host(:focus) {
  outline: none;
}
header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(125, 125, 125, 0.1);
}
header img {
  width: 45px;
  height: 45px;
  margin: 0;
  padding: 0;
}
header p:hover {
  cursor: default;
}
#contentWindow {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 90%;
}
#closeBtn {
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: .3s ease-in-out;
  transition: .3s ease-in-out;
}
#closeBtn:hover {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}
#appIcon {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<header id="headerWindow">
<img id="closeBtn" src="./image/x.svg" alt="An X">
<p id="appName"></p>
<img id="appIcon" src="" alt="current app">
</header>
<div id="contentWindow">
</div>
`

export { desktopUiTemplate, desktopTaskbarTemplate, desktopWindowTemplate }
