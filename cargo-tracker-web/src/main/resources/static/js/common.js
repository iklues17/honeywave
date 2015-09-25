"use strict";

(function() {

    var root = this;
    var comm = root.comm = {};
    var domain = root.domain = {};
    
}).call(this);


$(document).ready(function(){
	$.ajaxSetup({
		statusCode: {
			401: function(){
				comm.openModalForErrorMsg("An error has occurred during the authentication process", "Please Login again");
				comm.logout();
			}
		},
		async: false
	});
	
	comm.isLogedin = comm.localStorage.get('UserToken') ? true : false;
	
	if(comm.isLogedin){
		if(comm.isEmptyObj(comm.localStorage.get("I"))){
			comm.isLogedin = false;
		}else{
			comm.I = comm.localStorage.get("I");
			comm.AuthArray = comm.localStorage.get("UserAuthorities");
			if($.inArray("ROLE_ADMIN", comm.AuthArray) >= 0){
				comm.isAdmin = true;
			}else{
				comm.isAdmin = false;
			}
		}
	}
    page.MenuTop.init();
});

$(document).foundation({
	offcanvas : {
		// Sets method in which offcanvas opens.
		// [ move | overlap_single | overlap ]
		open_method: 'overlap', 
		// Should the menu close when a menu link is clicked?
		// [ true | false ]
		close_on_click : false
	}
});

comm.server = {};
comm.server.url = "http://localhost:9999";

comm.isLogedin = false;
comm.isAdmin = false;

// Login 하면 저장되는 유저정보
comm.I = {};

comm.toJson = function(obj) {
	if (typeof obj === 'undefined') return undefined;
	return JSON.stringify(obj);
};
comm.fromJson = function(json) {
	return comm.isString(json) ? JSON.parse(json) : json;
};
comm.isUndefined = function(value){return typeof value === 'undefined';};
comm.isDefined = function(value) {return typeof value !== 'undefined';};
comm.isObject = function(value) {return value !== null && typeof value === 'object';};
comm.isString = function(value) {return typeof value === 'string';};
comm.isNumber = function(value) {return typeof value === 'number';};
comm.isArray = Array.isArray;
comm.isDate = function(value) {return toString.call(value) === '[object Date]';};
comm.isFunction = function(value) {return typeof value === 'function';};
comm.isEmptyObj = $.isEmptyObject;

comm.getHtml = function (path) {

    var getFile = $.ajax({
        url: path,
        async: false,
        success: function (data) {
            return data;
        }
    });

    return getFile.responseText;
};

comm.goToMainPage = function(){

	if(comm.isLogedin === true){
		if(comm.isAdmin){
			window.location.hash = "#admin/dashboard";
		}else{
			window.location.hash = "#dashboard";
		}
		return;
	}else{
		window.location.href = "";
	}
	
};

comm.queryStringToJson = function(queryString){
	return (queryString || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
};

comm.openModalForErrorMsg = function(errorMsg, followup){
	$('body').find("#myModal").remove();
	$('body').append('<div id="myModal" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">'
			+ '<h2 id="modalTitle">Sorry. Your request is failed.</h2>'
			+  '<p class="lead">'+errorMsg+'</p>'
			+  '<p>'+followup+'</p>'
			+  '<a class="close-reveal-modal" aria-label="Close">&#215;</a>'
			+ '</div>');
	$('#myModal').foundation('reveal', 'open');
};

comm.openModalForSuccessMsg = function(successMsg){
	$('body').find("#myModal").remove();
	$('body').append('<div id="myModal" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">'
			+ '<h2 id="modalTitle">Success</h2>'
			+  '<p class="lead">for '+successMsg+'</p>'
			+  '<a class="close-reveal-modal" aria-label="Close">&#215;</a>'
			+ '</div>');
	$('#myModal').foundation('reveal', 'open');
};

comm.openModalForInformMsg = function(normalMsg){
	$('body').find("#myModal").remove();
	$('body').append('<div id="myModal" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">'
			+ '<h2 id="modalTitle">Infomation</h2>'
			+  '<p class="lead">'+normalMsg+'</p>'
			+  '<a class="close-reveal-modal" aria-label="Close">&#215;</a>'
			+ '</div>');
	$('#myModal').foundation('reveal', 'open');
};

comm.getLocations = function(){
	return [
		{"name": "Chicago (USCHI)"	 , "unLocode": "USCHI"},
		{"name": "Dallas (USDAL)"	 , "unLocode": "USDAL"},
		{"name": "Guttenburg (SEGOT)", "unLocode": "SEGOT"},
		{"name": "Hamburg (DEHAM)"	 , "unLocode": "DEHAM"},
		{"name": "Hangzhou (CNHGH)"	 , "unLocode": "CNHGH"},
		{"name": "Helsinki (FIHEL)"	 , "unLocode": "FIHEL"},
		{"name": "Hong Kong (CNHKG)" , "unLocode": "CNHKG"},
		{"name": "Melbourne (AUMEL)" , "unLocode": "AUMEL"},
		{"name": "New York (USNYC)"	 , "unLocode": "USNYC"},
		{"name": "Rotterdam (NLRTM)" , "unLocode": "NLRTM"},
		{"name": "Shanghai (CNSHA)"	 , "unLocode": "CNSHA"},
		{"name": "Stockholm (SESTO)" , "unLocode": "SESTO"},
		{"name": "Tokyo (JNTKO)"	 , "unLocode": "JNTKO"}
	];
}

comm.getCompanies = function(){
	return [
		{"name": "Samsung SDS"	 , "companyId": "23489056"},
		{"name": "A사"	 , "companyId": "128034"},
		{"name": "B사"	 , "companyId": "34905"}
	];
}

comm.appendSelectLocations = function($target){
	$.each(comm.getLocations(), function(i){
		$target.append('<option value="'+this.unLocode+'">'+this.name+'</option>');
	});
}

comm.appendSelectCompanies = function($target){
	$.each(comm.getCompanies(), function(i){
		$target.append('<option value="'+this.companyId+'">'+this.name+'</option>');
	});
}

comm.queryStringToJson = function(queryString){
	return (queryString || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

comm.toJson = function(obj) {
	if (typeof obj === 'undefined') return undefined;
	return JSON.stringify(obj);
};
comm.fromJson = function(json) {
	return comm.isString(json) ? JSON.parse(json) : json;
};
comm.isUndefined = function(value){return typeof value === 'undefined';};
comm.isDefined = function(value) {return typeof value !== 'undefined';};
comm.isObject = function(value) {return value !== null && typeof value === 'object';};
comm.isString = function(value) {return typeof value === 'string';};
comm.isNumber = function(value) {return typeof value === 'number';};
comm.isArray = Array.isArray;
comm.isDate = function(value) {return toString.call(value) === '[object Date]';};
comm.isFunction = function(value) {return typeof value === 'function';};
comm.isStringNumber = function(num){
	return  /^-?\d+\.?\d*$/.test(num.replace(/["']/g, ''));
};