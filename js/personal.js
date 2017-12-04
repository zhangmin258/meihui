



//区域框滚动初始化
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005,
	indicators:false
});



//页面跳转
mui('body').on('tap','a',function(evt){
	evt.preventDefault();
	var address=$(this).attr('href');
	jump(address);
})

//获取个人信息(从内存中获取)
function getMemberDetail(){
	$('.xu_headerimg img').attr('src',localStorage.avator);
	$('.nickname').html(localStorage.nickname);
	if(localStorage.type==0){
		$('.mendj').html('普通用户');
	}else if(localStorage.type==1){
		$('.mendj').html('会员用户');
	}
	
}

//会员用户禁止跳转到会员认证页面
if(localStorage.type==0){
	$('.xuprivilegebuttom').show();
}else{
	$('.xuprivilegebuttom').hide();
};


//个人信息修改完成后-重新刷新个人信息
window.addEventListener('myDetail-refresh',function(){
	getMemberDetail();
});


//以creat形式创建的页面，多次打开页面时都可以执行该方法
mui.plusReady(function(){
	plus.webview.currentWebview().addEventListener('show',function(){
		getMemberDetail();
	});
})






//会员权限动画效果(打开会员认证页面的按钮)
mui('body').on('tap','.Xuhprivilege',function(){
	$('.xubackprivilege').css('display','block');
	$('.xubackprivilegeco').animate({'top':'0'},500);
	
});


//关闭会员认证弹出层的按钮
mui('body').on('tap','.mui-icon-close,.xuprivilegebuttom',function(){
	$('.xubackprivilegeco').animate({'top':'-100%'},500);
	setTimeout("$('.xubackprivilege').css('display','none')",500);
});












