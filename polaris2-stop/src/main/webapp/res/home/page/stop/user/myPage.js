(function () {

    return {

        onInit: function () {

            var page = this;

            if(!INDEX.approveMyPage && PageManager.pc('afterjoin') != 1) {
                PopupManager.alert('경고' , '잘못된 접근입니다.' , function () {Lia.redirect('/');});
                return;
            }

            $('.signout_text').on('click', function (e){
                PageManager.go(['user/secession']);
            });

            page.loadBasicFormSetting();
            page.loadUserInfo();

            var whichForm = PageManager.pc('which');

            page.find('.myinfo_select_basic').on('click' , function(e) {
                var jThis = $(this);
                jThis.addClass('selected_info');

                page.find('.myinfo_select_addition').removeClass('selected_info');
                page.find('.myinfo_basic_input_form').removeClass('hide');
                page.find('.myinfo_additional_input_form').addClass('hide');
            })

            page.find('.myinfo_select_addition').on('click' , function(e) {
                var jThis = $(this);
                jThis.addClass('selected_info');

                page.find('.myinfo_select_basic').removeClass('selected_info');
                page.find('.myinfo_basic_input_form').addClass('hide');
                page.find('.myinfo_additional_input_form').removeClass('hide');
            })

            if(whichForm == 'addition') {
                page.find('.myinfo_select_addition').trigger('click');
            }

            var certCheckList = page.find('.myinfo_info_cert input:checkbox');
            var noneCheckBox =  $(certCheckList[certCheckList.length-1]);

            noneCheckBox.on('click' , function (e) {
                var jThis = $(this);
                if(jThis.prop('checked')) {
                    for(var i=0; i<certCheckList.length-1; i++) {
                        var cert = $(certCheckList[i]);
                        cert.prop('checked' , false);
                    }
                }
            })
            for(var i=0; i<certCheckList.length-1; i++){
                var cert = $(certCheckList[i]);
                cert.on('click' , function () {
                    var jThis = $(this);
                    if(jThis.prop('checked')) {
                        noneCheckBox.prop('checked' , false);
                    }
                })
            }


            var userInfo = {};

            page.find('#to_additional').on('click' , function () {


                var email = page.find('.myinfo_info_email_input').val();
                if ( String.isBlank(email) ) {
                    PopupManager.alert('안내', '이메일을 입력하여 주십시오.');
                    page.find('.myinfo_info_email_input').focus();
                    return;
                }


                var phoneNumber = page.find('.myinfo_info_phone_input').val();
                if ( String.isBlank(phoneNumber) ) {
                    PopupManager.alert('안내', '휴대전화번호를 입력하여 주십시오.');
                    page.find('.myinfo_info_phone_input').focus();
                    return;
                }

                page.find('.myinfo_select_addition').trigger('click');
                Lia.scrollTo(0 , 200)


            })

            page.find('#confirm').on('click' , function() {
                Requester.awb(ApiUrl.User.GET_USER_PROFILE , {} , function (status, data) {
                    if(!status) {
                        return;
                    }
                    var user = Lia.p(data, 'body');
                    var userIdx = Lia.p(data, 'body' , 'idx');
                    var roleCode = Lia.p(data, 'body' , 'role_code');
                    var studentTypeCode = Lia.p(data, 'body' , 'student_type_code');
                    var statusCode = Lia.p(data, 'body' , 'status_code');
                    var allowedToEnroll = Lia.p(data, 'body' , 'allowed_to_enroll');
                    var userProperty = Lia.p(data, 'body' , 'properties');

                    page.sendUserInfo(user, userIdx, roleCode, studentTypeCode, statusCode, allowedToEnroll, userProperty);


                })
            })

            $('.myinfo_info_address_input').on('click', function (e){
                var jThis = $(this);
                new daum.Postcode({
                    oncomplete: function(data) {

                        var address = Lia.p(data, 'address'); // 주소
                        var building = Lia.pd('', data, 'buildingName'); // 건물

                        if(String.isNotBlank(address)) {
                            jThis.val(address + ' ' + building);
                        }
                    }
                }).open();
            });


            //회원가입 완료 후 바로 이동 시 추가정보로.
            var afterjoin = PageManager.pc('afterjoin');
            if(afterjoin == '1') {
                page.find('.myinfo_select_addition').trigger('click');
            }

        },

        loadUserInfo: function () {
            var page = this;

            //value-key
            var attrMap = {};

            //key-value
            var attrMap2 = {};
            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {
                var list = Lia.p(data, 'body' , 'list');

                if(status) {
                    for (var i = 0; i < list.length; i++) {
                        attrMap[list[i].name] = list[i].id;
                        attrMap2[list[i].id] = list[i].name;
                    }
                }
            })

            page.attrMap = attrMap;
            page.attrMap2 = attrMap2;

            Requester.func()
            {
                Requester.awb(ApiUrl.User.GET_USER_PROFILE, {}, function (status, data) {

                    var id = Lia.p(data, 'body', 'id');
                    var name = Lia.p(data, 'body', 'name');
                    var address2 = Lia.p(data, 'body', 'address_2');
                    var email = Lia.p(data, 'body', 'email');
                    var mobile = (Lia.p(data, 'body', 'mobile_phone_number'));
                    var gender = Lia.p(data, 'body', 'gender_code');
                    var birth = Lia.pd('--',data, 'body', 'date_of_birth').split('-');
                    var profileImg = Lia.p(data, 'body', 'profile_image_url');



                    //추가정보c
                    var agName = page.agName =  Lia.p(data, 'body', 'company_name');
                    var agType = Lia.p(data, 'body', 'company_department'); //기관 유형, 나에게 맞는 강좌
                    var agPosition = Lia.p(data, 'body', 'company_position'); //직위, 나에게 맞는 강좌
                    var agPhone = Lia.p(data, 'body', 'office_phone_number');
                    var userProperties = Lia.pd([],data, 'body', 'properties');
                    var address1 = Lia.p(data, 'body', 'address_1'); // address1 은 기관주소로 정함

                    page.userpro = Lia.p(data , 'body' , 'properties');

                    page.propertyMap = {};

                    userProperties.forEach(function (data) {

                        var propertyName = Lia.p(data, 'name');
                        var value = Lia.p(data, 'value');

                        page.propertyMap[propertyName] = value;

                        if(propertyName == 'agTypeDp') {
                            page.find('.myinfo_info_field_depth1_input').find('option[value="'+value+'"]').prop('selected' , true).trigger('change');
                        } else if(propertyName == 'agTypeDp2') {
                            page.find('.myinfo_info_field_depth2_input').find('option[value="'+value+'"]').prop('selected' , true);
                        } else if(propertyName == 'support') {
                            page.find('.myinfo_info_support').find(':input:radio[value="'+value+'"]').prop('checked' , true);
                        } else if(propertyName == 'career') {
                            page.find('.myinfo_info_career_input').find('option[value="'+value+'"]').prop('selected' , true);
                        } else if(propertyName == 'certList') {
                            var test  = value.replace('[' , '');
                            test  = test.replace(']' , '').replace(/\"/g, "");
                            var testarr = test.split(',');
                            for(var idx in testarr) {
                                page.find('input[data-val="'+testarr[idx]+'"]').prop('checked' , true);
                            }
                        } else if(propertyName == 'career_present') {
                            page.find('.myinfo_info_career_input_2').find('option[value="'+value+'"]').prop('selected' , true);
                        }
                    })

                    // TODO : 생년월일, 성별, 휴대전화

                    page.find('.myinfo_info_id_input').val(id);
                    page.find('.myinfo_info_name_input').val(name);
                    page.find('.myinfo_info_address2_input').val(address2)
                    // page.find('.myinfo_info_phone_select').find('option[value="' + mobile + '"]').prop('selected', true);

                    if(Lia.p(data, 'body', 'mobile_phone_number') == undefined) {
                        page.find('.myinfo_info_phone_input').prop('disabled' , false);
                        page.mobilePhoneNumber = undefined
                    } else {
                        page.find('.myinfo_info_phone_input').val(Lia.p(data, 'body', 'mobile_phone_number'));
                        page.mobilePhoneNumber = Lia.p(data, 'body', 'mobile_phone_number');
                    }

                    page.find('.myinfo_info_gender_select').find('option[value="' + gender + '"]').prop('selected', true);
                    page.find('.myinfo_info_birth_year_select').find('option[value="' + birth[0] + '"]').prop('selected', true);
                    page.find('.myinfo_info_birth_month_select').find('option[value="' + Number(birth[1]) + '"]').prop('selected', true);
                    page.find('.myinfo_info_birth_day_select').find('option[value="' + Number((birth[2].split(' '))[0]) + '"]').prop('selected', true);
                    page.find('.myinfo_info_address_input').val(address1);

                    // 이메일 처리
                    if(email != undefined && email != null) {
                        var email_id = Lia.pd('', email.split('@'), 0);
                        var email_domain = Lia.pd('', email.split('@'), 1);

                        if (Lia.contains(email_domain, 'naver.com', 'hanmail.net', 'hotmail.com', 'nate.com', 'nate.com', 'yahoo.co.kr', 'dreamwiz.com', 'korea.com', 'gmail.com')) {
                            page.find('.myinfo_info_email_input').val(email_id);
                            page.find('.myinfo_info_email_select').val(email_domain);
                        } else {
                            page.find('.myinfo_info_email_input').val(email);
                            page.find('.myinfo_info_email_select').val('1');
                        }
                    }

                    //TODO : 프로필 이미지
                    // var imgUrl = '';
                    // if(profileImg == undefined || profileImg == null) {
                    //     imgUrl = '/res/home/img/stop/common/img_profile.png'
                    // } else {
                    //     imgUrl = PathHelper.getFileUrl(profileImg);
                    //     // imgUrl = '/res/home/img/stop/common/img_profile.png'
                    // }
                    // page.find('.myinfo_info_img_view').css('background-image', 'url(' + imgUrl + ')');
                    // page.find('.myinfo_info_img_view').attr('image-url', profileImg);

                    //재직증명서

                    page.company_attachment_document_file_object = undefined;
                    page.company_attachment_document_file_name = undefined;
                    page.company_attachment_document_file_url = undefined;
                    page.company_attachment_document_file_checked = undefined;

                    if ( page.userpro != undefined ) {

                        for(var i in page.userpro) {
                            var prop = Lia.p(page.userpro , i);
                            if(Lia.p(prop , 'name') == "company_attachment_document_file") {

                                page.company_attachment_document_file = Lia.p(prop , 'value')
                                if ( String.isNotBlank(page.company_attachment_document_file) ) {
                                    page.company_attachment_document_file_object = Lia.p(Lia.convertStrToObj(page.company_attachment_document_file), 0);
                                    page.company_attachment_document_file_name = Lia.p(page.company_attachment_document_file_object,'original_filename');
                                    page.company_attachment_document_file_url = Lia.p(page.company_attachment_document_file_object,'url');
                                    page.company_attachment_document_file_url_old = Lia.p(page.company_attachment_document_file_object,'url');

                                }
                            } else if(Lia.p(prop , 'name') == "company_attachment_document_update_date") {
                                page.company_attachment_document_update_date = Lia.p(prop , 'value')
                            }

                            //company_attachment_document_file_checked 프로퍼티 존재하지 않을 때
                            if(Lia.p(prop , 'name') == 'company_attachment_document_file_checked') {
                                page.company_attachment_document_file_checked = Lia.p(prop , 'value');
                                console.log(page.company_attachment_document_file_checked)
                            } else {
                                page.company_attachment_document_file_checked = '0'
                            }
                        }

                    }


                    if(  page.company_attachment_document_file_object == undefined ) {
                        page.find('.myinfo_info_doc_download').css('display' , 'none');
                        page.find('.myinfo_info_doc_delete').css('display' , 'none');
                    } else {
                        page.find('.myinfo_info_company_doc_input').val(page.company_attachment_document_file_name);
                        page.find('.myinfo_info_doc_download').on('click', function () {
                            Lia.open(PathHelper.getFileUrl(page.company_attachment_document_file_url, page.company_attachment_document_file_name))
                        });
                    }

                    //기관명 ~
                    if(agName == '' || agName == undefined) {
                        page.find('.myinfo_info_fieldName_input').val('');
                    } else {
                        page.find('.myinfo_info_fieldName_input').val(agName);
                    }

                    //page.find('.myinfo_info_fieldName_input').val(agName); //기관 유형
                    //사용자 정의 기관유형일 경우

                    // page.propertyMap[propertyName]
                    if ( agPosition == UserPositionType.ETC ) {
                        page.find('.myinfo_info_position_input').find('option[value="10"]').prop('selected', true);
                        page.find('.myinfo_info_position').append('<input placeholder="직위 직접입력" class="myinfo_info_position_direct fw">');
                        page.find('.myinfo_info_position_direct').val(Lia.p(page.propertyMap, 'positionText'));
                    } else {

                        if(attrMap2[agPosition] != undefined) {
                            page.find('.myinfo_info_position_input').val(agPosition);
                        } else {
                            if(agPosition == undefined || String.isBlank(agPosition)) {
                                page.find('.myinfo_info_position_input').val("");
                            } else {
                                page.find('.myinfo_info_position_input').find('option[value="10"]').prop('selected', true);
                                page.find('.myinfo_info_position').append('<input placeholder="직위 직접입력" class="myinfo_info_position_direct fw">');
                                page.find('.myinfo_info_position_direct').val(agPosition);
                            }
                        }
                    }


                    page.find('.myinfo_info_tel_input').val(agPhone);
                    // if(agName == '' || agName == undefined) {
                    //     page.find('.myinfo_info_tel_input').val('');
                    // } else {
                    //
                    // }

                });
            }
        },

        sendUserInfo: function(user, userIdx, roleCode, studentTypeCode, statusCode, allowedToEnroll , userProperty) {
            var page = this;


            var pw = page.find('.myinfo_info_pw_input').val();
            var pwcheck = page.find('.myinfo_info_pwcheck_input').val();
            var name = page.find('.myinfo_info_name_input').val();
            var birth = page.find('.myinfo_info_birth_year_select option:selected').val() + '-' + page.find('.myinfo_info_birth_month_select option:selected').val()+'-'+page.find('.myinfo_info_birth_day_select option:selected').val();
            var gender = page.find('.myinfo_info_gender_select option:selected').val();
            var phone = page.find('.myinfo_info_phone_input').val();

            // 이메일 처리 및 공백 판단.
            var email = page.find('.myinfo_info_email_input').val();
            if ( String.isBlank(email) ) {
                PopupManager.alert('안내', '이메일을 입력하여 주십시오.');
                return;
            }
            
            if(page.find('.myinfo_info_email_select').val() != '1') {
                email += '@' + page.find('.myinfo_info_email_select').val();
            }

            //각종 정보 유무 판단
            var position = page.find('.myinfo_info_position_input option:selected').val();
            if ( String.isBlank(position) ) {
                PopupManager.alert('안내', '직위를 선택하여 주십시오.');
                return;
            }

            var agTypeDp1 = page.find('.myinfo_info_field_depth1_input option:selected').val();
            if ( String.isBlank(agTypeDp1) ) {
                PopupManager.alert('안내', '기관 유형을 선택하여 주십시오.');
                return;
            }

            var agTypeDp2 = page.find('.myinfo_info_field_depth2_input option:selected').val();
            var agTypeDp2Display = page.find('.myinfo_info_field_depth2_input').css('display');
            if(agTypeDp2Display != 'none' && String.isBlank(agTypeDp2)) {
                PopupManager.alert('알림' , '기관유형 소분류를 선택하셔야 합니다.');
                return;
            }

            var agName = page.find('.myinfo_info_fieldName_input').val();
            if ( String.isBlank(agName) ) {
                PopupManager.alert('알림' , '기관명을 입력하여 주십시오.');
                return;
            }

            var agAddress = page.find('.myinfo_info_address_input').val();
            if ( String.isBlank(agAddress) ) {
                PopupManager.alert('알림' , '기관 주소를 입력하여 주십시오.');
                return;
            }

            var agAddress2 = page.find('.myinfo_info_address2_input').val();
            if ( String.isBlank(agAddress2) ) {
                PopupManager.alert('알림' , '기관 주소 상세를 입력하여 주십시오.');
                return;
            }

            var agPhone = page.find('.myinfo_info_tel_input').val();
            if ( String.isBlank(agPhone) ) {
                PopupManager.alert('알림' , '기관 연락처를 입력하여 주십시오.');
                return;
            }

            var career = page.find('.myinfo_info_career_input').val();
            if ( String.isBlank(career) ) {
                PopupManager.alert('알림' , '여성폭력방지기관 총 경력 사항을 선택하여 주십시오.');
                return;
            }

            var career_present = page.find('.myinfo_info_career_input_2').val();
            if ( String.isBlank(career_present) ) {
                PopupManager.alert('알림' , '현 기관 총 경력사항을 선택하여 주십시오.');
                return;
            }

            var support = page.find(":input:radio[name=support]:checked").val();
            var profileImageUrl = page.find('.myinfo_info_img_view').attr('image-url');

            var certList = [];
            var certCheckList = page.find('.myinfo_info_cert input:checkbox');
            for(var i=0; i<certCheckList.length; i++){
                var cert = $(certCheckList[i]);
                if(cert.prop('checked')) {
                    certList.push(cert.attr('data-val'));
                }
            }

            //직위 기타 선택 후 직접 입력 시
            var positionText = '';
            if(position == UserPositionType.ETC) {
                positionText = page.find('.myinfo_info_position_direct').val();

                if ( String.isBlank(positionText) ) {
                    PopupManager.alert('알림' , '직위 직접입력 사항을 입력하여 주십시오,');
                    return;
                }
            }

            //editUserProfile
            //EDIT_USER_ADDITIONAL_INFO
            page.propertyMap['address_1_detail'] = agAddress2;
            page.propertyMap['agTypeDp'] = agTypeDp1;

            if ( String.isNotBlank(agTypeDp2) ) {
                page.propertyMap['agTypeDp2'] = agTypeDp2;
            }

            page.propertyMap['support'] = support;
            page.propertyMap['career'] = career;
            page.propertyMap['certList'] = certList;
            page.propertyMap['career_present'] = career_present;
            page.propertyMap['positionText'] = positionText;


            if(String.isNotBlank(page.company_attachment_document_file_url)) {

                page.company_attachment_document_file = JSON.stringify([{
                    original_filename : page.company_attachment_document_file_name,
                    url : page.company_attachment_document_file_url
                }]);

                //재직증명서가 존재하면, checked 프로퍼티 초기화
                page.propertyMap['company_attachment_document_file'] = page.company_attachment_document_file;
                page.propertyMap['company_attachment_document_file_checked'] = page.company_attachment_document_file_checked;
            } else {

                PopupManager.alert('안내', '현 소속기관 재직 확인 서류를 첨부하여 주십시오.');
                return;
            }

            if ( String.isNotBlank(page.company_attachment_document_update_date) ) {
                page.propertyMap['company_attachment_document_update_date'] = page.company_attachment_document_update_date;
            } else {
                delete page.propertyMap['company_attachment_document_update_date'];
            }
            
            //기관명 및 재직증명서 변경시 checked 초기화
            if(agName != page.agName || page.company_attachment_document_file_url != page.company_attachment_document_file_url_old) {
                page.propertyMap['company_attachment_document_file_checked'] = '0'
            }

            var properties = [];

             for(var propertyName in page.propertyMap) {
                 properties.push({
                     name : propertyName,
                     value : page.propertyMap[propertyName]
                 });
             }

            var userProfile = {
                name : name,
                password : pwcheck,
                address1: agAddress,
                address2: agAddress2,
                genderCode : gender,
                companyName : agName,
                companyPosition : position,
                email : email,
                mobilePhoneNumber : page.mobilePhoneNumber == undefined ? phone : page.mobilePhoneNumber,
                dateOfBirth : birth,
                officePhoneNumber : agPhone,
                properties : JSON.stringify(properties),
                receiveEmail : Lia.p(user, 'receive_email'),
                receiveTextMessage : Lia.p(user, 'receive_text_message'),
                receivePushMessage :Lia.p(user, 'receive_push_message'),
                receiveOtherMessage :Lia.p(user, 'receive_other_message')
            }

            userProfile.idx = userIdx;
            userProfile.roleCode = roleCode;
            userProfile.studentTypeCode = studentTypeCode;
            userProfile.statusCode = statusCode;
            userProfile.allowedToEnroll = allowedToEnroll;

            if(profileImageUrl != undefined && String.isNotBlank(profileImageUrl)) {
                userProfile.profileImageUrl = profileImageUrl;
            }

            if(pw!=null && pwcheck != null) {
                if (pw !== pwcheck) {
                    PopupManager.alert('알림', '비밀번호와 확인란이 다릅니다. 비밀번호를 확인해주세요.');
                    return;
                }
            }
                PopupManager.alert('안내','저장 하시겠습니까?', function() {

                    Requester.awb(ApiUrl.User.EDIT_USER_PROFILE, userProfile , function (status, data) {
                        if ( !status ) { return; }

                        PopupManager.alert('안내', '성공적으로 저장되었습니다.', function (){

                            var courseId = PageManager.pc('course_id');
                            if ( String.isNotBlank(courseId) ) {
                                PageManager.go(['course_detail'], {
                                    course_id : courseId
                                });
                            } else {
                                PageManager.go(['user/check_pw']);
                            }
                        });
                    });

                }, true);



        },

        loadDaumMap: function () {
            new daum.Postcode({
                oncomplete: function (data) {
                    // TODO : Daum Map
                }
            })
        },

        loadBasicFormSetting : function () {
            var page = this;

            /*==========기본정보*==========*/
            //생년월일
            var date = new Date();
            var year = page.find('.myinfo_info_birth_year_select');
            var month = page.find('.myinfo_info_birth_month_select');
            var day = page.find('.myinfo_info_birth_day_select');
            for(var i=date.getFullYear(); i>=1910; i--) {
                var item = $('<option></option>');
                item.text(i+'년');
                item.attr('value' , i)
                year.append(item);
            }
            for(var i = 1;  i <= 12; i++) {
                var item = $('<option></option>');
                item.text(i+'월');
                item.attr('value' , i)
                month.append(item);
            }
            for(var i=1; i<=31; i++) {
                var item = $('<option></option>');
                item.text(i+'일');
                item.attr('value' , i)
                day.append(item);
            }

            //성별
            var gender = page.find('.myinfo_info_gender_select');
            gender.append('<option value="" disabled selected>선택</option>')
            gender.append('<option value="1">남</option>');
            gender.append('<option value="2">여</option>');
            gender.append('<option value="3">기타</option>');


            //재직증명서
            var jProfile = page.find('.myinfo_info_company_doc');
            {
                $.initFileUploader(jProfile, {
                    maxFileCount: 1,
                    allowedExtensionList: "jpg,jpeg,png,pdf,bmp",
                    onUploaded: function(fileObj){
                        var url = Lia.p(fileObj , 0, 'url');
                        var fileName = Lia.p(fileObj , 0, 'original_filename');
                        // var url = PathHelper.getFileUrl(file);

                        //기존 재직증명서와 다를때
                        if(url != page.company_attachment_document_file_url) {
                            page.company_attachment_document_file_checked = '0'
                        }

                        page.company_attachment_document_file_url = url
                        page.company_attachment_document_file_name = fileName
                        page.company_attachment_document_update_date = new Date();

                        page.find('.myinfo_info_company_doc_input').val(fileName)

                        if(String.isNotBlank(page.company_attachment_document_file_name)  && String.isNotBlank(page.company_attachment_document_file_url)) {
                            page.find('.myinfo_info_doc_download').css('display', 'inline-block');
                            page.find('.myinfo_info_doc_delete').css('display', 'inline-block');
                        }
                    }
                });
            }


            page.find('.myinfo_info_doc_upload').on('click' , function() {
                jProfile.find('.file_uploader input[type="file"]').trigger('click');
            });

            page.find('.myinfo_info_doc_delete').on('click' , function() {
                jProfile.find('.file_uploader_item_delete_button').trigger('click');
                page.find('.myinfo_info_company_doc_input').val('')
                page.company_attachment_document_update_date = page.company_attachment_document_file_url = page.company_attachment_document_file_name = ''
                page.company_attachment_document_file_checked = '0'
            });

            /*==========기본정보*==========*/

            /*==========추가정보==========*/
            //기관 유형
            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST , {
                categoryCode : '소속기관'
            }, function(status, data) {
                var fieldDepth1 = page.find('.myinfo_info_field_depth1_input');
                var fieldDepth2 = page.find('.myinfo_info_field_depth2_input');

                 fieldDepth1.append('<option value="" selected>선택</option>');
                 fieldDepth2.append('<option value="" selected>선택</option>');

                var list = Lia.p(data, 'body','list');

                //기관유형 Depth1
                for(var idx in list) {
                    var item = list[idx];
                    if(Lia.p(item , 'depth') == 1) {
                        var optionTitle = Lia.p(item , 'name');
                        var option = $('<option>'+optionTitle+'</option>');
                        option.attr('value' , Lia.p(item , 'id'));
                        fieldDepth1.append(option);
                    }
                }


                //기관유형 Depth2
                fieldDepth1.change(function (e) {
                    var jThis = $(this);
                    var fieldDepth2 = page.find('.myinfo_info_field_depth2_input');

                    fieldDepth2.empty();
                    var dp1Value = jThis.val();

                    if(dp1Value == 66) {
                        fieldDepth2.hide();
                        return;
                    }

                    fieldDepth2.append('<option value="" disabled selected>선택</option>');
                    for(var idx in list) {
                        var item = list[idx];
                        if(Lia.p(item, 'depth') == 2 && Lia.p(item, 'parent_id') == dp1Value) {
                            var optionTitle = Lia.p(item , 'name');
                            var option = $('<option>'+optionTitle+'</option>');
                            option.attr('value' , Lia.p(item , 'id'));
                            fieldDepth2.append(option);
                        }
                    }

                    if(fieldDepth2.find('option').length == 1) {
                        fieldDepth2.hide();
                    } else {
                        fieldDepth2.show();
                    }
                })
            })

            //직위
            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST , {
                categoryCode : '직위'
            } , function(status, data) {
                var position = page.find('.myinfo_info_position_input');
                position.append('<option value="" selected>선택</option>')
                var list = Lia.p(data, 'body','list');
                for(var idx in list) {
                    var item = list[idx];
                    if(Lia.p(item , 'depth') == 1) {
                        var optionTitle = Lia.p(item , 'name');
                        var option = $('<option value="'+ Lia.p(item, 'id') +'">' + optionTitle + '</option>');
                        position.append(option);
                    }
                }
            })

            page.find('.myinfo_info_position_input').on('change' , function () {
                var posValue = page.find('.myinfo_info_position_input option:selected').val();
                if(posValue == 10) {
                    page.find('.myinfo_info_position').append('<input type="text" placeholder="직위 직접입력" class="myinfo_info_position_direct fw">')
                } else {
                    page.find('.myinfo_info_position_direct').remove();
                }
            })


            //경력
            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST , {
                categoryCode : '경력'
            } , function(status, data) {
                var career = page.find('.myinfo_info_career_input');
                var career_present = page.find('.myinfo_info_career_input_2')
                career.append('<option value="" selected>선택</option>');
                career_present.append('<option value="" selected>선택</option>');

                var list = Lia.p(data, 'body','list');
                for(var idx in list) {
                    var item = list[idx];

                        var optionTitle = Lia.p(item , 'name');
                        var option = $('<option>'+optionTitle+'</option>');
                        var option2 = $('<option>'+optionTitle+'</option>');
                        option.attr('value' , Lia.p(item , 'id'));
                        option2.attr('value' , Lia.p(item, 'id'));

                        career_present.append(option2);
                        career.append(option);
                }
            })

            /*==========추가정보==========*/
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