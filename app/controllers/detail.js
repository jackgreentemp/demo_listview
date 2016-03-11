var args = arguments[0] || {};

function init() {
	Ti.API.info("args = ", args.data.toJSON());
	$.data_id.text = "id=" + args.data.toJSON().id;
	$.testDate.text = args.data.toJSON().testDate;
	$.image.image = args.data.toJSON().image;
}

function closeWindow(){
	$.win.close();
}

function edit() {
	var model = args.data;//获取model
	var obj = model.toJSON();//model转为object
	obj.image = 'http://image.tianjimedia.com/uploadImages/2013/105/414UWER6711T.jpg';//修改image地址
	$.image.image = obj.image;//更新UI
	model.set(obj).save();//更新model并保存，自动刷新list.js的UI
}

//销毁，避免内存溢出
$.win.addEventListener("close", function(){
    $.destroy();
});

init();
