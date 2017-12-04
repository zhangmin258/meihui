
loads();

//报名完成后返回活动详情页，禁止报名
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
//			var page = plus.webview.getWebviewById('');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'yjbaoming');
			return true;
		}
	});
});


var  actid= store.get('mnhcontentnav'); 




//获取活动票价/时间
function getTicketDetail(){
	$.ajax({
		type:"POST",
		url:URL+"/party/Activity/activity_enroll",
		async:false,
		dataType:'json',
		data:{activity_id:actid,uid:localStorage.uid},
		success:function(data){
			if(data.success==true){                       
				if(data.data.price==0){$('.pay_form').hide()};                 //免费活动不需要付费框
				$('.ticketPrice').html(data.data.price);
				$('.ticketTime').html(timeFormate(data.data.time_start));
				if(data.data.otherinfo.length>0&&data.data.otherinfo[0]!=''){
					for(var i=0;i<data.data.otherinfo.length;i++){
						var div='<div class="mui-input-row addInput">'+
									'<label>'+data.data.otherinfo[i]+'</label>'+						
									'<input type="text" placeholder="预订人的'+data.data.otherinfo[i]+'">'+
								'</div>';
						$('.buy-contentForm').append(div);
					};			
				};				
				if(data.data.code==1){       //不可以报名      
					$('.mnhfooterbutton').addClass('adddis').attr('disabled',true).html('已报名');
				}
			};			
			setTimeout(function(){loadh()},1000);	
		}
	});	
}


getTicketDetail();

//生成电子票之后不能再次报名
window.addEventListener('yjbaoming',function(){
	getTicketDetail();
});


function timeFormate(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'.'+parseInt(day.getMonth()+1)+'.'+day.getDate();  	
}



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




//确认报名
mui('footer').on('tap','.mnhfooterbutton',function(){
	$('input').blur();
	var obj=this;
	var ticketOwner=$('#ticket-owner').val();
	var ticketPhone=$('#ticket-phone').val();
	var payType=$("input[name='payType']:checked").val();  //1支付宝支付  2微信支付
	var id='alipay';
	if(payType==1){id='alipay'}else{id='wxpay'};
	var qianming='';	
	if($('.addInput').html()){         //有自定义input信息
		var li=$('.addInput'); 
		var flag=false;
		var buyArr=[],buyObj={};
		li.each(function(index,element){
			buyObj={};
			var inputVal=$(element).find('input').val();
			var inputLabel=$(element).find('label').text();
			if($.trim(inputVal)==''){flag=false;return;}else{buyObj[inputLabel]=inputVal; buyArr.push(buyObj); buyObj={};flag=true};
		});
		var buyArr1=JSON.stringify(buyArr);	
		if(/^[0-9]{11}$/.test(ticketPhone)==true&&$.trim(ticketOwner)!=''&&flag==true){
			subTicketContent(obj,ticketOwner,ticketPhone,buyArr1,actid,payType,id);
		}else{
			mui.toast('购买信息错误或不完整！');
		}
	}else{                       //没有自定义input信息
		if(/^[0-9]{11}$/.test(ticketPhone)==true&&$.trim(ticketOwner)!=''){
			subTicketContent(obj,ticketOwner,ticketPhone,'',actid,payType,id);
		}else{
			mui.toast('购买信息错误或不完整！');
		}
	}
		
	
});



function subTicketContent(obj,ticketOwner,ticketPhone,buyArr1,actid,payType,id){
	mui(obj).button('loading'); //alert(payType);
	$.ajax({
		type:"POST",
		url:URL+"/party/Activity/submit_enroll",
		async:true,
		dataType:"json",
		data:{
			maj_name:ticketOwner,
			maj_phone:ticketPhone,
			maj_otherinfo:buyArr1,
			maj_uid:localStorage.uid,
			maj_aid:actid,
			maj_trade:payType
		},
		success:function(data){
			if(data.success==true){
				buyArr=[];
//				console.log(data.data.data);
				if(data.data.data==''){           //免费活动
					animateWindow('slide-in-bottom','mnhticket.html');	
					setTimeout(function(){mui('.mnhfooterbutton').button('reset');},2000);
				}else{                            //付费活动
					//根据payType返回相应签名
					qianming=data.data.data;
					pay(id,qianming);					
				}
			}else{
				mui('.mnhfooterbutton').button('reset');
			}
		},
		error:function(data){
			mui('.mnhfooterbutton').button('reset');
			mui.toast('报名失败，请检查网络！');
		}
	});	
}


//利用签名唤起app进行支付
function pay(id,qianming){
	plus.payment.request(pays[id], qianming, function(result) {
		mui.toast('支付成功！');
		//执行下一步业务逻辑代码  (按钮等待消失，页面跳转生成电子票 )		
		mui('.mnhfooterbutton').button('reset');
		animateWindow('slide-in-bottom','mnhticket.html');		
	},function(error){
		mui.toast(error.msg);
		mui('.mnhfooterbutton').button('reset');
	})
	
}








