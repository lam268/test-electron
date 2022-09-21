import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@renderer/components/Homepage.vue'
import StreamingPage from '@renderer/components/StreamingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Homepage',
    component: Homepage
  },
  {
    path: '/stream',
    name: 'StreamingPage',
    component: StreamingPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
