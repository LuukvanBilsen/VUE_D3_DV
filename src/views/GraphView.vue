<template>
    <div>
      <h2>{{title}}</h2>
  
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
                <svg :width="this.width" height="600" class="container-border" preserveAspectRatio="none">
                </svg>
              </v-sheet>
            </div>
          </v-col>
  
        </v-row>
      </v-container>
  
    </div>
  </template>
  
<script>
import * as d3 from 'd3'

export default {
    name: 'GraphView',
    data() {
        return {
            width: 800,
            title: 'asdf',
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
</style>