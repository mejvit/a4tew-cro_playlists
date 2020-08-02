<template>
  <div id="app">
    <header>
    
    <div class="row">
    <div class="col-12 d-flex justify-content-center py-1 bg-dark text-white-50">
        <router-link to="/">Úvodní stránka</router-link>
            <span></span>
        </div>
    </div>
  </header>
    <nav>
      <ul>
        <li><router-link to="/playlists"><img src="./assets/playlists.png" alt="" /><span>Playlisty</span></router-link></li>
        <li><router-link to="/top-songs"><img src="./assets/star.png" alt="" /><span>Nejhranější písničky</span></router-link></li>
        <li><router-link to="/top-artists"><img src="./assets/microphone.png" alt="" /><span>Nejhranější interpreti</span></router-link></li>
      </ul>
    </nav>
    <router-view/>
  
  </div>
</template>

<style>
h2 {
  text-align: center;
}
nav {
  width: 100%;

}

nav ul {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0;
  padding: 0;
}

nav ul li {
  padding: 16px 0 16px 0;
  text-align: center;
  list-style-type: none;
  display: block;
  width: 33.333%;
  min-height: 100px;
  transition: transform 0.3s;
  z-index: 5;
}

nav ul li:hover {
  transform: scale(1.1);
  transition: transform 0.3s;
  z-index: 6;
}
nav ul li:nth-child(1) {
  background-color: #cd3020;
}

nav ul li:nth-child(2) {
  background-color: #dbbf00;
}

nav ul li:nth-child(3) {
  background-color: #189140;
}
nav ul li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
}

nav ul li a:hover {
  
  text-decoration: none;
  color: #fff;
}
nav ul li img {
  height: 50px;
}

nav ul li span {
  display: block;
  text-transform: uppercase;
}

header a {
  color: #fff;
  font-size: 0.8em;
  font-weight: bold;
}

header a:hover {
  color: #fff;
  text-decoration: underline;
}
</style>
