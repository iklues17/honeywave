
page.Login = (function(){
	
	var ENV = {
		FORM_ID : "#formLogin"
	};
	
	var login = function(){
		
		var formdata = {
			password: $(ENV.FORM_ID).find("[name=password]").val()
		}
		formdata.password = sha256_digest(formdata.password);
		
		var loginName = $(ENV.FORM_ID).find("[name=login]").val();
		formdata.loginName = loginName;
		
		comm.UserCredentials(loginName, formdata.password);
		
	}
	
	return {
		initPage : function(){
			if(comm.isLogedin === true){
				if(comm.isAdmin){
					window.location.hash = "#admin/dashboard";
				}else{
					window.location.hash = "#dashboard";
				}
				return;
			}
			
			if(!comm.initPage()){
		    	return;
		    }
		
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "log-in",
		        id: "bodyLogIn",
		        position: "new",
		        template: comm.getHtml("login.html"),
		        data: undefined,
		        events: {
		            "click #btnCreateAccount": function() {
		    			window.location.hash = "#signup";
		            },
		            "click #btnLogIn": function(){
		            	login();
		            }
		        }
		    });
		}
	};
})();