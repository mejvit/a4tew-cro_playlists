import _ from 'lodash'
export default {
    data: function () {
        return {
            stations: ['radiozurnal', 'dvojka', 'vltava',  'plus', 'radiowave', 'd-dur', 'jazz', 'radiojunior', 'archiv', 'cro7', 'brno', 'cb', 'hradec', 'kv', 'liberec', 'olomouc', 'ostrava', 'pardubice', 'plzen', 'regina', 'strednicechy', 'sever', 'vysocina', 'zlin']
        }
    },
    methods: {
        /**
         * Overuje v LocalStorage pritomnost playlistu v DB pro danou stanici a den
         * @param {Date} date Datum, pro ktere se overuje
         * @param {string} station Nazev stanice
         */
        hasLocalStorageRecord: function (date, station) {
            let savedPlaylists = localStorage.getItem('savedPlaylists');

            if ( savedPlaylists != null ) {
                savedPlaylists = JSON.parse(savedPlaylists);
                if ( savedPlaylists[date] != null && savedPlaylists[date].includes(station) ) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Ziska z API playlist pro dany den a stanici 
         * @param {Date} date Datum, pro ktere chceme nacist playlist
         * @param {string} station Nazev stanice
         */
        getPlaylistFromApi: async function (date, station) {
            try {
                date = new Date(date);
                let playlist_day = date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2);
                let url = 'https://api.rozhlas.cz/data/v2/playlist/day/' + playlist_day + '/'+ station + '.json';
                let response = await this.$http.get(url);
                let output_obj = [];
                response.data.data.forEach(item => {
                    let since_obj = new Date(item.since);
                    output_obj.push({
                        station: station,
                        time: since_obj,
                        song_id: item.track_id,
                        song_name: item.track,
                        artist_id: item.interpret_id,
                        artist_name: item.interpret
                    });
                });
                return output_obj;
            }
            catch(err) {
                console.log(err);
            }
        },

        /**
         * Ziska z IndexedDB playlist pro dany den a stanici 
         * @param {Date} date Datum, pro ktere chceme nacist playlist
         * @param {string} station Nazev stanice
         */
        getPlaylistFromDb: async function ( station, dateFrom, dateTo = dateFrom) {
            let from = new Date(dateFrom);
            let to = new Date(dateTo);

            from.setHours(0,0,0,0);
            to.setHours(23,59,59,999);

            var db_playlist = await this.$db.playlist_history.where(["station", "time"]).between([station, from], [station, to], true, true).toArray();
            if ( Array.isArray(db_playlist) && db_playlist.length ) {
                let keyArray = [];
                db_playlist.forEach((item) => {
                    keyArray.push(item.song_id);
                });
                let songArray = await this.$db.song_list.bulkGet(keyArray);
                var result =  _.map(db_playlist, function(obj) {
                    return _.assign(obj, _.find(songArray, {song_id: obj.song_id}));
                });
                return result;
            }
            else {
                return [];
            }
        },

        /**
         * Vytvori do LocalStorage zaznam o ulozeni playlistu v IndexedDB
         * @param {Date} date Datum, pro ktere chceme vytvorit zaznam
         * @param {string} station Nazev stanice
         */
        makeLocalStorageRecord: function(date, station) {
            let savedPlaylists = localStorage.getItem('savedPlaylists');

            if ( savedPlaylists != null ) {
                savedPlaylists = JSON.parse(savedPlaylists);
                if(savedPlaylists[date] != null) {
                    savedPlaylists[date].push(station);
                }
                else {
                    savedPlaylists[date] = [station];
                }
            }
            else {
                savedPlaylists = {};
                savedPlaylists[date] = [station];
            }
            localStorage.setItem('savedPlaylists', JSON.stringify(savedPlaylists));
        },

        /**
         * Ulozi pole objektu do db
         * @param {Collection} playlist 
         */
        savePlaylistToDb: async function(playlist) {
            try {
                let toSave_playlist_history = [];
                let toSave_song_list = [];

                playlist.forEach((item) => {
                    if(item != undefined) {
                        toSave_playlist_history.push({
                            time: item.time,
                            station: item.station,
                            song_id: item.song_id
                        });
                        toSave_song_list.push({
                            song_id: item.song_id,
                            song_name: item.song_name,
                            artist_id: item.artist_id,
                            artist_name: item.artist_name
                        });
    
                    }
                });
                await this.$db.playlist_history.bulkPut(toSave_playlist_history);
                await this.$db.song_list.bulkPut(toSave_song_list);
            }
            catch(err) {
                console.log(err);
            }
        }
    }
}