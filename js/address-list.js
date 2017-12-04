

//返回地址管理页面，刷新地址列表
mui.plusReady(function(){
	mui.init({
		beforeback: function(){
			//获得列表界面的webview
//			var page = plus.webview.getWebviewById('../html/mnhcontentnav.html');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'orderAddress-refresh');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
});


//滚动框初始化
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005,
	indicators:false
});


//is_default：1 默认 / 0 普通
Vue.filter('default',function(string){
	if(string==1){
		return '默认';
	}
});

Vue.http.options.emulateJSON = true;
var addressListVm=new Vue({
	el:'#addListBOdy',
	data:{
		addressList:'',
		addId:'',        //当前radio的值
		orderId:'',
		orderType:'',
		
		addressId:''     //点单页传过来的地址id
	},
	methods:{
		adressType:function(addressUrl){
			this.$http({method:'POST',url:URL+addressUrl,data:{uid:localStorage.uid,order_id:this.orderId,a_id:this.addId}}).then(
				function(response){
					if(response.data.success==true){
						mui.back();
					}else{
						mui.toast('当前地址已经是订单地址');
					}
				}
			);			
		},
		//选择地址
		choicAdd:function(){
			if(this.orderType==2){   //购物车商品 订单
				this.adressType('/person/Address/update_car_address');
			}else{
				this.adressType('/person/Address/update_order_address');
			}
		},
		//添加地址
		addAdd:function(){
			jump('add-address.html');
		},
		//获取地址列表数据
		getAddressList:function(){
			this.$http({method:'GET',url:URL+'/person/Address/get_address',data:{uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
						console.log(response.data);
						this.addressList=response.data.data;
					}
				}
			);			
		}
	},
	ready:function(){
		//获取地址列表数据
		this.getAddressList();
		this.orderId=store.get('orderId'); this.orderType=store.get('orderType');  //2购物车商品 订单   1/3 普通或团购商品订单
		this.addressId=store.get('addressId'); //alert(this.addressId);
//		console.log('orderId为:'+this.orderId);  console.log('orderType为：'+this.orderType);

		//地址编辑/增加成功后刷新地址列表
		window.addEventListener('addressList-refresh',function(){
			this.getAddressList();
		}.bind(this));		
		//地址添加成功后重新刷新地址列表
		
	}
})




