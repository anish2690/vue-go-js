import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SimpleGraph from '@/views/SimpleGraph.vue'
import SimpleBlock from '@/views/SimpleBlock.vue'
import DynamicPorts from './views/SampleDynamicPorts.vue'
import DataFlow from './views/SampleDataFlow.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/SimpleGraph',
      name: 'SimpleGraph',
      component: SimpleGraph
    },
    {
      path: '/SimpleBlock',
      name: 'SimpleBlock',
      component: SimpleBlock
    },
    {
      path: '/DynamicPorts',
      name: 'DynamicPorts',
      component: DynamicPorts
    },
    {
      path: '/DataFlow',
      name: 'DataFlow',
      component: DataFlow
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
