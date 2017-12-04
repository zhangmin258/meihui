


mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			//获得列表界面的webview
//			var page = plus.webview.getWebviewById('../html/mnhcontentnav.html');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'canyu');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
});




Vue.http.options.emulateJSON = true;
var meitVm=new Vue({
	el:'#titBody',
	computed:{
		
	},
	data:{
		compid:'',
		compList:'',  //竞赛列表
		pageNumber:1,
		totalPage:'',
		compTitle:''
		
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#meitit-content').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				$('.mui-pull-top-tips').show();
				setTimeout(function() {mui('#meitit-content').pullRefresh().endPullup(true);}, 1500);//参数为true代表没有更多数据了。
			}else{
				mui('#meitit-content').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/party/Match/match_join_list',data:{match_id:this.compid,page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.compList.push(response.data.data[i]);
							}
						}
					}
				)
			}			
		},
//		投票
		vote:function(id,vote){			
	       	var btnArray = ['取消', '确认'];
	        mui.confirm('每人只有一票哦！你选择好了吗？', '确认框', btnArray, function(e) {
	            if (e.index == 1){
					$('.vote-btn').attr('disabled',true);
					this.$http({method:'POST',url:URL+'/party/Match/match_join_vote',data:{match_id:this.compid,join_id:id,uid:localStorage.uid}}).then(
						function(response){
							if(response.data.success==true){
								if(response.data.data.code==0){
									mui.toast('感谢您的支持！');
									vote++;
								}else{
									mui.toast(response.data.data.msg);
								}
		
							}
						},function(error){
							$('.vote-btn').attr('disabled',false);
							mui.toast('投票失败，请检查网络！');
						}
					)							
	            } else {} 
	        }.bind(this));			

		}
	},
	ready:function(){
		loads();
		this.compid=store.get('mnhCompe');
		//获取竞赛列表
		this.$http({method:'POST',url:URL+'/party/Match/match_join_list',data:{match_id:this.compid}}).then(
			function(response){
//				console.log(response.data);
				this.compTitle=response.data.page.subject;
				if(response.data.success==true){
					this.compList=response.data.data;
					this.totalPage=response.data.page.totalPage;
				};
				setTimeout(function(){loadh()},2000);
			}
			
		);
//		加载刷新
		mui.init({
			pullRefresh: {
				container: '#meitit-content',
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
					callback:this.pullupRefresh
				}
			}
		});		
	}
})









