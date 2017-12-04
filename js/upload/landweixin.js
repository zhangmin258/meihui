
//var Vconsole=new VConsole();



var auths = '';

//获取登录服务(通道)
mui.plusReady(function() {
	plus.oauth.getServices(function(services) {
		auths = services; //services.id/description/userInfo/authResult/getUserInfo()/login()/logout()  (详见小知识点总结)
	}, function(e) {
		mui.toast("获取分享服务列表失败：" + e.message + " - " + e.code);
	});
})

//登录认证(点击微信登录按钮)
function login(type) { //'微信'，'qq'
	var s = '';
	for(var i = 0; i < auths.length; i++) {
		if(auths[i].id == type) {
			s = auths[i];
			break
		} //services[i].id
	};
	if(!s.authResult) { //之前没有第三方登录                    //services[i].authResult
		s.login(function(e) {                   //services[i].login()  
//			mui.toast('登录认证成功!');
			authUserInfo(type, s);
		}, function(e) {
			mui.toast('登录验证失败!')
		});
	}
};

//获取用户信息
function authUserInfo(type, s) {
	if(!s.authResult) {
		mui.toast('未授权登录!');
	} else {
		s.getUserInfo(function(e) {   //services[i].getUserInfo()
			mui.plusReady(function(){plus.nativeUI.showWaiting()});
			var userObj = s.userInfo; //servuces[i].userInfo
			//把微信个人信息给后台
			$.ajax({
				type:"POST",
				url:URL+"/person/Login/app_wechat_login",
				async:true,
				dataType:'json',
				data:{
					openid:userObj.openid,
					unionid:userObj.unionid,
					logo:userObj.headimgurl,
					nickname:userObj.nickname 
				},
				success:function(data){
					if(data.success==true){
//						console.log(data);
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});
						if(data.data.wx_type==0){                  //微信账号没有绑定过！
							//账号绑定
							mui.confirm('您的微信授权已成功，账号登录/注册后会自动进行账号绑定', '温馨提示', function(e) { 
								if(e.index == 1) {
									//去登陆注册
									//不注销微信登录后，不刷新页面后无法再次用微信登录！
								} else {
									//注销登陆
									authLogout(type, s);
								}
							});							
						}else{
							console.log(data);
							localStorage.uid = data.data.uid;        //存储用户电话号码
							localStorage.type = data.data.type;       //存储用户等级   0为非会员/1为会员
							localStorage.avator=data.data.app_logo;     //用户头像 
							localStorage.nickname=data.data.name;       //用户昵称
							mui.plusReady(function(){                           
								var page=plus.webview.currentWebview().opener();  //代替mui.back(),返回上一页面，刷新上一页面
								mui.fire(page,'status');
								plus.webview.currentWebview().close();								
							});												
						}

					}
				}
			});
		}, function(e) {
			mui.toast('获取用户信息失败!');
		})

	}
};

//注销认证
function authLogout(type, s) {
	if(s.authResult) {
		s.logout(function(e) {
			mui.toast('注销成功!')
		}, function(e) {
			mui.toast('注销失败！')
		})
	}
};


