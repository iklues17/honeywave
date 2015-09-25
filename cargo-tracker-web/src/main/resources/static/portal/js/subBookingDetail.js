page.SubBookingDetail = (function () {
	
	var ENV = {
		targetId: "#divBookingDetail",
		tagName: "div",
		className: "booking-detail",
		id: "sectionBookingDetail",
		html: "portal/sub-booking-detail.html"
	};
	
	return {
		initSection: function(bookingId){

			if(!comm.initPage()){
		    	return;
		    }
			
			var datas;
			comm.callApi({
				url: comm.server.url + "/booking/bookings/"+bookingId,
				method: "GET",
				dataType: "json",
				contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					datas = data;
				},
				complete : function(text, xhr){
				}
			});
			
		    datas.entryForm = [
		        {value: datas.bookingId, viewonly: true, displayName: "Booking ID", name:"bookingId"},
		        {value: datas.origin, viewonly: true, displayName: "Origin", name:"origin"},
		        {value: datas.destination, viewonly: true, displayName: "Destination", name:"destination"},
		        {value: datas.status, viewonly: true, displayName: "Booking Status", name:"status"},
		        {value: datas.trackingId, viewonly: true, displayName: "Tracking ID", name:"trackingId"}
			];
		    
		    template.RenderOne({
		        target: ENV.targetId,
		        tagName: ENV.tagName,
		        className: ENV.className,
		        id: ENV.id,
		        position: "new",
		        template: comm.getHtml(ENV.html),
		        data: datas,
		        events: {
		            "mouseover tbody>tr": function (e) {
		            	$(e.currentTarget).addClass('recode-active');
		            },
				    "mouseout tbody>tr": function (e) {
				    	$(e.currentTarget).removeClass('recode-active');
				    },
				    "click tbody>tr": function (e) {
				    	$(e.currentTarget).parent().find('.recode-selected').removeClass('recode-selected');
				    	$(e.currentTarget).addClass('recode-selected');
				    }
		        }
		    });
		}
	}
})();