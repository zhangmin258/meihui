


mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005,
	indicators:false
});

//推荐区域
var cityPicker3 = new mui.PopPicker({layer: 3});
cityPicker3.setData(cityData3);

var vipProvince,vipCity,vipArea;
var minorSelect='';
var mainIntroMen='',minorIntroMen=''        //主推荐人id/分会推荐人id

mui('.mui-table-view-cell').on('tap','.tuijian-area-input',function(){
	$('input').blur();
	cityPicker3.show(function(items) {
		$('#tuijian-area').val(items[0].text+','+items[1].text+','+items[2].text);
		vipProvince=items[0].text;vipCity=items[1].text;vipArea=items[2].text;
		$.ajax({
			type:"POST",
			url:URL+"/person/Userparty/select_chairman",
			async:true,
			dataType:'json',
			data:{
				uid:localStorage.uid,
				province:vipProvince,
				city:vipCity,
				area:vipArea
			},
			success:function(data){
				if(data.success==true){
					$('#mainIntro').val(data.data.main_chairman_name);
					mainIntroMen=data.data.main_chairman_id;                 //主推荐人名字/id     
					minorSelect=data.data.chairmanlist;                     //分会推荐人列表
				}else{
					mui.toast('该推荐区域没有主推荐人！');
				}
			}
		});
	});	
})

//分会推荐人
var minorPicker = new mui.PopPicker();
mui('.mui-table-view-cell').on('tap','.minor-area-input',function(){
	if($.trim($('#mainIntro').val())==''){
		mui.toast('请选择推荐区域！');
	}else{
		minorPicker.setData(minorSelect);
		minorPicker.show(function(items) {
			$('#minorIntro').val(items[0].text);
			minorIntroMen=items[0].value;
		});
	}
});






//获取个人信息(从内存中获取)
$('.headerimg img').attr('src',localStorage.avator);
$('.nickname').html(localStorage.nickname);
if(localStorage.type==0){$('.mendj').html('未认证');}else if(localStorage.type==1){$('.mendj').html('已认证');}









//会员费用
$.ajax({
	type:"POST",
	url:URL+"/person/Userparty/authentication",
	async:true,
	dataType:'json',
	data:{
		uid:localStorage.uid
	},
	success:function(data){
		if(data.success==true){
			$('.vipPrice').html(data.data.membership_fees);
			$('.vipTime').html(data.data.year);
		}
	}
});

//点击提交按钮
mui('.vip-box-btn').on('tap','#vip-btn',function(){
	$('input').blur();
	var check=true;
	var vipName=$('#vipName').val();                 //姓名 
	var vipIdcard=$('#vipIdcard').val();             //身份证
	var vipPhone=$('#vipPhone').val();               //手机号
	var payType=$("input[name='vipPay']:checked").val();  //1支付宝支付  2微信支付       
	var vipPrice=$('.vipPrice').html();             //会员价格
	var vipTime=$('.vipTime').html();               //会员时间
	var id='alipay';
	if(payType==1){id='alipay'}else{id='wxpay'};	
	//	识别身份证
	var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)|(^[A-Z][0-9]{9})|(^[A-Z][0-9]{6}\([0-9A-Z]\))|([157][0-9]{6}\([0-9]\))$/;
	if(reg.test(vipIdcard) === false) {
		mui.alert("身份证输入不合法");
		return false;
	};
	//	识别男女
	if(parseInt(vipIdcard.substr(16, 1)) % 2 == 1) {
		mui.alert("您好，信息填写不符合要求，本平台仅限女士加入，谢谢");
		return false;
	};
	var qianming='';
//	alert('主推荐人:'+mainIntroMen+'分会推荐人：'+minorIntroMen); 
	mui("#vipForm input").each(function(index,element) {
		if(!this.value || this.value.trim() == "") {
		    var label = this.previousElementSibling;
		    mui.toast(label.innerText.replace(/:/,'') + "不允许为空");
		    check = false;
		    return false;
		}
	});
	
	if(check==true){
		mui('#vip-btn').button('loading');
	    $.ajax({
	    	type:"POST",
	    	url:URL+"/person/Userparty/authentication_submit",
	    	async:false,
	    	dataType:'json',
	    	data:{
	    		uid:localStorage.uid,
	    		name:vipName,
	    		id_card:vipIdcard,
	    		phone:vipPhone,
	    		province:vipProvince,
	    		city:vipCity,
	    		area:vipArea,
	    		main_chairman:mainIntroMen,
	    		chairman:minorIntroMen,
	    		pay_type:payType,
	    		account:vipPrice,
	    		vip_time:vipTime
	    	},
	    	success:function(data){
	    		if(data.success==true){
	    			mui('#vip-btn').button('reset');
	    			qianming=data.data.data;
	    			pay(id,qianming);
	    		}else{
	    			mui.toast('审核信息有误,无法通过审核！');
	    			mui('#vip-btn').button('reset');
	    		}
	    	},
	    	error:function(error){
	    		mui.toast('申请失败,请检查网络！');
	    		mui('#vip-btn').button('reset');
	    	}
	    });
	}	
	
	
	
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



//利用签名唤起app进行支付
function pay(id,qianming){
	plus.payment.request(pays[id], qianming, function(result) {
		mui.toast('申请成功,等待审核！');	
		mui('#vip-btn').button('reset');
		mui.back();	
	},function(error){
		mui.toast(error.msg);
		mui('#vip-btn').button('reset');
	})
	
};



