/* Main skeleton */


<template>
    <div id="main-wrapper">
        <main-header></main-header>
        <app-input></app-input>
    </div>
 
</template>  

<script>
   var input = require('./message.vue');

    module.exports = {
        components : {
            'app-input' : input 
        }
    }
</script> 

