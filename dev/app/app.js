var Vue       = require('vue');
var VueRouter = require('vue-router'); 
var Main     = require('./main.vue');
var Header = require('./components/header.vue');   
var input = require('./message.vue'); 

Vue.component('main-header',Header); 



var Main = new Vue({
	el : '#main-wrapper', 
	render : h => h(Main)  
});

