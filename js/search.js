




Vue.http.options.emulateJSON = true;	
var searchVm=new Vue({
	el:'#searchBody',
	computed:{},
	data:{
		nearSearchList:'',
		hotSearchList:'',
		searchcontent:''
	},
	methods:{
		//提交搜索结果
		subSearch:function(){
			if($.trim(this.searchcontent)==''){
				mui.toast('请输入搜索名称')
			}else{
				$('input').blur();
				store.set('searchcontent',this.searchcontent);
				jump('mhserchlist.html');
			}
		},
		//最近访问、热门访问
		otherSearch:function(result){
			store.set('searchcontent',result);
			jump('mhserchlist.html');			
		}
	},
	ready:function(){
		mui.plusReady(function(){plus.nativeUI.showWaiting()});
		this.$http({method:'POST',url:URL+'/party/Search/index',data:{uid:localStorage.uid}}).then(
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






