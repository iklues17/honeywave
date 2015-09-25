adminPage.SelectItinerary = (function() {

	var bookingDetail = {};
	var cargoDetail = {};
	var routeCandidates = {};
	
	var getBookingDetail = function(bookingId){
	
		comm.callApi({
			url: comm.server.url + "/booking/bookings/"+bookingId,
			method: "GET",
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				bookingDetail = data;
			},
			complete : function(text, xhr){
			}
		});
	};
	
	var getCargoDetail = function(trackingId){
		
		comm.callApi({
			url: "http://localhost:9999/tracker/cargos/"+trackingId,
			method: "GET",
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				cargoDetail = data;
				getRouteCandidates(trackingId);
			},
			complete : function(text, xhr){
			}
		});
	};
		
	var getRouteCandidates = function(trackingId){
		comm.callApi({
			url: "http://localhost:9999/tracker/cargos/candidates",
			method: "GET",
			dataType: "JSON",
			data: {trackingId:trackingId},
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				routeCandidates = data;
				routeCandidatesView.init();
			},
			complete : function(text, xhr){
			}
		});
	};
	
	var routeCandidatesView = {
		_cargoDetail: {},
		
		ID: {
			GRID_CURRENT_ROUTE: "#selectedRoute",
			DIV_NO_CANDIDATES: "#divNoRouteCandidates",
			DIV_CANDIDATES: "#divRouteCandidates"
		},
		
		init: function(){
			this.controlViewDiv();
			this.makeView();
		},
		
		controlViewDiv: function(){
			var isEmpty = false;
			
			if(routeCandidates === undefined || routeCandidates.length <= 0){
				isEmpty = true;
			}
			
			$('[aria-route-candidates-empty]').attr('aria-route-candidates-empty', isEmpty);
			$('[aria-route-candidates]').attr('aria-route-candidates', !isEmpty);
		},
		
		makeView: function(){
			_this = this;
			var cargo = cargoDetail;
			
			// Current Route
			$(this.ID.GRID_CURRENT_ROUTE).append(''
				+'<table>'
				+ '<tr>'
				+  '<td>Cargo '+cargo.trackingId+' is going from '+cargo.origin+' to '+cargo.finalDestination+'</td>'
				+ '</tr>'
				+'</table>');
			
			var target = $(this.ID.DIV_CANDIDATES);
			$.each(routeCandidates, function(i){
				target.append('<form id="frmAssignRoute'+i+'">'
					+ '<span class="success label">Route candidate '+ (i+1) +'</span>'
					+  '<table>'
					+   '<thead>'
					+    '<tr>'
					+     '<td>Voyage</td>'
					+     '<td>From</td>'
					+     '<td></td>'
					+     '<td>To</td>'
					+     '<td></td>'
					+    '</tr>'
					+   '</thead>'
					+   '<tbody id="contentsItinerary'+i+'">'
					+   '</tbody>'
					+   '<tfoot>'
					+    '<tr>'
					+     '<td colspan="3">'
					+      '<p style="margin-bottom:0px">'
					+       '<input type="submit" id="btnAssignRoute'+i+'" class="button small" value="Assign cargo to this route" style="margin-bottom:0px"/>'
//action="#{itinerarySelection.assignItinerary(itineraryStatus.index)}"
					+      '</p>'
					+     '</td>'
					+    '</tr>'
					+   '</tfoot>'
					+  '</table>'
					+'</form>');
				$("#frmAssignRoute"+i).submit(function(e){
					e.preventDefault();
					_this.doAssignRoute(i);
				});
				
				var legsTarget = $("#contentsItinerary"+i);
				$.each(this.legs, function(i){
					legsTarget.append('<tr>'
							+ '<td>'+this.voyageNumber+'</td>'
							+ '<td>'+this.from+'</td>'
							+ '<td>'+this.loadTime+'</td>'
							+ '<td>'+this.to+'</td>'
							+ '<td>'+this.unloadTime+'</td>'
							+'</tr>');
				});
			});
		},
		
		doAssignRoute: function(index){
			var _cargoDetail = cargoDetail;
			var data = routeCandidates[index].legs;
			
			comm.callApi({
				url: comm.server.url+"/tracker/cargos/"+_cargoDetail.trackingId+"/itinerary-assign-to",
				method: "POST",
				dataType: "text",
				data:JSON.stringify(data),
				traditional: true,
				contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					console.log(data);
					window.location.href = "#detail/routed/" + _cargoDetail.trackingId;
				},
				error:function( jqXHR,  textStatus,  errorThrown){
					console.log(textStatus);
				},
				complete : function(text, xhr){
				}
			});
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
		        template: comm.getHtml("admin/select-itinerary.html"),
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
	
