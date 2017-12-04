var load6 = document.getElementsByTagName('body')[0];
var jiazaim = '<div class="tiannadame"><div class="load6">' +
	'<div class="bounce1"></div>' +
	'<div class="bounce2"></div>' +
	'<div class="bounce3"></div>' +
	'</div></div>';
load6.insertAdjacentHTML('afterBegin', jiazaim);
var loaddisplay = document.getElementsByClassName('tiannadame')[0];
//隐藏		
function loadh() {
	loaddisplay.style.display = 'none';
};
//显示
function loads() {
	loaddisplay.style.display = 'block';
};
loadh();