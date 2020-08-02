<template>
<div>
    <div class="container">
        <h2 class="my-3">Vyberte rozsah dat</h2>
        <div class="row">
            <div class="col-md-4 offset-md-4">                
                <v-date-picker 
                    v-model="myDate"
                    :available-dates='{ end: new Date() }'
                    mode="range"
                    color="yellow"
                />
            </div>
        </div>
        <div class="my-3 alert alert-warning">Nejhranější písničky od {{ myDate.start | date_cz_format}} do {{ myDate.end | date_cz_format}}</div>
    </div>
    <div class="container">
    <div class="row">
        <div class="col-sm-6">
            <h2>Celostátní stanice</h2>
            <top-songs-station v-for="station in nationwideStations" :dateRange="dateRange" v-bind:key="station.id" v-bind:name="station.name" v-bind:slug="station.slug" :dateFrom="myDate.start" :dateTo="myDate.end"  /> 
        </div>
        <div class="col-sm-6">
            <h2>Regionální stanice</h2>
            <top-songs-station v-for="station in regionalStations" :dateRange="dateRange" v-bind:key="station.id" v-bind:name="station.name" v-bind:slug="station.slug" :dateFrom="myDate.start" :dateTo="myDate.end"/>  
        </div> 
        
    </div>
    </div>
</div>    
</template>

<script>
import TopSongsStation from '@/components/TopSongsStation.vue'

export default {
    name: 'TopSongs',
    components: {
        'top-songs-station': TopSongsStation
    },
  data () {
    return {
      date: null,
      myDate: {
          start: new Date(new Date().setDate(new Date().getDate()-8)),
          end: new Date(new Date().setDate(new Date().getDate()-1))
      },
      cojavim: "ahoj",
      dateRange: [],
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
    }
  },
  filters: {
      date_cz_format(date) {
          return date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
      }
  },
  mounted() {
    var dt;
    for(this.dateRange=[],dt=new Date(this.myDate.start); dt<=this.myDate.end; dt.setDate(dt.getDate()+1)){
        this.dateRange.push(new Date(dt));
    }
  },
  watch: {
    myDate: function() {
        var dt;
        for(this.dateRange=[],dt=new Date(this.myDate.start); dt<=this.myDate.end; dt.setDate(dt.getDate()+1)){
            this.dateRange.push(new Date(dt));
        }
    }
  },
}
</script>