<template>
  <div class="search-box">
    <el-autocomplete
      ref="search-input"
      class="search-input"
      :class="{active: isOpen}"
      popper-class="autocomplete"
      placement="bottom-end"
      :size="size"
      v-model="value"
      :fetch-suggestions="makeKeyType"
      @select="selectKeyType"
      :placeholder="placeholder">
      <template slot-scope="{ item }" class="search-select-content">
        <div class="name">{{ item.label }}</div>
      </template>
    </el-autocomplete>
    <el-tag class="search-tag" size="mini" closable type="info" v-if="keyLabel !==''" :disable-transitions="true" @close="clear">{{ keyLabel }}</el-tag>
    <div class="icon-box" @click="searchClick">
      <i class="vxe-icon-search icon" :class="{activeIcon:!isOpen}"/>
      <i class="vxe-icon-close icon" :class="{activeIcon:isOpen}"/>
    </div>
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
    searchClick(){
      this.isOpen = !this.isOpen
    },
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
::v-deep .el-autocomplete-suggestion .el-popper .autocomplete {
  width: 300px !important;
}
.search-box{
  border-radius: 30px;
  background-color: #fff;
  color: #2f3640;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-right:10px;
  //box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdfe6;
  padding: 0 4px;
  .search-input{
    width:0;
    opacity: 0;
    transition: 0.5s ease-in-out;
    ::v-deep input{
      width:250px;
      border:none;
      background: none;
      outline: none;
      padding: 0;
      color: #2f3640;
    }
  }
  .icon-box{
    width: 21px;
    height: 21px;
    padding-top: 2px;
    background: #2f3640;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    .icon{
      opacity: 0;
      color: #FFFFFF;
      font-size: 12px;
      transition: opacity 0.25s ;
      position: absolute;
    }
    .activeIcon{
      opacity: 1;
    }
  }
  .search-tag{
    border:none;
    background-color: #2f3640;
    margin-right: 4px;
    color: #fff;
    border-radius: 30px;
  }
  .active{
    width:220px;
    opacity: 1;
    margin-left:4px;
  }


}

</style>
