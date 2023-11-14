<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
::-webkit-scrollbar {
  width: 11px;
  height: 10px;
  background-color: rgba(240, 240, 240, 1);
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0 rgba(240, 240, 240, .5);
  border-radius: 10px;
  background-color: rgba(240, 240, 240, .5);
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0 rgba(0, 0, 0, .5);
  background-color: #bfbfbf;
}
::-webkit-scrollbar-thumb:hover{
  background-color: #A8A8A8;

}
::-webkit-scrollbar-thumb:active {
  background-color: #787878;
}
  #app {
    .fade-enter-active, .fade-leave-active{
      transition: all .25s ease-in-out;
    }

    .fade-leave-to, .fade-enter{
      opacity: 0;
      transform: translateY(-10px);
    }
    .vxe-table--render-default.border--default .vxe-table--header-wrapper,
    .vxe-table--render-default.border--full .vxe-table--header-wrapper,
    .vxe-table--render-default.border--outer .vxe-table--header-wrapper {
      background-color: #eef1f6;
      // height: 40px;
      color: #909399;
      font-weight: 500;
    }
    .vxe-table--render-default .vxe-body--column.col--ellipsis,
    .vxe-table--render-default.vxe-editable .vxe-body--column,
    .vxe-table--render-default .vxe-footer--column.col--ellipsis,
    .vxe-table--render-default .vxe-header--column.col--ellipsis {
      height: 33px;
    }
    .vxe-table--render-default .vxe-body--column:not(.col--ellipsis),
    .vxe-table--render-default .vxe-footer--column:not(.col--ellipsis),
    .vxe-table--render-default .vxe-header--column:not(.col--ellipsis) {
      padding: 9px 0;
    }
    .myTable-scrollbar ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    /*滚动条的轨道*/
    .myTable-scrollbar ::-webkit-scrollbar-track {
      background-color: rgba(240, 240, 240, .5);
    }
    /*滚动条里面的小方块，能向上向下移动*/
    .myTable-scrollbar ::-webkit-scrollbar-thumb {
      background-color: #bfbfbf;
      border-radius: 5px;
      //border: 1px solid #F1F1F1;
      box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    }
    .myTable-scrollbar ::-webkit-scrollbar-thumb:hover {
      background-color: #A8A8A8;
    }
    .myTable-scrollbar ::-webkit-scrollbar-thumb:active {
      background-color: #787878;
    }
    /*边角，即两个滚动条的交汇处*/
    .myTable-scrollbar ::-webkit-scrollbar-corner {
      background-color: #FFFFFF;
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0;
      background-color: transparent;
      border: 1px solid #d1dbe5;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-color: #fff;
      background-color: #fff;
      color: #000;
      cursor: default;
    }
    .el-pagination {
      float: right;
      margin-top: 10px;
    }
  }
</style>
