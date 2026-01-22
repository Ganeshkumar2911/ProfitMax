import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import Watchlist from '@/views/watchlist/Main.vue'
import Funds from '@/views/wallet/Main.vue'
import Orders from '@/views/orders/Main.vue'
import Positions from '@/views/positions/Main.vue'
import Profile from '@/views/profile/Main.vue'
import Login from '@/views/auth/Login.vue'
import AddInstrument from '@/views/watchlist/AddInstrument.vue'
import Register from '@/views/auth/Register.vue'
import Chart from '@/views/chart/index.vue'
import ProfileMargin from '@/views/profile/ProfileMargin.vue'
import TradeReport from '@/views/trade-reports/Main.vue'
import Market from '@/views/market/Main.vue'
import Main from '@/views/auth/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      name: 'main',
      redirect: '/watchlist',
      children: [
        {
          path: 'watchlist',
          name: 'watchlist',
          component: Watchlist,

        },
        // {
        //   path: 'watchlist/chart',
        //   name: 'chart',
        //   component: Chart,

        // },
        {
          path: 'chart/:exchange/:symbol/:token',
          name: 'chart',
          component: Chart,
        },
        {
          path: 'watchlist/add',
          name: 'add',
          component: AddInstrument
        },
        {
          path: 'funds',
          name: 'funds',
          component: Funds
        },
        {
          path: 'orders',
          name: 'orders',
          component: Orders
        },
        {
          path: 'positions',
          name: 'positions',
          component: Positions
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,

        },
        {
          path: 'ledger',
          name: 'ledger',
          component: ProfileMargin
        },
        {
          path: 'trade-reports',
          name: 'trade-reports',
          component: TradeReport
        },
        {
          path: 'market',
          name: 'market',
          component: Market
        },

      ]
    },
    {
      path: '/login',
      component: Main,
      name: 'login'
    },
    {
      path: '/register',
      component: Register,
      name: 'register'
    }

  ],
})

export default router
