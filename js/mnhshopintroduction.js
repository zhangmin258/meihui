



Vue.http.options.emulateJSON = true;
var shopVm=new Vue({
	el:'#shopBody',
	data:{
		shopContent:''
	},
	methods:{
		
	},
	ready:function(){
		loads();
		this.shopId=store.get('shopId');
		this.$http({method:'POST',url:URL+'/shopping/meigou_store/store_detail',data:{store_id:this.shopId}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.shopContent=response.data.data;
					setTimeout(function(){loadh();},2000)
					
				}
			}
		);
	}
})

