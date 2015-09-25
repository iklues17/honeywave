adminPage.Track = (function() {
	var tracks = {};
	
	var ENV = {
		FORM_ID: "#trackingForm",
		INPUT_TRACKING_ID : "#inputTrackingId",
		BTN_TRACK : "#btnTracking"
	};
	
	var formView = {
		
		init: function(trackingId){
			_this = this;
		
			this.focus();
			$(ENV.INPUT_TRACKING_ID).on('keydown', function(e){
				if(e.keyCode == 13) {
					_this.getTrack();
				}
			});
			
			$(ENV.BTN_TRACK).on('click', function(e){
				_this.getTrack();
			});
			
			if(trackingId){
				$(ENV.INPUT_TRACKING_ID).val(trackingId);
				$(ENV.BTN_TRACK).trigger('click');
			}
		},
		
		focus: function(){
			$(ENV.INPUT_TRACKING_ID).trigger('focus');
		},
		
		getTrack: function(){
			var trackingId = $(ENV.INPUT_TRACKING_ID).val();
			if(comm.isDefined(trackingId) && trackingId !== ""){
				trackingView.getTrackingById();
			}else{
				comm.openModalForInformMsg("Please Input the Tracking id");
			}
		}	
	
	};
	
	var trackingView = {
		
		ID: {
			FORM: "#trackingForm",
			VIEW_PANEL: "#result",
			TRACKING_ID: "#spanTrackingId",
			STATUS: "#spanStatus",
			DESTINATION: "#spanDestination",
			ETA: "#spanEta",
			NEXT_ACT: "#pNextAct",
			HISTORY: "#ulHandlingEvents"
		},
		
		init: function(){
			$(this.ID.VIEW_PANEL).hide();
		},
		
		getTrackingById: function(trackingId){
			comm.callApi({
				url: comm.server.url+"/tracker/cargos/"+trackingId+"/tracks",
				method: "GET",
				dataType: "json",
				contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					//console.log(data);
					tracks.cargo = data;
					tracks.events = data.handlingEventViewDto;
					trackingView.showTracking(tracks);
				},
				error: function(jqXHR, textStatus, errorThrown){
		        	console.log("error : " + textStatus + ", " + errorThrown);
		        }
			});
		},
		
		clear: function(){
			$(this.ID.VIEW_PANEL).hide();
		},
		
		showTracking: function(tracking){
			
			if(tracking !== undefined){
				$(this.ID.VIEW_PANEL).show();
			}
			
			$(this.ID.TRACKING_ID).text(tracking.cargo.trackingId);
			$(this.ID.STATUS).text(tracking.cargo.statusText);
			$(this.ID.DESTINATION).text(tracking.cargo.destination);
			$(this.ID.ETA).text(tracking.cargo.eta);
			$(this.ID.NEXT_ACT).text(tracking.cargo.nextExpectedActivity);

			$("[aria-cargo-misdirected]").attr('aria-cargo-misdirected', tracking.cargo.misdirected);

			if(tracking.events !== undefined && tracking.events.length > 0){
				$("[aria-cargo-events-empty='false']").attr('aria-cargo-events-empty', true);
				this.showHandlingHistory(tracking.events);
			}
		},
		
		showHandlingHistory: function(handlingHistory){
			this.removeHandlingHistory();
			
			var rootUl = this.ID.HISTORY;
			$.each(handlingHistory, function(event){
				$(rootUl).append('<li><p><img style="vertical-align: top;" src="/images/'+ (this.expected ? 'tick' : 'cross')+'.png" alt="" /><span style="padding-left:5px;">' + this.description+'</span></p></li>')
			})
		},
		
		removeHandlingHistory: function(){
			$(this.ID.HISTORY).children().remove();
		}
		
		
	};
	
	return {
		initPage: function(trackingId){
			
		    if(!comm.initPage()){
		    	return;
		    }
		    
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "admin-track",
		        id: "bodyAdminTrack",
		        position: "new",
		        template: comm.getHtml("admin/track.html"),
		        data: undefined,
		        events: {
		        },
	
		        afterRender: function() { 
					trackingView.init();
					formView.init(trackingId);
		        } 
		    });
		}
	};
})();