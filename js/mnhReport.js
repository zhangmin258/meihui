

mui('footer').on('tap','.mnhfooterinput',function(){
	jump('repsubTaolun.html');
});

Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
});

Vue.http.options.emulateJSON = true;
var repVm=new Vue({
	el:'#repBody',
	computed:{
		
	},
	data:{
		repid:'',
		repData:'',
		pageNumber:1,
		totalPage:'',
		isFocus:'',
		repComList:''
	},
	methods:{
		//报道讨论加载更多
		reploadMore:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				return;
			}else{
				this.$http({method:'POST',url:URL+'/party/Report/report_comment',data:{report_id:this.repid,page:this.pageNumber}}).then(
					function(response){						
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.repComList.push(response.data.data[i]);
							}
						}
					}
				)
			}			
		},
		//报道关注
		repFocus:function(){
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){  //未登录（肯定没关注）
		       var btnArray = ['取消', '确认'];
		        mui.confirm('登陆后才能关注哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('land/login.html');		
		            } else {} 
		        });				
			}else if(this.isFocus=='已关注'){                         //已经登陆已关注（这时可以取消关注）
				this.$http({method:'POST',url:URL+'/party/Report/report_focus',data:{uid:localStorage.uid,report_id:this.repid,is_focus:0}}).then(
					function(response){if(response.data.success==true){mui.toast('您已经取消关注该报道！');this.isFocus='未关注'};this.repData.focus--;}
				)
			}else{                                                   //已登陆未关注
				this.$http({method:'POST',url:URL+'/party/Report/report_focus',data:{uid:localStorage.uid,report_id:this.repid,is_focus:1}}).then(
					function(response){if(response.data.success==true){mui.toast('您已经关注该报道！');this.isFocus='已关注'};this.repData.focus++;}
				)				
			} 			
		}
	},
	ready:function(){
		this.repid=store.get('mnhReport');    //alert(this.repid);
		loads();
//		报道详情
		this.$http({method:'POST',url:URL+'/party/report/report_detail',data:{report_id:this.repid,uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
					this.repData=response.data.data;
					this.isFocus=response.data.data.is_focus.msg;        //关注（已关注/未关注）
					setTimeout(function(){loadh()},1000);
				}
			}
		);
//		报道全部讨论
		this.$http({method:'POST',url:URL+'/party/Report/report_comment',data:{report_id:this.repid}}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.repComList=response.data.data;
					this.totalPage=response.data.page.totalPage;
				}
			}
		);
		var _this=this;
		//登录后更新报道状态
		window.addEventListener('status',function(){
			_this.$http({method:'POST',url:URL+'/party/report/report_detail',data:{report_id:_this.repid,uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
						_this.repData=response.data.data;
						_this.isFocus=response.data.data.is_focus.msg;        //关注（已关注/未关注）						
					}
				}
			);		
		});			
		//提交讨论后返回刷新报道列表
		window.addEventListener('getTaolunList',function(){
			_this.$http({method:'POST',url:URL+'/party/Report/report_comment',data:{report_id:_this.repid}}).then(
				function(response){
	//				console.log(response.data);
					if(response.data.success==true){
						_this.repComList=response.data.data;
						_this.totalPage=response.data.page.totalPage;
						_this.pageNumber=1;
					}
				}
			);			
		})
	}
})










