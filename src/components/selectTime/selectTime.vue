<template>
  <div class="select-time">
    <el-date-picker :size="size" style="width: 220px;margin-right: 10px;" v-model="limitQuery[timeValue]" type="datetimerange"
                    align="right" unlink-panels :default-time="defaultTime"
                    :value-format="valueFormat" :format="format"  range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeTimeEvent" :picker-options="pickerOptions"
    />
  </div>
</template>

<script>
export default {
  name: 'selectTime',
  props: {
    defaultTime:{
      type:Array,
      default:()=>{
        return ["00:00:00","23:59:59"]
      }
    },
    timeValue:{
      type: String,
      default: () => {
        return 'time'
      }
    },
    format:{
      type: String,
      default: () => {
        return 'yyyy-MM-dd HH:mm:ss'
      }
    },
    valueFormat: {
      type: String,
      default: () => {
        return 'yyyy-MM-dd HH:mm:ss'
      }
    },
    limitQuery: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: String,
      default: () => {
        return 'mini'
      }
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    changeTimeEvent() {
      this.$emit('updateList')
    }
  }
}
</script>

<style scoped>
</style>
