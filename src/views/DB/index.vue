<template>
  <div>
    <h3>数据库连接</h3>
    <el-form size="mini" inline>
      <el-form-item label="数据库类型">
        <el-select v-model="sqlType">
          <el-option label="mysql" value="mysql"></el-option>
          <el-option label="Oracle" value="oracle"></el-option>
          <el-option label="SQLServer" value="sqlserver"></el-option>
        </el-select>
        <el-button class="margin-left-20" type="primary" @click="addSql">新增SQL</el-button>
      </el-form-item>
      <div v-if="sqlType === 'mysql'">
        <el-form-item label="服务器ip">
          <el-input v-model="mysqlConfig.host"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="mysqlConfig.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称">
          <el-input v-model="mysqlConfig.database"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="mysqlConfig.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="mysqlConfig.password"></el-input>
        </el-form-item>
      </div>
      <div v-show="sqlType === 'oracle'">
        <el-form-item label="服务器ip">
          <el-input v-model="oracleConfig.host"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="oracleConfig.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称">
          <el-input v-model="oracleConfig.database"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="oracleConfig.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="oracleConfig.password"></el-input>
        </el-form-item>
      </div>
      <div v-show="sqlType === 'sqlserver'">
        <el-form-item label="服务器ip">
          <el-input v-model="sqlserverConfig.host"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="sqlserverConfig.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称">
          <el-input v-model="sqlserverConfig.database"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="sqlserverConfig.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="sqlserverConfig.password"></el-input>
        </el-form-item>
      </div>
      <el-form-item v-for="(item, index) in slqArr" :key="index" class="item-block">
        <el-input v-model="slqArr[index]" class="input-inline"></el-input>
        <el-button v-if="index !== 0" class="margin-left-20" type="primary" @click="deleteSql(index)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="testConnect">测试连接</el-button>
        <el-button type="primary" @click="query">执行SQL</el-button>
      </el-form-item>
    </el-form>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script>
import dbUtils from './dbUtils'
export default {
  name: "DB",
  data() {
    return {
      sqlType: 'mysql',
      mysqlConfig: {
        host: '',
        database: '',
        port: '',
        user: '',
        password: '',
      },
      oracleConfig: {
        host: '',
        database: '',
        port: '',
        user: '',
        password: '',
      },
      sqlserverConfig: {
        host: '',
        database: '',
        port: '',
        user: '',
        password: '',
      },
      slqArr: [''],
      message: null
    }
  },
  methods: {
    getConfig() {
      let config
      switch (this.sqlType) {
        case 'mysql':
          config = this.mysqlConfig
          break
        case 'oracle':
          config = this.oracleConfig
          break
        case 'sqlserver':
          config = this.sqlserverConfig
          break
      }
      return config
    },
    async testConnect() {
      const config = this.getConfig()
      this.message = await dbUtils.testConnect(config, this.sqlType)
    },
    async query() {
      const config = this.getConfig()
      this.message = await dbUtils.beginTransaction(config, this.sqlType, this.slqArr)
    },
    deleteSql(index) {
      this.slqArr.splice(index, 1)
    },
    addSql() {
      this.slqArr.push('')
    }
  }
}
</script>

<style scoped>

</style>
