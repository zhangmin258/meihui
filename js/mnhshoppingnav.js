



//	var classId=store.get('classId');  alert(classId);

Vue.http.options.emulateJSON = true;
var shopnavVm=new Vue({
	el:'#shopnavBody',
	data:{
		classId:'', 
		shopnavList:'',   //三级分类列表
		totalPage:'',
		pageNumber:1,
		cateName:''      //菜单名称
	},
	methods:{
		//下拉刷新具体业务实现
		pulldownRefresh:function(){
			mui('#shopnav-refresh').pullRefresh().endPulldown();
		},
		pullupRefresh:function(){
			this.pageNumber++;
			if(this.pageNumber>this.totalPage){
				setTimeout(function() {mui('#shopnav-refresh').pullRefresh().endPullup(true);}, 1000);
			}else{
				mui('#shopnav-refresh').pullRefresh().endPullup(false); 
				this.$http({method:'POST',url:URL+'/shopping/Goods/goods_list',data:{cpp_id:this.classId,page:this.pageNumber,type:'cate'}}).then(
					function(response){
						if(response.data.success==true){
							for(var i=0;i<response.data.data.length;i++){
								this.shopnavList.push(response.data.data[i]);
							}
						}
					}
				);				
			}
		}
	},
	ready:function(){
		loads();
		this.classId=store.get('classId');
		this.$http({method:'POST',url:URL+'/shopping/Goods/goods_list',data:{cpp_id:this.classId,type:'cate'}}).then(
			function(response){
				if(response.data.success==true){
//					console.log(response.data);
					this.shopnavList=response.data.data;
					this.totalPage=response.data.page.totalPage;
					this.cateName=response.data.page.cate_name;
					setTimeout(function(){loadh();},1000);
				}else{
					this.shopnavList='';
					loadh();
				}
			}
		);
		mui.init({
			pullRefresh: {
				container: '#shopnav-refresh',
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