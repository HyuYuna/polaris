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

                PageManager.cpm(['page'], {
                    'board_content_id' : ''
                });
            });

            var boardContentId = page.boardContentId = PageManager.pc('board_content_id');
            var menuId = PageManager.pc('menu_id');

            page.data = undefined;

            Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT, {id : boardContentId}, function (status, data) {

                if (status != Requester.Status.SUCCESS) {
                    PopupManager.alertByResponse(data, function (){
                        PageManager.back();
                    });
                }

                page.data = data;
                page.boardId = Lia.p(data,'body','board_id');
            });


            Requester.func(function() {

                if (page.data == undefined) {
                    return;
                }


                var menu = page.menu;
                var contentData = Lia.p(menu, 'content', 'data');

                var allowComment = true;
                //var allowComment = (Lia.p(contentData, 'allow_comment')==1);
                var allowAttachment

                var data = page.data;
                var body = Lia.p(data, 'body');
                page.find('.normal_view_header_title').text(Lia.pd('-', body, 'title'));

                var boardTypeCode = Lia.p(body, 'board_type_code');
                var boardId = Lia.p(body, 'board_id');

                var registeredDate = Lia.pd('', body, 'registered_date');
                var registeredByUserName = Lia.pd(Lia.pd('-', body, 'owner_name'), body, 'registered_by_user_name');

                if(boardTypeCode == BoardType.ANNOUNCEMENT || boardTypeCode == BoardType.DOWNLOAD) {
                    allowAttachment = true;
                }


                //제목쪽의 information String
                var infoText = '';
                if (String.isNotBlank(registeredDate)) {
                    // infoText += registeredDate.substr(0, 10);
                    infoText = Lia.formatDateWithSeparator(registeredDate, '.');
                }
                if (String.isNotBlank(registeredByUserName)) {

                    if (String.isNotBlank(infoText)) {
                        infoText += '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
                    }

                    infoText += registeredByUserName;
                }

                page.find('.normal_view_header_info').html(infoText);

                var isEditable = Lia.p(body, 'is_editable');
                var isPrivate = Lia.p(body, 'is_private');
                //wjdghkdml isOne20ne 플래그


                page.find('.normal_view_content').html(Lia.pd('-', body, 'body'));
                page.find('.normal_view_content').find('img').css({
                    'max-width': '100%'
                });


                if (isEditable) {
                    page.find('.normal_view_header_buttons').show();

                    var jEdit = page.find('.normal_view_header_button_edit');

                    if(boardTypeCode == BoardType.QUESTION_AND_ANSWER) {
                        jEdit.on('click', function() {
                            PageManager.goWithCurrentParameterMap(['page_qna_write'] ,{
                                board_content_id : Lia.p(body,'id')
                            });
                        });
                    } else {
                        jEdit.hide();
                    }



                    page.find('.normal_view_header_button_delete').on('click', function() {

                        PopupManager.alert('확인', '정말 삭제하시겠습니까?', function() {

                            Requester.awb(ApiUrl.Board.DELETE_BOARD_CONTENT, { id : Lia.p(body,'id') }, function() {

                                PageManager.cpm(['page'], {
                                    'board_content_id' : ''
                                });
                            });

                        }, true);

                    });

                }


                //첨부파일
                if ( allowAttachment ) {
                    var attachmentList = Lia.p(body,'attachment_list');
                    if ( attachmentList != undefined && attachmentList.length > 0 ) {

                        page.find('.normal_view_attachment').show();

                        for ( var key in attachmentList ) {

                            var item = Lia.p(attachmentList, key);

                            var jItem = $('<div class="normal_view_attachment_item">\n' +
                                '        <div class="normal_view_attachment_item_icon">\n' +
                                '        <img class="normal_view_attachment_item_icon_img"/>\n' +
                                '        </div>\n' +
                                '        <div class="normal_view_attachment_item_text">\n' +
                                '        </div>\n' +
                                '        <div class="normal_view_attachment_item_size">\n' +
                                '    </div>\n' +
                                '    </div>\n');

                            jItem.find('.normal_view_attachment_item_icon_img').attr('src' , '/res/home/img/stop/common/ico_down_gray.png');
                            page.find('.normal_view_attachment_body').append(jItem);

                            var size =Lia.p(item,'size');
                            jItem.find('.normal_view_attachment_item_size').html(Lia.convertBytesToSize(size));

                            jItem.find('.normal_view_attachment_item_text').html(Lia.p(item,'original_filename')).on('click', {
                                item : item
                            }, function(e) {

                                var item = e.data.item;
                                Lia.open(PathHelper.getAttachmentUrl(item));
                            });
                        }
                    }
                }


                //공지사항과 자료실은 댓글 x
                if(boardTypeCode != 1 && boardTypeCode != 2) {

                        page.find('.comment_view').show();
                        page.find('.comment_view_input').show();
                        
                        //권한 체크
                        page.find('.comment_view_input').on('click' , function(e) {
                            if(!UserManager.loggedIn) {
                                PopupManager.alert('알림', '로그인이 필요한 기능입니다. 로그인 하시겠습니까?', function () {
                                    PageManager.go(['user/login']);
                                    return;
                                }, function () {
                                    return;
                                });
                            }
                        })

                        page.find('.comment_view_button_write').on('click', function () {

                            var body = page.find('.comment_view_input_text').val();
                            if (String.isBlank(body)) {
                                PopupManager.alert('확인', '내용을 입력해 주십시오.');
                                return;
                            }

                            Requester.awb(ApiUrl.Board.ADD_BOARD_CONTENT, {
                                boardId: boardId,
                                parentId: boardContentId,
                                body: body,
                                isAvailable: 1,
                                isComment: 1,
                                isPrivate: 0,
                                isAlwaysOnTop: 0,
                                showOnCmsOnly: 0
                            }, function (status) {

                                if (!status) {
                                    return;
                                } else {
                                    PopupManager.alert('안내', '댓글이 성공적으로 등록되었습니다.');
                                    page.find('.comment_view_input_text').val('');
                                }
                                page.loadComment();
                            });
                        });
                        page.loadComment();
                }
                });

        },

        loadComment : function() {

            var page = this;
            //PopupManager.alert('댓글 불러오기', '댓글 불러오는 부분의 기능이 아직 준비중입니다.');

            //TODO : 댓글 부분 파라미터 향후 고민 필요

            Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST, {
                parentBoardContentId: page.boardContentId,
                boardIdList: page.boardId,
                isAvailable : 1,
                isDeleted : 0,
                includeBody: 1,
                //orderBy : BoardContentOrderBy.REGISTERED_DATE_ASC,
            }, function (status, data) {

                if (status != Requester.Status.SUCCESS) {
                    return;
                }


                var list = Lia.p( data, 'body', 'list');
                var listCount = Lia.pd(0, data,'body','total_count');
                var jList = page.find('.comment_view_list').empty();


                page.find('.comment_view_count').html(listCount);


                if ( Array.isNotEmpty(list) ) {

                    for ( var i = 0, l = list.length; i < l; i++ ) {

                        var item = Lia.p(list,i);

                        var jItem = $('\
                            <div class="comment_view_item" >\
                                <div class="comment_view_item_header">\
                                    <div class="comment_view_item_name"> </div> \
                                    <div class="comment_view_item_date"> </div> \
                                    <div class="comment_view_item_button_delete" data-id='+ Lia.p(item, 'id') +'>삭제</div> \
                                </div> \
                                <div class="comment_view_item_body"> </div> \
                            </div>\
                        ');

                        var body = Lia.p(item,'body');
                        jItem.find('.comment_view_item_body').html(body);

                        var userName = Lia.pd(Lia.pd('-', item['owner_name']), item['registered_by_user_name']);
                        jItem.find('.comment_view_item_name').text(userName);

                        var registeredDate = Lia.p(item, 'registered_date');

                        jItem.find('.comment_view_item_date').text(Lia.formatDateWithSeparator(registeredDate, '.'));

                        var isEditable = Lia.p(item,'is_editable');
                        var jDeleteBtn = jItem.find('.comment_view_item_button_delete');


                        if ( isEditable ) {

                            jDeleteBtn.bind('click', function(e) {
                                var comment_id = $(this).data('id');
                                PopupManager.alert('확인', '정말 삭제하시겠습니까?', function() {
                                    Requester.awb(ApiUrl.Board.DELETE_BOARD_CONTENT, { id : comment_id }, function() {
                                        page.loadComment();
                                    });
                                }, true);

                            });
                        }

                        jList.prepend(jItem);

                    }


                }

                //comment_view_input

                //
                // if( list == undefined )
                //     return;
                //
                // if( list.length > 0 ) {
                //     page.find('.txt_replay_result').show().find('span').text(list.length);
                //     page.find('.reply_list').show();
                // }
                //
                // for(var i = 0; i < list.length; i++) {
                //
                //     var item = list[i];
                //     var jHtml = $('<tr><td width="70" class="factor">'+item['registered_by_user_name']+'</td><td>'+item['body']+'</td></tr>');
                //     page.find('.reply_list').append(jHtml);
                // }
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