<template>
  <div class="printComp" style="display: none">
    <vxe-table :border="false" ref="tableRef" height="300" :print-config="{}" align="center" :data="productList">
      <vxe-column type="seq" title="NO" />
      <vxe-column field="name" title="貨品名稱"/>
      <vxe-column field="specifications" title="規格"/>
      <vxe-column field="unit" title="單位"/>
      <vxe-column field="count" title="數量"/>
      <vxe-column field="price" title="價格/HK$"/>
      <vxe-column field="totalPrice" title="總價/HK$"/>
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
  left: 100px;
}
`

export default {
  name: "KL-quotation-template",
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
<h3 class="title">Keli Materials Limited</h3>
<h3 class="title" style="text-decoration:underline;">報 價 單</h3>
<div class="my-top">
  <div class="my-list-row">
    <div>
        <div class="my-list-col">客戶名稱：` + this.printData.customerName + `</div>
    </div>
    <div>
        <div class="my-list-col">報價單號:`+this.printData.orderNo+`</div>
        <div class="my-list-col">報價日期:`+this.printData.time+`</div>
    </div>
  </div>
</div>
`
// 打印底部内容模板
      const bottomHtml = `
<div class="my-bottom">
  <div class="my-list-bottom">
    <div class="my-list-col">
        <div>備註:</div>
        <div>① 交貨地址: 澳門地盤地面車到為準</div>
        <div>② 交貨時間: 收到定金後30-45天交貨</div>
        <div>③ 供貨方式: 預付30%定金,餘款交貨後30天內一次性支付</div>
        <div>④ 保價時效: 30天</div>
    </div>
    <div class="my-list-col">
        <div>Total : `+this.printData.orderPrice+`</div>
        <div>Keli Materials Limited</div>
        <div>Kelly Liu</div>
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
            {field: 'name',title: '貨品名稱'},
            {field: 'specifications',title: '規格'},
            {field: 'unit',title: '單位'},
            {field: 'count',title: '數量'},
            {field: 'price',title: '價格/HK$'},
            {field: 'totalPrice',title: '總價/HK$'},
            {field: 'remark',title: '備註'},
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
.printComp{}
</style>
