

var Vconsole=new VConsole();

Vue.http.options.emulateJSON = true;
var jlVm=new Vue({
	el:'#jiluBody',
	data:{
		rewardList:'',            //奖金列表
		totalPage:'',
		pageNumber:1
	},
	methods:{
		
	},
	ready:function(){
		loads();
		this.$http({method:'GET',url:URL+'/person/Chat/packages'}).then(
			function(response){
				if(response.data.success==true){
					console.log(response.data);
					this.rewardList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					setTimeout(function(){loadh();},1000);	
				}
			}
		);		
	}
})