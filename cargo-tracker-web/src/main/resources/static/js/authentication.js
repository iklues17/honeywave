"use strict";

comm.AUTH = {
	CLIENT_ID: "auth",
	CLIENT_SECRET: "authSecret"
};

comm.getI = function(loginName){

	comm.callApi({
		url: comm.server.url+"/user/users/" + loginName,
		method: "GET",
		dataType: "json",
		contentType: "application/json",
		success: function(myInfo, textStatus, jqXHR){

			comm.isLogedin = true;
			comm.I = myInfo;
			if(comm.I.company === undefined){
				debugger;
			}
			comm.localStorage.set("I", myInfo);
		},
		error:function( jqXHR,  textStatus,  errorThrown){
			comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
		},
		complete : function(text, xhr){
		}
	});
};

/**
 * Resource Owner Password Credentials Grant 방식
 * - 사용자 name, password로 인증서버로부터 AccessToken을 받아온다
 */
comm.UserCredentials = function(username, pwd){

	var isValid = false;

	$.ajax({
		url: comm.server.url+"/auth/oauth/token",
		method: "post",
		data: "grant_type=password&username="+username+"&password="+pwd
		+"&client_id="+comm.AUTH.CLIENT_ID+"&client_secret="+comm.AUTH.CLIENT_SECRET,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": "application/json",
			"Authorization": "Basic " + new Base64().encode(comm.AUTH.CLIENT_ID+':'+comm.AUTH.CLIENT_SECRET)
		}
	}).success(function (data, textStatus, jqXHR) {
		if(comm.isObject(data)){
			//Token 저장
			var expiredAt = new Date();
			expiredAt.setSeconds(expiredAt.getSeconds() + data.expires_in);
			data.expires_at = expiredAt.getTime();
			comm.localStorage.set('UserToken', data.access_token);
			comm.localStorage.set('UserRefreshToken', data.refresh_token);
			// 사용자 정보 조회
			comm.getI(username);
			// 권한 정보 조회
			isValid = comm.CheckToken(data.access_token);
			
			comm.goToMainPage();
			page.MenuTop.init();
			
		}else{
			comm.openModalForErrorMsg("Invalid User Authentication", "Contact Us.");
			isValid = false;
		}
		
	}).error(function (jqXHR,  textStatus,  errorThrown){
		if(jqXHR.status === 400){
			var errorObj = jqXHR.responseJSON;
			if(errorObj.error === "invalid_grant"){
				comm.openModalForErrorMsg(errorObj.error_description, "Invalid Password");
			}else{
				comm.openModalForErrorMsg(errorObj.error_description, "이건 머지?");
			}
			
		}else{
			comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
		}
		isValid = false;
	});
	
	if(!isValid){
		comm.localStorage.remove('ClientToken');
	}
	return isValid;
};

/**
 * Client Credentials Grant 방식
 * - Client id, secret으로 인증서버로부터 AccessToken을 받아온다
 */
comm.ClientCredentials = function(clientId, clientSecret){

	var isValid = false;

	$.ajax({
		url: comm.server.url+"/auth/oauth/token",
		method: "post",
		data: "grant_type=client_credentials&client_id="+clientId+"&client_secret="+clientSecret,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": "application/json",
			"Authorization": "Basic " + new Base64().encode(clientId+':'+clientSecret)
		}
	}).success(function (data, textStatus, jqXHR) {
		if(comm.isObject(data)){
			var expiredAt = new Date();
			expiredAt.setSeconds(expiredAt.getSeconds() + data.expires_in);
			data.expires_at = expiredAt.getTime();
			comm.localStorage.set('ClientToken', data.access_token);
			isValid = true;
		}else{
			comm.openModalForErrorMsg("Invalid Client Authentication", "Contact Us.");
			isValid = false;
		}
	}).error(function (jqXHR,  textStatus,  errorThrown){
		comm.openModalForErrorMsg(errorObj.message, "Unauthorized");
		isValid = false;
	});
	
	if(!isValid){
		comm.localStorage.remove('ClientToken');
	}
	
	return isValid;
};

/**
 * Resource Owner Password Credentials Grant 방식
 * - 사용자 name, password로 인증서버로부터 AccessToken을 받아온다
 */
comm.CheckToken = function(token){

	var isValid = false;

	$.ajax({
		url: comm.server.url+"/auth/oauth/check_token?token="+token,
		method: "get",
		datatype: "json"
	}).success(function (data, textStatus, jqXHR) {
		//Token 저장
		comm.localStorage.set('UserAuthorities', data.authorities);
		comm.AuthArray = data.authorities;
		if($.inArray("ROLE_ADMIN", comm.AuthArray) >= 0){
			comm.isAdmin = true;
		}else{
			comm.isAdmin = false;
		}
		
		isValid = true;
	}).error(function (jqXHR,  textStatus,  errorThrown){
		if(jqXHR.status === 400){
			var errorObj = jqXHR.responseJSON;
			if(errorObj.error === "invalid_grant"){
				comm.openModalForErrorMsg(errorObj.error_description, "Invalid Password");
			}else if(errorObj.error === "invalid_token"){
				// Token has expired
				comm.openModalForErrorMsg(errorObj.error_description, errorObj.error_description);
			}else{
				comm.openModalForErrorMsg(errorObj.error_description, "이건 머지?");
			}
			
		}else{
			comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
		}
		isValid = false;
	});
	return isValid;
};

comm.logout = function(){
	comm.isLogedin = false;
	comm.isAdmin = false;
	comm.I = {};
	comm.localStorage.remove("I");
	comm.localStorage.remove("UserToken");
	comm.localStorage.remove("UserRefreshToken");
	comm.localStorage.remove("UserAuthorities");
	comm.localStorage.remove("ClientToken");
	comm.localStorage.remove("ClientAuthorities");
	// 메인 화면으로 전환
	window.location.hash = "";
	// Menu bar 다시 로딩
	page.MenuTop.init();
};

comm.menuAuthorization = {
	ALL    : ["my-page", "login", "logout", "signup"],
	ADMIN  : ["admin/dashboard", "admin/track", "admin/track/{trackingId}", "admin/about", "admin/world-map", "admin/detail/{status}/{id}", "admin/detail/{status}/{id}/select-itinerary"], 
	MANAGER: ["dashboard", "booking", "track", "track/{trackingId}", "about", "detail/{bookingId}", "detail/{bookingId}/change-destination"],
	USER   : ["dashboard", "booking", "track", "track/{trackingId}", "about", "detail/{bookingId}", "detail/{bookingId}/change-destination"] 
}

comm.initPage = function () {
	
	var hash = window.location.hash.replace(/#/,"");
	
	var movePage = true;
	if(!comm.isLogedin){
		if(!(window.location.hash === "" || window.location.hash.startsWith("#log") || window.location.hash.startsWith("#sign") || window.location.hash.startsWith("#track"))){
			window.location.hash = ""; // login page
			movePage = false;
		}
	}
//	if(window.location.hash !== ""
//		&& !window.location.hash.startsWith("#log")
//		&& !window.location.hash.startsWith("#sign")
//		&& !window.location.hash.startsWith("#my")){
//		if(comm.isAdmin){
//			if(!window.location.hash.startsWith("#admin")){
//				alert("관리자 권한이 없습니다.");
//				return false;
//			}
//		}else{
//			
//		}
//	}
	
    $(".top-bar-section > ul.left > li").removeClass('active');
    $(".top-bar-section > ul.right > li").removeClass('active');
    
//	admin booking 메뉴 제거    
//    if (location.hash.startsWith('#booking')) {
//    	$(".top-bar-section > ul.left > li").eq(1).addClass('active');
//    } 
    if (location.hash.startsWith('#admin/dashboard') ||
    		location.hash.startsWith('#admin/detail')) {
    	$(".top-bar-section > ul.left > li").eq(0).addClass('active');
    } else if (location.hash.startsWith('#admin/track')) {
    	$(".top-bar-section > ul.left > li").eq(1).addClass('active');
    } else if (location.hash.startsWith('#admin/about')) {
    	$(".top-bar-section > ul.left > li").eq(2).addClass('active');
    } else if (location.hash.startsWith('#admin/world-map')) {
    	$(".top-bar-section > ul.left > li").eq(3).addClass('active');
    }
    
    //public page
    else if (location.hash.startsWith('#dashboard') ||
    		location.hash.startsWith('#detail')) {
    	$(".top-bar-section > ul.left > li").eq(0).addClass('active');
    } else if (location.hash.startsWith('#booking')) {
    	$(".top-bar-section > ul.left > li").eq(1).addClass('active');
    } else if (location.hash.startsWith('#track')) {
    	if(comm.isLogedin){
    		$(".top-bar-section > ul.left > li").eq(2).addClass('active');
    	}else{
    		$(".top-bar-section > ul.left > li").eq(0).addClass('active');
    	}
    } else if (location.hash.startsWith('#about')) {
    	$(".top-bar-section > ul.left > li").eq(3).addClass('active');
    }
    
    // Top Right Bar - login state
    else if (location.hash.match("my-page") !== null ) {
    	$(".top-bar-section > ul.right > li").eq(0).addClass('active');
    } else if (location.hash.startsWith("#logout")) {
    	$(".top-bar-section > ul.right > li").eq(1).addClass('active');
    }
    // Top Rigth Bar - logout state
    else if (location.hash.startsWith('#login')) {
    	$(".top-bar-section > ul.right > li").eq(0).addClass('active');
    }
    else if (location.hash.startsWith('#signup')) {
    	$(".top-bar-section > ul.right > li").eq(1).addClass('active');
    } else {
    	$(".top-bar-section > ul.right > li").eq(0).addClass('active');
    }

    return movePage;
};