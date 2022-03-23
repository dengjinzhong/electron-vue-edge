<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
import Layout from '@/Layout'

export default {
  name: 'app',
  components: {
    Layout
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html, body, #app{
  height: 100%;
}
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background-color: rgba(255, 255, 255, 0);/*其他样式，比如圆角等*/
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-color: rgba(144, 147, 153, 0.5);
}
</style>
