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
import RoomForm from '../pages/RoomForm.vue'
import RoomList from '../pages/RoomList.vue'
import RoomLoanList from '../pages/RoomLoanList.vue'
import RoomLoanForm from '../pages/RoomLoanForm.vue'
import LocationList from '../pages/LocationList.vue'
import LocationForm from '../pages/LocationForm.vue'
import WeeklyRoomLoanList from '../pages/WeeklyRoomLoanList.vue'
import WeeklyRoomLoanForm from '../pages/WeeklyRoomLoanForm.vue'

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
        name: 'ItemList',
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

      // Roles & Permissions
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

      // Rooms
      {
        path: '/rooms',
        name: 'RoomList',
        component: RoomList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-rooms',
        },
      },
      {
        path: '/rooms/create',
        name: 'RoomCreate',
        component: RoomForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-rooms',
        },
      },
      {
        path: '/rooms/:id/edit',
        name: 'RoomEdit',
        component: RoomForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-rooms',
        },
      },

      // Room Loans
      {
        path: '/room-loans',
        name: 'RoomLoanList',
        component: RoomLoanList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-room-loans',
        },
      },
      {
        path: '/room-loans/create',
        name: 'RoomLoanCreate',
        component: RoomLoanForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-room-loans',
        },
      },
      {
        path: '/room-loans/:id/edit',
        name: 'RoomLoanEdit',
        component: RoomLoanForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-room-loans',
        },
      },
      {
        path: '/weekly-room-loans',
        name: 'WeeklyRoomLoanList',
        component: WeeklyRoomLoanList,
        props: true,
        meta: { 
          requiresAuth: true,
          requiredPermission: 'view-weekly-room-loans',
        },
      },
      {
        path: '/weekly-room-loans/create',
        name: 'WeeklyRoomLoanCreate',
        component: WeeklyRoomLoanForm,
        meta: { 
          props: true,
          requiresAuth: true,
          requiredPermission: 'create-weekly-room-loans',
        },
      },
      {
        path: '/weekly-room-loans/:id/edit',
        name: 'WeeklyRoomLoanEdit',
        component: WeeklyRoomLoanForm,
        props: true,
        meta: { 
          props: true,
          requiresAuth: true, 
          requiredPermission: 'edit-weekly-room-loans',
        },
      },
      {
        path: '/locations',
        name: 'LocationList',
        component: LocationList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-location',
        },
      },
      {
        path: '/locations/create',
        name: 'LocationCreate',
        component: LocationForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-location',
        },
      },
      {
        path: '/locations/:id/edit',
        name: 'LocationEdit',
        component: LocationForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-location',
        },
      },

      // Unauthorized
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
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../pages/ForgotPassword.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../pages/ResetPassword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const guestRoutes = ['Login', 'ForgotPassword', 'ResetPassword']

  if (!guestRoutes.includes(to.name) && !token) {
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
      return next({ name: 'Unauthorized' })
    }
  }

  next()
})

export default router
