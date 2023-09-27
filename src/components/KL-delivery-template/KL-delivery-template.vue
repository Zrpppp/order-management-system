<template>
  <div class="printComp" style="display: none">
    <vxe-table :border="true" ref="tableRef" height="300" :print-config="{}" align="center" :data="productList">
      <vxe-column type="seq" title="貨號NO" />
      <vxe-column field="name" title="貨品名稱Name"/>
      <vxe-column field="specifications" title="型號/尺寸Descrition"/>
      <vxe-column field="count" title="數量QTY"/>
      <vxe-column field="unit" title="單位Unit"/>
      <vxe-column field="remark" title="備註Remarks"/>
    </vxe-table>
  </div>
</template>

<script>
// 打印样式
const printStyle = `
.title {
  text-align: center;
}
.my-list-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.my-list-bottom{
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.my-list-col {
  text-align: left;
  height: 28px;
  line-height: 28px;
}
.my-top,
.my-bottom {
  font-size: 12px;
}
.my-top {
  margin-bottom: 5px;
}
.my-bottom {
  margin-top: 30px;
  text-align: right;
}
.fill-empty,
.fill-part {
  display: inline-block;
  vertical-align: bottom;
  border-bottom: 1px solid #000;
}
.my-img{
  width: 100px;
  height: 100px;
  position: absolute;
  left: 200px;
}
`

export default {
  name: "KL-delivery-template",
  data () {
    return {
      productList: [],
      printData:{},
    }
  },
  methods: {
    printEvent(data,list) {
      this.printData = data
      this.productList = list
      this.$nextTick(()=>{  this.print()  })
    },
    print(){
      // 打印顶部内容模板
      const topHtml = `
<img class="my-img"  src="http://oss.sonso.cn/a6/ea4dd40cfd7bb2e8dc3da2386084f5.svg" alt="">
<h1 class="title">科 利 材 料 有 限 公 司</h1>
<h2 class="title">送 貨 單</h2>
<div class="my-top">
  <div class="my-list-row">
    <div>
        <div class="my-list-col">客戶名稱：` + this.printData.customerName + `</div>
        <div class="my-list-col">地 址：`+this.printData.consigneeAddress+`</div>
    </div>
    <div>
        <div class="my-list-col">`+this.printData.orderNo+`</div>
        <div class="my-list-col">`+this.printData.time+`</div>
    </div>
  </div>
</div>
`
      // 打印底部内容模板
      const bottomHtml = `
<div class="my-bottom">
  <div class="my-list-bottom">
    <div class="my-list-col">
        <div style="font-size: 18px">經 手 人 ：Kelly Liu</div>
        <div>Signture<span class="fill-empty" style="width: 200px"></span></div>
    </div>
    <div class="my-list-col">
        <div style="font-size: 18px">收 貨 人 ：   `+this.printData.consigneeName+`</div>
        <div>Consignee<span class="fill-empty" style="width: 200px"></span></div></div>
  </div>
</div>
`
      const $table = this.$refs.tableRef
      if ($table) {
        $table.print({
          sheetName: '科利送货单',
          // 打印样式设置
          style: printStyle,
          // 打印指定列
          columns: [
            {type: 'seq',title: '貨號NO'},
            {field: 'name',title: '貨品名稱Name'},
            {field: 'specifications',title: '型號/尺寸Descrition'},
            {field: 'count',title: '數量QTY'},
            {field: 'unit',title: '單位Unit'},
            {field: 'remark',title: '備註Remarks'},
          ],
          // 打印之前拼接自定义模板
          beforePrintMethod: ({content}) => {
            // 打印之前，返回自定义的 html 内容
            return topHtml + content + bottomHtml
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.printComp{

}
</style>
