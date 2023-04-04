<template>
  <div>
    <h2>Vue.js and D3 </h2>
    <h4>
      https://github.com/d3/d3/wiki/Tutorials <br />
      https://bost.ocks.org/mike/circles/ <br/>
      https://observablehq.com/@d3/d3v6-migration-guide
    </h4>

    <h2>Force-Direct Graph</h2>
    <svg width="960" height="600" class="container-border"></svg>

  </div>
</template>

<script>
import * as d3 from 'd3'

const data = [
  { date: "24-Apr-07", amount: 93.24 },
  { date: "25-Apr-07", amount: 95.35 },
];

export default {
  name: 'AboutView',


}
</script>
<style scoped>
</style>