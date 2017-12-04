



Vue.http.options.emulateJSON = true;
var shopVm=new Vue({
	el:'#lineShopBody',
	data:{
		shopList:'',
		pageNumber:1
	},
	methods:{
		//线下店详情
		goShopDetail:function(id){
			store.set('shopId',id);
			jump("mnhshopintroduction.html");
		},
		//下拉刷新
		pulldownRefresh:function(){
			mui('#lineShop-contet').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#lineShop-contet').pullRefresh().endPullup(true);}, 1000);	
			}else{
				mui('#lineShop-contet').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/shopping/meigou_store/store_list',data:{page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data;i++){
								this.shopList.push(response.data.data[i]);
							}
						}
					}
				)	
			}
		}
	},
	ready:function(){
		this.$http({method:'GET',url:URL+'/shopping/meigou_store/store_list'}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.shopList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					mui.init({
						pullRefresh: {
							container: '#lineShop-contet',
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
			}
		)
	}
})
