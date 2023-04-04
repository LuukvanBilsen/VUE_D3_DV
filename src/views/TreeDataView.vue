<template>
  <div>
    <h2>{{ title }}</h2>

    <v-container class="bg-surface-variant" fluid>
      <v-row no-gutters>
        <v-col cols="12" sm="4">
          <h3>
            Code
          </h3>
        </v-col>
        <v-col cols="12" sm="8">
          <h3>
            Visualization
          </h3>
        </v-col>

      </v-row>
      <v-row no-gutters>

        <v-col cols="12" sm="4">
          <v-card class="ma-1" style="overflow-y: scroll;" height="630">
            <pre><code> {{ codeSample }} </code></pre>
          </v-card>
        </v-col>

        <v-col cols="12" sm="8">
          <div ref="box">
            <v-sheet class="ma-2 pa-2">
              <div id="mapid">
                <!-- <svg :width="this.width" height="600" class="container-border" preserveAspectRatio="none">
                </svg> -->
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
// import bomen_data from '../../public/bomen.json'
import buurten_data from '../../public/buurten.json'

export default {
  name: 'GraphView',
  data() {
    return {
      width: 800,
      title: 'Tree map',
      codeSample: `Lorem ipsum`
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

    const dummy_boom = [{
      "objectid": 994100,
      "boomnummer": 41507.0,
      "geovisia_id": "B11A92DF-8B54-488D-A034-E05D30FB98CB",
      "eigenaar": "BOR",
      "beheerder": "BOR Stedelijk",
      "boomsoort": "Fraxinus excelsior",
      "boomsoort_varieteit": "Onbekend",
      "boomsoort_nederlands": "Es",
      "eindbeeld": "TR3,0 m rondom",
      "hoogte": "12-15",
      "plantjaar": "1970",
      "status_ter_indicatie": "Waardevol",
      "boom_def_afwezig": "False",
      "plantwijze": "Wildverband",
      "boomrooster": "False",
      "verlichting": "False",
      "epr_aanwezig": null,
      "epr_preventief_inspecteren": null,
      "epr_bestrijdingsmethode": null,
      "epr_stadium": null,
      "epr_datum_constatering": null,
      "epr_risicoprofiel": null,
      "epr_datum_mech_bestreden": null,
      "epr_datum_1_bio_bestrijding": null,
      "epr_datum_2_bio_bestrijding": null,
      "nazorgboom": null,
      "projectnaam": null,
      "geo_shape": {
        "type": "Feature",
        "geometry": { "coordinates": [5.458675408131263, 51.41571809950286], "type": "Point" },
        "properties": {}
      },
      "geo_point_2d": { "lon": 5.458675408131263, "lat": 51.41571809950286 }
    }]
    ////
    // Leaflet

    const map = L
      .map('mapid')
      .setView([51.438972, 5.476493], 1);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 16,
      minZoom: 12,
    }).addTo(map);

    map.setMaxBounds(map.getBounds());

    let buurtAreas = L.geoJson(buurten_data, { //instantiates a new geoJson layer using built in geoJson handling
      weight: 2, //Attributes of polygons including the weight of boundaries and colors of map.
      color: "#432",
    }).bindPopup(function (Layer) { //binds a popup when clicking on each polygon to access underlying data
      return 'test' //Layer.feature.properties.NAME;
    }).addTo(map); //Adds the layer to the map.

    map.fitBounds(buurtAreas.getBounds());

    ////

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");




  }
}
</script>
  
<style scoped>
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