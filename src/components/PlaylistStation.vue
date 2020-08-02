<template>
    <div>
        <h4 class="sticky-top" v-on:click="isHidden = !isHidden; loadingSeen = !loadingSeen; loadPlaylist()">{{ name }}</h4>
        <div v-if="loadingSeen" class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <p v-if="!isHidden">
        <span v-if="!playlist.length && !loadingSeen">Nebyly nalezeny žádné písničky</span>
        <table class="table table-striped">
            <tbody>
                <tr v-for="song in playlist" v-bind:key="song.song_id">
                    <td><time v-bind:time=" song.time | datetotime ">{{ song.time | datetotime }}</time></td>
                    <td>{{ song.artist_name }}</td>
                    <td>{{song.song_name}}</td>
                </tr>
            </tbody>
        </table>
        </p>
    </div>
</template>

<style scoped>
    h4 {
        font-weight: normal;
        padding: 8px 0 8px 0;
        z-index: 9;
        background-image: linear-gradient(to bottom, white 65%, transparent 99%);
    }
    h4:hover {
        cursor: pointer;
        background: #eaeaea;
    }
</style>

<script>
import playlistHandling from '../mixins/playlistHandling'

export default {
    name: 'PlaylistStation',
    data: function() {
        return {
            artist: '',
            playlist: Array(),
            isHidden: true,
            loadingSeen: false,
            playlist_day: '',
            pamet: ''
        }
    },
    filters: {
        datetotime (time) {
            return time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2)
        }
    },
    methods: {
        loadPlaylist: function () {            
            let from = new Date(this.datetime);
            let to = new Date(this.datetime);
            let today = new Date();

            today.setHours(0,0,0,0);
            from.setHours(0,0,0,0);
            to.setHours(23,59,59,999);

            if ( from.getTime() == today.getTime() ) {
                this.getPlaylistFromApi(from, this.slug).then((playlist) => {
                    this.loadingSeen = false;
                    this.playlist = playlist;
                });
            }
            else {
                if (this.hasLocalStorageRecord(from, this.slug)) {
                   this.getPlaylistFromDb( this.slug, from ).then((playlist) => {
                        this.loadingSeen = false;
                        this.playlist = playlist;
                   });
                }
                else {
                    this.getPlaylistFromApi(from, this.slug)
                    .then((playlist) => {
                        this.loadingSeen = false;
                        this.playlist = playlist;
                        return playlist;
                    })
                    .then((playlist) => {
                        this.savePlaylistToDb(playlist);
                        this.makeLocalStorageRecord(from, this.slug);
                    });
                }
            }
        }
    },
    mixins: [playlistHandling],
    props: {
        name: String,
        slug: String,
        datetime: Date
    },
    watch: {
        datetime: function () {
            this.playlist = [];
            this.isHidden = true;
            let dateObj = this.datetime;
            let day = ("0" + dateObj.getDate()).slice(-2);
            let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
            this.playlist_day = dateObj.getFullYear() + '/' + month + '/' + day;
        }
    },
    mounted() {
        this.playlist = [];
        if (localStorage.playlist) {
            this.pamet = localStorage.pokus;
        }
    }
    
}
</script>