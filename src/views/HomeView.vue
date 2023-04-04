<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <HelloWorld msg="Sources used for this project:" :links="this.links" />

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      links: [
        'https://github.com/d3/d3/wiki/Tutorials',
        'https://bost.ocks.org/mike/circles/',
        'https://observablehq.com/@d3/d3v6-migration-guide',
        'https://github.com/d3/d3/blob/main/CHANGES.md',
        'https://leafletjs.com/examples/quick-start/',
        'https://bost.ocks.org/mike/leaflet/',
      ]
    }
  }
}
</script>
