<template>
  <div class="index">
    <div class="index-container">
      <div class="title">欢迎使用本系统</div>
      <div class="container">
        <div class="glass"  data-text="客户库" @click="routingJump('/customer/customer')">
          <i class="el-icon-s-custom icon"/>
        </div>
        <div class="glass"   data-text="厂家库" @click="routingJump('/factory/factory')">
          <i class="el-icon-s-home icon"/>
        </div>
        <div class="glass" data-text="产品库" @click="routingJump('/productLibrary/productLibrary')">
          <i class="el-icon-s-grid icon"/>
        </div>
        <div class="glass" data-text="订单管理" @click="routingJump('/order/order')">
          <i class="el-icon-s-order icon"/>
        </div>
        <div class="glass" data-text="财务汇总" @click="routingJump('/finance/finance')">
          <i class="el-icon-pie-chart icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VanillaTilt from 'vanilla-tilt';
export default {
  name: "index",
  data() {
    return {
      tableData: [{id: 1}],
    };
  },
  mounted() {
    this.$nextTick(()=>{
      VanillaTilt.init(document.querySelectorAll('.glass'), {
        max: 15,
        speed:400,
        glare:true,
        "max-glare":1,
      })
    })
  },
  methods:{
    routingJump(path){
      this.$router.push({path:path})
    },
  }
}
</script>

<style lang="scss" scoped>
@keyframes bgmove {
  0%{
    background-position: 0 50%;
  }
  50%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0 50%;
  }
}
.index{
  padding: 12px;
  .index-container {
    height: calc(100vh - 110px);
    overflow: hidden;
    border-radius: 10px;
    color: #fff;
    background-image: linear-gradient(125deg,#2c3e50,#27ae60,#2980b9,#e74c3c,#8e44ad);
    animation: bgmove 20s  infinite;
    background-size: 400%;
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    padding: 10px;
    .title{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      padding: 30px;
    }
    .container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .glass{
        cursor: pointer;
        position: relative;
        width: 200px;
        height: 250px;
        background:linear-gradient(#fff2,transparentize(#fff,1));
        border:1px solid rgba(255,255,255,0.1);
        box-shadow: 0 25px 25px rgba(0,0,0,0.25);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.35s;
        border-radius: 10px;
        margin: 0 -45px;
        .icon{
          font-size: 120px;
          color: #fff;
        }
      }
      .glass::before{
        content: attr(data-text);
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        background: rgba(255,255,255,0.1);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .container:hover .glass{
      transform: rotate(0);
      margin: 0 20px;
    }
  }
  .index-container:last-child{
    margin-bottom: 0;
  }
}
</style>
