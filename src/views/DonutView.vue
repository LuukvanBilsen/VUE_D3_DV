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

              <div id="my_dataviz">
              </div>


              <!-- <svg :width="this.width" :height="this.height" class="container-border" preserveAspectRatio="none">
              </svg> -->
            </v-sheet>
          </div>
        </v-col>

        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <v-card>
              <v-combobox class="combo" label="Graph" :items="['Planted', 'Owner']" v-model="combo">
              </v-combobox>
            </v-card>
          </v-col>
        </v-row>

      </v-row>
    </v-container>

  </div>
</template>
  
<script>
import * as d3 from 'd3'
import bomen_data from '../../public/bomen.json'
import * as _ from 'underscore'

function update(graph, width, height) {

  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin

  const owner_data = _.countBy(bomen_data, "eigenaar")
  console.log(owner_data);

  const planted_data = _.countBy(bomen_data, "plantwijze")
  console.log(planted_data);

  console.log("hit")

  let data = planted_data

  if (graph == 'Owner') {
    data = owner_data
  }

  
  d3.select("#my_dataviz").selectAll("*").remove();
  
  // append the svg object to the div called 'my_dataviz'
  const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // set the color scale
  const color = d3.scaleOrdinal()
    .domain(Object.keys(data))
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(d => d[1])
  const data_ready = pie(Object.entries(data))

  // The arc generator
  const arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

  // Another arc that won't be drawn. Just for labels positioning
  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('allSlices')
    .data(data_ready)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // Add the polylines between chart and labels:
  svg
    .selectAll('allPolylines')
    .data(data_ready)
    .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d) {
      const posA = arc.centroid(d) // line insertion in the slice
      const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      const posC = outerArc.centroid(d); // Label position = almost the same as posB
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

  // Add the polylines between chart and labels:
  svg
    .selectAll('allLabels')
    .data(data_ready)
    .join('text')
    .text(d => d.data[0])
    .attr('transform', function (d) {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style('text-anchor', function (d) {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
    })

}

export default {
  name: 'GraphView',
  data() {
    return {
      width: 800,
      height: 600,
      title: 'Donut',
      codeSample: `Lorem ipsum`,
      i: 0,
      combo: 'Planted'
    }
  },
  watch: {
    combo: function (value) {
      // If "pageData" ever changes, then we will console log its new value.
      this.i++
      console.log(value);
      update(value, this.width, this.height)
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
  },
  mounted() {
    this.setBoxWidth()

    const width = this.width, height = this.height, margin = 20;
    const radius = Math.min(this.width, this.height) / 2 - margin

    const owner_data = _.countBy(bomen_data, "eigenaar")
    console.log(owner_data);

    const planted_data = _.countBy(bomen_data, "plantwijze")
    console.log(planted_data);

    function update(graph) {
      console.log("hit")

      let data = planted_data

      if (graph == 'Owner') {
        data = owner_data
      }

      // append the svg object to the div called 'my_dataviz'
      const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // set the color scale
      const color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeDark2);

      // Compute the position of each group on the pie:
      const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d[1])
      const data_ready = pie(Object.entries(data))

      // The arc generator
      const arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

      // Another arc that won't be drawn. Just for labels positioning
      const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      svg
        .selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[1]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

      // Add the polylines between chart and labels:
      svg
        .selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
          const posA = arc.centroid(d) // line insertion in the slice
          const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          const posC = outerArc.centroid(d); // Label position = almost the same as posB
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })

      // Add the polylines between chart and labels:
      svg
        .selectAll('allLabels')
        .data(data_ready)
        .join('text')
        .text(d => d.data[0])
        .attr('transform', function (d) {
          const pos = outerArc.centroid(d);
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style('text-anchor', function (d) {
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
        })

    }


    update()
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