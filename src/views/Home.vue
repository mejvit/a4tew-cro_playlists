<template>
<div class="container">
  <div class="row">
    <div class="col-12 home">
      <h2 class="my-3" >Semestrální projekt: Playlisty Českého rozhlasu</h2>
      <p>
        Tato aplikace byla vytvořena v rámci semestrálního projektu z předmětu A4TEW. Podle zadání jsem zvolil možnost A,
         tj. "<strong>Klientská webová aplikace s&nbsp;REST API</strong>".
      </p>
      <h3>Funkcionalita</h3>
      <p>
        Aplikace pracuje s API pro získání playlistů, které poskytuje <a href="https://data.irozhlas.cz/opendata/">Český rozhlas</a>.
        Pomocí těchto API lze získat playlist dané stanice pro konkrétní datum a stanici.
        Aplikace samotná je rozdělena do tří částí: Plalisty, Nejhranější písničky a Nejhranější interpreti.
        V části <router-link to="/playlists"><strong>Playlisty</strong></router-link> je možné si zobrazit playlist pro konkrétní stanici a den. Druhá část, <router-link to="/top-songs"><strong>Nejhranější písničky</strong></router-link> umí vypsat 
        padesát nejhranějších skladeb za zvolené časové období na konkrétní stanici. Sekce <router-link to="/top-artists"><strong>Nejhranější interpreti</strong></router-link> pak zobrazí za zvolený časový úsek nejhranějšího interpreta pro danou stanici.
      </p>
      <h3>Technické řešení</h3>
      <p>
        Celá aplikace je tvořena s pomocí vývojového frameworku <a href="https://vuejs.org/">Vue.js</a>. Volání API se děje prostřednictvím modulu <a href="https://github.com/axios/axios">Axios</a>.
        Aby nedocházelo ke zbytečně častému volání API, ukládá aplikace data u klienta. Pro samotná data (playlisty) je využito zabudované uložiště v prohlížeči <strong>IndexedDB</strong>, záznamy o tom,
        který den a která stanice je uložena se vede v LocalStorage. S uložištěm IndexedDB se komunikuje pomocí knihovny <a href="https://dexie.org/">Dexie</a>.
        Ta poskytuje intuitivní API pro práci s databází oproti nativním funkcím. Záznamy v IndexedDB jsou rozděleny do dvou objektových uložišť. Prvním je <em>playlist_history</em>, které obsahuje záznam o čase, stanici a id písničky; 
        druhým je pak <em>song_list</em>, který slouží jako databáze písniček.</p><p>Žebříčky nehranějších skladeb a interpretů se pak sestavují pomocí dotazů na uložiště prostřednictvím knihovny Dexie.
      </p>
      <p>
        Pro vzhled aplikace jsem použil CSS framework <a href="https://getbootstrap.com/">Bootstrap</a> ve verzi 4, pro navigaci pak čisté CSS.
      </p>
    </div>
    <div class="col-12">
      <h2>Přehled uložených dní a stanic</h2>
      <ul>
        <li v-for="(stations, date) in history" :key="date"><strong>{{new Date(parseInt(date)) | date_cz_format}}</strong>: {{ (stations.map((station) => stationNames[station])).join(', ') }}</li>
      </ul>
      
    <button type="button" class="btn btn-danger center my-3 px-4" v-on:click="deleteHistory()">Vymazat historii</button>
    </div>
  </div>
</div>
  
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  data: function () {
    return {
      stationNames: {        
      'radiozurnal': 'Radiožurnál',
      'dvojka': 'Dvojka',
      'vltava': 'Vltava',
      'plus': 'Plus',
      'radiowave': 'Radio Wave',
      'd-dur': 'D-dur',
      'jazz': 'Jazz',
      'radiojunior': 'Rádio Junior',
      'archiv': 'Rádio Retro',
      'cro7': 'Radio Prague Int.',
      'brno': 'Brno',
      'cb': 'České Budějovice',
      'hradec': 'Hradec Králové',
      'kv': 'Karlovy Vary',
      'liberec': 'Liberec',
      'olomouc': 'Olomouc',
      'ostrava': 'Ostrava',
      'pardubice': 'Pardubice',
      'plzen': 'Plzeň',
      'regina': 'Rádio DAB Praha',
      'strednicechy': 'Region',
      'sever': 'Sever',
      'vysocina': 'Vysočina',
      'zlin': 'Zlín'
      },
      history: []
    }
  },
  
  filters: {
      date_cz_format(date) {
          return date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
      }
  },
  methods: {
    deleteHistory: function () {
           
      if(confirm("Opravdu chcete vymazat historii? Budete muset všechny playlisty stahovat znovu...")) {
        this.history = [];
        this.$db.delete().then(() => {localStorage.clear();
          window.location.reload();
        });
        
      }
    }
  },
  mounted() {
    let h = localStorage.getItem("savedPlaylists");
    if (h != null) {
      h = JSON.parse(h);
      const hist = {};
      for(const date in h) {
        hist[new Date(date).getTime()] = h[date];
      }
      const ordered_hist = {};
      Object.keys(hist).sort().forEach(function(key) {
        ordered_hist[key] = hist[key];
      });
      this.history = ordered_hist;

    }
  }
}
</script>
