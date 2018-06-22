import Vue from 'vue'
import Router from 'vue-router'

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
// const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
// const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
// const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
// const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
// const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
// const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
// const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
// const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
// const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
// const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');
Vue.use(Router)
const routes = [
  {
    path: '/',
    component: login
  }, {
    path: '/manage',
    component: manage,
    name: 'manage',
    children: [{
      path: '',
      component: home,
      meta: []
    }, {
      path: '/userList',
      component: userList,
      meta: ['数据管理', '用户列表'],
    }, {
      path: '/shopList',
      component: shopList,
      meta: ['数据管理', '商家列表'],
    },{
      path: '/addShop',
      component: addShop,
      meta: ['添加数据', '添加商铺'],
    },
    {
      path: '/addGoods',
      component: addGoods,
      meta: ['添加数据', '添加商品'],
    }]
  }
]


export default new Router({
  routes,
  mode: 'history',
  strict: process.env.NODE_ENV !== 'production',

  // routes: [
  //   {
  //     path: '/',
  //     name: 'HelloWorld',
  //     component: HelloWorld
  //   }
  // ]
})
