

//返回地址管理页面，刷新地址列表
mui.plusReady(function(){
	mui.init({
		beforeback: function(){
			//获得列表界面的webview
//			var page = plus.webview.getWebviewById('../html/mnhcontentnav.html');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'addressList-refresh');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
});


var cityPicker4 = new mui.PopPicker({layer: 3});
cityPicker4.setData(cityData3);
var ma_province1,ma_city1,ma_area1;

mui('.add-form-content').on('tap','#addArea',function(){
	$('input').blur();
	cityPicker4.show(function(items) {
		$('#addArea').val(items[0].text+','+items[1].text+','+items[2].text);
		ma_province1=items[0].text;ma_city1=items[1].text;ma_area1=items[2].text;
		cityPicker4.picker = null;
	})
});


//地址类型切换
mui('.mui-checkbox').on('tap','#address-default',function(){
		//alert($(this).prop('checked'));   //获取的是点击之前的checked属性             
	if($(this).prop('checked')==false){
		$(this).val(1);
	}else{
		$(this).val(0);
	}
});


//添加地址提交
var check=true;
mui('.add-form-content').on('tap','#add-address-btn',function(){
	$('input').blur();
	mui('.add-form-content input').each(function(){
		if(this.value.trim()=='' || !this.value){
			var label = $(this.previousElementSibling).html().replace(/\:/g,'');
			mui.toast(label+'不得为空！');
			check=false;
			return false;
		}
	});
	if(check==true){
		mui('#add-address-btn').button('loading');
		var name=$('#cargo-receiver').val();
		var phone=$('#phone-number').val();
		var address=$('#cargo-address').val();
		var is_default=$('#address-default').val();
		$.ajax({
			type:"POST",
			url:URL+'/person/Address/add_address',
			async:false,
			dataType:'json',
			data:{
				uid:localStorage.uid,
				name:name,
				phone:phone,
				province:ma_province1,
				city:ma_city1,
				area:ma_area1,
				address:address,
				is_default:is_default
			},
			success:function(data){
				if(data.success==true){
					mui.toast('地址添加成功!');
					mui.back();
					setTimeout(function(){mui('#add-address-btn').button('reset');},2000);
				}else{
					mui.toast('地址添加失败！');
					mui('#add-address-btn').button('reset');
				}
			},
			error:function(){
				mui.toast('数据提交失败,请检查网络！');
				mui('#add-address-btn').button('reset');
			}
		});
	};
	
})





