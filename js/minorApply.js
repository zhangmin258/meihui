


var cityPicker5 = new mui.PopPicker({layer: 3});
cityPicker5.setData(cityData3);

var applyProvince,applyCity,applyArea;
mui('.mui-table-view-cell').on('tap','.apply-area-input',function(){
	cityPicker5.show(function(items) {
		$('#applyArea').val(items[0].text+','+items[1].text+','+items[2].text);
		applyProvince=items[0].text;applyCity=items[1].text;applyArea=items[2].text;
	})
});	


//点击提价申请按钮
mui('.mui-content').on('tap','#subApply',function(){
	var check=true;
	var applyName=$('#applyName').val();         //姓名
	var applyIdCard=$('#applyIdCard').val();     //身份证
	var applyPhone=$('#applyPhone').val();      //电话号码
	mui("#applyForm input").each(function(index,element) {
		if(!this.value || this.value.trim() == "") {
		    var label = this.previousElementSibling;
		    mui.toast(label.innerText.replace(/:/,'') + "不允许为空");
		    check = false;
		    return false;
		}
	}); 
	if(check){
		mui('#subApply').button('loading');
		$.ajax({
			type:"POST",
			url:URL+"/person/Userparty/apply_chairman",
			async:false,
			dataType:'json',
			data:{
				uid:localStorage.uid,
				province:applyProvince,
				city:applyCity,
				area:applyArea,
				name:applyName,
				phone:applyPhone,
				id_code:applyIdCard
			},
			success:function(data){
				if(data.success==true){
					mui.toast('申请成功,等待审核！');               //审核机制
					mui('#subApply').button('reset');
				}else{
					mui.toast('审核信息有误,无法通过审核！');
				}
			},
			error:function(data){
				mui('#subApply').button('reset');
				mui.toast('申请失败,请检查网络！');
			}
		});
	}	
});




