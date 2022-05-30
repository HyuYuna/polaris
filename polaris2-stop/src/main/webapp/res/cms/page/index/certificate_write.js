
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
                            detailTable.appendKeyColumn({ content : '신청 교육과정' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    disabled : true,
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'service_title' },
                                    value : Lia.p(boardContent, 'properties', 'service_title')
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '신청 교육기간' });
                            detailTable.appendValueColumn({ content : new Triton.DatetimePeriodPicker({
                                    startOptions : {
                                        disabled : true,
                                        form : { name : 'start_date' },
                                        value : Lia.p(boardContent, 'properties', 'start_date'),
                                        type : DatetimePicker.TYPE_DATE
                                    },
                                    endOptions : {
                                        disabled : true,
                                        form : { name : 'end_date' },
                                        value : Lia.p(boardContent, 'properties', 'end_date'),
                                        type : DatetimePicker.TYPE_DATE
                                    }
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '신청 소속(기관)' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    disabled : true,
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'company_name' },
                                    value : Lia.p(boardContent, 'properties', 'company_name')
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '신청 소속(직책)' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    disabled : true,
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'company_position' },
                                    value : Lia.p(boardContent, 'properties', 'company_position')
                                })
                            });


                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '신청 학습시간' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    disabled : true,
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'study_time_in_hours' },
                                    value : Lia.p(boardContent, 'properties', 'study_time_in_hours')
                                })
                            });


                            // -------------------------------------------------------------


                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '교육과정' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'confirm_service_title' },
                                    value :
                                        Lia.pcd(
                                            Lia.p(boardContent, 'properties', 'service_title'), boardContent, 'properties', 'confirm_service_title'
                                        )
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '교육기간' });
                            detailTable.appendValueColumn({ content : new Triton.DatetimePeriodPicker({
                                    startOptions : {
                                        form : { name : 'confirm_start_date' },
                                        value :
                                            Lia.pcd(
                                                Lia.p(boardContent, 'properties', 'start_date'), boardContent, 'properties', 'confirm_start_date'
                                            ),
                                        type : DatetimePicker.TYPE_DATE
                                    },
                                    endOptions : {
                                        form : { name : 'confirm_end_date' },
                                        value :
                                            Lia.pcd(
                                                Lia.p(boardContent, 'properties', 'end_date'), boardContent, 'properties', 'confirm_end_date'
                                            ),
                                        type : DatetimePicker.TYPE_DATE
                                    }
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '소속(기관)' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'confirm_company_name' },
                                    value :
                                        Lia.pcd(
                                            Lia.p(boardContent, 'properties', 'company_name'), boardContent, 'properties', 'confirm_company_name'
                                        ),
                                })
                            });

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '소속(직책)' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'confirm_company_position' },
                                    value :
                                        Lia.pcd(
                                            Lia.p(boardContent, 'properties', 'company_position'), boardContent, 'properties', 'confirm_company_position'
                                        ),
                                })
                            });


                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '학습시간' });
                            detailTable.appendValueColumn({ content : new Triton.TextInput({
                                    theme : Triton.TextInput.Theme.Full,
                                    form : { name : 'confirm_study_time_in_hours' },
                                    value :
                                        Lia.pcd(
                                            Lia.p(boardContent, 'properties', 'study_time_in_hours'), boardContent, 'properties', 'confirm_study_time_in_hours'
                                        ),
                                })
                            });


                        },
                        attachToParameterMap : function (parameterMap, fieldObject, boardWrite) {

                            parameterMap['properties'] = JSON.stringify(parameterMap);
                        }
                    },
                    Triton.Board.ValueType.BODY,


                    {
                        attachToBoardWrite : function ( detailTable, boardContent, boardWrite ) {
                            
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({ content : '상태' });
                            detailTable.appendValueColumn({ content : new Triton.ComboBox({
                                    selectedValue : Lia.p(boardContent,'status_code'),
                                    form : { name : 'statusCode' },
                                    optionList : [
                                        { value : BoardContentStatus.NEW, name : BoardContentStatus.getName(BoardContentStatus.NEW) },
                                        { value : BoardContentStatus.DONE, name : BoardContentStatus.getName(BoardContentStatus.DONE) },
                                        { value : BoardContentStatus.UNABLE_TO_PROCESS, name : BoardContentStatus.getName(BoardContentStatus.UNABLE_TO_PROCESS) },
                                    ]
                                })
                            });

                        },
                        attachToParameterMap : function (parameterMap, fieldObject, boardWrite) {

                            parameterMap['isPrivate'] = 1;
                        }
                    },

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
