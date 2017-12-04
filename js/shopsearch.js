




Vue.http.options.emulateJSON = true;	
var searchVm=new Vue({
	el:'#shopsearchBody',
	computed:{},
	data:{
		nearSearchList:'',
		hotSearchList:'',
		shopsearchcontent:''
	},
	methods:{
		//提交搜索结果
		shopsubSearch:function(){
			if($.trim(this.shopsearchcontent)==''){
				mui.toast('请输入搜索名称')
			}else{
				$('input').blur();
				store.set('shopsearchcontent',this.shopsearchcontent);
				jump('mnhshopsearchlist.html');
			}
		},
		//最近访问、热门访问
		shopotherSearch:function(result){
			store.set('shopsearchcontent',result);
			jump('mnhshopsearchlist.html');			
		}
	},
	ready:function(){
		mui.plusReady(function(){plus.nativeUI.showWaiting()});
		this.$http({method:'POST',url:URL+'/shopping/Goods/search_index',data:{uid:localStorage.uid}}).then(
			function(response){
//				console.log(response.data);
				if(response.data.success==true){
					this.nearSearchList=response.data.data.recent;
					this.hotSearchList=response.data.data.hot;
					mui.plusReady(function(){plus.nativeUI.closeWaiting()});
				}
			}
		);
		
	}
})






