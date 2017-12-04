


//日期选择
var result;					
var btns = mui('.comp-btn');
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



//地址三级联动
var cityPicker5 = new mui.PopPicker({layer: 3});
cityPicker5.setData(cityData3);
var mm_province='',mm_city='',mm_area='';

mui('.mnhactivitiestit').on('tap','#comp-addressArange',function(){
	$('input').blur();
	cityPicker5.show(function(items) {
		$('#comp-addressArange').val(items[0].text+','+items[1].text+','+items[2].text);
		mm_province=items[0].text;mm_city=items[1].text;mm_area=items[2].text;
		cityPicker5.picker = null;
	})
});




//打开裁剪框
mui('.mnhtheme').on('tap','#logox1',function(){
	$(".htmleaf-container").show();
});


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
		$("#comp_img").attr('src',imgsource).css('height','190px');
		$(".htmleaf-container").hide();
		$(window).scrollTop('0');
	} else {return;}
});



//点击发布竞赛
mui('header').on('tap','.comp-fabu',function(){
	$('input').blur();
	var mm_img_small=$('#comp_img').attr('src');
	var mm_subject=$('#mm_subject').val();
	var mm_time_start=$('#result').text();
	var mm_time_end=$('#resulte').text();
	//mm_province,mm_city,mm_area;
	var mm_address=$('#mm_address').val();
	var mm_owner=$('#mm_owner').val();
	var mm_detail=$('#mm_detail').val();
	var mm_form=$('#mm_form').val();
	var inputVal=$(".mui-content input[type='text']");
	var flag=true;
	inputVal.each(function(element,index){
		if($.trim($(this).val())==''){
			flag=false;
		}
	});	
	
	
	if(!mm_img_small){
		mui.toast('请上传竞赛图片');
	}else if(flag==false){
		mui.toast('信息填写不完整!'); 
	}else if($.trim(mm_detail)==''){
		mui.toast('信息填写不完整!'); 
	}else if(/\d+/.test(mm_time_start)!=true || /\d+/.test(mm_time_end)!=true){
		mui.toast('竞赛时间填写不完整');
	}else if(CompareDate(mm_time_end,mm_time_start)!=true){
		mui.toast('竞赛开始时间不得大于竞赛结束时间');
	}else{
		mui.plusReady(function(){plus.nativeUI.showWaiting()});
		$('.comp-fabu').hide();	
		$.ajax({
			type:"POST",
			url:URL+"/party/Match/match_publish",
			async:false,
			dataType:'json',
			data:{
				mm_uid:97,
				mm_img_small:mm_img_small,
				mm_subject:mm_subject,
				mm_time_start:mm_time_start,
				mm_time_end:mm_time_end,
				mm_province:mm_province,
				mm_city:mm_city,
				mm_area:mm_area,
				mm_address:mm_address,
				mm_owner:mm_owner,
				mm_detail:mm_detail,
				mm_form:mm_form
			},
			success:function(data){
				if(data.success==true){
					mui.toast('发布竞赛成功,请添加竞赛内容');
					$('.comp-fabu').show();	
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});
					jump('mnhcompetitionfbne.html');
					store.set('match_id',data.data.match_id);
				}else{
					$('.comp-fabu').show();	
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});										
				}
			},
			error:function(error){
				mui.toast('发布失败，请检查网路!');
				$('.comp-fabu').show();
				mui.plusReady(function(){plus.nativeUI.closeWaiting()});				
			}
		});
	}
	
});


function CompareDate(d1,d2){
	if((new Date(d1.replace(/-/g,"\/")))>(new Date(d2.replace(/-/g,"\/")))|| (new Date(d1.replace(/-/g,"\/")))==(new Date(d2.replace(/-/g,"\/")))){
		return true;
	}
}


