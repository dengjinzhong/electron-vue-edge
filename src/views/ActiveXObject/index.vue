<template>
  <div>
    <h3>winax 连接 ActiveXObject</h3>
    <br>
    <el-button type="primary" @click="creatCom">在D盘创建XLS</el-button>
  </div>
</template>

<script>
const winax = require('winax')
export default {
  name: "ActiveXObject",
  methods: {
    creatCom() {
      const ExcelSheet = new winax.Object('Excel.Sheet')
      ExcelSheet.Application.Visible = true;
      ExcelSheet.ActiveSheet.Cells(1,1).Value = "This is column A, row 1";
      ExcelSheet.SaveAs('D:\\TEST.XLS')
      ExcelSheet.Application.Quit()
    }
  }
}
</script>

<style scoped>

</style>
