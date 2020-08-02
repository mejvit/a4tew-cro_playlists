<template>
<div>
  <div class="container">
    <h2 class="my-3">Vyberte datum:</h2>
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <v-date-picker 
          v-model="datetime"
          :available-dates='{end: new Date() }'
          color="red"
          :theme-styles="themeStyles" />
      </div>

    </div>
    </div>
    <daily-playlist v-bind:datetime="datetime" />    
  </div>
</template>

<style scoped>
  .vc-popover-content-wrapper {
    z-index: 9999 !important;
  }
</style>

<script>
import DailyPlaylist from '@/components/DailyPlaylist.vue'

export default {
    name: 'Playlists',
    data: function() {
        return {
            datetime: new Date(),
            max_datetime: '',
            api_url: '',
            themeStyles: {
              wrapper: {
                'z-index': 9999,
                border: '10px solid gold'
              }
            }
        }
    },
    mounted() {
        this.datetime = new Date();
        this.max_datetime = this.datetime;
    },
    components: {
      'daily-playlist': DailyPlaylist
    }
}
</script>