		
page.Dashboard = (function(){
	
	var ENV = {
		bookedCargosGridId: "#divBookedCargos",
		bookingDetailGridId: "#divBookingDetail"
	};
	
	var bookedCargos = [];
	
	var getMyBookings = {
		init : function(){
			var userId = comm.I.id;
			comm.callApi({
				url: comm.server.url + "/booking/bookings/of/"+userId,
				method: "GET",
				dataType: "json",
				contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					bookedCargos = data;
				},
				error: function(jqXHR, textStatus, errorThrown ){
				},
				complete : function(text, xhr){
				}
			});
		}
	};
	
	var bookedCargosView = {
		
		init: function(){
			getMyBookings.init();
			if(bookedCargos.length > 0){
				page.SubBookedCargos.initSection(bookedCargos);
			}else{
				comm.openModalForInformMsg("You don't have booked cargos. Moving to booking page");
				window.location.hash = "#booking";
			}
		}
	};
	
	return {
		initPage : function(){

			if(!comm.initPage()){
		    	return;
		    }
	
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "dashboard",
		        id: "bodyDashboard",
		        position: "new",
		        template: comm.getHtml("portal/dashboard.html"),
		        data: {},
		        events: {
		        },
	
		        afterRender: function(Dashboard) { 
		        	bookedCargosView.init();
		        }
		    });
		   
		},
		
		getMyBookings: getMyBookings,
		
		initDetailPage: function(bookingId){
			//Dashboard에 종속된 화면이므로 대쉬보드 화면이 떠잇는지 확인 후 없으면 로딩
			if($(ENV.bookedCargosGridId).length === 0){
				page.Dashboard.initPage();
			}
			page.SubBookingDetail.initSection(bookingId);
		}
	};
})();