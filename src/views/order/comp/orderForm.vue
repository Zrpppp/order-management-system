<template>
  <div class="orderForm">
    <!--    订单信息    -->
    <el-form :model="formData" label-width="90px" :rules="rules" ref="orderForm" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号" prop="orderNo">
            <div v-if="pageType==='finance'">{{ formData.orderNo }}</div>
            <el-input v-else v-model="formData.orderNo" placeholder="不输入则自动生成" class="form-item"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售公司" prop="companyNo">
            <div v-if="pageType==='finance'">{{ filterCompanyName(formData.companyNo) }}</div>
            <el-select v-else v-model="formData.companyNo" placeholder="请选择" clearable filterable remote class="form-item">
              <el-option v-for="(item,index) in companyOptions" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客 户" prop="customerName">
            <div v-if="pageType==='finance'">{{ formData.customerName }}</div>
            <vxe-button v-else size="mini" class="form-item" @click="selectCustomerClick">{{formData.customerName ? formData.customerName : "请选择客户"}}</vxe-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货人" prop="consigneeName">
            <div v-if="pageType==='finance'">{{ formData.consigneeName}}</div>
            <el-input v-else v-model="formData.consigneeName" placeholder="请输入" class="form-item"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收货电话" prop="status">
            <div v-if="pageType==='finance'">{{ formData.consigneeMobile}}</div>
            <el-input v-else v-model="formData.consigneeMobile" placeholder="请输入" class="form-item"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货地址" prop="consigneeName">
            <div v-if="pageType==='finance'">{{ formData.consigneeAddress}}</div>
            <el-input v-else v-model="formData.consigneeAddress" placeholder="请输入" class="form-item"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运营成本" prop="operateCost">
            <div v-if="pageType==='finance'">{{ formData.operateCost}}</div>
            <el-input v-else v-model="formData.operateCost" placeholder="请输入" class="form-item"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单总售价" prop="orderPrice" >
            <div v-if="pageType==='finance'">{{ formData.orderPrice}}</div>
            <el-input v-else v-model="formData.orderPrice" placeholder="请输入" class="form-item" :disabled="isAuto"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="pageType !== 'add'">
          <el-form-item label="订单状态" prop="status">
            <div v-if="pageType==='finance'">{{ filterOrderStatus(formData.status)}}</div>
            <el-select v-else v-model="formData.status" placeholder="请选择" clearable filterable remote class="form-item">
              <el-option v-for="(item,index) in this.orderStatusOptions" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="订单备注" prop="remark">
            <div v-if="pageType==='finance'">{{ formData.remark}}</div>
            <el-input v-else v-model="formData.remark" type="textarea" autosize placeholder="请输入remark"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--  产品列表  -->
    <div > <i class="header-icon el-icon-info"/> 产品列表 </div>
    <vxe-toolbar :refresh="{query: getProductList}" custom>
      <template #buttons >
        <my-search :limit-query="limitQuery" @updateList="getProductList" :key-type="keyType"/>
        <vxe-button v-if="pageType!=='finance'" size="mini" @click="addClick"><i class="el-icon-plus"/> 新 增</vxe-button>
    <!--<vxe-button v-if="pageType!=='finance'" size="mini" @click="editClick"><i class="el-icon-edit"/> 编 辑</vxe-button>-->
        <vxe-button v-if="pageType!=='finance'" size="mini" @click="deleteClick"><i class="el-icon-delete"/> 删 除</vxe-button>
        <vxe-button size="mini" @click="exportData"><i class="el-icon-printer"/> 导 出</vxe-button>
        <vxe-switch v-if="pageType!=='finance'" style="margin-left: 5px" v-model="isAuto"  open-label="开启自动计价" close-label="关闭自动计价" @change="autoPricingEvent"/>
      </template>
    </vxe-toolbar>
    <vxe-table class="table myTable-scrollbar" :loading="loading"  border  ref="table" :data="productList"  stripe  highlight-hover-row show-overflow keep-source
               :edit-config="{trigger:'click', mode: 'cell',enabled:isEnabled}"  @edit-closed="updateProduct" @edit-actived="editActiveEvent"
               :checkbox-config="{highlight: true,range: true}" :row-config="{isCurrent: true, isHover: true} "  height="400px" align="center" >
      <vxe-table-column type="checkbox" width="45" align="center" fixed="left" v-if="pageType!=='finance'"/>
      <vxe-column type="seq" width="50" title="序号"/>
      <vxe-column title="操作" width="190" v-if="pageType!=='finance'">
        <template #default="{ row, rowIndex }">
      <!--<vxe-button size="mini" @click="editRowClick(row,rowIndex)"><i class="el-icon-edit"/> 编 辑</vxe-button>-->
          <vxe-button  size="mini" @click="recordClick(row)"><i class="el-icon-time"/> 出价记录</vxe-button>
          <el-popconfirm style="margin-left: 10px" title="此操作将删除, 是否继续?" icon="el-icon-info" @confirm="deleteRowClick(row)" confirm-button-text="确定" cancel-button-text="取消">
            <vxe-button size="mini" slot="reference"><i class="el-icon-delete"/> 删 除</vxe-button>
          </el-popconfirm>
        </template>
      </vxe-column>
      <vxe-table-column field="id" width="80" title="产品ID"/>
      <vxe-table-column field="name" title="产品名"/>
      <vxe-table-column title="图片" width="60" align="center">
        <template v-slot="{ row }">
          <el-image
            style="width: 25px; height: 25px"
            :src="row.imagesList[0]"
            :preview-src-list="row.imagesList"/>
        </template>
      </vxe-table-column>
      <vxe-table-column field="count" title="数量" :edit-render="{ name: 'input', indent: 0, reserve: true}"/>
      <vxe-table-column field="cost" title="产品成本" :edit-render="{ name: 'input', indent: 0, reserve: true}"/>
      <vxe-table-column field="price" title="售价" :edit-render="{ name: 'input', indent: 0, reserve: true}"/>
      <vxe-table-column field="remark" title="备注" :edit-render="{ name: 'input', indent: 0, reserve: true}"/>
    </vxe-table>

    <span slot="footer" class="dialog-footer right">
      <el-button @click="cancelFrom" size="mini" v-if="pageType!=='finance'">取 消</el-button>
      <el-button type="primary" @click="submitFrom" size="mini">确 定</el-button>
    </span>

    <!-- 新增&编辑产品   -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" width="900px" @close="cancelEditFrom" append-to-body>
      <el-form :model="editForm" label-width="80px" :rules="editRules" ref="editForm" size="mini" style="margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品" prop="name">
              <vxe-button size="mini" class="form-item" @click="selectProductClick">{{editForm.name ? editForm.name:'请选择产品'}}</vxe-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="count">
              <el-input v-model="editForm.count" class="form-item" placeholder="请输入数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品成本" prop="cost">
              <el-input v-model="editForm.cost" class="form-item" placeholder="请输入运营成本"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售价" prop="price">
              <el-input v-model="editForm.price" class="form-item" placeholder="请输入售价"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="editForm.remark" class="form-item" placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditFrom" size="mini" >取 消</el-button>
        <el-button type="primary" @click="submitEditFrom" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择客户 -->
    <el-dialog :title="selectCustomerTitle" :visible.sync="selectCustomerVisible" append-to-body top="1vh" width="1200px">
      <select-customer :page-type="'select'" @selectEvent="selectCustomerEvent"/>
    </el-dialog>

    <!-- 选择产品 -->
    <el-dialog :title="selectProductTitle" :visible.sync="selectProductVisible" append-to-body top="1vh" width="1200px">
      <select-product :page-type="'select'" @selectEvent="selectProductEvent"/>
    </el-dialog>

    <!-- 出价记录 -->
    <el-drawer :modal="false" :destroyOnClose="true" :visible.sync="drawer" :title="drawerTitle">
      <div class="block">
        <el-divider content-position="left">
          <div class="radio">
            排序：
            <el-radio-group v-model="reverse">
              <el-radio :label="true">倒序</el-radio>
              <el-radio :label="false">正序</el-radio>
            </el-radio-group>
            <el-switch v-model="switchValue" active-text="展开" inactive-text="折叠" style="margin-left:50px" @change="changeSwitch"/>
            <el-tag effect="dark" size="mini" style="margin-left:50px"> 共{{ logListLength }}条 </el-tag>
          </div>
        </el-divider>
        <el-timeline :reverse="reverse" >
          <el-timeline-item placement="top" v-for="(item,index) in logList" :timestamp="'开单时间: '+item.time"  type="success">
            <el-card class="box-card" shadow="hover">
              <h4>订单号: {{item.orderNo}}</h4>
              <el-collapse v-model="activeName">
                <el-collapse-item :title="' 价格: '+item.price+' 元'" :name="String(index)" >
                  订单备注: {{item.remark}}
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {formatDate, myDebounce} from "@/utils/tools";

const baseUrl = '/product/'
import mySearch from "@/components/MySearch/MySearch.vue";
import {fastGet, fastPost} from "@/api";

export default {
  name: "orderForm",
  props:{
    pageType:{
      type:String,
      default:""
    },
    orderData:{
      type:Object,
      default:()=>{}
    },
    companyOptions:{
      type:Array,
      default:()=>[]
    },
    orderStatusOptions:{
      type:Array,
      default:()=>[]
    },
  },
  components:{
    mySearch,
    selectCustomer:()=>import('@/views/customer/index.vue'),
    selectProduct:()=>import('@/views/productLibrary/index.vue'),
  },
  computed:{
    isEnabled(){
      return this.pageType !== 'finance'
    },
    logListLength(){
      return this.logList.length
    }
  },
  data() {
    return {
      activeName:[],
      switchValue:false,
      reverse: true,
      productList:[],
      formData:{},
      rules:{
        operateCost: [
          { pattern:/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请填写正确价格',trigger: 'blur'}
        ],
        orderPrice:[
          { pattern:/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请填写正确价格',trigger: 'blur'}
        ],
      },
      editRules:{
        count:[
          { required: true, message: '请输入数量', trigger: 'blur' },
          { pattern:/^[1-9]\d*$/, message: '请填写正确数量',trigger: 'blur'}
        ],
        cost:[
          { required: true, message: '请输入产品成本', trigger: 'blur' },
          { pattern:/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请填写正确价格',trigger: 'blur'}
        ],
        price:[
          { required: true, message: '请输入售价', trigger: 'blur' },
          { pattern:/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请填写正确价格',trigger: 'blur'}
        ],
      },
      loading:false,
      limitQuery:{
        orderId:"",
      },
      keyType:[
        { label: '产品ID', name: 'id' },
        { label: '产品名', name: 'name' },
      ],
      confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'},
      dialogVisible: false,
      dialogTitle: '未定义',
      activeAction: null,
      editForm: {},
      selectCustomerTitle:'选择客户',
      selectCustomerVisible:false,
      activeCustomerId:null,
      selectProductTitle:'选择产品',
      selectProductVisible:false,
      activeProductId:null,
      activeIndex:[],
      drawer:false,
      drawerTitle:"未定义",
      logList:[],
      isAuto:false,
      activeEditRow:null,
      exportColumns:[
        {field:'id',title:'产品ID'},
        {field:'name',title:'产品名'},
        {field:'count',title:'数量'},
        {field:'cost',title:'产品成本'},
        {field:'price',title:'售价'},
        {field:'remark',title:'备注'},
      ],
      tempOrderPrice:"",
    }
  },
  created() {
    this.resetFrom()
  },
  watch: {
    orderData: {
      handler: function() {
        this.resetFrom()
      },
      immediate:true
    }
  },
  methods: {
    autoPricingEvent({value}){
      if (!value) return this.formData.orderPrice = this.tempOrderPrice
      this.tempOrderPrice = this.formData.orderPrice
      this.formData.orderPrice = "自动计价"
    },
    changeSwitch(e){
      if(!e) return this.activeName = []
      let tempList = []
      this.logList.map((item,index)=>tempList.push(index.toString()))
      this.activeName = tempList
    },
    resetFrom(){
      if (this.$refs.orderForm) this.$refs.orderForm.resetFields();//重置表单校验
      this.isAuto = false;
      this.productList = [];
      this.formData = Object.assign({}, this.orderData);
      if(this.formData.id){
        this.limitQuery.orderId = this.formData.id;
        this.getProductList();
      }
    },
    getProductList() {
      this.loading = true
      fastGet(baseUrl+'getListByOrderId', this.limitQuery).then(res => {
        this.loading = false
        if (res.code === 0) {
          res.data.list.map(item => item.imagesList = item.images.map(img => img.url))
          this.productList = res.data.list
        }
      })
    },
    cancelFrom(){
      this.$emit('cancelFrom')
    },
    submitFrom(){
      this.$refs.orderForm.validate((valid) => {
        if (!valid) return false;
        let tempList = []
        let tempData = Object.assign({}, this.formData);
        if(tempData.orderPrice === "自动计价")tempData.orderPrice = "auto"
        this.productList.map(item =>tempList.push({ id:item.id, count:item.count, cost:item.cost,price:item.price,remark:item.remark }))
        this.$emit('submitFrom', {productList:tempList,...tempData})
      });
    },
    addClick(){
      if (this.$refs.editForm) this.$refs.editForm.resetFields();
      this.showFromEvent('新增产品', {},  'add')
    },
    editClick(){
      let ids = this.getCheckboxRecordsEvent('修改', '产品')
      if (ids.length > 0) {
        let index = []
        ids.map(id => {
          this.productList.map((item,index) => {
            if(item.id === id){
              index.push(index)
            }
          })
        })
        this.showFromEvent('编辑' + ids.length + '个产品', {ids:ids},  'multiUpdate',index)
      }
    },
    editRowClick(row,rowIndex){
      this.showFromEvent('编辑产品:【' + row.name + '】', row,  'update',[rowIndex])
    },
    showFromEvent(title, data, action,index) {
      this.editForm = Object.assign({}, data)
      this.dialogTitle = title
      this.activeAction = action
      this.activeIndex = index
      this.dialogVisible = true
    },
    cancelEditFrom(){
      this.dialogVisible = false
    },
    submitEditFrom(){
      if(!this.editForm.name) return this.$notify.error({title: '提示', message: '请选择产品', position: 'bottom-left'})
      this.$refs.editForm.validate((valid) => {
        if (!valid) return false;
        this.$notify.success({title: '提示', message: '操作成功', position: 'bottom-left'})
        switch (this.activeAction) {
          case 'add':
            this.productList.unshift(Object.assign({},this.editForm))
            break
          case 'update':
            this.productList.splice(this.activeIndex[0],1,this.editForm)
            break
          case 'multiUpdate':
            this.multiUpdateEvent()
            break
        }
        this.dialogVisible = false
      });
    },
    multiUpdateEvent(){
      this.activeIndex.map(index=>{
        for(let i in this.editForm) {
          for (let j in this.activeIndex[index]){
            if (i === j) this.activeIndex[index][j] = this.editForm[i]
          }
        }
      })
    },
    deleteClick(){
      let ids = this.getCheckboxRecordsEvent('删除', '产品')
      if (ids.length > 0) this.showConfirmForm('正在删除' + ids.length + '个产品', ids)
    },
    deleteRowClick(row){
      this.deleteEvent([row.id])
    },
    showConfirmForm(message, ids) {
      this.$confirm(message, '提示', this.confirmOptions).then(() => this.deleteEvent(ids))
    },
    deleteEvent(ids){
      ids.map(id => this.productList = this.productList.filter(item => item.id !== id))
      this.$notify.success({title: '提示', message: '删除成功', position: 'bottom-left'})
    },
    getCheckboxRecordsEvent(action, object) {
      if (this.$refs.table.getCheckboxRecords(1) < 1) return this.$notify.error({title: '提示', message: '请选择要' + action + '的' + object, position: 'bottom-left'})
      let ids = []
      this.$refs.table.getCheckboxRecords(1).map(item => ids.push(item.id))
      return ids
    },
    selectCustomerClick(){
      this.selectCustomerTitle =this.formData.customerName ? '当前客户:【' + this.formData.customerName + '】' : '请选择客户'
      this.activeCustomerId = this.formData.customerId
      this.selectCustomerVisible = true
    },
    selectCustomerEvent(data){
      this.formData.customerId = data.id
      this.formData.customerName = data.name
      this.formData.consigneeName = data.contact
      this.formData.consigneeMobile = data.mobile
      this.formData.consigneeAddress = data.address
      this.selectCustomerVisible = false
    },
    selectProductClick(){
      this.selectProductTitle = this.editForm.name ? '当前产品:【' + this.editForm.name + '】' : '请选择产品'
      this.activeProductId = this.editForm.id
      this.selectProductVisible = true
    },
    selectProductEvent(data){
      this.editForm = {
        count : this.editForm.count,
        price : data.salesPrice,
        cost : data.productCost,
        ...data
      }
      this.selectProductVisible = false
    },
    editActiveEvent({row}){
      this.activeEditRow = Object.assign({},row)
    },
    updateProduct({row, column, rowIndex}) {
      const $table = this.$refs.table
      let field = column.property
      // 判断单元格值是否被修改
      if ($table.isUpdateByRow(row, field)) {
        if (field === 'count' && !/^[1-9]\d*$/.test(row.count)) {
            row.count = this.activeEditRow.count
            this.$notify.error({title: '提示', message: '请输入正确数量!' , position: 'bottom-left'})
            return
        }
        if (field === 'price' && !/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(row.price)) {
            row.price = this.activeEditRow.price
            this.$notify.error({title: '提示', message: '请输入正确价格!' , position: 'bottom-left'})
            return
        }
        if (field === 'cost' && !/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(row.cost)) {
            row.cost = this.activeEditRow.cost
            this.$notify.error({title: '提示', message: '请输入正确价格!' , position: 'bottom-left'})
            return
        }
        this.$notify.success({title: '提示', message: '修改成功!' , position: 'bottom-left'})
      }
    },
    recordClick(row){
      this.getRecordById(row.id).then(()=>{
        this.drawer = true;
        this.drawerTitle = '产品:【'+row.name+'】'
      }).catch(err=>{
        this.$notify.error({title: '获取记录失败!', message: err , position: 'bottom-left'})
      })
    },
    getRecordById(id){
      return new Promise((resolve, reject) => {
        this.loading = true
        fastGet(baseUrl+'getRecordById',{id:id}).then(res=>{
          this.loading = false
          if(res.code===0){
            this.logList = res.data.list
            resolve()
          }else {
            reject(res.message)
          }
        })
      })
    },
    filterCompanyName(value){
      let arr = this.companyOptions.filter(item => item.value === String(value))
      return arr.length > 0 ? arr[0].label : "";
    },
    filterOrderStatus(value){
      let arr = this.orderStatusOptions.filter(item => item.value === String(value))
      return arr.length > 0 ? arr[0].label : "";
    },
    //全部导出
    exportData: myDebounce(function () {
      this.exportEvent('订单【'+this.formData.orderNo+'】产品列表【'+formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')+'】',this.productList,this.exportColumns)
    }),
    exportEvent(filename,data,columns){
      this.$refs.table.exportData({
        filename: filename,
        type: 'csv',
        data: data,
        columns:columns,
      })
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}

::v-deep .el-dialog__header {
  padding: 20px 20px 0;
}

.orderForm{
  padding-bottom: 20px;
  .form-item{
    width:400px
  }
  .right{
    float: right;
  }
  .dialog-footer{
    margin-top: 10px;
  }
}
</style>
