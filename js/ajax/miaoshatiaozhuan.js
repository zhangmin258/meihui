//跳转
mui('body').on('tap', '.mnhContent1', function() {	
	var dataId = this.getAttribute("dataId");                  
	var limitId= this.getAttribute("limitId");  
	store.set('dataId',dataId);                           //商品id
	store.set('limitId',limitId);                         //限时抢购id
	var mnhtitleText = this.getAttribute("dataname");		
	var id = this.getAttribute("data-wid");
	if(!id) {
		id = this.getAttribute('href');
	}
	var href = this.getAttribute('href');
	//非plus环境，直接走href跳转
	if(!mui.os.plus) {
		location.href = href;
		return;
	}

	var titleType = this.getAttribute("data-title-type");

	var webview_style = {
		popGesture: "close"
	}
	var extras = {};

	if(titleType == "native") {
		//如下场景不适用下拉回弹：
		//1、单webview下拉刷新；2、底部有fixed定位的div的页面
		if(!~id.indexOf('pullrefresh.html') && !~href.indexOf("examples/tabbar.html") && !~href.indexOf("list-to-detail/listview.html")) {
			webview_style.bounce = "vertical";
		}
		//图标页面需要启动硬件加速
		if(~id.indexOf('icons.html') || ~id.indexOf("echarts.html")) {
			webview_style.hardwareAccelerated = true;
		}
		if(~id.indexOf('im-chat.html')) {
			extras.acceleration = "none";
		}

		webview_style.statusbar = {
			background: "#f7f7f7"
		}

	} else if(href && ~href.indexOf('.html')) {
		//侧滑菜单需动态控制一下zindex值；
		if(~id.indexOf('offcanvas-')) {
			webview_style.zindex = 9998;
			webview_style.popGesture = ~id.indexOf('offcanvas-with-right') ? "close" : "none";
		}

		var extras = {};
		if(id && id == "viewgroup") { //强制启用截屏
			extras.acceleration = "capture";
		}

		if(titleType && titleType == "transparent_native") {
			webview_style.titleNView = {
				'backgroundColor': '#f7f7f7',
				'titleText': mnhtitleText,
				'titleColor': '#000000',
				type: 'transparent',
				autoBackButton: true,
				splitLine: {
					color: '#cccccc'
				}
			}
		} else {
			webview_style.statusbar = {
				background: "#f7f7f7"
			}
		}
		var webview = plus.webview.create(href, id, webview_style, extras);
		webview.show('slide-in-right', 300);				
	}
});