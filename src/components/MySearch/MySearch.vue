<template>
  <div class="search-box">
    <el-autocomplete
      ref="input"
      class="search-input"
      popper-class="autocomplete"
      :size="size"
      clearable
      v-model="value"
      :fetch-suggestions="makeKeyType"
      @select="selectKeyType"
      :placeholder="placeholder">
      <template slot-scope="{ item }" class="search-select-content">
        <div class="name">{{ item.label }}</div>
      </template>
    </el-autocomplete>
    <div class="icon-box"><i class="vxe-icon-search icon"/></div>
    <el-tag class="search-tag" size="medium" closable type="info" v-if="keyLabel !==''" :disable-transitions="true" @close="clear">{{ keyLabel }}</el-tag>
  </div>

</template>

<script>
export default {
  name: 'MySearch',
  props: {
    keyType: {
      type: Array,
      default: () => {
        return [
          { label: '订单号', name: 'orderId' },]
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请输入搜索内容'
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
    }
  },
  data() {
    return {
      value: '',
      keyLabel: '',
      isOpen: false,
    }
  },
  watch: {
    value: {
      handler: function() {
        if (this.value === '') {
          this.keyLabel = ''
          this.limitQuery.searchKey = ""
          this.limitQuery.searchValue = ""
          this.$emit('updateList')
        }
      }
    }

  },
  methods: {
    clear() {
      this.value = ''
    },
    makeKeyType(queryString, cb) {
      let tempList = []
      this.keyType.map(keyType => {
        tempList.push({
          label: '【' + keyType.label + '】: ' + queryString,
          key: keyType.name,
          value: queryString
        })
      })
      let results = queryString ? tempList : []
      cb(results)
    },
    selectKeyType(val) {
      this.value = val.value
      this.limitQuery.searchKey = val.key
      this.limitQuery.searchValue = val.value
      this.keyLabel = val.label
      this.$emit('updateList')
    },
  }
}
</script>

<style lang="scss" scoped>
.search-box{
  border-radius: 30px;
  background-color: #fff;
  padding-left: 10px;
  color: #2f3640;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-right:10px;
  //box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdfe6;
  ::v-deep input{
    width:0;
    border:none;
    background: none;
    outline: none;
    float: left;
    padding: 0;
    color: #2f3640;
    transition: 0.5s ease-in-out ;
  }
  .icon-box{
    margin-right: 10px;
    transition: 0.4s ease-in-out;
    .icon{
      color: #2f3640;
      font-size: 12px;
    }
  }
  .search-tag{
    border:none;
    background-color: #2f3640;
    color: #fff;
    margin-right: 10px;
    border-radius: 30px;
    height: 25px;
    line-height: 25px;
  }
}
.search-box:hover ::v-deep input{
  width:200px;
  padding: 0 6px;
}
.search-box:hover .icon-box {
  margin-right: 0;
}
.search-box:hover .icon-box .icon{
  color: #fff;
}
</style>
