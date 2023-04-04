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

export default {
    name: 'HistogramView',
    data() {
        return {
            width: 800,
            title: 'Histogram',
            codeSample: ` CODE: `
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

        let marge = { top: 60, bottom: 60, left: 60, right: 60 }
        let svg = d3.select('svg')
        let width = svg.attr('width')
        let height = svg.attr('height')
        let g = svg.append('g')
            .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')
        let dataset = [10, 20, 30, 23, 13, 40, 27, 35, 20]
        // Draw the axis in the X, Y direction
        // x , y 方向绘制坐标轴
        let xScale = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .rangeRound([0, width - marge.left - marge.right])
        let xAxis = d3.axisBottom(xScale)
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset)])
            .range([height - marge.top - marge.bottom, 0])
        let yAxis = d3.axisLeft(yScale)
        g.append('g')
            .attr('transform', 'translate(' + 0 + ',' + (height - marge.top - marge.bottom) + ')')
            .call(xAxis)
        g.append('g')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis)

        // Create gourps for rectangles and corresponding text
        // 给矩形和对应文字创建分组
        let gs = g.selectAll('.rect')
            .data(dataset)
            .enter()
            .append('g')
        // draw rectangle
        // 绘制矩形
        let rectPadding = 20
        gs.append('rect')
            .attr('x', function (d, i) {
                return xScale(i) + rectPadding / 2
            })
            .attr('y', function () {
                // init state
                // 初始状态
                let min = yScale.domain()[0]
                return yScale(min)
            })
            .attr('width', function () {
                return xScale.step() - rectPadding
            })
            .attr('height', function () {
                // init state
                // 初始状态
                return 0
            })
            .attr('fill', 'lightblue')
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr('fill', 'yellow')
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr('fill', 'lightblue')
            })
            .transition()
            .duration(2000)
            .delay(function (d, i) {
                return i * 400
            })
            // .ease(d3.easeElasticInout)
            .attr('y', function (d) {
                // Return to the final state
                // 回到最终状态
                return yScale(d)
            })
            .attr('height', function (d) {
                // Return to the final state
                // 回到最终状态
                return height - marge.top - marge.bottom - yScale(d)
            })
        // Draw text
        // 绘制文字
        gs.append('text')
            .attr('x', function (d, i) {
                return xScale(i) + rectPadding / 2
            })
            .attr('y', function () {
                // return yScale(d)
                let min = yScale.domain()[0]
                return yScale(min)
            })
            .attr('dx', function () {
                ((xScale.step() - rectPadding) / 2) // eslint-disable-line
            })
            .attr('dy', 20)
            .text(function (d) {
                return d
            })
            .transition()
            .duration(2000)
            .delay(function (d, i) {
                return i * 400
            })
            .attr('y', function (d) {
                return yScale(d)
            })
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