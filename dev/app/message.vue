<template>
	<div> <input type="text" v-model="msg">
         <p>{{ msg }}</p>
	</div>
		
</template>


<script>
	module.exports = {
		data : function(){
			return {
				msg : ''
			}
		}
	}
</script>


