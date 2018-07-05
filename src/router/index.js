import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const Login = () => import('pages/login/login') => 示例写法
const Login = () => import('pages/login/login')
const Container = () => import('pages/container/container')
const Product = () => import('pages/product/product')// 数据
const OfficialNetwork = () => import('pages/official-network/official-network')
const ProductManagement = () => import('pages/product-management/product-management')
const AccountCenter = () => import('pages/account-center/account-center')
const BusinessList = () => import('pages/business-list/business-list')
const BusinessGeneral = () => import('pages/business-general/business-general')
const Account = () => import('pages/account/account')
const Withdraw = () => import('pages/withdraw/withdraw')
const Notes = () => import('pages/notes/notes')
const BusinessDetail = () => import('pages/business-detail/business-detail')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/container'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/container',
      name: 'Container',
      component: Container,
      children: [{
        path: 'product',
        component: Product
      }, {
        path: 'officialNetwork',
        component: OfficialNetwork
      }, {
        path: 'productManagement',
        component: ProductManagement
      }, {
        path: 'businessList',
        component: BusinessList
      }, {
        path: 'businessGeneral',
        component: BusinessGeneral
      }, {
        name: 'BusinessDetail',
        path: 'businessDetail',
        component: BusinessDetail
      }, {
        path: 'accountCenter',
        component: AccountCenter
      }, {
        path: 'account',
        component: Account
      }, {
        path: 'withdraw',
        component: Withdraw
      }, {
        path: 'notes',
        component: Notes
      }]
    }
  ]
})
