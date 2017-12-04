
//初始原始头像
$("#my-avator").attr('src',localStorage.avator);
$('#nickname').val(localStorage.nickname);
if (localStorage.xusex == '0') {
	$('input[name=sex]').eq(1).attr('checked',true);
	$('input[name=sex]').eq(0).attr('checked',false);
} else{
	$('input[name=sex]').eq(0).attr('checked',true);
	$('input[name=sex]').eq(1).attr('checked',false);
}
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'myDetail-refresh');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
});


$("#clipArea").photoClip({
	width: window.innerWidth,                     //虚线裁剪框宽度，高度                     
	height: window.innerWidth,
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

//打开裁剪框
mui('.mui-table-view-cell').on('tap', '.addAvator', function() {
	$(".htmleaf-container").show();
})

//裁剪并上传
$("#clipBtn").click(function() {
	if(imgsource != "") {
		$("#my-avator").attr('src', imgsource);
		$(".htmleaf-container").hide();
		$(window).scrollTop('0');
	} else {
		return;
	}
});

//关闭裁剪框
$("#imgover").click(function() {
	$(".htmleaf-container").hide();
});


//提交按钮
var  pattern=/^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,6}$/;
mui('.mui-content').on('tap','#subSetting',function(){
	var nickname=$('#nickname').val();
	var sex=$('input[name=sex]:checked').val();
	var avator=$("#my-avator").attr('src');
//	用户没有修改东西返回
	if (avator == localStorage.avator && nickname == localStorage.nickname && sex == localStorage.xusex){
		return mui.back();
	}
//	昵称头像判断
	if(avator=='../../images/head.png' || avator == localStorage.avator){
		avator = '';
	};
	if(pattern.test(nickname)==false){
		mui.toast('昵称格式不正确！');
	}else{
		mui('#subSetting').button('loading');
		$.ajax({
			type:"POST",
			url:URL+"/person/user/upload_logo_name",
			async:false,
			dataType:'json',
			data:{
				uid:localStorage.uid,
				app_logo:avator,
				name:nickname,
				sex:sex
			},
			success:function(data){
				if(data.success==true){
//					console.log(data);
					localStorage.avator=data.data.app_logo;               //用户头像 
					localStorage.nickname=data.data.name;                //用户昵称
					localStorage.xusex = data.data.sex;	
					setTimeout(function(){mui('#subSetting').button('reset');},2000);
					mui.back();
				}else{
					mui('#subSetting').button('reset');
				}
			},
			error:function(error){
				mui.toast('上传失败，请检查网络！');
				mui('#subSetting').button('reset');
			}
		});
	}
});















