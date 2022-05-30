
(function () {

    return {
        getServicePageUrl: function () {
            return ServicePageHelper.introduce();
        },

        onInit: function (j) {

            var page = this;

            var container = new Triton.Container({
                appendTo: j
            });

            var boardId = PageManager.pc('board_id');
            var boardContentId = PageManager.pc('id');

            var admin = UserManager.equalsToUserRoleCode(UserRole.ADMIN);
            page.boardDetail = new Triton.BoardDetail({
                appendTo: container,

                title: PageConstructor.getCurrentMenuName(),
                targetBoardId: boardId,
                boardContentId: boardContentId,
                buttonLayoutShow: true,
                unuseComment : true,


                onLoaded : function(boardDetail) {

                    var content = boardDetail.getBoardContent();

                    var statusCode = Lia.p(content,'status_code');
                    if ( statusCode == BoardContentStatus.NEW ) {
                        boardDetail.buttonSection.rightSection.show();
                    } else {

                        var id = Lia.p(boardDetail.getBoardContent(), 'id');
                        if ( statusCode == BoardContentStatus.DONE ) {

                            boardDetail.buttonSection.appendToLeft(new Triton.FlatButton({
                                theme : Triton.FlatButton.Theme.Normal,
                                content : '발급',
                                onClick: function() {

                                    Requester.owb(ProjectApiUrl.Stop.generateTrainingConfirmation, {
                                        boardContentId : id,
                                        destFilename : '교육확인서.pdf'
                                    });
                                }
                            }));
                        }
                    }

                },

                onMoveListPage: function (boardList) {
                    PageManager.cpm(['certificate'], {
                        id : ''
                    });
                },
                onMoveEditPage: function (boardList) {

                    var boardId = boardList.getBoardId();
                    var id = boardList.getBoardContentId();

                    PageManager.go(['certificate_write'], {
                        board_id: boardId,
                        id: id
                    });
                },
                onDeleted: function (boardList) {
                    PageManager.cpm(['certificate'], {
                        id : ''
                    });
                },
                onDeletedPermanently: function (boardList) {

                    PageManager.cpm(['certificate'], {
                        id : ''
                    });
                },
                onRecovered: function (boardList) {

                    PageManager.cpm(['certificate'], {
                        id : ''
                    });
                },

                fieldList: [
                    // Triton.Board.ValueType.CATEGORY,
                    Triton.Board.ValueType.TITLE,

                    {
                        attachToBoardDetail: function (detailTable, boardContent, boardWrite) {

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({content: '교육과정'});
                            detailTable.appendValueColumn({
                                content: Lia.pcd(
                                    Lia.pcd('-', boardContent, 'properties', 'service_title'), boardContent, 'properties', 'confirm_service_title')
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({content: '교육기간'});
                            detailTable.appendValueColumn({
                                content:
                                    Lia.pcd(
                                        Lia.pcd('-', boardContent, 'properties', 'start_date'),
                                    boardContent, 'properties', 'confirm_start_date') +
                                    ' ~ ' +
                                    Lia.pcd(
                                        Lia.pcd('-', boardContent, 'properties', 'end_date'),
                                    boardContent, 'properties', 'confirm_end_date')
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({content: '소속(기관)'});
                            detailTable.appendValueColumn({
                                content: Lia.pcd(
                                    Lia.pcd('-', boardContent, 'properties', 'company_name'),
                                    boardContent, 'properties', 'confirm_company_name')
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({content: '소속(직책)'});
                            detailTable.appendValueColumn({
                                content:Lia.pcd(
                                    Lia.pcd('-', boardContent, 'properties', 'company_position'),
                                    boardContent, 'properties', 'confirm_company_position')
                            });


                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({content: '학습시간'});
                            detailTable.appendValueColumn({
                                content:Lia.pcd(
                                    Lia.pcd('-', boardContent, 'properties', 'study_time_in_hours'),
                                    boardContent, 'properties', 'confirm_study_time_in_hours')
                            });

                        }
                    },

                    {
                        attachToBoardDetail: function (detailTable, boardContent, boardWrite) {

                            var statusCode = Lia.p(boardContent,'status_code');
                            var statusName =  BoardContentStatus.getName(BoardContentStatus.UNABLE_TO_PROCESS);
                            if ( statusCode == BoardContentStatus.NEW ) {
                                statusName =  BoardContentStatus.getName(BoardContentStatus.NEW);
                            } else if ( statusCode == BoardContentStatus.DONE ) {
                                statusName =  BoardContentStatus.getName(BoardContentStatus.DONE);
                            }

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '상태' });
                            detailTable.appendValueColumn({ content : statusName });
                        }
                    },

                    {
                        attachToBoardDetail: function (detailTable, boardContent, boardWrite) {

                            var statusCode = Lia.p(boardContent,'status_code');
                            var statusName =  BoardContentStatus.getName(BoardContentStatus.UNABLE_TO_PROCESS);
                            if ( statusCode == BoardContentStatus.NEW ) {
                                statusName =  BoardContentStatus.getName(BoardContentStatus.NEW);
                            } else if ( statusCode == BoardContentStatus.DONE ) {
                                statusName =  BoardContentStatus.getName(BoardContentStatus.DONE);
                            }

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '상태' });
                            detailTable.appendValueColumn({ content : statusName });
                        }
                    },
                    // Triton.Board.ValueType.ATTACHMENT
                    // Triton.Board.ValueType.THUMBNAIL_IMAGE_URL,
                    // Triton.Board.ValueType.IS_ALWAYS_ON_TOP,
                    // Triton.Board.ValueType.IS_PRIVATE
                    // admin?Triton.Board.ValueType.IS_AVAILABLE_EFFECTIVE_DATE:undefined
                ]
            });

            page.boardDetail.buttonSection.rightSection.hide();


        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;
        },
        onRelease: function (j) {

        }
    };
})();
