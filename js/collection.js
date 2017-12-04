



Vue.http.options.emulateJSON = true;
var collectVm=new Vue({
	el:'#collectBody',
	data:{
		collectList:'',
		totalPage:'',
		pageNumber:1
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#collect-refresh').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				$('.mui-pull-top-tips').show();
				setTimeout(function() {mui('#collect-refresh').pullRefresh().endPullup(true);}, 1000);
			}else{
				mui('#collect-refresh').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/person/user/member_collection',data:{page:this.pageNumber,uid:localStorage.uid}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.collectList.push(response.data.data[i]);
							}
						}
					}
				)	
			}
		}
	},
	ready:function(){
		loads();
		this.$http({method:'POST',url:URL+'/person/user/get_collection',data:{uid:localStorage.uid}}).then(
			function(response){
				if(response.data.success==true){
					this.collectList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					setTimeout(function(){loadh();},1000);
				}else{
					this.collectList='';
					setTimeout(function(){loadh();},1000);
				}
			}
		);
		mui.init({
			pullRefresh: {
				container: '#collect-refresh',
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
})













