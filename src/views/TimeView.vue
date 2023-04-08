<template>
    <div>
        <h2>{{ title }}</h2>

        <v-container class="bg-surface-variant" fluid>
            <v-row no-gutters>
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

                    </v-card>
                </v-col>




                <v-col cols="12" sm="10">
                    <div ref="box">
                        <v-sheet class="ma-2 pa-2">
                            <div id="mapid">

                            </div>

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

function fillWithTrees(data) {    

}

export default {
    name: 'TimeView',
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

        console.log("allBomenMap")
        // console.log(this.$store.getters.allBomenMap)
        fillWithTrees(this.$store.getters.allBomenMap)

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