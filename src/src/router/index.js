import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const Login = () => import('pages/login/login') => 示例写法
const Login = () => import('pages/login/login')
const Container = () => import('pages/container/container')
const Data = () => import('pages/data/data')// 数据
const Order = () => import('pages/order/order')
const OrderInquiry = () => import('pages/monies-inquiry/monies-inquiry')
const Client = () => import('pages/client/client')
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
      redirect: '/login'
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
        path: 'data',
        component: Data
      }, {
        path: 'order',
        component: Order
      }, {
        path: 'moniesInquiry',
        component: OrderInquiry
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
        path: 'client',
        component: Client
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
