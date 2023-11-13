<template>
  <div class="customer">
    <div class="table-region">
      <!--搜索框-->
      <div class="search-region">
        <vxe-toolbar ref="Toolbar" :refresh="{query: getCustomerList}" custom class="toolbar">
          <template #buttons>
            <my-search :limit-query="limitQuery" @updateList="searchEvent" :key-type="keyType"/>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="addClick"><i class="el-icon-plus"/> 新 增</vxe-button>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="editClick"><i class="el-icon-edit"/> 编 辑</vxe-button>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="deleteClick"><i class="el-icon-delete"/> 删 除</vxe-button>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="exportData" :loading="exportLoading"><i class="el-icon-printer"/> 全部导出</vxe-button>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="exportSelect"><i class="el-icon-thumb"/> 导出选中</vxe-button>
          </template>
        </vxe-toolbar>
      </div>
      <!--表格-->
      <div class="table-content">
        <vxe-table ref="table" class="table myTable-scrollbar " :data="customerList" keep-source stripe resizable show-overflow border :loading="loading"
                   :row-config="{ isCurrent: true, isHover: true} " :checkbox-config="{range: true ,highlight:true}" align="center" height="100%" >
          <vxe-table-column type="checkbox" width="45" align="center" fixed="left" v-if="pageType==='normal'" />
          <vxe-table-column title="操作" align="center" width="180">
            <template v-slot="{ row }">
              <vxe-button v-if="pageType==='normal'" size="mini" @click="editRowClick(row)"><i class="el-icon-edit"/> 编 辑</vxe-button>
              <el-popconfirm v-if="pageType==='normal'" style="margin-left: 10px" title="此操作将删除, 是否继续?" icon="el-icon-info" @confirm="deleteRowClick(row)" confirm-button-text="确定" cancel-button-text="取消">
                <vxe-button size="mini" slot="reference"><i class="el-icon-delete"/> 删 除</vxe-button>
              </el-popconfirm>
              <vxe-button v-if="pageType==='select'" size="mini" @click="selectClick(row)"><i class="el-icon-check"/> 选 择</vxe-button>
            </template>
          </vxe-table-column>
          <vxe-table-column field="id" width="80" title="ID"/>
          <vxe-table-column field="name" title="客户名"/>
          <vxe-table-column field="contact" title="联系人"/>
          <vxe-table-column field="mobile" title="联系电话"/>
          <vxe-table-column field="address" title="地址"/>
        </vxe-table>
      </div>
      <!--分页选项-->
      <el-pagination
        class="el-pagination"
        @size-change="getCustomerList"
        :page-sizes="[100,200,300,500]"
        :page-size.sync="limitQuery.limit"
        :current-page.sync="limitQuery.page"
        @current-change="getCustomerList"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"/>
    </div>

    <!--编辑表单-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" width="900px" @close="cancelFrom">
      <el-form :model="activeForm" label-width="80px" :rules="rules" ref="activeForm" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名" prop="name">
              <el-input v-model="activeForm.name" placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="activeForm.contact" placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="activeForm.mobile" placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="activeForm.address" type="textarea" autosize placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFrom" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitFrom" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mySearch from "@/components/MySearch/MySearch.vue";
import {fastGet, fastPost} from "@/api";
import {formatDate, myDebounce} from "@/utils/tools";

const baseUrl = '/customer/'
export default {
  name: "index",
  props:{
    pageType:{
      type: String,
      default: 'normal'
    }
  },
  components: {
    mySearch
  },
  created() {
    this.getCustomerList()
  },
  data() {
    return {
      loading: false,
      limitQuery: {
        page: 1,
        limit: 100,
      },
      total: 0,
      customerList: [],
      keyType: [
        {label: '客户ID', name: 'id'},
        {label: '客户名', name: 'name'},
        {label: '联系人', name: 'contact'},
        {label: '联系电话', name: 'mobile'},
        {label: '地址', name: 'address'},
      ],
      rules: {},
      dialogVisible: false,
      dialogTitle: '未定义',
      activeAction: null,
      activeIds: null,
      activeForm: {
        id: null,
        name: null,
        mobile: null,
        address: null,
      },
      confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'},
      exportLoading:false,
      exportColumns:[
        {field:'id',title:'ID'},
        {field:'name',title:'客户名'},
        {field:'contact',title:'联系人'},
        {field:'mobile',title:'联系电话'},
        {field:'address',title:'地址'},
      ],
    }
  },
  methods: {
    getCustomerList() {
      this.loading = true
      fastGet(baseUrl + 'getList', this.limitQuery,false).then(res => {
        this.loading = false
        this.customerList = res.data.list
        this.total = res.data.total
        this.isSelect = false
      })
    },
    addClick() {
      this.showFromEvent('新增客户', {},  'add')
    },
    editClick() {
      let ids = this.getCheckboxRecordsEvent('修改', '客户')
      if (ids.length > 0) this.showFromEvent('编辑' + ids.length + '个客户资料', {ids:ids},  'multiUpdate')
    },
    editRowClick(row) {
      this.showFromEvent('编辑客户:【' + row.name + '】', row,  'update')
    },
    showFromEvent(title, data, action) {
      this.dialogTitle = title
      this.activeAction = action
      this.activeForm = Object.assign({}, data)
      this.dialogVisible = true
    },
    submitFrom:myDebounce(function () {
      fastPost(baseUrl + this.activeAction, this.activeForm,true).then(() => {
          this.dialogVisible = false
          switch (this.activeAction) {
            case 'add':
              this.getCustomerList()
              break
            case 'update':
              this.customerList = this.customerList.map(item => item.id === this.activeForm.id ? this.activeForm : item)
              break
            case 'multiUpdate':
              this.multiUpdateEvent()
              break
          }
      })
    }),
    cancelFrom() {
      this.dialogVisible = false
    },
    multiUpdateEvent(){
      this.isSelect = false
      this.activeForm.ids.map(id => this.customerList.map(item => {
          if (item.id === id) {
            for(let i in this.activeForm) {
              for (let j in item){
                if (i === j) item[j] = this.activeForm[i]
              }
            }
          }
        })
      )
    },
    deleteClick() {
      let ids = this.getCheckboxRecordsEvent('删除', '客户')
      if (ids.length > 0) this.showConfirmForm('正在删除' + ids.length + '个客户,是否继续?', ids)
    },
    deleteRowClick(row) {
      this.submitDelete([row.id])
    },
    showConfirmForm(message, ids) {
      this.$confirm(message, '提示', this.confirmOptions).then(() => this.submitDelete(ids))
    },
    submitDelete:myDebounce(function (ids) {
      fastPost(baseUrl + 'delete', {ids:ids},true).then(() => {
          this.isSelect = false
          ids.map(id => this.customerList = this.customerList.filter(item => item.id !== id))
      })
    }),
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
    searchEvent() {
      this.limitQuery.page = 1
      this.getCustomerList()
    },
    selectClick(row){
      this.$emit('selectEvent', row)
    },
    //全部导出
    exportData: myDebounce(function () {
      this.exportLoading = true
      fastGet(baseUrl + 'getList', {limit:0,page: 1},false).then((res) => {
        this.exportLoading = false
        this.exportEvent('客户列表【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',res.data.list,this.exportColumns)
      });
    }),
    //选中导出
    exportSelect: myDebounce(function () {
      if (this.$refs.table.getCheckboxRecords(1).length === 0) return this.$notify.error({ title: '提示',  message: '请选择要导出的客户',  position: 'bottom-left' })
      this.exportEvent('客户列表(选中导出)【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',this.$refs.table.getCheckboxRecords(1),this.exportColumns)
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
.customer {
  padding: 12px;

  .table-region {
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
    padding: 10px 10px 50px 10px;
    border-radius: 8px;
    background-color: #fff;

    .search-region {
      .toolbar {
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
