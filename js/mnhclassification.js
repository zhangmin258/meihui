

//搜索页面跳转
mui('.mui-content').on('tap','.mui-input-row',function(){
	jump('mnhshopsearch.html');
});


Vue.http.options.emulateJSON = true;
var classVm=new Vue({
	el:'#classBody',
	data:{
		categoryList:''  //分类列表	
	},
	methods:{
		//跳转某个商品分类页
		goClass:function(id){
			store.set('classId',id);
			jump('mnhshoppingnav.html');
		}
	},
	ready:function(){
		loads();
		this.$http({method:'GET',url:URL+'/shopping/Cate/get_ordinary_category'}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.categoryList=response.data.data;
					setTimeout(function(){loadh()},1000);
				}
			}
		);
	}
})

