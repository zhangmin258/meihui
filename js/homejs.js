(function() {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	mui.plusReady(function() {
		var self = plus.webview.currentWebview(),
			leftPos = Math.ceil((window.innerWidth - 60) / 2), // 设置凸起大图标为水平居中
			leftdd = Math.ceil((window.innerWidth) / 1.428); //小红点位置

		/**	
		 * drawNativeIcon 绘制带边框的半圆，
		 * 实现原理：
		 *   id为bg的tag 创建带边框的圆
		 *   id为bg2的tag 创建白色矩形遮住圆下半部分，只显示凸起带边框部分
		 * 	 id为iconBg的红色背景图
		 *   id为icon的字体图标
		 *   注意创建先后顺序，创建越晚的层级越高
		 */
		var drawNativeIcon = util.drawNative('icon', {
			bottom: '5px',
			left: leftPos + 'px',
			width: '60px',
			height: '60px'
		}, [{
			tag: 'rect',
			id: 'bg',
			position: {
				top: '1px',
				left: '0px',
				width: '100%',
				height: '100%'
			},
			rectStyles: {
				color: '#fff',
				radius: '50%',
				borderColor: '#EEEEEE',
				borderWidth: '1px'
			}
		}, {
			tag: 'rect',
			id: 'bg2',
			position: {
				bottom: '-0.5px',
				left: '0px',
				width: '100%',
				height: '45px'
			},
			rectStyles: {
				color: '#fff'
			}
		}, {
			tag: 'rect',
			id: 'iconBg',
			position: {
				top: '5px',
				left: '5px',
				width: '50px',
				height: '50px'
			},
			rectStyles: {
				color: '#ff6699',
				radius: '50%'
			}
		}, {
			tag: 'font',
			id: 'icon',
			text: '\ue92e', //此为字体图标Unicode码'\e600'转换为'\ue600'
			position: {
				top: '0px',
				left: '5px',
				width: '50px',
				height: '100%'
			},
			textStyles: {
				fontSrc: '_www/fonts/icomoon.ttf',
				align: 'center',
				color: '#fff',
				size: '30px'
			}
		}]);
		// append 到父webview中
		self.append(drawNativeIcon);
		//					小红点
		var dd = util.drawNative('icon', {
			//位置
			bottom: '34px',
			left: leftdd + 'px',
			width: '12px',
			height: '12px'
		}, [{
			//背景颜色
			tag: 'rect',
			id: 'iconBg',
			position: {
				top: '0',
				left: '0',
				width: 'none',
				height: 'none'
			},
			rectStyles: {
				color: '#d74b28',
				radius: '50%'
			}
		}, {
			//文字内容
			tag: 'font',
			id: 'icon',
			text: '1', //此为字体图标Unicode码'\e600'转换为'\ue600'
			position: {
				top: '0px',
				left: '-1.5px',
				width: '16px',
				height: '100%'
			},
			textStyles: {
				fontSrc: 'none',
				align: 'center',
				color: '#fff',
				size: '10px'
			}
		}]);
		// append 到父webview中
		self.append(dd);
		//自定义监听图标点击事件
		drawNativeIcon.addEventListener('click', function(e) {
			//						mui.alert('你点击了图标，你在此可以打开摄像头或者新窗口等自定义点击事件。', '悬浮球点击事件');
			clicked('html/mnhcode.html', true, true);
		});
		// 中间凸起图标绘制及监听点击完毕
		// 创建子webview窗口 并初始化
		var aniShow = {};
		util.initSubpage(aniShow);

		var nview = plus.nativeObj.View.getViewById('tabBar'),
			activePage = plus.webview.currentWebview(),
			targetPage,
			subpages = util.options.subpages,
			pageW = window.innerWidth,
			currIndex = 0;

		/**
		 * 根据判断view控件点击位置判断切换的tab
		 */
		nview.addEventListener('click', function(e) {
			var clientX = e.clientX;
			if(clientX > 0 && clientX <= parseInt(pageW * 0.25)) {
				currIndex = 0;
			} else if(clientX > parseInt(pageW * 0.25) && clientX <= parseInt(pageW * 0.45)) {
				currIndex = 1;
			} else if(clientX > parseInt(pageW * 0.45) && clientX <= parseInt(pageW * 0.8)) {
				currIndex = 2;
			} else {
				currIndex = 3;
			}
			// 匹配对应tab窗口	
			if(currIndex == 1) {
				//						第二个页面
				targetPage = plus.webview.getWebviewById(subpages[0]);
			} else if(currIndex == 3) {
				//						最后一个页面
				targetPage = plus.webview.getWebviewById(subpages[1]);
			} else {
				//						第一个页面
				targetPage = plus.webview.currentWebview();
			}
			//防止重复点击或点击聊天
			if(targetPage == activePage && currIndex !== 2) {
				return;
			}
			//			点击事件
			if(currIndex !== 2) {
				if(currIndex == 3) {
					//						alert('美人');
					if(localStorage.uid == '' || localStorage.uid == undefined || localStorage.uid == null) {
						var btnArray = ['取消', '确认'];
						mui.confirm('您还没有登录！', '温馨提示', btnArray, function(e) {
							if(e.index == 1) {
								jump('html/land/login.html');
								return;
							} else {}
						});
					} else {

						//底部选项卡切换
						util.toggleNview(currIndex);
						// 子页面切换
						util.changeSubpage(targetPage, activePage, aniShow);
						//更新当前活跃的页面
						activePage = targetPage;
					}
				} else {
					//底部选项卡切换
					util.toggleNview(currIndex);
					// 子页面切换
					util.changeSubpage(targetPage, activePage, aniShow);
					//更新当前活跃的页面
					activePage = targetPage;
				};
			} else {
				if(localStorage.uid == '' || localStorage.uid == undefined || localStorage.uid == null) {
					var btnArray = ['取消', '确认'];
					mui.confirm('登陆后才能聊天哦！', '温馨提示', btnArray, function(e) {
						if(e.index == 1) {
							jump('html/land/login.html');
						} else {}
					});
				} else {
					//				点击小红点消失
					//							点击消失
					var dd = util.drawNative('icon', {
						//位置
						bottom: '34px',
						left: leftdd - 1 + 'px',
						width: '14px',
						height: '14px'
					}, [{
						//背景颜色
						tag: 'rect',
						id: 'iconBg',
						position: {
							top: '0',
							left: '0',
							width: '100%',
							height: '100%'
						},
						rectStyles: {
							color: '#fff',
							radius: '50%'
						}
					}, {
						//文字内容
						tag: 'font',
						id: 'icon',
						text: '', //此为字体图标Unicode码'\e600'转换为'\ue600'
						position: {
							top: '0px',
							left: '-1.5px',
							width: '16px',
							height: '100%'
						},
						textStyles: {
							fontSrc: 'none',
							align: 'center',
							color: '#fff',
							size: '10px'
						}
					}]);
					// append 到父webview中
					self.append(dd);
					//第三个tab 打开新窗口
					plus.webview.open('html/chart-room2.html', 'new', {}, 'slide-in-right', 200);
				}
			}
		});
	});
})();