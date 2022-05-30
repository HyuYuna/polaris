(function () {

    return {

        adjustPopupSize: function (beforePopup) {

            var popup = this;

            var jImage = popup.find('.banner_popup_content img');

            var width = parseInt($(window).width());
            if ( width > 500 ) {
                width = 500;
            }

            for (var i = 0, l = jImage.length; i < l; i++) {

                var jImageEq = jImage.eq(i);

                var imageWidth = jImageEq.attr('data-lia-width');
                if ( String.isBlank(imageWidth) ) {
                    continue;
                }

                if (width < imageWidth) {

                    jImageEq.css({
                        width: (width * 0.9) + 'px',
                        height: 'auto'
                    });

                } else {

                    jImageEq.css({
                        width: imageWidth + 'px',
                        height: 'auto'
                    });
                }
            }

            if (beforePopup != undefined) {

                var jBeforePopup = beforePopup.getJPopup();
                var popupLeft = parseInt(jBeforePopup.css('left'));
                var popupWidth = parseInt(jBeforePopup.outerWidth(true));

                var currentPopupLeft = (popupLeft + popupWidth + 10);
                var maxLeft = ( $(window).width() - this.getJPopup().outerWidth(true) - 10 );
                if (currentPopupLeft > maxLeft) {
                    currentPopupLeft = maxLeft;
                }

                popup.getJPopup().css({
                    'left': currentPopupLeft + 'px'
                }).attr({
                    'data-lia-position-left': currentPopupLeft + 'px'
                });
            }


        },

        id: undefined,

        onInit: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;

            var beforePopup = object['beforePopup'];
            var cookie = object['cookie'];
            var item = object['item'];
            var id = popup.id = item['id'];
            var url = Lia.p(item, 'properties', 'url');

            popup.find('.banner_popup_close_button').on('click', {}, function (e) {
                popup.hide();
            });

            popup.find('.banner_popup_never_button').on('click', {}, function (e) {

                var dateString = Date.today().toString("yyyy/M/d");
                CookieHelper.set(cookie, dateString, 1);
                popup.hide();

            });

            popup.find('.banner_popup_title_text').text(Lia.pd('', item['title']));

            var imageUrl = Lia.p(item,'properties','image_url');
            if ( imageUrl != undefined ) {

                popup.find('.banner_popup_content').append(
                    '<img src="'+
                        PathHelper.getAttachmentUrl(imageUrl)+
                    '" />'
                )
            }

            popup.find('.banner_popup_content').append(Lia.pd('', item['body']));

            if ( String.isNotBlank(url) ) {
                popup.find('.banner_popup_content').on('click', {
                    url : url
                }, function(e) {

                    var url = e.data.url;
                    Requester.open(url);
                });
            }


            popup.find('.banner_popup_title').on('mousedown', {}, function (e) {

                var jPopup = popup.getJPopup();

                var jThis = $(this);
                jThis.data('ON', 'ON');

                jThis.data('base-page-x', e.pageX);
                jThis.data('base-page-y', e.pageY);

                jThis.data('base-popup-x', parseInt(jPopup.css('left')));
                jThis.data('base-popup-y', parseInt(jPopup.css('top')));

            }).on('mousemove', {}, function (e) {

                var jPopup = popup.getJPopup();

                var jThis = $(this);
                if (String.isNullOrWhitespace(jThis.data('ON')))
                    return;

                jPopup.css({
                    left: parseInt(jThis.data('base-popup-x')) - parseInt(jThis.data('base-page-x')) + e.pageX,
                    top: parseInt(jThis.data('base-popup-y')) - parseInt(jThis.data('base-page-y')) + e.pageY
                });

            }).on('mouseup', {}, function (e) {

                var jPopup = popup.getJPopup();

                var jThis = $(this);
                jThis.data('ON', '');

            });


            popup.find('.banner_popup_content img').on('load', {}, function (e) {

                $(this).attr({
                    'data-lia-width' : $(this).width(),
                    'data-lia-height' : $(this).height()
                });

                popup.adjustPopupSize(beforePopup);
            });

            popup.find('img').click(function () {

                Requester.awb(ApiUrl.User.LOG_USER_CLICK_EVENT, {
                    typeCode: UserEventType.HOMEPAGE_BANNER,
                    description: item['title']
                }, function (status) {
                }, {autoPopup: false});

            });

            popup.adjustPopupSize(beforePopup);

            //$(window).on('resize.banner_popup' + popup.id, {}, function(e){
            //    popup.adjust(beforePopup);
            //});

        },

        onShow: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;
            // var beforePopup = object['beforePopup'];
            // popup.adjustPopupSize(beforePopup);

        },
        onHide: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;
            //$(window).off('resize.banner_popup' + popup.id);
        }
    };
})();

