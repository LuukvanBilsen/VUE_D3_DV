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
                  <v-toolbar color="primary" title="Opening from the bottom"></v-toolbar>
                  <v-card-text>
                    <div class="text-h2 pa-12">Hello world!</div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <br />

            Buurt-code: {{ this.buurtcode }} <br />
            Buurt-naam: {{ this.buurtnaam }} <br />
            Wijk-code: {{ this.wijkcode }} <br />
            Wijk-naam: {{ this.wijknaam }} <br />
            Stadsdeel-code: {{ this.stadsdeelcode }} <br />
            Stadsdeel-naam: {{ this.stadsdeelnaam }} <br />

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

// import buurten from '../../public/buurten.json'

function VanAreasMap(buurten) {
  const path = d3.geoPath()

  let map = L
    .map('mapid')
    .setView([51.438972, 5.476493], 1);

  let osmLayer = L.tileLayer(
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

  const areaPaths = g.selectAll('path')
    .data(buurten.features)
    .join('path')
    .on("click", clicked)
    .attr("d", path)
    .attr("fill", function (d) {
      if (d.properties.buurtcode > 450) {
        return "#ffa07a"
        console.log(d.properties.buurtcode)
      }
      if (d.properties.buurtcode > 350) {
        return "#FEE715"
        console.log(d.properties.buurtcode)
      }
      if (d.properties.buurtcode > 250) {
        return "#E6E6FA"
        console.log(d.properties.buurtcode)
      }
    })
    .attr('fill-opacity', 0.6)
    .attr('stroke', 'black')
    .attr("z-index", 3000)
    .attr('stroke-width', 2.5)
    .attr("style", "pointer-events: auto;")
    .on("mouseover", function (d) {
      this.buurtData = d.target.__data__.properties
      console.log("BuurtData" + this.buurtData)
      //console.log(d.target.__data__.properties)
      d3.select(this).attr("fill", "red")
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", "black")
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

export default {
  name: 'GraphView',
  data() {
    return {
      width: 800,
      title: 'Tree map',
      codeSample: `Lorem ipsum`,

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
    }
  },
  mounted() {
    this.setBoxWidth()

    VanAreasMap(this.$store.state.buurten)
    // const dummy_boom = [{
    //   "objectid": 994100,
    //   "boomnummer": 41507.0,
    //   "geovisia_id": "B11A92DF-8B54-488D-A034-E05D30FB98CB",
    //   "eigenaar": "BOR",
    //   "beheerder": "BOR Stedelijk",
    //   "boomsoort": "Fraxinus excelsior",
    //   "boomsoort_varieteit": "Onbekend",
    //   "boomsoort_nederlands": "Es",
    //   "eindbeeld": "TR3,0 m rondom",
    //   "hoogte": "12-15",
    //   "plantjaar": "1970",
    //   "status_ter_indicatie": "Waardevol",
    //   "boom_def_afwezig": "False",
    //   "plantwijze": "Wildverband",
    //   "boomrooster": "False",
    //   "verlichting": "False",
    //   "epr_aanwezig": null,
    //   "epr_preventief_inspecteren": null,
    //   "epr_bestrijdingsmethode": null,
    //   "epr_stadium": null,
    //   "epr_datum_constatering": null,
    //   "epr_risicoprofiel": null,
    //   "epr_datum_mech_bestreden": null,
    //   "epr_datum_1_bio_bestrijding": null,
    //   "epr_datum_2_bio_bestrijding": null,
    //   "nazorgboom": null,
    //   "projectnaam": null,
    //   "geo_shape": {
    //     "type": "Feature",
    //     "geometry": { "coordinates": [5.458675408131263, 51.41571809950286], "type": "Point" },
    //     "properties": {}
    //   },
    //   "geo_point_2d": { "lon": 5.458675408131263, "lat": 51.41571809950286 }
    // }]
    // ////

  }
}
</script>
  
<style scoped>
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