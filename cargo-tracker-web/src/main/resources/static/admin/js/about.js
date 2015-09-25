
adminPage.About = (function () {
	return {
		initPage : function(){
		    if(!comm.initPage()){
		    	return;
		    }
		    
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "about",
		        id: "bodyAbout",
		        position: "new",
		        template: comm.getHtml("admin/about.html"),
		        data: undefined,
		        events: {
		            "click .about": function () {
		                alert("about!");
		            }
		        }
		    });
		}
	}
})();