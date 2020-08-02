import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Playlists from '../views/Playlists.vue'
import TopArtists from '../views/TopArtists.vue'
import TopSongs from '../views/TopSongs.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/playlists',
    name: 'Plalists',
    component: Playlists
  },
  {
    path: '/top-songs',
    name: 'TopSongs',
    component: TopSongs
  },
  {
    path: '/top-artists',
    name: 'TopArtists',
    component: TopArtists
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
