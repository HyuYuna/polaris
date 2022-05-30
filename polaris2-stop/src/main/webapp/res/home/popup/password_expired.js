(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {


            var popup = this;

            popup.find('.close, .alert_cancel_button').on('click', {
                popup : popup
            }, function(e) {
                var popup = e.data.popup;
                popup.hide();
            });


            popup.find('.alert_confirm_button').on('click', function (e) {
                var password = popup.find('.change_password').val();
                var passwordConfirm = popup.find('.change_password_confirm').val();

                if (String.isBlank(password)) {
                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_TITLE.ENTER_PASSWORD));
                    return false;
                }

                if (password != passwordConfirm) {
                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '입력하신 비밀번호와 확인란이 일치하지 않습니다.');
                    return false;
                }

                password = CryptoHelper.encryptPassword(password);
                var key = object['key'];
                var id = object['id'];

                Requester.awb(ApiUrl.User.RESET_USER_PASSWORD, {
                    id: id,
                    temporaryKey: key,
                    newPassword: password
                }, function (status, data, request ) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '비밀번호가 성공적으로 변경되었습니다.', function() {
                        Lia.refresh();
                    });

                });
            });




        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {

            var popup = this;

        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

