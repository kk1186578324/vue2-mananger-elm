<template>
  <div class="app-bg">

    <div class="from-box">
      <el-form ref="form" :model="form" label-width="80px" class="from-content">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-button class="submit-btn" type="primary">登录</el-button>
      </el-form>

    </div>

  </div>

</template>

<script>
  import {login, getAdminInfo} from '@/api/getData'
  export default {
    data() {
      return {
        form: {
          name: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }

</script>

<style scoped>

  .app-bg {
    width: 100%;
    height: 100%;
    background: #1f2d3d;
  }
  .from-box{
    width: 500px;
    height:300px;
    position: absolute;
    top:50%;
    left: 50%;
    margin-left: -250px;
    margin-top:-200px;
    background: #fff;
    border: 1px solid #1f2d3d;
    box-shadow:1px 1px 1px ;
    border-radius:10px;
  }
  .submit-btn{
    position: absolute;
    width: 300px;
    left:50%;
    margin-left: -130px;

  }
 .from-content{
   position: absolute;
   left:50%;
   margin-left: -170px;
   margin-top: 30px;
   width:300px;

 }
</style>
