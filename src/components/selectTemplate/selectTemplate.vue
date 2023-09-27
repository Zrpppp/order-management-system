<template>
  <div class="select-template" v-loading="loading">
    <el-form :rules="rules" ref="form" size="mini" label-width="95px">
      <el-form-item label="模板" prop="template">
        <vxe-select size="mini" v-model="template" placeholder="筛选打印模板" :options="templateOptions"
                    style="width: 220px;margin-right: 10px" clearable/>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer right">
      <el-button @click="cancelFrom" size="mini">取 消</el-button>
      <el-button type="primary" @click="submitFrom" size="mini">确 定</el-button>
    </div>

    <!--科利送货单-->
    <KL-delivery-template ref="KLDeliveryTemplate"/>
    <!-- 科利报价单 -->
    <KL-quotation-template ref="KLQuotationTemplate"/>
    <!-- 荣燊送货单 -->
    <RSDeliveryTemplate ref="RSDeliveryTemplate"/>
    <!-- 荣燊报价单 -->
    <RSQuotationTemplate ref="RSQuotationTemplate"/>
  </div>
</template>

<script>
import KLDeliveryTemplate from "@/components/KL-delivery-template/KL-delivery-template.vue";
import KLQuotationTemplate from "@/components/KL-quotation-template/KL-quotation-template.vue";
import RSDeliveryTemplate from "@/components/RS-delivery-template/RS-delivery-template.vue";
import RSQuotationTemplate from "@/components/RS-quotation-template/RS-quotation-template.vue";
import {fastGet} from "@/api";
import {myDebounce} from "@/utils/tools";

export default {
  name: "selectTemplate",
  components: {
    KLDeliveryTemplate,
    KLQuotationTemplate,
    RSDeliveryTemplate,
    RSQuotationTemplate
  },
  props: {
    printData: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      templateOptions: [
        {label: "科利送货单", value: "KL-delivery"},
        {label: "科利报价单", value: "KL-quotation"},
        {label: "荣燊送货单", value: "RS-delivery"},
        {label: "荣燊报价单", value: "RS-quotation"},
      ],
      productList:[],
      template: "",
      rules: {},
      loading:false,
    }
  },
  methods: {
    cancelFrom() {
      this.$emit("cancelFrom")
    },
    submitFrom:myDebounce(function () {
      if (!this.template) return this.$notify.error({title: '提示', message: '请选择打印模板', position: 'bottom-left'})
      this.loading = true
      fastGet('/product/getListByOrderId', {page:1,limit:0,orderId:this.printData.id},false).then(res => {
        this.loading = false
        if (res.code !== 0) return this.$notify.error({title: '提示', message: res.message, position: 'bottom-left'})
        this.productList = res.data.list
        this.printEvent()
      })
    }),
    printEvent() {
      switch (this.template) {
        case "KL-delivery":
          this.$refs.KLDeliveryTemplate.printEvent(this.printData,this.productList)
          break;
        case "KL-quotation":
          this.$refs.KLQuotationTemplate.printEvent(this.printData,this.productList)
          break;
        case "RS-delivery":
          this.$refs.RSDeliveryTemplate.printEvent(this.printData,this.productList)
          break;
        case "RS-quotation":
          this.$refs.RSQuotationTemplate.printEvent(this.printData,this.productList)
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select-template {
  padding-bottom: 30px;

  .right {
    float: right;
  }

  .dialog-footer {
    margin-top: 5px;
  }
}
</style>
