var ws=null,wp=null,wo=null;
// 动画窗口
function animateWindow(type,html){
	wp = null;
	wp||(wp=plus.webview.create(html,html,{scrollIndicator:'none',scalable:false,popGesture:'none'},{preate:true}));
	wp.show(type);
	yin();
};
// 关闭窗口
var _back=window.back;
function preateBack(){
	wp&&(wp.close(),wp=null);
	_back();
}
window.back=preateBack;