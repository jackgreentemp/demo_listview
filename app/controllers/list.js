var collection = Alloy.Collections.myCollection;
var moment = require('alloy/moment');
var table = collection.config.adapter.collection_name;
Ti.API.info("table=", table);
var uid = 1;//不知道为什么不能是string格式，否则ios query时会出问题

//listview滑动到底部，查询数据，更新listview
function onMarkerEvent(e) {
	var oldLength = _.size(collection);
	Ti.API.info("oldLength = ", oldLength);
	collection.fetch({query: {statement: 'SELECT * from ' + table + ' where uid = ?' + ' ORDER BY testDate DESC limit 0, ' + (oldLength+10), params: [uid]}});
	var newLength = _.size(collection);
	Ti.API.info("newLength = ", newLength);
	
	if(newLength == oldLength){//sql中无新数据了
		addDatasToCollection();//TODO 使用网络请求获取新参数
	}
	
	//更新marker索引，如果是网络请求中的，需要在网络请求callback中更新marker索引
	$.list.setMarker({
		sectionIndex:0,
		itemIndex:$.list.sections[0].items.length - 1
	});
}

//整理template中的参数
function doTransform(model){
	var obj = model.toJSON();
	obj.testDate = "id=" + obj.id + ", " + obj.testDate;
	return obj;
}

//为Collection新增数据
function addDatasToCollection(){
	var i;
	for(i=1;i<=10;i++){
		var obj = {
			uid: 1,
		    testDate: ''+moment().format('YYYY-MM-DD HH:mm:ss'),
		    image: 'http://www.photography-match.com/views/images/gallery/Uluru_Kata_Tjuta_National_Park_Australia.jpg',
		};
		
		var model = Alloy.createModel('myCollection', obj);
		
		collection.add(model);
		
		model.save();
	}
}

//初始化
function init(){
	//查询数据
	collection.fetch({query: { statement: 'SELECT * from ' + table + ' where uid = ?' + ' ORDER BY testDate DESC limit 0,10', params: [uid]}});
	
	//如果数据库无数据，新增一些数据
	if(_.size(collection) === 0){
		addDatasToCollection();
	}
	
	//更新marker索引
    $.list.setMarker({
		sectionIndex:0,
		itemIndex:$.list.sections[0].items.length - 1
	});
}

//先open window，再执行初始化
$.win.addEventListener("open", function(){
    init();
});

//销毁，避免内存溢出
$.win.addEventListener("close", function(){
    $.destroy();
});

//下拉刷新执行的函数
function myRefresher(e) {
	init();
	e.hide();
}

/*
 * listView 点击监听 
 */
$.list.addEventListener('itemclick', function(e){
	
	//取消 listView点击后选中状态
    var item = e.section.getItemAt(e.itemIndex);
    e.section.updateItemAt(e.itemIndex, item);
    
	var dataid = e.section.items[e.itemIndex].dataid.text;//根据item索引查找dataid

	var data = collection.get(dataid);//根据dataid获取数据模型
		
	// Ti.API.info("item data =", data);
	
	Alloy.Globals.Navigator.open("detail", {displayHomeAsUp:true, $model: data});//$model是Alloy中controller初始化时会加载的model
		
});
