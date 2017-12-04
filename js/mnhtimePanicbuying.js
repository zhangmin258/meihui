

//	mui.init({
//		swipeBack: false //启用右滑关闭功能
//	});

Vue.filter('quzheng',function(string){
	return parseInt(string);
});
Vue.http.options.emulateJSON = true;	
var rushbuyVm=new Vue({
	el:'#rushbuyBody',
	data:{
		client_time:'',        //今天抢购
		
		firstbuyTitle:'',      //第一个标题内容
		rushbuyTitle:[],      //抢购时间段(标题)
		
		firstRushbuy:'',       //第一个标题内容
		firstPoint:'',          //第一个标题内容开始时间点
		firstTotalPage:'',
		firstPageNumber:1,
		
		otherRushbuy:[],       //其他标题内容
		otherTotalPage:[],     //其他标题内容分页，以数组的形式呈现
		otherPageNumberArr:[],    //其他标题内容pageNumber,以数组的形式呈现
		otherPoint:[]          //其他标题内容开始时间点，以数组的形式呈现
	},
	methods:{
		loadContent:function(){
			loads();
			var vueObj=this;
			this.client_time=parseInt(new Date().getTime()/1000);   //时间戳转换为以秒为单位 
			this.$http({method:'POST',url:URL+'/shopping/Limitbuy/hours_list',data:{client_time:this.client_time}}).then(
				function(response){
					if(response.data.success==true){
						this.firstbuyTitle=response.data.data[0];
						for(var i=1;i<response.data.data.length;i++){
							this.rushbuyTitle.push(response.data.data[i]);
						}
					}
				}	
			);
			
			//标题下面的内容
			this.$http({method:'POST',url:URL+'/shopping/Limitbuy/limit_goods_list',data:{client_time:this.client_time,type:'listinit'}}).then(
				function(response){
					if(response.data.success==true){
//						console.log(response.data);
						//(第一条内容还是要单独弄出来)
						this.firstRushbuy=response.data.data[0].goods;  
						this.firstPoint=response.data.data[0].point;
						this.firstTotalPage=response.data.data[0].page.totalPage;  					
						this.$nextTick(function(){            //已售进度条
							for(var k=0;k<response.data.data[0].goods.length;k++){
								$('#rushItem0 .mui-media').eq(k).find('i').css('width',response.data.data[0].goods[k].percent+'%');
								
							}						
						});
						
						//余下标题内容(双循环)
						var otherPageObj={otherPageNumber:1};
						for(var i=1; i<response.data.data.length;i++){
							this.otherRushbuy.push(response.data.data[i]);
							this.otherTotalPage.push(response.data.data[i].page.totalPage); //其他标题内容分页，以数组的形式呈现
							this.otherPoint.push(response.data.data[i].point);              //其他标题内容开始时间点，以数组的形式呈现
							this.otherPageNumberArr.push(otherPageObj);                     //其他标题内容pageNumber,以数组的形式呈现
						};
						this.$nextTick(function(){            //已售进度条
							for(var j=1; j<response.data.data.length;j++){
								for(var m=0;m<response.data.data[j].goods.length;m++){
									$('#rushItem'+j+' .mui-media').eq(m).find('i').css('width',response.data.data[j].goods[m].percent+'%');	
								}								
							}
						});
						
						//下拉刷新/上拉加载
						this.$nextTick(function(){
							setTimeout(function() {loadh()}, 1000);
							var deceleration = mui.os.ios?0.003:0.0009;
							mui('.mui-scroll-wrapper').scroll({
								bounce: false,
								indicators: false, //是否显示滚动条
								deceleration:deceleration
							});
							mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, element) {
								var index=index;                           //当前刷新框的序号
								
								mui(element).pullToRefresh({
									down: {
										callback: function() {
											this.endPullDownToRefresh();
										}
									},
									up: {
										callback: function() {
											var self = this;
											if(index==0){
												vueObj.firstPageNumber++;
												if(vueObj.firstPageNumber>vueObj.firstTotalPage){
													$('.mui-pull-bottom-tips').hide();$('.mui-pull-bottom-tips').eq(0).show();
													setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
												}else{
													self.endPullUpToRefresh(false);
													vueObj.client_time=parseInt(new Date().getTime()/1000);   //时间戳转换为以秒为单位 
													vueObj.$http({method:'POST',url:URL+'/shopping/Limitbuy/limit_goods_list',data:{client_time:vueObj.client_time,type:'listload',point:vueObj.firstPoint,page:vueObj.firstPageNumber}}).then(
														function(response){
															if(response.data.success==true){
	//															console.log(response.data);
																for(var i=0;i<response.data.data.length;i++){
																	vueObj.firstRushbuy.push(response.data.data[i]);
																};
																vueObj.$nextTick(function(){
																	for(var k=0;k<response.data.data.length;k++){
																		$('#rushItem0 .mui-media').eq('-'+(k+1)).find('i').css('width',response.data.data[k].percent+'%');   //li从倒数开始
																	};
																});
																
															}
														}
													);	
												}
											}else{
	//											console.log(vueObj.otherPoint[index-1]);
												vueObj.otherPageNumberArr[index-1].otherPageNumber++;
												if(vueObj.otherPageNumberArr[index-1].otherPageNumber>vueObj.otherTotalPage[index-1]){
													$('.mui-pull-bottom-tips').hide();$('.mui-pull-bottom-tips').eq(index).show();
													setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
												}else{
													self.endPullUpToRefresh(false);
													vueObj.client_time=parseInt(new Date().getTime()/1000);   //时间戳转换为以秒为单位 
													vueObj.$http({method:'POST',url:URL+'/shopping/Limitbuy/limit_goods_list',data:{client_time:vueObj.client_time,type:'listload',point:vueObj.otherPoint[index-1],page:vueObj.otherPageNumberArr[index-1].otherPageNumber}}).then(
														function(response){
															if(response.data.success==true){
	//															console.log(response.data);
																for(var i=0;i<response.data.data.length;i++){
																	vueObj.otherRushbuy[index-1].goods.push(response.data.data[i]);
																};
																vueObj.$nextTick(function(){
																	for(var k=0;k<response.data.data.length;k++){
																		$('#rushItem'+index+' .mui-media').eq('-'+(k+1)).find('i').css('width',response.data.data[k].percent+'%');   //li从倒数开始
																	};
																});															
																
															}
														}
													);												
												}
											}
										}
									}
								});							
							});
						})
					}				
				}
	
			);			
		},
//		手动刷新
		rushRefresh:function(){
			$('header .mui-icon-reload').toggleClass('rloadRun');
			this.loadContent();
		},
//		立即抢购时判断是否已经抢完 
		goRushDetail:function(evt,id){
			var myObj=evt.currentTarget;
			//请求后台数据，然后刷新
			this.$http({method:'POST',url:URL+'/shopping/Limitbuy/is_enough',data:{id:id}}).then(
				function(response){
					if(response.data.success==true){    //0：有库存  1：没有库存
//						console.log(response.data.data.status);
						if(response.data.data.status==0){
							rushbuyGoto(myObj);
						}else{
							mui.toast('很抱歉，该产品已经被抢完了！');
						}
					}
				}
			)
		}
	},
	ready:function(){
		var _this=this;
		this.loadContent();
		//整点刷新
		var nowHour=new Date().getHours(); 
		var nowSeconds=new Date().getHours()*3600+ new Date().getMinutes()*60+ new Date().getSeconds();
		var futrueHour,t,djs;
		if(nowHour%2==1){          //单数
			futrueHour=nowHour+1;
		}else if(nowHour%2==0){   //双数
			futrueHour=nowHour+2;
		};
		//倒计时
		t=futrueHour*3600-nowSeconds;
		djs=setInterval(function(){
			if(t<0){
				_this.loadContent();
			}else{
				t--;
			}
		},1000);
		//支付完成返回刷新抢购列表
		window.addEventListener('rushbuy-refresh',function(){
			this.loadContent();
		}.bind(this));
	}
})

