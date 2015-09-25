"use strict";

page.MenuTop = (function () {

	var init = function(){

		var datas = {
			isAdmin: comm.isAdmin,
			isLogedin: comm.isLogedin,
			emailAddress: comm.I.emailAddress,
			firstName: comm.I.firstName,
			lastName: comm.I.lastName
		};
		
	    template.RenderOne({
	        target: ".top-bar",
	        tagName: "div",
	        className: "menu-top",
	        id: "menuTop",
	        position: "new",
	        template: comm.getHtml("menu-top.html"),
	        data: datas,
	        reload: true,
	        events: {
	        }
	    });
	};
	
	return {
		init: init
	};
})();