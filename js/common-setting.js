

mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			//获得列表界面的webview
//			var page = plus.webview.getWebviewById('../html/mnhcontentnav.html');
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			//触发列表界面的自定义事件（addRefresh）,从而进行数据刷新
			mui.fire(page,'myDetail-refresh');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
});



mui('.comset-content').on('tap','a',function(){
	var address=$(this).attr('href');
	if(address){
		jump(address);
	}else{     //退出登陆
       var btnArray = ['取消', '确认'];
        mui.confirm('确认退出当前账号！', '温馨提示', btnArray, function(e) {
            if (e.index == 1){
				localStorage.uid='';
				localStorage.type=0;
				localStorage.avator='';
				localStorage.nickname='';
				jump('../land/login.html');					
            } else {}; 
        });		
	}
	
})



//禁止右滑关闭
mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({
        'popGesture': 'none'
    });
});





