
page.Logout = (function(){
	
	var logout = function(){
		comm.logout();
	}
	
	return {
		initPage : function(){
			if(!comm.initPage()){
		    	return;
		    }
		
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "logout",
		        id: "bodyLogOut",
		        position: "new",
		        template: comm.getHtml("logout.html"),
		        data: undefined,
		        events: {
		            "click #btnLogOut": function(){
		            	logout();
		            }
		        }
		    });
		}
	};
})();