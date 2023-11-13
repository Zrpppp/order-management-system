<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">订单管理系统</h3>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                    placeholder="密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin"/>
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" class="login-button" @click.native.prevent="handleLogin">登录</el-button>

        <div class="tips">
<!--                  <span style="margin-right:20px;">username: admin</span>-->
<!--                  <span> password: any</span>-->
        </div>

    </el-form>
  </div>
</template>

<script>
import {mainInit,removeCache} from "@/api";
import VanillaTilt from 'vanilla-tilt';
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入用户名'))
      }else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入密码'))
      }
      if (value.length < 6) {
        callback(new Error('最少输入6位密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  mounted() {
    this.$nextTick(()=>{
      VanillaTilt.init(document.querySelectorAll('.login-form'), {
        max: 5,
        speed:1000,
        glare:true,
        "max-glare":0,
      })
    })
  },
  watch: {
    $route: {
      handler: function(route) {
        this.loginEvent()
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    loginEvent(){
      mainInit().catch(err=>{
        this.$notify.error({ title: "失败", message: "系统初始化失败!请重试~",  position: 'bottom-left' });
      })
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    //color: $cursor;
    color: #000;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      //color: $light_gray;
      color: #fff;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition-delay: 5000s;
        transition: color 5000s ease-out, background-color 5000s ease-out;
        -webkit-transition-delay: 5000s;
        -webkit-transition: color 5000s ease-out, background-color 5000s ease-out;
      }
    }
  }

  .el-form-item {
    background: rgba(255, 255, 255,0.2);
    color: #fff;
    border-radius: 50px;
    box-shadow: 2px 5px 10px 0 rgba(0, 0, 0, 0.1) inset,
    25px 30px 30px 0 rgba(0, 0, 0, 0.05);
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
@keyframes bgmove {
  0%{
    background-position: 0% 50%;
  }
  50%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0% 50%;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  //background-color: $bg;
  background-image: linear-gradient(125deg,#2c3e50,#27ae60,#2980b9,#e74c3c,#8e44ad);
  animation: bgmove 20s  infinite;
  background-size: 400%;
  overflow: hidden;
  display:flex;
  justify-content:center;
  align-items:center;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding:55px ;
    margin: 0 auto;
    overflow: hidden;
    background: rgba(255, 255, 255,0.2);
    border-radius: 20px;
    transform: translateY(-20%);
    box-shadow: 20px  20px 20px 0 rgba(0, 0, 0, 0.05) inset,
    25px 35px 20px 0 rgba(0, 0, 0, 0.05),
    25px 30px 30px 0 rgba(0, 0, 0, 0.05);
    transition: 0.6s ease-in-out;
  }
  .login-form:hover{
  }

  .login-button{
    width:100%;
    margin-bottom:30px;
    border-radius: 50px;
    box-shadow: 25px 35px 20px 0 rgba(0, 0, 0, 0.05),
    25px 30px 30px 0 rgba(0, 0, 0, 0.05);
  }
  .tips {
    font-size: 14px;
    color: #000;
    margin-bottom: 20px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    //color: $dark_gray;
    color: #fff;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #fff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
