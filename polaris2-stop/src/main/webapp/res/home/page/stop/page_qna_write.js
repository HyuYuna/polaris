(function () {

    return {

        menuPageManager : undefined,
        menuPage : undefined,
        currentMenuId : undefined,

        onInit: function (j) {

            var page = this;

            page.menuPageManager = new MenuPageManager({
                page : page
            });
            page.menuPageManager.onInit(j);

            page.find('.page_content_button_list').on('click', function() {

                PageManager.goPageWithCurrentParameterMap(['page'], {
                    'board_content_id' : ''
                });
            });

            var boardContentId = PageManager.pc('board_content_id');
            var menuId = PageManager.pc('menu_id');


            Requester.ajaxWithoutBlank(ApiUrl.Menu.GET_MENU, {
                id : menuId
            }, function (status, data, request) {

                if (status != Requester.Status.SUCCESS) {
                    return;
                }

                page.menu = Lia.p(data,'body');
            });

            page.data = undefined;

            $.initTextEditor(j);
            $.initFileUploader(j);


            //게시글을 수정 -> 게시글 불러옴
            if ( String.isNotBlank(boardContentId) ) {

                Requester.ajaxWithoutBlank(ApiUrl.Board.GET_BOARD_CONTENT, {
                    id : boardContentId
                }, function (status, data, request) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    page.data = data;
                });
            }


            //요청 후 콜백함수가 매우 길어질때
            //데이터를 받고 page.data = data에 넣어두어야 Requester.func(function()~) 구문을 쓸 수있다.
            Requester.func(function() {

                var menu = page.menu;
                var contentDate = Lia.p(menu, 'content', 'data');
                var boardId = Lia.p(contentDate, 'id');
                var allowCategory = (Lia.p(contentDate, 'allow_category')==1);

                if ( allowCategory == true ) {

                    Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_CATEGORY_LIST, {
                        boardId : boardId
                    }, function( status, data ) {

                        var jSelect = page.find('.category .normal_write_select');

                        var list = Lia.p(data,'body', 'list');
                        jSelect.append('<option value="">선택</option>');

                        if ( list != undefined && list.length > 0 ) {

                            for ( var i = 0, l = list.length; i < l; i++ ) {

                                var item = Lia.p(list, i);
                                jSelect.append('<option value=' + item['id'] + '>' + item['name'] + '</option>');
                            }
                        }


                        page.find('.normal_write_line.category').show();

                    },{
                        autoPopup : false
                    });

                }

                Requester.func(function() {

                    var allowAttachment = (Lia.p(contentDate, 'allow_attachment') == 1);

                    if ( allowAttachment == true ) {
                        page.find('.normal_write_line.attachment').show();
                    }

                    var data = page.data;
                    var body = Lia.p(data, 'body');
                    if ( body != undefined ) {

                        page.find('.title .normal_write_input').val(Lia.pd('', body, 'title'));
                        page.find('.category .normal_write_select').val(Lia.pd('', body, 'category', 'id'));
                        page.find('.body .text_editor').textEditorVal(Lia.pd('', body, 'body'));

                        page.find('.option .normal_write_radio_item').removeClass('on');
                        page.find('.option .normal_write_radio_item').eq(Lia.pd(0, body, 'is_private')).addClass('on');


                        if ( allowAttachment == true ) {
                            var attachmentList = Lia.p(body,'attachment_list');

                            page.find('.attachment .file_uploader').fileUploaderListVal(attachmentList);
                        }
                    }

                    page.find('.option .normal_write_radio_item').on('click', function(){
                        page.find('.option .normal_write_radio_item').removeClass('on');
                        $(this).addClass('on');
                    });


                    page.find('.page_content_button_cancel').click(function(){
                        PageManager.cpm(['page'], { 'board_content_id' : '' });
                    });


                    page.find('.page_content_button_confirm').click(function(){

                        var attachmentList =  page.find('.attachment .file_uploader').fileUploaderListVal();
                        var title = page.find('.title .normal_write_input').val();
                        var name = page.find('.name .normal_write_input').val();
                        var password = page.find('.write_password .password').val();
                        var body = page.find('.body .text_editor').textEditorVal();
                        var isPrivate = 1; // 1로 고정됨 (비밀글 질문만 가능)
                        var categoryId = page.find('.category .normal_write_select').val();

                        if(title == '') {
                            PopupManager.alert('Q&A 등록', '제목을 입력해 주세요.');
                            return;
                        }
                        if(name == '') {
                            PopupManager.alert('Q&A 등록', '성명을 입력해 주세요.');
                            return;
                        }

                        if($(body).text() == '') {
                            PopupManager.alert('Q&A 등록', '내용을 입력해 주세요.');
                            return;
                        }


                        var parameterMpa = {
                            boardId : boardId,
                            title : title,
                            body : body,
                            categoryId : categoryId,
                            isPrivate : isPrivate,
                            isAlwaysOnTop : 0,
                            isAvailable : 1,
                            isAnonymous : 0,
                            attachmentList : JSON.stringify(attachmentList),
                            showOnCmsOnly : 0,
                            ownerName: name,
                            ownerPassword: password
                        };

                        var url = ApiUrl.Board.ADD_BOARD_CONTENT;
                        if ( String.isNotBlank(boardContentId) ) {
                            url = ApiUrl.Board.EDIT_BOARD_CONTENT;
                            parameterMpa['id'] =boardContentId;
                        }

                        Requester.ajaxWithoutBlank(url, parameterMpa, function (status, data, request) {

                            if (status != Requester.Status.SUCCESS) {
                                return;
                            }

                            PageManager.go(['page'], {
                                'menu_id' : PageManager.p('menu_id')
                            });
                        });
                    });


                });
            });

        },

        onChange: function (j) {

            var page = this;

            page.menuPageManager.onChange(j);
        },


        onRelease: function (j) {

            var page = this;
            page.menuPageManager.onRelease(j);

        }
    };
})();