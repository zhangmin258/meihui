

//报名完成后返回支付页，禁止报名
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
//			var page = plus.webview.getWebviewById('');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'yjbaoming');
			return true;
		}
	});
});



Vue.filter('timeFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
});

Vue.http.options.emulateJSON = true;
var ticketBodyVm=new Vue({
	el:'#ticketBody',
	computed:{
		
	},
	data:{
		actid:'',
		ticketContent:''
	},
	methods:{
		
	},
	ready:function(){
		mui.plusReady(function(){plus.nativeUI.showWaiting()});
		this.actid=store.get('mnhcontentnav');
		this.$http({method:'POST',url:URL+'/party/Activity/eticket_detail',data:{uid:localStorage.uid,activity_id:this.actid}}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.ticketContent=response.data.data;
					setTimeout(function(){
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});
					},1000)					
				}
			}
		)
	}
})













