(function () {

    return {

        htmlLoading : false,
        cssLoading : false,


        onInit: function (j) {

            var page = this;

            var container = new Triton.Container({
                appendTo: j
            });

            new Triton.Title({
                appendTo: container,
                content: PageConstructor.getCurrentMenuName()
            });

            page.boardId = BoardId.CERTIFICATE;

            var admin = UserManager.equalsToUserRoleCode(UserRole.ADMIN);

            page.boardList = new Triton.BoardList({
                appendTo: container,

                requireBoardId: true,
                targetBoardId: page.boardId,

                statusComboBoxShow: false,
                countComBoxShow: true,

                categoryComboBoxShow: false,
                allCategoryShow: false,

                searcherShow: true,

                titleCommentCountShow: true,
                titlePrivateShow: true,
                titleNewShow: true,
                titleAnsweredShow: false,

                simpleAvailabilityButtonShow: admin,
                defaultButtonLayout: true,

                baseRequestParameterMap: {
                    isAvailable: 1,
                    isDeleted: 0
                },

                // onMoveRegisterPage: function (boardList) {
                //
                //     PageManager.goPageWithCurrentParameterMap(['certificate_write'], {
                //         'board_id': boardList.getBoardId()
                //     });
                // },
                onMoveDetailPage: function (boardList, contentSummary, data) {

                    PageManager.goPageWithCurrentParameterMap(['certificate_detail'], {
                        'board_id': boardList.getBoardId(),
                        'id': contentSummary['id']
                    });
                },

                fieldList: [
                    Triton.Board.ValueType.ROW_NUMBER,
                    // Triton.Board.ValueType.CATEGORY,
                    Triton.Board.ValueType.TITLE,
                    // Triton.Board.ValueType.ATTACHMENT,
                    Triton.Board.ValueType.WRITER,
                    {

                        attachHeaderToBoardList : function ( listTable, boardList ) {
                            
                            listTable.appendHeaderColumn({
                                content : '상태'
                            });
                            
                        },

                        attachToBoardList : function ( listTable, contentSummary, data, boardList ){

                            var statusCode = Lia.p(contentSummary,'status_code');
                            var statusName =  BoardContentStatus.getName(BoardContentStatus.UNABLE_TO_PROCESS);
                            if ( statusCode == BoardContentStatus.NEW ) {
                                statusName =  BoardContentStatus.getName(BoardContentStatus.NEW);
                            } else if ( statusCode == BoardContentStatus.DONE ) {
                                statusName =  BoardContentStatus.getName(BoardContentStatus.DONE);
                            }

                            listTable.appendColumn({ content : statusName });
                        },

                        attachToBoardWrite: function (detailTable, boardContent, boardWrite) {
                        },

                        attachToBoardDetail: function (detailTable, boardContent, boardDetail) {
                        },

                        attachToParameterMap: function (parameterMap, fieldObject, boardWrite) {
                        }
                    },

                    Triton.Board.ValueType.REGISTERED_DATE,



                    // Triton.Board.ValueType.VIEW_COUNT,
                    admin ? Triton.Board.ValueType.IS_AVAILABLE : undefined
                ]
            });

        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            Requester.func(function () {

                page.boardList.change(parameterMap);
            });
        },
        onRelease: function (j) {

        }
    };
})();
