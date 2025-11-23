import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/Home.vue')
const ArticleDetail = () => import('../views/ArticleDetail.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Home,
    props: true
  },
  {
    path: '/search',
    name: 'Search',
    component: Home,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router