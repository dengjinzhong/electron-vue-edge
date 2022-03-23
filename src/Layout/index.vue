<template>
  <div class="wrapper">
    <el-row class="height-100">
      <el-col class="height-100" :span="6">
        <el-menu
            :default-active="activeMenu"
            class="height-100 el-menu-nav"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="selectMenu"
        >
          <el-menu-item index="home">
            <i class="el-icon-s-shop"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="Dell">
            <i class="el-icon-document-remove"></i>
            <span slot="title">Dell</span>
          </el-menu-item>
          <el-menu-item index="DB">
            <i class="el-icon-coin"></i>
            <span slot="title">DB</span>
          </el-menu-item>
          <el-menu-item index="ActiveXObject">
            <i class="el-icon-cpu"></i>
            <span slot="title">ActiveXObject</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <div class="main">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Layout",
  computed: {
    activeMenu() {
      return this.$route.name
    }
  },
  methods: {
    selectMenu(name) {
      if (name === this.activeMenu) return
      this.$router.push({name})
    }
  }
}
</script>

<style scoped>
.wrapper{
  height: 100%;
  overflow: hidden;
}
.height-100{
  height: 100%;
}
.wrapper .el-menu-nav{
  overflow-y: hidden;
}
.wrapper .main{
  margin: 20px;
}
</style>
<style>
.wrapper .el-submenu .el-menu-item {
  min-width: 100px;
}
</style>
