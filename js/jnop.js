function jump(_href) {
	mui.plusReady(function() {		
		plus.nativeUI.closeWaiting(); //这里监听页面是否加载完毕，完成后关闭等待框
//		plus.nativeUI.showWaiting( "6666", {loading:{icon:'imges/home-ico5@2x.png',interval:"100ms"}});		
	});	
	var id = _href;
	var href = _href;
	//非plus环境，直接走href跳转
	if(!mui.os.plus) {
		location.href = href;
		return;
	}

	var webview_style = {
		popGesture: "close"
	}
	mui.openWindowWithTitle({
		url: href,
		id: id,
		styles: webview_style
	});
	
};
