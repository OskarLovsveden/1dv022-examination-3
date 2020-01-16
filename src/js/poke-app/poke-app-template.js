const pokeAppTemplate = document.createElement('template')
pokeAppTemplate.innerHTML = `
<style>
:host {
  width: 100%;
  height: 100%;
  background-color: white;
  font-family: Verdana, sans-serif;
  background-color: white;
  color: #000000;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}
#searchForm {
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}
#searchForm input {
  width: 80%;
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
#searchForm button {
  width: 80%;
  background-color: lightseagreen;
  color: white;
  padding: 14px 20px;
  border: none;
  cursor: pointer;
}
#pokeDiv {
  width: 100%;
  height: 70%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#pokeDivTopLeft {
  width: 50%;
  height: 30%;
  position: absolute;
  top: 10%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#pokeDivTopRight {
  width: 50%;
  height: 30%;
  position: absolute;
  top: 10%;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
h4 {
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
h4, h5 {
  margin: 0;
}
#pokeDesc {
  width: 94%;
  height: 60%;
  margin: 0 3%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<form action="#" id="searchForm">
  <input type="text" id="searchbar" placeholder="Write here">
  <button id="submitSearch">Search</button>
</form>
<div id="pokeDiv">
  <h4 id="pokeTitle"></h4>
  <div id="pokeDivTopRight">
    <img id="pokeImg" src="././image/ghost.svg">
  </div>
  <div id="pokeDivTopLeft">
      <h5 id="pokeType1"></h5>
      <h5 id="pokeType2"></h5>
  </div>
  <p id="pokeDesc">Enter the name(lowercase only) or Pokédex number of a Pokémon. Only Pokémon 1 through 807 available.</p>
</div>
`

export { pokeAppTemplate }
