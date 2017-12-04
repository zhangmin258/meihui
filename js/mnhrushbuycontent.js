
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'rushbuy-refresh');
			return true;
		}
	});
});


Vue.http.options.emulateJSON = true;
var shopcontentVm=new Vue({
	el:'#rushbuyContentBody',
	data:{
		proId:'',          //商品id
		limitId:'',        //限时抢购id
		imgList:'',      //商品图片
		attrList:'',     //商品属性
		priceList:'',     //商品价格
		proData:'',
		
		attrArr:[],       //存放属性分类名称 [9,10,11](数组元素只能是数字)；
		
		idArr:[],         //存放属性id集合 (数组元素只能是数字)
		idArrsort:[],
		attrId:'',         //属性组合id
		
		collect:'',         //商品收藏状态 false未收藏，true收藏
		menType:'非会员',     //让注册会员确认框只提醒一次 
		
		firstProImg:'',      //轮播图
		proImgList:'',
		lastProImg:'',
		
		normalQuestion:'',   //常见问题
		introduction:'',     //详情简介
		
		commentList:'',       //评价列表
		ctotalPage:'',
		cpageNumber:1
	},
	methods:{
		//点击商品属性按钮
		getId:function(evt,id,cId){
						//颜色 atr_id:9 ，尺寸：10，布料：11 (第一个是9吗？是依次递增的吗)
						//id:属性分类对应的属性id
			var index=this.attrArr.indexOf(cId);this.idArr[index]=id;   //弄清楚每个属性名称是属于哪个分类的，每个分类只取一个属性名称！

			$(evt.target).addClass('mnhcolor');$(evt.target).siblings().removeClass('mnhcolor');
			
			//根据属性计算价格
			var flag=true;
			if(this.idArr.length==this.attrArr.length){  //idArr是一个空数组 ，第一次操作就使this.idArr[3]=69，那么数组前两个元素为null，但length为3
				for(var j=0;j<this.idArr.length;j++){
					if(this.idArr[j]==null){             //一旦有一个为null,就跳出循环
						flag=false;
						break;
					}
				};
				if(flag==true){
					this.idArrsort= this.idArr.sort(function(a,b){return a-b});					
//					console.log(this.idArrsort);
				};				
				for(var i=0;i<this.priceList.length;i++){    //ids排序
					this.priceList[i].ids.sort(function(a,b){return a-b});
					if(this.priceList[i].ids.toString()==this.idArrsort.toString()){   //一旦匹配立马跳出
						this.proData.price=this.priceList[i].price;
						this.proData.time_price=this.priceList[i].time_price;
						this.attrId=this.priceList[i].id;      // 与idArrsort对应的商品属性组合id
						break;
					};					
				}
			}else{}
			
		},
		//buyProSub();用于buyPro函数
		buyProSub:function(){
			var flag1=false;
			if(this.idArr.length==this.attrArr.length){
				for(var i=0;i<this.idArr.length;i++){    //空数组循环报错！
					if(this.idArr[i]==null ){
						mui.toast('商品属性未选择完整！');
						flag1=false;
						break;
					}else{
						flag1=true;
					}
				}
			}else{
				mui.toast('商品属性未选择完整！');
			};
			

			if(flag1==true){
				mui('.mnhshoppng_buy').button('loading');
				this.$http({method:'POST',url:URL+'/person/Order/sumbit_order',data:{g_id:this.proId,a_id:this.attrId,uid:localStorage.uid,num:1,limit_id:this.limitId}}).then(
					function(response){
						if(response.data.success==true){
							//跳转订单页(立即付款);
//								console.log(response.data);
							store.set('orderId',response.data.data.order_id);
							store.set('orderType',response.data.data.type);             // 1.普通商品
							jump('../mnhcar/mnhcarOrder.html');
							setTimeout(function(){mui('.mnhshoppng_buy').button('reset');},2000);
						}else{
							mui.toast(response.data.msg);                             //库存已满
							mui('.mnhshoppng_buy').button('reset');
						}
					},
					function(response){
						mui.toast('订单提交失败，请检查网络！');
						mui('.mnhshoppng_buy').button('reset');
					}
				);				
			}			
		},
		//立即购买(选择商品数量按钮没做，商品数量暂时为1)
		buyPro:function(){
			if(localStorage.uid=='' || localStorage.uid==undefined || localStorage.uid==null){  //是否登录
		       	var btnArray = ['取消', '确认'];
		        mui.confirm('你还没有登录哦！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('../land/login.html');		
		            } else {} 
		        });				
			}else if(localStorage.type==0&&this.menType=='非会员' || localStorage.type==''&&this.menType=='非会员' || localStorage.type==undefined&&this.menType=='非会员' || localStorage.type==null&&this.menType=='非会员'){   //是否为会员
		       	var btnArray = ['暂不考虑', '实名认证'];
		        mui.confirm('认证会员后，享受更多优惠！', '确认框', btnArray, function(e) {
		            if (e.index == 1){
						jump('../myown/attestation.html');
		            } else {
		            	this.buyProSub();
		            	this.menType='会员';
		            }
		        }.bind(this));				
			}else{
				this.buyProSub();	
			}
		},
		//加载更多评论
		loadMore:function(){
			this.cpageNumber++;
			if(this.cpageNumber>this.ctotalPage){
				return;
			}else{
				this.$http({method:'POST',url:URL+'/shopping/Goods/goods_comment',data:{g_id:this.proId,page:this.cpageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.commentList.push(response.data.data[i]);
							}
						}
					}
				);
			}
		}
	},
	ready:function(){
		loads();  
		this.proId=store.get('dataId'); //alert(this.proId);
		this.limitId=store.get('limitId'); //alert(this.limitId);
		this.$http({method:'POST',url:URL+'/shopping/Goods/get_detail',data:{g_id:this.proId,uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.proData=response.data.data;
					this.imgList=response.data.data.img;
					this.attrList=response.data.data.attribute; 
					this.priceList=response.data.data.attribute_price;
					this.collect=response.data.data.is_collection;          //商品收藏状态 false未收藏，true收藏					
					//存放属性分类id						
					for(var i=0;i<response.data.data.attribute.length;i++){
						this.attrArr.push(response.data.data.attribute[i].atr_id);
					};
					//轮播图
					this.firstProImg=response.data.data.img[0];
					this.proImgList=response.data.data.img;
					var last=response.data.data.img.length-1;
					this.lastProImg=response.data.data.img[last];
					
					//常见问题
					this.normalQuestion=response.data.data.introduction;
					$('#normalQuestion').append(this.normalQuestion);
					
					//详情简介
					this.introduction=response.data.data.detail;
					$('#introduction').append(this.introduction);
					setTimeout(function(){loadh()},1000);
					
				};
			}
		);
		//评价列表
		this.$http({method:'POST',url:URL+'/shopping/Goods/goods_comment',data:{g_id:this.proId}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.commentList=response.data.data;
					this.ctotalPage=response.data.page.totalPage;
				}
			}
		);
		
		//登录后重新刷新收藏状态
		window.addEventListener('status',function(){
			this.$http({method:'POST',url:URL+'/shopping/Goods/get_detail',data:{g_id:this.proId,uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
						this.collect=response.data.data.is_collection;          //商品收藏状态
					}
				}
			);	
		}.bind(this));
	}
});







