

//mui.plusReady(function() {
//	mui.init({
//		beforeback: function(){
//			var page=plus.webview.currentWebview().opener(); 
//			mui.fire(page,'actList-refresh');
//			return true;
//		}
//	});
//});


//日期选择
var result;					
var btns = mui('.btn');
btns.each(function(i, btn) {
	btn.addEventListener('tap', function() {
		$('input').blur();
		var _self = this;
		result = $('#' + _self.id)[0];
//		timename = _self.getAttribute('dataid');
		if(_self.picker) {
			_self.picker.show(function(rs) {
				result.innerText = rs.text; result.style.color='black';
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
//			var optionsJson = this.getAttribute('data-options') || '{}';
//			var options = JSON.parse(optionsJson);
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


var cityPicker3 = new mui.PopPicker({layer: 3});
cityPicker3.setData(cityData3);
var ma_province='',ma_city='',ma_area='';

mui('.mnhactivitiestit').on('tap','#act-addressArange',function(){
	$('input').blur(); 
	cityPicker3.show(function(items) {
		$('#act-addressArange').val(items[0].text+','+items[1].text+','+items[2].text);
		ma_province=items[0].text;ma_city=items[1].text;ma_area=items[2].text;	
		cityPicker3.picker = null;
	});
})



//图片上传
var kuan = $('body').css('width');
var dd = kuan.substring(0, kuan.length - 2);
//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
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
	

//打开裁剪框
mui('.mnhtheme').on('tap','#logox1',function(){
	$(".htmleaf-container").show();
})

//裁剪并上传
$("#clipBtn").click(function() {
	if(imgsource != "") {
		$("#background_img").attr('src',imgsource).css('height','190px');
		$(".htmleaf-container").hide();
		$(window).scrollTop('0');
	} else {return;}
});


$("#imgover").click(function() {
	$(".htmleaf-container").hide();
});



//点击添加自定义信息
var _div;
mui('body').on('tap','.mnhregistrationsettingsadd',function(){				
	_div = document.createElement('div');
	_div.className = 'mui-input-row mnhregistrationsettingstit';
	_div.innerHTML = '<input type="text" name="" id="" value="" placeholder="请输入所需的自定义信息" /><div class="mnhregistrationsettingsrem mui-icon mui-icon-closeempty"></div>';
	document.getElementsByClassName('mnhcontent')[0].appendChild(_div);
});
//点击删除
mui('body').on('tap','.mnhregistrationsettingsrem',function(){				
	 this.parentNode.remove();
});


//发布活动
mui('header').on('tap','.act-fabu',function(){
	$('input').blur();
	var actImg=$('#background_img').attr('src');                //活动图片
	var inputVal=$(".input-content  input[type='text']");         //input设置
	var actBeginTime=$('#result').text();                     //活动开始时间设置 
	var actEndTime=$('#resulte').text();    					//活动结束时间
	var bmEndTime=$('#resultee').text();                      //报名截止时间
	var actDetail=$('#act-textarea').val();                    //活动详情 
	var flag=true;
	inputVal.each(function(element,index){
		if($.trim($(this).val())==''){
			flag=false;
		}
	});
	
//	自定义信息input的值
	var zdyinputVal=$(".mnhcontent input[type='text']");
	var zdyArr=[];
	zdyinputVal.each(function(element,index){
		zdyArr.push($(this).val());
	});
	
	if(!actImg){
		mui.toast('请上传活动图片');
	}else if(flag==false){
		mui.toast('信息填写不完整!'); 
	}else if($.trim(actDetail)==''){
		mui.toast('信息填写不完整!'); 
	}else if(/\d+/.test(actBeginTime)!=true || /\d+/.test(actEndTime)!=true || /\d+/.test(bmEndTime)!=true){
		mui.toast('活动时间填写不完整');
	}else if(CompareDate(actEndTime,actBeginTime)!=true){
		mui.toast('活动开始时间不得大于结束时间');
	}else if(CompareDate(actEndTime,bmEndTime)!=true){
		mui.toast('报名截止日期不得大于活动结束时间');
	}else{
		var ma_img_small=$("#background_img").attr('src');
		var ma_subject=$('#ma_subject').val();
		var ma_time_start=$('#result').text();
		var ma_time_end=$('#resulte').text();
		var ma_enroll_end=$('#resultee').text();
//		ma_province,ma_city,ma_area;
		var ma_address=$('#ma_address').val();
		var ma_owner=$('#ma_owner').val();
		var ma_phone=$('#ma_phone').val();
		var ma_number=$('#ma_number').val();
		var ma_price=$('#ma_price').val();
		var ma_detail=$('#act-textarea').val();
		var ma_form=$('#ma_form').val();
		var ma_otherinfo=zdyArr.join(',');
		mui.plusReady(function(){plus.nativeUI.showWaiting()});
		$('.act-fabu').hide();
		$.ajax({
			type:"POST",
			url:URL+"/party/Activity/activity_publish",
			async:false,
			dataType:'json',
			data:{
				ma_uid:localStorage.uid,
				ma_img_small:ma_img_small,
				ma_subject:ma_subject,
				ma_time_start:ma_time_start,
				ma_time_end:ma_time_end,
				ma_isset_enroll:1,
				ma_enroll_end:ma_enroll_end,
				ma_province:ma_province,
				ma_city:ma_city,
				ma_area:ma_area,
				ma_address:ma_address,
				ma_owner:ma_owner,
				ma_phone:ma_phone,
				ma_number:ma_number,
				ma_price:ma_price,
				ma_detail:ma_detail,
				ma_form:ma_form,
				ma_otherinfo:ma_otherinfo
			},
			success:function(data){
				if(data.success==true){
					mui.toast('活动发布成功,等待审核！');
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});
					$('.act-fabu').show();
					//返回首页更新活动列表！
					mui.back();
				}else{
					$('.act-fabu').show();
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});
				}
			},
			error:function(error){
				mui.toast('发布失败，请检查网路!');
				$('.act-fabu').show();
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


















