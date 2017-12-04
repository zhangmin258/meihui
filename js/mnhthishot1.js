


Vue.http.options.emulateJSON = true;
var hotVm=new Vue({
	el:'#hotBody',
	data:{
		firstTtile:'',      //第一个标题
		otherhotTitle:[],   //其他标题以一个数组的形式存在
		
		firstHotList:[],   //第一个标题内容	
		firstHotId:'',    //第一个标题id
		firstTotalPage:'',
		firstPageNumber:1,
		firstpullList:[],   //第一个标题内容	上拉加载数组
		
		otherHotId:[],      //其他标题id
		otherHotList:[],   //其他标题内容
		otherTotalPage:[],  //存放其他标题内容totalPage 
		otherPageNumberArr:[]
	},
	methods:{
		
	},
	ready:function(){	
		loads();
		var vueObj=this;
		//今日热门标题
		this.$http({method:'GET',url:URL+'/shopping/Category/cate_parent_list'}).then(
			function(response){
				if(response.data.success==true){
					otherhotTitle=[];                            //把其他标题放到一个数组里面
					this.firstTtile=response.data.data[0];        //第一个标题
					for(var i=1;i<response.data.data.length;i++){
						this.otherhotTitle.push(response.data.data[i]);
					};
				}
			}
		);
		this.$http({method:'GET',url:URL+'/shopping/Goods/today'}).then(
			function(response){
//				console.log(response.data.data);
				if(response.data.success==true){
					this.$http({method:'GET',url:URL+'/shopping/Goods/today'}).then(
						function(response){
							if(response.data.success==true){
								//第一个标题内容(必须单独取出第一个，不然无法滑动pullrefresh.js出错)
								this.firstHotList=response.data.data[0].goods;
								this.firstHotId=response.data.data[0].id;
								this.firstTotalPage=response.data.data[0].page.totalPage;
								for(var i=0;i<this.firstHotList.length; i++){
									var item=this.firstHotList[i];
									var html='';
									html = '<li class="mnhshoptit">'+                                         //href="mnh_shopping/mnhshoppingcontent.html"
										'<a class="mnhContent" dataname = '+item.name+' dataId = '+ item.id +' data-title-type="transparent_native" href="mnhshoppingcontent.html">'+
										'<div class="mnhshoptitimg"><img src="' + item.img + '"/>' +
										'<div class="mnhshoptitliang"><p class="mnhshoptitliangl">销量：'+item.sell_num+'</p>' +
										'<p class="mnhshoptitliangr">点击率：'+item.click+'</p></div>' +
										'<div class="mnhshoptitnameimg" style="display: none;"><img src="'+item.avatar+'"/>' +
										'<span>'+item.admin_name+'</span></div></div><div class="mnhshoptitcontent">' +
										'<div class="mnhshoptitcontentname mui-ellipsis">'+item.name+'</div>' +
										'<div class="mnhshoptitcontentmoney">零售价：<span>￥'+item.price+'</span></div>' +
										'<div class="mnhshoptitcontentyuan">会员价：'+item.member_price+'</div></div></a></li>';
									if($("#hotItem0 .col-two").height()<$("#hotItem0 .col-one").height()){
										$("#hotItem0 .col-two").append(html);
									}else{
										$("#hotItem0 .col-one").append(html);
									};						
								};
								//其他标题内容
								for(var j=1;j<response.data.data.length;j++){
									this.otherHotList.push(response.data.data[j]);
									this.otherHotId.push(response.data.data[j].id);                  //每个标题id形成一个数组
									this.otherTotalPage.push(response.data.data[j].page.totalPage);  //otherTotalPage变成一个数组
								};
								//vue dom 渲染完之后再执行刷新加载
								this.$nextTick(function(){
									var otherPageObj={otherPageNumber:1};
									var deceleration = mui.os.ios?0.003:0.0009;
									mui('.mui-scroll-wrapper').scroll({
										bounce: false,
										indicators: false, //是否显示滚动条
										deceleration:deceleration
									});										
									mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, element) {
										var index=index;                                //当前刷新框的序号
										vueObj.otherPageNumberArr.push(otherPageObj);   //otherPageNumber:1变成一个数组 
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
													if(index==0){
														vueObj.firstPageNumber++;
														if(vueObj.firstPageNumber>vueObj.firstTotalPage){
															$('.mui-pull-bottom-tips').hide();$('.mui-pull-bottom-tips').eq(0).show();
															setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
														}else{
															self.endPullUpToRefresh(false);
															vueObj.$http({method:'POST',url:URL+'/shopping/Goods/today',data:{page:vueObj.firstPageNumber,cate_id:vueObj.firstHotId}}).then(
																function(response){
																	if(response.data.success==true){
//																		console.log(response.data);
																		vueObj.firstpullList=response.data.data;
																		for(var i=0;i<vueObj.firstpullList.length;i++){
																			var item5=vueObj.firstpullList[i];
																			var html = '<li class="mnhshoptit">'+                                         //href="mnh_shopping/mnhshoppingcontent.html"
																				'<a class="mnhContent" dataname = '+item5.name+' dataId = '+ item5.id +' data-title-type="transparent_native" href="mnhshoppingcontent.html">'+
																				'<div class="mnhshoptitimg"><img src="' + item5.img + '"/>' +
																				'<div class="mnhshoptitliang"><p class="mnhshoptitliangl">销量：'+item5.sell_num+'</p>' +
																				'<p class="mnhshoptitliangr">点击率：'+item5.click+'</p></div>' +
																				'<div class="mnhshoptitnameimg" style="display: none;"><img src="'+item5.avatar+'"/>' +
																				'<span>'+item5.admin_name+'</span></div></div><div class="mnhshoptitcontent">' +
																				'<div class="mnhshoptitcontentname mui-ellipsis">'+item5.name+'</div>' +
																				'<div class="mnhshoptitcontentmoney">零售价：<span>￥'+item5.price+'</span></div>' +
																				'<div class="mnhshoptitcontentyuan">会员价：'+item5.member_price+'</div></div></a></li>';
																			if($('#hotItem0 .col-two').height()<$('#hotItem0 .col-one').height()){
																				$('#hotItem0 .col-two').append(html);
																			}else{
																				$('#hotItem0 .col-one').append(html);
																			};
																		};
																		vueObj.firstpullList=[];																		
																	}
																}
															);	
														};
													}else{        
	//													index>=1; otherTotalPage[index-1];   otherPageNumberArr[index].otherPageNumber; otherHotId[index-1]
														vueObj.otherPageNumberArr[index].otherPageNumber++;	
														if(vueObj.otherPageNumberArr[index].otherPageNumber>vueObj.otherTotalPage[index-1]){
															$('.mui-pull-bottom-tips').hide();$('.mui-pull-bottom-tips').eq(index).show();
															setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);
														}else{
//															vueObj.otherHotList.push()
															self.endPullUpToRefresh(false);
															vueObj.$http({method:'POST',url:URL+'/shopping/Goods/today',data:{page:vueObj.otherPageNumberArr[index].otherPageNumber,cate_id:vueObj.otherHotId[index-1]}}).then(
																function(response){
																	if(response.data.success==true){
//																		console.log(response.data);
																		for(var k=0; k<response.data.data.length;k++){
																			vueObj.otherHotList[index-1].goods.push(response.data.data[k]);	
																		}
																	}
																}
															);	
														}
														
													}
												}								
											}
										})
									});	
									loadh();									
								})
							}
						}	
					)
				}
			}
		);
		
	}
})