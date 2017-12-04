
mui('.mui-content').on('tap','a',function(evt){
	evt.preventDefault();
	var address=$(this).attr('href');
	jump(address);
});
