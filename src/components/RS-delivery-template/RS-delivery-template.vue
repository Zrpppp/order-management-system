<template>
  <div class="printComp" style="display: none">
    <h1 class="title">荣 燊 (澳門) 建 材 有 限 公 司</h1>
    <h3 class="title">RONG SHEN (MACAO) CONSTRUCTION MATERIAL LIMITED</h3>
    <h2 class="title">送 貨 單</h2>
    <div class="my-top">
      <div class="my-list-row">
        <div>
          <div class="my-list-col">客戶名稱：{{this.productList.customerName}}</div>
          <div class="my-list-col">收貨人：{{this.productList.customerName}}</div>
          <div class="my-list-col">地 址：{{this.productList.address}}</div>
        </div>
        <div>
          <div class="my-list-col">{{this.productList.orderNo}}</div>
          <div class="my-list-col">{{this.productList.time}}</div>
        </div>
      </div>
    </div>
    <vxe-table border ref="tableRef" height="300" :print-config="{}" align="center" :data="productList">
      <vxe-column type="seq" title="序號" />
      <vxe-column field="name" title="產品名稱"/>
      <vxe-column field="specifications" title="產品規格"/>
      <vxe-column field="unit" title="單位"/>
      <vxe-column field="count" title="數量"/>
      <vxe-column field="remark" title="備註"/>
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
}
.tips{
    margin-bottom: 30px;
    margin-left: 10px;
  }
.fill-empty,
.fill-part {
  display: inline-block;
  vertical-align: bottom;
  border-bottom: 1px solid #000;
}
`

export default {
  name: "RS-delivery-template",
  data () {
    return {
      productList: [],
      printData:{},
      mergeFooterItems: [
        { row: 0, col: 0, rowspan: 0, colspan: 5}
      ],
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
<h1 class="title">荣 燊 (澳門) 建 材 有 限 公 司</h1>
<h3 class="title">RONG SHEN (MACAO) CONSTRUCTION MATERIAL LIMITED</h3>
<h2 class="title">送 貨 單</h2>
<div class="my-top">
  <div class="my-list-row">
    <div>
        <div class="my-list-col">客戶名稱：` + this.printData.customerName + `</div>
        <div class="my-list-col">收貨人：`+this.printData.consigneeName+`</div>
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
  <div class="tips">注:以上货物核数量，如有品周题，请在收到货後3天内通知本公司，逾期恕不自责。</div>
  <div class="my-list-bottom">
   <div class="my-list-col">
        <div>制 單 ：1045</div>
    </div>
    <div class="my-list-col">
        <div>經 手 人 ：</div>
    </div>
    <div class="my-list-col">
        <div>客戶簽收 ：</div>
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
            {type: 'seq'},
            {field: 'name'},
            {field: 'specifications'},
            {field: 'unit'},
            {field: 'count'},
            {field: 'address'},
            {field: 'remark'},
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
