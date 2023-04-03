<template>
  <div>
    <h2>Vue.js and D3 </h2>
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
              <svg id="vis" :width="this.width" :height="this.height" class="container-border" preserveAspectRatio="none">
              </svg>

            </v-sheet>
          </div>
        </v-col>

      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <div>
            ToolTip
          </div>
          <v-card>
            <div :key="this.i">
              Location: {{ this.loc }} <br />
              Long: {{ this.long }} <br />
              Lat: {{ this.lat }} <br />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <div> Menu </div>
          <div>
            <v-card>
              <!-- <v-checkbox
              v-model="a"
              :label="`Checkbox 1: ${a.toString()}`"
            ></v-checkbox> -->

              <input type="checkbox" class="checkbox" value="A" checked><label> group A</label> <br />
              <input type="checkbox" class="checkbox" value="B" checked><label> group B</label> <br />
              <input type="checkbox" class="checkbox" value="C" checked><label> group C</label>
            </v-card>


            <!-- <v-checkbox v-model="ex4" label="red" color="red" value="red" hide-details></v-checkbox> -->

          </div>
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>
  
<script>
import * as d3 from 'd3'
import data from '../../public/holtzy_DATA.json'

export default {
  name: 'MapView',
  data() {
    return {
      width: 800,
      height: 600,
      title: 'MapView',
      codeSample: `Lorem ipsum`,

      loc: '',
      lat: '',
      long: '',

      i: 0,
      a: false
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
        this.height = 600

      }
    },
    updateComp() {
      this.i++;
      console.log(i)
    }
  },
  mounted() {
    this.setBoxWidth()


    const projection = d3.geoMercator()
      .center([4, 47])                // GPS of location to zoom on
      .scale(2080)                       // This is like the zoom
      .translate([this.width / 2, this.height / 2])

    const markers = [
      { long: 9.083, lat: 42.149, name: "Corsica", group: 'A', size: 41 }, // corsica
      { long: 7.26, lat: 43.71, name: "Nice", group: 'A', size: 100 }, // nice
      { long: 2.349, lat: 48.864, name: "Paris", group: 'B', size: 80 }, // Paris
      { long: -1.397, lat: 43.664, name: "Hossegor", group: 'C', size: 41 }, // Hossegor
      { long: 3.075, lat: 50.640, name: "Lille", group: 'C', size: 41 }, // Lille
      { long: -3.83, lat: 58, name: "Morlaix", group: 'B', size: 20 }, // Morlaix
    ];

    const svg = d3.select('svg')

    const color = d3.scaleOrdinal()
      .domain(["A", "B", "C"])
      .range(["#402D54", "#D18975", "#8FD175"])

    const size = d3.scaleLinear()
      .domain([1, 100])  // What's in the data
      .range([4, 50])  // Size in pixel

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(data.features.filter(d => d.properties.name == "France"))
      .join("path")
      .attr("fill", "#b8b8b8")
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      .style("stroke", "black")
      .style("opacity", .3)

    // create a tooltip
    // const Tooltip = d3.select('#legend')
    //   .append("div")
    //   .attr("class", "tooltip")
    //   .style("opacity", 1)
    //   .style("background-color", "white")
    //   .style("color", "black")
    //   .style("border", "solid")
    //   .style("border-width", "2px")
    //   .style("border-radius", "5px")
    //   .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d, a) {
      console.log("mouseOver")
      // Tooltip.style("opacity", 1)
      console.log(d)
      console.log(event.target)

      d3.select(event.target).attr("stroke", "red");
    }


    var mousemove = (event, d) => {
      this.loc = d.name
      this.long = d.long
      this.lat = d.lat
    }

    var mouseleave = (event, d) => {
      console.log("mouseLeave")
      // Tooltip
      //   .html("Location: <br/>Long: <br>Lat: ")

      d3.select(event.target).attr("stroke", "#69b3a2");

      this.loc = ''
      this.long = ''
      this.lat = ''
    }

    // Add circles:
    svg
      .selectAll("myCircles")
      .data(markers)
      .join("circle")
      .attr("class", d => d.group)
      .attr("cx", d => projection([d.long, d.lat])[0])
      .attr("cy", d => projection([d.long, d.lat])[1])
      .attr("r", d => size(d.size))
      .style("fill", d => color(d.group))
      .attr("stroke", d => color(d.group))
      .attr("stroke-width", 3)
      .attr("fill-opacity", .4)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    function update() {
      // For each check box:
      d3.selectAll(".checkbox").each(function (d) {
        const cb = d3.select(this);
        const grp = cb.property("value")

        // If the box is check, I show the group
        if (cb.property("checked")) {
          svg.selectAll("." + grp).transition().duration(1000).style("opacity", 1).attr("r", function (d) { return size(d.size) })

          // Otherwise I hide it
        } else {
          svg.selectAll("." + grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
        }
      })
    }

    // When a button change, I run the update function
    d3.selectAll(".checkbox").on("change", update);

    // And I initialize it at the beginning
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

.circle:hover {
  stroke: black;
  stroke-width: 4px;
}
</style>