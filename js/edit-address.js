
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


loads();
var addressId=store.get('addressId');
//alert(addressId);


var ma_province='',ma_city='',ma_area='';
var addressSwitch;          //地址类型切换    1:默认地址  0：普通地址
//获取地址详情
$.ajax({
	type:"POST",
	url:URL+'/person/Address/get_address_detail',
	async:true,
	dataType:'json',
	data:{a_id:addressId,uid:localStorage.uid},
	success:function(data){
		if(data.success==true){
//			console.log(data);
			$('#name').val(data.data.name);
			$('#phone').val(data.data.phone);
			$('#area').val(data.data.province+data.data.city+data.data.area);
			ma_province=data.data.province,ma_city=data.data.city,ma_area=data.data.area;
			$('#address').val(data.data.address);
			addressSwitch=data.data.is_default
			if(addressSwitch==0){                              //普通地址
				$('.mui-switch').removeClass('mui-active');
				$('.switchWarn').html('普通地址');
			}else{
				$('.mui-switch').addClass('mui-active');       //默认地址
				$('.switchWarn').html('默认地址');
			};
			setTimeout(function(){loadh();},1000); 
		}
	}
});

//地址类型切换(如果是默认地址，则不能更改当前地址为普通地址，只能设置其他地址为默认地址，进行覆盖)(如果修改的是默认地址第一次点击肯定是关闭)
document.getElementById('addressSwitch').addEventListener('toggle',function(event){
  if(event.detail.isActive){       //点击打开时
   	addressSwitch=1;
	$('.switchWarn').html('默认地址');
  }else{                           //点击关闭时
    addressSwitch=0;
	$('.switchWarn').html('普通地址');		
  };	
});




var cityPicker3 = new mui.PopPicker({layer: 3});
cityPicker3.setData(cityData3);


mui('.edit-form-content').on('tap','#area',function(){
	$('input').blur();
	cityPicker3.show(function(items) {
		$('#area').val(items[0].text+','+items[1].text+','+items[2].text);
		ma_province=items[0].text;ma_city=items[1].text;ma_area=items[2].text;
		cityPicker3.picker = null;
	})
});



//提交修改地址
var check=true;
mui('.edit-form-content').on('tap','#edit-address-btn',function(){
	$('input').blur();
	mui('.edit-form-content input').each(function(){
		if(this.value.trim()=='' || !this.value){
			var label = $(this.previousElementSibling).html().replace(/\:/g,'');
			mui.toast(label+'不得为空！');
			check=false;
			return false;
		}
	});
	if(check==true){
		mui('#edit-address-btn').button('loading');
		var name=$('#name').val();
		var phone=$('#phone').val();
		var address=$('#address').val();
		var is_default=addressSwitch;
		$.ajax({
			type:"POST",
			url:URL+'/person/Address/update_address',
			async:false,
			dataType:'json',
			data:{
				uid:localStorage.uid,
				name:name,
				phone:phone,
				province:ma_province,
				city:ma_city,
				area:ma_area,
				address:address,
				a_id:addressId,
				is_default:is_default
			},
			success:function(data){
				if(data.success==true){
					mui.toast('地址修改成功！');
					mui.back();
					setTimeout(function(){mui('#edit-address-btn').button('reset');},2000);
				}else{
					mui.toast('你没有做任何修改！');
					mui('#edit-address-btn').button('reset');
				}
			},
			error:function(){
				mui.toast('数据提交失败,请检查网络！');
				mui('#edit-address-btn').button('reset');
			}
		});
	};
	
})
