var shares=null;
// H5 plus事件处理
function plusReady(){
	updateSerivces();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready', plusReady, false);
}
/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices(function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
	}, function(e){
		mui.toast('获取分享服务列表失败：'+e.message);
	});
}
/**
 * 调用系统分享
  */
function shareSystem(){
	var msg={content:sharecontent.value};
	if(pic&&pic.realUrl){
		msg.pictures=[pic.realUrl];
	}
	plus.share.sendWithSystem?plus.share.sendWithSystem(msg, function(){
		console.log('Success');
	}, function(e){
		console.log('Failed: '+JSON.stringify(e));
	}):shareSystemNativeJS();
}
function shareSystemNativeJS() {
	if(plus.os.name!=='Android'){
		plus.nativeUI.alert('此平台暂不支持系统分享功能!');
		return;
	}
	var intent=new Intent(Intent.ACTION_SEND);
	if(pic&&pic.realUrl){
		var p = '';
		p = pic.realUrl;
		if(p.substr(0,7)==='file://'){
			p=p.substr(7);
		}else if(p.sub(0)!=='/'){
			p=plus.io.convertLocalFileSystemURL(p);
		}
	}
	var f = new File(p);
	var uri = Uri.fromFile(f);
	if(f.exists()&&f.isFile()){
		console.log('image/*');
		intent.setType('image/*');
		intent.putExtra(Intent.EXTRA_STREAM,uri);
	}else{
		console.log('text/plain');
		intent.setType('text/plain');
	}
	intent.putExtra(Intent.EXTRA_SUBJECT,'HelloH5');
	intent.putExtra(Intent.EXTRA_TEXT,sharecontent.value);
	intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
	main.startActivity(Intent.createChooser(intent,'美女会'));
}
/**
   * 分享操作
   * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
   * @param {Boolean} bh 是否分享链接
   */
function shareAction(sb,bh) {
	if(!sb||!sb.s){
		return;
	}
	var msg={content:'',extra:{scene:sb.x}};
	if(bh){
//		链接
		msg.href = URL+'/person/Index/share';
//		标题
		msg.title='美女会';
//		内容
		msg.content='万能女人圈，美女app';
//		图片
		msg.thumbs=['logom.png'];
		msg.pictures=['logom.png'];
	}else{
		if(pic&&pic.realUrl){
//			msg.pictures=[pic.realUrl];
		}
	}
	// 发送分享
	if(sb.s.authenticated){
		shareMessage(msg, sb.s);
	}else{
		sb.s.authorize(function(){
			shareMessage(msg,sb.s);
		}, function(e){
			mui.toast('认证授权失败：'+e.code+' - '+e.message);
		});
	}
}
/**
   * 发送分享消息
   * @param {JSON} msg
   * @param {plus.share.ShareService} s
   */
function shareMessage(msg, s){
	s.send(msg, function(){
		mui.toast('分享到"'+s.description+'"成功！');
	}, function(e){
		mui.toast('分享到"'+s.description+'"失败!');
	});
}
/**
 * 解除所有分享服务的授权
 */
function cancelAuth(){try{
	for(var i in shares){
		var s=shares[i];
		if(s.authenticated){
			mui.toast('取消"'+s.description+'"');
		}
		s.forbid();
	}
	// 取消授权后需要更新服务列表
	updateSerivces();}catch(e){alert(e);}
}
// 分析链接
function shareHref(){
	var shareBts=[];
	// 更新分享列表
	var ss=shares['weixin'];
	ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
	shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
	// 弹出分享列表
	shareBts.length>0?plus.nativeUI.actionSheet({title:'分享链接',cancel:'取消',buttons:shareBts},function(e){
		(e.index>0)&&shareAction(shareBts[e.index-1],true);
	}):plus.nativeUI.alert('当前环境无法支持分享链接操作!');
}