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

            var userRole = UserManager.getUserRoleCode();
            var manageable = false; userRole <= UserRole.INSTITUTION_ADMIN;

            page.boardWrite = new Triton.BoardWrite({
                appendTo: container,

                title: '관리자 게시판',
                targetBoardId: boardId,
                boardContentId: boardContentId,

                defaultButtonLayout: true,
                doNotCheckDuplication: true,

                // onMoveListPage: function (boardList) {
                //     PageManager.back();
                // },
                onCanceled: function (boardList) {
                    PageManager.back();
                },
                onSaved: function (boardList) {
                    PageManager.back();
                },

                fieldList: [
                    // Triton.Board.ValueType.CATEGORY,
                    Triton.Board.ValueType.TITLE,
                    Triton.Board.ValueType.BODY,
                    Triton.Board.ValueType.ATTACHMENT,
                    // Triton.Board.ValueType.THUMBNAIL_IMAGE_URL,
                    Triton.Board.ValueType.IS_ALWAYS_ON_TOP
                    // Triton.Board.ValueType.IS_PRIVATE
                    // Triton.Board.ValueType.IS_AVAILABLE_EFFECTIVE_DATE
                ]
            });

        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {
        },
        onRelease: function (j) {

        }
    };
})();
