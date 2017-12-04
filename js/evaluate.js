

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



$("#clipArea").photoClip({
	width: 200,                     //虚线裁剪框宽度，高度                     
	height: 200,
	file: "#file",
	view: "#view",                //图片裁剪虚线框 
	ok: "#clipBtn",              //截取上传按钮
	loadStart: function() {
//		console.log("照片读取中");
	},
	loadComplete: function() {
//		console.log("照片读取完成");
	},
	clipFinish: function(dataURL) {
//		console.log(dataURL);				
	}
});



//打开裁剪框(第一次没有img时长度为0)
mui('.write-textarea').on('tap','.evaBtn',function(){
	var imgLength=document.getElementById('imgBox').children.length;
	if(imgLength<=2){
		$(".htmleaf-container").show();
	}else{mui.toast('最多只能上传3张图片哦！');}
});

//裁剪并上传
$("#clipBtn").click(function() {
	if(imgsource != "") {
		var img='<p><img src="'+imgsource+'" /><span class="mui-icon mui-icon-closeempty" onclick="delImg(event)"></span></p>';
		$('.imgBox').append(img);
		$(".htmleaf-container").hide();
		$(window).scrollTop('0');
	} else {return;}
});

//关闭裁剪框
$("#imgover").click(function() {
	$(".htmleaf-container").hide();
});


//删除照片
function delImg(evt){
	evt.target.parentNode.remove();
}


var orderId= store.get('orderId');
//alert(orderId);


//获取订单详情
$.ajax({
	type:"POST",
	url:URL+"/person/user/get_order_detail",
	async:false,
	dataType:'json',
	data:{
		uid:localStorage.uid,
		order_id:orderId
	},
	success:function(data){
		if(data.success==true){
			$('.pro-img-height img').attr('src',data.data.img);
			$('.pro-text').html(data.data.name);
//			console.log(data);
		}
	},
	error:function(error){
		mui.toast('网络错误！');
	}
});


//提交订单
mui('.mui-content').on('tap','#proEvalute',function(){
	var imgLength=document.getElementById('imgBox').children.length;
	var content=$('#evaluate-content').val();   //评价内容
	if($.trim(content)==''){
		mui.toast('请输入评价内容！');
		return;
	};	
	if(imgLength==1){
		var ppic_one=$('#imgBox p').eq(0).find('img').attr('src');
		var ppic_two='';
		var ppic_three='';
	}else if(imgLength==2){
		var ppic_one=$('#imgBox p').eq(0).find('img').attr('src');
		var ppic_two=$('#imgBox p').eq(1).find('img').attr('src');
		var ppic_three='';
	}else if(imgLength==3){
		var ppic_one=$('#imgBox p').eq(0).find('img').attr('src');
		var ppic_two=$('#imgBox p').eq(1).find('img').attr('src');
		var ppic_three=$('#imgBox p').eq(2).find('img').attr('src');
	};
	mui('#proEvalute').button('loading');
	$.ajax({
		type:"POST",
		url:URL+"/person/user/add_comment",
		async:false,
		data:{
			uid:localStorage.uid,
			order_id:orderId,
			content:content,
			ppic_one:ppic_one,
			ppic_two:ppic_two,
			ppic_three:ppic_three
		},
		success:function(data){
			if(data.success==true){
				mui.toast('感谢您的评价！');
				setTimeout(function(){mui('#proEvalute').button('reset')},2000);
				mui.back();
			}
		},
		error:function(error){
			mui.toast('提交失败,请检查网络！');
			mui('#proEvalute').button('reset');			
		}
	});

	
});














