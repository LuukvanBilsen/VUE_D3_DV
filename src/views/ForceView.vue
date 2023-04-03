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
  name: 'ForceView',
  data() {
    return {
      width: 600,
      title: 'Force directed graph',
      codeSample: `
<script>
import * as d3 from 'd3'
export default {
  name: 'ForceView',
  data() {
    return {
      codeSample: \` //The code you are reading \` 
    }
  },
  mounted() {
    let marge = { top: 60, bottom: 60, left: 60, right: 60 }
    let svg = d3.select('svg')
    let width = svg.attr('width')
    let height = svg.attr('height')
    let g = svg.append('g')
      .attr('transform', 'translate('+marge.top+','+marge.left+')')
    // Node Dataset
    // 节点集
    let nodes = [
      { name: 'qwerty' },
      { name: 'asdf' },
      { name: '1111' },
      { name: '1234' },
      { name: 'lkhj' },
      { name: 'abc' },
      { name: 'xyz' },
      { name: 'a' },
      { name: 'b' }
    ]
      `
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
        this.width = 400
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
    // Node Dataset
    // 节点集
    let nodes = [
      { name: 'qwerty' },
      { name: 'asdf' },
      { name: '1111' },
      { name: '1234' },
      { name: 'lkhj' },
      { name: 'abc' },
      { name: 'xyz' },
      { name: 'a' },
      { name: 'b' }
    ]
    // Side Dataset
    // 边集
    let edges = [
      { source: 0, target: 4, relation: '籍贯', value: 1.3 },
      { source: 4, target: 5, relation: '舍友', value: 1 },
      { source: 4, target: 6, relation: '舍友', value: 1 },
      { source: 4, target: 7, relation: '舍友', value: 1 },
      { source: 1, target: 6, relation: '籍贯', value: 2 },
      { source: 2, target: 5, relation: '籍贯', value: 0.9 },
      { source: 3, target: 7, relation: '籍贯', value: 1 },
      { source: 5, target: 6, relation: '同学', value: 1.6 },
      { source: 6, target: 7, relation: '朋友', value: 0.7 },
      { source: 6, target: 8, relation: '职责', value: 2 }
    ]
    // Set a color scale
    // 设置一个颜色比例尺
    let colorScale = d3.scaleOrdinal()
      .domain(d3.range(nodes.length))
      .range(d3.schemeCategory10)
    // Create a new force guide diagram
    // 新建一个力导向图
    let forceSimulation = d3.forceSimulation()
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter())
    // Generate node data
    // 生成节点数据
    forceSimulation.nodes(nodes)
      .on('tick', ticked)
    // Generate side data
    // 生成边数据
    forceSimulation.force('link')
      .links(edges)
      .distance(function (d) { // side length / 每一边的长度
        return d.value * 100
      })
    // Set drawing center location
    // 设置图形中心位置
    forceSimulation.force('center')
      .x(width / 2)
      .y(height / 2)
    // Draw side
    // 绘制边
    let links = g.append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', function (d, i) {
        return colorScale(i)
      })
      .attr('stroke-width', 1)
    // Text on side
    // 边上的文字
    let linksText = g.append('g')
      .selectAll('text')
      .data(edges)
      .enter()
      .append('text')
      .text(function (d) {
        return d.relation
      })
    // Create group
    // 创建分组
    let gs = g.selectAll('.circleText')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', function (d) {
        let cirX = d.x
        let cirY = d.y
        return 'translate(' + cirX + ',' + cirY + ')'
      })
      .call(d3.drag()
        .on('start', started)
        .on('drag', dragged)
        .on('end', ended)
      )
    // Draw node
    // 绘制节点
    gs.append('circle')
      .attr('r', 10)
      .attr('fill', function (d, i) {
        return colorScale(i)
      })
    // Draw text
    // 绘制文字
    gs.append('text')
      .attr('x', -10)
      .attr('y', -20)
      .attr('dy', 10)
      .text(function (d) {
        return d.name
      })
    // ticked
    function ticked() {
      links
        .attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })
      linksText
        .attr('x', function (d) { return (d.source.x + d.target.x) / 2 })
        .attr('y', function (d) { return (d.source.y + d.target.y) / 2 })
      gs
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
    }
    // drag
    function started(event, d) {
      if (!event.active) {
        forceSimulation.alphaTarget(0.8).restart() // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1] // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0, 1]
      }
      gs.filter(p => p === d).raise().attr("stroke", "black")
      d.fx = d.x
      d.fy = d.y
    }
    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }
    function ended(event, d) {
      if (!event.active) {
        forceSimulation.alphaTarget(0)
      }
      gs.filter(p => p === d).raise().attr("stroke", null)
      d.fx = null
      d.fy = null
    }
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