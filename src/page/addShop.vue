<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
            <el-col :span="14" :offset="4">
                <el-form ref="ruleForm" :model="selectTable" :rules ="rules" label-width="80px" style="margin-top: 20px;">
                    <el-form-item label="店铺名称" prop="name">
                        <el-input v-model="selectTable.name"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address" label-width="80px">
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
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model.number="selectTable.phone" maxLength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺简介" prop="description">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺标语" prop="promotion_info">
                        <el-input v-model="selectTable.promotion_info"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺分类">
                        <el-cascader
                            expand-trigger="hover"
                            :options="categoryOptions"
                            v-model="selectedCategory"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="店铺特点" >
                        <el-switch v-model="selectTable.is_premium">品牌保证</el-switch>
                        <span>品牌保证</span>
                        <el-switch v-model="selectTable.delivery_mode">蜂鸟专送</el-switch>
                        <span>蜂鸟专送</span>
                        <el-switch v-model="selectTable.new">新开店铺</el-switch>
                        <span>新开店铺</span>
                        <el-switch v-model="selectTable.bao">外卖宝</el-switch>
                        <span>外卖宝</span>
                        <el-switch v-model="selectTable.zhun">准时达</el-switch>
                        <span>准时达</span>
                        <el-switch v-model="selectTable.piao">开发票</el-switch>
                        <span>开发票</span>
                    </el-form-item>
                    <el-form-item label="配送费" prop="float_delivery_fee">
                        <el-input-number v-model="selectTable.float_delivery_fee" @change="handleChange" :min="0" :max="10"
                                         label="描述文字"></el-input-number>
                    </el-form-item>
                    <el-form-item label="起步价" prop="float_minimum_order_amount">
                        <el-input-number v-model="selectTable.float_minimum_order_amount" @change="handleChange" :min="0" :max="10"
                                         label="描述文字"></el-input-number>
                    </el-form-item>
                    <el-form-item label="营业时间">
                        <el-time-select
                            placeholder="起始时间"
                            v-model="selectTable.startTime"
                            :picker-options="{
                              start: '05:30',
                              step: '00:15',
                              end: '23:30'
                            }">
                        </el-time-select>
                        <el-time-select
                            placeholder="结束时间"
                            v-model="selectTable.endTime"
                            :picker-options="{
                          start: '05:30',
                          step: '00:15',
                          end: '23:30',
                          minTime: selectTable.startTime
                        }">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="上传店铺头像" label-width="100px">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/v1/addimg/shop'"
                            :show-file-list="false"
                            :on-success="handleShopAvatarScucess"
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
                            :on-success="handleBusinessAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selectTable.business_license_image"
                                 :src="baseImgPath + selectTable.business_license_image"
                                 class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="上传餐饮服务许可证" label-width="100px">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/v1/addimg/shop'"
                            :show-file-list="false"
                            :on-success="handleServiceAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selectTable.catering_service_license_image"
                                 :src="baseImgPath + selectTable.catering_service_license_image    "
                                 class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="优惠活动">
                        <el-button type="primary" icon="el-icon-plus" @click="addActive">添加活动</el-button>
                    </el-form-item>
                    <el-table
                        :data="activities"
                        style="width: 100%">
                        <el-table-column
                            prop="icon_name"
                            label="活动标题"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="活动名称"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="description"
                            label="活动详情">
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, activities)">删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog
            title="添加优惠活动"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form ref="formActive" :rules="rules"  :model="activitie" label-width="100px">
                <el-form-item label="活动标题" prop="icon_name" >
                    <el-input v-model="activitie.icon_name"></el-input>
                </el-form-item>
                <el-form-item label="活动名称">
                    <el-input v-model="activitie.name"></el-input>
                </el-form-item>
                <el-form-item label="活动详情" prop="description">
                    <el-input v-model="activitie.description"></el-input>
                </el-form-item>
                </el-form>

            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="comfirmActive('formActive')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {cityGuess, addShop, searchplace, foodCategory} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'

    export default {

        components: {
            headTop,
        },
        data() {
            return {
                dialogVisible: false,
                selectTable: {
                    name: '', //店铺名称
                    address: '', //地址
                    latitude: '',
                    longitude: '',
                    description: '', //介绍
                    phone: '',
                    promotion_info: '',
                    float_delivery_fee: 5, //运费
                    float_minimum_order_amount: 20, //起价
                    is_premium: true,
                    delivery_mode: true,
                    new: true,
                    bao: true,
                    zhun: true,
                    piao: true,
                    startTime: '',
                    endTime: '',
                    image_path: '',
                    business_license_image: '',
                    catering_service_license_image: '',
                },
                baseUrl: '',
                baseImgPath: "",
                selectedCategory: ['快餐便当', '简餐'],
                category: [],
                categoryOptions: [],
                city: {},//当前城市
                activities: [{
                    icon_name: '减',
                    name: '满减优惠',
                    description: '满30减5，满60减8',
                }],
                activitie:{},
                rules: {
                    name: [
                        { required: true, message: '请输入店铺名称', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入联系电话' },
                        { type: 'number', message: '电话号码必须是数字' }
                    ],
                    icon_name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],
                    description: [
                        { required: true, message: '请输入活动详情', trigger: 'blur' },
                    ]
                }

            }
        },
        created() {
            this.initData();
        },
        methods: {
            async initData() {
                try {
                    this.city = await cityGuess();
                    this.getCategory()
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            //店铺分类
            async getCategory() {
                try {
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
                            });
                            this.categoryOptions.push(addnew)
                        }
                    })
                } catch (err) {
                    console.log('获取商铺种类失败', err);
                }
            },
            //地址搜索
            async querySearchAsync(queryString, cb) {
                if (queryString) {
                    try {
                        const cityList = await searchplace(this.city.id, queryString);
                        console.log(cityList);
                        if (cityList instanceof Array) {
                            cityList.map(item => {
                                item.value = item.address;
                                return item;
                            });
                            cb(cityList)
                        }

                    } catch (err) {
                        console.log(err)
                    }

                }
            },
            //地址选择
            addressSelect(address) {
                this.selectTable.latitude = address.latitude;
                this.selectTable.longitude = address.longitude;
            },
            //上传店铺头像
            handleShopAvatarScucess(res, file) {
                if (res.status == 1) {

                    this.selectTable.image_path = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }


            },
            //上传营业执照
            handleBusinessAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectTable.business_license_image = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }

            },
            //上传餐饮服务许可证
            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {

                    this.selectTable.catering_service_license_image = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            //上传图片验证
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },

            comfirmActive(formName) {

                this.$refs[formName].validate( (valid)=>{
                        if(valid){
                            const Obj = {
                                icon_name:this.activitie.icon_name,
                                name:this.activitie.name,
                                description:this.activitie.description
                            };
                            this.activities.push(Obj);
                            this.dialogVisible = false;
                        }else{
                            this.$notify({
                                title: '错误',
                                message: '请检查输入',
                                offset:100
                            });
                            return false;
                        }


                })


            },

            handleClose(){

            },
            //创建活动
            addActive(formName){
                this.dialogVisible = true;
                if(this.$refs[formName]!==undefined){
                    this.$refs[formName].resetFields();
                }

            },
            handleChange() {

            },
            //删除活动
            handleDelete(index,row) {
                row.splice(index, 1);

            },

            onSubmit(formName) {

                this.$refs[formName].validate(async (valid)=>{
                  if(valid){
                      Object.assign(this.selectTable,{activities:this.activities},
                          {category: this.selectedCategory.join('/')}
                      )
                      let result = await addShop(this.selectTable)

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

                })

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
