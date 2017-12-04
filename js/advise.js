
//localStorage.uid=97;



mui('.advise-content').on('tap','#advise-btn',function(){
	var suggesContent=$('#suggesContent').val();
	if($.trim(suggesContent)==''){
		mui.toast('请输入建议内容！')
	}else{
		mui('#advise-btn').button('loading');
		$.ajax({
			type:"POST",
			url:URL+"/person/user/add_suggestion",
			async:false,
			dataType:'json',
			data:{
				uid:localStorage.uid,
				content:suggesContent
			},
			success:function(data){
				if(data.success==true){
					mui.alert('您的建议是我们努力的源泉,在你的陪伴下美女会将越来越好！');
					mui('#advise-btn').button('reset');
				}
			},
			error:function(error){
				mui.toast('提交失败,请检查网络！');
				mui('#advise-btn').button('reset');
			}
		});
	}
});
