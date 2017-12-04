



Vue.http.options.emulateJSON = true;
var carVm=new Vue({
	el:'#carBody',
	data:{
		carList:'',     //列表
		totalPage:'',
		pageNumber:1,
		
		selectProList:[],    //选中商品参数以数组的形式展现
		
		totalPrice:0,
		totalNum:0,
		index1:'',
	},
	methods:{
		//选中/取消选中当前商品
		//selectProList=[{id:'',price:'',num:''}]   status默认为false(从后台获取的);
		getcarContent:function(status,id,price,num){
			if (mui.os.ios) {
				if(status==false){                  //取消选中
					for(var j=0;j<this.selectProList.length;j++){
						if(this.selectProList[j].id==id){
	//						alert('数组id:'+this.selectProList[j].id);
							this.totalPrice-=price*num;
							this.totalNum-=num;
							
							var index=this.selectProList.indexOf(this.selectProList[j]);
							this.selectProList.splice(index,1);	
							break; 
						}
					};
					status=true;
				}else if(status==true){             //选中
					this.totalPrice=0;this.totalNum=0;
					this.selectProList.push({id:id,price:price,num:num});
					if(this.selectProList.length>0){
						for(var i=0;i<this.selectProList.length;i++){
							this.totalPrice+=this.selectProList[i].price*this.selectProList[i].num;
							this.totalNum+=this.selectProList[i].num;
							
						};
	//					console.log(this.selectProList);
					};
					status=false;
				};				
			}else{
				if(status==true){                  //取消选中
					for(var j=0;j<this.selectProList.length;j++){
						if(this.selectProList[j].id==id){
	//						alert('数组id:'+this.selectProList[j].id);
							this.totalPrice-=price*num;
							this.totalNum-=num;
							
							var index=this.selectProList.indexOf(this.selectProList[j]);
							this.selectProList.splice(index,1);	
							break; 
						}
					};
					status=false;
				}else if(status==false){             //选中
					this.totalPrice=0;this.totalNum=0;
					this.selectProList.push({id:id,price:price,num:num});
					if(this.selectProList.length>0){
						for(var i=0;i<this.selectProList.length;i++){
							this.totalPrice+=this.selectProList[i].price*this.selectProList[i].num;
							this.totalNum+=this.selectProList[i].num;
							
						};
	//					console.log(this.selectProList);
					};
					status=true;
				};				
			}


		},			

		//减少数量(选中时联动，未选中时)
		decCount:function(item){ 
			if(item.status==true){      //选中状态（联动，总价变动）
				if(item.num<=1){         //展现
					item.num=1
				}else{
					item.num--;
					for(var j=0;j<this.selectProList.length;j++){		 //计算			
						if(this.selectProList[j].id==item.id){
							this.totalNum--;
							this.totalPrice=(item.price*this.totalNum).toFixed(2);
//							this.totalPrice-=item.price;							
							this.selectProList[j].num--;                 //要给后台的
							break; 
						}
					};					
				};
			}else{                 //未选中状态
				if(item.num<=1){
					item.num=1
				}else{
					item.num--;
				}
			}
		},
		//增加数量
		inceCount:function(item){
			if(item.status==true){        //选中状态
				item.num++;
				for(var k=0;k<this.selectProList.length;k++){		 //计算	
					if(this.selectProList[k].id==item.id){
						this.totalNum++;
//						this.totalPrice+=item.price;              //有莫名其妙的问题
						this.totalPrice=(item.price*this.totalNum).toFixed(2);
						this.selectProList[k].num++; 
						break; 
					}
				}	
			}else{
				item.num++;
			}
		},
		//删除当前行选中/未选中(totalNum/totalPrice变，selectProList变);
		delPro:function(evt,index,status,id,price,num){
			var evt1=evt; 
			var _this=this;
	       var btnArray = ['取消', '确认'];
	        mui.confirm('确定要删除该商品吗？', '温馨提示', btnArray, function(e) {
	            if (e.index == 1){
					_this.$http({method:'POST',url:URL+'/person/Car/delete_car',data:{uid:localStorage.uid,ids:id}}).then(
						function(response){
							if(response.data.success==true){
								if(status==true){           //选中状态
									_this.totalNum-=num;
									_this.totalPrice-=num*price;
									for(var m=0;m<_this.selectProList.length;m++){
										if(_this.selectProList[m].id==id){
											var index=_this.selectProList.indexOf(_this.selectProList[m]);
											_this.selectProList.splice(index,1);	
											break; 						
										}
									};	
								};
		//						mui.swipeoutClose(evt1.currentTarget.parentNode.parentNode);
								evt1.target.parentNode.parentNode.remove();
		//						this.carList.splice(index1,1);
							}else{
								mui.toast('删除失败,请重试！');
							}
						}
					);				
	            } else {} 
	        });			
	
		},
		
		//清空购物车
		emptyPro:function(){
			var _this=this;
	       	var btnArray = ['取消', '确认'];
	        mui.confirm('您真的要清空购物车吗？', '温馨提示', btnArray, function(e) {
	            if (e.index == 1){
					_this.$http({method:'POST',url:URL+'/person/Car/delete_all',data:{uid:localStorage.uid}}).then(
						function(response){
							if(response.data.success==true){
								_this.carList='';
								_this.totalPrice=0;_this.totalNum=0;
								_this.selectProList=[];						
							}
						}
					);						
	            } else {} 
	        });				

		},
		//提交订单
		subOrder:function(){
			if(this.selectProList.length<=0){
				mui.toast('请先选择商品！');
			}else{
				mui('.mnhright').button('loading');
				var ids=[],num=[];
//				console.log(this.selectProList);
				for(var i=0;i<this.selectProList.length;i++){
					ids.push(this.selectProList[i].id);
					num.push(this.selectProList[i].num);
				};
//				console.log(ids);  console.log(num);
				var car_ids=ids.join(','),car_num=num.join(',');
//				alert('car_ids:'+car_ids+','+'car_num'+car_num);
				this.$http({method:'POST',url:URL+'/person/Car/submit_order',data:{car_ids:car_ids,num:car_num,uid:localStorage.uid}}).then(
					function(response){
						if(response.data.success==true){	
//							console.log(response.data.data);
							store.set('orderId',response.data.data.order_num);               //购物车订单
							store.set('orderType',response.data.data.type); 
							jump('mnhcarOrder.html');
							setTimeout(function(){mui('.mnhright').button('reset');},2000);
						}
					},function(response){mui.toast('提交失败,请检查网络！');mui('.mnhright').button('reset');}
				);
			}
		}		
	},
	ready:function(){
		//滚动框初始化
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005,
			indicators:false
		});
		loads();     				
		this.$http({method:'POST',url:URL+'/person/Car/get_car',data:{uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.carList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					setTimeout(function(){loadh()},1000);
				}else{                                        //购物车为空
					setTimeout(function(){loadh()},1000);
				}
			}
		);
		mui.init({
			pullRefresh: {
				container: '#car-refresh',
				down: {
					style:'circle',
					color:'#ff6797',
					height:'-100px',
					range:'0px',
					offset:'-100px',
					callback: this.pulldownRefresh
				},
				up: {
					auto:false,
					contentrefresh: '正在加载...',
					callback: this.pullupRefresh
				}
			}
		});		
		
	}
});

