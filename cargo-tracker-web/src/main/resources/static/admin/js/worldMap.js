
adminPage.WorldMap = (function () {
	var locationName = new Array();

	locationName["CNHKG"] = "Hong Kong";
	locationName["AUMEL"] = "Melbourne";
	locationName["SESTO"] = "Stockholm";
	locationName["FIHEL"] = "Helsinki";
	locationName["USCHI"] = "Chicago";
	locationName["JNTKO"] = "Tokyo";
	locationName["DEHAM"] = "Hamburg";
	locationName["CNSHA"] = "Shanghai";
	locationName["NLRTM"] = "Rotterdam";
	locationName["SEGOT"] = "Guttenburg";
	locationName["CNHGH"] = "Hangzhou";
	locationName["USNYC"] = "New York";
	locationName["USDAL"] = "Dallas";

	var routingStatusName = new Array();
	routingStatusName["NOT_ROUTED"] = "Not routed";
	routingStatusName["ROUTED"] = "Routed";
	routingStatusName["MISROUTED"] = "Misrouted";

	var transportStatusName = new Array();
    transportStatusName["NOT_RECEIVED"] = "Not received";
    transportStatusName["IN_PORT"] = " In port";
    transportStatusName["ONBOARD_CARRIER"] = "Onboard carrier";
    transportStatusName["CLAIMED"] = "Claimed";
    transportStatusName["UNKNOWN"] = "Unknown";

    // TODO See if there is a service to get the latitude/longitude
    // data from.
    var latitude = new Array();

    latitude["CNHKG"] = 22;
    latitude["AUMEL"] = -38;
    latitude["SESTO"] = 59;
    latitude["FIHEL"] = 60;
    latitude["USCHI"] = 42;
    latitude["JNTKO"] = 36;
    latitude["DEHAM"] = 54;
    latitude["CNSHA"] = 31;
    latitude["NLRTM"] = 52;
    latitude["SEGOT"] = 58;
    latitude["CNHGH"] = 30;
    latitude["USNYC"] = 41;
    latitude["USDAL"] = 33;

    var longitude = new Array();
    longitude["CNHKG"] = 114;
    longitude["AUMEL"] = 145;
    longitude["SESTO"] = 18;
    longitude["FIHEL"] = 25;
    longitude["USCHI"] = -88;
    longitude["JNTKO"] = 140;
    longitude["DEHAM"] = 10;
    longitude["CNSHA"] = 121;
    longitude["NLRTM"] = 5;
    longitude["SEGOT"] = 12;
    longitude["CNHGH"] = 120;
    longitude["USNYC"] = -74;
    longitude["USDAL"] = -97;

    var colorCodes = new Array();

    colorCodes["NOT_ROUTED"] = "gray";
    colorCodes["MISROUTED"] = "red";
    colorCodes["NOT_RECEIVED"] = "white";
    colorCodes["IN_PORT"] = "green";
    colorCodes["ONBOARD_CARRIER"] = "green";
    colorCodes["MISDIRECTED"] = "red";
    colorCodes["AT_DESTINATION"] = "black";
    colorCodes["CLAIMED"] = "black";
    colorCodes["UNKNOWN"] = "red";
    
	var getCargos = function(){
		comm.callApi({
			url: comm.server.url + "/tracker/cargo",
			method: "GET",
			dataType: "json",
			contentType: "application/json",
			success: function(data, textStatus, jqXHR){
				showMap(data);
			},
			error:function( jqXHR,  textStatus,  errorThrown){
				console.log(textStatus);
			},
			complete : function(text, xhr){
			}
		});
	};
	
	var showMap = function(data){

		var coordinates = new Array();

		for (var i in data) {
            cargo = data[i];
            var locationCode = (cargo.transportStatus == 'NOT_RECEIVED') ? cargo.origin : cargo.lastKnownLocation;
            var statusCode = 'NOT_RECEIVED';
            if ((cargo.routingStatus == 'NOT_ROUTED') || (cargo.routingStatus == 'MISROUTED')) {
                statusCode = cargo.routingStatus;
            } else if (cargo.misdirected == true) {
                statusCode = 'MISDIRECTED';
            } else if (cargo.atDestination == true) {
                statusCode = 'AT_DESTINATION';
            } else {
                statusCode = cargo.transportStatus;
            }

            coordinates.push(
                    {latLng: [latitude[locationCode] + (Math.floor((Math.random() * 3) - 3)),
                            longitude[locationCode] + (Math.floor((Math.random() * 3) - 3))],
                        name: cargo.trackingId,
                        style: {fill: colorCodes[statusCode]}});
        }

        $('#world-map').vectorMap({
            map: 'world_mill_en',
            backgroundColor: "#B9CFff",
            markers: coordinates,
            regionStyle: {
                fill: "#ff0000",
                scaleColors: ['#b7bdc3', '#a2aaad'],
                "fill-opacity": 1,
                stroke: '#a2aaad',
                "stroke-width": 2,
                "stroke-opacity": 1
            },
            onMarkerLabelShow: function (event, label, index) {
                label.html(
                        'Tracking ID: ' + data[index].trackingId + '<br/>' +
                        'Routing Status: ' + routingStatusName[data[index].routingStatus] + '<br/>' +
                        'Misdirected: ' + (data[index].misdirected ? "Yes" : "No") + '<br/>' +
                        'Transport Status: ' + transportStatusName[data[index].transportStatus] + '<br/>' +
                        'At Destination: ' + (data[index].atDestination ? "Yes" : "No") + '<br/>' +
                        'Origin: ' + locationName[data[index].origin] + '<br/>' +
                        'Last known location: ' + locationName[data[index].lastKnownLocation]);
			},
			onMarkerClick: function (event, index) {
				$('div').remove('.jvectormap-tip');
				window.location.hash = "#admin/detail/routed/" + data[index].trackingId;
			}
		});
	
	};
	
	return {
		initPage: function(){
		    if(!comm.initPage()){
		    	return;
		    }
		    
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "admin-map",
		        id: "bodyAdminMap",
		        position: "new",
		        template: comm.getHtml("admin/map.html"),
		        data: undefined,
		        events: {
		        },
		        afterRender: function(){
		        	getCargos();
		        }
		    });
		}
	};
})();