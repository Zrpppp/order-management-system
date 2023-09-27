<template>
  <div class="finance">
    <div class="head-region" >
      <div class="region inline-block chart-region" v-loading="chartsLoading">
        <div id="chart" class="chart"/>
        <div class="select_chart">
          <vxe-select size="mini" v-model="chartLimitQuery.limit" placeholder="时间单位" :options="timeLimitOptions"
                      style="width: 120px;margin-right: 10px" @change="searchChartsEvent" clearable/>
          <select-time :limit-query="chartLimitQuery" @updateList="searchChartsEvent"/>
        </div>
      </div>
    </div>
    <div class="region">
        <!--搜索框-->
        <div class="search-region">
          <vxe-toolbar ref="Toolbar" :refresh="{query: getFinanceList}" custom class="toolbar">
            <template #buttons>
              <my-search :limit-query="limitQuery" @updateList="searchEvent" :key-type="keyType"/>
              <vxe-select size="mini" v-model="limitQuery.status" placeholder="筛选订单状态" :options="orderStatusOptions"
                          style="width: 110px;margin-right: 10px" @change="searchEvent" clearable/>
              <vxe-select size="mini" v-model="limitQuery.companyId" placeholder="筛选销售公司" :options="companyOptions"
                          style="width: 150px;margin-right: 10px" @change="searchEvent" clearable/>
              <select-time :limit-query="limitQuery" @updateList="searchEvent"/>
              <vxe-button v-if="isSelect" size="mini" @click="multiFinishClick"><i class="el-icon-check"/> 批量完成</vxe-button>
<!--              <vxe-button v-if="isSelect" size="mini" @click="printClick('paymentDetails')"><i class="el-icon-printer"/> 请款明细</vxe-button>-->
<!--              <vxe-button v-if="isSelect" size="mini" @click="printClick('invoice')"><i class="el-icon-printer"/> 发 票</vxe-button>-->
              <vxe-button v-if="isSelect" size="mini" @click="exportProduct"><i class="el-icon-printer"/> 导出产品</vxe-button>
              <vxe-button v-if="isSelect" size="mini" @click="exportSelect"><i class="el-icon-printer"/> 导出选中</vxe-button>
              <vxe-button v-if="!isSelect" size="mini" @click="exportData" :loading="exportLoading"><i class="el-icon-printer"/> 全部导出</vxe-button>
            </template>
          </vxe-toolbar>
        </div>
        <!--表格-->
        <div class="table-content">
          <vxe-table ref="table" class="table myTable-scrollbar" :data="financeList" keep-source stripe resizable
                     show-overflow border :loading="loading" @checkbox-change="checkboxChange" @checkbox-all="checkboxChange" @checkbox-range-end="checkboxChange"
                     :row-config="{ isCurrent: true, isHover: true} " :checkbox-config="{range: true ,highlight:true}"
                     align="center" height="100%">
            <vxe-table-column type="checkbox" width="45" align="center" fixed="left"/>
            <vxe-table-column title="操作" align="center" width="200" fixed="left">
              <template v-slot="{ row }">
                <vxe-button size="mini" @click="viewClick(row)"><i class="el-icon-view"/> 查 看</vxe-button>
                <vxe-button size="mini" @click="finishClick(row)"><i class="el-icon-check"/> 完成订单</vxe-button>
              </template>
            </vxe-table-column>
            <vxe-table-column field="status" title="订单状态" :formatter="filterOrderStatus"/>
            <vxe-table-column field="orderNo" title="订单号"/>
            <vxe-table-column field="time" title="开单时间"/>
            <vxe-table-column field="companyNo" title="销售公司" :formatter="filterCompanyName"/>
            <vxe-table-column field="orderPrice" title="订单售价"/>
            <vxe-table-column field="totalProductCost" title="总产品成本"/>
            <vxe-table-column field="totalOperateCost" title="总运营成本"/>
            <vxe-table-column field="profit" title="利润"/>
            <vxe-table-column field="profitMargin" title="利润率"/>
          </vxe-table>
        </div>
        <!--分页选项-->
        <el-pagination
          class="el-pagination"
          @size-change="getFinanceList"
          :page-sizes="[100,200,300,500]"
          :page-size.sync="limitQuery.limit"
          :current-page.sync="limitQuery.page"
          @current-change="getFinanceList"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"/>
      </div>

    <!--编辑表单-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" width="1200px" @close="cancelFrom">
      <order-form :order-data="activeForm" :company-options="companyOptions" :order-status-options="orderStatusOptions" :page-type="activeAction"
                  @submitFrom="cancelFrom" />
    </el-dialog>

    <!--导出发票-->
    <export-product-list ref="exportProductList"/>
  </div>
</template>

<script>
import {fastGet, fastPost, getOptions} from "@/api";
import mySearch from "@/components/MySearch/MySearch.vue";
import selectTime from "@/components/selectTime/selectTime.vue";
import orderForm from "@/views/order/comp/orderForm.vue";
import exportProductList from "@/components/export-productList/export-productList.vue";
import {formatDate, isAllEqual, myDebounce} from "@/utils/tools";
const baseUrl = '/finance/'
export default {
  name: "index",
  components: {
    mySearch,
    orderForm,
    selectTime,
    exportProductList,
  },
  data () {
    return {
      chartsLoading:false,
      dialogVisible: false,
      dialogTitle: '未定义',
      activeAction: "finance",
      activeIds: null,
      activeForm: {},
      chartsList: {
          title: {
            text: '财务报表',
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['成本', '利润', '销售额']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            show: true,
            feature: {
              magicType: { show: true, type: ['stack', 'tiled'] },
              saveAsImage: {show: true},
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '成本',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '利润',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '销售额',
              type: 'line',
              smooth: true,
              data: []
            },
          ]
        },
      chart: null,
      options: {},
      loading:false,
      financeList:[],
      limitQuery:{
        page:1,
        limit:100,
      },
      chartLimitQuery:{
        limit:"day",
        time:[],
      },
      total:0,
      keyType: [
        {label: '订单号', name: 'orderNo'},
        {label: '客户ID', name: 'customerId'},
        {label: '客户名称', name: 'customerName'},
      ],
      companyOptions: [],
      orderStatusOptions: [],
      timeLimitOptions:[],
      exportLoading:false,
      exportColumns:[
        {field:'orderNo',title:'订单号'},
        {field:'time',title:'开单时间'},
        {field:'companyNo',title:'销售公司'},
        {field:'orderPrice',title:'订单售价'},
        {field:'totalProductCost',title:'总产品成本'},
        {field:'totalOperateCost',title:'总运营成本'},
        {field:'profit',title:'利润'},
        {field:'profitMargin',title:'利润率'},
      ],
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
      activeCustomerName:"",
      activeCustomerId:"",
      selectCustomerTitle:'选择客户',
      selectCustomerVisible:false,
      isSelect:false,
    }
  },
  created() {
    this.getOptions()
    this.getFinanceList()
  },
  mounted () {
    this.$nextTick(()=>{
      this.getChartsData()
    })
  },
  methods: {
    getOptions() {
      let Obj = getOptions()
      if (Obj.orderStatus) for (let i in Obj.orderStatus) this.orderStatusOptions.push({
        label: Obj.orderStatus[i],
        value: i
      })
      if (Obj.company) for (let i in Obj.company) this.companyOptions.push({label: Obj.company[i], value: i})
      if (Obj.timeLimit) for (let i in Obj.timeLimit) this.timeLimitOptions.push({label: Obj.timeLimit[i], value: i})
    },
    getFinanceList() {
      fastGet(baseUrl + 'getList', this.limitQuery, false).then(res => {
        if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
        this.financeList = res.data.list
        this.total = res.data.total
        this.isSelect = false
      })
    },
    searchEvent() {
      this.limitQuery.page = 1
      this.getFinanceList()
    },
    getChartsData() {
      this.chartsLoading = true
      fastGet(baseUrl + 'getChartsData', this.chartLimitQuery, false).then(res => {
        this.chartsLoading = false
        if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
        this.chartsList.xAxis.data = res.data.xAxis
        this.chartsList.series[0].data = res.data.yAxis.cost
        this.chartsList.series[1].data = res.data.yAxis.profit
        this.chartsList.series[2].data = res.data.yAxis.price
        this.initOptions()
      })
    },
    checkboxChange() {
      this.isSelect = this.$refs.table.getCheckboxRecords(1).length >= 1
    },
    searchChartsEvent() {
      this.getChartsData()
    },
    initOptions() {
      this.chart = this.$echarts.init(document.getElementById("chart"))
      this.chart.setOption(this.chartsList)
      // 执行echarts自带的resize方法，即可做到让echarts图表自适应
      window.addEventListener("resize", () => this.$echarts.init(document.getElementById("chart")).resize())
    },
    finishClick(row) {
      this.showConfirmForm('确定要完成订单【' + row.orderNo + '】吗？', [row.id])
    },
    multiFinishClick() {
      let tempList = this.$refs.table.getCheckboxRecords(1)
      if (tempList < 1) return this.$notify.error({
        title: '提示',
        message: '请选择要完成的订单',
        position: 'bottom-left'
      })
      let ids = []
      tempList.map(item => {
        if (item.status === 'unfinish') ids.push(item.id)
      })
      if (ids.length === 1) return this.showConfirmForm('确定要完成订单【' + tempList[0].orderNo + '】吗？', [ids])
      let message = ids.length === tempList.length ? '确定要完成选中的' + ids.length + '个订单吗？' : '当前选中' + tempList.length + '个订单，其中' + (tempList.length - ids.length) + '个已完成，确定要完成其余选中的' + ids.length + '个订单吗？'
      this.showConfirmForm(message, ids)
    },
    showConfirmForm(message, ids) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.submitFinishEvent(ids))
    },
    submitFinishEvent(ids) {
      fastPost('/order/finish', {ids: ids}, true).then(res => {
        if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
        this.getFinanceList()
      })
    },
    viewClick(row) {
      this.showFromEvent('查看订单:【' + row.orderNo + '】', row, 'update')
    },
    showFromEvent(title, data) {
      this.dialogTitle = title
      this.activeForm = Object.assign({}, data)
      this.dialogVisible = true
    },
    cancelFrom() {
      this.dialogVisible = false
    },
    filterCompanyName({cellValue}) {
      let arr = this.companyOptions.filter(item => item.value === String(cellValue))
      return arr.length > 0 ? arr[0].label : "";
    },
    filterOrderStatus({cellValue}) {
      let arr = this.orderStatusOptions.filter(item => item.value === String(cellValue))
      return arr.length > 0 ? arr[0].label : "";
    },
    //全部导出
    exportData: myDebounce(function () {
      this.exportLoading = true
      fastGet(baseUrl + 'getList', {limit: 0, page: 1}, false).then((res) => {
        this.exportLoading = false
        if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
        this.exportEvent('财务列表【' + formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + '】', res.data.list, this.exportColumns)
      });
    }),
    //选中导出
    exportSelect: myDebounce(function () {
      if (this.$refs.table.getCheckboxRecords(1).length === 0) return this.$notify.error({ title: '提示', message: '请选择要导出的订单', position: 'bottom-left' })
      this.exportEvent('财务列表(选中导出)【' + formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + '】', this.$refs.table.getCheckboxRecords(1), this.exportColumns)
    }),
    exportEvent(filename, data, columns) {
      this.$refs.table.exportData({
        filename: filename,
        type: 'csv',
        data: data,
        columns: columns,
      })
    },
    //导出产品列表
    exportProduct: myDebounce(function (){
      let tempList = this.$refs.table.getCheckboxRecords(1)
      if (tempList.length < 1) return this.$notify.error({title: '提示', message: '请选择要打印的订单', position: 'bottom-left'})
      if (!isAllEqual(tempList.map(item => item.customerId))) return this.$notify.error({title: '提示', message: '请选择同一客户的订单', position: 'bottom-left'})
      if (!isAllEqual(tempList.map(item => item.companyNo))) return this.$notify.error({title: '提示', message: '请选择同一公司的订单', position: 'bottom-left'})
      let ids = []
      tempList.map(item =>  ids.push(item.id))
      let companyName = this.companyOptions.filter(item => item.value === String(tempList[0].companyNo))[0].label
      fastGet('/order/getExportDataByIds', {ids: ids}, false).then(res => {
        if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
        this.$refs.exportProductList.exportEvent('产品列表(共'+res.data.list.length+'条)【客户:'+tempList[0].customerName+'】【公司:'+companyName+'】【日期:' + formatDate(new Date(), 'yyyy-MM-dd') + '】', res.data.list, this.exportProductColumns)
      })
    }),
  //   printClick(action) {
  //     let tempList = this.$refs.table.getCheckboxRecords(1)
  //     if (tempList.length < 1) return this.$notify.error({title: '提示', message: '请选择要打印的订单', position: 'bottom-left'})
  //     if (!isAllEqual(tempList.map(item => item.customerId))) return this.$notify.error({title: '提示', message: '请选择同一客户的订单', position: 'bottom-left'})
  //     if (!isAllEqual(tempList.map(item => item.companyNo))) return this.$notify.error({title: '提示', message: '请选择同一公司的订单', position: 'bottom-left'})
  //     let ids = []
  //     tempList.map(item =>  ids.push(item.id))
  //     switch (action) {
  //       case 'paymentDetails':
  //         this.printPaymentDetails(ids,tempList[0].customerName,tempList[0].companyNo)
  //         break;
  //       case 'invoice':
  //         this.printInvoice(ids,tempList[0].customerName,tempList[0].companyNo)
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   //打印收款明细
  //   printPaymentDetails(ids,customerName,companyNo) {
  //
  //   },
  //   //打印发票
  //   printInvoice(ids,customerName,companyNo) {
  //     fastGet('/order/getInvoiceDataByIds', {ids: ids}, false).then(res => {
  //       if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
  //       this.$refs.printInvoice.printEvent({time:formatDate(new Date(), 'yyyy年MM月dd日'),customerName:customerName,companyNo:companyNo,...res.data})
  //     })
  //   },
  },
  beforeDestroy() {
    /* 页面组件销毁的时候，移除绑定的监听resize事件，否则的话，多渲染几次容易导致内存泄漏和额外CPU或GPU占用哦*/
    window.removeEventListener("resize", () => this.$echarts.init(document.getElementById("chart")).resize());
  },
}
</script>

<style lang="scss" scoped>
.finance {
  padding: 12px;
  .table-content {
    height: calc(100vh - 225px);
    .table {
    }
  }
  .region {
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
    padding: 10px 10px 50px 10px;
    border-radius: 8px;
    background-color: #fff;
  }
  .head-region{
    display: flex;
    flex-wrap:wrap;
    width: 100%;
    justify-content:space-around;
    margin-bottom: 15px;
    .chart-region{
      //width: 32.9%;
      width: 100%;
      //margin-right: 0.6%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .select_chart{
        display: flex;
        margin: 0 auto;
      }
      .chart{
        width: 100%;
        height:25rem;
      }
    }
    .chart-region:last-child{
      margin-right: 0;
    }
  }

}
</style>
