<template>
  <div class="navbar">
    <div class="left">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb class="breadcrumb-container" />
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
<!--          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">-->
<!--            <el-dropdown-item>Github</el-dropdown-item>-->
<!--          </a>-->
<!--          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
<!--            <el-dropdown-item>Docs</el-dropdown-item>-->
<!--          </a>-->
          <el-dropdown-item divided @click.native="deleteCache">
            <span style="display:block;">删除缓存</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {mainInit,removeCache} from "@/api";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    deleteCache(){
      this.$notify.success({ title: '提示', message: '删除成功!正在重置缓存,请稍等~', position: 'bottom-left' })
      mainInit().then(()=>{
        window.location.reload();
      }).catch(err=>{
        this.$notify.error({ title: "失败", message: err,  position: 'bottom-left' });
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #f3f3f3;
  //box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .left{
    height: 40px;
    margin-left: 15px;
    margin-top: 10px;
    background-color: #fff;
    float: left;
    border-radius: 6px 6px 0 0;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1);
    .hamburger-container {
      line-height: 40px;
      height: 40px;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;
      background-color: #fff;
      border-radius: 6px 0 0 0;
      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      height: 40px;
      background-color: #fff;
      float: left;
      margin-right: 15px;
    }
  }

  .right-menu {
    float: right;
    height: 40px;
    margin-right: 10px;
    margin-top: 10px;
    padding-left: 10px;
    line-height: 40px;
    background-color: #fff;
    border-radius: 6px 6px 0 0;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1);
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 10px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
