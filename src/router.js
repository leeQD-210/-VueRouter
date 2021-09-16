import Vue from 'vue';
import VueRouter from './vueRouter';
import Home from './components/Home';
import Login from './components/Login';
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
  ],
});
export default router;
