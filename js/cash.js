

//提现成功后刷新钱包页面
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'wallet-refresh');
			return true;
		}
	});
});




//点击提现按钮
mui('.cashContent').on('tap','#subCash',function(){
	var csMoney=$('#cashMoney').val();
	var csMoney1=$('#cashMoney').val().substring(0,1); //第一位不能为0  
	var pattern=/^[0-9]+$/;
	var aliAccount=$('#aliAccount').val();
	if(pattern.test(csMoney)==true&&csMoney>=1&&csMoney1!=0&&$.trim(aliAccount)!=''){
		mui('#subCash').button('loading');
		$.ajax({
			type:"POST",
			url:URL+"/person/user/application_for_cash_withdrawal", 
			async:true,
			dataType:'json',
			data:{uid:localStorage.uid,price:csMoney,type:0,account:aliAccount,name:'',bank_name:'',branch:'',phone:''}, 
			success:function(data){
				if(data.success==true){
					mui.toast('提现成功！');
					mui.back();
					setTimeout(function(){mui('#subCash').button('reset');},2000);
				}else{  
					//提现金额不能大于余额
					mui.toast(data.msg);
					mui('#subCash').button('reset');
				}
			},
			error:function(error){
				mui.toast('提现失败,请检查网络！');
				mui('#subCash').button('reset');
			}
		});		
	}else if($.trim(aliAccount)==''){
		mui.toast('请输入支付宝账号！');
	}else{
		mui.toast('提现金额输入有误！');
	}
});