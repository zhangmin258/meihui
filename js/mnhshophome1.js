
//购物车按钮拖动(common.js)
//drag('mnhcarcontent');
		
//阻尼系数
var deceleration = mui.os.ios ? 0.001 : 0.0001;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: false, //是否显示滚动条
	deceleration:deceleration
});                           
		
//	div翻转
var count=0;
mui('.mui-bar').on('tap','.qiehuan',function(){
	if(count==0){     
		$('.test1').addClass('out').removeClass('in');     //test2出现
		setTimeout(function() {
			$('.test2').show().removeClass('out').addClass('in');
			$('.test1').hide();
		},225)
		count=1;
	}else if(count==1){
		$('.test2').addClass('out').removeClass('in');
		setTimeout(function() {
			$('.test1').show().addClass('in').removeClass('out');    //test1出现
			$('.test2').hide();
		},225)
		count=0
	}	
});
		

	
		
	
//导航跳转跳转
	mui('body').on('tap','.mnh_padding',function(){
		var mnhdon = this.getElementsByTagName('a')[0].href;
		jump(mnhdon);
	});
//秒杀跳转
	mui('body').on('tap','.mnhMiaoSaheadermore',function(){
		jump("mnh_shopping/mnhtimePanicbuying.html");
	});


//搜索页面跳转
mui('header').on('tap','.mnh_header_input_text',function(){
	var address=this.getAttribute('address');
	jump(address);
})

//跳转产品详情页
function gosc(id){
	alert(id);
}


Vue.http.options.emulateJSON = true;	
var shophomeVm=new Vue({
	el:'#shophome',
	computed:{},
	data:{
		last:'',
		bannerImg:'',
		bannerFirstImg:'',
		bannerLastImg:'',
		
		proList:'',           //随便逛逛
		proTotalPage:'',
		proPageNumber:1,
		
		specailname:'',
		specialList:'',       //专题 
		specialFirst:'',
		specialOther:[],
		
		adverData:'',         //广告
		client_time:'',        //限时抢购当前时间
		
		show:false,
		rushbuyTime:'',        //抢购时间		
		firstRushbuy:[],
		rushbuyList:'',
		lastRushbuy:[],
		layerShopList:''        //图片翻转列表数据
	},
	methods:{
		//下拉刷新
		proendPulldown:function(){
			mui('#shophomeScroll1').pullToRefresh().endPullDownToRefresh();
		},
		//上拉加载
		proEndPullup:function(){                                                                                                                                                                                                                                                                                                  
			this.proPageNumber++;
			if(this.proPageNumber>this.proTotalPage){
				setTimeout(function(){mui('#shophomeScroll1').pullToRefresh().endPullUpToRefresh(true);},1000);
			}else{
				mui('#shophomeScroll1').pullToRefresh().endPullUpToRefresh(false);
				this.$http({method:'POST',url:URL+'/shopping/Index/index_goods',data:{page:this.proPageNumber}}).then(
					function(response){
						if(response.data.success==true){
							this.proList=response.data.data;
							for(var i=0;i<this.proList.length;i++){
								var item=this.proList[i];
								html = '<li class="mnhshoptit">'+                                         //href="mnh_shopping/mnhshoppingcontent.html"
									'<a class="mnhContent" dataname = '+item.name+' dataId = '+ item.id +' data-title-type="transparent_native" href="mnh_shopping/mnhshoppingcontent.html">'+
									'<div class="mnhshoptitimg"><img src="' + item.img + '"/>' +
									'<div class="mnhshoptitliang"><p class="mnhshoptitliangl">销量：'+item.sell_num+'</p>' +
									'<p class="mnhshoptitliangr">点击率：'+item.click+'</p></div>' +
									'<div class="mnhshoptitnameimg" style="display: none;"><img src="'+item.avatar+'"/>' +
									'<span>'+item.admin_name+'</span></div></div><div class="mnhshoptitcontent">' +
									'<div class="mnhshoptitcontentname mui-ellipsis">'+item.name+'</div>' +
									'<div class="mnhshoptitcontentmoney">零售价：<span>￥'+item.price+'</span></div>' +
									'<div class="mnhshoptitcontentyuan">会员价：'+item.member_price+'</div></div></a></li>';
								if($("#container .col-two").height()<$("#container .col-one").height()){
									$("#container .col-two").append(html);
								}else{
									$("#container .col-one").append(html);
								};
							};
							this.proList=[];							
						}
					}
				)
			}			
		},
		//限时抢购
		rushBuy:function(){
			var djs,t,_this=this;
			//限时抢购 
			//（固定死显示6张图片,每三个商品为一组）;
			clearInterval(djs);
			this.client_time=parseInt(new Date().getTime()/1000);   //时间戳转换为以秒为单位 
			this.$http({method:'POST',url:URL+'/shopping/Index/index_time_limit',data:{client_time:this.client_time}}).then(
				function(response){
					if(response.data.success==true){
//						console.log(response.data);								
						if(response.data.data.list==''&&response.data.data.point==''){           //今天没有限时抢购
							this.show=false;
						}else if(response.data.data.list!=''){                               //当前时间在抢购时间节点内(正在抢购)
							this.show=true;
							this.rushbuyTime=response.data.data.point; 
							for(var i=0;i<3;i++){this.firstRushbuy.push(response.data.data.list[i])};    //第一组 
							for(var j=3;j<response.data.data.list.length;j++){this.lastRushbuy.push(response.data.data.list[i])};  //最后一组
							var hour = new Date().getHours()*3600,minu=new Date().getMinutes()*60,secnd=new Date().getSeconds();            //秒为单位
							var rushbuyEndTime=this.rushbuyTime+2,ruEndTimeSec=(this.rushbuyTime+2)*3600;
							var djsH,djsM,djsS;
							t=ruEndTimeSec-(hour+minu+secnd);   //秒为单位
							djs=setInterval(function(){
								if(t<0){                      //抢购结束,再次请求后台数据
									_this.rushBuy();
									clearInterval(djs);									 									
								}else{
									djsH=Math.floor(t/3600); $('#djsH').html('0'+djsH);
									djsM=Math.floor(t/60%60); if(djsM<10){$('#djsM').html('0'+djsM);}else{$('#djsM').html(djsM);};
									djsS=Math.floor(t%60); if(djsS<10){$('#djsS').html('0'+djsS);}else{$('#djsS').html(djsS);};
									t--;
								}
							},1000);							
						}else if(response.data.data.list==''&&response.data.data.point!=''){    //抢购开始时间>当前时间(抢购还没开始)
							this.show=false;
							this.rushbuyTime=response.data.data.point;
							var hour = new Date().getHours()*3600,minu=new Date().getMinutes()*60,secnd=new Date().getSeconds();            //秒为单位
							var ruBeginTimeSec=this.rushbuyTime*3600;
							t=ruEndTimeSec-(hour+minu+secnd);   //秒为单位							
							djs=setInterval(function(){
								if(t<0){                      //抢购开始，再次请求后台数据，list有值执行上面一种方法
									_this.rushBuy(); 
									clearInterval(djs);																		
								}else{
									djsH=Math.floor(t/3600); 
									djsM=Math.floor(t/60%60); 
									djsS=Math.floor(t%60);
									t--;
								}
							},1000);							
						}

					}
				}
			);			
		},
		//跳转购物车页面
		goCar:function(){
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){
		       	var btnArray = ['取消', '确认'];
		        mui.confirm('请先登录！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('land/login.html');		
		            } else {} 
		        });				
			}else{
				animateWindow('zoom-fade-out','mnhcar/mnhcar.html');
			}
		}
	},
	ready:function(){
		//美购轮播图(没数据时会报错)
		this.$http({method:'GET',url:URL+'/shopping/index/index_shuffling'}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.last=response.data.data.length-1;      //轮播图小图标
					this.bannerImg=response.data.data;
					this.bannerFirstImg=response.data.data[0];
					this.bannerLastImg=response.data.data[this.last];
				};
			}
		);
		//广告(只有一张图)
		this.$http({method:'GET',url:URL+'/shopping/Index/index_advertisement'}).then(
			function(response){
				if(response.data.success==true){
					this.adverData=response.data.data;
				}
			}
		);
		//限时抢购
		this.rushBuy();
		
		
		//专题数据
		this.$http({method:'GET',url:URL+'/shopping/Index/index_thematic'}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.specailname=response.data.data.name;
					//把拿过来的数组分成两部分
					this.specialList=response.data.data.list;
					if(response.data.data.list.length>0){
						this.specialFirst=this.specialList[0];
						for(var i=1;i<this.specialList.length;i++){
							this.specialOther.push(this.specialList[i]);
						};						
					}else{
						this.specialFirst=''
					}
//					console.log(this.specialOther);
				}
			}
		);
		
		//随便逛逛列表数据
		this.$http({method:'GET',url:URL+'/shopping/Index/index_goods'}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.proList=response.data.data;
					this.proTotalPage=response.data.page.totalPage;
					for(var i=0;i<this.proList.length;i++){
						var item=this.proList[i];
						var html = '<li class="mnhshoptit">'+                                         //href="mnh_shopping/mnhshoppingcontent.html"
							'<a class="mnhContent" dataname = '+item.name+' dataId = '+ item.id +' data-title-type="transparent_native" href="mnh_shopping/mnhshoppingcontent.html">'+
							'<div class="mnhshoptitimg"><img src="' + item.img + '"/>' +
							'<div class="mnhshoptitliang"><p class="mnhshoptitliangl">销量：'+item.sell_num+'</p>' +
							'<p class="mnhshoptitliangr">点击率：'+item.click+'</p></div>' +
							'<div class="mnhshoptitnameimg" style="display: none;"><img src="'+item.avatar+'"/>' +
							'<span>'+item.admin_name+'</span></div></div><div class="mnhshoptitcontent">' +
							'<div class="mnhshoptitcontentname mui-ellipsis">'+item.name+'</div>' +
							'<div class="mnhshoptitcontentmoney">零售价：<span>￥'+item.price+'</span></div>' +
							'<div class="mnhshoptitcontentyuan">会员价：'+item.member_price+'</div></div></a></li>';
						if($("#container .col-two").height()<$("#container .col-one").height()){
							$("#container .col-two").append(html);
						}else{
							$("#container .col-one").append(html);
						};
					};
					this.proList=[];
					mui('#shophomeScroll1').pullToRefresh({down: {callback:this.proendPulldown},up: {callback:this.proEndPullup}});
				}
			}
		);
		//翻转后的图片列表数据
//		this.$http({method:'GET',url:URL+'/shopping/Goods/goods_list'}).then(
//			function(response){
//				if(response.data.success==true){
////					console.log(response.data.data);
//					this.layerShopList=response.data.data;
//					//图片层叠滑动效果					
//					this.$nextTick(function(){
//						$('.roundabout_box ul').roundabout({
//							duration: 1000,
//							minScale: 0.6,
//							autoplay: false,
//							//autoplayDuration: 5000,
//							//autoplayInitialDelay: 5000,
//							minOpacity: 0,
//							maxOpacity: 1,
//							reflect: true,
//							startingChild: 3,
//							autoplayPauseOnHover: false,
//							enableDrag: true
//						});							
//					})
//					
//		
//				}
//			}
//		);
		
	}
})
