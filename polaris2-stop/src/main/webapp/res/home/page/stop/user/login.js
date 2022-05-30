(function () {

    return {
        attrMap : [],

        onInit: function () {

            var page = this;

            page.find('.page_login_create_button').on('click', function () {
                //PageManager.go(['sign_up']);
                PageManager.go(["user", 'join1']);
            });
            page.find('.find_id').on('click', function () {
                //PageManager.go(['sign_up']);
                PageManager.go(["user", 'find_id']);
            });
            page.find('.find_pw').on('click', function () {
                //PageManager.go(['sign_up']);
                PageManager.go(["user", 'find_pw']);
            });

            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST , {
                categoryCode : '소속기관',
                depth : 2
            } , function (status, data) {
                var list = Lia.p(data , 'body', 'list');
                for(var idx in list) {
                    var id = Lia.p(list , idx , 'parent_id');
                    if(page.attrMap.indexOf(id) < 0) {
                        page.attrMap.push(id);
                    }
                }
            });

            Requester.func(function () {

                var loginSavedId = CookieHelper.get("login_saved_id");
                var loginInstId = CookieHelper.get("login_saved_inst_id");
                if (String.isNotBlank(loginInstId)) {
                    page.find('.button.check').buttonPressed(true);
                    page.find('input.page_login_input_id').val(loginSavedId);
                    $('.page_login_input_category select').val(loginInstId);
                }
            });


            page.find('input.page_login_input_id').on('keypress', function (e) {
                if (e.which == Lia.KeyCode.ENTER) {
                    page.find('input.page_login_input_pw').focus();
                }
            });

            page.find('input.page_login_input_pw').on('keypress', function (e) {
                if (e.which == Lia.KeyCode.ENTER) {
                    page.login();
                }
            });

            page.find('.page_login_input_login').on('click', function (e) {

                e.preventDefault();
                e.stopPropagation();

                page.login();

            });
        },

        login: function () {

            var page = this;

            //어트리뷰트 체크
            page.alertPopup = false

            var id = page.find('input.page_login_input_id').val().trim();
            var pw = page.find('input.page_login_input_pw').val().trim();

            if (String.isNullOrWhitespace(id)) {
                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.ENTER_USER_ID ));
                return;
            }

            if (String.isNullOrWhitespace(pw)) {
                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.ENTER_PASSWORD));
                return;
            }

            LoadingPopupManager.show();
            Requester.awb(ApiUrl.User.LOGIN, {
                id: id,
                password: pw,
                stayLoggedIn: Configs.getConfig(Configs.STAY_LOGGED_IN)?1:0
            }, function (status, data) {

                LoadingPopupManager.hide();

                if (status != Requester.Status.SUCCESS) {


                    var code = Lia.p(data, 'code');
                    if (code == Code.NEED_TO_AGREE_TERMS_OF_SERVICE) {

                        var temporaryKey = Lia.p(data, 'body', 'temporary_key');
                        AjaxPopupHelper.agreement(undefined, temporaryKey, function (agreementList, termsOfService) {
                            page.login();
                        });

                    } else if (code == Code.TEMPORARY_USER) {

                        AjaxPopupManager.show(LmsPopupUrl.TEMPORARY_USER, {
                            id: id,
                            password: pw,
                            onConfirm: function () {
                                page.login();
                            }
                        });

                    } else if (code == Code.NEED_TO_CHANGE_PASSWORD) {
                        var key = Lia.p(data , 'body' , 'password_reset_temporary_key');

                        PopupManager.alert("비밀번호 변경 필요" ,
                            "비밀번호를 변경한지 6개월이 지났습니다. <br/> 비밀번호를 변경하셔야 로그인이 가능합니다." , function() {
                            AjaxPopupManager.show(ProjectPopupUrl.PASSWORD_EXPIRED, {key: key, id: id});
                        })
                    } else {
                        PopupManager.alertByResponse(data);
                    }

                    return;
                }

                {
                    var map = undefined;

                    var tabListMapString = window.localStorage.getItem('tab_list_map');

                    if (String.isNotBlank(tabListMapString)) {
                        map = JSON.parse(tabListMapString);
                    }

                    if (map == undefined) {
                        map = {};
                    }

                    map[ProjectSettings.TabStorageKey + ':' + id] = '';

                    window.localStorage.setItem('tab_list_map', JSON.stringify(map));
                }

                page.needToUpdateUserProfile = Lia.p(data,'body','need_to_update_user_profile');

                Requester.awb(ApiUrl.User.GET_USER_PROFILE , {} , function (status , data) {
                    var properties = Lia.convertListToListMap(Lia.p(data , 'body' , 'properties') , 'name');

                    //직위 기타를 골랐으나 직위 직접입력을 하지 않았을 경우
                    if(Lia.p(data , 'body' , 'company_position') == '10' && String.isBlank(Lia.p(properties , 'positionText' , 0 , 'value'))) {
                        page.alertPopup = true
                    } else if (String.isBlank(Lia.p(data , 'body' , 'company_position'))) {
                        page.alertPopup = true
                    }

                    //회사 이름
                    if(String.isBlank(Lia.p(data , 'body' , 'company_name'))) {
                        page.alertPopup = true
                    }

                    //회사 주소
                    if(String.isBlank(Lia.p(data , 'body' , 'address_1')) || String.isBlank(Lia.p(data , 'body' , 'address_2'))) {
                        page.alertPopup = true
                    }

                    //기관연락처
                    if(String.isBlank(Lia.p(data , 'body' , 'office_phone_number'))) {
                        page.alertPopup = true
                    }


                    //소속기관 depth2가 있는 depth1을 골랐음에도 depth2가 없을때
                    if(page.attrMap.indexOf(Number(Lia.p(properties , 'agTypeDp' , 0,'value'))) >= 0 && String.isBlank(Lia.p(properties , 'agTypeDp2' , 0 , 'value'))) {
                        page.alertPopup = true
                    }

                    for(var idx in properties) {
                        var item = Lia.p(properties , idx , 0,'value')

                        switch (idx) {
                            case 'address_1_detail' :  {
                                if(String.isBlank(item)) {
                                    page.alertPopup = true
                                }
                            }break;
                            case 'agTypeDp' :  {
                                if(String.isBlank(item)) {
                                    page.alertPopup = true
                                }
                            }break;
                            case 'support' :  {
                                if(String.isBlank(item)) {
                                    page.alertPopup = true
                                }
                            }break;
                            case 'career' :  {
                                if(String.isBlank(item)) {
                                    page.alertPopup = true
                                }
                            }break;
                            case 'career_present' :  {
                                if(String.isBlank(item)) {
                                    page.alertPopup = true
                                }
                            }break;
                            case 'company_attachment_document_file' :  {

                                if ( String.isNotBlank(item) ) {
                                    var fileObj = JSON.parse(item)
                                    if(String.isBlank(Lia.p(fileObj , 0, 'url'))) {
                                        page.alertPopup = true
                                    }
                                } else {
                                    page.alertPopup = true
                                }

                            }break;

                        }
                    }

                    if (Lia.contains(Lia.p(data, 'body', 'role_code'), UserRole.ADMIN, UserRole.INSTITUTION_ADMIN)) {
                        page.goDefault();
                    } else{
                        page.propertyPopup(page.alertPopup,  page.needToUpdateUserProfile);
                    }

                })


            }, {
                autoPopup: false
            });


        },

        propertyPopup : function (alertPopup, needToUpdateUserProfile) {

            if ( needToUpdateUserProfile ) {

                AjaxPopupManager.show('home/popup/message_popup', {
                    title : '[필독] 2022년 재직 확인 서류 갱신 안내',

                    message:   '<div style="text-align: left;">' +
                        '<br/><br/>' +
                        '교육신청 및 수료증 발급을 위해 정보 갱신이 필요합니다.<br/>' +
                        '<span style="color:#7147a9;font-family: notokr-medium;">("확인"을 클릭하여 재직 확인 서류를 업로드 하지 않으면 로그인이 불가합니다.)</span><br/>' +
                        '<br/>' +
                        '* 매년 최초 1회 재직 확인 서류를 업로드 해야 합니다.<br/>' +
                        '* 2022년 교육 신청을 원하실 경우, 2022년에 발급한 서류를 첨부해 주시기 바랍니다.<br/>' +
                        '* 해당 년도 발급 서류가 아니거나, 재직 확인 서류와 관계 없는 서류를 첨부할 경우 교육생 신청에서 제외 될 수 있습니다.' +

                        '<div style="padding:20px 0;text-align: center">' +
                        '정보 수정 페이지로 이동 하시겠습니까?' +
                        '<br/>&nbsp;' +
                        '<br/>&nbsp;' +
                        '<br/>&nbsp;' +
                        '</div>' +
                        '</div>',

                    confirm:   function () {
                        PageManager.go(['user', 'check_pw']);
                        Lia.refresh();
                    },
                    cancel: function() {
                        Lia.redirect(PageUrl.LOGOUT);
                    },
                    confirmText: '확인',
                    cancelText: '로그아웃 하기'
                });

            } else if(alertPopup) {
                PopupManager.alert('안내', '교육신청 및 수료증 발급을 위해 추가 정보 입력이 필요합니다.<br/>지금 추가 정보를 입력하시겠습니까?', function () {
                    PageManager.go(['user', 'check_pw']);
                    Lia.refresh()
                }, function() {
                    Lia.redirect('/');
                });
            } else {
                Lia.redirect('/');
            }
        },


        goDefault: function () {

            var redirectUrl = PageManager.pc('redirect_url');
            if (String.isNotBlank(redirectUrl)) {
                Lia.redirect(redirectUrl);
            } else {
                Lia.redirect('/');
            }
        },

        onChange: function () {

            var page = this;
        },

        onRelease: function () {

            var page = this;
        },

        onResize: function () {

            var page = this;

        }
    };
})();