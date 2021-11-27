<template>
  <div id="app">
    <h1>Welcome to Your Vue.js App</h1>
    <button @click="testEdge">testEdge</button>
    <button @click="testDll">testDll</button>
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
    },
    testDll() {
      const Invoke = edge.func({
        assemblyFile: 'public/dll/electronedge.dll',
        typeName: "electronedge.MQ",
        methodName: "Invoke"
      })
      Invoke('Electron', (error, value) => {
        console.log(error, value)
      })
    }
  }
}
</script>
