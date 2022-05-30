(function () {

    return {

        INIT : 1,
        CHANGE : 2,
        RELEASE : 3,


        onBoard : function( type, menu, j ) {

            var page = this;
            var menuData = Lia.p(menu,'content','data');
            var menuId = menu['id'];
            var menuTitle = menu['title'];
            var boardTypeCode = Lia.p(menuData,'type_code');
            var boardId = Lia.p(menuData,'id');

            var allowCategory = Lia.p(menuData,'allow_category');
            var allowAttachment = Lia.p(menuData,'allow_attachment');

            var writeBtn = $('<div class="write_button_box"><p class="text">문의하기</p></div>');

            writeBtn.on('click' , function (e) {
                if(!Server.loggedIn) {
                    PopupManager.alert('알림', '로그인이 필요한 서비스입니다. 로그인 하시겠습니까?', function () {
                        PageManager.go(['user/login']);
                        return;
                    }, function () {
                        return;
                    });
                } else {
                    PageManager.goWithCurrentParameterMap(['page_qna_write'], {board_id: 25, menu_id: 15});
                }
            })

            if ( type == page.INIT ) {

                var jBoard = $('<div class="page_wrapper board_container"></div>');

                page.categoryList = undefined;

                var fieldList = [
                    jQuery.UserBoardList.Field.NO,
                    allowCategory?jQuery.UserBoardList.Field.Category:undefined,
                    jQuery.UserBoardList.Field.Title,
                    allowAttachment?jQuery.UserBoardList.Field.Attachment:undefined,
                    jQuery.UserBoardList.Field.RegisteredDate,
                    jQuery.UserBoardList.Field.HitCount
                ];

                var typeCode = jQuery.UserBoardList.Type.LIST;
                var pagerDisabled = false;
                var allCategoryEnabled = (allowCategory == 1);
                var categoryListEnabled = false;
                if ( boardTypeCode == BoardType.GALLERY ) {

                    typeCode = jQuery.UserBoardList.Type.GALLERY;

                } else if ( boardTypeCode == BoardType.FAQ ) {

                    typeCode = jQuery.UserBoardList.Type.FAQ;
                    allCategoryEnabled = true;
                    categoryListEnabled = true;
                    pagerDisabled = true;

                    Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_CATEGORY_LIST, {
                        boardId : boardId
                    }, function( status, data ) {

                        page.categoryList = Lia.p(data,'body','list');

                    });


                } else if ( boardTypeCode == BoardType.QUESTION_AND_ANSWER ) {
                    typeCode = jQuery.UserBoardList.Type.LIST;
                    allCategoryEnabled = true;
                    categoryListEnabled = true;
                    pagerDisabled = false;

                    Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_CATEGORY_LIST, {
                        boardId : boardId
                    }, function( status, data ) {

                        page.categoryList = Lia.p(data,'body','list');

                    });

                    fieldList = [
                        jQuery.UserBoardList.Field.NO,
                        jQuery.UserBoardList.Field.Category,
                        jQuery.UserBoardList.Field.Title,
                        // jQuery.UserBoardList.Field.Attachment,
                        // jQuery.UserBoardList.Field.RegisteredByUser,
                        jQuery.UserBoardList.Field.RegisteredDate,
                        jQuery.UserBoardList.Field.Status
                    ];

                }

                Requester.func(function() {

                    var optionList = [];
                    optionList.push({
                        value: BoardContentSearchBy.TITLE,
                        name: Strings.getString(Strings.SELECT_OPTION.SEARCH_BY_TITLE)
                    });
                    optionList.push({
                        value: BoardContentSearchBy.BODY,
                        name: Strings.getString(Strings.SELECT_OPTION.SEARCH_BY_BODY)
                    });
                    optionList.push({
                        value: BoardContentSearchBy.TITLE_OR_BODY,
                        name: Strings.getString(Strings.SELECT_OPTION.SEARCH_BY_TITLE_AND_BODY)
                    });

                    if(boardTypeCode == BoardType.QUESTION_AND_ANSWER) {
                        optionList.push({
                            value: BoardContentSearchBy.REGISTERED_BY_USER_NAME,
                            name: Strings.getString(Strings.SELECT_OPTION.SEARCH_BY_USER_NAME)
                        });
                    }

                    page.userBoardList = new jQuery.UserBoardList({
                        categoryList : page.categoryList,
                        pagerDisabled : pagerDisabled,
                        categoryListEnabled : categoryListEnabled,
                        allCategoryEnabled : allCategoryEnabled,
                        appendTo : jBoard,
                        typeCode : typeCode,
                        fieldList : fieldList,
                        defaultThumbnailUrl : '/res/home/img/stop/main/img_none2.png',
                        searchOptionList: optionList,
                        detail : function( item ) {
                            var boardParameter = {
                                board_content_id: item['id'],
                                board_id: item['board_id'],
                                board_type_code: Lia.p(item, 'board', 'type_code')
                            };
                            PageManager.goWithCurrentParameterMap(['page_board_detail'], { board_content_id: item['id'] });
                        },
                    });

                    if(boardTypeCode == BoardType.QUESTION_AND_ANSWER || boardTypeCode == BoardType.FAQ) {
                        jBoard.append(writeBtn);
                    }
                });

                j.append(jBoard);

            } else if ( type == page.CHANGE ) {

                Requester.func(function() {

                    var PAGE_COUNT = 10;
                    var boardTypeCode = Lia.p(menuData,'type_code');

                    var isAvailable = 1;
                    var isRequesterContent = 0;

                    page.userBoardList.setSearchOption( PageManager.pc('search_by_code'), PageManager.pc('search_by_text') );
                    page.userBoardList.setCountOption( PageManager.pcd(PAGE_COUNT, 'count') );

                    var categoryId = PageManager.pc('category_id');
                    page.userBoardList.setCategoryId(categoryId);
                    categoryId = page.userBoardList.getCategoryId();

                    var pageIndex = PageManager.pcd(1,'page');
                    var pageCount = PAGE_COUNT;
                    var searchOptionList = new SearchOptionList();
                    var code = page.userBoardList.getSearchOptionCode();
                    var text = page.userBoardList.getSearchOptionText();

                    // 게시글 검색
                    if ( String.isNotBlank(text) ) {
                        searchOptionList.add(code,text);
                    }

                    var orderByCode = undefined;

                    switch(Number(boardTypeCode)) {
                        case BoardType.FAQ: {
                            pageIndex = '';
                            pageCount = '';
                            orderByCode = BoardContentOrderBy.DISPLAY_ORDER_ASC;
                        } break;
                        case BoardType.QUESTION_AND_ANSWER: {
                            isRequesterContent = 1;
                        } break;
                        case BoardType.GALLERY: {
                            PAGE_COUNT = 16;
                        } break;
                    }

                    var boardParam = {
                        categoryId : categoryId,
                        boardIdList : boardId,
                        isAvailable : isAvailable,
                        isDeleted : 0,
                        searchOptionList : searchOptionList.get(),
                        page : pageIndex,
                        count : pageCount,
                        includeBody : 1,
                        includeAttachmentList: 1,
                        parentBoardContentId : -1,
                        includeProperties: 1,
                        isRequesterContent: isRequesterContent,
                        orderByCode: orderByCode
                    };

                    switch(Number(boardTypeCode)) {
                        case BoardType.FAQ: {

                        } break;
                        case BoardType.QUESTION_AND_ANSWER: {
                            if(!Server.loggedIn) {
                                boardParam['count'] = 0;
                            } else {
                                boardParam['registeredByUserIdx'] = UserManager.getIdx();
                            }

                        } break;
                        case BoardType.GALLERY: {

                        } break;
                    }

                    Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST, boardParam , function( status, data ) {
                        var list = Lia.p(data, 'body', 'list');
                        var totalCount = Lia.p(data, 'body', 'total_count');

                        var jPager = page.find('.pager');
                        jPager.empty();

                        if ( boardTypeCode == BoardType.GALLERY ) {
                            // 로딩 카드뷰 이후에 실행되어야 함
                            jGalleryList.find('.course_card_onload').fadeOut(1000);

                            setTimeout(function (){
                                page.userBoardList.change({
                                    page: pageIndex,
                                    count: pageCount,
                                    list: list,
                                    totalCount: totalCount
                                }, function () {
                                    page.find('.gallery_item').hide();
                                    page.find('.gallery_item').fadeIn('fast');
                                });
                            }, 1000);
                        } else {

                            //임시방편 TODO : 예외처리
                            // if(boardId == BoardId.DOWNLOAD) {
                            //
                            //     var listLength  = 0;
                            //     if(Lia.p(data, 'body' , 'list') != undefined) {
                            //         page.find('.total_count .total_count_text').text(Lia.p(data, 'body' , 'list').length)
                            //         listLength = Lia.p(data, 'body' , 'list').length;
                            //     } else {
                            //         page.find('.total_count .total_count_text').text('-')
                            //     }
                            //     var jTBody = page.find('.normal_list tbody');
                            //
                            //     //loop
                            //     if(listLength > 0) {
                            //         for (var i in list) {
                            //         //console.log(list[i])
                            //
                            //         var item = list[i];
                            //         var rowNumber = Number(i) + 1;
                            //         var title = Lia.p(list[i], 'title');
                            //         var registeredDate = Lia.p(list[i], 'registered_date');
                            //         registeredDate = Lia.formatDateWithSeparator(registeredDate, '.');
                            //         var view_cnt = Lia.p(list[i], 'view_count')
                            //
                            //         var fileImage = '-';
                            //         var fileImageClass = 'none';
                            //
                            //         if (Lia.p(item, 'attachment_list', 'length') > 0) {
                            //             var jFileImage = $('<img class="not_pressed" src="/res/home/img/stop/common/btn_file.png" style="vertical-align: middle;width:32px;" >');
                            //             //<img class="pressed" src="/res/home/img/stop/common/ico_board_down_pressed.png" style="vertical-align: middle;width:30px;" >
                            //             jFileImage.find('.pressed').css('display', 'none');
                            //             jFileImage.on('mouseenter', function () {
                            //                 var jThis = $(this);
                            //                 jThis.attr('src', '/res/home/img/stop/common/btn_file_pressed.png');
                            //             })
                            //             jFileImage.on('mouseleave', function () {
                            //                 var jThis = $(this);
                            //                 jThis.attr('src', '/res/home/img/stop/common/btn_file.png');
                            //             })
                            //             fileImageClass = '';
                            //         }
                            //         var optionHtml = allowAttachment ? $('<td class="attachment ' + fileImageClass + '"></td>') : '';
                            //
                            //         if (allowAttachment) {
                            //             optionHtml.append(jFileImage);
                            //         }
                            //
                            //
                            //         var category = Lia.pcd('-', item,'category' ,'name');
                            //
                            //         // '<td class="no">' + rowNumber + '</td>' +
                            //         // '<td class="category">' + category + '</td>' +
                            //         // '<td class="title">' + title + '</td>' +
                            //         // // optionHtml +
                            //         // '<td class="registered_date">' + registeredDate + '</td>' +
                            //         // '<td class="mobile_hide">' + Lia.p(list[i], 'view_count') + '</td>' +
                            //         // //statusColumn+
                            //
                            //
                            //         var jTr = $('<tr class="rowItem"></tr>');
                            //         var no = $('<td class="no tablet_hide"></td>');
                            //         no.text(rowNumber);
                            //
                            //         var cateCol = $('<td class="category"></td>');
                            //         cateCol.text(category);
                            //
                            //         var titleCol = $('<td class="title"></td>');
                            //         titleCol.text(title);
                            //
                            //         var regDate = $('<td class="registered_date"></td>');
                            //         regDate.text(registeredDate);
                            //
                            //         var vc = $('<td class="hit_count tablet_hide"></td>');
                            //         vc.text(view_cnt);
                            //
                            //         jTr.append(no);
                            //         jTr.append(cateCol)
                            //         jTr.append(titleCol);
                            //         jTr.append(optionHtml);
                            //         jTr.append(regDate);
                            //         jTr.append(vc);
                            //
                            //
                            //         jTr.on('click', {
                            //             item: item
                            //         }, function (e) {
                            //             PageManager.goWithCurrentParameterMap(['page_board_detail'], {
                            //                 board_content_id: item['id']
                            //             });
                            //         });
                            //
                            //         jTBody.append(jTr);
                            //     }
                            //      } else {
                            //         page.find('.user_board_list_content .no_content').css('display' , 'block')
                            //     }
                            // } else {
                                page.userBoardList.change({
                                    page: pageIndex,
                                    count: pageCount,
                                    list: list,
                                    totalCount: totalCount
                                }, function () {
                                });

                            page.find('.attachment img').on('mouseenter', function () {
                                var jThis = $(this);
                                jThis.attr('src', '/res/home/img/stop/common/btn_file_pressed.png');
                            })
                            page.find('.attachment img').on('mouseleave', function () {
                                var jThis = $(this);
                                jThis.attr('src', '/res/home/img/stop/common/btn_file.png');
                            })

                                // page.find('.attachment img').attr('src', '/res/home/img/stop/common/btn_file_pressed.png');
                            // }

                            if(boardId == BoardId.NOTICE) {
                                var listLength = 0;
                                page.find('.normal_list td.attachment img').css('display' , 'none');

                                // if(Lia.p(data, 'body' , 'list') != undefined) {
                                //     listLength = Lia.p(data, 'body', 'list').length;
                                //     page.find('.total_count_text').text(listLength);
                                // }
                                //
                                // if(listLength == 0) {
                                //     page.find('.user_board_list_content .no_content').css('display' , 'block')
                                //     page.find('.total_count_text').text('-');
                                // }
                            }
                        }



                    });

                });

            } else {

            }
        },

        onJSON: function(type, menu, j) {

            var content = Lia.p(menu, 'content', 'data');

        },

        menuPageManager : undefined,
        menuPage : undefined,
        currentMenuId : undefined,

        onInit: function (j) {
            var page = this;

            $(window).off('scroll');

            page.menuPageManager = new MenuPageManager({
                page : page
            });

            page.find('.navbar').addClass('subpage');

            page.menuPageManager.onInit(j);

            page.menuPage = new Lia.MenuPage({
                onPreInit: function(){
                    var menuPage = this;
                    var menu = menuPage.menu;
                    var boardId = Lia.p(menu, 'content', 'data', 'id');
                    var jBody = page.find('.page_content_body').empty();

                    // 부드럽게 전환하는 효과를 주기 위한 초기 작업
                    jBody.hide();

                    $('.navbar').addClass('subpage');

                    if ( String.isNotBlank(menuPage.html) ) {
                        jBody.append( menuPage.html );
                    }

                    // 페이지 내용 있으면 내용으로 체크
                    if ( menuPage.page != undefined ) {
                        return;
                    }

                    var contentTypeCode = menuPage.typeCode;

                    switch(contentTypeCode) {
                        case MenuContentType.BOARD: page.onBoard(page.INIT, menu, jBody);  break;
                        case MenuContentType.JSON: page.onJSON(page.INIT, menu, jBody); break;
                        case MenuContentType.LINK: {
                            // var link = Lia.p(menu,'content', 'data');
                            // if(link != undefined && String.isNotBlank(link)) {
                            //     Requester.owb(link);
                            // } else {
                            //     PopupManager.alert('링크', '해당 메뉴는 준비중입니다.');
                            //     return;
                            // }
                        }
                    }

                    jBody.fadeIn(500);
                },
                onPreChange: function(){
                    var menuPage = this;
                    var menu = menuPage.menu;
                    var menuId = Lia.p(menu, 'id');

                    var jBody = page.find('.page_content_body');


                    // 페이지 내용 있으면 내용으로 체크
                    if ( menuPage.page != undefined ) {
                        return;
                    }

                    var contentTypeCode = menuPage.typeCode;

                    switch(contentTypeCode) {
                        case MenuContentType.BOARD: page.onBoard(page.CHANGE, menu, jBody); break;
                        case MenuContentType.JSON: page.onJSON(page.CHANGE, menu, jBody); break;
                        case MenuContentType.LINK: {
                            var link = Lia.p(menu,'content', 'data');
                            if(link != undefined && String.isNotBlank(link)) {


                            } else {
                                PopupManager.alert('링크', '해당 메뉴는 준비중입니다.', function (){
                                    PageManager.back();
                                });
                                return;
                            }
                        }
                    }

                },
                onPreRelease: function(){
                    var menuPage = this;
                    var menu = menuPage.menu;

                    var jBody = page.find('.page_content_body');

                    // 페이지 내용 있으면 내용으로 체크
                    if ( menuPage.page != undefined ) {
                        return;
                    }

                    var contentTypeCode = menuPage.typeCode;

                    switch(contentTypeCode) {
                        case MenuContentType.BOARD: page.onBoard(page.RELEASE, menu, jBody); break;
                        case MenuContentType.JSON: page.onJSON(page.RELEASE, menu, jBody); break;
                        case MenuContentType.LINK: {
                            // var link = Lia.p(menu,'content', 'data');
                            // if(link != undefined && String.isNotBlank(link)) {
                            //     Requester.owb(link);
                            // } else {
                            //     PopupManager.alert('링크', '해당 메뉴는 준비중입니다.');
                            //     return;
                            // }
                        } break;
                    }

                }
                // onRelease: function () {
                //     var menuPage = this;
                // }
            });


        },

        menuId : undefined,

        onChange: function (j) {

            var page = this;

            var menu = MenuManager.getLastSelectedMenu();
            var menuId = menu['id'];

            if ( menuId != page.menuId  ) {
                if (page.menuPage != undefined ) {
                    page.menuPage.onRelease(j);
                }

                page.menuId = menuId;

                page.menuPage.load({
                    id : menuId
                }, function(){
                    var menuPage = this;
                    menuPage.onInit(j);
                    menuPage.onChange(j);
                    page.onResize();
                });

                page.menuPageManager.onChange(j);
            } else {
                page.menuPage.onChange(j);
                page.onResize();
            }
        },

        onRelease: function (j) {

            var page = this;

            // if ( page.menuPage != undefined ) {
            //     page.menuPage.onRelease(j);
            // }
            //
            // page.menuPageManager.onRelease(j);
        },
        onResize : function() {
            var page = this;
        }
    };
})();