<template>
  <div class="productLibrary">
    <div class="table-region">
      <!--搜索框-->
      <div class="search-region" >
        <vxe-toolbar ref="Toolbar" :refresh="{query: getProductList}" custom class="toolbar">
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
          <vxe-table ref="table" class="table myTable-scrollbar " :data="productList" keep-source stripe resizable show-overflow border :loading="loading"
                     :row-config="{ isCurrent: true, isHover: true} " :checkbox-config="{range: true ,highlight:true}"  align="center" height="100%" >
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
      <el-form :model="activeForm" label-width="90px" :rules="rules" ref="activeForm" size="mini">
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
        <el-button type="primary" @click="submitFrom" size="mini">确 定</el-button>
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

const  upload = process.env.VUE_APP_BASE_API + 'sys/upload/uploadImage'
import mySearch from "@/components/MySearch/MySearch.vue";
import {fastGet,fastPost} from "@/api";
import {getToken} from "@/utils/auth";
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
    getProductList(){
      this.loading = true
      fastGet(baseUrl+'getList',this.limitQuery,false).then(res=>{
        this.loading = false
        res.data.list.map(item => item.imagesList = item.images.map(img => img.url))
        this.productList = res.data.list
        this.total = res.data.total
      })
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
    submitFrom:myDebounce(function () {
      let data = Object.assign({}, this.activeForm)
      delete data.imagesList
      fastPost(baseUrl + this.activeAction, data,true).then(() => {
          this.dialogVisible = false
          this.getCustomerList()
      })
    }),
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
    showConfirmForm(message, ids) {
      this.$confirm(message, '提示', this.confirmOptions).then(() => this.submitDelete(ids))
    },
    submitDelete:myDebounce(function (ids) {
      fastPost(baseUrl + 'delete', {ids:ids},true).then(res => {
        ids.map(id => this.productList = this.productList.filter(item => item.id !== id))
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
    selectFactoryClick(){
      this.activeFactoryId = this.activeForm.factoryId
      this.selectTitle = '当前厂家:'+this.activeForm.factoryName
      this.selectDialogVisible = true
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
    //全部导出
    exportData: myDebounce(function () {
      this.exportLoading = true
      fastGet(baseUrl + 'getList', {limit:0,page: 1},false).then((res) => {
        this.exportLoading = false
        this.exportEvent('产品列表【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',res.data.list,this.exportColumns)
      });
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
