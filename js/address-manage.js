

//滚动框初始化
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005,
	indicators:false
});



//is_default：1 默认 / 0 普通
Vue.filter('default',function(string){
	if(string==1){
		return '默认';
	}
});

Vue.http.options.emulateJSON = true;
var addressListVm=new Vue({
	el:'#addManageBOdy',
	data:{
		addManageList:'',
		addId:''        //当前radio的值
	},
	methods:{
		//获取地址列表数据
		getAddressList:function(){
			loads();
			this.$http({method:'GET',url:URL+'/person/Address/get_address',data:{uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
//						console.log(response.data);
						this.addManageList=response.data.data;
						loadh();
					}
				}
			);			
		},		
		//删除地址
		delAdd:function(evt,id){
			this.$http({method:'POST',url:URL+'/person/Address/delete_address',data:{a_id:id,uid:localStorage.uid}}).then(
				function(response){
					if(response.data.success==true){
//						console.log(evt.target);
						evt.target.parentNode.parentNode.remove();
					}else{mui.toast('删除失败！')}	;
				},
				function(response){
					mui.toast('删除失败,请检查网络！');
				}
			);
		},
		//编辑地址
		editAdd:function(id,evt){
			jump('edit-address.html');
			mui.swipeoutClose(evt.target.parentNode.parentNode);
			store.set('addressId',id);
		},
		//添加地址
		addAdd:function(){
			jump('add-address.html');
		}
	},
	ready:function(){
		//获取地址列表数据
		this.getAddressList();
		//地址编辑/增加成功后刷新地址列表
		window.addEventListener('addressList-refresh',function(){
			this.getAddressList();
		}.bind(this));
	}
})




