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
import data from '../../public/flare-2.json'

export default {
    name: 'CollapsibleTreeView',
    data() {
        return {
            width: 600,
            title: 'Collapsible Tree',
            codeSample: `//ToDo Zoom function`
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

        let width_m = this.width
        console.log(width_m)

        let dx = 10
        let dy = width_m / 4

        let margin = ({ top: 10, right: 120, bottom: 10, left: 40 })

        let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        let tree = d3.tree().nodeSize([dx, dy])


        const root = d3.hierarchy(data);

        // const handleZoom = (e) => {
        //     //d3.select('svg').attr('transform', e.transform);
        //     d3.selectAll('svg g')
        //         .attr('transform', e.transform);
        // }

        // let zoom = d3.zoom().on('zoom', handleZoom)



        root.x0 = dy / 2;

        root.y0 = 0;

        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            if (d.depth && d.data.name.length !== 7) d.children = null;
        });

        const svg = d3.select("svg")
            //.call(zoom)
            .attr("viewBox", [-margin.left, -margin.top, width_m, dx])
            .style("font", "10px sans-serif")
            .attr("preserveAspectRatio", "xMinYMin")
            .style("user-select", "none");

        const gLink = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);

        const gNode = svg.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");

        function update(source, event) {
            const duration = event && event.altKey ? 2500 : 250;
            const nodes = root.descendants().reverse();
            const links = root.links();

            // Compute the new tree layout.
            tree(root);

            let left = root;
            let right = root;
            root.eachBefore(node => {
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
            });

            const height = right.x - left.x + margin.top + margin.bottom;

            const transition = svg.transition()
                .duration(duration)
                .attr("viewBox", [-margin.left, left.x - margin.top, width_m, height])
                .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

            // Update the nodes…
            const node = gNode.selectAll("g")
                .data(nodes, d => d.id);

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                .attr("transform", d => `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .on("click", (event, d) => {
                    d.children = d.children ? null : d._children;
                    update(d);
                });

            nodeEnter.append("circle")
                .attr("r", 2.5)
                .attr("fill", d => d._children ? "#555" : "#999")
                .attr("stroke-width", 10);

            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d._children ? -6 : 6)
                .attr("text-anchor", d => d._children ? "end" : "start")
                .text(d => d.data.name)
                .clone(true).lower()
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "white");

            // Transition nodes to their new position.
            const nodeUpdate = node.merge(nodeEnter).transition(transition)
                .attr("transform", d => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            const nodeExit = node.exit().transition(transition).remove()
                .attr("transform", d => `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);

            // Update the links…
            const link = gLink.selectAll("path")
                .data(links, d => d.target.id);

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().append("path")
                .attr("d", d => {
                    const o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });

            // Transition links to their new position.
            link.merge(linkEnter).transition(transition)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition(transition).remove()
                .attr("d", d => {
                    const o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                });

            // Stash the old positions for transition.
            root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        update(root);

        return svg.node();

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