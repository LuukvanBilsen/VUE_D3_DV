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
  getters: { //https://vuex.vuejs.org/guide/getters.html#property-style-access
    bomenEigenaar(state) {
      return _.countBy(state.bomen, "eigenaar")
    },
    bomenPlantwijze(state) {
      return _.countBy(state.bomen, "plantwijze")
    },
    allBuurten(state) {
      return state.buurten
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
