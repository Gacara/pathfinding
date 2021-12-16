import Vue from 'vue'
import Router from 'vue-router'
import Pokemon from '@/components/Pokemon'
import Threejs from'@/components/Threejs'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Pokemon/',
      name: 'Pokemon',
      component: Pokemon
    },
    {
      path: '/',
      name: 'Threejs',
      component: Threejs
    }

  ]
})
