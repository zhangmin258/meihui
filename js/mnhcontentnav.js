


//跳转提交活动讨论页
mui('footer').on('tap','.icon-comment',function(){
	jump('actsubTaolun.html');
})


Vue.http.options.emulateJSON = true;
Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
});
var navVm=new Vue({
	el:'#navBody',
	data:{
		actid:'',
		navData:'',
		pageNumber:1,
		totalPage:'',
		//活动状态
		isFocus:'',    //关注
		isEnroll:'',   //报名
		
		navComList:'',  //讨论列表
		over:''         //活动类型
		
	},
	computed:{
		
	},
	methods:{
		//加载更多讨论
		loadMore:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				return;
			}else{
				this.$http({method:'POST',url:URL+'/party/Activity/activity_comment',data:{activity_id:this.actid,page:this.pageNumber}}).then(
					function(response){						
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.navComList.push(response.data.data[i]);
							}
						}
					}
				)
			}
		},
		//关注
		actFocus:function(){
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){  //未登录（肯定没关注）
		       var btnArray = ['取消', '确认'];
		        mui.confirm('登陆后才能关注哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('land/login.html');		
		            } else {} 
		        });				
			}else if(this.isFocus=='已关注'){                         //已经登陆已关注（这时可以取消关注）
				this.$http({method:'POST',url:URL+'/party/Activity/activity_focus',data:{uid:localStorage.uid,activity_id:this.actid,is_focus:0}}).then(
					function(response){if(response.data.success==true){mui.toast('您已经取消关注该活动！');this.isFocus='未关注'};this.navData.focus--;}
				)
			}else{                                                   //已登陆未关注
				this.$http({method:'POST',url:URL+'/party/Activity/activity_focus',data:{uid:localStorage.uid,activity_id:this.actid,is_focus:1}}).then(
					function(response){if(response.data.success==true){mui.toast('您已经关注该活动！');this.isFocus='已关注'};this.navData.focus++}
				)				
			}     
		},
		
		//立即报名
		actSingup:function(){			
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){  //未登录（肯定没报名）
		       var btnArray = ['取消', '确认'];
		        mui.confirm('登陆后才能报名哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('land/login.html');		
		            } else {} 
		        });				
			}else if(this.isEnroll=='已经报名'){                         //已经登陆已报名
				mui.toast('您已经报名该活动啦！');
				return;
			}else{animateWindow('slide-in-bottom','mnhtit.html');}     //已登陆未报名 (报名成功后返回该页面时，按钮状态重新更新，但现在没接完)
				
		},
	},
	ready:function(){
		this.actid= store.get('mnhcontentnav');  //活动id
		loads();
//		活动详情(根据uid判断是否关注/报名)
		this.$http({method:'POST',url:URL+'/party/Activity/activity_detail',data:{activity_id:this.actid,uid:localStorage.uid}}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.navData=response.data.data;
					this.isFocus=response.data.data.is_focus.msg;        //关注（已关注/未关注）
					this.isEnroll=response.data.data.is_enroll.msg;      //报名(立即报名/已经报名)
					this.over=response.data.data.is_over;                 // 1往期活动 0正在进行的活动
					if(response.data.data.is_over==1){
						this.$nextTick(function(){
							$('.mnhfooterbutton').attr('disabled',true).addClass('yjbm');
						});	
					};
					setTimeout(function(){loadh()},1000)
				}
			}
		);
//		活动全部讨论
		this.$http({method:'POST',url:URL+'/party/Activity/activity_comment',data:{activity_id:this.actid}}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.navComList=response.data.data;
					this.totalPage=response.data.page.totalPage;
				}
			}
		);
		
		
		//登陆完成更新活动状态
		var _this=this;
		window.addEventListener('status',function(){
			_this.$http({method:'POST',url:URL+'/party/Activity/activity_detail',data:{activity_id:_this.actid,uid:localStorage.uid}}).then(
				function(response){
	//				console.log(response.data); 
					if(response.data.success==true){
						_this.navData=response.data.data;
						_this.isFocus=response.data.data.is_focus.msg;        //关注（已关注/未关注）
						_this.isEnroll=response.data.data.is_enroll.msg;      //报名(立即报名/已经报名)
					}
				}
			);			
		});		
		//提交讨论完成后更新讨论列表
		window.addEventListener('getTaolunList',function(){
			_this.$http({method:'POST',url:URL+'/party/Activity/activity_comment',data:{activity_id:_this.actid}}).then(
				function(response){
	//				console.log(response.data);
					if(response.data.success==true){
						_this.navComList=response.data.data;
						_this.totalPage=response.data.page.totalPage;
						_this.pageNumber=1;
					}
				}
			);			
		});		
//		报名完成后禁止报名
		window.addEventListener('yjbaoming',function(){
			this.$http({method:'POST',url:URL+'/party/Activity/activity_detail',data:{activity_id:this.actid,uid:localStorage.uid}}).then(
				function(response){
	//				console.log(response.data);
					if(response.data.success==true){
						this.navData=response.data.data;
						this.isFocus=response.data.data.is_focus.msg;        //关注（已关注/未关注）
						this.isEnroll=response.data.data.is_enroll.msg;      //报名(立即报名/已经报名)
						setTimeout(function(){loadh()},1000)
					}
				}
			);			
		}.bind(this));
	}
})







