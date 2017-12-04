//支付完成后从参团列表到-开团页
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'groupsRefresh');
			return true;
		}
	});
});


Vue.http.options.emulateJSON = true;
var zuVm=new Vue({
	el:'#zuBody',
	data:{
		groupId:'',
		
		zuList:'',
		pageNumber:1,
		totalPage:'',
		groupEndTime:''        //参团结束时间
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#zu-refresh').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#zu-refresh').pullRefresh().endPullup(true);}, 1000); 
			}else{
				mui('#zu-refresh').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/shopping/Group/group_lobby',data:{group_id:this.groupId,page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){    
								this.zuList.push(response.data.data[i]);
							}
						}
					}
				);
			}	
		},
		//我要参团（登录、参团时间）
		joinGroup:function(groupsn){
			var nowTime=new Date().getTime();
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){
		       	var btnArray = ['取消', '确认'];
		        mui.confirm('登录后才能参团哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('../land/login.html');		
		            } else {} 
		        });				
			}else if(nowTime>=this.groupEndTime*1000){
				mui.toast('参团时间已过！'); 
			}else{				
				this.$http({method:'POST',url:URL+'/shopping/Group/is_able',data:{uid:localStorage.uid,group_sn:groupsn}}).then(  //判断是否可以参团
					function(response){
						if(response.data.success==true){
//							console.log(response.data);
							store.set('groupsn',groupsn);
							jump("mnhtxp.html");							
						}else{
							mui.toast(response.data.msg);	
						}
					}
				);
			}
		},
		//获取组数据
		getZuContent:function(){
			this.$http({method:'POST',url:URL+'/shopping/Group/group_lobby',data:{group_id:this.groupId}}).then(
				function(response){
					if(response.data.success==true){
	//					console.log(response.data);
						this.zuList=response.data.data;
						this.groupEndTime=response.data.data[0].time_end;
						this.totalPage=response.data.page.totalPage;
						setTimeout(function(){loadh()},1000);
					}
				}
			);				
		}		
	},
	ready:function(){
		this.groupId=store.get('groupId'); //alert(this.groupId);
		loads();
		this.getZuContent();
		mui.init({
			pullRefresh: {
				container: '#zu-refresh',
				down: {
					style:'circle',
					color:'#ff6797',
					height:'-100px',
					range:'0px',
					offset:'-100px',
					callback: this.pulldownRefresh
				},
				up: {
					auto:false,
					contentrefresh: '正在加载...',
					callback: this.pullupRefresh
				}
			}
		});
		//刷新参团列表
		window.addEventListener('groupsRefresh',function(){
			loads();
			this.getZuContent();
		}.bind(this));		
		
	}
})


