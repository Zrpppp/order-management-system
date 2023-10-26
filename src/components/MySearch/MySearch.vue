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
        <div class="search-item">{{ item.label }}</div>
      </template>
    </el-autocomplete>
    <transition name="fade">
      <el-tag class="search-tag" size="mini" closable type="info" v-if="keyLabel" disable-transitions @close="clear">
        {{ keyLabel }}
      </el-tag>
    </transition>
    <div class="icon-box" :class="{activeIconBox:isOpen}" @click="searchClick">
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
          {label: '订单号', name: 'orderId'},
        ]
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
    },
  },
  data() {
    return {
      value: '',
      keyLabel: '',
      isOpen: false,
    }
  },
  watch: {
    value(newVal) {
      if (newVal) return
      this.keyLabel = ''
      this.limitQuery.searchKey = ""
      this.limitQuery.searchValue = ""
      this.$emit('updateList')
    },
  },
  methods: {
    searchClick() {
      this.isOpen = !this.isOpen;
    },
    clear() {
      this.value = ''
    },
    makeKeyType(queryString, cb) {
      let tempList = []
      this.keyType.forEach(keyType => {
        tempList.push({
          label: '【' + keyType.label + '】: ' + queryString,
          key: keyType.name,
          value: queryString
        })
      })
      cb(queryString ? tempList : [])
    },
    selectKeyType(val) {
      this.value = val.value
      this.limitQuery.searchKey = val.key
      this.limitQuery.searchValue = val.value
      this.keyLabel = val.label
      this.isOpen = false
      this.$emit('updateList')
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-autocomplete-suggestion .el-popper .autocomplete {
  width: 300px !important;
}

.fade-enter-active, {
  transition: all .25s ease-in-out;
}

.fade-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-active {
  transition: all .25s ease-in-out;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.search-box {
  border-radius: 30px;
  background-color: #fff;
  color: #2f3640;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-right: 10px;
  //box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdfe6;
  padding: 0 4px;

  .search-input {
    width: 0;
    opacity: 0;
    transition: all 0.5s cubic-bezier(.9, 0, .3, .9);

    ::v-deep input {
      width: 250px;
      border: none;
      background: none;
      outline: none;
      padding: 0;
      color: #2f3640;
    }
  }

  .icon-box {
    width: 20px;
    height: 20px;
    background: #2f3640;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all .6s cubic-bezier(.9, 0, .3, .9);

    .icon {
      opacity: 0;
      color: #FFFFFF;
      font-size: 12px;
      transition: opacity .6s cubic-bezier(.9, 0, .3, .9);
      position: absolute;
    }

    .activeIcon {
      opacity: 1;
    }
  }

  .activeIconBox {
    transform: rotate(180deg);
  }

  .search-tag {
    border: none;
    background-color: #2f3640;
    margin-right: 4px;
    color: #fff;
    border-radius: 30px;
    text-overflow: ellipsis;
  }

  .active {
    width: 260px;
    opacity: 1;
    margin-left: 4px;
    pointer-events: inherit;
  }
}

.autocomplete {
  li {
    .search-item {
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
