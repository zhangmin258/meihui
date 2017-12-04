


//第一个红包事件
function redh1(){
	$('.grab-main').css('display','block');
	var ui = {
		$grabMain: $('.grab-main')
	};
	var oConfig = window.oPageConfig;
	var interval = null;
	var move = null;
	var oPage = {
		init: function() {
			this.view();
		},
		view: function() {
			//获取屏幕宽度
			var lengw = window.innerWidth - 100;
			var self = this;
			var time = 1;
			var m = 0;
			var i = 0;
			var left1 = 0;
			move = setInterval(function() {
				if(i < 20) {
					var left = Math.ceil(Math.random() * (9 - 0) + 0) * 65;
					var top = Math.ceil(Math.random() * (9 - 0) + 0) * 50;
					//        随机数
					var shu = Math.ceil(Math.random() * 3);
					var cha = Math.abs(left - left1);
					//        大于页面走回调函数
					function dd() {
						if(left > lengw) {
							left = left - lengw
							//							本身回调
							dd();
						};
					};
					dd();
					$("<div class='gold-juns' data-uid='1'>").css({
						'left': left,
						'top': top,
						'background-image': 'url(../images/h'+shu+'.png)'
					}).appendTo(ui.$grabMain);
					$('.gold-juns').eq(0).fadeOut(300);
					setTimeout(function() {
						$('.gold-juns').eq(0).remove();
					}, 800)
					i++
				} else {
					clearInterval(move);
					$('.grab-main').css('display','none');
				}
			}, 600)
		}
		
	};
	oPage.init();		
};

//红包事件开启
function xuhb() {
//	红包1开始动画
	$('.redok').css('display','block');
	$('.redok').animate({
		'top':'30%',
		'left':'25%',
		'width':'80%',
		'opacity':'1'
	},300);	
	setTimeout("$('.redok').animate({'top':'40%','left':'50%','width':'30%','opacity':'0'},600)",3000);
	setTimeout("$('.redok').css('display','none')",3600);
//	事件开始
	setTimeout('redh1()', 3600);
};

//第一个红包动画点击
mui('body').on('touchstart', '.gold-juns', function() {
	//	获取红包
	var numed = Math.ceil(Math.random() * 10);
	if(numed < 3) {
		$('.redokimgno').css('display', 'block');
	} else {		
//		红包接口
		$.ajax({
			url: URL + '/person/Chat/asssess_package',
			dataType: "json",
			type: "get",
			data:{
				uid:localStorage.uid
			},
			success: function(data) {
				if(data.code === 1) {
					if (data.data.code == 0) {
						$('.redokimgno').css('display', 'block');
						$('.redokimgtextno').text(data.data.msg);
					} else{
						$('.redokimg').css('display', 'block');
						$('.redokimgtext').find('span').text(data.data.msg);
					}
				} else {
					mui.alert(data.msg)
				};
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//		mui.toast('获取接口失败');
			}
		});
	}
});

//点击关闭
mui('body').on('touchstart', '.redokimg,.redokimgno', function() {
//	获取红包
	$(this).animate({
		'opacity':'0'
	},300);		
	setTimeout("$('.redokimg,.redokimgno').css({'display':'none','opacity':'1'})",300);	
});

//倒计时	
var xui = 60;
function xndjj(){
	$('.loading_ren').css('display','block');
	if (xui == 0) {
		xuhb();
		$('.loading_ren').css('display','none');
	} else{
	xui--;
	setTimeout('xndjj()',1000);
	$('.loading_ren').find('i').text(xui);
	}
};


//mui('body').on('tap','.mui-bar',function(){	
//	xndjj();	
//});

