<template>
  <div class="fillcontain">
    <el-row style="height: 100%">
      <el-col :span="4" style="min-height:100%;background-color:#545c64 ">
        <el-menu
          style="min-height: 100%;min-width: 100%"
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据管理</span>
            </template>
            <el-menu-item index="userList">用户列表</el-menu-item>
            <el-menu-item index="shopList">商家列表</el-menu-item>
            <el-menu-item index="1-3">食品列表</el-menu-item>
            <el-menu-item index="1-4">订单列表</el-menu-item>
            <el-menu-item index="1-5">管理员列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-circle-plus"></i>
              <span>添加数据</span>
            </template>
            <el-menu-item index="addShop">添加商铺</el-menu-item>
            <el-menu-item index="addGoods">添加商品</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>图表</span>
            </template>
            <el-menu-item index="3-1">用户分布</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>编辑</span>
            </template>
            <el-menu-item index="4-1">文本编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>设置</span>
            </template>
            <el-menu-item index="5-1">管理员设置</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-question"></i>
              <span>说明</span>
            </template>
            <el-menu-item index="6-1">说明</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-col>


      <el-col :span="20" style="height: 100%">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    computed: {
      defaultActive: function(){
        console.log(this.$route.path);
        return this.$route.path.replace('/', '');
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/mixin';
  @import '../style/common';

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 100%;
  }



</style>
