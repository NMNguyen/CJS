// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import locale from 'element-ui/lib/locale/lang/vi';
// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'material-icons/iconfont/material-icons.css';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import _ from "lodash";
import moment from 'vue-moment';

Vue.use(Element, {locale});
Vue.use(axios);
Vue.use(Vuex);
Vue.use(_);
Vue.use(VueFroala)
Vue.use(moment);
Vue.config.productionTip = false;
Vue.prototype.$urlAPI = 'https://agilebackend.herokuapp.com/api/v1';
window.Vue = Vue;
/* eslint-disable no-new */
window.myvue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
Vue.component('multiselect', Multiselect);
