
(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {

            var popup = this;

            popup.find('.exit').on('click', {
                popup: popup
            }, function (e) {

                var popup = e.data.popup;
                popup.hide();

            });

            popup.find('.confirm').on('click', {
                popup: popup
            }, function (e) {

                var popup = e.data.popup;
                popup.hide();

            });



            var termType = Lia.p(parameterMap , 'type');
            var term = undefined;

            //이메일약관 팝업인가 이용약관 팝업인가?
            var popupTypeCode = 0

            if(termType == 'email') {
                popup.find('.course_search_popup_title').text('이메일주소무단수집거부')

            } else {
                popup.find('.course_search_popup_title').text('이용약관');
                popupTypeCode = 1
            }

            Requester.awb(ApiUrl.Document.GET_TERMS_OF_SERVICE, {
                id : 7
            } , function (status, data){
                var list = Lia.p(data,'body' ,'item_list');

                for(var i in list) {
                    var item = Lia.p(list , i);
                    var title = Lia.p(item , 'title');

                    if(title == '이용약관 동의' && popupTypeCode == 1) {
                        term = Lia.p(item , 'body');
                    }
                    if(title == '개인정보 취급 및 위탁에 관한 동의' && popupTypeCode == 0) {
                        term = Lia.p(item , 'body');
                    }
                }


                if(String.isNotBlank(term)) {
                    popup.find('.terms').html(term);
                }
            })




        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

