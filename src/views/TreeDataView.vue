<template>
  <div>
    <h2>{{ title }}</h2>

    <v-container class="bg-surface-variant" fluid>
      <v-row no-gutters>

        <!-- <v-col cols="12" sm="2">
        </v-col>

        <v-col cols="12" sm="10">
          <h3>
            Visualization
          </h3>
        </v-col> -->

      </v-row>
      <v-row no-gutters>

        <v-col cols="12" sm="2">
          <v-card class="ma-1" height="630">

            <v-dialog transition="dialog-bottom-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" class="ma-2" v-bind="props">Code</v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar class="text-white" color="#000000" title="Code on this page"></v-toolbar>
                  <v-card-text>
                    <div class="text pa-12">
                      <pre><code> {{ codeSample }} </code></pre>                    </div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <br />

            <div style="text-align: left; margin-left: 4px">
              Buurt-code: {{ this.buurt.buurtcode }} <br />
              {{ this.buurt.buurtnaam }} <br />
              Wijk-code: {{ this.buurt.wijkcode }} <br />
              {{ this.buurt.wijknaam }} <br />
              Stadsdeel-code: {{ this.buurt.stadsdeelcode }} <br />
              {{ this.buurt.stadsdeelnaam }} <br />
              Tree Count: {{ this.treeCount }}
            </div>

            <div style="align-items: center;">

              <v-container class="bg-surface-variant">
                <v-row no-gutters v-for="n in 10" :key="n">
                  <v-col cols="12" sm="12">
                    <v-sheet class="" :color="this.colors[n]">
                      <div v-if="n==1" style="color: white">
                        Least
                      </div>    
                      <div v-if="n==10">
                        Most
                      </div>
                      {{ this.colors[n] }}
                    </v-sheet>
                  </v-col>
                </v-row> 
              </v-container>
            </div>

          </v-card>
        </v-col>




        <v-col cols="12" sm="10">
          <div ref="box">
            <v-sheet class="ma-2 pa-2">
              <div id="mapid">
              </div>
              <!-- <svg :width="this.width" height="600" class="container-border" preserveAspectRatio="none">
              </svg> -->
            </v-sheet>
          </div>
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>
  
<script>
import * as d3 from 'd3'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import colormap from "colormap"

let colors = colormap({
  colormap: 'chlorophyll',
  nshades: 176,
  format: 'hex',
  alpha: 1
})

// import buurten from '../../public/buurten.json'

function VanAreasMap(context, buurten) {
  console.log("D3")
  console.log(buurten)
  const path = d3.geoPath()

  const map = L
    .map('mapid')
    .setView([51.438972, 5.476493], 1);

  const osmLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 16,
    minZoom: 12,
  }).addTo(map);

  map.setMaxBounds(map.getBounds());
  //map.fitBounds(VanAreasLayer.getBounds()); 
  //
  //   let VanAreasLayer = L.geoJson(buurten.features, { //instantiates a new geoJson layer using built in geoJson handling
  //     weight: 2, //Attributes of polygons including the weight of boundaries and colors of map.
  //     color: "#432",
  //   }).bindPopup(function (Layer) { //binds a popup when clicking on each polygon to access underlying data
  //     return Layer.feature.properties.buurtnaam;
  //   }).addTo(map); //Adds the layer to the map.
  //
  //   var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  //     g = svg.append("g").attr("class", "leaflet-zoom-hide");
  // }

  L.svg({ clickable: true }).addTo(map)

  const overlay = d3.select(map.getPanes().overlayPane)
  const svg = overlay.select('svg').attr("pointer-events", "auto")
  const g = svg.append('g').attr('class', 'leaflet-zoom-hide')

  const projectPoint = function (x, y) {
    const point = map.latLngToLayerPoint(new L.LatLng(y, x))
    this.stream.point(point.x, point.y)
  }
  // Use d3's custom geo transform method to implement the above
  const projection = d3.geoTransform({ point: projectPoint })
  // creates geopath from projected points (SVG)
  const pathCreator = d3.geoPath().projection(projection)

  console.log("areasPATHS")

  const areaPaths = g.selectAll('path')
    .data(buurten.features)
    .join('path')
    .on("click", clicked)
    .attr("d", path)
    .attr("fill", function (d) {
      // console.log(d)
      console.log(d)
      // console.log(context.$store.getters.buurtBomen(d.properties.buurtnaam).length)
      const res = ((context.$store.getters.buurtBomen(d.properties.buurtnaam).length - 40) / (3400 - 40)) * 100
      console.log("res(" + d.properties.buurtnaam + "): " + res)

      return colors.at(res)
    })
    .attr('fill-opacity', 0.6)
    .attr('stroke', 'black')
    .attr("z-index", 3000)
    .attr('stroke-width', 2.5)
    .attr("style", "pointer-events: auto;")
    .on("mouseover", function (d) {
      console.log(d.target.__data__.properties)
      context.hover(d.target.__data__.properties)
      //console.log(d.target.__data__.properties)

      d3.select(this).attr("fill", "red")
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", function (d) {
        // console.log(d)
        console.log(d)
        // console.log(context.$store.getters.buurtBomen(d.properties.buurtnaam).length)
        const res = ((context.$store.getters.buurtBomen(d.properties.buurtnaam).length - 40) / (3400 - 40)) * 100
        console.log("res: " + res)

        return colors.at(res)
      })
    })

  // Function to place svg based on zoom
  const onZoom = () => areaPaths.attr('d', pathCreator)
  // initialize positioning
  onZoom()
  // reset whenever map is moved
  map.on('zoomend', onZoom)

  function clicked(event, d) {
    console.log(event)

    onZoom()
  }
}

function getColors(context){
  var res = []

  res.push(colors.at(1))
  res.push(colors.at(18))
  res.push(colors.at(36))
  res.push(colors.at(54))
  res.push(colors.at(72))
  res.push(colors.at(90))
  res.push(colors.at(115))
  res.push(colors.at(140))
  res.push(colors.at(158))
  res.push(colors.at(175))

  console.log("GETC")
  console.log(res)
  
  return res
}

export default {
  name: 'GraphView',
  data() {
    return {
      width: 800,
      title: 'Tree map',
      codeSample: `
      <template>
  <div>
    <h2>{{ title }}</h2>

    <v-container class="bg-surface-variant" fluid>
      <v-row no-gutters>

        <!-- <v-col cols="12" sm="2">
        </v-col>

        <v-col cols="12" sm="10">
          <h3>
            Visualization
          </h3>
        </v-col> -->

      </v-row>
      <v-row no-gutters>

        <v-col cols="12" sm="2">
          <v-card class="ma-1" height="630">

            <v-dialog transition="dialog-bottom-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" class="ma-2" v-bind="props">Code</v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar class="text-white" color="#000000" title="Code on this page"></v-toolbar>
                  <v-card-text>
                    <div class="text pa-12">
                      {{ codeSample }}
                    </div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <br />

            <div style="text-align: left; margin-left: 4px">
              Buurt-code: {{ this.buurt.buurtcode }} <br />
              {{ this.buurt.buurtnaam }} <br />
              Wijk-code: {{ this.buurt.wijkcode }} <br />
              {{ this.buurt.wijknaam }} <br />
              Stadsdeel-code: {{ this.buurt.stadsdeelcode }} <br />
              {{ this.buurt.stadsdeelnaam }} <br />
              Tree Count: {{ this.treeCount }}
            </div>

            <div style="align-items: center;">

              <v-container class="bg-surface-variant">
                <v-row no-gutters v-for="n in 10" :key="n">
                  <v-col cols="12" sm="12">
                    <v-sheet class="" :color="this.colors[n]">
                      <div v-if="n==1" style="color: white">
                        Least
                      </div>    
                      <div v-if="n==10">
                        Most
                      </div>
                      {{ this.colors[n] }}
                    </v-sheet>
                  </v-col>
                </v-row> 
              </v-container>
            </div>

          </v-card>
        </v-col>




        <v-col cols="12" sm="10">
          <div ref="box">
            <v-sheet class="ma-2 pa-2">
              <div id="mapid">
              </div>
              <!-- <svg :width="this.width" height="600" class="container-border" preserveAspectRatio="none">
              </svg> -->
            </v-sheet>
          </div>
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>
  

import * as d3 from 'd3'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import colormap from "colormap"

let colors = colormap({
  colormap: 'chlorophyll',
  nshades: 176,
  format: 'hex',
  alpha: 1
})

// import buurten from '../../public/buurten.json'

function VanAreasMap(context, buurten) {
  console.log("D3")
  console.log(buurten)
  const path = d3.geoPath()

  const map = L
    .map('mapid')
    .setView([51.438972, 5.476493], 1);

  const osmLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 16,
    minZoom: 12,
  }).addTo(map);

  map.setMaxBounds(map.getBounds());
  //map.fitBounds(VanAreasLayer.getBounds()); 
  //
  //   let VanAreasLayer = L.geoJson(buurten.features, { //instantiates a new geoJson layer using built in geoJson handling
  //     weight: 2, //Attributes of polygons including the weight of boundaries and colors of map.
  //     color: "#432",
  //   }).bindPopup(function (Layer) { //binds a popup when clicking on each polygon to access underlying data
  //     return Layer.feature.properties.buurtnaam;
  //   }).addTo(map); //Adds the layer to the map.
  //
  //   var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  //     g = svg.append("g").attr("class", "leaflet-zoom-hide");
  // }

  L.svg({ clickable: true }).addTo(map)

  const overlay = d3.select(map.getPanes().overlayPane)
  const svg = overlay.select('svg').attr("pointer-events", "auto")
  const g = svg.append('g').attr('class', 'leaflet-zoom-hide')

  const projectPoint = function (x, y) {
    const point = map.latLngToLayerPoint(new L.LatLng(y, x))
    this.stream.point(point.x, point.y)
  }
  // Use d3's custom geo transform method to implement the above
  const projection = d3.geoTransform({ point: projectPoint })
  // creates geopath from projected points (SVG)
  const pathCreator = d3.geoPath().projection(projection)

  console.log("areasPATHS")

  const areaPaths = g.selectAll('path')
    .data(buurten.features)
    .join('path')
    .on("click", clicked)
    .attr("d", path)
    .attr("fill", function (d) {
      // console.log(d)
      console.log(d)
      // console.log(context.$store.getters.buurtBomen(d.properties.buurtnaam).length)
      const res = ((context.$store.getters.buurtBomen(d.properties.buurtnaam).length - 40) / (3400 - 40)) * 100
      console.log("res(" + d.properties.buurtnaam + "): " + res)

      return colors.at(res)
    })
    .attr('fill-opacity', 0.6)
    .attr('stroke', 'black')
    .attr("z-index", 3000)
    .attr('stroke-width', 2.5)
    .attr("style", "pointer-events: auto;")
    .on("mouseover", function (d) {
      console.log(d.target.__data__.properties)
      context.hover(d.target.__data__.properties)
      //console.log(d.target.__data__.properties)

      d3.select(this).attr("fill", "red")
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", function (d) {
        // console.log(d)
        console.log(d)
        // console.log(context.$store.getters.buurtBomen(d.properties.buurtnaam).length)
        const res = ((context.$store.getters.buurtBomen(d.properties.buurtnaam).length - 40) / (3400 - 40)) * 100
        console.log("res: " + res)

        return colors.at(res)
      })
    })

  // Function to place svg based on zoom
  const onZoom = () => areaPaths.attr('d', pathCreator)
  // initialize positioning
  onZoom()
  // reset whenever map is moved
  map.on('zoomend', onZoom)

  function clicked(event, d) {
    console.log(event)

    onZoom()
  }
}

function getColors(context){
  var res = []

  res.push(colors.at(1))
  res.push(colors.at(18))
  res.push(colors.at(36))
  res.push(colors.at(54))
  res.push(colors.at(72))
  res.push(colors.at(90))
  res.push(colors.at(115))
  res.push(colors.at(140))
  res.push(colors.at(158))
  res.push(colors.at(175))

  console.log("GETC")
  console.log(res)
  
  return res
}

export default {
  name: 'GraphView',
  data() {
    return {
      width: 800,
      title: 'Tree map',
      codeSample: 'CODE',
      treeCount: 0,
      buurt: {
        buurtData: null,
        buurtcode: 334,
        buurtnaam: "Urkhoven",
        geo_point_2d: { lon: 5.53575370379062, lat: 51.43954314848161 },
        objectid: 7,
        shape_area: 1750602.06345603,
        shape_len: 7083.0582035937305,
        stadsdeelcode: 3,
        stadsdeelnaam: "Stadsdeel Tongelre",
        wijkcode: 33,
        wijknaam: "Wijk Oud-Tongelre",
      },
      colors: [],
    }
  },
  created() {
    window.addEventListener("resize", this.setBoxWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.setBoxWidth);
  },
  methods: {
    setBoxWidth() {
      try {
        this.width = this.$refs.box.clientWidth - 40; // Good enough
      }
      catch {
        this.width = 600
      }
    },
    hover(hoveredBuurt) {
      this.buurt = hoveredBuurt;
      this.treeCount = this.$store.getters.buurtBomen(hoveredBuurt.buurtnaam).length
      console.log("TEST")
    }
  },
  mounted() {
    this.setBoxWidth()

    console.log(this.$store.state.buurten)
    VanAreasMap(this, this.$store.state.buurten)
    this.colors = getColors(this)

  }
}
  
<style scoped>
code {
  text-align: left;
}

.leaflet-overlay-pane svg path {
  pointer-events: auto;
}

pre {
  background-color: #eee;
  border: 1px solid #999;
  display: block;
  padding: 20px;
  text-align: left;
}

svg {
  border: 1px solid rgba(0, 0, 255, 0.281);
}

#mapid {
  height: 600px;
}
</style>
      
      `,
      treeCount: 0,
      buurt: {
        buurtData: null,
        buurtcode: 334,
        buurtnaam: "Urkhoven",
        geo_point_2d: { lon: 5.53575370379062, lat: 51.43954314848161 },
        objectid: 7,
        shape_area: 1750602.06345603,
        shape_len: 7083.0582035937305,
        stadsdeelcode: 3,
        stadsdeelnaam: "Stadsdeel Tongelre",
        wijkcode: 33,
        wijknaam: "Wijk Oud-Tongelre",
      },
      colors: [],
    }
  },
  created() {
    window.addEventListener("resize", this.setBoxWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.setBoxWidth);
  },
  methods: {
    setBoxWidth() {
      try {
        this.width = this.$refs.box.clientWidth - 40; // Good enough
      }
      catch {
        this.width = 600
      }
    },
    hover(hoveredBuurt) {
      this.buurt = hoveredBuurt;
      this.treeCount = this.$store.getters.buurtBomen(hoveredBuurt.buurtnaam).length
      console.log("TEST")
    }
  },
  mounted() {
    this.setBoxWidth()

    console.log(this.$store.state.buurten)
    VanAreasMap(this, this.$store.state.buurten)
    this.colors = getColors(this)

  }
}
</script>
  
<style scoped>
code {
  text-align: left;
}

.leaflet-overlay-pane svg path {
  pointer-events: auto;
}

pre {
  background-color: #eee;
  border: 1px solid #999;
  display: block;
  padding: 20px;
  text-align: left;
}

svg {
  border: 1px solid rgba(0, 0, 255, 0.281);
}

#mapid {
  height: 600px;
}
</style>