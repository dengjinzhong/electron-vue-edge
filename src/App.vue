<template>
  <div id="app">
    <h1>Welcome to Your Vue.js App</h1>
    <button @click="testEdge">testEdge</button>
  </div>
</template>

<script>
import edge from 'electron-edge-js'
export default {
  name: 'App',
  methods: {
    testEdge() {
      const helloWorld = edge.func(function () {/*
    async (input) => {
        return ".NET Welcomes " + input.ToString();
    }
*/});
      helloWorld('Electron', (error, value) => {
        console.log(error, value)
      })
    }
  }
}
</script>
