



//	var classId=store.get('classId');  alert(classId);


Vue.http.options.emulateJSON = true;
var shopnavVm=new Vue({
	el:'#shopslistBody',
	data:{
		ssname:'', 
		shopsearchList:'',   //商品搜索列表
		totalPage:'',
		pageNumber:1
	},
	methods:{
		//下拉刷新具体业务实现
		pulldownRefresh:function(){
			mui('#shopsearchList-refresh').pullRefresh().endPulldown();
		},
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#shopsearchList-refresh').pullRefresh().endPullup(true);}, 1000);
			}else{
				mui('#shopsearchList-refresh').pullRefresh().endPullup(false); 
				this.$http({method:'POST',url:URL+'/shopping/Goods/goods_search',data:{key_word:this.ssname,page:this.pageNumber}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.shopsearchList.push(response.data.data[i]);
							}
						}
					}
				);				
			}
		}
	},
	ready:function(){
		loads();
		this.ssname=store.get('shopsearchcontent');  //alert(this.ssname);
		this.$http({method:'POST',url:URL+'/shopping/Goods/goods_search',data:{uid:localStorage.uid,key_word:this.ssname}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.shopsearchList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					setTimeout(function(){loadh();},1000);
				}else{
					this.shopsearchList='';
					setTimeout(function(){loadh();},1000);
				}
			}
		);
		mui.init({
			pullRefresh: {
				container: '#shopsearchList-refresh',
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





