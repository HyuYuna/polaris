(function () {

    return {

        idChk : false,
        onInit: function (j) {
            var page = this;

            page.find('#join_form').on('submit', function (e){
                e.preventDefault();
                page.find(".btn_primary").trigger('click');
            })

            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();
                var password = page.find('#password').val();

                if (String.isNullOrWhitespace(password)) {
                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), "비밀번호를 입력해주세요.");
                    return;
                } else {
                    Requester.awb(ApiUrl.User.GET_USER_PROFILE, {
                        password : password
                    }, function (status, data) {

                        if ( !status ) {
                            return;
                        }

                        INDEX.approveMyPage = Lia.p(data,'code');
                        PageManager.go(['user/myPage'] ,{
                            course_id : PageManager.pc('course_id')
                        });
                    });
                }


            });
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