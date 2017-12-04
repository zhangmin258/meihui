

//充值成功后，刷新我的钱包页面
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'wallet-refresh');
			return true;
		}
	});
});


//获取支付通道
var pays={};
mui.plusReady(function(){
	plus.payment.getChannels(function(channels){
		for(var i=0;i<channels.length;i++){
			var channel=channels[i];
			if(channel.id=='alipay' || channel.id=='wxpay'){  //channel={id:'alipay',description:'支付宝'}/{id:'wxpay',description:'微信'}  
				pays[channel.id]=channel;				
			}
		}
	},function(e){
		mui.alert('获取支付未成功');
	});	
})


  
//点击充值按钮
mui('.mui-content').on('tap','#subPay',function(){
	var reMoney=$('#rechargeMoney').val();
	var reMoney1=$('#rechargeMoney').val().substring(0,1); //第一位不能为0  
	var pattern=/^[0-9]+$/;
	var payType=$("input[name='pay']:checked").val();  //1支付宝支付  2微信支付         
	var id='alipay';
	if(payType==1){id='alipay'}else{id='wxpay'};
	var qianming='';
	if(pattern.test(reMoney)==true&&reMoney>=1&&reMoney1!=0){
		mui('#subPay').button('loading');
		$.ajax({
			type:"POST",
			url:URL+"/person/user/member_chongzhi", 
			async:true,
			dataType:'json',
			data:{uid:localStorage.uid,price:reMoney,type:payType},
			success:function(data){
				if(data.success==true){
					//根据payType返回相应签名
					qianming=data.data.data;
					pay(id,qianming);
				}
			},
			error:function(error){
				mui.toast('充值失败,请检查网络！');
				mui('#subPay').button('reset');
			}
		});		
	}else{
		mui.toast('充值金额输入有误!');
	}
});




//利用签名唤起app进行支付
function pay(id,qianming){
	plus.payment.request(pays[id], qianming, function(result) {
		mui.toast('支付成功！');	
		mui('#subPay').button('reset');
		mui.back();	
	},function(error){
		mui.toast(error.msg);
		mui('#subPay').button('reset');
	})
	
};


