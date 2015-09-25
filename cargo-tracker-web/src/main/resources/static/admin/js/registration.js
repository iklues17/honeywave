adminPage.Registration = (function() {
	
	var formView = {
			
		ID: {
			FORM: "#frmRegistration",
			SEL_ORIGIN: "#selLocOrigin",
			SEL_DESTIN: "#selLocDestination",
			BTN_SUBMIT: "#btnBooking"
		},
		
		init: function(){
			_this = this;
		
			$(this.ID.FORM).submit(function(e){
				e.preventDefault();
				_this.doRegister(comm.queryStringToJson($(this).serialize()));
			});
			
			comm.appendSelectLocations($(this.ID.SEL_ORIGIN));
			comm.appendSelectLocations($(this.ID.SEL_DESTIN));
			
		},
		
		doRegister : function(data){
			comm.callApi({
				url: comm.server.url+"/booking//bookings/accepted-request",
				method: "POST",
				data: JSON.stringify(data),
				dataType: "text",
				contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					window.location.href = "#detail/not-routed/"+data;
				},
				error: function(jqXHR, textStatus, errorThrown){
					console.log(jqXHR);
				},
				complete : function(text, xhr){
					
				}
			});
		}
	};
	
	return {
		initPage: function(){
			if(!comm.initPage()){
				return;
			}
			
			template.RenderOne({
				target: "#body",
				tagName: "div",
				className: "about",
				id: "bodyAbout",
				position: "new",
				template: comm.getHtml("admin/registration.html"),
				data: undefined,
				events: {
				},
				
				afterRender: function(Dashboard) { 
					formView.init();
				} 
			});
		}
	};
})();