


mui('.money-content').on('tap','a',function(evt){
	evt.preventDefault();
	var address=$(this).attr('href');
	jump(address);
})






//我的钱包
function walletDetail(){
	$.ajax({
		type:"POST",
		url:URL+"/person/user/get_user",
		async:true,
		dataType:'json',
		data:{uid:localStorage.uid},
		success:function(data){
			if(data.success==true){
//				console.log(data);
	//			if(data.data.wx_logo==''){};
				$('.photo img').attr('src',data.data.app_logo);
				$('.photo span').html(data.data.balance);
			}
		}
	});	
}


walletDetail();

//刷新我的钱包
window.addEventListener('wallet-refresh',function(){
	walletDetail();
});









