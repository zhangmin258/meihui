
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			//获得列表界面的webview
//			var page = plus.webview.getWebviewById('../html/mnhcontentnav.html');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'ticket-refresh');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
});

Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
});

Vue.http.options.emulateJSON = true;
var ticketVm=new Vue({
	el:'#ticketBody',
	data:{
		ticketList:'',
		totalPage:'',
		pageNumber:1
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#ticket-refresh').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#ticket-refresh').pullRefresh().endPullup(true);}, 1000); 
			}else{
				mui('#ticket-refresh').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/person/Userparty/my_ticket',data:{page:this.pageNumber,uid:localStorage.uid}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.ticketList.push(response.data.data[i]);
							}
						}
					}
				)
			}	
		},
		//跳转电子票页面
		goMyTicket:function(status,id){
			if(status=='有效'){
				store.set('mnhcontentnav',id);
				jump('../mnhticket.html');
			}
		}
	},
	ready:function(){
		loads();
		this.$http({method:'POST',url:URL+'/person/Userparty/my_ticket',data:{uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
					console.log(response.data);
					this.ticketList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					setTimeout(function(){loadh()},1000);
				}
			}
		);

		mui.init({
			pullRefresh: {
				container: '#ticket-refresh',
				down: {
					style:'circle',
					color:'#ff6797',
					height:'-100px',
					range:'0px',
					offset:'-100px',
					callback:this.pulldownRefresh
				},
				up: {
					auto:false,
					contentrefresh: '正在加载...',
					callback: this.pullupRefresh
				}
			}
		});
		
	}
})



