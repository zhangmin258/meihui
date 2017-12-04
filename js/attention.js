

    
Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
});

//活动人数
Vue.filter('numberFormate',function(number){
	if(number==0){
		return '不限';
	}else{
		return number;
	}
});

//活动价格
Vue.filter('priceFormate',function(price){
	if(price==0){
		return '免费';
	}else{
		return price;
	}
});

Vue.http.options.emulateJSON = true;
var publishVm=new Vue({
	el:'#attentionBody',
	data:{
		
		actList:'',
		repList:'',
		maList:'',
		
		totalPageArr:[],
		pageNumber:[1,1,1]
	},
	methods:{
		//跳转活动详情页
		actGoto:function(evt,actId){
			var obj = evt.currentTarget;
			store.set('mnhcontentnav', actId);
			difGoto(obj);			
		},
		//跳转报道详情页
//		repGoto:function(evt,repId){
//			var obj = evt.currentTarget;
//			store.set('mnhReport', repId);
//			difGoto(obj);			
//		},
		//跳转竞赛详情页
//		compGoto:function(evt,compId){
//			var obj = evt.currentTarget;
//			store.set('mnhCompe', compId);
//			difGoto(obj);			
//		},
		//活动取消关注
		actCancel:function(index,actId,evt){
			mui(evt.target).button('loading');
			this.$http({method:'POST',url:URL+'/person/Userparty/cancel_focus',data:{uid:localStorage.uid,p_id:actId,type:1}}).then(
				function(response){
					if(response.data.success==true){
						mui.toast('您已取消关注该活动！');
						this.actList.splice(index,1);
						mui(evt.target).button('reset');
					}
				},function(response){mui.toast('取消关注失败请检查网络！');mui(evt.target).button('reset');}
			);
		},
		//报道取消关注
//		repCancel:function(index,reptId,evt){
//			mui(evt.target).button('loading');
//			this.$http({method:'POST',url:URL+'/person/Userparty/cancel_focus',data:{uid:localStorage.uid,p_id:reptId,type:2}}).then(
//				function(response){
//					if(response.data.success==true){
//						mui.toast('您已经取消关注该报道！');
//						this.repList.splice(index,1);
//						mui(evt.target).button('reset');
//					}
//				},function(response){mui.toast('取消关注失败请检查网络！');mui(evt.target).button('reset');}
//			);			
//		},
		//竞赛取消关注
//		compCancel:function(index,comptId,evt){
//			mui(evt.target).button('loading');
//			this.$http({method:'POST',url:URL+'/person/Userparty/cancel_focus',data:{uid:localStorage.uid,p_id:comptId,type:3}}).then(
//				function(response){
//					if(response.data.success==true){
//						mui.toast('您已经取消关注该报道！');
//						this.maList.splice(index,1);
//						mui(evt.target).button('reset');
//					}
//				},function(response){mui.toast('取消关注失败请检查网络！');mui(evt.target).button('reset');}
//			);			
//		}
	},
	ready:function(){
		loads();
		var vueObj=this;
		this.$http({method:'POST',url:URL+'/person/Userparty/my_focus',data:{uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.actList=response.data.data.activity.list;
//					this.repList=response.data.data.report.list;
//					this.maList=response.data.data.match.list;
					
					this.totalPageArr[0]=response.data.data.activity.page.totalPage;
//					this.totalPageArr[1]=response.data.data.report.page.totalPage;
//					this.totalPageArr[2]=response.data.data.match.page.totalPage;
					setTimeout(function(){loadh()},1000);
					
					this.$nextTick(function(){
						var deceleration = mui.os.ios?0.003:0.0009;
						mui('.mui-scroll-wrapper').scroll({
							bounce: false,
							indicators: true, //是否显示滚动条
							deceleration:deceleration
						});
						mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, element) {
							var index1=index; 
							mui(element).pullToRefresh({
								down: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											self.endPullDownToRefresh();
										}, 1000);
									}
								},
								up: {
									callback: function() {
										var self = this;
//										alert(index1);
										if(index1==0){
											vueObj.pageNumber[0]++;
											if(vueObj.pageNumber[0]>vueObj.totalPageArr[0]){
												$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(0).show();
												setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
											}else{
												self.endPullUpToRefresh(false);
												vueObj.$http({method:'POST',url:URL+'/person/Userparty/my_focus',data:{page:vueObj.pageNumber[0],type:1,uid:localStorage.uid}}).then(
													function(response){
//														console.log(response.data);
														if(response.data.success==true){
															for(var i=0;i<response.data.data.length;i++){
																vueObj.actList.push(response.data.data[i]);
															}
														}
													}
												)												
											}
	
										}else if(index1==1){
											return;
//											vueObj.pageNumber[1]++;
//											if(vueObj.pageNumber[1]>vueObj.totalPageArr[1]){
//												$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(1).show();
//												setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
//											}else{
//												self.endPullUpToRefresh(false);
//												vueObj.$http({method:'POST',url:URL+'/person/Userparty/my_focus',data:{page:vueObj.pageNumber[1],type:2,uid:localStorage.uid}}).then(
//													function(response){
//														if(response.data.success==true){
//															console.log(response.data);
//															for(var j=0;j<response.data.data.length;j++){
//																vueObj.repList.push(response.data.data[j]);
//															};													
//														}
//													}
//												)												
//											}
										}else if(index1==2){
											return;
//											vueObj.pageNumber[2]++;
//											if(vueObj.pageNumber[2]>vueObj.totalPageArr[2]){
//												$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(2).show();
//												setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
//											}else{
//												self.endPullUpToRefresh(false);
//												vueObj.$http({method:'POST',url:URL+'/person/Userparty/my_focus',data:{page:vueObj.pageNumber[2],type:3,uid:localStorage.uid}}).then(
//													function(response){
//														if(response.data.success==true){
//															for(var k=0;k<response.data.data.length;k++){
//																vueObj.maList.push(response.data.data[k]);
//															};													
//														}
//													}
//												)												
//											}		
										}
									}
								}								
							})
						});
					});
				}
			}
		);
	}
})


//取消关注后进入详情页时刷新关注状态 ，不是以mui.back形式返回，会刷新页面



