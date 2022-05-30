(function () {

    return {

        idChk : false,
        onInit: function (j) {

            var page = this;

            page.termsOfServiceItemIdList = INDEX.getAgreementList();
            page.idProperties = Lia.pd('', INDEX.getIDProperties());

            if ( String.isBlank(page.idProperties) ) {
                PopupManager.alert('안내', '잘못된 접근입니다.', function(){
                    Lia.redirect('/');
                });
                return;
            }

            page.loadBasicFormSetting();

            if ( String.isNotBlank(page.idProperties) ) {
                page.idPropertyMap = JSON.parse(page.idProperties);
            }

            var idProp = JSON.parse(page.idProperties);

            page.loadCertReturn(idProp);

            page.find("#id").on("focusout", function (e) {
                page.validateId();
            });

            page.find("#pswd1").on("focusout", function (e) {
                page.validatePassword();
            });
            page.find("#pswd2").on("focusout", function (e) {

                page.validateConfirmPassword();
            });
            page.find("#name").on("focusout", function (e) {
                page.validateName();
            });

            //생년월일 년도
            page.find("#yy, #mm, #dd").on("focusout", function (e) {

                var isYy = page.checkBirthYy();
                var isMm = false;
                var isDd = false;
                if( isYy ){
                    isMm = page.checkBirthMm();
                }else{
                    return;
                }
                if( isMm ){
                    isDd = page.checkBirthDd();
                }else{
                    return;
                }

                if( isDd){
                    page.find("#birthdayMsg").hide();
                }else{
                }

            });

            page.find("#gender").on("focusout", function (e) {
                var jThis = $(this);
                if( String.isBlank(jThis.val()) || jThis.val() =="") {
                    page.find("#genderMsg").html("지정성별을 선택해주세요.").show();
                }else{
                    page.find("#genderMsg").hide();
                }
            });

            page.find("#phoneNo").on("focusout", function (e) {
                var jThis = $(this);
                if( String.isBlank(jThis.val()) || jThis.val() =="") {
                    page.find("#phoneNoMsg").html(Strings.getString(Strings.POPUP_MESSAGE.ENTER_PHONE_NUMBER)).show();
                }else{
                    page.find("#phoneNoMsg").hide();
                }
            });


            page.find('#email, #email_code').on("focusout", function(){
                page.validateEmail();
            });

            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();

                page.validateId();


                Requester.func(function () {
                    var jForm = page.find('#join_form');
                    var fs = new jQuery.FormSerializer();
                    var termMap = fs.serialize(jForm);


                    if (!page.idValidationResult) {

                        page.find('#id').focus();
                        return;
                    }

                    if (!page.validatePassword()) {
                        page.find('#pswd1').focus();
                        return;
                    }

                    if (!page.validateConfirmPassword()) {
                        page.find('#pswd2').focus();
                        return;
                    }

                    if (!page.validateName()) {
                        page.find('#name').focus();
                        return;
                    }

                    if( !page.validateEmail()){
                        page.find('#email').focus();
                        return;
                    }


                    //이메일
                    var email = page.find("#email").val();
                    var emailCode = page.find("#email_code").val();
                    if ( emailCode != 1) {
                        email = email + "@" + emailCode;
                    }

                    if (!Lia.checkValidEmail(email)) {
                        page.find('#emailMsg').text('이메일을 정확히 입력해 주시길 바랍니다.').show();
                        return;
                    }

                    termMap['email'] = email;

                    //생년월일
                    var birthYy = page.find('#yy').val();
                    var birthMm = page.find('#mm').val();
                    var birthDd = page.find('#dd').val();

                    if (String.isNullOrWhitespace(birthYy) || String.isNullOrWhitespace(birthMm) || String.isNullOrWhitespace(birthDd)) {
                        page.find('#birthdayMsg').text(Strings.getString(Strings.POPUP_MESSAGE.ENTER_YEAR_OF_BIRTH)).show();
                        return;
                    }
                    page.find('#birthdayMsg').text("").hide();

                    var dateOfBirth =birthYy +"-"+ birthMm +"-"+ birthDd;

                    var currentDate = new Date();
                    var currentYear = currentDate.toString('yyyy');
                    if ( parseInt(currentYear) < parseInt(birthYy) + 14 ) {
                        page.find('#birthdayMsg').text('14세 이상만 가입이 가능합니다.').show();
                        return false;
                    }

                    termMap['dateOfBirth'] = dateOfBirth;

                    //성별
                    if ( String.isNullOrWhitespace(termMap['genderCode']) ) {

                        page.find('#genderMsg').html('성별을 선택해 주세요').show();
                        return;

                    } else {
                        page.find('#genderMsg').html('').hide();
                    }

                    //휴대전화

                    var phoneNo = page.find('#phoneNo').val();
                    if (String.isNullOrWhitespace(phoneNo)) {
                        page.find('#phoneNoMsg').text(Strings.getString(Strings.POPUP_MESSAGE.ENTER_PHONE_NUMBER)).show();
                        return;
                    }
                    if (phoneNo.length < 10) {
                        page.find('#phoneNoMsg').text(Strings.getString(Strings.POPUP_MESSAGE.INVALID_PHONE_NUMBER)).show();
                        return;
                    }
                    page.find('#phoneNoMsg').text("").hide();
                    termMap['mobilePhoneNumber'] = phoneNo;

                    var properties = [];
                    if ( Array.isNotEmpty(page.idPropertyMap) ){

                        for ( var key in page.idPropertyMap ) {

                            var value = page.idPropertyMap[key];
                            properties.push({
                                'name' : key,
                                'value' : value
                            });
                        }
                    }

                    //메일수신여부
                    var receiveEmail = 0;
                    if(page.find('.email_send_agree').prop('checked')) {
                        receiveEmail = 1;
                    } else {
                        receiveEmail = 0;
                    }

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
                            PopupManager.alert('알림' , '직위 직접입력 사항을 입력하여 주십시오.');
                            return;
                        }
                    }


                    var institutionId = null
                    institutionId = Server.institutionId;
                    if(institutionId == null || institutionId == undefined) {
                        institutionId = Institution.id;
                    }

                    properties.push({ name : 'address_1_detail', value : agAddress2})
                    properties.push({ name : 'agTypeDp', value : agTypeDp1})

                    if ( String.isNotBlank(agTypeDp2) ) {
                        properties.push({ name : 'agTypeDp2', value : agTypeDp2})
                    }

                    properties.push({ name : 'support', value : support})
                    properties.push({ name : 'career', value : career})
                    properties.push({ name : 'certList', value : certList})
                    properties.push({ name : 'career_present', value : career_present})
                    properties.push({ name : 'positionText', value : positionText})

                    if(String.isNotBlank(page.company_attachment_document_file_url)) {

                        page.company_attachment_document_file = JSON.stringify([{
                            original_filename : page.company_attachment_document_file_name,
                            url : page.company_attachment_document_file_url
                        }]);

                        //재직증명서가 존재하면, checked 프로퍼티 초기화
                        properties.push({ name : 'company_attachment_document_file' , value : page.company_attachment_document_file})
                        properties.push({ name : 'company_attachment_document_file_checked', value : '0'})
                    } else {

                        PopupManager.alert('안내', '현 소속기관 재직 확인 서류를 첨부하여 주십시오.');
                        return;
                    }

                    if ( String.isNotBlank(page.company_attachment_document_update_date) ) {
                        properties.push({ name : 'company_attachment_document_update_date', value : page.company_attachment_document_update_date})
                    }

                    termMap['properties'] =  JSON.stringify(properties);
                    termMap['receiveTextMessage'] =  receiveEmail;
                    termMap['receiveEmail'] =  receiveEmail;
                    termMap['receivePushMessage'] =  receiveEmail;
                    termMap['receiveOtherMessage'] =  receiveEmail;
                    termMap['language'] = "";


                    termMap['companyName'] = agName
                    termMap['address1'] = agAddress
                    termMap['address2'] = agAddress2
                    termMap['companyPosition'] = position
                    termMap['officePhoneNumber'] = agPhone
                    //organizationId === institutionId ?
                    // termMap['organizationId'] = institutionId;
                    
                    // 추가정보 수정으로 갈 수 있도록 함
                    termMap['autoLoginAfterRegistration'] = 1;
                    termMap['termsOfServiceItemIdList'] = page.termsOfServiceItemIdList;

                    Requester.ajaxWithoutBlank(ApiUrl.User.SIGN_UP, termMap, function (status, data, request) {

                        if (status != Requester.Status.SUCCESS) {
                            return;
                        }

                        // 한번 리프레시 이후에 들어 갈 수 있도록
                        var idVal = page.find('#id').val();
                        var nameVal = page.find('#name').val();
                        window.location.href = '/?m1=user&m2=join4&id=' + idVal + '&name=' + Lia.encodeUri(nameVal);
                        // PageManager.go(["user", 'join4'], { name : page.find('#id').val()});

                    });
                });


            });

        },

        loadCertReturn: function (idProp) {
            var page = this;

            var name = Lia.pd('' , idProp, 'name');
            var gender = Lia.pd('',idProp ,'gender') == '1' ? '1' : '2';
            var dateOfBirth = Lia.pd('', idProp ,'dateOfBirth');
            var mobileNo = Lia.pd('',idProp, 'mobileNo');

            if(String.isNotBlank(name)) {
                page.find('#name').val(name).attr('disabled', true);
            }

            if(String.isNotBlank(gender)) {
                page.find('#gender').val(gender);
            }

            // 생년월일 : YYYYMMDD
            if(String.isNotBlank(dateOfBirth)) {
                page.find('#yy').val(dateOfBirth.substring(0, 4)).attr('disabled', true);
                page.find('#mm').val(dateOfBirth.substring(4, 6)).attr('disabled', true);
                page.find('#dd').val(dateOfBirth.substring(6, 8)).attr('disabled', true);
            }

            if(String.isNotBlank(mobileNo)) {
                page.find('#phoneNo').val(mobileNo).attr('disabled', true);
            }

        },

        checkBirthYy : function(j){
            var page =this;
            var jThis = page.find("#yy");
            if( String.isBlank(jThis.val()) || (jThis.val().length != 4)) {
                page.find("#birthdayMsg").html(Strings.getString(Strings.POPUP_MESSAGE.ENTER_YEAR_OF_BIRTH)).show();
                return false;
            }else{
                page.find("#birthdayMsg").hide();
                return true;
            }

        },
        checkBirthMm : function(){
            var page = this;
            var jThis = page.find("#mm");
            if( String.isBlank(jThis.val())) {
                page.find("#birthdayMsg").html("태어난 월을 선택하세요.").show();
                return false;
            }else{
                page.find("#birthdayMsg").hide();
                return true;
            }
        },
        checkBirthDd : function(){
            var page = this;
            var jThis = page.find("#dd");
            if( String.isBlank(jThis.val())) {
                page.find("#birthdayMsg").html("태어난 일(날짜) 2자리를 정확하게 입력하세요.").show();
                return false;
            }else{
                page.find("#birthdayMsg").hide();
                return true;
            }
        },
        validateId: function () {

            var page = this;

            var id = page.find('#id').val();


            if (String.isNullOrWhitespace(id)) {

                page.find('#idMsg').text(Strings.getString(Strings.POPUP_MESSAGE.ENTER_USER_ID)).show();
                page.idValidationResult = false;
                return;
            }

            

            var idReg =  /^[A-Za-z]+[A-Za-z0-9]{4,14}$/g;
            if(!idReg.test(id)) {
                page.find('#idMsg').text('아이디는 영문으로 시작해야 하며, 5~15자 영문자 또는 숫자이어야 합니다.').show();
                page.idValidationResult = false;
                return;
            } else {
                page.find('#idMsg').hide();
            }

            Requester.ajaxWithoutBlank(ApiUrl.User.VALIDATE_ID, {
                serviceProviderId: Server.serviceProviderId,
                id: id
            }, function (status, data, request) {

                if (status != Requester.Status.SUCCESS) {

                    page.find('#idMsg').text('사용할 수 없는 아이디입니다.').show();
                    page.idValidationResult = false;
                    return;
                }

                page.find('#idMsg').text('').hide();
                page.idValidationResult = true;

            }, {
                autoPopup: false
            });
        },
        validatePassword: function () {

            var page = this;

            var password = page.find('#pswd1').val();

            if (String.isNullOrWhitespace(password)) {

                page.find('#pswd1Msg').text(Strings.getString(Strings.POPUP_MESSAGE.ENTER_PASSWORD)).show();
                return false;
            }

            if (password.length < 9) {

                page.find('#pswd1Msg').text(Strings.getString(Strings.POPUP_MESSAGE.INVALID_PASSWORD)).show();
                return false;
            }

            var pwNum = password.search(/[0-9]/g);
            var pwEng = password.search(/[a-z]/ig);

            var spe = /[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi;
            var pwSpe = password.search(spe);

            if (pwNum < 0 || pwEng < 0 || pwSpe < 0) {

                page.find('#pswd1Msg').text(Strings.getString(Strings.POPUP_MESSAGE.INVALID_PASSWORD)).show();
                return false;
            }

            page.find('#pswd1Msg').text('').hide();
            return true;
        },
        validateConfirmPassword: function () {

            var page = this;

            var password = page.find('#pswd1').val();
            var confirmPassword = page.find('#pswd2').val();

            if ( password != confirmPassword ) {
                page.find('#pswd2Msg').text('비밀번호가 일치하지 않습니다.').show();
                return false;
            }

            page.find('#pswd2Msg').text('').hide();
            return true;
        },
        validateName: function () {

            var page = this;

            var name = page.find('#name').val();

            if (String.isNullOrWhitespace(name)) {

                page.find("#nameMsg").html(Strings.getString(Strings.POPUP_MESSAGE.ENTER_FULL_NAME)).show();
                return false;
            }

            page.find('#nameMsg').text('').hide();
            return true;
        },
        validateEmail : function(){

            var page = this;

            var email = page.find('#email').val();

            if( String.isNullOrWhitespace((email))){
                page.find("#emailMsg").html(Strings.getString(Strings.POPUP_MESSAGE.ENTER_EMAIL)).show();
                return;
            }else{
                page.find("#emailMsg").html("").hide();
            }

            if(page.find('#email_code').val()== '1'){

                if( !Lia.checkValidEmail(email)){
                    page.find("#emailMsg").html("이메일을 선택해주세요.").show();
                    return false;
                }else{
                    page.find("#emailMsg").html("").hide();
                    return true;
                }
            }else{

                var email = email +"@"+ page.find('#email_code').val();
                if( !Lia.checkValidEmail(email)){
                    page.find("#emailMsg").html(Strings.getString(Strings.POPUP_MESSAGE.INVALID_EMAIL)).show();
                    return false;
                }else{
                    page.find("#emailMsg").html("").hide();
                    return true;
                }

            }

            page.find('#emailMsg').text('').hide();
            return true;
        },
        loadBasicFormSetting : function () {
            var page = this;

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

                        page.company_attachment_document_file_url = url
                        page.company_attachment_document_file_name = fileName
                        page.company_attachment_document_update_date = new Date();

                        page.find('.myinfo_info_company_doc_input').val(fileName)

                        if(String.isNotBlank(page.company_attachment_document_file_name)  && String.isNotBlank(page.company_attachment_document_file_url)) {
                            page.find('.myinfo_info_doc_download').css('display', 'inline-block');
                            page.find('.myinfo_info_doc_delete').css('display', 'inline-block');

                            page.find('.myinfo_info_doc_download').on('click', function () {
                                Lia.open(PathHelper.getFileUrl(page.company_attachment_document_file_url, page.company_attachment_document_file_name))
                            });
                        }
                    }
                });
            }

            //fileUploadCategoryCode Change
            page.find('.file_uploader input[name="categoryCode"]').val(UploadedFileCategory.PUBLIC);

            page.find('.myinfo_info_doc_upload').on('click' , function() {
                jProfile.find('.file_uploader input[type="file"]').trigger('click');
            });

            page.find('.myinfo_info_doc_delete').on('click' , function() {
                jProfile.find('.file_uploader_item_delete_button').trigger('click');
                page.find('.myinfo_info_company_doc_input').val('')
                page.company_attachment_document_update_date = page.company_attachment_document_file_url = page.company_attachment_document_file_name = ''
                page.company_attachment_document_file_checked = '0'
            });


            //기관 주소
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


        onChange: function (j) {

            var page = this;

        },


        onRelease: function (j) {

            var page = this;
        },
        onResize : function() {

            var page = this;
        }
    };
})();