(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {


            var popup = this;

            popup.find('.close').on('click', {
                popup : popup
            }, function(e) {

                var popup = e.data.popup;
                popup.hide();

            });

            popup.find('.button').initButton();

            var jTitle = popup.find('.title');
            var jMessage = popup.find('.text_box');
            var jConfirm = popup.find('.alert_confirm_button');
            var jCancel = popup.find('.alert_cancel_button');
            var jImageContainer = popup.find('.message_popup_image');

            jTitle.html(parameterMap['title']);
            jMessage.html(parameterMap['message']);

            var image = parameterMap['image'];
            if ( image != undefined ) {
                jImageContainer.show().append($('<img />').attr('src', image));
            }

            var confirmFunction = parameterMap['confirm'];
            if (confirmFunction == false) {
                jConfirm.hide();
            }

            var cancelFunction = parameterMap['cancel'];
            if (cancelFunction == undefined) {
                jCancel.hide();
            }

            var confirmText = parameterMap['confirmText'];
            if ( confirmText == undefined ) {
                confirmText = Strings.getString(Strings.BUTTON_TEXT.OK);
            }

            var cancelText = parameterMap['cancelText'];
            if ( cancelText == undefined ) {
                cancelText = Strings.getString(Strings.BUTTON_TEXT.CANCEL);
            }

            var object = parameterMap['object'];
            if (confirmFunction != false)
            {
                jConfirm.text(confirmText).show().off('click').on('click', {
                    confirmFunction : confirmFunction,
                    object : object,
                    popup : popup
                }, function (e) {
                    var data = e.data;
                    var confirmFunction = data['confirmFunction'];
                    var object = data['object'];
                    var popup = data['popup'];

                    var hidePopup = true;
                    if ( typeof confirmFunction == 'function' ) {
                        hidePopup = confirmFunction.call(popup, object);
                        if ( hidePopup == undefined ) {
                            hidePopup = true;
                        }
                    }

                    if ( hidePopup == true ) {
                        popup.hide();
                    }
                });
            }

            if(cancelFunction != undefined && cancelFunction != false)
            {

                jCancel.text(cancelText).show().off('click').on('click', {
                    cancelFunction : cancelFunction,
                    object : object,
                    popup : popup
                }, function (e) {
                    var data = e.data;
                    var cancelFunction = data['cancelFunction'];
                    var object = data['object'];
                    var popup = data['popup'];

                    var hidePopup = true;
                    if ( typeof cancelFunction == 'function' ) {
                        hidePopup = cancelFunction.call(popup, object);
                        if ( hidePopup == undefined ) {
                            hidePopup = true;
                        }
                    }

                    if ( hidePopup == true ) {
                        popup.hide();
                    }
                });
            } else {
                jConfirm.css('width','100%');
            }


            var buttonList = parameterMap['buttonList'];
            if ( buttonList != undefined ) {

                for ( var i = 0, l = buttonList.length; i < l; i++ ) {

                    var button = buttonList[i];
                    var jAlertButtons = popup.find('.alert_buttons');

                    var jButton = $('<div class="button alert_confirm_button"></div>');
                    jButton.text(button['text']).on('click', {
                        onClick : button['onClick'],
                        object : object,
                        popup : popup
                    }, function (e) {
                        var data = e.data;
                        var onClick = data['onClick'];
                        var object = data['object'];
                        var popup = data['popup'];

                        var hidePopup = true;
                        if ( typeof onClick == 'function' ) {
                            hidePopup = onClick.call(popup, object);
                            if ( hidePopup == undefined ) {
                                hidePopup = true;
                            }
                        }

                        if ( hidePopup == true ) {
                            popup.hide();
                        }
                    });

                    var color = button['color'];
                    if ( color != undefined ) {
                        jButton.css('background-color', color);
                    }

                    jAlertButtons.prepend(jButton);
                }

            }

            var init = parameterMap['init'];
            if ( init != undefined ) {
                init.call(popup, object);
            }
        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {

            var popup = this;

            // popup.find('input').focus();

            popup.find('input').keyup(function(e){

                if(e.keyCode == 13)
                    popup.find('.close').trigger('click');
            });
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

