"use strict";
		
page.SubBookedCargos = (function () {
	
	var ENV = {
		targetId: "#divBookedCargos",
		tagName: "div",
		className: "booked-cargos",
		id: "gridBookedCargos",
		html: "portal/sub-booked-cargos.html"
	};
	
    var gridView = {
    	
    	init: function(data){

            $("tbody>tr").on('mouseover', function(e){
            	$(e.currentTarget).addClass('recode-active');
            });
		    $("tbody>tr").on('mouseout', function(e){
		    	$(e.currentTarget).removeClass('recode-active');
		    });
		    $("tbody>tr").on('click', function(e){
		    	$(e.currentTarget).parent().find('.recode-selected').removeClass('recode-selected');
		    	$(e.currentTarget).addClass('recode-selected');
		    	window.location.hash="detail/"+$(e.currentTarget).attr('id');
		    });
    	},
    	
    	getGridFormat: function(bookedCargos){

    		var grid = {
				tableheaders : [
	                {display:'Booking ID',		hidden:false, width: '13%'},
	                {display:'Origin',			hidden:false, width: '18%'},
	                {display:'Destination',		hidden:false, width: '18%'},
	                {display:'Deadline',		hidden:false, width: '15%'},
	                {display:'Commodity',		hidden:false, width: '15%'},
	                {display:'Q.T',				hidden:false, width: '8%'},
	                {display:'Booking Status',	hidden:false, width: '10%'}
                ],
                tabledatas: bookedCargos,
                link: "*.html"
    		};
    		return grid;
    	}
    };
    
	return {
		initSection: function(bookedCargos){
		    template.RenderOne({
		        target: ENV.targetId,
		        tagName: ENV.tagName,
		        className: ENV.className,
		        id: ENV.id,
		        position: "new",
		        template: comm.getHtml(ENV.html),
		        data: gridView.getGridFormat(bookedCargos),
		        events: {
		        },
		        afterRender: function(Dashboard) { 
		        	gridView.init();
		        }
		    });
		}
	}
})()