// QQ表情插件
var count=0;          //控制表情框的显示隐藏
(function($){  
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',
			path : 'face/',
			assign : 'content',
			tip : 'em_'
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		
		$(this).click(function(e){    //点击表情文字
			if(count==0){             //打开
				e.stopPropagation();
				var strFace, labFace,
				qqImg = '';
				if($('#'+id).length<=0){
					for(var i=1; i<=18; i++){
						labFace = '['+tip+i+']';  //em_1                           //$('#saytext') textarea框
                        qqImg += '<div class="iconlogo"><img class="qqImg" src="'+path+i+'.gif" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></div>';
					};
					strFace = '<div id="'+id+'" class="qqFace">'+qqImg+'</div>';
				};
				$('#emotionBox').append(strFace);
				$('#emotionBox').show();
				count=1;
			}else if(count==1){
				$('#emotionBox').hide();
				count=0;
			}

		});
		//表情框显示隐藏	
		$('.speak_window').click(function(){
			$('#emotionBox').hide();
			count=0;
//			$('#'+id).remove();
		});
};
})(jQuery);

jQuery.extend({ 
unselectContents: function(){ 
	if(window.getSelection) 
		window.getSelection().removeAllRanges(); 
	else if(document.selection) 
		document.selection.empty(); 
	} 
}); 
jQuery.fn.extend({ 
	selectContents: function(){ 
		$(this).each(function(i){ 
			var node = this; 
			var selection, range, doc, win; 
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
				range = doc.createRange(); 
				range.selectNode(node); 
				if(i == 0){ 
					selection.removeAllRanges(); 
				} 
				selection.addRange(range); 
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
				range.moveToElementText(node); 
				range.select(); 
			} 
		}); 
	}, 
	
	//点击当前表情，没看出来有啥作用
	setCaret: function(){ 
//		if(!$.browser.msie) return; 

		var initSetCaret = function(){ 
			var textObj = $(this).get(0);  
//			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 
	//点击当前表情，给$('#saytext')赋值
	insertAtCaret: function(textFeildValue){ 
		//console.log(textFeildValue);   //[em_2]
		var textObj = $(this).get(0);  //console.log(textObj);   //<textarea> class="input" id="saytext" name="saytext"></textarea>
		if(document.all && textObj.createTextRange && textObj.caretPos){ 
			var caretPos=textObj.caretPos; 
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? textFeildValue+'' : textFeildValue;
		} else if(textObj.setSelectionRange){ 
			var rangeStart=textObj.selectionStart; 
			var rangeEnd=textObj.selectionEnd; 
			var tempStr1=textObj.value.substring(0,rangeStart); 
			var tempStr2=textObj.value.substring(rangeEnd); 
			textObj.value=tempStr1+textFeildValue+tempStr2; 
			textObj.focus(); 
			var len=textFeildValue.length; 
			textObj.setSelectionRange(rangeStart+len,rangeStart+len); 
			textObj.blur(); 
		}else{ 
			textObj.value+=textFeildValue; 
		} 
	} 
});