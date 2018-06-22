<template>
<div class="fillcontain">

  <head-top></head-top>
  <el-table
      v-loading="loading"
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="registe_time"
      label="注册日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="city"
      label="注册地址">
    </el-table-column>
  </el-table>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[15, 20, 30, 40]"
    :page-size="15"
    layout="total, sizes, prev, pager, next, jumper"
    :total="count">
  </el-pagination>
</div>
</template>

<script>
  import headTop from '../components/headTop'
  import {getUserList, getUserCount} from '@/api/getData'

    export default {
      components:{
        headTop,
      },
      data() {
        return {
            tableData: [],
            offset: 0,
            limit: 15,
            currentPage:1,
            count:0,
            loading: true
        }
      },
      created(){
          this.initData();
      },
      methods:{

        async initData(){
          try {

              const countData = await getUserCount();
            if(countData.status ==1){
              this.count = countData.count;
            }else {
              throw new Error("获取数据失败");
            }

             this.getUsers();
          }catch (err){

            console.log("获取数据失败",err)
          }


        },
          async getUsers(){
            const Users =  await getUserList({offset:this.currentPage,limit:this.limit})
            this.tableData=[];
            Users.forEach(item=>{
                const dataObj = {};
                dataObj.username = item.username;
                dataObj.registe_time = item.registe_time;
                dataObj.city = item.city;
                this.tableData.push(dataObj);
            })
            this.loading=false;



        },
        handleSizeChange(val) {
            this.limit = val;
            this.getUsers();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getUsers();
          console.log(`当前页: ${val}`);
        }
      },

    }

</script>

<style lang="less" scoped>
    @import '../style/common';

</style>
