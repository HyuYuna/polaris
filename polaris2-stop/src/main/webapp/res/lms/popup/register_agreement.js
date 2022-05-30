(function () {

    return {


        onResize : function () {

            var page = this;

            var jPopup = page.find('.popup');

            var windowWidth = $(window).width();
            if ( windowWidth < 605 ) {

                jPopup.css( {
                    width : (windowWidth * 9 / 10 )+'px'
                } );

            } else {

                jPopup.css( {
                    width : '605px'
                });
            }
        },


        onInit: function (jLayout, path, object, jPopupListLayout) {

            $.initComboBox(jLayout);
            $.initFileUploader(jLayout);
            $.initImageButton(jLayout);
            jLayout.find('.radio').initButtonRadio();

            var page = this;

            var onConfirm = Lia.p(object, 'onConfirm');
            var item = page.item = Lia.p(object, 'item');
            var number = Lia.p(object, 'number');
            var count = Lia.p(object, 'count');


            var title = Lia.pd('약관 동의', item, 'title');
            var body = Lia.p(item, 'body');
            var isOptional = Lia.p(item, 'is_optional');

            if ( isOptional != 1 ) {
                title += ' ('+Strings.getString(Strings.REQUIRED)+')';
            }

            var numberString = '';
            if ( count > 1 ) {
                numberString = '(' + number + '/' + count  + ') - ';
            }

            page.find('.register_agreement_popup_close_button').on('click', {}, function(e) {
                page.hide();
            });

            page.find('.button.alert_cancel_button').click(function () {
                page.hide();
            });

            page.onResize();
            $(window).on('resize.register_course', function(){
                page.onResize();
            });

            page.find('.radio').click(function () {

                var jThis = $(this);

                if ( isOptional != 1 ) {
                    
                    var agree = $.buttonGroup('agree').attr('data-lia-value');
                    if ( agree == '0' ) {
                        page.find('.alert_confirm_button').css('background-color', '#7147a9');
                        page.find('.alert_confirm_button').css('cursor', 'default');
                    } else {
                        page.find('.alert_confirm_button').css('background-color', '#7147a9');
                        page.find('.alert_confirm_button').css('cursor', 'pointer');
                    }
                }
            });


            page.find('.register_agreement_popup_title_text').html(numberString + title);

            if ( String.isNotBlank(body) ) {
                page.find('.agreement_content').html(body);
            } else {
                page.find('.agreement_content').hide();
            }

            page.find('.alert_confirm_button').click(function () {

                var jThis = $(this);

                var agreed = ($.buttonGroup('agree').attr('data-lia-value')=='1');

                if ( !isOptional ) {

                    if ( !agreed ) {
                        return;
                    }
                }

                onConfirm(agreed, page.item);
                page.hide();

            });

        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {


            $(window).off('resize.register_course');
        }
    };
})();

