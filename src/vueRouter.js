/* const router = new VueRouter{
	routes: [
		{path:'/',component:home}
	]
}
new Vue({
	router,
		render:h=>h(app)
}).$mounted('#app') */
let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    /* 如果已经注册过 */
    if (this.install.installed) {
      return;
    }
    this.install.installed = true;
    /* 保存vue对象 */
    _Vue = Vue;
    /* 通过混入，将router对象添加到vue实例上 */
    _Vue.mixin({
      beforeCreate() {
        // 判断是创建vue实例还是创建组件
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          /* 初始化路由和组件 */
          this.$options.router.init();
        }
      },
    });
  }
  constructor(options) {
    /* 在创建的路由实例中保存参数 */
    this.options = options;
    /* 储存路由信息 */
    this.routeMap = {};
    /* 保存当前路由路径, 并使其生成响应式属性*/
    this.data = _Vue.observable({
      current: '/',
    });
  }
  initRoutes() {
    if (this.options.routes) {
      /* 将用户传入得路由信息放到routerMap中 */
      this.options.routes.forEach((item) => {
        this.routeMap[item.path] = item.component;
      });
    }
  }
  initComponent() {
    /* 创建router-link组件 */
    _Vue.component('router-link', {
      props: {
        to: {
          type: String,
          required: true,
        },
      },
      /* 运行版本得vue不会编译template，需要使用render函数生成虚拟dom */
      render(h) {
        /* h(标签名，属性，子元素) */
        return h(
          'a',
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.handleClick,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        handleClick(e) {
          /* 阻止a标签默认跳转事件 */
          history.pushState({}, '', this.to);
          this.$router.data.current = this.to;
          e.preventDefault();
        },
      },
    });
    /* 创建router-view组件 */
    _Vue.component('router-view', {
      render(h) {
        return h(this.$router.routeMap[this.$router.data.current]);
      },
    });
  }
  init() {
    this.initRoutes();
    this.initComponent();
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname;
    });
  }
}
