import Vue from 'vue'
import Router from 'vue-router'
import User from '../pages/user';
import UserIndex from '../pages/userIndex';
import Course from '../pages/course';
import SelectCourse from '../pages/selectCourse';
import Login from '../pages/login';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/user',
      name: 'landing-page',
      component: User,
      redirect:{
        name:'index'
      },
      children:[
        {
          path:'index',
          name:'index',
          component:UserIndex
        },
        {
          path:'course',
          name:'course',
          component:Course
        },
        {
          path:'selectCourse',
          name:'selectCourse',
          component:SelectCourse
        }
      ]
    },
    {
      path: '/login',
      name:'login',
      component:Login
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
