<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/graph">Trees</router-link> |   
    <router-link to="/about">About</router-link> 
    <br/>
    <b> Snippets: </b>
    <router-link to="/force">Force Direct Graph</router-link> |
    <router-link to="/histogram">Histogram</router-link> |
    <router-link to="/tree">Collapsible Tree</router-link> |
    <router-link to="/map">BubbleMap</router-link> 

  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  /*background-color: #484444;*/
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
