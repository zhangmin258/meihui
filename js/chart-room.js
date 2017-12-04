
var Vconsole=new VConsole();


//计算在线时间
var timess = 0;
setInterval('timess++',1000);

//初始化qq表情
$('.emotion').qqFace({
	id : 'facebox', 
	assign:'saytext', //给输入框赋值
	path:'arclist/'	  //表情存放的路径
});


//查看结果（把文字用正则变为图片）
function replace_em(str){
	str = str.replace(/\</g,'&lt;');
	str = str.replace(/\>/g,'&gt;');
	str = str.replace(/\n/g,'<br/>');
	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');
	return str;
}



    var websocket = null;
    var flag=true;                 //断网、连接错误时不能发送消息
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
      websocket = new WebSocket("ws://47.96.3.28:8181"); 
		
    }else {
        alert('当前浏览器 Not support websocket');
    };

    //连接发生错误的回调方法
    websocket.onerror = function () {
        mui.toast("WebSocket连接发生错误");
        flag=false;
    };

    //连接成功建立的回调方法
    websocket.onopen = function () {
//      console.log("WebSocket连接成功");
          InitData();
    };
    
	websocket.onmessage = function(e){
	    // json数据转换成js对象
	    var data = eval("("+e.data+")");
	    var type = data.message_type || '';
	    var warnli='';
	    var warnli1='';
	    switch(type){
	        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
	        case 'init':
	        	$('.member').html(data.number);           //一进入房间就收到统计人数
	            break;
	        // 当mvc框架调用GatewayClient发消息时直接alert出来
            case 'addList':
                warnli='<div class="getinWarn">'+data.data.username+'加入！</div>';
                $('.speak_box').append(warnli);
                $('.member').html(data.data.number);                              //人数
                break;
            case 'logout':
                warnli1='<div class="getinWarn">'+data.username+'退出！</div>';
                $('.speak_box').append(warnli1);
                $('.member').html(data.number);                                    //人数
                break; 
            case 'topic':                               //图片以聊天信息的形式发送，进来的人是看不到当前时间节点之前的聊天信息和标题图片的
				$('.chartHoster img').attr('src',data.data.content);
				$('.chartHoster img').show();
            	break;
            case 'bonus':
            	//发红包
            	xndjj();
            	break; 
            case 'ping':
            	break;
	        default :
				if(data.data==undefined){
					return;
				};
//	            console.log(data.data.username+':'+data.data.content);    //发起会话
				var ans = '<div class="answer"><div class="heard_img left"><img src="'+data.data.avatar+'"/></div>';
				ans += '<div class="answer_text"><div>'+data.data.username+'</div><p>' +replace_em(data.data.content)+ '</p><i></i></div>'
				ans += '</div></div>';
				$('.speak_box').append(ans);
				for_bottom();
	    }
	};   
    

    //连接关闭的回调方法
    websocket.onclose = function () {
//      console.log("WebSocket连接关闭");
        flag=false;
    }

	function InitData() {            //初始化上传uid 头像
	    var data = {
	    	        "type": "init",
	    	        "id":localStorage.uid,
	    	        "username":localStorage.nickname,    //昵称        
	    	        "avatar":localStorage.avator, 
	    	        "sign":"aaaa"              //占位 
	    	       }
	    data = JSON.stringify(data);
	    websocket.send(data);
	};

	//input框内的值直接发给后台，再由后台返回回来
	function up_say() {
		if(flag=false){
			mui.toast('网络不可用！');
		}else{
			var text = $("#saytext").val();
			if($.trim(text) == '') {
				mui.toast('请输入聊天内容');
				$('.write_box input').focus();
			} else {
				var data={
					"type": "chatMessage",
					"data": {
						"to": {
							"type": "group",
							"id": "101"
						},
						"mine": {
							"content": text,
						}
					}			
				};
				data = JSON.stringify(data);
				websocket.send(data);
				
				var str='';
				str = '<div class="question">';
				str += '<div class="heard_img right"><img src="'+localStorage.avator+'"/></div>';
				str += '<div class="question_text clear"><div>'+localStorage.nickname+'</div><p>' +replace_em(text)+ '</p><i></i>';
				str += '</div></div>';			
				
				$('#emotionBox').hide();
				count=0;                      //在jquery.qqFace.js中定义
				$('.speak_box').append(str);
				$('.write_box input').val('');
				$('.write_box input').focus();
				autoWidth();
				for_bottom();
			}			
		}
	};
	
	//聊天内容溢出滚动
	function for_bottom() {
		var speak_height = $('.speak_box').height();    //fixed是撑开的
		$('.speak_box,.speak_window').animate({
			scrollTop: speak_height                     //没明白？？？？
		}, 500);
	}
	
	function autoWidth() {             //question_text的宽度是随发送文字的多少而自适应
		$('.question_text').css('max-width', $('.question').width() - 60);
	}
	autoWidth();
	
//获取聊天标题图片（图片以聊天信息的形式发送，进来的人是看不到当前时间节点之前的websokect发送的聊天信息和标题图片的）
	$.ajax({
		type:"POST",
		url:URL+"/person/Chat/get_topic",
		async:true,
		dataType:'json',
		data:{
			uid:localStorage.uid
		},
		success:function(data){
			if(data.success==true){
//				console.log(data);
				$('.chartHoster img').attr('src',data.data);
				$('.chartHoster img').show();
			}
		}
	});
	
	

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
//  window.onbeforeunload = function () {
//      closeWebSocket();
//  }



//是否退出美聊
document.getElementById("xuroomback").addEventListener('tap', function() {
	var btnArray = ['否', '是'];
	mui.confirm('您是否退出美聊', '提示', btnArray, function(e) {
		if (e.index == 1) {
			console.log(timess);
			mui.back();
		} else {
			return;
		}
	})
});
			
//页面跳转
mui('body').on('tap','.xujump',function(evt){
	evt.preventDefault();
	var address=$(this).find('a').attr('href');
	jump(address);
})