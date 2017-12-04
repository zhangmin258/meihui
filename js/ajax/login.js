
		//切换事件
		mui('.landnavcontent_text').on('tap', 'span', function() {
			//			获取名称
			var classfindname = document.getElementsByClassName('landnavcontent_text')[0].getElementsByTagName('span');
			//			获取名称的个数长度
			var lengthes = classfindname.length;
			//			清除所有样式
			for(var i = 0; i < lengthes; i++) {
				classfindname[i].setAttribute('class', '');
			};
			//			赋予样式
			this.setAttribute('class', 'landnavcontent_textcolor');
			//			获取自定义类名
			var dataid = this.getAttribute("dataid");
			//			修改状态
			if(dataid == '1') {
				document.getElementsByClassName("landone")[0].style.display = 'block';
				document.getElementsByClassName("landtwo")[0].style.display = 'none';
			} else {
				document.getElementsByClassName("landtwo")[0].style.display = 'block';
				document.getElementsByClassName("landone")[0].style.display = 'none';
			}
		});
		
		
		//	获取验证码
		mui('.landnavcontent_input_pass').on('tap', '.landpass_button', function() {
			//			获取手机号
			var telname = this.parentNode.parentNode.getElementsByTagName('input')[0].value;
			//			判断手机号是否正确
			if(!(/^1[34578]\d{9}$/.test(telname))) {
				return mui.toast("手机号码有误，请重填");
			};

			//验证码ajax
			$.ajax({
				type: "POST",
				url: URL + "/person/Login/get_code",
				async: true,
				dataType: "json", //接收json格式的数据
				data: {
					phone: telname
				},
				success: function(data) {
					if(data.success == true) {
						mui.toast('验证码将会以短信的形式发送给您!');
					}
				}
			});
			settime(this);
		});
		//获取验证码倒计时
		var countdown = 60;

		function settime(obj) {
			//开始判断倒计时是否为0
			if(countdown == 0) {
				obj.removeAttribute("disabled");
				obj.innerHTML = "获取验证码";
				countdown = 60;
				//立即跳出settime函数，不再执行函数后边的步骤
				return;
			} else {
				obj.setAttribute("disabled", true);
				obj.innerHTML = "重新发送(" + countdown + ")";
				countdown--;
			}
			//过1秒后执行倒计时函数
			setTimeout(function() {
				settime(obj)
			}, 1000)
		};
		//		获取手机号验证码/注册是否同意协议
		mui('.landnavcontent_input').on('tap', '.landbutton', function() {
			
			//			手机号
			var inputtel = this.parentNode.getElementsByClassName('tel')[0].value;
			//			验证码
			var inputpass = this.parentNode.getElementsByClassName('landpass')[0].value;
			//			验证手机号
			$('.tel').blur();
			$('.landpass').blur();
			if(!(/^1[34578]\d{9}$/.test(inputtel))) {
				return mui.toast("手机号码有误，请重填");
			};
			//			验证验证码
			if(inputpass.length != 6) {
				return mui.toast("验证码有误，请重填");
			};
			//			判断登陆页面还是注册页面
			var lendstate = this.parentNode.getAttribute('class');
			
			if(lendstate == "landnavcontent_input landtwo") {   
				//是否同意协议(三目运算)
				var _value = document.getElementById('checked').checked ? "true" : "false";
				if(_value == 'false') {
					return mui.toast("请阅读并同意协议");
				}else{
					//注册
					sub('/person/Login/app_register',inputtel,inputpass,'');
				};
			}else{ 
				//登录(提供clientid给后台)
				mui.plusReady(function(){
					var cid = plus.push.getClientInfo().clientid;
					sub('/person/Login/app_login',inputtel,inputpass,cid);
				});
			}

		});
		
		function sub(subUrl,inputtel,inputpass,cid){
			mui('.landbutton').button('loading');
			$.ajax({
				type: "POST",
				url: URL+subUrl,
				async: false,
				dataType: 'json',
				data: {
					phone: inputtel,
					code: inputpass,
					cid: cid
				},
				success: function(data) {
					if(data.success == true) {
						mui.toast(data.msg);
						if(data.msg=='登录成功!'){							
							localStorage.uid = data.data.uid;        //存储用户电话号码
							localStorage.type = data.data.type;       //存储用户等级   0为非会员/1为会员
							localStorage.avator=data.data.app_logo;     //用户头像 
							localStorage.nickname=data.data.name;
							mui.plusReady(function(){                           
								var page=plus.webview.currentWebview().opener();  //代替mui.back(),返回上一页面，刷新上一页面
								mui.fire(page,'status');
								plus.webview.currentWebview().close();								
							});							
						};
						setTimeout(function(){mui('.landbutton').button('reset')},1000);
						
					} else {
						mui.toast(data.msg);
						mui('.landbutton').button('reset');
					}
				},
				error: function(error) {
					mui.toast('数据提交失败,请检查网络!');
					mui('.landbutton').button('reset');
				}
			});			
		}



	//退出app(控制安卓手机返回键功能！)
	mui.back=function () {
	    var btnArray = ['是', '否'];
	    mui.confirm('是否退出应用', '确认框', btnArray, function(e) {
	        if (e.index == 0) {
	        	mui.plusReady(function(){ plus.runtime.quit()}); 
	        }
	    })
	}








