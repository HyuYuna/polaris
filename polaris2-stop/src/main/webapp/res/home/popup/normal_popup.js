
(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {

            var popup = this;

            popup.find('#intro_video_dim').show().on('click', {
                popup: popup
            }, function (e) {
                var popup = e.data.popup;
                popup.hide();
            });

            var boardParameter = parameterMap;


            popup.find('.confirm').on('click', {
                popup: popup
            }, function (e) {

                var popup = e.data.popup;


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

