<template>
<div class="container">
    <div class="row">
        <div class="col-12">
            <div class="my-3 alert alert-danger">Co se hrálo {{ formatted_date }}</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <h2>Celostátní stanice</h2>
            <radio-station v-for="station in nationwideStations" v-bind:key="station.id" v-bind:name="station.name" v-bind:slug="station.slug" v-bind:datetime="datetime" /> 
        </div>
        <div class="col-md-6">
            <h2>Regionální stanice</h2>
            <radio-station v-for="station in regionalStations" v-bind:key="station.id" v-bind:name="station.name" v-bind:slug="station.slug" v-bind:datetime="datetime" />  
        </div>        
    </div>
</div>    
</template>

<style scoped>
</style>

<script>
import PlaylistStation from './PlaylistStation';

export default {
    name: 'DailyPlaylist',
    data: function() {
        return {
            nationwideStations: [
                {id: 0, slug: 'radiozurnal', name: 'Radiožurnál'},
                {id: 1, slug: 'dvojka', name: 'Dvojka'},
                {id: 2, slug: 'vltava', name: 'Vltava'},
                {id: 3, slug: 'plus', name: 'Plus'},
                {id: 4, slug: 'radiowave', name: 'Radio Wave'},
                {id: 5, slug: 'd-dur', name: 'D-dur'},
                {id: 6, slug: 'jazz', name: 'Jazz'},
                {id: 7, slug: 'radiojunior', name: 'Rádio Junior'},
                {id: 8, slug: 'archiv', name: 'Rádio Retro'},
                {id: 9, slug: 'cro7', name: 'Radio Prague Int.'}
            ],
            regionalStations: [
                {id: 10, slug: 'brno', name: 'Brno'},
                {id: 11, slug: 'cb', name: 'České Budějovice'},
                {id: 12, slug: 'hradec', name: 'Hradec Králové'},
                {id: 13, slug: 'kv', name: 'Karlovy Vary'},
                {id: 14, slug: 'liberec', name: 'Liberec'},
                {id: 15, slug: 'olomouc', name: 'Olomouc'},
                {id: 16, slug: 'ostrava', name: 'Ostrava'},
                {id: 17, slug: 'pardubice', name: 'Pardubice'},
                {id: 18, slug: 'plzen', name: 'Plzeň'},
                {id: 19, slug: 'regina', name: 'Rádio DAB Praha'},
                {id: 20, slug: 'strednicechy', name: 'Region'},
                {id: 21, slug: 'sever', name: 'Sever'},
                {id: 22, slug: 'vysocina', name: 'Vysočina'},
                {id: 23, slug: 'zlin', name: 'Zlín'}
            ],
            station_detail: '',
            api_url: '',
            formatted_date: ''

        }
    },
    components: {
        'radio-station': PlaylistStation
    },
    mounted() {
        this.formatted_date = this.datetime.getDate() + '. ' + (this.datetime.getMonth() + 1) + '. ' + this.datetime.getFullYear();
    },
    props: {
        type: String,
        datetime: Date
    },
    watch: {
        datetime: function () {
            this.formatted_date = this.datetime.getDate() + '. ' + (this.datetime.getMonth() + 1) + '. ' + this.datetime.getFullYear();
        }
    }
}
</script>