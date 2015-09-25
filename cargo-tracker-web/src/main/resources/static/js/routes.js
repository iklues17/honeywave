$(function(){

    var AppRouter = new (Backbone.Router.extend({
        routes: {
        	""				: page.Login.initPage,
            // Right Menu view
            "my-page"		: page.MyPage.initPage,
            "my-page/:viewMode"	: page.MyPage.initPage,
            "login"			: page.Login.initPage,
            "logout"		: page.Logout.initPage,
            "signup"		: page.Signup.initPage,
            
            // ADMIN
        	// Menu View
            "admin/dashboard"			: adminPage.Dashboard.initPage,
//            "admin/booking"				: adminPage.Registration.initPage,
            "admin/track"				: adminPage.Track.initPage,
            "admin/track/:trackingId"	: adminPage.Track.initPage,
            "admin/about"				: adminPage.About.initPage,
            "admin/world-map"			: adminPage.WorldMap.initPage,
            // Subview
            "admin/detail/:status/:id"	: adminPage.CargoDetail.initPage,
//            "admin/detail/:status/:id/change-destination": adminPage.ChangeDestination.initPage,
            "admin/detail/:status/:id/select-itinerary"	: adminPage.SelectItinerary.initPage,
            
            // Public
        	// Menu View
            "dashboard"			: page.Dashboard.initPage,
            "booking"			: page.Booking.initPage,
            "track"				: page.Track.initPage,
            "track/:trackingId"	: page.Track.initPage,
            "about"				: page.About.initPage,
            // Subview
            "detail/:bookingId/change-destination": page.SubChangeDestination.initPage,
            "detail/:bookingId"	: page.Dashboard.initDetailPage
            
        },
//        showDashboard: adminPage.Dashboard,
//        showBooking: adminPage.Registration,
//        showTrack: adminPage.Track,
//        showAbout: adminPage.About,
//        showWorldMap: adminPage.WorldMap,
////        
//        showMyPage: adminPage.MyPage,
//        showLogIn: page.LogIn,
//        showLogOut: page.LogOut,
//        showSignUp: page.SignUp,
//        
//        showCargoDetail: adminPage.cargoDetailSection,
//        showChangeDestination: adminPage.ChangeDestination,
//        showSelectItinerary: adminPage.SelectItinerary
//        
//        showSuccess: page.Success

    }));

    Backbone.history.start();

});