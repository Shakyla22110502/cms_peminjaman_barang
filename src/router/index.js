import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import UserList from '../pages/UserList.vue'
import UserForm from '../pages/UserForm.vue'
import MainLayout from '../layouts/MainLayout.vue'
import ItemList from '../pages/ItemList.vue'
import ItemForm from '../pages/ItemForm.vue'
import BorrowingForm from '../pages/BorrowingForm.vue'
import BorrowingList from '../pages/BorrowingList.vue'
import Roles from '../pages/RolesList.vue'
import PermissionsList from '../pages/PermissionsList.vue'
import { useUserStore } from '../stores/UserStore'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },

      // Users
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-users',
        },
      },
      { path: 'users/create', name: 'UserCreate', component: UserForm },
      { path: 'users/:id/edit', name: 'UserEdit', component: UserForm, props: true },

      // Items
      {
        path: 'items',
        component: ItemList,
        meta: { requiresAuth: true, requiredPermission: 'view-items' },
      },
      { path: 'items/create', component: ItemForm },
      { path: 'items/edit/:id', component: ItemForm },

      // Borrowings
      {
        path: '/borrowings',
        name: 'BorrowingList',
        component: BorrowingList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-borrowing',
        },
      },
      {
        path: '/borrowings/create',
        name: 'BorrowingCreate',
        component: BorrowingForm,
      },
      {
        path: '/borrowings/:id/edit',
        name: 'BorrowingEdit',
        component: BorrowingForm,
        props: true,
      },
      {
        path: '/roles',
        component: Roles,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-roles',
        },
      },
      {
        path: '/permissions',
        name: 'Permissions',
        component: PermissionsList,
        meta: {
          requiredPermission: 'view-permissions',
          requiresAuth: true,
        },
      },
      {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('../pages/Unauthorized.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.name !== 'Login' && !token) {
    return next({ name: 'Login' })
  }

  if (to.name === 'Login' && token) {
    return next({ name: 'Dashboard' })
  }

  // Cek permission kalau route butuh
  const requiredPermission = to.meta.requiredPermission
  if (requiredPermission) {
    const userStore = useUserStore()
    const hasPermission = userStore.permissions.includes(requiredPermission)

    if (!hasPermission) {
      alert('Anda tidak memiliki izin untuk mengakses halaman ini.')
      return next({ name: 'Unauthorized' }) // atau langsung next('/') jika tidak buat halaman khusus
    }
  }

  next()
})

export default router
