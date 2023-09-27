<template>
<div style="display: none">
  <vxe-table ref="table" class="table myTable-scrollbar" :data="productList" border  align="center" height="100%">
    <vxe-table-column typ="seq"  title="序號"/>
    <vxe-table-column field="name" title="產品名稱"/>
    <vxe-table-column field="specifications" title="產品規格"/>
    <vxe-table-column field="unit" title="單位"/>
    <vxe-table-column field="count" title="數量"/>
    <vxe-table-column field="price" title="價格HKD"/>
    <vxe-table-column field="totalPrice" title="總價HKD"/>
    <vxe-table-column field="orderNo" title="備註"/>
  </vxe-table>
</div>
</template>
<script>

export default {
  name: "export-productList",
  data(){
    return{
      productList: [],
      exportProductColumns:[
        {type: 'seq',title: '序號'},
        {field: 'name',title: '產品名稱'},
        {field: 'specifications',title: '產品規格'},
        {field: 'unit',title: '單位'},
        {field: 'count',title: '數量'},
        {field: 'price',title: '價格HKD'},
        {field: 'totalPrice',title: '總價HKD'},
        {field: 'orderNo',title: '備註'},
      ],
    }
  },
  methods:{
    exportEvent(filename, data, columns = this.exportProductColumns) {
      this.$refs.table.exportData({
        filename: filename,
        type: 'csv',
        data: data,
        columns: columns,
      })
    },
  }
}
</script>

<style scoped>

</style>
