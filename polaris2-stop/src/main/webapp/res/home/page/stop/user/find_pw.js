(function () {

    return {

        idChk : false,
        onInit: function (j) {
            var page = this;

            // PopupManager.alert('준비중', '현재 비밀번호 찾기 기능은 준비중입니다.<br/>빠른 서비스 제공을 위해 노력하겠습니다.');

            page.find("#id").on("focusout", function (e) {
                page.validateId();
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

            page.find("#phoneNo").on("focusout", function (e) {
                var jThis = $(this);
                var emailVal = page.find('#email').val();
                if( String.isBlank(jThis.val()) || jThis.val() =="") {
                    if( String.isNullOrWhitespace(emailVal))
                        page.find("#phoneNoMsg").html(Strings.getString(Strings.POPUP_MESSAGE.ENTER_PHONE_NUMBER)).show();
                }else{
                    page.find("#phoneNoMsg").hide();
                }
            });


            page.find('#email, #email_code').on("focusout", function(){
                page.validateEmail();
            });

            page.find(".bottom_find.id").on("click", function (e) {
                e.preventDefault();
                PageManager.go(["user", 'find_id']);
            });
            page.find(".btn_default").on("click", function (e) {
                e.preventDefault();
                PageManager.go(["user", 'login']);
            });

            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();


                var termMap = {};

                if (!page.idValidationResult) {

                    page.find('#id').focus();
                    return;
                }

                termMap["id"] =page.find('#id').val();

                if (!page.validateName()) {
                    page.find('#name').focus();
                    return;
                }

                termMap["name"] =page.find('#name').val();

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
                termMap['dateOfBirth'] = dateOfBirth;

                var email = page.find("#email").val();
                var emailCode = page.find("#email_code").val();
                if ( emailCode != 1) {
                    email = email + "@" + emailCode;
                }

                if ( String.isBlank(email) ) {
                    page.find('#emailMsg').text('이메일을 입력하여 주십시오.').show();
                    return;
                }

                if (!Lia.checkValidEmail(email)) {
                    page.find('#emailMsg').text('이메일 형식에 맞게 입력하여 주십시오.').show();
                    return;
                }

                page.find('#emailMsg').hide();

                termMap['email'] = email;

                // var phoneNo = page.find('#mobile_prefix').val() + page.find('#phoneNo').val();
                // if (String.isNullOrWhitespace(phoneNo)) {
                //
                //     if (!String.isNotNullOrWhitespace(email)) {
                //         page.find('#phoneNoMsg').text(Strings.getString(Strings.POPUP_MESSAGE.ENTER_PHONE_NUMBER)).show();
                //         return;
                //     }
                //
                // }
                // if (!String.isNotNullOrWhitespace(phoneNo)) {
                //     if (phoneNo.length < 10) {
                //         if (!String.isNotNullOrWhitespace(email)) {
                //             page.find('#phoneNoMsg').text(Strings.getString(Strings.POPUP_MESSAGE.INVALID_PHONE_NUMBER)).show();
                //             return;
                //         }
                //     }
                // }
                // page.find('#phoneNoMsg').text("").hide();
                // termMap['mobilePhoneNumber'] = phoneNo;

                PopupManager.alert('안내', '입력하신 정보로 비밀번호 초기화를 진행 하시겠습니까?<br/>초기화 된 비밀번호는 이메일로 전송됩니다.', function() {

                    //ApiUrl.User.RESET_USER_PASSWORD
                    Requester.ajaxWithoutBlank(ApiUrl.User.RESET_USER_PASSWORD, termMap, function (status, data, request) {

                        if (status != Requester.Status.SUCCESS) {
                            return;
                        }

                        
                        PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO),
                            "초기화된 비밀번호가 입력하신 이메일로 전송 되었습니다.", function () {
                                Lia.refresh();
                            } );

                    });

                }, true);

            });

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

            page.find('#idMsg').text('').hide();
            page.idValidationResult = true;

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
            var phoneNo = page.find('#mobile_prefix').val() + page.find('#phoneNo').val();

            if( String.isNullOrWhitespace((email))){
                if (!String.isNotNullOrWhitespace(phoneNo)) {
                    page.find("#emailMsg").html(Strings.getString(Strings.POPUP_MESSAGE.ENTER_EMAIL)).show();
                    return;
                }
            }else{
                page.find("#emailMsg").html("").hide();
            }

            if(page.find('#email_code').val()== '1'){

                if( !Lia.checkValidEmail(email)){
                    if (!String.isNotNullOrWhitespace(phoneNo)) {
                        page.find("#emailMsg").html("이메일을 선택해주세요.").show();
                        return false;
                    }
                }else{
                    page.find("#emailMsg").html("").hide();
                    return true;
                }
            }else{

                var email = email +"@"+ page.find('#email_code').val();
                if( !Lia.checkValidEmail(email)){
                    if (!String.isNotNullOrWhitespace(phoneNo)) {
                        page.find("#emailMsg").html(Strings.getString(Strings.POPUP_MESSAGE.INVALID_EMAIL)).show();
                        return false;
                    }
                }else{
                    page.find("#emailMsg").html("").hide();
                    return true;
                }

            }

            page.find('#emailMsg').text('').hide();
            if (!String.isNotNullOrWhitespace(phoneNo)) {
                page.find('#phoneNoMsg').text("").hide();
            }
            return true;
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