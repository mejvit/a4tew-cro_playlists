<template>
    <div>
        <h4 v-on:click="isHidden = !isHidden; loadingSeen = !loadingSeen; loadTopArtists()" class="sticky-top">{{ name }}</h4>
        <div v-if="loadingSeen" class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <p v-if="!isHidden">
            <span v-if="!artistList.length && !loadingSeen">Nebyly nalezeny žádné písničky</span>
            
            <ol class="list-group list-group-flush">
                <li class="list-group-item" v-bind:key="artist.artist_id" v-for="artist in artistList">{{artist.artist_name}} <strong>{{ artist.count }}×</strong></li>
            </ol>
        </p>
    </div>
</template>

<style scoped>
    h4 {
        font-weight: normal;
        padding: 8px 0 8px 0;
        z-index: 6;
        background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 70%, transparent);
    }
    h4:hover {
        cursor: pointer;
        background: #eaeaea;
    }
</style>

<script>
import _ from 'lodash'
import playlistHandling from '../mixins/playlistHandling'

export default {
    name: 'TopArtistsStation',
    data: function () {
        return {
            isHidden: true,
            loadingSeen: false,
            artistList: [],
        }
    },
    methods: {
        
        loadTopArtists: async function() {
            let ajaxPromise = this.dateRange.map((date) => {
            // return the promise to array
                if ( !(this.hasLocalStorageRecord(date, this.slug)) ) {
                    this.makeLocalStorageRecord(date, this.slug);
                    return this.getPlaylistFromApi(date, this.slug); 
                }
            });

            Promise.all(ajaxPromise).then((resultsArray) => {
                var merged = [].concat.apply([], resultsArray); 

                this.savePlaylistToDb(merged).then(() => {
                    let from = this.dateFrom;
                    let to = this.dateTo;
                    to.setHours(23,59,59,999);
                    this.getPlaylistFromDb(this.slug, from, to).then((playlist) => {
                        var res = playlist.reduce(function(obj, v) {
                            obj[v.artist_id] = (obj[v.artist_id] || 0) + 1;
                            return obj;
                        }, {});

                        let topList = [];

                        for (const id in res) {
                            topList.push({artist_id: parseInt(id), count: res[id]});
                        }
                        topList = _.orderBy(topList, "count", "desc" );
                        topList = topList.slice(0,50);
                        let keyArray = [];
                        
                        topList = _.orderBy(topList, "count", "desc" );
                        topList.forEach((item) => {
                            keyArray.push(item.artist_id);
                        });
                       
                        this.$db.song_list.where("artist_id").anyOf(keyArray).toArray().then((artist_arr) => {
                            artist_arr = _.uniqBy(artist_arr, "artist_id");
                            _.merge(_.keyBy(topList, 'artist_id'), _.keyBy(artist_arr, 'artist_id'));
                            this.artistList = topList;
                        });

                        this.loadingSeen = false;
                        this.playlist = playlist;
                   });
                    
                });
            });
        }      
    },    
    mixins: [playlistHandling],
    props: {
        name: String,
        slug: String,
        dateRange: Array,
        dateFrom: Date,
        dateTo: Date
    },
    watch: {
        dateRange: function () {
            this.isHidden = true;
            this.songList = [];
        }
    }
}
</script>