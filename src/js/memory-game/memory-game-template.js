const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<style>
  :host {
    font-family: Verdana, sans-serif;
    color: #000000;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
  }
  #optionsDiv {
    padding-top: 10px;
    text-align: center;
  }
  #optionsDiv button {
    background-color: lightseagreen;
    color: white;
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    cursor: pointer;
  }
  #optionsDiv button:hover {
    opacity: 0.8;
  }
  #triesDiv {
    text-align: center;
  }
  #triesDiv h4 {
    margin-top: 3%;
    margin-bottom: 3%;
  }
  #gamediv {
    text-align: center
  }
  #gamediv img {
    width: 65px;
  }
  a {
    border-radius: 3%;
  }
  a:focus {
    background-color: lightseagreen;
    outline: none;
  }
  .removed {
    visibility: hidden;
  }
</style>
<div id="optionsDiv">
  <button data-rows="2" data-cols="2" id="twoTwo">2 x 2</button>
  <button data-rows="2" data-cols="4" id="twoFour">2 x 4</button>
  <button data-rows="4" data-cols="4" id="fourFour">4 x 4</button>
</div>
<div id="triesDiv">
  <h4 id="tries">
    Number of tries: 0
  </h4>
</div>
<div id="gamediv">
</div>
`

const tileTemplate = document.createElement('template')
tileTemplate.innerHTML = `
<a href="#"><img src="../../image/memory-game/0.png" alt="A memory tile" /></a>
`

export { gameTemplate, tileTemplate }
