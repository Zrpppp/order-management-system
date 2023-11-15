<template>
  <div class="order">
    <div class="table-region">
      <!--搜索框-->
      <div class="search-region">
        <vxe-toolbar ref="Toolbar" :refresh="{query: getOrderList}" custom class="toolbar">
          <template #buttons>
            <my-search :limit-query="limitQuery" @updateList="searchEvent" :key-type="keyType"/>
            <transition name="fade"><el-tag v-if="checkboxCount" class="count-tag" effect="dark" size="medium" color="#3D7EFF">{{checkboxCount}}</el-tag></transition>
            <transition name="fade"><vxe-button style="margin-right:10px" v-if="checkboxCount" size="mini" @click="deleteClick"><i class="el-icon-delete"/> 批量删除</vxe-button></transition>
            <vxe-select size="mini" v-model="limitQuery.status" placeholder="筛选订单状态" :options="orderStatusOptions"
                        style="width: 110px;margin-right:10px" @change="searchEvent" clearable/>
            <vxe-select size="mini" v-model="limitQuery.companyId" placeholder="筛选销售公司" :options="companyOptions"
                        style="width: 150px;margin-right: 10px" @change="searchEvent" clearable/>
            <select-time :limit-query="limitQuery" @updateList="searchEvent"/>
            <vxe-button size="mini" @click="addClick"><i class="el-icon-plus"/> 新 增</vxe-button>
<!--            <vxe-button size="mini" @click="editClick"><i class="el-icon-edit"/> 编 辑</vxe-button>-->
            <el-dropdown trigger="click" class="margin" @command="handleExport">
              <vxe-button :loading="exportLoading" type="primary" size="mini">
                <i class="el-icon-printer"/> 导 出 <i class="el-icon-arrow-down el-icon--right"/>
              </vxe-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="exportData">全部导出</el-dropdown-item>
                <el-dropdown-item command="exportSelect">导出选中</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </vxe-toolbar>
      </div>
      <!--表格-->
      <div class="table-content">
        <vxe-table ref="table" class="table myTable-scrollbar " :data="orderList" resizable keep-source stripe show-overflow round :loading="loading"
                   :row-config="{ isCurrent: true, isHover: true} " :checkbox-config="{range: true ,highlight:true}"  align="center" height="100%"
                   @checkbox-change="checkboxChange" @checkbox-all="checkboxChange" @checkbox-range-end="checkboxChange" :scroll-y="{enabled: true}">
          <vxe-table-column type="checkbox" width="45" align="center" fixed="left"/>
          <vxe-table-column title="操作" align="center" width="260" fixed="left">
            <template v-slot="{ row }">
              <vxe-button size="mini" @click="editRowClick(row)"><i class="el-icon-edit"/> 编 辑</vxe-button>
              <vxe-button size="mini" @click="printClick(row)"><i class="el-icon-printer"/> 打 印</vxe-button>
              <el-popconfirm style="margin-left: 10px" title="此操作将删除, 是否继续?" icon="el-icon-info" @confirm="deleteRowClick(row)" confirm-button-text="确定" cancel-button-text="取消">
                <vxe-button size="mini" slot="reference"><i class="el-icon-delete"/> 删 除</vxe-button>
              </el-popconfirm>
            </template>
          </vxe-table-column>
          <vxe-table-column field="orderNo" title="订单号"/>
          <vxe-table-column field="status" title="订单状态" :formatter="filterOrderStatus"/>
          <vxe-table-column field="companyNo" title="销售公司" :formatter="filterCompanyName"/>
          <vxe-table-column field="customerName" title="客户名"/>
          <vxe-table-column field="productCategory" title="产品种类数量"/>
          <vxe-table-column field="operateCost" title="运营成本"/>
          <vxe-table-column field="orderPrice" title="订单售价"/>
          <vxe-table-column field="remark" title="备注"/>
          <vxe-table-column field="time" title="开单时间"/>
        </vxe-table>
      </div>
      <!--分页选项-->
      <el-pagination
        class="el-pagination"
        @size-change="getOrderList"
        :page-sizes="[100,200,300,500]"
        :page-size.sync="limitQuery.limit"
        :current-page.sync="limitQuery.page"
        @current-change="getOrderList"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"/>
    </div>

    <!--编辑表单-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="2vh" width="1200px" @close="cancelFrom">
        <order-form :order-data="activeForm" :company-options="companyOptions" :order-status-options="orderStatusOptions" :page-type="activeAction"
                    @submitFrom="submitFrom" @cancelFrom="cancelFrom"/>
    </el-dialog>

    <!--筛选打印模板并打印-->
    <el-dialog :title="printTitle" :visible.sync="templateDialogVisible"  width="500px">
      <select-template :print-data="printData" @cancelFrom="templateDialogVisible = false"/>
    </el-dialog>
  </div>
</template>

<script>
import orderForm from "@/views/order/comp/orderForm.vue"
import mySearch from "@/components/MySearch/MySearch.vue";
import selectTime from "@/components/selectTime/selectTime.vue";
import selectTemplate from "@/components/selectTemplate/selectTemplate.vue";
import {fastGet, fastPost, getOptions} from "@/api";
import {formatDate, myDebounce} from "@/utils/tools";
const baseUrl = '/order/'
export default {
  name: "index",
  components: {
    mySearch,
    orderForm,
    selectTime,
    selectTemplate,
  },
  data() {
    return {
      loading: false,
      checkboxCount:0,
      limitQuery: {
        page: 1,
        limit: 100,
        companyId:"",
        status:"",
      },
      total: 0,
      orderList: [],
      keyType: [
        {label: '订单号', name: 'orderNo'},
        {label: '客户名', name: 'customerName'},
      ],
      rules: {},
      dialogVisible: false,
      dialogTitle: '未定义',
      activeAction: "",
      activeIds: null,
      activeForm: {},
      companyOptions: [],
      orderStatusOptions: [ ],
      statusValue:"",
      printTitle:"未定义",
      templateDialogVisible:false,
      printData:{},
      exportLoading:false,
      exportColumns:[
        {field:'orderNo',title:'订单号'},
        {field:'time',title:'开单时间'},
        {field:'companyNo',title:'销售公司'},
        {field:'customerName',title:'客户名'},
        {field:'status',title:'订单状态'},
        {field:'productCategory',title:'产品种类数量'},
        {field:'operateCost',title:'运营成本'},
        {field:'orderPrice',title:'订单售价'},
        {field:'remark',title:'备注'},
      ]
    }
  },
  created() {
    this.getOptions()
    this.getOrderList()
  },
  methods: {
    getOptions(){
      let Obj = getOptions()
      if (Obj.orderStatus) for (let i in Obj.orderStatus) this.orderStatusOptions.push({label: Obj.orderStatus[i], value: i})
      if(Obj.company)  for (let i in Obj.company) this.companyOptions.push({label: Obj.company[i], value: i})
    },
    async getOrderList() {
      this.loading = true
      const res = await fastGet(baseUrl+'getList', this.limitQuery,false)
      this.loading = false
      this.orderList = res.data.list
      this.total = res.data.total
      this.checkboxCount = 0
    },
    checkboxChange() {
      this.checkboxCount = this.$refs.table.getCheckboxRecords(1).length > 0 ? `已选中`+this.$refs.table.getCheckboxRecords(1).length+`个运单` : 0
    },
    addClick() {
      this.showFromEvent('新增订单', {consigneeName:"",consigneeMobile:"",consigneeAddress:"",orderPrice:""},  'add')
    },
    editClick() {
      let ids = this.getCheckboxRecordsEvent('修改', '订单')
      if (ids.length > 0) this.showFromEvent('编辑' + ids.length + '个订单', {ids:ids},  'multiUpdate')
    },
    editRowClick(row) {
      this.showFromEvent('编辑订单:【' + row.orderNo + '】', row,  'update')
    },
    showFromEvent(title, data, action) {
      this.dialogTitle = title
      this.activeAction = action
      this.activeForm = Object.assign({}, data)
      this.dialogVisible = true
    },
    submitFrom:myDebounce(async function (data) {
      await fastPost(baseUrl + this.activeAction, data,true)
      this.dialogVisible = false
      switch (this.activeAction) {
        case 'add':
          await this.getOrderList()
          break
        case 'update':
          this.orderList = this.orderList.map(item => item.id === data.id ? data : item)
          break
        case 'multiUpdate':
          this.multiUpdateEvent(data)
          break
      }
    }),
    cancelFrom() {
      this.dialogVisible = false
    },
    multiUpdateEvent(data){
      data.ids.map(id => this.orderList.map(item => {
          if (item.id === id) {
            for(let i in data) {
              for (let j in item){
                if (i === j) item[j] = data[i]
              }
            }
          }
        })
      )
    },
    deleteClick() {
      let ids = this.getCheckboxRecordsEvent('删除', '订单')
      if (ids.length > 0) this.showConfirmForm('正在删除' + ids.length + '个订单,是否继续?', ids)
    },
    deleteRowClick(row) {
      this.submitDelete([row.id])
    },
    async showConfirmForm(message, ids) {
      await this.$confirm(message, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      this.submitDelete(ids)
    },
    submitDelete:myDebounce(async function (ids) {
      await fastPost(baseUrl + 'delete', {ids:ids},true)
      await this.getOrderList()
    }),
    filterCompanyName({cellValue}){
      let arr = this.companyOptions.filter(item => item.value === String(cellValue))
      return arr.length > 0 ? arr[0].label : "";
    },
    filterOrderStatus({cellValue}){
      let arr = this.orderStatusOptions.filter(item => item.value === String(cellValue))
      return arr.length > 0 ? arr[0].label : "";
    },
    searchEvent() {
      this.limitQuery.page = 1
      this.getOrderList()
    },
    getCheckboxRecordsEvent(action, object) {
      if (this.$refs.table.getCheckboxRecords(1) < 1) return this.$notify.error({
        title: '提示',
        message: '请选择要' + action + '的' + object,
        position: 'bottom-left'
      })
      let ids = []
      this.$refs.table.getCheckboxRecords(1).map(item => ids.push(item.id))
      return ids
    },
    printClick(row){
      this.printTitle = "打印订单:【" + row.orderNo + "】"
      this.printData = Object.assign({},row)
      this.templateDialogVisible= true
    },
    handleExport(e){
      switch (e){
        case 'exportData':
          this.exportData()
          break
        case 'exportSelect':
          this.exportSelect()
          break
      }
    },
    //全部导出
    exportData: myDebounce(async function () {
      this.exportLoading = true
      const res = await fastGet(baseUrl + 'getList', {limit:0,page: 1},false)
      this.exportLoading = false
      this.exportEvent('订单列表【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',res.data.list,this.exportColumns)
    }),
    //选中导出
    exportSelect: myDebounce(function () {
      if (this.$refs.table.getCheckboxRecords(1).length === 0) return this.$notify.error({ title: '提示',  message: '请选择要导出的订单',  position: 'bottom-left' })
      this.exportEvent('订单列表(选中导出)【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',this.$refs.table.getCheckboxRecords(1),this.exportColumns)
    }),
    exportEvent(filename,data,columns){
      this.$refs.table.exportData({
        filename: filename,
        type: 'csv',
        data: data,
        columns:columns,
      })
    },
  },
}
</script>

<style lang="scss" scoped>

.order {
  padding: 12px;

  .table-region {
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
    padding: 10px 10px 50px 10px;
    border-radius: 8px;
    background-color: #fff;

    .search-region {
      .toolbar {
        .margin{
          margin:0 10px;
        }
        .count-tag{
          margin-right: 10px;
          border-radius: 20px;
          border: none;
          box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.10);
        }
      }
    }

    .table-content {
      height: calc(100vh - 225px);

      .table {
      }
    }
  }
}
</style>
