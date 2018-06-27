<template>
    <div>
        <head-top></head-top>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>选择食品种类</span>

            </div>
                <el-row style="margin-top: 20px;" >
                    <el-col :span="14" :offset="4">
                        <el-form :model="categoryForm"  ref="categoryForm" label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item label="食品种类" prop="name">
                                <el-select v-model="categoryForm.name" @change="changeValue" placeholder="请选择">
                                    <el-option
                                     v-for = "item in categoryForm.categoryList"
                                     :key = "item.value"
                                     :label="item.label"
                                     :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="种类描述" prop="description">
                                <el-input v-model="categoryForm.description"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('categoryForm')">提交</el-button>
                            </el-form-item>
                        </el-form>

                    </el-col>
                </el-row>

        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加食品</span>

            </div>
            <el-row style="margin-top: 20px;">
                <el-col :span="14" :offset="4">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="食品名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="食品活动" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="食品详情" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="食品图片">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseUrl + '/v1/addimg/shop'"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path"
                                     class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="食品特点" prop="region">
                            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="食品规格">
                            <el-radio-group v-model="form.resource">
                                <el-radio label="单规格"></el-radio>
                                <el-radio label="多规格"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="包装费">
                            <el-input-number v-model="num1" @change="handleChange" :min="0" :max="10"
                                             label="描述文字"></el-input-number>
                        </el-form-item>
                        <el-form-item label="价格">
                            <el-input-number v-model="num2" @change="handleChange" :min="0" :max="10"
                                             label="描述文字"></el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addSubmitForm('ruleForm')">确认添加食品</el-button>
                        </el-form-item>
                    </el-form>

                </el-col>
            </el-row>

        </el-card>

    </div>


</template>

<script>
    import headTop from '../components/headTop';
    import {getCategory, addCategory, addFood} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'

    export default {
        components: {
            headTop,
        },

        data() {

            return {
                baseUrl: '',
                selectTable: {},

                categoryForm:{
                    categoryList:[],
                    description:"",
                    name:""
                },
                form: {},
                num1: 0,
                num2: 0,
                ruleForm: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',

                },
                rules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    region: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                    date1: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    date2: [
                        {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    type: [
                        {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
                    ],
                    resource: [
                        {required: true, message: '请选择活动资源', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: '请填写活动形式', trigger: 'blur'}
                    ]
                }
            }


        },
        created() {

            console.log(this.$route.query)

           this.initGetCategory();
        },
        methods: {
            async initGetCategory () {
                const  category = await getCategory(this.$route.query.restaurant_id);
                console.log(category)
                if(category.status==1){
                    category.category_list.map((item,index)=>{
                       item.value = index;
                       item.label = item.name;
                    });
                    this.categoryForm.categoryList = category.category_list;
                }else {
                    console.log(category)
                }
                console.log(category.category_list);






            },
            changeValue(value,label){

                let obj = {};
                obj =  this.categoryForm.categoryList.find((item)=>{
                    return item.value === value;
                });
                this.categoryForm.name = obj.label;

            },
            submitForm(formName) {

                this.$refs[formName].validate(async (valid)=>{
                    if(valid){
                        var param = {
                            name:this.categoryForm.name,
                            description:this.categoryForm.description,
                            restaurant_id:this.$route.query.restaurant_id
                        }
                        let result = await addCategory(param);
                        if(result.status==1){
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });

                        }

                    }else {

                        this.$notify({
                            title: '错误',
                            message: '请检查输入',
                            offset:100
                        });
                        return false;
                    }

                });

            },
            addSubmitForm(formName){

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleAvatarSuccess() {

            },
            beforeAvatarUpload() {

            },
            handleChange(){

            }


        }

    }
</script>

<style lang="less" scoped>
    @import '../style/mixin';

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
