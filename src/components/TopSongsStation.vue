<template>
    <div>
        <h4 v-on:click="isHidden = !isHidden; loadingSeen = !loadingSeen; loadTopSongs()" class="sticky-top">{{ name }}</h4>
        <div v-if="loadingSeen" class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <p v-if="!isHidden">
        <span v-if="!songList.length && !loadingSeen">Nebyly nalezeny žádné písničky</span>
            
            <ol class="list-group list-group-flush">
                <li class="list-group-item" v-bind:key="song.song_id" v-for="song in songList">{{song.artist_name}} - {{song.song_name}}; <strong>{{ song.count }}×</strong></li>
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
    name: 'TopSongsStation',
    data: function () {
        return {
            isHidden: true,
            loadingSeen: false,
            songList: [],
        }
    },
    methods: {
        
        loadTopSongs: async function() {
            let ajaxPromise = this.dateRange.map((date) => {
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
                    this.$db.playlist_history.where(["station", "time"]).between([this.slug, from], [this.slug, to], true, true).toArray().then((pl_history) => {
                        var res = pl_history.reduce(function(obj, v) {
                            obj[v.song_id] = (obj[v.song_id] || 0) + 1;
                            return obj;
                        }, {});
                        let topList = [];
                        for (const id in res) {
                            topList.push({song_id: parseInt(id), count: res[id]});
                        }
                        topList = _.orderBy(topList, "count", "desc" );
                        topList = topList.slice(0,50);
                        
                        topList = _.orderBy(topList, "count", "desc" );
                        let keyArray = [];      
                        topList.forEach((item) => {
                            keyArray.push(item.song_id);
                        });
                                
                        this.$db.song_list.bulkGet(keyArray).then((song_arr) => {
                            var merged = _.merge(_.keyBy(topList, 'song_id'), _.keyBy(song_arr, 'song_id'));
                            this.loadingSeen = false;
                            this.songList = _.orderBy(merged, "count", "desc");
                        });
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