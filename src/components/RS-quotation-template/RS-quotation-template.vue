<template>
  <div class="printComp" style="display: none">
    <vxe-table :border="false" ref="tableRef" height="300" :print-config="{}" align="center" :data="productList">
      <vxe-column type="seq" title="NO" />
      <vxe-column field="name" title="貨品名稱Name"/>
      <vxe-column field="specifications" title="規格Descrition"/>
      <vxe-column field="unit" title="單位Unit"/>
      <vxe-column field="count" title="數量QTY"/>
      <vxe-column field="price" title="價格Uprice"/>
      <vxe-column field="totalPrice" title="總價Total"/>
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
  justify-content:space-between;
  width: 100%;
}
.my-list-col {
  text-align: left;
  height: 28px;
  line-height: 28px;
}
.footer-list-col{
  text-align: left;
  height: 28px;
  line-height: 28px;
}
.footer-list-col:last-child{
  margin-right: 30%;
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
  left: 0;
}
`




export default {
  name: "RS-quotation-template",
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
<h1 class="title">報 價 單</h1>
<h1 class="fill-empty" style="width: 100%"></h1>
<div class="my-top">
  <div class="my-list-row">
    <div>
        <div class="my-list-col">客戶名稱：` + this.printData.customerName + `</div>
        <div class="my-list-col">聯繫人：`+this.printData.consigneeName+`</div>
    </div>
    <div>
        <div class="my-list-col">報價單號: `+this.printData.orderNo+`</div>
        <div class="my-list-col">報價日期: `+this.printData.time+`</div>
    </div>
  </div>
</div>
`
// 打印底部内容模板
      const bottomHtml = `
<div class="my-bottom">
  <div class="my-list-bottom">
    <div class="footer-list-col">
        <div>Remark</div>
        <div>1 本報價單有效期限30天</div>
        <div>2 交貨地址:地面課到達位置</div>
        <div>3 供貨交期:收到訂單確認後3-5天</div>
        <div>4 付款方式:自送貨簽收後30天</div>
    </div>
    <div class="footer-list-col">
        <div>合 計 : `+this.printData.orderPrice+`</div>
        <div>荣燊(澳門)建材有限公司</div>
        <div>Signatrue: Yan Mo</span></div>
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
            {type: 'seq',title: 'NO'},
            {field: 'name',title: '貨品名稱Name'},
            {field: 'specifications',title: '規格Descrition'},
            {field: 'unit',title: '單位Unit'},
            {field: 'count',title: '數量QTY'},
            {field: 'price',title: '價格Uprice'},
            {field: 'totalPrice',title: '總價Total'},
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
