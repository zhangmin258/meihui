
			


Vue.http.options.emulateJSON = true;	
var groupsVm=new Vue({
	el:'#groupsBody',
	data:{
		firstGroups:'',   //轮播图
		groupList:'',
		lastGroups:'',
		
		allHotGroup:'',        //热门拼团
		hotBoxList:'',         //热门拼团轮播框
		firstBoxList:'',
		lastBoxList:'',
		
		newGroupList:'',       //最新开团
		totalPage:'',
		pageNumber:1
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#groups-refresh').pullRefresh().endPulldown();
		},
		//最新拼团上拉加载
		pullupRefresh:function(){
			this.pageNumber++; 
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#groups-refresh').pullRefresh().endPullup(true);}, 1500);
			}else{
				mui('#groups-refresh').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/shopping/Group/group_last',data:{page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.newGroupList.push(response.data.data[i]);
							};
						}
					}
				)
			}	
						
		}
	},
	ready:function(){
		//轮播图数据
		this.$http({method:'GET',url:URL+'/shopping/Group/banners'}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					var last=response.data.data.length-1;
					this.firstGroups=response.data.data[0];
					this.groupList=response.data.data;
					this.lastGroups=response.data.data[last];
				}
			}
		);
		//热门拼团(三个商品一组)
		this.$http({method:'GET',url:URL+'/shopping/Group/hot_group'}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data.data);
					this.allHotGroup=response.data.data;
					var boxList=[];
					for(var i=0; i<this.allHotGroup.length;i+=3){
						boxList.push({HotGroupList:this.allHotGroup.slice(i,i+3)});
					};
					var last=boxList.length-1;
					this.firstBoxList=boxList[0];
					this.hotBoxList=boxList;
					this.lastBoxList=boxList[last];
//					console.log(this.lastBoxList);	
//					console.log(this.hotBoxList);
					
				}
			}
		);
		//最新拼团(同一商品，同一账号可以多次开团，开一次团就创建一个开团组号，但同一商品，同一账号只能参团一次)；
		this.$http({method:'GET',url:URL+'/shopping/Group/group_last'}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.newGroupList=response.data.data;
					this.totalPage=response.data.page.totalPage;
				}
			}
		);
		
		mui.init({
			pullRefresh: {
				container: '#groups-refresh',
				down: {
					style:'circle',
					color:'#ff6797',
					height:'-100px',
					range:'0px',
					offset:'-100px',
					callback:this.pulldownRefresh
				},
				up: {
					auto:false,
					contentrefresh: '正在加载...',
					callback:this.pullupRefresh
				}
			}
		});
		
	}
});


	
	

