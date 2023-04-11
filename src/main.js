import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'



const vuetify = createVuetify({
    components,
    directives,
  })

createApp(App)
    .use(store)
    .use(router)
    .use(vuetify)
    .mount('#app')


// https://observablehq.com/@mbostock/walmarts-growth // Trees plant-year, maybe colour == species

// https://observablehq.com/@d3/hexbin-map // Amount in Buurt + median plant year
// https://observablehq.com/@d3/bubble-map // Alternative

// https://observablehq.com/@d3/seamless-zoomable-map-tiles // Zoom fix
// https://observablehq.com/@d3/smooth-zooming // Zoom fix 2
// https://observablehq.com/@d3/zoom-to-bounding-box //Zoom
// https://d3-graph-gallery.com/graph/density2d_hexbin.html