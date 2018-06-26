<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
            <el-col :span="14" :offset="4">
                <el-form ref="form" :model="selectTable" label-width="80px" style="margin-top: 20px;">
                    <el-form-item label="店铺名称">
                        <el-input v-model="selectTable.name"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" label-width="80px">
                        <el-autocomplete
                            v-model="selectTable.address"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入地址"
                            style="width: 100%"
                            @select="addressSelect"
                        >
                        </el-autocomplete>
                        <span>当前城市：{{city.name}}</span>
                    </el-form-item>

                    <el-form-item label="联系电话">

                        <el-input v-model="selectTable.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺简介">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺标语">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺特点">

                        <el-switch v-model="form.delivery">品牌保证</el-switch>
                        <span>品牌保证</span>
                        <el-switch v-model="form.delivery2">蜂鸟专送</el-switch>
                        <span>蜂鸟专送</span>
                        <el-switch v-model="form.delivery3">新开店铺</el-switch>
                        <span>新开店铺</span>
                        <el-switch v-model="form.delivery4">外卖宝</el-switch>
                        <span>外卖宝</span>
                        <el-switch v-model="form.delivery5">准时达</el-switch>
                        <span>准时达</span>
                        <el-switch v-model="form.delivery6">开发票</el-switch>
                        <span>开发票</span>
                    </el-form-item>
                    <el-form-item label="包装费">
                        <el-input-number v-model="num1" @change="handleChange" :min="0" :max="10"
                                         label="描述文字"></el-input-number>
                    </el-form-item>
                    <el-form-item label="价格">
                        <el-input-number v-model="num2" @change="handleChange" :min="0" :max="10"
                                         label="描述文字"></el-input-number>
                    </el-form-item>
                    <el-form-item label="店铺分类">
                        <el-cascader
                            expand-trigger="hover"
                            :options="categoryOptions"
                            v-model="selectedCategory"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="上传店铺头像" label-width="100px">
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
                    <el-form-item label="上传营业执照" label-width="100px">
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
                    <el-form-item label="上传餐饮服务许可证" label-width="100px">
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
                    <el-form-item label="优惠活动">
                        <el-select v-model="form.region" placeholder="请选择优惠活动">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-table
                        :data="tableData"
                        style="width: 100%">
                        <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址">
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>


                </el-form>

            </el-col>
        </el-row>

    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {

        components: {
            headTop,
        },
        data() {
            return {
                num1:0,
                num2:0,
                offset: 0,
                limit: 15,
                count: 0,
                selectTable: {},
                tableData: [],
                currentPage: 1,
                loading: true,
                dialogVisible: false,
                imageUrl: '',
                baseUrl: '',
                baseImgPath: "",
                select: "",
                addressSelect: "",
                selectedCategory: [],
                categoryOptions: [],
                city: {},//当前城市
                restaurants: [],
                timeout: null,
                form:{

                },
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]

            }
        },
        methods: {
            handleAvatarSuccess() {

            },
            beforeAvatarUpload() {

            },
            handleChange() {

            },
            querySearchAsync() {

            },
            handleDelete(){

            }


        }

    }
</script>

<style lang="less">
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
