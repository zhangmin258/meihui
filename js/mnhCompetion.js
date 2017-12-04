



//跳转发表竞赛讨论页
mui('footer').on('tap','.comp-taolun',function(){
	jump('compsubTaolun.html');
});



Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
});

Vue.http.options.emulateJSON = true;
var compVm=new Vue({
	el:'#compBody',
	computed:{
		
	},
	data:{
		compid:'',
		compData:'',
		pageNumber:1,
		totalPage:'',
		isFocus:'',            //关注
		isJoin:'',             //参与
		compComList:''
	},
	methods:{
		//竞赛讨论加载更多
		comploadMore:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				return;
			}else{
				this.$http({method:'POST',url:URL+'/party/Match/match_comment',data:{match_id:this.compid,page:this.pageNumber}}).then(
					function(response){						
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.compComList.push(response.data.data[i]);
							}
						}
					}
				)
			}			
		},
		//竞赛关注
		compFocus:function(){
			if(this.compData.status_info=='活动已结束'){mui.toast('该活动已经结束！'); return;}
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){  //未登录（肯定没关注）
		       var btnArray = ['取消', '确认'];
		        mui.confirm('登陆后才能关注哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('land/login.html');		
		            } else {} 
		        });				
			}else if(this.isFocus=='已关注'){                         //已经登陆已关注（这时可以取消关注）
				this.$http({method:'POST',url:URL+'/party/Match/match_focus',data:{uid:localStorage.uid,match_id:this.compid,is_focus:0}}).then(
					function(response){if(response.data.success==true){mui.toast('您已经取消关注该报道！');this.isFocus='未关注'};this.compData.focus--;}
				)
			}else{                                                   //已登陆未关注
				this.$http({method:'POST',url:URL+'/party/Match/match_focus',data:{uid:localStorage.uid,match_id:this.compid,is_focus:1}}).then(
					function(response){if(response.data.success==true){mui.toast('您已经关注该报道！');this.isFocus='已关注'};this.compData.focus++;}
				)				
			} 			
		},
		//立即参与
		compJoin:function(){
			if(this.compData.status_info=='活动已结束'){mui.toast('该活动已经结束！'); return;}
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){  //未登录（肯定没参与）
		       var btnArray = ['取消', '确认'];
		        mui.confirm('登陆后才能关注哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('land/login.html');		
		            } else {} 
		        });				
			}else if(this.isJoin=='已经参与'){                                                   //已登录（已参与）                                                    
				mui.toast('你已经参与过该项目！');
				return;
			}else{
				animateWindow('slide-in-bottom','mnhmeitit.html');                             //已登录(未参与)，参与成功后刷新参与状态
			}
		},
		
		
	},
	ready:function(){
		this.compid=store.get('mnhCompe');    //alert(this.compid);
		loads();
//		竞赛详情
		this.$http({method:'POST',url:URL+'/party/match/match_detail',data:{match_id:this.compid,uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
					this.compData=response.data.data;
					this.isFocus=response.data.data.is_focus.msg;        //关注（已关注/未关注）
					this.isJoin=response.data.data.is_join.msg;         //参与(立即参与/已经参与)					
					setTimeout(function(){loadh()},1000);
				}
			}
		);
//		竞赛全部讨论列表
		this.$http({method:'POST',url:URL+'/party/Match/match_comment',data:{match_id:this.compid}}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.compComList=response.data.data;
					this.totalPage=response.data.page.totalPage;
				}
			}
		);
		var _this=this;
//		登录后刷新竞赛详情
		window.addEventListener('status',function(){
			_this.$http({method:'POST',url:URL+'/party/match/match_detail',data:{match_id:_this.compid,uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
						_this.compData=response.data.data;
						_this.isFocus=response.data.data.is_focus.msg;        
						_this.isJoin=response.data.data.is_join.msg;   				
					}
				}
			);			
		});
		//参与完成后，禁止再次参与
		window.addEventListener('canyu',function(){
			this.$http({method:'POST',url:URL+'/party/match/match_detail',data:{match_id:this.compid,uid:localStorage.uid}}).then(
				function(response){
//					console.log(response.data);
					if(response.data.success==true){
						this.compData=response.data.data;
						this.isFocus=response.data.data.is_focus.msg;     
						this.isJoin=response.data.data.is_join.msg;      				
					}
				}
			);			
		}.bind(this));
		//讨论完成后，刷新竞赛讨论列表  
		window.addEventListener('getTaolunList',function(){
			this.$http({method:'POST',url:URL+'/party/Match/match_comment',data:{match_id:this.compid}}).then(
				function(response){
					if(response.data.success==true){
						this.compComList=response.data.data;
						this.totalPage=response.data.page.totalPage;
						this.pageNumber=1;
					}
				}
			);			
		}.bind(this));
	}
})
