
page.MyPage = (function(){
	
	var ENV = {
		FORM_ID: "#formMyInfo",
		BTN_GROUP_TOP: "#btnTop",
		BTN_GROUP_BOTTOM: "#btnBottom",
		BTN_MOD: "#btnModify",
		BTN_PWD_RE: "#btnPwdReset",
		BTN_WITHDROW: "#btnWithdrowal",
		BTN_SAVE: "#btnSave",
		BTN_BACK: "#btnBack",

		FORM_UNAME: "[name=uname]",
		FORM_EMAIL: "[name=emailAddress]",
		FORM_PWD: "[name=password]",
		FORM_F_NAME: "[name=firstName]",
		FORM_L_NAME: "[name=lastName]",
		FORM_COMPANY: "[name=company]",
		FORM_NO1: "[name=international]",
		FORM_NO2: "[name=mobilePrefix]",
		FORM_NO3: "[name=nSN1]",
		FORM_NO4: "[name=nSN2]"
	};
	
	// view mode : VIEW, MODIFY, PWD, WITHDROWAL
	var formView = {
		init: function(mode){
    		comm.appendSelectCompanies($(ENV.FORM_COMPANY));
    		this.setViewMode(mode);
		},
		
		setViewMode: function(mode){
			$(ENV.BTN_GROUP_TOP).find(".active").removeClass("active");
    		if(mode === "modify"){
    			$(ENV.BTN_MOD).addClass('active');
    			this.toModifyMode();
    		}else if(mode === "password-reset"){
    			$(ENV.BTN_PWD_RE).addClass('active');
    			this.toPwdResetMode();
    		}else if(mode === "withdrowal"){
    			$(ENV.BTN_WITHDROW).addClass('active');
    			this.toWithdrowalMode();
    		}else{
    			this.resetView();
    		}
		},
		
		resetView: function(){

			$(ENV.FORM_ID).find(ENV.FORM_UNAME).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_UNAME).parent().show();
			$(ENV.FORM_ID).find(ENV.FORM_EMAIL).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_EMAIL).parent().show();
			$(ENV.FORM_ID).find(ENV.FORM_PWD).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_PWD).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_F_NAME).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_F_NAME).parent().show();
			$(ENV.FORM_ID).find(ENV.FORM_L_NAME).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_L_NAME).parent().show();
			$(ENV.FORM_ID).find(ENV.FORM_NO1).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_NO2).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_NO3).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_NO4).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_NO4).parents('label').show();
			$(ENV.FORM_ID).find(ENV.FORM_COMPANY).attr('disabled', true);
			$(ENV.FORM_ID).find(ENV.FORM_COMPANY).parent().show();
			
			$(ENV.FORM_ID).find(ENV.FORM_UNAME).val(comm.I.loginName);
			$(ENV.FORM_ID).find(ENV.FORM_EMAIL).val(comm.I.emailAddress);
			$(ENV.FORM_ID).find(ENV.FORM_PWD).val('1234567890');
			$(ENV.FORM_ID).find(ENV.FORM_F_NAME).val(comm.I.firstName);
			$(ENV.FORM_ID).find(ENV.FORM_L_NAME).val(comm.I.lastName);
			if(comm.isUndefined(comm.I.mobilePhoneNo) || comm.I.mobilePhoneNo === null){
				comm.I.mobilePhoneNo = "+8210";
			}
			$(ENV.FORM_ID).find(ENV.FORM_NO1).val(comm.I.mobilePhoneNo.substring(0,3));
			$(ENV.FORM_ID).find(ENV.FORM_NO2).val(comm.I.mobilePhoneNo.substring(3,5));
			$(ENV.FORM_ID).find(ENV.FORM_NO3).val(comm.I.mobilePhoneNo.substring(5,9));
			$(ENV.FORM_ID).find(ENV.FORM_NO4).val(comm.I.mobilePhoneNo.substring(9));
			$(ENV.FORM_ID).find(ENV.FORM_COMPANY).val(comm.I.company.id);
			
			$(ENV.BTN_GROUP_BOTTOM).hide();
			$("[data-mode]").attr("data-mode", "view");
		},
		
		toModifyMode: function(){
			
			this.resetView();
			
			$(ENV.FORM_ID).find(ENV.FORM_EMAIL).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_F_NAME).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_L_NAME).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_NO2).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_NO3).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_NO4).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_COMPANY).attr('disabled', false);
			$(ENV.BTN_GROUP_BOTTOM).show();
			
			$("[data-mode]").attr("data-mode", "modify");
		},
		
		toPwdResetMode: function(){
			
			this.resetView();
			
			$(ENV.FORM_ID).find(ENV.FORM_PWD).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_PWD).val('');
			$(ENV.FORM_ID).find(ENV.FORM_PWD).parent().show();
			
			$(ENV.FORM_ID).find(ENV.FORM_EMAIL).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_F_NAME).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_L_NAME).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_NO1).parents('label').hide();
			$(ENV.FORM_ID).find(ENV.FORM_COMPANY).parent().hide();
			$(ENV.BTN_GROUP_BOTTOM).show();
			
			$("[data-mode]").attr("data-mode", "pwdreset");
		},
		
		toWithdrowalMode: function(){
			
			this.resetView();
			
			$(ENV.FORM_ID).find(ENV.FORM_PWD).attr('disabled', false);
			$(ENV.FORM_ID).find(ENV.FORM_PWD).val('');
			$(ENV.FORM_ID).find(ENV.FORM_PWD).parent().show();

			$(ENV.FORM_ID).find(ENV.FORM_EMAIL).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_F_NAME).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_L_NAME).parent().hide();
			$(ENV.FORM_ID).find(ENV.FORM_NO1).parents('label').hide();
			$(ENV.FORM_ID).find(ENV.FORM_COMPANY).parent().hide();
			$(ENV.BTN_GROUP_BOTTOM).show();
			
			$("[data-mode]").attr("data-mode", "withdrowal");
		}
	};
	
	var btnFn = {
		
		cancel: function(){
			formView.resetView();
		},
		
		save: function(){
			//정보수정
			if($("[data-mode=modify]").size() > 0){
				this.doModify();
			}
			//패스워드 변경
			else if($("[data-mode=pwdreset]").size() > 0){
				this.doPwdReset();
			}
			//탈퇴
			else if($("[data-mode=withdrowal]").size() > 0){
				this.doWithdrowal();
			}
			else{
				alert("There is no change")
			}
		},
		
		doModify: function(){
			
			var formdata = {
				emailAddress: $(ENV.FORM_ID).find(ENV.FORM_EMAIL).val(),
				firstName: $(ENV.FORM_ID).find(ENV.FORM_F_NAME).val(),
				lastName: $(ENV.FORM_ID).find(ENV.FORM_L_NAME).val(),
				company: {
					id: $(ENV.FORM_ID).find(ENV.FORM_COMPANY+" option:selected").val(),
					name: $(ENV.FORM_ID).find(ENV.FORM_COMPANY+" option:selected").val()
				}
			}
			
			comm.callApi({
				url: comm.server.url+"/user/users",
				method: "PUT",
				data: JSON.stringify(formdata),
				dataType: "json",
				contentType: "application/json",
				success: function(myInfo, textStatus, jqXHR){
					comm.I = myInfo;
					comm.localStorage.set("I", myInfo);
					
					// 사용자정보 재설정
					formView.resetView();
					comm.openModalForSuccessMsg("Modify your infomation");
				},
				error:function( jqXHR,  textStatus,  errorThrown){
					var errorObj = jqXHR.responseJSON;
					comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
				},
				complete : function(text, xhr){
				}
			});
		},
		
		doPwdReset: function(){
			
			var newPassword = sha256_digest($(ENV.FORM_ID).find(ENV.FORM_PWD).val());

			comm.callApi({
				url: comm.server.url+"/auth/api/account/change_password",
				method: "POST",
				contentType: "text/html",
				data: newPassword,
				success: function(data, textStatus, jqXHR){
					comm.openModalForSuccessMsg("Modify your Password");
					comm.logout();
				},
				error:function( jqXHR,  textStatus,  errorThrown){
					var errorObj = JSON.parse(jqXHR.responseText);
					comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
				},
				complete : function(text, xhr){
				}
			});
		},
		
		doWithdrowal: function(){
			if(confirm("정말 탈퇴하시겠습니까?")){
				
				var formdata = {
					emailAddress: $(ENV.FORM_ID).find(ENV.FORM_EMAIL).val(),
					password: $(ENV.FORM_ID).find(ENV.FORM_PWD).val()
				}
				
				formdata.password = sha256_digest(formdata.password);
				
				comm.callApi({
					url: comm.server.url+"/user/withdrawal",
					method: "POST",
					data: JSON.stringify(formdata),
//					dataType: "json",
					contentType: "application/json",
					success: function(data, textStatus, jqXHR){
						comm.openModalForSuccessMsg("Goodbye my friend~!");
						comm.logout();
					},
					error:function( jqXHR,  textStatus,  errorThrown){
						comm.openModalForErrorMsg(textStatus, "You have a problem, Please Contact us");
					},
					complete : function(text, xhr){
					}
				});
			}
		},
		
		init: function(){
			var that = this;

			$(ENV.BTN_MOD).on('click', function(e){
				$(ENV.BTN_GROUP_TOP).find(".active").removeClass("active");
				$(this).addClass('active');
				window.location.hash = "#my-page/modify";
				formView.toModifyMode();
			});
			$(ENV.BTN_PWD_RE).on('click', function(e){
				$(ENV.BTN_GROUP_TOP).find(".active").removeClass("active");
				$(this).addClass('active');
				window.location.hash = "#my-page/password-reset";
				formView.toPwdResetMode();
			});
			$(ENV.BTN_WITHDROW).on('click', function(){
				$(ENV.BTN_GROUP_TOP).find(".active").removeClass("active");
				$(this).addClass('active');
				window.location.hash = "#my-page/withdrowal";
				formView.toWithdrowalMode();
			});
			$(ENV.BTN_SAVE).on('click', function(){
				$(ENV.BTN_GROUP_TOP).find(".active").removeClass("active");
				that.save();
			});
			$(ENV.BTN_BACK).on('click', function(){
				$(ENV.BTN_GROUP_TOP).find(".active").removeClass("active");
				that.cancel();
			});
		}
	};
	
	return {
		initPage : function(mode){
			if(!comm.initPage()){
		    	return;
		    }
			
			var datas = comm.I;
			
		    template.RenderOne({
		        target: "#body",
		        tagName: "div",
		        className: "my-page",
		        id: "bodyMyPage",
		        position: "new",
		        template: comm.getHtml("my-page.html"),
		        data: {},
		        events: {},
	
		        afterRender: function(isAlreadLoaded) {
		        	if(isAlreadLoaded){
		        		formView.setViewMode(mode);
		        	}else{
		        		formView.init(mode);
		        		btnFn.init();
		        	}
		        }
		    });
		}
	};
})();