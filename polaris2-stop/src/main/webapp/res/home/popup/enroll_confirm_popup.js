
(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {
            var page = this

            var userProp = null
            var userParam = null
            var attrMap = {}
            var termsOfServiceId = parameterMap.terms_of_service_id;
            var enrollInfo = {
                courseId: parameterMap.course_id,
                isAuditing: 0,
                putOnWaitingList: 0,
                reEnrollIfEnrolled: 0
                };

            var enrollAvailable = parameterMap.enroll_available;

            var termsOfServiceIdList = [];
            var termsOfServiceShouldList = []


            Requester.awb(ApiUrl.User.GET_USER_PROFILE , {} , function (status, data) {

                var info = Lia.p(data, 'body');
                userProp = Lia.p(info , 'properties');

                userParam = {
                        name : Lia.p(info, 'name'),
                        address1: Lia.p(info, 'address_1'),
                        genderCode : Lia.p(info , 'gender_code'),
                        companyName : Lia.p(info, 'company_name'),
                        companyPosition : Lia.p(info,'company_position'),
                        email : Lia.p(info,'email'),
                        mobilePhoneNumber : Lia.p(info,'mobile_phone_number'),
                        dateOfBirth : info.date_of_birth.split(' ')[0],
                        officePhoneNumber : Lia.p(info, 'office_phone_number'),
                        receiveEmail : 0,
                        receiveTextMessage : 0,
                        receivePushMessage : 0,
                        idx :  Lia.p(info, 'idx'),
                        roleCode :  Lia.p(info,'role_code'),
                        studentTypeCode :  Lia.p(info,'student_type_code'),
                        statusCode :  Lia.p(info,'status_code'),
                        allowedToEnroll : Lia.p(info,'allowed_to_enroll'),
                        profileImageUrl : Lia.p(info,'profile_image_url')
                    };

            })
            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {
                var list = Lia.p(data, 'body' , 'list');

                if(status) {
                    for (var i = 0; i < list.length; i++) {
                        attrMap[list[i].id] = list[i].name;
                    }
                }
            })


            if(termsOfServiceId != undefined) {
                Requester.awb(ApiUrl.Document.GET_TERMS_OF_SERVICE, {
                    id: termsOfServiceId
                }, function (status, data, request) {
                    var agreementList = Lia.p(data, 'body', 'item_list');

                    for(var i in agreementList) {
                        var agreementItem = Lia.p(agreementList , i);
                        var is_optional = Lia.p(agreementItem , 'is_optional');
                        var body = Lia.p(agreementItem , 'body');
                        var sectionTitle = Lia.p(agreementItem , 'title');
                        var agreementItemId = Lia.p(agreementItem , 'id');

                        var jTermItem = $('<li class="terms_bx">\n' +
                            '                                <span class="input_chk">\n' +
                            '                                    <input type="checkbox" name="termsPrivacy" class="chk common_checkbox">\n' +
                            '                                    <label for="termsPrivacy" class="collect_personal"></label>\n' +
                            '                                </span>\n' +
                            '                        <div class="terms_box" tabindex="0" id="divPrivacy"></div>');

                        //약관내용
                        jTermItem.find('.terms_box').append(body);

                        if(is_optional) {
                            //선택
                            var jAgreementBody = sectionTitle  + '<span class="terms_choice">(선택)</span>'
                            jTermItem.find('.collect_personal').html(jAgreementBody)
                        } else {
                            //필수
                           var jAgreementBody = sectionTitle  + '<span class="terms_choice">(필수)</span>'
                           jTermItem.find('.collect_personal').html(jAgreementBody);

                           termsOfServiceShouldList.push(agreementItemId);
                           jTermItem.find('input').attr('agree_id' , agreementItemId);
                        }


                        page.find('.terms_bx_list').append(jTermItem);

                    }

                    page.find('input').on('click' , function() {
                        var jThis = $(this);
                        termsOfServiceIdList.push(Number(jThis.attr('agree_id')));
                    })
                });
            }


            Requester.func(function () {
                //기관 상세 주소
                var address_1_2 = '';
                var agType1 = ''
                var agType2 = ''

                for(var i in userProp) {
                    if(userProp[i].name == "address_1_detail") {
                        address_1_2 = userProp[i].value;
                    }
                    if(userProp[i].name == 'agTypeDp') {
                        agType1 = userProp[i].value;
                    }
                    if(userProp[i].name == 'agTypeDp2') {
                        agType2 = userProp[i].value;
                    }
                }

                page.find('#enroll_info_table .usrname').text(userParam.name);
                // page.find('#enroll_info_table .usrphone').text(userParam.mobilePhoneNumber);
                page.find('#enroll_info_table .usrcn').text(userParam.companyName);
                page.find('#enroll_info_table .usrposition').text(attrMap[userParam.companyPosition]);
                page.find('#enroll_info_table .usrcadd').text(userParam.address1 + ' , ' + address_1_2);
                page.find('#enroll_info_table .usrctel').text(userParam.officePhoneNumber);


                var usrctypeString = '';
                var usrctype1 = Lia.p(attrMap, agType1);
                var usrctype2 = Lia.p(attrMap, agType2);

                if ( String.isNotBlank(usrctype1) ) {

                    if ( String.isNotBlank(usrctypeString) ) {
                        usrctypeString += ', ';
                    }

                    usrctypeString += usrctype1;
                }

                if ( String.isNotBlank(usrctype2) ) {

                    if ( String.isNotBlank(usrctypeString) ) {
                        usrctypeString += ', ';
                    }

                    usrctypeString += usrctype2;
                }

                page.find('#enroll_info_table .usrctype').text( Lia.pcd('-', usrctypeString));
            });


            page.find('.close').on('click', {
                popup: page
            }, function (e) {
                var popup = e.data.popup;
                popup.hide();
            });

            page.find('.cancel').on('click', {
                popup: page
            }, function (e) {
                var popup = e.data.popup;
                popup.hide();
            });

            page.find('.goMyPage').on('click' , function() {
                page.hide();
                PageManager.go(['user', 'check_pw']);
            });


            if(termsOfServiceId == undefined) {
                page.find('#join_form').css('display' , 'none')
            }

            page.find('.continue').on('click', {
                popup: page
            }, function (e) {
                if(termsOfServiceId != undefined) {
                    //약관존재
                    var shouldCheckedCount = 0;
                    for(var i in termsOfServiceShouldList) {
                        if(termsOfServiceIdList.includes(termsOfServiceShouldList[i])) {
                            shouldCheckedCount++;
                        } else {
                        }
                    }


                    if (shouldCheckedCount == termsOfServiceShouldList.length) {
                        if (parameterMap.is_traning) {
                            AjaxPopupManager.show(ProjectPopupUrl.COURSE_ATTACH_FILE, {
                                terms_of_service_id: termsOfServiceId,
                                termsOfServiceItemIdList : termsOfServiceIdList,
                                onComplete: function (doc_obj , termsOfServiceItemIdList) {
                                    parameterMap.onComplete(doc_obj , termsOfServiceItemIdList);
                                }
                            });
                        } else {
                            parameterMap.onComplete(JSON.stringify({}) , termsOfServiceIdList);
                        }
                        page.hide();

                    } else {
                        PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '약관을 읽고, 동의해 주십시오');
                        return;
                    }
                } else {
                    //약관미존재
                    if (parameterMap.is_traning) {
                        AjaxPopupManager.show(ProjectPopupUrl.COURSE_ATTACH_FILE, {
                            terms_of_service_id: termsOfServiceId,
                            onComplete: function (doc_obj) {
                                parameterMap.onComplete(doc_obj);
                            }
                        });
                    } else {
                        parameterMap.onComplete(JSON.stringify({}));
                    }
                    page.hide();
                }
            });


        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

