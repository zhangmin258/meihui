

//支付完成后从参团详情页-参团列表
mui.plusReady(function() {
	mui.init({
		beforeback: function(){
			var page=plus.webview.currentWebview().opener();  //上一个打开的页面
			mui.fire(page,'groupsRefresh');
			return true;
		}
	});
});



Vue.filter('timeFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'-'+parseInt(day.getMonth()+1)+'-'+day.getDate()+' '+day.getHours()+':'+day.getMinutes();  
});

//参团完成，更新当前页面/上一页面参团人数
Vue.http.options.emulateJSON = true;
var joinGroupVm=new Vue({
	el:'#joinGroupBody',
	data:{
		goodsId:'',        //商品id
		zuData:'',
		proImg:'',        //商品图片
		zuMemberList:'',    //组员
		
		otherGroupProList:'', //团购其他商品列表
		pageNumber:1,
		totalPage:''
	},
	methods:{
		//其余团购商品下拉刷新
		pulldownRefresh:function(){
			mui('#joinGroup-refresh').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#joinGroup-refresh').pullRefresh().endPullup(true);}, 1000);	
			}else{
				mui('#joinGroup-refresh').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/shopping/Group/other_group',data:{page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.otherGroupProList.push(response.data.data[i]);
							}
						}
					}
				);
			}
		},
		//点击参团，获取订单id跳转订单详情页（不支付不算开团成功！）
		subGroup:function(){
			mui('.mnhcontentbutton').button('loading');
			this.$http({method:'POST',url:URL+'/person/Order/sumbit_order',data:{group_id:this.groupId,group_sn:this.groupsn,goods_id:this.goodsId,uid:localStorage.uid,num:1}}).then(
				function(response){
					if(response.data.success==true){
//						console.log(response.data.data);						
						//跳转订单页(立即付款);
						store.set('orderType',response.data.data.type);  //type:3 团购订单
						store.set('orderId',response.data.data.order_id);    
						jump('../mnhcar/mnhcarOrder.html');
						setTimeout(function(){mui('.mnhcontentbutton').button('reset')});
					}else{
						mui.toast(response.data.msg);
					}
				},
				function(response){
					mui.toast('参团失败，请检查网络！');
					mui('.mnhcontentbutton').button('reset');
				}
			);			
		},
		//获取参团详情数据
		getGroupContent:function(){
			this.$http({method:'POST',url:URL+'/shopping/Group/go_group',data:{group_sn:this.groupsn}}).then(
				function(response){
					if(response.data.success==true){
	//					console.log(response.data);	
						this.goodsId=response.data.data.goods_id
						this.zuData=response.data.data;
						this.zuMemberList=response.data.data.list;
						this.proImg=response.data.data.img[0];
						setTimeout(function(){loadh();},1000); 
					}else{
						this.zuData=='';
						this.zuMemberList='';
						this.zuMemberList='';
						setTimeout(function(){loadh();},1000); 
					}
				}
			);			
		}
		
	},
	ready:function(){
		loads();
		this.groupId=store.get('groupId');
		this.groupsn=store.get('groupsn'); 
		this.getGroupContent();
		//其他参团商品
		this.$http({method:'GET',url:URL+'/shopping/Group/other_group'}).then(
			function(response){
				if(response.data.success==true){					
					this.otherGroupProList=response.data.data;
					this.totalPage=response.data.page.totalPage;
//					console.log(response.data);
				}
			}
		);
		mui.init({
			pullRefresh: {
				container: '#joinGroup-refresh',
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
		//支付完成后刷新参团详情人数，禁止我要参团(后台判断)
		window.addEventListener('groupsRefresh',function(){
			mui.back();
		}.bind(this));		
	}
});






