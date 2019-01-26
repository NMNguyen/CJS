import Vue from 'vue';
import Router from 'vue-router';
import Gantt from '@/components/Gantt';
import Login from '@/components/login/main';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Gantt',
      component: Gantt,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});
