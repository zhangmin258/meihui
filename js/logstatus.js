


//物流状态
Vue.filter('typeFormate',function(string){
	if(string==0){
		return '无轨迹';
	}else if(string==2){
		return '在途中';
	}else if(string==3){
		return '已签收';
	}else if(string==4){
		return '问题件'
	}
});

Vue.http.options.emulateJSON = true;
var logisVm=new Vue({
	el:"#logisBody",
	data:{
		orderId:'',
		orderImg:'',
		
		orderKuai:'',
		wuliuList:'',
//		addressList:[]               //物流列表以倒叙的形式展现
	},
	methods:{
		
	},
	ready:function(){
		this.orderId=store.get('orderId');
		this.$http({method:'POST',url:URL+'/person/user/kuaidi',data:{uid:localStorage.uid,order_id:this.orderId}}).then(
			function(response){					
				if(response.data.success==true){
//					console.log(response.data);
					this.orderImg=response.data.data.img;
					this.orderKuai=response.data.data.kuai;
					this.wuliuList=response.data.data.kuai.Traces;
				}
			}
		);
	}
})
