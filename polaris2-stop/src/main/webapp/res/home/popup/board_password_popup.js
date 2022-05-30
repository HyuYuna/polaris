
(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {

            var popup = this;

            popup.find('#board_password_popup_dim').on('click', {
                popup: popup
            }, function (e) {

                var popup = e.data.popup;
                popup.hide();

            });


            var boardParameter = parameterMap;

            var boardContentId = parameterMap['board_content_id'];
            popup.find('.confirm').on('click', {
                popup: popup
            }, function (e) {

                var popup = e.data.popup;

                var password = $('#password_wr_password').val();
                if( !String.isBlank ( password)){
                    boardParameter['owner_password'] = password;
                    // Requester.awb(ApiUrl.Board.CHECK_BOARD_OWNER_PASSWORD, {
                    Requester.awb(ApiUrl.Board.CHECK_BOARD_OWNER_PASSWORD, {
                        id : boardContentId,
                        password : password
                    }, function( status, data ) {

                        if ( status != Requester.Status.SUCCESS ) {
                            popup.hide();
                            return;
                        }

                        PageManager.goWithCurrentParameterMap(['page_board_detail'] ,boardParameter);
                        popup.hide();

                    });
                }else{
                    PopupManager.alert('확인', '비밀번호를 입력해주세요.');
                }
            });

            popup.find('.cancel').on('click', {
                popup: popup
            }, function (e) {

                var popup = e.data.popup;
                popup.hide();


            });

        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

