

//		二维码扫描
function scaned(t, r, f) {
	var d = new Date();
	var h = d.getHours(),
		m = d.getMinutes(),
		s = d.getSeconds(),
		ms = d.getMilliseconds();
	if(h < 10) {
		h = '0' + h;
	}
	if(m < 10) {
		m = '0' + m;
	}
	if(s < 10) {
		s = '0' + s;
	}
	if(ms < 10) {
		ms = '00' + ms;
	} else if(ms < 100) {
		ms = '0' + ms;
	}
	//	时间
	var ts = '[' + h + ':' + m + ':' + s + '.' + ms + ']';
	//	判断是否是链接
	var RegUrl = new RegExp();
	RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
	if(RegUrl.test(r)) {
		localStorage.xblianjie = r;
		animateWindow('zoom-fade-out', 'html/mnhcode/mnhhhcodelk.html');
		return true;
	};
	//  不是链接
	var xbobj = JSON.parse(r);
	//	获取扫描结果
	$.ajax({
		url: URL + '/party/Activity/activity_check',
		dataType: "json",
		type: "post",
		data: {
			activity_id: xbobj.activity,
			uid: xbobj.uid,
			ownerid: localStorage.uid
		},
		success: function(data) {
			//				状态
			localStorage.xbstate = data.success;
			if(data.success == true) {
				//				名字
				localStorage.xbname = xbobj.name;
				//				电话
				localStorage.xbphone = xbobj.phone;
				//				时间
				localStorage.xbtime = xbobj.time;
			};
			animateWindow('zoom-fade-out', 'html/mnhcode/mnhhhcode.html');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//mui.toast('获取接口失败');
		}
	});
};

//阻尼系数
var deceleration = mui.os.ios ? 0.001 : 0.0001;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: false, //是否显示滚动条
	deceleration: deceleration
});


//发布点击事件
var mnhmud = 0;
mui('body').on('tap', '.mnh_anes', function() {
	if(localStorage.uid == '' || localStorage.uid == undefined || localStorage.uid == null) { //未登录（肯定没关注）
		var btnArray = ['取消', '确认'];
		mui.confirm('登陆后享受更多精彩', '温馨提示', btnArray, function(e) {
			if(e.index == 1) {
				jump('html/land/login.html');
			} else {}
		});
	} else {
		$('.mnh_nav_img').stop();
		$('.mnh_nav_img1').stop();
		$('.mnh_nav_img2').stop();
		$('.mnh_zhe').stop();
		if(mnhmud == 0) {
			xian();
		} else {
			yin();
		};
	}
});

//隐藏
mui('body').on('tap', '.mnh_zhe', function() {
	yin();
});

function yin() {
	$('.mnh_nav_img').animate({
		opacity: '0',
		bottom: '100px'
	}, 300);
	$('.mnh_nav_img1').animate({
		opacity: '0',
		bottom: '100px'
	}, 300);
	$('.mnh_nav_img2').animate({
		opacity: '0',
		bottom: '100px'
	}, 300);
	$('.mnh_zhe').animate({
		opacity: '0'
	}, 300);

	function mnhdou() {
		$('.mnh_an').css('-webkit-transform', 'rotate(0deg)');
		$('.mnh_an').css('transform', 'rotate(0deg)');
		$('.mnh_nav_img').css('display', 'none');
		$('.mnh_nav_img1').css('display', 'none');
		$('.mnh_nav_img2').css('display', 'none');
	};
	setTimeout(mnhdou(), 300);
	$('.mnh_zhe').css('display', 'none')
	if (mnhmud != '0') {
		mnhmud--;
	};
};

function xian() {
	$('.mnh_nav_img').css('display', 'block');
	$('.mnh_nav_img1').css('display', 'block');
	$('.mnh_nav_img2').css('display', 'block');
	$('.mnh_zhe').css('display', 'block');
	$('.mnh_an').css('-webkit-transform', 'rotate(45deg)');
	$('.mnh_an').css('transform', 'rotate(45deg)');
	$('.mnh_nav_img').animate({
		opacity: '1',
		bottom: '180px'
	}, 300);
	$('.mnh_nav_img1').animate({
		opacity: '1',
		bottom: '235px'
	}, 300);
	$('.mnh_nav_img2').animate({
		opacity: '1',
		bottom: '156px'
	}, 300);
	$('.mnh_zhe').animate({
		opacity: '0.8'
	}, 300);
	if (mnhmud == '0') {
		mnhmud++;
	};	
};

//获取透传消息
//安卓手机(只会在手机状态栏中显示)--在线recieve/离线click
//苹果手机(在线不显示，离线在手机状态栏中显示)----在线recieve/离线click
mui.plusReady(function(){
	// 离线监听点击消息事件
	plus.push.addEventListener( "click", function( msg ) {     
//			alert(JSON.stringify(msg));
	}, false );
	// 在线监听消息事件
	plus.push.addEventListener( "receive", function( msg ) {
			var options = {cover:false};
			var str=msg.content;
			plus.push.createMessage( str, "LocalMSG", options );
//			if(plus.os.name=="iOS"){
//				outLine('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
//			}
//			console.log(msg);
	}, false );	
});



Vue.filter('tiemFormate', function(time) {
	var day = new Date(time * 1000);
	return day.getFullYear() + '.' + parseInt(day.getMonth() + 1) + '.' + day.getDate();
})

Vue.http.options.emulateJSON = true;
var indexVm = new Vue({
	el: '#indexBody',
	data: {
		//活动banner图
		bannerImg: '',
		bannerFirstImg: '',
		bannerLastImg: '',
		//活动列表
		activityList: '',
		last: '', //banner图小圈圈
		actpageNumber: 1, //当前页码
		acttotalPage: '', //总页数
		//往期活动列表
		reportList: '',
		reppageNumber: 1,
		reptotalPage: '',
		//竞赛列表
//		compeList: '',
//		compeNumber: 1,
//		competotalPage: '',
		
		city:'全国', //城市切换
		city1:''
	},
	computed: {

	},
	methods: {
		//活动列表下拉刷新
		actEndPulldown: function() {
			//获取活动报道竞赛列表数据
			this.getList();			
			setTimeout(function() {
				mui('#act-scroll').pullToRefresh().endPullDownToRefresh(false);
			}, 1000);
		},
		//活动列表上拉加载(一旦没有更多数据，上滑将不会触发上拉加载！)
		actEndPullup: function() {
			if(this.city=='全国'){this.city1=''}else{this.city1=this.city};
			this.actpageNumber++;
			if(this.actpageNumber > this.acttotalPage) {
				$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(0).show();
				setTimeout(function() {
					mui('#act-scroll').pullToRefresh().endPullUpToRefresh(false);
					$('.mui-pull-loading').html('没有更多数据了！');
				}, 1000); //显示没有更多数据了
			} else {
				mui('#act-scroll').pullToRefresh().endPullUpToRefresh(false);
				this.$http({
					method: 'POST',
					url: URL + '/party/Activity/activity_list',
					data: {
						page:this.actpageNumber,
						city:this.city1,
						type:0
					}
				}).then(
					function(response) {
						if(response.data.success == true) {
							for(var i = 0; i < response.data.data.length; i++) {
								this.activityList.push(response.data.data[i]);
							}
						}
					}
				)
			}

		},

		//往期活动列表下拉刷新
		repEndPulldown: function() {
			this.getList();	
			setTimeout(function() {
				mui('#report-scroll').pullToRefresh().endPullDownToRefresh(false);
			}, 1000);
		},
		//往期活动列表上拉加载
		repEndPullup: function() {
			if(this.city=='全国'){this.city1=''}else{this.city1=this.city};
			this.reppageNumber++;
			if(this.reppageNumber > this.reptotalPage) {
				$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(1).show();
				setTimeout(function() {
					mui('#report-scroll').pullToRefresh().endPullUpToRefresh(false);
					$('.mui-pull-loading').html('没有更多数据了！');
				}, 1000); //显示没有更多数据了
			} else {
				mui('#report-scroll').pullToRefresh().endPullUpToRefresh(false);
				this.$http({
					method: 'POST',
					url: URL + '/party/Activity/activity_list',
					data: {
						page: this.reppageNumber,
						city:this.city1,
						type:1
					}
				}).then(
					function(response) {
						if(response.data.success == true) {
							for(var i = 0; i < response.data.data.length; i++) {
								this.reportList.push(response.data.data[i]);
							}
						}
					}
				)
			}

		},
		//跳转活动详情页
		actGoto: function(evt, id) {
			//console.log(evt.currentTarget);  //target 当前点击对象  currentTarget 事件绑定的对象 
			var obj = evt.currentTarget;
			store.set('mnhcontentnav', id);
			difGoto(obj);
		},		
		
		
		//跳转报道详情页	
//		repGoto: function(evt, id) {
//			var obj = evt.currentTarget;
//			store.set('mnhReport', id);
//			difGoto(obj);
//		},

		//竞赛列表下拉刷新
//		compeEndPulldown: function() {
//			this.getList();	
//			setTimeout(function() {
//				mui('#compe-scroll').pullToRefresh().endPullDownToRefresh();
//			}, 1000);
//		},
		//竞赛列表上拉加载
//		compeEndPullup: function() {
//			if(this.city=='全国'){this.city1=''}else{this.city1=this.city};
//			this.compeNumber++;
//			if(this.compeNumber > this.competotalPage) {
//				$('.mui-pull-bottom-tips').hide(); $('.mui-pull-bottom-tips').eq(2).show();
//				setTimeout(function() {
//					mui('#compe-scroll').pullToRefresh().endPullUpToRefresh(true);
//				}, 1000); //显示没有更多数据了
//			} else {
//				mui('#compe-scroll').pullToRefresh().endPullUpToRefresh(false);
//				this.$http({
//					method: 'POST',
//					url: URL + '/party/match/match_list',
//					data: {
//						page: this.compeNumber,
//						city: this.city,
//					}
//				}).then(
//					function(response) {
//						if(response.data.success == true) {
//							for(var i = 0; i < response.data.data.length; i++) {
//								this.compeList.push(response.data.data[i]);
//							}
//						}
//					}
//				)
//			}
//
//		},
		//跳转竞赛详情页
//		compeGoto: function(evt, id) {
//			var obj = evt.currentTarget;
//			store.set('mnhCompe', id);
//			difGoto(obj);
//		},
		//获取活动报道竞赛列表数据
		getList: function() {
			loads();
			this.actpageNumber=1;
			this.reppageNumber=1;
			if(this.city=='全国'){this.city1=''}else{this.city1=this.city};
			//获取活动列表数据（分页）
			this.$http({
				method: 'POST',
				url: URL + '/party/Activity/activity_list',
				data: {
					city:this.city1,
					type:0
				}
			}).then(
				function(response) {
					if(response.data.success == true) {
												console.log(response.data);
						this.activityList = response.data.data;
						this.acttotalPage = response.data.page.totalPage;
						mui('#act-scroll').pullToRefresh({
							down: {
								callback: this.actEndPulldown
							},
							up: {
								callback: this.actEndPullup
							}
						});
					}
				}
			);
			//往期活动（报道变成了往期活动）
			this.$http({
				method: 'POST',
				url:URL+'/party/Activity/activity_list',
				data: {
					city: this.city1,
					type:1
				}
			}).then(
				function(response) {
					//					console.log(response.data);
					if(response.data.success == true) {
						this.reportList = response.data.data;
						this.reptotalPage = response.data.page.totalPage;
						mui('#report-scroll').pullToRefresh({
							down: {
								callback: this.repEndPulldown
							},
							up: {
								callback: this.repEndPullup
							}
						});
					}
				}
			);
			setTimeout(function(){loadh();},2000);			
			//获取竞赛列表数据(分页)
//			this.$http({
//				method: 'POST',
//				url: URL + '/party/match/match_list',
//				data: {
//					city: this.city1
//				}
//			}).then(
//				function(response) {
//					//					console.log(response.data);
//					if(response.data.success == true) {
//						this.compeList = response.data.data;
//						this.competotalPage = response.data.page.totalPage;
//						mui('#compe-scroll').pullToRefresh({
//							down: {
//								callback: this.compeEndPulldown
//							},
//							up: {
//								callback: this.compeEndPullup
//							}
//						});
//					}
//				}
//			);

		},
	},
	ready: function() {
		var _this = this;
		this.getList();
		
		//获取设备当前位置信息
//		mui.plusReady(function() {
//			plus.geolocation.getCurrentPosition(
//				function(position) {
//					//console.log(position.address.city);
//					if(position.address.city=='' || position.address.city==undefined || position.address.city==null){
//						_this.city='北京';
//					}else{
//						var city = position.address.city.substring(0, position.address.city.length - 1);
//						_this.city=city;
//					};
//					//获取活动报道竞赛列表数据
//					_this.getList();
//				},
//				function(error) {
//					alert(error.code + ',' + error.message);
//				}
//			);
//		});
		
		//获取活动轮播图数据
		this.$http({
			method: 'GET',
			url: URL + '/party/Activity/banners'
		}).then(
			function(response) {
				if(response.data.success == true) {
//											console.log(response.data.data);
					this.last = response.data.data.length - 1;
					this.bannerImg = response.data.data;
					this.bannerFirstImg = response.data.data[0];
					this.bannerLastImg = response.data.data[this.last];
					//dpm渲染之后再循环
					this.$nextTick(function() {
						mui('#sliderr').slider({
//							时间
							interval: 5000
						});
					});

				}
			}
		);

		//发布活动后，重新刷新活动列表 （没用需要人工审核）
		//			window.addEventListener('actList-refresh',function(){
		//				this.$http({method:'GET',url:URL+'/party/Activity/activity_list'}).then(
		//					function(response){
		//						if(response.data.success==true){
		//							this.activityList=response.data.data;
		//							this.acttotalPage=response.data.page.totalPage;
		//							mui('#act-scroll').pullToRefresh({down:{callback:this.actEndPulldown},up:{callback:this.actEndPullup}});						
		//						}
		//					}
		//				);				
		//			}.bind(this));
		//发布报道成功后，重新刷星报道列表（没用需要人工审核）
		//			window.addEventListener('repList-refresh',function(){
		//				this.$http({method:'GET',url:URL+'/party/report/report_list'}).then(
		//					function(response){
		//						if(response.data.success==true){
		//							this.reportList=response.data.data;
		//							this.reptotalPage=response.data.page.totalPage;
		//							mui('#report-scroll').pullToRefresh({down:{callback:this.repEndPulldown},up:{callback:this.repEndPullup}});
		//						}
		//					}
		//				);				
		//			}.bind(this));

		window.addEventListener('getCity', function(event) {
			if(event.detail.city==''){
				this.city='全国'
			}else{
				this.city=event.detail.city;	
			};
			this.getList();
		}.bind(this));
	}
});