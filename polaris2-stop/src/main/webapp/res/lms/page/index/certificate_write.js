
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

            page.boardWrite = new Triton.BoardWrite({
                appendTo: container,

                title: PageConstructor.getCurrentMenuName(),
                targetBoardId: boardId,
                boardContentId: boardContentId,

                defaultButtonLayout: true,

                onMoveListPage: function (boardList) {

                    PageManager.cpm(['certificate'], {
                        id : ''
                    });
                },
                onCanceled: function (boardList) {
                    PageManager.back();
                },
                onSaved: function (boardList) {
                    PageManager.back();
                },

                fieldList: [
                    // Triton.Board.ValueType.CATEGORY,
                    Triton.Board.ValueType.TITLE,

                    {
                        attachToBoardWrite : function ( detailTable, boardContent, boardWrite ) {

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '교육과정' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'service_title' },
                                    value : Lia.p(boardContent, 'properties', 'service_title')
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '교육기간' });
                            detailTable.appendValueColumn({ content : new Triton.DatetimePeriodPicker({
                                    startOptions : {
                                        form : { name : 'start_date' },
                                        value : Lia.p(boardContent, 'properties', 'start_date'),
                                        type : DatetimePicker.TYPE_DATE
                                    },
                                    endOptions : {
                                        form : { name : 'end_date' },
                                        value : Lia.p(boardContent, 'properties', 'end_date'),
                                        type : DatetimePicker.TYPE_DATE
                                    }
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '소속(기관)' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'company_name' },
                                    value : Lia.p(boardContent, 'properties', 'company_name')
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '소속(직책)' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'company_position' },
                                    value : Lia.p(boardContent, 'properties', 'company_position')
                                })
                            });


                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '학습시간' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'study_time_in_hours' },
                                    value : Lia.p(boardContent, 'properties', 'study_time_in_hours')
                                })
                            });

                        },
                        attachToParameterMap : function (parameterMap, fieldObject, boardWrite) {

                            parameterMap['properties'] = JSON.stringify(parameterMap);

                            parameterMap['isPrivate'] = 1;
                        }
                    },
                    Triton.Board.ValueType.BODY,

                    // Triton.Board.ValueType.ATTACHMENT
                    // Triton.Board.ValueType.THUMBNAIL_IMAGE_URL,
                    // Triton.Board.ValueType.IS_ALWAYS_ON_TOP,
                    // Triton.Board.ValueType.IS_PRIVATE
                    // Triton.Board.ValueType.IS_AVAILABLE_EFFECTIVE_DATE
                ]
            });

        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;
        },
        onRelease: function (j) {

        }
    };
})();
