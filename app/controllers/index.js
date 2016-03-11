/**
 * Global Navigation Handler
 */
Alloy.Globals.Navigator = {
	
	open: function(controller, payload){
		var win = Alloy.createController(controller, payload || {}).getView();
		
		if(OS_IOS){
			$.nav.openWindow(win);
		}
		else if(OS_MOBILEWEB){
			$.nav.open(win);
		}
		else {
			
			// added this property to the payload to know if the window is a child
			if (payload.displayHomeAsUp){
				
				win.addEventListener('open',function(evt){
					var activity=win.activity;
					activity.actionBar.displayHomeAsUp=payload.displayHomeAsUp;
					activity.actionBar.onHomeIconItemSelected=function(){
						evt.source.close();
					};
				});
			}
			win.open();
		}
	}
};

function doClick(e) {
   Alloy.Globals.Navigator.open("detail", {displayHomeAsUp:true});
}

if(OS_ANDROID) {
	$.index.getView().open();
} else {
	$.nav.open();
}
