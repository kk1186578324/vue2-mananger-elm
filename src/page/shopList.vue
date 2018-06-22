<template>
<div>
    <head-top></head-top>
    <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
            <template scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="店铺名称">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="店铺地址">
                        <span>{{ props.row.address }}</span>
                    </el-form-item>
                    <el-form-item label="店铺介绍">
                        <span>{{ props.row.description }}</span>
                    </el-form-item>
                    <el-form-item label="店铺 ID">
                        <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <span>{{ props.row.phone }}</span>
                    </el-form-item>
                    <el-form-item label="评分">
                        <span>{{ props.row.rating }}</span>
                    </el-form-item>
                    <el-form-item label="销售量">
                        <span>{{ props.row.recent_order_num }}</span>
                    </el-form-item>
                    <el-form-item label="分类">
                        <span>{{ props.row.category }}</span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column
            label="店铺名称"
            prop="name">
        </el-table-column>
        <el-table-column
            label="店铺地址"
            prop="address">
            <el-autocomplete
                v-model="state4"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
            ></el-autocomplete>
        </el-table-column>
        <el-table-column
            label="店铺介绍"
            prop="description">
        </el-table-column>
        <el-table-column label="操作" width="300">
            <template scope="scope">
                <el-button
                    size="mini"

                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                    size="mini"
                    type="Success"
                    @click="addFood(scope.$index, scope.row)">添加食品</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
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


    <el-dialog
        title="修改店铺内容"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form ref="form" :model="selectTable" label-width="80px">
            <el-form-item label="店铺名称">
                <el-input v-model="selectTable.name"></el-input>
            </el-form-item>
            <el-form-item label="详细地址">

                <el-input v-model="selectTable.address"></el-input>
            </el-form-item>
            <el-form-item label="店铺介绍">
                <el-input v-model="selectTable.description"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">

                <el-input v-model="selectTable.phone"></el-input>
            </el-form-item>
            <el-form-item label="店铺分类">
                <el-cascader
                    expand-trigger="hover"
                    :options="categoryOptions"
                    v-model="selectedCategory"
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="店铺图片">
            <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/v1/addimg/shop'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </el-form-item>


        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmit()">确 定</el-button>
  </span>
    </el-dialog>


</div>
</template>

<script>
    import headTop from '../components/headTop';
    import {baseUrl, baseImgPath} from '@/config/env'
    import {cityGuess, getResturants, getResturantsCount, foodCategory, updateResturant, searchplace, deleteResturant} from '@/api/getData'
    export default {
        components:{
            headTop,
        },
        data(){
            return{
                offset: 0,
                limit: 15,
                count: 0,
                selectTable:{},
                tableData: [],
                currentPage: 1,
                loading:true,
                dialogVisible: false,
                imageUrl: '',
                baseUrl:'',
                baseImgPath,
                selectedCategory:[],
                categoryOptions:[],
                form: {
                    name: '',
                    region: '',
                    introduce:'',
                    cell:''
                },
                selectedOptions: [],
                selectedOptions2: []
            }
        },
        created(){

            this.initData();

        },


        methods:{
            async initData(){
                try{
                    this.city = await cityGuess();
                    const countData = await getResturantsCount();
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getResturants();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getResturants(){
                const {latitude, longitude} = this.city;
                const restaurants = await getResturants({latitude, longitude, offset: this.currentPage, limit: this.limit});
                this.tableData = [];
                restaurants.forEach(item => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.address = item.address;
                    tableData.description = item.description;
                    tableData.id = item.id;
                    tableData.phone = item.phone;
                    tableData.rating = item.rating;
                    tableData.recent_order_num = item.recent_order_num;
                    tableData.category = item.category;
                    tableData.image_path = item.image_path;
                    this.tableData.push(tableData);
                })
                this.loading=false;
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getResturants();
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getResturants();
                console.log(`当前页: ${val}`);
            },


            async getCategory(){
                try{
                    const categories = await foodCategory();

                    console.log(categories);
                    categories.forEach(item => {
                        if (item.sub_categories.length) {
                            const addnew = {
                                value: item.name,
                                label: item.name,
                                children: []
                            }
                            item.sub_categories.forEach((subitem, index) => {
                                if (index == 0) {
                                    return
                                }
                                addnew.children.push({
                                    value: subitem.name,
                                    label: subitem.name,
                                })
                            })
                            this.categoryOptions.push(addnew)
                        }
                    })
                }catch(err){
                    console.log('获取商铺种类失败', err);
                }
            },
            handleEdit(index,row){

                console.log(index,row);

                this.selectTable = row;
                this.selectedCategory = row.category.split('/');
                this.dialogVisible = true;//弹出框

                if (!this.categoryOptions.length) {
                    this.getCategory();
                }




            },
            addFood(){

            },
            handleDelete(){

            },
            async onSubmit() {

                this.dialogFormVisible = false;

                Object.assign(this.selectTable, this.address)


                console.log('submit!');
            },
            handleClose(){

            },
            handleChange(value) {
                console.log(value);
            },
            handleAvatarSuccess(res, file) {

                console.log(res, file);
                if(res.status==1){

                    this.selectTable.image_path = res.image_path;
                }else {
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
                console.log(file)
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }

        }
    }
</script>
<style lang="less">
    @import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
