
page.Signup = (function(){
	
	var ENV = {
		FORM_ID : "#formSignUp",
		
		FORM_UNAME: "[name=loginName]",
		FORM_EMAIL: "[name=emailAddress]",
		FORM_PWD: "[name=password]",
		FORM_F_NAME: "[name=firstName]",
		FORM_L_NAME: "[name=lastName]",
		FORM_COMPANY: "[name=company]",
		FORM_NO1: "[name=international]",
		FORM_NO2: "[name=mobilePrefix]",
		FORM_NO3: "[name=nSN1]",
		FORM_NO4: "[name=nSN2]"
	}
	
	var formView = {
		init: function(){
			comm.appendSelectCompanies($(ENV.FORM_COMPANY));
		}
	}
	
	var signup = function(){
		
		var formdata = {
			loginName: $(ENV.FORM_ID).find(ENV.FORM_UNAME).val(),
			emailAddress: $(ENV.FORM_ID).find(ENV.FORM_EMAIL).val(),
			password: $(ENV.FORM_ID).find(ENV.FORM_PWD).val(),
			firstName: $(ENV.FORM_ID).find(ENV.FORM_F_NAME).val(),
			lastName: $(ENV.FORM_ID).find(ENV.FORM_L_NAME).val(),
			company: {
				id: $(ENV.SEL_COMPANY + " option:selected").val(),
				name: $(ENV.SEL_COMPANY + " option:selected").text()
			},
			mobilePhoneNo: $(ENV.FORM_ID).find(ENV.FORM_NO1).val() + $(ENV.FORM_ID).find(ENV.FORM_NO2).val() + $(ENV.FORM_ID).find(ENV.FORM_NO3).val() + $(ENV.FORM_ID).find(ENV.FORM_NO4).val()
		};
		
		formdata.password = sha256_digest(formdata.password);
		
		$.ajax({
			url: comm.server.url+"/user/sign-up",
			method: "POST",
			data: JSON.stringify(formdata),
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				window.location.hash = "#login";
			},
			beforeSend: function(xhr, settings){
				if(comm.localStorage.get('ClientToken') === null){
					if(!comm.ClientCredentials(comm.AUTH.CLIENT_ID, comm.AUTH.CLIENT_SECRET)){
						return false;
					}
				}
				xhr.setRequestHeader("Authorization", "Bearer " + comm.localStorage.get('ClientToken'));
				return true; 
			},
			error:function( jqXHR,  textStatus,  errorThrown){
				if(jqXHR.status !== 401 || jqXHR.status !== 409){
					comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
				}
			},
			statusCode: {
				401: function(jqXHR,  textStatus,  errorThrown){
					var errorObj = JSON.parse(jqXHR.responseText);
					comm.openModalForErrorMsg("You don't have Client Authrization", errorObj.error_description);
				},
				409: function(jqXHR,  textStatus,  errorThrown){
					comm.openModalForErrorMsg("This Account is already used", "Please use another username and email");
				}
			},
			complete : function(text, xhr){
			}
		});
		
	};
	
	return {
		initPage : function(){
			if(!comm.initPage()){
		    	return;
		    }
		
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "sign-up",
		        id: "bodySignUp",
		        position: "new",
		        template: comm.getHtml("signup.html"),
		        data: undefined,
		        events: {
		            "click #btnSignUp": function() {
		            	signup();
		            },
				    "click #btnBack": function() {
						window.location.hash = "#login";
				    }
		        },
	
		        afterRender: function(Dashboard) { 
		        	formView.init();
		        }
		    });
		}
	};
})();
