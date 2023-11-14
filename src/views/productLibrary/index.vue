<template>
  <div class="productLibrary">
    <div class="table-region">
      <!--搜索框-->
      <div class="search-region" >
        <vxe-toolbar ref="Toolbar" :refresh="{query: getProductList}" custom class="toolbar">
          <template #buttons>
            <my-search :limit-query="limitQuery" @updateList="searchEvent" :key-type="keyType"/>
            <transition name="fade"><el-tag v-if="checkboxCount" class="count-tag" effect="dark" size="medium" color="#3D7EFF">{{checkboxCount}}</el-tag></transition>
            <transition name="fade"><vxe-button v-if="pageType==='normal' && checkboxCount" size="mini" @click="editClick"><i class="el-icon-edit"/> 批量编辑</vxe-button></transition>
            <transition name="fade"><vxe-button v-if="pageType==='normal' && checkboxCount" size="mini" @click="deleteClick"><i class="el-icon-delete"/> 批量删除</vxe-button></transition>
            <vxe-button v-if="pageType==='normal'" size="mini" @click="addClick"><i class="el-icon-plus"/> 新 增</vxe-button>
            <el-dropdown v-if="pageType==='normal'" trigger="click" class="margin" @command="handleExport">
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
          <vxe-table ref="table" class="table myTable-scrollbar " :data="productList" resizable keep-source stripe show-overflow round :loading="loading"
                     :row-config="{ isCurrent: true, isHover: true} " :checkbox-config="{range: true ,highlight:true}"  align="center" height="100%"
                     @checkbox-change="checkboxChange" @checkbox-all="checkboxChange" @checkbox-range-end="checkboxChange" :scroll-y="{enabled: true}">
            <vxe-table-column type="checkbox" width="45" align="center" fixed="left" v-if="pageType==='normal'"/>
            <vxe-table-column title="操作" align="center" width="180" fixed="left">
              <template v-slot="{ row }">
<!--                <vxe-button v-if="pageType==='normal'" size="mini" @click="recordClick(row)"><i class="el-icon-time"/> 记 录</vxe-button>-->
                <vxe-button v-if="pageType==='normal'" size="mini" @click="editRowClick(row)"><i class="el-icon-edit"/> 编 辑</vxe-button>
                <el-popconfirm v-if="pageType==='normal'" style="margin-left: 10px" title="此操作将删除, 是否继续?" icon="el-icon-info" @confirm="deleteRowClick(row)" confirm-button-text="确定" cancel-button-text="取消">
                  <vxe-button size="mini" slot="reference"><i class="el-icon-delete"/> 删 除</vxe-button>
                </el-popconfirm>
                <vxe-button v-if="pageType==='select'" size="mini" @click="selectClick(row)"><i class="el-icon-check"/> 选 择</vxe-button>
              </template>
            </vxe-table-column>
            <vxe-table-column field="id" width="60" title="ID"/>
            <vxe-table-column field="name" title="产品名"/>
            <vxe-table-column title="图片" width="100" align="center">
              <template v-slot="{ row }">
                <el-image
                  style="width: 25px; height: 25px"
                  :src="row.imagesList[0]"
                  :preview-src-list="row.imagesList"/>
              </template>
            </vxe-table-column>
            <vxe-table-column field="specifications" title="规格"/>
            <vxe-table-column field="unit" title="单位"/>
            <vxe-table-column field="factoryName" title="厂家"/>
            <vxe-table-column field="productCost" title="产品成本"/>
            <vxe-table-column field="salesPrice" title="默认销售价"/>
          </vxe-table>
    </div>
      <!--分页选项-->
      <el-pagination
        class="el-pagination"
        @size-change="getProductList"
        :page-sizes="[100,200,300,500]"
        :page-size.sync="limitQuery.limit"
        :current-page.sync="limitQuery.page"
        @current-change="getProductList"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"/>
    </div>

    <!--编辑表单-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" width="1000px" @close="cancelFrom">
      <el-form :model="activeForm" label-width="100px" :rules="activeAction==='multiUpdate' ? {} : rules" ref="activeForm" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名" prop="name">
              <el-input v-model="activeForm.name" placeholder="请输入产品名" class="form-item"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specifications">
              <el-input v-model="activeForm.specifications" placeholder="请输入规格" class="form-item"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="activeForm.unit" placeholder="请输入产品单位" class="form-item"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家" prop="factoryName">
              <vxe-button size="mini" class="form-item" @click="selectFactoryClick">{{activeForm.factoryName ? activeForm.factoryName : "请选择厂家"}}</vxe-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品成本" prop="productCost">
              <el-input v-model="activeForm.productCost" placeholder="请输入产品成本" class="form-item"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认销售价" prop="salesPrice">
              <el-input v-model="activeForm.salesPrice" placeholder="请输入销售价" class="form-item"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
        <el-form-item label="产品图片" prop="images" >
          <el-upload
            :action="upload"
            multiple
            list-type="picture-card"
            :headers="{Authorization: 'Bearer ' + getToken()}"
            :file-list="activeForm.images"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleOnExceed"
            :on-success="handleOnSuccess"
            :limit="9" >
            <i class="el-icon-plus"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFrom" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitFromClick" size="mini" :loading="submitButtonLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片展示 -->
    <el-dialog fullscreen :visible.sync="bigImgDialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt=""/>
    </el-dialog>

    <!-- 选择厂家 -->
    <el-dialog :title="selectTitle" :visible.sync="selectDialogVisible" append-to-body top="1vh" width="1200px">
      <select-factory :page-type="'select'" @selectEvent="selectFactoryEvent"/>
    </el-dialog>


  </div>
</template>

<script>
import {formatDate, myDebounce} from "@/utils/tools";

const upload = process.env.VUE_APP_BASE_API + 'sys/upload/uploadImage'
import mySearch from "@/components/MySearch/MySearch.vue";
import {fastGet,fastPost} from "@/api";
import {getToken} from "@/utils/auth";
import {Notification} from "element-ui";
const baseUrl = '/product/'
export default {
  name: "index",
  props:{
    pageType:{
      type: String,
      default: 'normal'
    }
  },
  components: {
    mySearch,
    selectFactory:()=>import('@/views/factory/index.vue')
  },
  created() {
    this.getProductList()
  },
  data(){
    return{
      upload,
      checkboxCount:0,
      submitButtonLoading:false,
      reverse: true,
      loading:false,
      limitQuery: {
        page: 1,
        limit: 100,
      },
      total:0,
      productList:[],
      keyType:[
        { label: '产品ID', name: 'id' },
        { label: '产品名', name: 'name' },
        { label: '厂家名', name: 'factoryName' },
        { label: '厂家联系电话', name: 'factoryMobile' },
      ],
      rules: {
        name: [
          { required: true, message: '请输入产品名', trigger: 'blur' },
        ],
        specifications: [
          { required: true, message: '请输入产品规格', trigger: 'blur' },
        ],
        unit: [
          { required: true, message: '请输入产品单位', trigger: 'blur' },
        ],
        productCost: [
          { required: true, message: '请输入产品成本', trigger: 'blur' },
        ],
        salesPrice: [
          { required: true, message: '请输入产品默认销售价', trigger: 'blur' },
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
      bigImgDialogVisible:false,
      dialogImageUrl:"未定义",
      disabledUP: false,
      selectDialogVisible:false,
      selectTitle:"未定义",
      activeFactoryId:null,
      drawer:false,
      drawerTitle:"未定义",
      logList:[],
      exportLoading:false,
      exportColumns:[
        {field:'id',title:'ID'},
        {field:'name',title:'产品名'},
        {field:'unit',title:'单位'},
        {field:'specifications',title:'规格'},
        {field:'factoryName',title:'厂家'},
        {field:'productCost',title:'产品成本'},
        {field:'salesPrice',title:'默认销售价'},
      ]
    }
  },
  methods:{
    getToken,
    async getProductList(){
      this.loading = true
      const res = await fastGet(baseUrl+'getList',this.limitQuery,false)
      this.loading = false
      res.data.list.map(item => item.imagesList = item.images.map(img => img.url))
      this.productList = res.data.list
      this.total = res.data.total
      this.checkboxCount = 0
    },
    checkboxChange() {
      this.checkboxCount = this.$refs.table.getCheckboxRecords(1).length > 0 ? `已选中`+this.$refs.table.getCheckboxRecords(1).length+`个运单` : 0
    },
    addClick() {
      this.showFromEvent('新增产品', {images:[]},  'add')
    },
    editClick() {
      let ids = this.getCheckboxRecordsEvent('修改', '产品')
      if (ids.length > 0) this.showFromEvent('编辑' + ids.length + '个产品资料', {ids:ids},  'multiUpdate')
    },
    editRowClick(row) {
      this.showFromEvent('编辑产品:【' + row.name + '】', row,  'update')
    },
    showFromEvent(title, data, action) {
      this.dialogTitle = title
      this.activeAction = action
      this.activeForm = Object.assign({}, data)
      this.dialogVisible = true
    },
    handleRemove(e) {
      this.activeForm.images.map((img,index)=>{
        if(img.url===e.url){
          this.activeForm.images.splice(index,1)
        }
      })
    },
    handlePictureCardPreview(file) {
      this.picturePreview(file.url)
    },
    handleOnExceed(file) {
      if (file.length > 0) {
        this.$notify.error({
          title: '错误',
          message: '只能上传一张图片',
          position: 'bottom-left'
        })
      }
    },
    handleOnSuccess(res) {
      this.activeForm.images.push( res.data )
    },
    picturePreview(url){
      this.dialogImageUrl = url
      this.bigImgDialogVisible = true
    },
    submitFromClick:myDebounce(function () {
      if (this.activeAction === 'multiUpdate'){
        if(Object.keys(this.activeForm).length === 1) return this.showNotification('请至少修改一项','warning')
        this.submitFromEvent()
        return
      }
      //如果没选厂家则返回
      if(!this.activeForm.factoryId) return this.showNotification('请先选择厂家','warning')
      this.$refs.activeForm.validate((valid) =>  {
        if (!valid) return
        this.submitFromEvent()
      })
    }),
    async submitFromEvent() {
      let data = Object.assign({}, this.activeForm)
      delete data.imagesList
      this.submitButtonLoading = true
      await fastPost(baseUrl + this.activeAction, data,true)
      this.submitButtonLoading = false
      this.dialogVisible = false
      await this.getProductList()
    },
    showNotification(message,type){
      Notification({
        title: '提示',
        message:message,
        type: type,
        position: 'bottom-left',
        duration: 5 * 1000,
        showClose: true
      })
    },
    cancelFrom() {
      this.dialogVisible = false
    },
    deleteClick() {
      let ids = this.getCheckboxRecordsEvent('删除', '产品')
      if (ids.length > 0) this.showConfirmForm('正在删除' + ids.length + '个产品', ids)
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
      ids.map(id => this.productList = this.productList.filter(item => item.id !== id))
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
    selectFactoryClick(){
      this.activeFactoryId = this.activeForm.factoryId;
      this.selectTitle = this.activeAction === 'add' ? '新增厂家' : '当前厂家:'+this.activeForm.factoryName;
      this.selectDialogVisible = true;
    },
    selectFactoryEvent(data){
      this.activeForm.factoryId = data.id
      this.activeForm.factoryName = data.name
      this.selectDialogVisible = false
    },
    searchEvent() {
      this.limitQuery.page = 1
      this.getProductList()
    },
    selectClick(row){
      this.$emit('selectEvent', row)
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
      this.exportEvent('产品列表【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',res.data.list,this.exportColumns)
    }),
    //选中导出
    exportSelect: myDebounce(function () {
      if (this.$refs.table.getCheckboxRecords(1).length === 0) return this.$notify.error({ title: '提示',  message: '请选择要导出的产品',  position: 'bottom-left' })
      this.exportEvent('产品列表(选中导出)【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',this.$refs.table.getCheckboxRecords(1),this.exportColumns)
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
.productLibrary{
  padding: 12px;
  .table-region{
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
    padding: 10px 10px 50px 10px;
    border-radius: 8px;
    background-color: #fff;
    .search-region{
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
    .table-content{
      height: calc(100vh - 225px);
        .table{
        }
    }
  }
  .form-item{
    width: 300px;
  }
}
</style>
