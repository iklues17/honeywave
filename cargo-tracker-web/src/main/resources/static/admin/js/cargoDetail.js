adminPage.CargoDetail = (function() {

	var bookingDetail = {};
	var cargoDetail = {};
	
	var getBookingDetail = function(bookingId){
	
		comm.callApi({
			url: comm.server.url+"/booking/bookings/"+bookingId,
			method: "GET",
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				bookingDetail = data;
				bookingDetailView.init();
			},
			complete : function(text, xhr){
			}
		});
		console.log("chage ds = " + bookingDetail);
	};
	
	var bookingDetailView = {
		_bookingDetail: {},
		
		ID: {
			entry: "#tblCargoDetail",
			BTN_CHANGE: "#btnChange",
			BTN_ACCEPT: "#btnAccept"
		},
		
		init: function(){
			_bookingDetail = bookingDetail;
			var that = this;
			this.controlViewDiv();
			this.showCargo();
			$(this.ID.BTN_CHANGE).on("click", function(e){
				window.location.hash = window.location.hash+'/change-destination';
			});
			$(this.ID.BTN_ACCEPT).on("click", function(e){
				that.accetpBooking(bookingDetail.bookingId);
			});
		},
		
		accetpBooking: function(bookingId){
			comm.callApi({
				url: comm.server.url+"/booking/bookings/"+bookingId+"/accept",
				method: "POST",
				dataType: "text",
				contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					comm.goToMainPage();
				},
				error:function( jqXHR,  textStatus,  errorThrown){
					comm.openModalForErrorMsg(textStatus, "Contact us");
					console.log(textStatus);
				},
				complete : function(text, xhr){
				}
			});
		},
		
		controlViewDiv: function(){
			
			$('[aria-cargo-routed]').attr('aria-cargo-routed', false);
			$('[aria-cargo-misrouted]').attr('aria-cargo-misrouted', false);
			$('[aria-cargo-not-routed]').attr('aria-cargo-not-routed', false);
		},
		
		showCargo: function(){
			var _this = this;
			var bookingDetail = _bookingDetail;
			
			// entry
			$(this.ID.entry).before('<span class="success label">Details for cargo '+bookingDetail.trackingId+'</span>');
			$(this.ID.entry).append('<tbody>'
				+ '<tr>'
				+  '<td>Origin</td>'
				+  '<td>'+bookingDetail.origin+'</td>'
				+ '</tr>'
				+ '<tr>'
				+  '<td>Destination</td>'
				+  '<td>'+bookingDetail.finalDestination+'</td>'
				+ '</tr>'
//				+ '<tr>'
//				+  '<td></td>'
//	            +  '<td><a href="'+window.location.hash+'/change-destination">Change destination</a></td>'
//				+ '</tr>'
				+ '<tr>'
				+ '<tr>'
				+  '<td>Arrival deadline</td>'
				+  '<td>'+bookingDetail.arrivalDeadline+'</td>'
				+ '</tr>'
				+ '<tr>'
				+  '<td colspan="2">'
				+   '<div id="btnBottom" class="row entry-row">'
				+    '<ul class="button-group radius">'
// 				Not Accepted 상태에서 관리자의 change destination 불필요			
// 				+     '<li><div id="btnChange" role="button" class="button small" style="margin-bottom:0px;" tabindex="0" data-mode="view">Change Destination</div></li>'
				+     '<li><div id="btnAccept" role="button" class="button small" style="margin-bottom:0px;">Accept Booking</div></li>'
				+    '</ul>'
				+   '</div>'
				+  '</td>'
				+ '</tr>'
				+'</tbody>');
		}
	};
	
	var getCargoDetail = function(trackingId){
	
		comm.callApi({
			url: comm.server.url + "/tracker/cargos/"+trackingId,
			method: "GET",
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				cargoDetail = data;
				cargoDetailView.init();
			},
			complete : function(text, xhr){
			}
		});
		console.log("chage ds = " + cargoDetail);
	};
	
	var cargoDetailView = {
		_cargoDetail: {},
		
		ID: {
			entry: "#tblCargoDetail",
			divRouted: "#divRouted",
			divMisrouted: "#divMisrouted",
			divNotRouted: "#divNotRouted"
		},
		
		init: function(){
			_cargoDetail = cargoDetail;
			this.controlViewDiv();
			this.showCargo();
		},
		
		controlViewDiv: function(){
			
			var isRouted = _cargoDetail.routed;
			$('[aria-cargo-routed]').attr('aria-cargo-routed', isRouted);
			$('[aria-cargo-misrouted]').attr('aria-cargo-misrouted', _cargoDetail.misrouted);
			$('[aria-cargo-not-routed]').attr('aria-cargo-not-routed', (isRouted == false));
		},
		
		showCargo: function(){
			var _this = this;
			var cargoDetail = _cargoDetail;
			
			// entry
			$(this.ID.entry).before('<span class="success label">Details for cargo '+cargoDetail.trackingId+'</span>');
			$(this.ID.entry).append('<tbody>'
				+ '<tr>'
				+  '<td>Origin</td>'
				+  '<td>'+cargoDetail.origin+'</td>'
				+ '</tr>'
				+ '<tr>'
				+  '<td>Destination</td>'
				+  '<td>'+cargoDetail.finalDestination+'</td>'
				+ '</tr>'
//				+ '<tr>'
//				+  '<td></td>'
//	            +  '<td><a href="'+window.location.hash+'/change-destination">Change destination</a></td>'
//				+ '</tr>'
				+ '<tr>'
				+  '<td>Arrival deadline</td>'
				+  '<td>'+cargoDetail.arrivalDeadline+'</td>'
				+ '</tr>'
				+'</tbody>');
			
			$(this.ID.divRouted).append('<table border="1">'
				+'<thead>'
				+ '<tr>'
				+  '<th>Voyage number</th>'
				+  '<th>Load Location</th>'
				+  '<th class="show-for-medium-up">Time</th>'
				+  '<th>Unload Location</th>'
				+  '<th class="show-for-medium-up">Time</th>'
				+ '</tr>'
				+'</thead>'
				+'<tbody></tbody></table>');
			
			// itinerary
			var target = $(this.ID.divRouted + '> table > tbody');
			$.each(cargoDetail.legs, function(i){
				target.append('<tr>'
					+ '<td>'+this.voyageNumber+'</td>'
					+ '<td>'+this.from+'</td>'
					+ '<td class="show-for-medium-up">'+this.loadTime+'</td>'
					+ '<td>'+this.to+'</td>'
					+ '<td class="show-for-medium-up">'+this.unloadTime+'</td>'
					+'</tr>');
			});
			
			// mis routed
			$(this.ID.divMisrouted).find('a').attr('href', window.location.hash+'/select-itinerary');
			// not routed
			$(this.ID.divNotRouted).find('a').attr('href', window.location.hash+'/select-itinerary');
		}
	};
	
	
	return {
		initPage: function(status, id){
			if(!comm.initPage()){
				return;
			}
			
			template.RenderOne({
				target: "#body",
				tagName: "div",
				className: "about",
				id: "bodyAbout",
				position: "new",
				template: comm.getHtml("admin/cargo-detail.html"),
				data: undefined,
				events: {
				},
				
				afterRender: function() {
					if(status === "not-accepted"){
						getBookingDetail(id);
					}else{
						getCargoDetail(id);
					}
				} 
			});
		}
	};
})();