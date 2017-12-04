

//支付完成后从参团列表到-开团页
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'order-refresh');
			return true;
		}
	});
});



//阻尼系数
var deceleration = mui.os.ios?0.003:0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: false, //是否显示滚动条
	deceleration:deceleration
});



//跳转订单详情页
//mui('.order-content').on('tap','a',function(evt){
//	evt.preventDefault();
//	jump('order-detail.html');
//});


//跳转评价页面
//mui('.op-btn').on('tap','button',function(){
//	var address=$(this).attr('address');
//	jump(address);
//});


Vue.http.options.emulateJSON = true;
var orderVm=new Vue({
	el:'#orderListBody',
	data:{
		allList:'',          //全部
		waitPayList:'',     //代付款
		waitDelList:'',      //代发货
		waitCollList:'',      //待收货
		waitCommList:'',       //待评价
		
		totalPage:'',           //只有全部这一栏才有上拉加载
		pageNumber:1,
	},
	methods:{
		//取消订单(全部栏取消/代付款取消，取消完成之后在全部栏增加交易失败一行)
		cancelOrder:function(evt,orderId){
//			evt.target.parentNode.parentNode.parentNode.remove();
			var _this=this;
	       var btnArray = ['取消', '确定'];
	        mui.confirm('您确定要取消订单吗？', '确认框', btnArray, function(e) {
	            if (e.index == 1){
	            	mui.plusReady(function(){plus.nativeUI.showWaiting()});
	            	$(evt.target).attr('disabled',true);
					_this.$http({method:'POST',url:URL+'/person/user/cancel_order',data:{uid:localStorage.uid,order_id:orderId}}).then(
						function(response){
							if(response.data.success==true){
//								$('.'+orderId).remove();
								mui.plusReady(function(){plus.nativeUI.closeWaiting()});
								mui.toast('订单取消成功！');
								_this.getOrderContent();               //重新刷新页面
							}
						},function(response){mui.toast('取消失败,请检查网络！');$(evt.target).attr('disabled',false);mui.plusReady(function(){plus.nativeUI.closeWaiting()});}
					);	
	            } else {} 
	       });				
		},
		//立即付款(跳到订单支付页支付完成后回到该页面，全部和代发货状态变是jump回来的所以会主动刷新页面)
		nowPay:function(evt,orderId){
			store.set('orderId',orderId);              
			store.set('orderType',1);                   //(团购不付款不产生订单)只要是一次付款一种商品 type=1
			jump('../mnhcar/mnhcarOrder.html');
		},
		//提醒卖家收货
		callDeli:function(){
			mui.toast('已经提醒卖家发货！');
		},
		//查看物流
		checkLog:function(orderId){
			store.set('orderId',orderId);
			jump('logstatus.html');			
		},
		//确认收货(确认成功后，全部和待收货状态变)；
		confirmRecieve:function(evt,orderId){
        	mui.plusReady(function(){plus.nativeUI.showWaiting()});
        	$(evt.target).attr('disabled',true);
			this.$http({method:'POST',url:URL+'/person/user/confirm',data:{uid:localStorage.uid,order_id:orderId}}).then(
				function(response){
					if(response.data.success==true){
//						$('.'+orderId).remove();
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});
						mui.toast('确认收货成功！');
						this.getOrderContent();               //重新刷新页面
					}
				},function(response){mui.toast('确认收货失败,请检查网络！');$(evt.target).attr('disabled',false);mui.plusReady(function(){plus.nativeUI.closeWaiting()});}
			);			
		},
		//立即评价(评价成功后，刷新当前页面)
		nowEvalute:function(orderId){
			store.set('orderId',orderId);
			jump('evaluate.html');
		},
		//删除订单(不刷新页面)
		delOrder:function(evt,orderId,index){
			mui.plusReady(function(){plus.nativeUI.showWaiting()});
			$(evt.target).attr('disabled',true);
			this.$http({method:'POST',url:URL+'/person/user/delete_order',data:{uid:localStorage.uid,order_id:orderId}}).then(
				function(response){
					if(response.data.success==true){
//						this.allList[index]='';
						this.allList.content.splice(index,1);
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});						
						$(evt.target).attr('disabled',false);	
					}
				},function(response){mui.toast('删除失败,请检查网络！');$(evt.target).attr('disabled',false);mui.plusReady(function(){plus.nativeUI.closeWaiting()});}
			)	
		},
		//跳转订单详情页
		goOrderDetail:function(orderId){
			store.set('orderId',orderId);
			jump('order-detail.html');			
		},		
		//获取订单数据
		getOrderContent:function(){
			loads();
			this.$http({method:'POST',url:URL+'/person/user/get_orders',data:{uid:localStorage.uid}}).then(
				function(response){	
					if(response.data.success==true){
//						console.log(response.data);
						this.allList=response.data.data[0];          //全部
						this.totalPage=response.data.data[0].page.totalPage;
						this.waitPayList=response.data.data[1];      //代付款
						this.waitDelList=response.data.data[2];      //代发货
						this.waitCollList=response.data.data[3];     //待收货
						this.waitCommList=response.data.data[4];      //待评价
						setTimeout(function(){loadh();},1000);
					}
				}
			);			
		}
	},
	ready:function(){
		
		var vueObj=this;
		
		//获取订单数据
		this.getOrderContent();

		this.$nextTick(function(){
			//循环初始化所有下拉刷新，上拉加载。
			mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				var index=index;
				mui(pullRefreshEl).pullToRefresh({
					down:{
						callback:function(){
							var self = this;
							setTimeout(function() {
								self.endPullDownToRefresh(true);
							}, 1000);							
						}
					},
					up: {		
						callback: function() {
							var self = this;
							if(index==0){
//								console.log(vueObj.totalPage);
//								console.log(vueObj.pageNumber);
								vueObj.pageNumber++;
								if(vueObj.pageNumber>vueObj.totalPage){
									setTimeout(function() {self.endPullUpToRefresh(true);}, 1000);	
								}else{
									self.endPullUpToRefresh(false);
									vueObj.$http({method:'POST',url:URL+'/person/user/get_orders',data:{page:vueObj.pageNumber,uid:localStorage.uid}}).then(
										function(response){
											if(response.data.success==true){
//												console.log(response.data);
												for(var i=0;i<response.data.data.content.length;i++){													
													vueObj.allList.content.push(response.data.data.content[i]);
												};
												
											}
										}
									);	
								}
															
							}else{
								self.endPullUpToRefresh(true);
							}

						}
					}
				});
			});			
		});
		//评价成功后刷新订单列表
		window.addEventListener('order-fresh',function(){
			//获取订单数据
			this.getOrderContent();			
		}.bind(this));
	}
})








