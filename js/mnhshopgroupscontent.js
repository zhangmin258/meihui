

Vue.filter('timeFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'-'+parseInt(day.getMonth()+1)+'-'+day.getDate()+' '+day.getHours()+':'+day.getMinutes();  
});

Vue.http.options.emulateJSON = true;
var groupscVm=new Vue({
	el:'#groupscBody',
	data:{
		groupId:'',         //开团id
		goodsId:'',         //商品id
		groupContent:'',
		attrList:'',      //商品属性
		groupList:'',       //团购列表
		groupEndTime:'',    //团购结束时间 
		
		firstGroupImg:'',
		groupImgList:'',
		lastGroupImg:'',
		
		introduction:'',    //详情简介
		normalQuestion:''  //常见问题
	  },
	methods:{
		//去参团，登录，人数是否已齐(一个商品对应一个开团group_id,一个开团对应多个组号zu_id)；		
		// 不可以开团：前台：未登录  时间已过/后台:人数已满，不能参加自己开的团 ,不能多次参加同一个团
		joinGroup:function(groupsn){
			var nowTime=new Date().getTime();
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){
		       	var btnArray = ['取消', '确认'];
		        mui.confirm('登录后才能参团哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('../land/login.html');		
		            } else {} 
		        });				
			}else if(nowTime>=this.groupEndTime*1000){
				mui.toast('参团时间已过！'); 
			}else{				
				this.$http({method:'POST',url:URL+'/shopping/Group/is_able',data:{uid:localStorage.uid,group_sn:groupsn}}).then(  //判断是否可以参团
					function(response){
						if(response.data.success==true){
//							console.log(response.data);
							store.set('groupsn',groupsn);
							jump("mnhtxp.html");							
						}else{
							mui.toast(response.data.msg);	
						}
					}
				);
			}

		},
		//立即开团  登录,开团时间已过(可以无限开团,不支付不算开团成功！)
		creatGroup:function(){			
			var nowTime1=new Date().getTime();
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){
		       	var btnArray = ['取消', '确认'];
		        mui.confirm('登录后才能开团哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('../land/login.html');		
		            } else {} 
		        });				
			}else if(nowTime1>=this.groupEndTime*1000){
				mui.toast('开团时间已过！');
			}else{
				mui('.mnhshoppng_T').button('loading');//团购发起者
				this.$http({method:'POST',url:URL+'/person/Order/sumbit_order',data:{uid:localStorage.uid,group_id:this.groupId,group_sponsor:localStorage.uid,g_id:this.goodsId,num:1}}).then(  //判断是否可以参团
					function(response){
						if(response.data.success==true){
//							console.log(response.data);	
							//跳转订单页(立即付款);
							store.set('orderId',response.data.data.order_id);
							store.set('orderType',response.data.data.type);     //type：3 团购订单
							jump('../mnhcar/mnhcarOrder.html');	
							setTimeout(function(){mui('.mnhshoppng_T').button('reset')},2000);							
						}else{
							mui('.mnhshoppng_T').button('reset');
							mui.toast('开团失败，请检查网络！');	
						}
					}
				);
			}			
		},
		//点击更多按钮跳转团购大厅
		moreGroup:function(){
			jump('mnhtlist.html');
		},
		//更多问题
//		moreQuestion:function(){
//			jump("mnhCommonproblem.html");
//		}
	},
	ready:function(){
		loads();
		this.groupId=store.get('groupId');   //alert(this.groupId);
		this.$http({method:'POST',url:URL+'/shopping/Group/group_detail',data:{uid:localStorage.uid,group_id:this.groupId}}).then(
			function(response){
				if(response.data.success==true){
					console.log(response.data);
					this.groupContent=response.data.data;
					this.attrList=response.data.data.attribute;     //商品属性列表
					this.groupList=response.data.data.choose;       //参团列表
					this.groupEndTime=response.data.data.time_end;   //参团结束时间
					this.goodsId=response.data.data.goods_id;         //商品id
					
					this.firstGroupImg=response.data.data.img[0];					
					this.groupImgList=response.data.data.img;            //商品详情轮播图
					var last=response.data.data.img.length-1;
					this.lastGroupImg=response.data.data.img[last];
					
					//常见问题
					this.normalQuestion=response.data.data.introduction;
					$('#normalQuestion').append(this.normalQuestion);
//					$('#normalQuestion').append(response.data.data.introduction);
					//详情简介
					this.introduction=response.data.data.detail;
					$('#introduction').append(this.introduction);
					setTimeout(function(){loadh()},1000);					
				}
			}
		);
		//支付完成后刷新参团列表
		window.addEventListener('groupsRefresh',function(){
			loads();
			this.$http({method:'POST',url:URL+'/shopping/Group/group_detail',data:{uid:localStorage.uid,group_id:this.groupId}}).then(
				function(response){
					if(response.data.success==true){
						this.groupList=response.data.data.choose;       //参团列表
						setTimeout(function(){loadh()},1000);
					}
				}
			);	
		}.bind(this));
	}
	
});