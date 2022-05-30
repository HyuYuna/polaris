
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


            $('#search_string_box').keydown(function (e){
                if(e.keyCode == 13) {
                    var jThis = $(this);
                    var search = jThis.val();

                    PageManager.go(['courses'] , {menu_id : MenuId.COURSE, searchOptionString : search});
                    popup.hide();
                }
            })

            $('.course_search_img').on('click' , function (e){
                var search = popup.find('#search_string_box').val();

                PageManager.go(['courses'] , {menu_id : MenuId.COURSE, searchOptionString : search});
                popup.hide();
            })




        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

