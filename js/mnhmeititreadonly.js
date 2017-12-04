

Vue.http.options.emulateJSON = true;
var meitVm=new Vue({
	el:'#titreadBody',
	computed:{
		
	},
	data:{
		compid:'',
		compList:'',  //竞赛列表
		pageNumber:1,
		totalPage:'',
		compTitle:''
		
	},
	methods:{
		//下拉刷新
		pulldownRefresh:function(){
			mui('#meititro-content').pullRefresh().endPulldown();
		},
		//上拉加载
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				$('.mui-pull-top-tips').show();
				setTimeout(function() {mui('#meititro-content').pullRefresh().endPullup(true);}, 1500);//参数为true代表没有更多数据了。
			}else{
				mui('#meititro-content').pullRefresh().endPullup(false);
				this.$http({method:'POST',url:URL+'/party/Match/match_join_list',data:{match_id:this.compid,page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.compList.push(response.data.data[i]);
							}
						}
					}
				)
			}			
		}
	},
	ready:function(){
		loads();
		this.compid=store.get('mnhCompe');  //alert(this.compid);
		//获取竞赛列表
		this.$http({method:'POST',url:URL+'/party/Match/match_join_list',data:{match_id:this.compid}}).then(
			function(response){
//				console.log(response.data);
				this.compTitle=response.data.page.subject;
				if(response.data.success==true){
					this.compList=response.data.data;
					this.totalPage=response.data.page.totalPage;
				};
				setTimeout(function(){loadh()},2000);
			}
			
		);
//		加载刷新
		mui.init({
			pullRefresh: {
				container: '#meititro-content',
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
})









