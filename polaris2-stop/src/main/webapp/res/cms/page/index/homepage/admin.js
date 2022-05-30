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

            page.searchPanel = new SearchPanel({
                title: '관리자 게시판',
                appendTo: container,
                type: SearchPanel.Type.BOARD,
                subType: SearchPanel.SubType.COMMON_BOARD_WITHOUT_STATUS
            });

            var userRole = UserManager.getUserRoleCode();
            var manageable = false; userRole <= UserRole.INSTITUTION_ADMIN;
            var writable = userRole <= UserRole.INSTITUTION_ADMIN;

            var baseRequestParameterMap;


            if (!manageable) {

                baseRequestParameterMap = {
                    // isAvailable: 1,
                    withAlwaysOnTop : 1,
                    isDeleted: 0
                };
            }

            page.boardList = new Triton.BoardList({
                appendTo: container,

                targetBoardId: page.boardId = 1092,

                requireBoardId: true,

                baseRequestParameterMap: baseRequestParameterMap,

                statusComboBoxShow: manageable,
                countComBoxShow: true,

                categoryComboBoxShow: false,
                allCategoryShow: false,

                searcherShow: false,

                titleCommentCountShow: true,
                titlePrivateShow: true,
                titleNewShow: true,
                titleAnsweredShow: false,

                buttonLayoutShow: true,

                simpleAvailabilityButtonShow: manageable,

                onMoveRegisterPage: writable ? function (boardList) {

                    PageManager.goPageWithCurrentParameterMap(['homepage/admin_write'], {
                        'board_id': boardList.getBoardId()
                    });
                } : undefined,
                onMoveDetailPage: function (boardList, contentSummary, data) {

                    PageManager.goPageWithCurrentParameterMap(['homepage/admin_detail'], {
                        'board_id': boardList.getBoardId(),
                        'id': contentSummary['id']
                    });
                },

                fieldList: [
                    Triton.Board.ValueType.ROW_NUMBER,
                    Triton.Board.ValueType.TITLE,
                    Triton.Board.ValueType.ATTACHMENT,
                    Triton.Board.ValueType.WRITER,
                    Triton.Board.ValueType.REGISTERED_DATE,
                    Triton.Board.ValueType.VIEW_COUNT,
                    manageable ? Triton.Board.ValueType.IS_AVAILABLE : undefined
                ]
            });

        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            Requester.func(function () {

                Requester.func(function () {

                    page.searchPanel.change(parameterMap, function (searchPanel, passParameterMap) {

                        page.boardList.change(passParameterMap);
                    });
                });
            });
        },
        onRelease: function (j) {

        }
    };
})();
