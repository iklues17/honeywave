adminPage.Dashboard = (function(){
	
	var bookingList = [];
	var trackingList = [];
	
	var ENV = {
		NOT_ACCEPTED_GRID: "#gridNotAccepted",
		ROUTED_GRID: "#gridRouted",
		CLAIMED_GRID: "#gridClaimed",
		NOT_ROUTED_GRID: "#gridNotRouted"
	}
	
	var getBookings = function(){
		comm.callApi({
			url: comm.server.url + "/booking/bookings/not-accepted",
			method: "GET",
			//data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				bookingList = data;
				notAcceptedBookingView.init();
			},
			complete : function(text, xhr){
			}
		});
	};
	
	var getTrackings = function(){
		comm.callApi({
			url: comm.server.url + "/tracker/cargos",
			method: "GET",
			//data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				trackingList = data;
				routedView.init();
				claimedView.init();
				notRoutedView.init();
			},
			complete : function(text, xhr){
			}
		});
	};
	
	var notAcceptedBookingView = {
		
		init: function(){
			var _this = this;
			this.makeGrid();

            $(ENV.NOT_ACCEPTED_GRID+" tbody>tr").on('mouseover', function(e){
            	$(e.currentTarget).addClass('recode-active');
            });
		    $(ENV.NOT_ACCEPTED_GRID+" tbody>tr").on('mouseout', function(e){
		    	$(e.currentTarget).removeClass('recode-active');
		    });
		    $(ENV.NOT_ACCEPTED_GRID+" tbody>tr").on('click', function(e){
		    	$(e.currentTarget).parent().find('.recode-selected').removeClass('recode-selected');
		    	$(e.currentTarget).addClass('recode-selected');
		    	window.location.hash="#admin/detail/not-accepted/"+$(e.currentTarget).attr('id');
		    });
		},
		
		makeGrid: function(){
			var _this = this;
			var target = $(ENV.NOT_ACCEPTED_GRID);
			target.append('<table id="listNotAcceptedTab">'
					+'<thead>'
					+ '<tr>'
					+  '<th width="140">Booking ID</th>'
					+  '<th width="220">Origin</th>'
					+  '<th width="200">Destination</th>'
					+  '<th width="200" class="hide-for-small">Deadline</th>'
//					+  '<th width="200" class="hide-for-small">User ID</th>'
					+  '<th width="240" class="hide-for-small">Commodity</th>'
					+  '<th width="240" class="hide-for-small">Q.T</th>'
					+ '</tr>'
					+'</thead>'
				    +'<tbody>'
					+'</tbody>'
					+'</table>');
			$.each(bookingList, function(i){
				target.find('tbody').append('<tr id="'+this.bookingId+'">'
						+  '<td>'+this.bookingId+'</td>'
						+  '<td>'+this.origin+'</td>'
						+  '<td>'+this.destination+'</td>'
						+  '<td class="hide-for-small">'+this.arrivalDeadline+'</td>'
//						+  '<td class="hide-for-small">'+this.userId+'</td>'
						+  '<td class="hide-for-small">'+this.commodity+'</td>'
						+  '<td class="hide-for-small">'+this.quantity+'</td>'
						+ '</tr>');
			});
		}
	};
	
	var routedView = {
		
		routedList: [],
		
		init: function(){
			var _this = this;
			_this.routedList = [];
			$.each(trackingList, function(i){
				if(this.routed == true ){
					_this.routedList.push(this);
				}
			});
			this.makeGrid();

            $(ENV.ROUTED_GRID+" tbody>tr").on('mouseover', function(e){
            	$(e.currentTarget).addClass('recode-active');
            });
		    $(ENV.ROUTED_GRID+" tbody>tr").on('mouseout', function(e){
		    	$(e.currentTarget).removeClass('recode-active');
		    });
		    $(ENV.ROUTED_GRID+" tbody>tr").on('click', function(e){
		    	$(e.currentTarget).parent().find('.recode-selected').removeClass('recode-selected');
		    	$(e.currentTarget).addClass('recode-selected');
		    	window.location.hash="#admin/detail/routed/"+$(e.currentTarget).attr('id');
		    });
		},
		
		makeGrid: function(){
			var _this = this;
			var target = $(ENV.ROUTED_GRID);
			target.append('<table id="listRoutedTab">'
					+'<thead>'
					+ '<tr>'
					+  '<th width="140">Tracking ID</th>'
					+  '<th width="220">Origin</th>'
					+  '<th width="200">Destination</th>'
					+  '<th width="200" class="hide-for-small">Last Known Location</th>'
					+  '<th width="200" class="hide-for-small">Transport Status</th>'
					+  '<th width="240" class="hide-for-small">Deadline</th>'
					+ '</tr>'
					+'</thead>'
				    +'<tbody>'
					+'</tbody>'
					+'</table>');
			$.each(this.routedList, function(i){
				target.find('tbody').append('<tr id="'+this.trackingId+'">'
						+  '<td>'+this.trackingId+'</td>'
						+  '<td>'+this.origin+'</td>'
						+  '<td>'+this.finalDestination+'</td>'
						+  '<td class="hide-for-small">'+this.lastKnownLocation+'</td>'
						+  '<td class="hide-for-small">'+this.transportStatus+'</td>'
						+  '<td class="hide-for-small">'+this.arrivalDeadline+'</td>'
						+ '</tr>');
			});
		}
	};
	
	var claimedView = {
		
		claimedList: [],
		
		init: function(){
			_this = this;
			_this.claimedList = [];
			$.each(trackingList, function(i){
				if(this.claimed == true){
					_this.claimedList.push(this);
				}
			});
			
			this.makeGrid();

            $(ENV.CLAIMED_GRID+" tbody>tr").on('mouseover', function(e){
            	$(e.currentTarget).addClass('recode-active');
            });
		    $(ENV.CLAIMED_GRID+" tbody>tr").on('mouseout', function(e){
		    	$(e.currentTarget).removeClass('recode-active');
		    });
		    $(ENV.CLAIMED_GRID+" tbody>tr").on('click', function(e){
		    	$(e.currentTarget).parent().find('.recode-selected').removeClass('recode-selected');
		    	$(e.currentTarget).addClass('recode-selected');
		    	window.location.hash="#admin/detail/claimed/"+$(e.currentTarget).attr('id');
		    });
		},
		
		makeGrid: function(){
			var _this = this;
			var target = $(ENV.CLAIMED_GRID);
			target.append('<table style="width:100%;">'
					+'<thead>'
					+ '<tr>'
					+  '<th>Tracking ID</th>'
					+  '<th>Origin</th>'
					+  '<th>Destination</th>'
					+ '</tr>'
					+'</thead>'
					+'<tbody>'
					+'</tbody>'
					+'</table>');
			$.each(this.claimedList, function(i){
				target.find('tbody').append('<tr id="'+this.trackingId+'">'
						+  '<td>'+this.trackingId+'</td>'
						+  '<td>'+this.origin+'</td>'
						+  '<td>'+this.finalDestination+'</td>'
						+ '</tr>');
			});
		}
	};
	
	var notRoutedView = {
		
		notRoutedList: [],
		
		init: function(){
			_this = this;
			_this.notRoutedList = [];
			$.each(trackingList, function(i){
				if(this.routed == false){
					_this.notRoutedList.push(this);
				}
			});
			this.makeGrid();

            $(ENV.NOT_ROUTED_GRID+" tbody>tr").on('mouseover', function(e){
            	$(e.currentTarget).addClass('recode-active');
            });
		    $(ENV.NOT_ROUTED_GRID+" tbody>tr").on('mouseout', function(e){
		    	$(e.currentTarget).removeClass('recode-active');
		    });
		    $(ENV.NOT_ROUTED_GRID+" tbody>tr").on('click', function(e){
		    	$(e.currentTarget).parent().find('.recode-selected').removeClass('recode-selected');
		    	$(e.currentTarget).addClass('recode-selected');
		    	window.location.hash="#admin/detail/not-routed/"+$(e.currentTarget).attr('id');
		    });
		},
		
		makeGrid: function(){
			var _this = this;
			var target = $(ENV.NOT_ROUTED_GRID);
			target.append('<table style="width:100%;">'
					+'<thead>'
					+' <tr>'
					+'  <th>Tracking ID</th>'
					+'  <th>Origin</th>'
					+'  <th>Destination</th>'
					+' </tr>'
					+'</thead>'
					+'<tbody>'
					+'</tbody>'
					+'</table>');
			$.each(this.notRoutedList, function(i){
				target.find('tbody').append('<tr id="'+this.trackingId+'">'
						+  '<td>'+this.trackingId+'</td>'
						+  '<td>'+this.origin+'</td>'
						+  '<td>'+this.finalDestination+'</td>'
						+ '</tr>');
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
		        className: "dashboard",
		        id: "bodyDashboard",
		        position: "new",
		        template: comm.getHtml("admin/dashboard.html"),
		        data: {},
		        events: {
		            "click .dashboard": function () {
		                alert("dashboard!");
		            }
		        },
	
		        afterRender: function(Dashboard) {
		        	getTrackings();
		        	getBookings();
		        } 
		    });
		}
	};
	
})();