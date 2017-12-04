

//评价完成，刷新订单列表
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
//			var page = plus.webview.getWebviewById('../html/mnhcontentnav.html');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'order-fresh');
			return true;
		}
	});
});


Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'-'+parseInt(day.getMonth()+1)+'-'+day.getDate()+'  '+day.getHours()+':'+day.getMinutes(); 
});

Vue.filter('payTyepFormate',function(string){
	if(string==0){
		return '微信支付';
	}else if(string==1){
		return '余额支付';
	}else if(string==2){
		return '支付宝支付';
	}else{
		return '未支付'
	}
});
Vue.http.options.emulateJSON = true;
var orderDetailVm=new Vue({
	el:'#orderDetailBody',
	data:{
		orderId:'',
		detailContent:''
	},
	methods:{
		//取消订单(全部栏取消/代付款取消，取消完成之后在全部栏增加交易失败一行)
		cancelOrder:function(evt){
//			evt.target.parentNode.parentNode.parentNode.remove();
			var _this=this;
	       var btnArray = ['取消', '确定'];
	        mui.confirm('您确定要取消订单吗？', '确认框', btnArray, function(e) {
	            if (e.index == 1){
	            	mui.plusReady(function(){plus.nativeUI.showWaiting()});
	            	$(evt.target).attr('disabled',true);
					_this.$http({method:'POST',url:URL+'/person/user/cancel_order',data:{uid:localStorage.uid,order_id:_this.orderId}}).then(
						function(response){
							if(response.data.success==true){
								mui.plusReady(function(){plus.nativeUI.closeWaiting()});
								mui.toast('订单取消成功！');
							}
						},function(response){mui.toast('取消失败,请检查网络！');$(evt.target).attr('disabled',false);mui.plusReady(function(){plus.nativeUI.closeWaiting()});}
					);	
	            } else {} 
	       });				
		},
		//立即付款(跳到订单支付页支付完成后回到该页面，全部和代发货状态变是jump回来的所以会主动刷新页面)
		nowPay:function(){
			store.set('orderId',this.orderId);              
			store.set('orderType',1);                   //(团购不付款不产生订单)只要是一次付款一种商品 type=1
			jump('../mnhcar/mnhcarOrder.html');
			setTimeout(function(){mui.plusReady(function(){plus.webview.currentWebview().close();});},2000);                             
		},
		//提醒卖家收货
		callDeli:function(){
			mui.toast('已经提醒卖家发货！');
		},
		//查看物流
		checkLog:function(){
			store.set('orderId',this.orderId);
			jump('logstatus.html');			
		},
		//确认收货(确认成功后，全部和待收货状态变)；
		confirmRecieve:function(evt){
        	mui.plusReady(function(){plus.nativeUI.showWaiting()});
        	$(evt.target).attr('disabled',true);
			this.$http({method:'POST',url:URL+'/person/user/confirm',data:{uid:localStorage.uid,order_id:this.orderId}}).then(
				function(response){
					if(response.data.success==true){
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});
						mui.toast('确认收货成功！');
					}
				},function(response){mui.toast('确认收货失败,请检查网络！');$(evt.target).attr('disabled',false);mui.plusReady(function(){plus.nativeUI.closeWaiting()});}
			);			
		},
		//立即评价(评价成功后，刷新当前页面)
		nowEvalute:function(){
			store.set('orderId',this.orderId);
			jump('evaluate.html');
		},			
	},
	ready:function(){
		loads();
		this.orderId=store.get('orderId'); 
		this.$http({method:'POST',url:URL+'/person/user/get_order_detail',data:{uid:localStorage.uid,order_id:this.orderId}}).then(
			function(response){
				if(response.data.success==true){
					console.log(response.data);
					this.detailContent=response.data.data;
					setTimeout(function(){loadh();},1000);
				}
			}
		);
		//评价完成后刷新订单详情页
		window.addEventListener('order-fresh',function(){
			this.$http({method:'POST',url:URL+'/person/user/get_order_detail',data:{uid:localStorage.uid,order_id:this.orderId}}).then(
				function(response){
					if(response.data.success==true){
						console.log(response.data);
						this.detailContent=response.data.data;
					}
				}
			);			
		}.bind(this));
	}
})
