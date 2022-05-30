(function () {

    return {

        idChk : false,
        onInit: function (j) {
            var page = this;

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
            page.find(".bottom_find.pw").on("click", function (e) {
                e.preventDefault();
                PageManager.go(["user", 'find_pw']);
            });
            page.find(".btn_default").on("click", function (e) {
                e.preventDefault();
                PageManager.go(["user", 'login']);
            });

            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();

                var jForm = page.find('#join_form');
                var fs = new jQuery.FormSerializer();
                var termMap = fs.serialize(jForm);


                if (!page.validateName()) {
                    page.find('#name').focus();
                    return;
                }


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
                    page.find('#birthdayMsg').text('Only 14 years of age or older can sign up.').show();
                    return false;
                }

                termMap['dateOfBirth'] = dateOfBirth;


                var phoneNo = page.find('#mobile_prefix').val() + page.find('#phoneNo').val();
                var email = page.find("#email").val();
                var emailCode = page.find("#email_code").val();
                if ( emailCode != 1) {
                    email = email + "@" + emailCode;
                }

                // 이메일 또는 휴대전화번호 중 하나만 입력되면 검사통과

                if(String.isNotBlank(email)) {
                    if (!Lia.checkValidEmail(email)) {
                        if (!String.isNotNullOrWhitespace(phoneNo)) {
                            page.find('#emailMsg').text('Please enter a valid email address to receive a confirmation letter.').show();
                            return;
                        }
                    }
                    termMap['email'] = email;
                }

                if(String.isNotBlank(phoneNo) && phoneNo.length >= 10) {
                    if(page.validateName)
                    termMap['mobilePhoneNumber'] = phoneNo;
                }

                if(String.isBlank(email) && phoneNo.length < 10) {
                    PopupManager.alert('안내', '아이디 찾기를 하시려면 <br/>휴대폰 번호와 이메일 중 택1 하여 입력해주세요.');
                    return false;
                }


                Requester.ajaxWithoutBlank(ApiUrl.User.FIND_USER_ID, termMap, function (status, data, request) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    var list = Lia.p(data, 'body', 'list');

                    if( list != undefined){

                        var searchUser = list[0];
                        var searchUserId = searchUser['id'];
                        PopupManager.alert(Strings.getString(Strings.SELECT_OPTION.SEARCH_BY_USER_ID),
                            "회원님이 가입하신 아이디는<br/>" + searchUserId +" 입니다.", 
                            function () {
                                PageManager.go(['user', 'login']);
                            }, function () {
                                PageManager.go(['user', 'find_pw']);
                            }, '로그인', '비밀번호 찾기' );
                    }
                });


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

            // 직접 입력인 경우
            if(page.find('#email_code').val()== '1'){

                if( !Lia.checkValidEmail(email)){
                    if (!String.isNotNullOrWhitespace(email)) {
                        page.find("#emailMsg").html("이메일을 작성해주세요.").show();
                        return false;
                    } else {
                        page.find("#emailMsg").html("적합한 이메일 형식이 아닙니다.").show();
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