(function () {

    return {

        joinName : undefined,
        onInit: function (j) {
            var page = this;

            // PopupManager.alert('준비중', '현재 회원탈퇴 기능은 준비중입니다.<br/>빠른 서비스 제공을 위해 노력하겠습니다.');

            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();

                // PopupManager.alert('준비중', '현재 회원탈퇴 기능은 준비중입니다.<br/>빠른 서비스 제공을 위해 노력하겠습니다.');

                // var reason =page.find("select#reason_code").val();
                // if( reason == 1){
                //     reason = page.find("textarea#etc_reason").val();
                //
                //     if( String.isNullOrWhitespace(reason)){
                //         PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '탈퇴사유를 입력해주세요.');
                //         return;
                //     }
                // }


                //var temrsService = page.find('#termsService')
                var termsService = page.find("#chk_all");
                if( !termsService.prop("checked") ){
                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '탈퇴동의를 해주세요.');
                    return;
                }

                var password = page.find('.password').val();

                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '회원탈퇴 하시겠습니까?', function () {
                    // Requester.awb(ApiUrl.User.SUBMIT_USER_DELETE_REQUEST, {
                    //     // reason: reason,
                    //     deleteImmediately: 0
                    // }, function (status, data) {
                    //
                    //     if (status != Requester.Status.SUCCESS) {
                    //
                    //     }
                    // });


                    Requester.awb(ApiUrl.User.WITHDRAW, {
                        // reason: reason,
                        password : password
                    }, function (status, data) {
                        if (status != Requester.Status.SUCCESS) {
                        }

                        var code = Lia.p(data, 'code');

                        if(code == Code.INVALID_ID_OR_PASSWORD) {
                            PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO) , '비밀번호가 다릅니다.');
                            return;
                        }

                        PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO) , '회원탈퇴가 완료되었습니다.' , function () {
                            Lia.redirect(PageUrl.HOME);
                        })

                    } ,{
                        autoPopup: false
                    });

                });

            });
        },
        onChange: function (j) {
            var page = this;
        },


        onRelease: function (j) {

        },
        onResize : function() {

        }
    };
})();