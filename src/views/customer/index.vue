<template>
  <div class="customer">
    <div class="table-region">
      <!--搜索框-->
      <div class="search-region">
        <vxe-toolbar ref="Toolbar" :refresh="{query: getCustomerList}" custom class="toolbar">
          <template #buttons>
            <my-search :limit-query="limitQuery" @updateList="searchEvent" :key-type="keyType"/>
            <transition name="fade"><el-tag v-if="checkboxCount" class="count-tag" effect="dark" size="medium" color="#3D7EFF">{{checkboxCount}}</el-tag></transition>
            <transition name="fade"><vxe-button v-if="pageType==='normal' && checkboxCount" size="mini" @click="editClick"><i class="el-icon-edit"/> 批量编辑</vxe-button></transition>
            <transition name="fade"><vxe-button v-if="pageType==='normal' && checkboxCount" size="mini" @click="deleteClick"><i class="el-icon-delete"/> 批量删除</vxe-button></transition>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="addClick"><i class="el-icon-plus"/> 新 增</vxe-button>
            <el-dropdown v-if="pageType==='normal'" trigger="click" class="margin">
              <vxe-button :loading="exportLoading" type="primary" size="mini">
                <i class="el-icon-printer"/> 导 出 <i class="el-icon-arrow-down el-icon--right"/>
              </vxe-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span @click="exportData">全部导出</span></el-dropdown-item>
                <el-dropdown-item><span @click="exportSelect">导出选中</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </vxe-toolbar>
      </div>
      <!--表格-->
      <div class="table-content">
        <vxe-table ref="table" class="table myTable-scrollbar " :data="customerList" resizable keep-source stripe show-overflow round :loading="loading"
                   :row-config="{ isCurrent: true, isHover: true} " :checkbox-config="{range: true ,highlight:true}" align="center" height="100%"
                   @checkbox-change="checkboxChange" @checkbox-all="checkboxChange" @checkbox-range-end="checkboxChange" :scroll-y="{enabled: true}">
          <vxe-table-column v-if="pageType==='normal'" type="checkbox" width="45" align="center" fixed="left"/>
          <vxe-table-column title="操作" align="center" width="180">
            <template v-slot="{ row }">
              <vxe-button v-if="pageType==='normal'" size="mini" @click="editRowClick(row)"><i class="el-icon-edit"/> 编 辑</vxe-button>
              <el-popconfirm v-if="pageType==='normal'" style="margin-left: 10px" title="此操作将删除, 是否继续?" icon="el-icon-info" @confirm="deleteRowClick(row)" confirm-button-text="确定" cancel-button-text="取消">
                <vxe-button size="mini" slot="reference"><i class="el-icon-delete"/> 删 除</vxe-button>
              </el-popconfirm>
              <vxe-button v-if="pageType==='select'" size="mini" @click="selectClick(row)"><i class="el-icon-check"/> 选 择</vxe-button>
            </template>
          </vxe-table-column>
          <vxe-table-column field="id" title="ID"/>
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
      <el-form :model="activeForm" label-width="80px" :rules="activeAction==='multiUpdate' ? {} : rules" ref="activeForm" size="mini">
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
        <el-button type="primary" @click="submitFromClick" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mySearch from "@/components/MySearch/MySearch.vue";
import {fastGet, fastPost} from "@/api";
import {formatDate, myDebounce} from "@/utils/tools";
import {Notification} from "element-ui";

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
      checkboxCount:0,
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
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
      },
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
    async getCustomerList() {
      this.loading = true
      const res = await fastGet(baseUrl + 'getList', this.limitQuery,false)
      this.loading = false
      this.customerList = res.data.list
      this.total = res.data.total
      this.isSelect = false
    },
    //获取所有选中的行
    checkboxChange() {
      this.checkboxCount = this.$refs.table.getCheckboxRecords(1).length > 0 ? `已选中`+this.$refs.table.getCheckboxRecords(1).length+`个运单` : 0
    },
    addClick() {
      this.showFromEvent('新增客户', {},  'add')
    },
    editClick() {
      let ids = this.getCheckboxRecordsEvent('修改', '客户')
      if (ids.length > 0) this.showFromEvent('批量编辑' + ids.length + '位客户资料', {ids:ids},  'multiUpdate')
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
    submitFromClick:myDebounce(function () {
      //批量修改则不需要验证,仅需判断是否修改了数据
      if (this.activeAction === 'multiUpdate'){
        if(Object.keys(this.activeForm).length === 1) return Notification({
          title: '提示',
          message:'请至少修改一项',
          type: 'warning',
          position: 'bottom-left',
          duration: 5 * 1000,
          showClose: true
        })
        this.submitFromEvent()
        return
      }
      //校验并提交
      this.$refs.activeForm.validate( (valid) =>  {
        if (!valid) return
        this.submitFromEvent()
      })
    }),
    async submitFromEvent(){
      await fastPost(baseUrl + this.activeAction, this.activeForm,true)
      this.dialogVisible = false
      switch (this.activeAction) {
        case 'add':
          await this.getCustomerList()
          break
        case 'update':
          this.customerList = this.customerList.map(item => item.id === this.activeForm.id ? this.activeForm : item)
          break
        case 'multiUpdate':
          this.multiUpdateEvent()
          break
      }
    },
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
      if (ids.length > 0) this.showConfirmForm('正在批量删除' + ids.length + '个客户,是否继续?', ids)
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
      this.isSelect = false
      ids.map(id => this.customerList = this.customerList.filter(item => item.id !== id))
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
    exportData: myDebounce(async function () {
      this.exportLoading = true
      const res = await fastGet(baseUrl + 'getList', {limit:0,page: 1},false)
      this.exportLoading = false
      this.exportEvent('客户列表【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',res.data.list,this.exportColumns)
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
.fade-enter-active, .fade-leave-active{
  transition: all .25s ease-in-out;
}

.fade-leave-to, .fade-enter{
  opacity: 0;
  transform: translateY(-10px);
}
.customer {
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
