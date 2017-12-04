

	//竞赛id
	var match_id=store.get('match_id');
	var kuan = $('body').css('width');
	var dd = kuan.substring(0, kuan.length - 2);
	$("#clipArea").photoClip({
		width: dd,
		file: "#file",
		view: "#view",
		ok: "#clipBtn",
		loadStart: function() {
//			console.log("照片读取中");
		},
		loadComplete: function() {
//			console.log("照片读取完成");
		},
		clipFinish: function(dataURL) {
//			console.log(dataURL)				
		}
	});
		
	var mnhid;
	$("body").on('tap','.mnhthemeimg',function() {
		$(".htmleaf-container").show();
		mnhid = $(this).attr('dataid');   //0,1,2,3......
		$('.photo-clip-rotateLayer').find('img').attr('src','');
	});
	$("#clipBtn").click(function() {
		if ($('.photo-clip-rotateLayer').find('img').attr('src') == '') {
			return alert('亲，当前没有图片可以裁剪!');
		};
		if(imgsource != "") {					
			$(".on"+mnhid).find('img').attr('src',imgsource);
			$(".on"+mnhid).css('display','block');
			$(".htmleaf-container").hide();
		} else {
            $(".on"+mnhid).css('display','none');
		}
	});
	$("#imgover").click(function() {
		$(".htmleaf-container").hide();
	});
	
	
	var mnhleng;
	mui('body').on('tap', '.mnhaddes', function() {
		var table = document.body.querySelector('.mui-table-view');  //ul
		mnhleng = $('.mui-table-view-cell').length;
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-collapse';
		li.innerHTML = '<a class="mui-navigate-right" href="#">展示图</a>'+
		'<div class="mnhcntentimg on'+mnhleng+'" style="display: none;"><img src="" /></div>'+
					'<div class="mui-collapse-content">'+
						'<form class="mui-input-group">'+
						'	<div class="mui-input-row"><div class="mnhtheme">'+
									'<input type="text" name="" id="" value="" placeholder="竞赛主题" />'+
									'<div class="mnhthemeimg icomoon icon-addimg" dataid="'+mnhleng+'" ;></div>'+
								'</div></div><div class="mui-input-row mnhtextarea">'+
								'<textarea name="" rows="" cols="" placeholder="请输入详情内容（36字以内）" maxlength="36"></textarea>'+
							'</div></form></div>';
		table.appendChild(li);
	});
	
	var compneArr=[];
	var compneObj={
		mmj_name:'',
		mmj_img_small:'',
		mmj_introduce:''
	};
	//循环  compne-fabu  compne_subject
	mui('header').on('tap','.compne-fabu',function(){
		var li=$('.mui-table-view-cell');
		var flag=false;
		li.each(function(index,element){
			compneObj={};
			var  mmj_img_small=$(element).find('img').attr('src');
			var  mmj_name=$(element).find('input').val();
			var  mmj_introduce=$(element).find('textarea').val();
			if(!mmj_img_small){
				mui.toast('请上传竞赛图片');
			}else if($.trim(mmj_name)==''){
				mui.toast('请填写主题！');
			}else if($.trim(mmj_introduce)==''){
				mui.toast('请填写详情!');
			}else{
				compneObj.mmj_img_small=mmj_img_small;
				compneObj.mmj_name= mmj_name;
				compneObj.mmj_introduce=mmj_introduce;
				compneArr.push(compneObj);
				compneObj={};
				flag=true;
			}
		});
		
		
		if(flag==true){
			var compneArr1=JSON.stringify(compneArr);
//			alert(typeof(compneArr1));
//			console.log(compneArr1);
			$('.compne-fabu').hide();
			mui.plusReady(function(){plus.nativeUI.showWaiting()});			
			$.ajax({	
				type:"POST",
				url:URL+"/party/Match/match_join_add",
				async:false,
				dataType:'json',
				data:{
					m_id:match_id,
					compne_content:compneArr1
				},
				success:function(data){
					if(data.success==true){
						compneArr=[];
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});
						mui.toast('竞赛内容发布成功，等待审核！');
						mui.back();
						$('.compne-fabu').show();
					}else{
						mui.plusReady(function(){plus.nativeUI.closeWaiting()});
						$('.compne-fabu').show();
					}
				},
				error:function(error){
					mui.toast('发布失败，请检查网络！')
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});
					$('.compne-fabu').show();				
				}
			});			
		}
	});
	
	
	//返回
	var backFlag=false;
	mui('header').on('tap','.mui-pull-left',function(){
		if(backFlag==false){  //未登录（肯定没关注）
	       var btnArray = ['退出', '继续填写'];
	        mui.confirm('没有竞赛内容会导致观众无法参与竞赛', '确认框', btnArray, function(e) {
	            if (e.index == 0){
					mui.back();	
	            } else {} 
	        });
	    }else{
	    	mui.back();	
	    }
	});
	
	

//var test1=[{num1:'1',num2:'2'},{aaa:'a',bbb:'b'}];
//var test2=JSON.stringify(test1);
//console.log(typeof(test2));
//console.log(test2);











