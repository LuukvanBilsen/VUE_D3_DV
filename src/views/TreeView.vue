<template>
    <div>
        <h2>{{ title }}</h2>

        <v-container class="bg-surface-variant" fluid>
            <v-row no-gutters>
                <v-col cols="12" sm="2">

                </v-col>
                <v-col cols="12" sm="10">
                    <h3>
                        Visualization
                    </h3>
                </v-col>

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
                                            <pre><code> {{ codeSample }} </code></pre>                                        </div>
                                    </v-card-text>
                                    <v-card-actions class="justify-end">
                                        <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </template>
                        </v-dialog>

                        <v-select class="combo ma-2" label="Graph" :items="['Planted', 'Owner', 'Height']" v-model="combo">
                        </v-select>

                        <v-select class="combo ma-2" label="Buurt" :items="this.buurtNamen" v-model="buurt">
                        </v-select>



                    </v-card>
                </v-col>

                <v-col cols="12" sm="10">
                    <div ref="box">
                        <v-sheet class="ma-2 pa-2">

                            <div id="my_dataviz">
                            </div>

                            <!-- <svg :width="this.width" :height="this.height" class="container-border" preserveAspectRatio="none">
                </svg> -->
                        </v-sheet>
                    </div>
                </v-col>

            </v-row>
        </v-container>
        <!-- 
      {{ this.$store.state.bomen[0] }} -->
    </div>
</template>
    
<script>
import * as d3 from 'd3'
import * as _ from 'underscore'

function update(graph, width, height, bomen_data) {
    const owner_data = _.countBy(bomen_data, "eigenaar")
    console.log(owner_data);

    const planted_data = _.countBy(bomen_data, "plantwijze")
    console.log(planted_data);

    const height_data = _.countBy(bomen_data, "hoogte")
    console.log(height_data);


    console.log("hit")

    let data_planted = planted_data

    //


    //

    console.log(data_planted)
    let data = {
        "children":
            [{
                "name": "boss1", "children":
                    [{ "name": "Bomenrij", "value": 67346, },
                    { "name": "Groep", "value": 12982, },
                    { "name": "Solitair", "value": 3723, "colname": "level3" },
                    { "name": "Wildverband", "group": "C", "value": 12498, },
                    { "name": "null", "value": 26300, "colname": "level3" }],
                "colname": "level2"
            }]
    }

    console.log('data')
    console.log(data)

    const root = d3.hierarchy(data).sum(function (d) { return d.value })

    d3.select("#my_dataviz").selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
        total_width = width - margin.left - margin.right,
        total_height = height - margin.top - margin.bottom;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", total_width + margin.left + margin.right)
        .attr("height", total_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


    d3.treemap()
        .size([total_width, total_height])
        .padding(2)
        (root)

    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#228B22")

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
        .text(function (d) {
            console.log("d")
            console.log(d)
            return d.data.name + " " + d.data.value
        })
        .attr("font-size", "15px")
        .attr("fill", "white")

}

export default {
    name: 'TreeView',
    data() {
        return {
            width: 800,
            height: 600,
            title: 'Donut',
            codeSample: `
            <template>
    <div>
        <h2>{{ title }}</h2>

        <v-container class="bg-surface-variant" fluid>
            <v-row no-gutters>
                <v-col cols="12" sm="2">

                </v-col>
                <v-col cols="12" sm="10">
                    <h3>
                        Visualization
                    </h3>
                </v-col>

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

                        <v-select class="combo ma-2" label="Graph" :items="['Planted', 'Owner', 'Height']" v-model="combo">
                        </v-select>

                        <v-select class="combo ma-2" label="Buurt" :items="this.buurtNamen" v-model="buurt">
                        </v-select>



                    </v-card>
                </v-col>

                <v-col cols="12" sm="10">
                    <div ref="box">
                        <v-sheet class="ma-2 pa-2">

                            <div id="my_dataviz">
                            </div>

                            <!-- <svg :width="this.width" :height="this.height" class="container-border" preserveAspectRatio="none">
                </svg> -->
                        </v-sheet>
                    </div>
                </v-col>

            </v-row>
        </v-container>
        <!-- 
      {{ this.$store.state.bomen[0] }} -->
    </div>
</template>
    
<>
import * as d3 from 'd3'
import * as _ from 'underscore'

function update(graph, width, height, bomen_data) {
    const owner_data = _.countBy(bomen_data, "eigenaar")
    console.log(owner_data);

    const planted_data = _.countBy(bomen_data, "plantwijze")
    console.log(planted_data);

    const height_data = _.countBy(bomen_data, "hoogte")
    console.log(height_data);


    console.log("hit")

    let data_planted = planted_data

    //
    

    //

    console.log(data_planted)
    let data = {
        "children":
            [{
                "name": "boss1", "children":
                    [{ "name": "Bomenrij",  "value": 67346, },
                    { "name": "Groep",  "value": 12982,  },
                    { "name": "Solitair", "value": 3723, "colname": "level3" },
                    { "name": "Wildverband", "group": "C", "value": 12498,},
                    { "name": "null", "value": 26300, "colname": "level3" }],
                "colname": "level2"
            }]
    }

    console.log('data')
    console.log(data)

    const root = d3.hierarchy(data).sum(function (d) { return d.value })

    d3.select("#my_dataviz").selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
        total_width = width - margin.left - margin.right,
        total_height = height - margin.top - margin.bottom;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", total_width + margin.left + margin.right)
        .attr("height", total_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",


    d3.treemap()
        .size([total_width, total_height])
        .padding(2)
        (root)

    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#228B22")

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
        .text(function (d) {
            console.log("d")
            console.log(d)
            return d.data.name + " " + d.data.value
        })
        .attr("font-size", "15px")
        .attr("fill", "white")

}

export default {
    name: 'TreeView',
    data() {
        return {
            width: 800,
            height: 600,
            title: 'Donut',
            codeSample: 'code',
            i: 0,
            combo: 'Planted',
            buurtNamen: ['Limbeek',
                'Hemelrijken',
                'Gildebuurt',
                'Woenselse Watermolen',
                'Binnenstad',
                'De Bergen',
                'Witte dame',
                'Fellenoord',
                'TU-terrein'],
            buurt: 'Limbeek'
        }
    },
    watch: {
        combo: function (value) {
            // If "pageData" ever changes, then we will console log its new value.
            update(value, this.width, this.height, this.$store.state.bomen)
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

        update(this.combo, this.width, this.height, this.$store.state.bomen)
    }
}

    
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
}</style>
`,
            i: 0,
            combo: 'Planted',
            buurtNamen: ['Limbeek',
                'Hemelrijken',
                'Gildebuurt',
                'Woenselse Watermolen',
                'Binnenstad',
                'De Bergen',
                'Witte dame',
                'Fellenoord',
                'TU-terrein'],
            buurt: 'Limbeek'
        }
    },
    watch: {
        combo: function (value) {
            // If "pageData" ever changes, then we will console log its new value.
            update(value, this.width, this.height, this.$store.state.bomen)
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

        update(this.combo, this.width, this.height, this.$store.state.bomen)
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