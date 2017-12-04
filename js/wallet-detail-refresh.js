


Vue.filter('tiemFormate',function(time){
	var day=new Date(time*1000);
	return day.getFullYear()+'-'+parseInt(day.getMonth()+1)+'-'+day.getDate()+'  '+day.getHours()+':'+day.getMinutes(); 
});


Vue.http.options.emulateJSON = true;
var walletDetailVm=new Vue({
	el:'#walletBody',
	data:{
		detailList:'',
		pageNumber:1,
		totalPage:''
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#wallet-refreshContainer').pullRefresh().endPulldownToRefresh(true);
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function(){mui('#wallet-refreshContainer').pullRefresh().endPullupToRefresh(true);},1000)
			}else{
				mui('#wallet-refreshContainer').pullRefresh().endPullupToRefresh(false);
				this.$http({method:'POST',url:URL+'/person/user/member_detail',data:{uid:localStorage.uid,page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
							 this.detailList.push(response.data.data[i]);								
							}
						}
					}
				)
			}	
		}
	},
	ready:function(){
		this.$http({method:'POST',url:URL+'/person/user/member_detail',data:{uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
						this.detailList=response.data.data;
						this.totalPage=response.data.page.totalPage;
				}
			}
		);
		//下拉刷新
		mui.init({
		  pullRefresh : {
		    container:"#wallet-refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		    down : {
		      height:50,//可选,默认50.触发下拉刷新拖动距离,
		      auto: false,//可选,默认false.true时首次加载自动下拉刷新一次
		      contentdown : "下拉可以刷新",
		      contentover : "释放立即刷新",
		      contentrefresh : "正在刷新...",
		      callback :this.pulldownRefresh 
		    },
		    up : {
		      height:50,
		      auto:false,
		      contentrefresh : "正在加载...",
		      contentnomore:'没有更多数据了',
		      callback :this.pullupRefresh
		    }    
		  }
		});		
		
		
	}
})



















