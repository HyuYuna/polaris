(function () {

    return {

        moveListPage: function () {

            PageManager.go(['homepage/admin'], {
                'title': PageManager.pc('title'),
                'body': PageManager.pc('body'),
                'title_or_body': PageManager.pc('title_or_body'),
                'start_date': PageManager.pc('start_date'),
                'end_date': PageManager.pc('end_date'),
                'status_code_list': PageManager.pc('status_code_list')
            });

        },

        onInit: function (j) {

            var page = this;
            var container = new Triton.Container({
                appendTo: j
            });

            var boardId = PageManager.pc('board_id');
            var boardContentId = PageManager.pc('id');

            var userRole = UserManager.getUserRoleCode();
            var manageable = false;userRole <= UserRole.INSTITUTION_ADMIN;

            var hideFieldList = [

                Triton.Board.ValueType.CATEGORY,
                //Triton.Board.ValueType.TITLE,
                //Triton.Board.ValueType.BODY,
                //Triton.Board.ValueType.ATTACHMENT,
                Triton.Board.ValueType.THUMBNAIL_IMAGE_URL,
                //Triton.Board.ValueType.IS_ALWAYS_ON_TOP,
                Triton.Board.ValueType.IS_PRIVATE
                //Triton.Board.ValueType.IS_AVAILABLE_EFFECTIVE_DATE
            ];

            if (!manageable) {

                hideFieldList.push(Triton.Board.ValueType.IS_ALWAYS_ON_TOP);
                hideFieldList.push(Triton.Board.ValueType.IS_AVAILABLE_EFFECTIVE_DATE);
            }

            page.boardDetail = new Triton.BoardDetail({
                appendTo: container,

                title: '관리자 게시판',
                targetBoardId: boardId,
                boardContentId: boardContentId,
                buttonLayoutShow: true,
                doNotCheckDuplication: true,

                onMoveListPage: function (boardList) {

                    page.moveListPage();
                },
                onMoveEditPage: function (boardList) {

                    var boardId = boardList.getBoardId();
                    var id = boardList.getBoardContentId();

                    PageManager.go(['homepage/admin_write'], {
                        board_id: boardId,
                        id: id
                    });
                },
                onDeleted: function (boardList) {
                    page.moveListPage();
                },
                onDeletedPermanently: function (boardList) {
                    page.moveListPage();
                },
                onRecovered: function (boardList) {
                    page.moveListPage();
                },
                hideFieldList: hideFieldList
            });

        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {
        },
        onRelease: function (j) {

        }
    };
})();
