

mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			//获得列表界面的webview
//			var page = plus.webview.getWebviewById('');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'getTaolunList');
			return true;
		}
	});
});


var repid= store.get('mnhReport');

mui('.mui-content').on('tap','.repsubTaolun',function(){
	$('#reptaolun-content').blur();
	var taolunContent=$('#reptaolun-content').val();
	if($.trim(taolunContent)==''){
		mui.toast('请输入内容！')
	}else{
		mui(this).button('loading');
		$.ajax({
			type:"POST",
			url:URL+"/party/Report/report_comment_publish",
			async:false,
			dataType:'json',
			data:{ma_uid:localStorage.uid,ma_rid:repid,mrc_content:taolunContent},
			success:function(data){
				if(data.success==true){
					mui('.repsubTaolun').button('reset');
					mui.toast('讨论提交成功');
					mui.back();
				}
			},
			error:function(error){
				mui.toast('讨论提交失败，请检查网路！');
				mui('.repsubTaolun').button('reset');
			}
		});		
	}

})



//限制字数为150字以内
$(window).keyup(function(){
	subTaolun();
})


function subTaolun(){
	var taolunVal=$('#reptaolun-content').val();
	if(taolunVal.length>=150){$('#reptaolun-content').val(taolunVal.substring(0,150))}
}

