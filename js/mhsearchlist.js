

Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  
})

Vue.http.options.emulateJSON = true;	
var searchListVm=new Vue({
	el:'#searchListBody',
	computed:{},
	data:{
		searchcontent:'',  //搜索字段
		actList:'',actTotalPage:'',actPageNumber:1,
		
//		repList:'',repTotalPage:'',repPageNumber:1,
		
//		compList:'',compTotalPage:'',compPageNumber:1
		
	},
	methods:{
		//活动上拉加载
		actEndpullup:function(){
			this.actPageNumber++;
			if(this.actPageNumber>this.actTotalPage){
				$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(0).show();
				setTimeout(function() {mui('.act').pullToRefresh().endPullUpToRefresh(true);}, 1000);  //显示没有更多数据了
			}else{
				mui('.act').pullToRefresh().endPullUpToRefresh(false);
				this.$http({method:'POST',url:URL+'/party/Search/search',data:{page:this.actPageNumber,type:1,key_word:this.searchcontent}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.activity.list.length;i++){
								this.actList.push(response.data.data.activity.list[i]);
							}
						}
					}
				)
			}			
		},
		//活动详情页跳转
		actsearchGoto:function(evt,id){
			//console.log(evt.currentTarget);  //target 当前点击对象  currentTarget 事件绑定的对象 
			var obj=evt.currentTarget;
			store.set('mnhcontentnav',id);
			difGoto(obj);			
		},
		//报道上拉加载
//		repEndpullup:function(){
//			this.repPageNumber++;
//			if(this.repPageNumber>this.repTotalPage){
//				$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(1).show();
//				setTimeout(function() {mui('.rep').pullToRefresh().endPullUpToRefresh(true);}, 1000);  //显示没有更多数据了
//			}else{
//				mui('.rep').pullToRefresh().endPullUpToRefresh(false);
//				this.$http({method:'POST',url:URL+'/party/Search/search',data:{page:this.repPageNumber,type:2,key_word:this.searchcontent}}).then(
//					function(response){
//						if(response.data.success==true){
//							for(var i=0;i<response.data.data.report.list.length;i++){
//								this.compList.push(response.data.data.report.list[i]);
//							}
//						}
//					}
//				)
//			}			
//		},
		//报道详情页跳转
//		repsearchGoto:function(evt,id){
//			var obj=evt.currentTarget;
//			store.set('mnhReport',id);
//			difGoto(obj);				
//		},
		//竞赛上拉加载
//		compeEndPullup:function(){
//			this.compPageNumber++;
//			if(this.compPageNumber>this.compTotalPage){
//				$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(2).show();
//				setTimeout(function() {mui('.comp').pullToRefresh().endPullUpToRefresh(true);}, 1000);  //显示没有更多数据了
//			}else{
//				mui('.comp').pullToRefresh().endPullUpToRefresh(false);
//				this.$http({method:'POST',url:URL+'/party/Search/search',data:{page:this.compPageNumber,type:3,key_word:this.searchcontent}}).then(
//					function(response){
//						if(response.data.success==true){
//							for(var i=0;i<response.data.data.match.list.length;i++){
//								this.activityList.push(response.data.data.match.list[i]);
//							}
//						}
//					}
//				)
//			}			
//		},
		//竞赛详情页跳转
//		compsearchGoto:function(evt,id){
//			var obj=evt.currentTarget;
//			store.set('mnhCompe',id);
//			difGoto(obj);			
//		}
	},
	ready:function(){
		loads();
		var vueObj=this;
		this.searchcontent=store.get('searchcontent');  
		//阻尼系数
		var deceleration = mui.os.ios?0.003:0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: false, //是否显示滚动条
			deceleration:deceleration
		});
				
		mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, element) {
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
//						console.log(self.element.className);  
						if(self.element.className=='mui-scroll act'){
							if(vueObj.actList==''){$('.mui-pull-bottom-tips').hide();}else{vueObj.actEndpullup();};
						}else if(self.element.className=='mui-scroll rep'){
							if(vueObj.repList==''){$('.mui-pull-bottom-tips').hide();}else{vueObj.repEndpullup();};							
						}else if(self.element.className=='mui-scroll comp'){
							if(vueObj.compList==''){$('.mui-pull-bottom-tips').hide();}else{vueObj.compeEndPullup();};	
						};
					}
				}
			});
		});
		
		//根据搜索字段获取活动/报道/竞赛列表
		this.$http({method:'POST',url:URL+'/party/Search/search',data:{uid:localStorage.uid,key_word:this.searchcontent}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data.data);
					this.actList=response.data.data.activity.list;
					this.actTotalPage=response.data.data.activity.page.totalPage;
					
//					this.repList=response.data.data.report.list;
//					this.repTotalPage=response.data.data.report.page.totalPage;
					
//					this.compList=response.data.data.match.list;
//					this.compTotalPage=response.data.data.match.page.totalPage;
					
					setTimeout(function(){loadh()},1000);
				}
			}
		)
	}
	
})









