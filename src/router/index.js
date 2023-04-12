import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  },
  {
    path: '/force',
    name: 'force',
    component: function () {
      return import('../views/ForceView.vue')
    }
  },
  {
    path: '/graph',
    name: 'graph',
    component: function () {
      return import('../views/GraphView.vue')
    }
  },
  {
    path: '/histogram',
    name: 'histogram',
    component: function () {
      return import('../views/HistogramView.vue')
    }
  },
  {
    path: '/collapsible',
    name: 'collapsible',
    component: function () {
      return import('../views/CollapsibleTreeView.vue')
    }
  },
  {
    path: '/map',
    name: 'map',
    component: function () {
      return import('../views/MapView.vue')
    }
  },
  {
    path: '/treemap',
    name: 'treemap',
    component: function () {
      return import('../views/TreeDataView.vue')
    }
  },
  {
    path: '/donut',
    name: 'donut',
    component: function () {
      return import('../views/DonutView.vue')
    }
  },
  {
    path: '/time',
    name: 'time',
    component: function () {
      return import('../views/TimeView.vue')
    }
  },
  {
    path: '/treemapview',
    name: 'treemapview',
    component: function () {
      return import('../views/TreeView.vue')
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
