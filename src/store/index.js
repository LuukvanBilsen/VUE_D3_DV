import { createStore } from 'vuex'
import axios from 'axios'
import * as _ from 'underscore'

import bomen_data from '../../public/bomen_comb.json'
import buurten_data from '../../public/buurten.json'

export default createStore({
  state: {
    bomen: bomen_data,
    buurten: buurten_data
  },
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
  getters: { //https://vuex.vuejs.org/guide/getters.html#property-style-access
    bomenEigenaar(state) {
      return _.countBy(state.bomen, "eigenaar")
    },
    bomenPlantwijze(state) {
      return _.countBy(state.bomen, "plantwijze")
    },
    bomenPlantwijze(state) {
      return _.countBy(state.bomen, "hoogte")
    },
    allBuurten(state) {
      return state.buurten
    },
    buurtBomen: (state) => (buurtName) => { 
      return state.bomen.filter(x =>
        x.buurt_naam == buurtName);
    },

    // Probably better ways to do this
    allBomenMap(state) {
      return (state.bomen.map(obj => {
        const p = Object.values(obj.geo_shape.geometry.coordinates)
        p.date = parseInt(obj.plantjaar)
        return p
      }).sort((a, b) => a.date - b.date))


      return (state.bomen.map(obj => obj.geo_shape.geometry.coordinates[0]))

      // state.bomen.map(obj => obj.geo_shape.geometry.coordinates[1]),
      // state.bomen.map(obj => obj.plantjaar))


    },

  },
  mutations: { // Sync

  },
  actions: { // Async

  },
  modules: {
  }
})
