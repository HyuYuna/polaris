

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

            var jContent = popup.find('.popup_body');

            var videoSource = Lia.p(object,'videoSource');
            var videoTypeCode = Lia.p(object,'videoTypeCode');

            if ( videoTypeCode == VideoContentVideoType.YOU_TUBE ) {

                if (String.isBlank(videoSource)) {
                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.VIDEO_URL_NOT_FOUND));
                }

                var videoId = YouTubeHelper.extractId(videoSource);

                if (String.isBlank(videoId)) {

                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.MALFORMED_VIDEO_URL));
                }

                var playerParameterMap = {
                    'videoId': videoId,
                    'number': 0,
                    '_': Lia.getTimestamp()
                };

                var playerUrl = '/page/player/youtube' + Lia.convertArrayToQueryString(playerParameterMap);

                jContent.append($('<iframe id="iframe" src="' + playerUrl + '" ' +
                    ' hspace="0" vspace="0" frameborder="0" scrolling="no" allowfullscreen allowTransparency="true" ' +
                    ' style="float: none;margin:0 auto;" width="100%" height="100%"></iframe>'));


            } else if (videoTypeCode == VideoContentVideoType.TED) {

                if (String.isBlank(videoSource)) {

                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.VIDEO_URL_NOT_FOUND));
                }

                var videoId = TedHelper.extractId(videoSource);

                if (String.isBlank(videoId)) {

                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.MALFORMED_VIDEO_URL));
                }

                var playerParameterMap = {
                    'videoId': videoId,
                    'number': 0,
                    '_': Lia.getTimestamp()
                };

                var playerUrl = '/page/player/ted' + Lia.convertArrayToQueryString(playerParameterMap);

                jContent.append($('<iframe id="iframe" src="' + playerUrl + '" ' +
                    ' hspace="0" vspace="0" frameborder="0" scrolling="no" allowfullscreen allowTransparency="true" ' +
                    ' style="float: none;margin:0 auto;" width="100%" height="100%"></iframe>'));

            } else if (videoTypeCode == VideoContentVideoType.PREZI) {

                if (String.isBlank(videoSource)) {

                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.VIDEO_URL_NOT_FOUND));
                }

                var videoId = PreziHelper.extractId(videoSource);

                if (String.isBlank(videoId)) {

                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.MALFORMED_VIDEO_URL));
                }

                var playerParameterMap = {
                    'videoId': videoId,
                    'number': 0,
                    '_': Lia.getTimestamp()
                };

                var playerUrl = '/page/player/prezi' + Lia.convertArrayToQueryString(playerParameterMap);

                jContent.append($('<iframe id="iframe" src="' + playerUrl + '" ' +
                    ' hspace="0" vspace="0" frameborder="0" scrolling="no" allowfullscreen allowTransparency="true" ' +
                    ' style="float: none;margin:0 auto;" width="100%" height="100%"></iframe>'));

            } else if ( videoTypeCode == VideoContentVideoType.VIMEO ) {

                var videoSourceSplit = videoSource.split('/');

                var playerParameterMap = {
                    'videoId': videoSourceSplit[videoSourceSplit.length - 1],
                    'number': 0,
                    '_': Lia.getTimestamp()
                };

                var playerUrl = '/page/player/vimeo' + Lia.convertArrayToQueryString(playerParameterMap);

                jContent.append('<iframe id="iframe" src="' + playerUrl + +'" ' +
                    ' hspace="0" vspace="0" frameborder="0" scrolling="no" allowfullscreen allowTransparency="true" ' +
                    ' style="float: none;margin:0 auto;" width="100%" height="100%"></iframe>');

            } else {

                var jDownload = $('<button class="btn_download">영상 다운로드</button>');
                jDownload.on('click', function (e){
                    Lia.open(PathHelper.getFileUrl(videoSource));
                });
                jContent.append(jDownload);
            }

            popup.find('.close').on('click', {
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

