import Vue from 'vue'
import VCalendar from 'v-calendar';
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import Dexie from 'dexie'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';


// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  'max-date': new Date(),
});


Vue.use(VueRouter)
Vue.prototype.$http = axios;

// Creating db instance
Vue.prototype.$db = new Dexie("cro_playlists");
Vue.prototype.$db.version(1).stores({
  playlist_history: '[time+station], time, station, song_id, [station+time]',
  song_list: 'song_id, song_name, artist_id, artist_name'
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
