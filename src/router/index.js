import { createRouter, createWebHistory } from 'vue-router'

import Main from '../pages/MainPage.vue'

import ChallengePage from '../pages/ChallengePage.vue'
import ProfilePage from '../pages/ProfilePage.vue'

import StatsPage from '../pages/StatsPage.vue'
import StatsOverview from '../views/StatsOverview.vue'
import StatsSec from '../views/StatsSec.vue'

import AccountPage from '../pages/AccountPage.vue'
import AccountOverview from '../views/AccountPageOverview.vue'
import AccountExternalLinks from '../views/AccountPageExternalLinks.vue'
import AccountPersonal from '../views/AccountPagePersonal.vue'
import AccountSecurity from '../views/AccountPageSecurity.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Main
    },
    {
      path: '/challenge/:challengeid',
      name: 'Challenge',
      component: ChallengePage
    },
    {
      path: '/account/',
      component: AccountPage,
      children: [
        {
          path: '',
          name: 'account-overview',
          component: AccountOverview
        },
        {
          path: 'external-links',
          name: 'account-external-links',
          component: AccountExternalLinks
        },
        {
          path: 'personal',
          name: 'account-personal',
          component: AccountPersonal
        },
        {
          path: 'security',
          name: 'account-security',
          component: AccountSecurity
        }
      ]
    },
    {
      path: '/stats/',
      component: StatsPage,
      children: [
        {
          path: '',
          name: 'stats-overview',
          component: StatsOverview
        },
        {
          path: 'stats',
          name: 'stats-sec',
          component: StatsSec
        },
      ]
    },
    {
      path: '/profile',
      component: ProfilePage,
    }
  ]
})