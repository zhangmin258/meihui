
//需要审核无用
//mui.plusReady(function() {
//	mui.init({
//		beforeback: function(){
//			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
//			mui.fire(page,'repList-refresh');
//			//返回true，继续页面关闭逻辑
//			return true;
//		}
//	});
//});


//日期选择
var result;					
var btns = mui('.rep-btn');
btns.each(function(i, btn) {
	btn.addEventListener('tap', function() {
		$('input').blur();
		var _self = this;
		result = $('#' + _self.id)[0];
		if(_self.picker) {
			_self.picker.show(function(rs) {
				result.innerText = rs.text; result.style.color='black';
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var id = this.getAttribute('id');
			_self.picker = new mui.DtPicker({
				endDate: new Date(2030, 12, 30),
			});
			_self.picker.show(function(rs) {
				result.innerText =rs.text; result.style.color='black';
				_self.picker.dispose();
				_self.picker = null;
			});
		}

	}, false);
});

//打开裁剪框
mui('.mnhtheme').on('tap','#logox1',function(){
	$(".htmleaf-container").show();
})


//关闭裁剪框
$("#imgover").click(function() {
	$(".htmleaf-container").hide();
});

//图片上传
var kuan = $('body').css('width');
var dd = kuan.substring(0, kuan.length - 2);
$("#clipArea").photoClip({
	width: dd,                     //虚线裁剪框宽度，高度                     
	file: "#file",
	view: "#view",                //图片裁剪虚线框 
	ok: "#clipBtn",              //截取上传按钮
	loadStart: function() {
//		console.log("照片读取中");
	},
	loadComplete: function() {
//		console.log("照片读取完成");
	},
	clipFinish: function(dataURL) {
//		console.log(dataURL);				
	}
});

//裁剪并上传
$("#clipBtn").click(function() {
	if(imgsource != "") {
		$("#rep_img").attr('src',imgsource).css('height','190px');
		$(".htmleaf-container").hide();
		$(window).scrollTop('0');
	} else {return;}
});




var cityPicker4 = new mui.PopPicker({layer: 3});
cityPicker4.setData(cityData3);
var mr_province='',mr_city='',mr_area='';

mui('.mnhactivitiestit').on('tap','#rep-addressArange',function(){
	$('input').blur();
	cityPicker4.show(function(items) {
		$('#rep-addressArange').val(items[0].text+','+items[1].text+','+items[2].text);
		mr_province=items[0].text;mr_city=items[1].text;mr_area=items[2].text;
		cityPicker4.picker = null;
	})
})


//发布报道
mui('header').on('tap','.rep-fabu',function(){
	$('input').blur();
	var repImgurl=$('#rep_img').attr('src');
	var mr_name=$('#mr_name').val();
	var mr_time_start=$('#mr_time_start').text();
	var mr_time_end=$('#mr_time_end').text();
//	 mr_province,mr_city,mr_area';
	var mr_address=$('#mr_address').val();
	var mr_owner=$('#mr_owner').val();
	var mr_detail=$('#mr_detail').val();
	var mr_form=$('#mr_form').val();
	var inputVal=$(".mui-content input[type='text']");
	var flag=true;
	inputVal.each(function(element,index){
		if($.trim($(this).val())==''){
			flag=false;
		}
	});	
	if(!repImgurl){
		mui.toast('请上传报道图片');
	}else if(flag==false){
		mui.toast('信息填写不完整!'); 
	}else if($.trim(mr_detail)==''){
		mui.toast('信息填写不完整!'); 
	}else if(/\d+/.test(mr_time_start)!=true || /\d+/.test(mr_time_end)!=true){
		mui.toast('报道时间填写不完整');
	}else if(CompareDate(mr_time_end,mr_time_start)!=true){
		mui.toast('报道开始时间不得大于报道结束时间');
	}else{
		mui.plusReady(function(){plus.nativeUI.showWaiting()});
		$('.rep-fabu').hide();
		$.ajax({
			type:"POST",
			url:URL+"/party/Report/report_publish",
			async:true,
			dataType:'json',
			data:{
				mr_uid:localStorage.uid,
				mr_img_small:repImgurl,
				mr_subject:$('#mr_name').val(),
				mr_time_start:mr_time_start,
				mr_time_end:mr_time_end,
				mr_province:mr_province,
				mr_city:mr_city,
				mr_area:mr_area,
				mr_address:mr_address,
				mr_owner:mr_owner,
				mr_detail:mr_detail,
				mr_form:mr_form
			},
			success:function(data){
				if(data.success==true){
					mui.toast('报道发布成功,等待审核！');
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});
					$('.rep-fabu').show();
					//返回首页更新报道列表！
					mui.back();					
				}else{
					$('.rep-fabu').show();
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});					
				}
			},
			error:function(error){
				mui.toast('发布失败，请检查网路!');
				$('.rep-fabu').show();
				mui.plusReady(function(){plus.nativeUI.closeWaiting()});
			}
			
		});
	}
	
})


function CompareDate(d1,d2){
	if((new Date(d1.replace(/-/g,"\/")))>(new Date(d2.replace(/-/g,"\/")))|| (new Date(d1.replace(/-/g,"\/")))==(new Date(d2.replace(/-/g,"\/")))){
		return true;
	}
}

