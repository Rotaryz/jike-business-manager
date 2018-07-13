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
const OrganizationalStructure = () => import('pages/organizational-structure/organizational-structure')
const AddEmployees = () => import('pages/add-employees/add-employees')
const AuthorityManagement = () => import('pages/authority-management/authority-management')
const AuthorizationManagement = () => import('pages/authorization-management/authorization-management')
const AuthorizationDetail = () => import('pages/authorization-detail/authorization-detail')

export default new Router({
  mode: 'history',
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
        path: 'product',
        component: Product, // 产品列表
        meta: {
          title: '小程序管理,公司产品'
        }
      }, {
        path: 'officialNetwork',
        component: OfficialNetwork, // 官网
        meta: {
          title: '小程序管理,公司官网'
        }
      }, {
        path: 'productManagement',
        component: ProductManagement, // 产品新建
        meta: {
          title: '小程序管理,公司产品,添加产品'
        }
      }, {
        path: 'organizationalStructure', // 组织架构
        component: OrganizationalStructure,
        meta: {
          title: '员工管理,组织架构'
        }
      }, {
        path: 'authorityManagement', // 员工新建
        component: AuthorityManagement,
        meta: {
          title: '员工管理,权限管理'
        }
      }, {
        path: 'authorizationManagement', // 授权管理
        component: AuthorizationManagement,
        meta: {
          title: '授权管理'
        }
      }, {
        path: 'accountCenter', // 账户中心
        component: AccountCenter,
        meta: {
          title: '账户中心'
        }
      }, {
        path: 'addEmployees', // 添加员工
        component: AddEmployees,
        meta: {
          title: '员工管理,组织架构,员工编辑'
        }
      }]
    },
    {
      path: '/authorizationDetail', // 授权回调
      component: AuthorizationDetail
    }
  ]
})
