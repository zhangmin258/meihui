


//支付成功后返回我要开团页面刷新开团列表
//支付成功后返回参团详情-参团头像变化-返回参团列表参团人数变化-返回我要开团页面-刷险参团列表人数
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'groupsRefresh');
			return true;
		}
	});
});

Vue.http.options.emulateJSON = true;
var orderVm=new Vue({
	el:'#orderBody',
	data:{
		orderId:'',   //订单id
		orderType:'',   //订单类型
		orderContent:'',
		orderList:'',  //点单列表
		orderAddress:'',   //收货地址
		
		payValue:'', 
		pays:{},
		
		id:'',
		qianming:''
	},
	methods:{
		//获取订单详情
		getOrderDetail:function(orderUrl){
			this.$http({method:'POST',url:URL+orderUrl,data:{order_id:this.orderId,uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
						console.log(response.data);
						this.orderContent=response.data.data;
						this.orderAddress=response.data.data.address;
						this.orderList=response.data.data.order;
						setTimeout(function(){loadh();},1000);
					}
				}
			);			
		},
		//利用签名唤起app进行支付
		pay:function(id,qianming){
//			alert(id);
			plus.payment.request(this.pays[id], qianming, function(result) {
				mui.toast('支付成功！');
				//执行下一步业务逻辑代码  (按钮等待消失，页面跳转生成电子票 )		
				mui('.mnhpay').button('reset');
				jump('../myown/order.html');   //跳转订单页
			},function(error){
				mui.toast(error.msg);
				mui('.mnhpay').button('reset');
			});
			
		},
		//用于nowPay函数
		getQianming:function(qmUrl){
			if(this.orderAddress=='' || this.orderAddress==null || this.orderAddress==undefined){
		       	var btnArray = ['取消', '确认'];
		        mui.confirm('请先填写收货地址！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('../myown/address-list.html');	
						setTimeout(function(){mui('.mnhpay').button('reset');},1000);
		            } else {
		            	mui('.mnhpay').button('reset');
		            }
		        });				
			}else{
				this.$http({method:'POST',url:URL+qmUrl,data:{order_id:this.orderId,type:this.payValue}}).then(
					function(response){
						if(response.data.success==true){
							//获取签名
	//						console.log(response.data.data);
							this.qianming=response.data.data;
							this.pay(this.id,this.qianming);
						}
					}
				);				
			}
			
		},
		//点击立即支付按钮   0:alipay  1:wxpay
		nowPay:function(){
			mui('.mnhpay').button('loading');
			if(this.payValue==0){this.id='alipay'}else{this.id='wxpay'};
			if(this.orderType==1){                     //普通商品
				this.getQianming('/person/Pay/pay');
			}else if(this.orderType==2){               //购物车
				this.getQianming('/person/Pay/pay_num');
			}else if(this.orderType==3){              //团购
				this.getQianming('/person/Pay/pay_group');
			}
		},
		//跳转地址列表页
		goAddressList:function(id){
			store.set('addressId',id);
			jump('../myown/address-list.html');
		}
	},
	ready:function(){
		var _this=this;
		this.orderId=store.get('orderId'); this.orderType=store.get('orderType');
//		console.log('orderId为:'+this.orderId);  console.log('orderType为：'+this.orderType);
		loads();	
		//获取支付通道
		mui.plusReady(function(){
			plus.payment.getChannels(function(channels){
				for(var i=0;i<channels.length;i++){
					var channel=channels[i];
					if(channel.id=='alipay' || channel.id=='wxpay'){  //channel={id:'alipay',description:'支付宝'}/{id:'wxpay',description:'微信'}  
						_this.pays[channel.id]=channel;				
					}
				}
			},function(e){
				mui.alert('获取支付未成功');
			});	
		});		                                     
		//获取订单详情
		if(this.orderType==2){           //购物车商品 订单详情
			this.getOrderDetail('/person/Car/get_order');
		}else{                          //普通商品/团购商品订单详情  
			this.getOrderDetail('/person/Order/order_detail');
		};
		//点单页返回支付页时  (禁止支付按钮)
		window.addEventListener('order-refresh',function(){
			mui.back();
//			$('.mnhpay').attr('disabled',true).addClass('mnhpaydisabled');
		});
		
		//选择地址
		window.addEventListener('orderAddress-refresh',function(){
			//获取订单详情
			if(this.orderType==2){           //购物车商品 订单详情
				this.getOrderDetail('/person/Car/get_order');
			}else{                          //普通商品/团购商品订单详情  
				this.getOrderDetail('/person/Order/order_detail');
			};			
		}.bind(this));
		
		
		
	}
})



