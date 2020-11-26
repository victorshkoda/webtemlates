import '@js'
import '@scss/style.scss'

/*
* Include jquery for native js
* */
// import * as $ from 'jquery'

/*
* Include vue.js
* */
window.Vue = require('vue')
import store from './store'
Vue.component('example-component', require('./components/Example.vue').default)
const app = new Vue({
    data(){
        return {
            component: false
        }
    },
    store,
    el: '#app'
})