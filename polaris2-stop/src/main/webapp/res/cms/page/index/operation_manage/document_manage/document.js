
(function () {

    return {

        search : function() {

            var page = this;

            var map = Triton.extractFormData( page.searchSection );
            PageManager.cpcpm(map);

        },

        onInit: function (j) {

            var page = this;

            var container = new Triton.Container({
                appendTo : j
            });

            new Triton.Title({
                appendTo : container,
                content : '수료증 목록'
            });

            {
                var searchSection = page.searchSection =  new Triton.Section({
                    appendTo : container
                });

                var searchPanel = new Triton.Panel({
                    appendTo : searchSection
                });
                var searchTable  = new Triton.DetailTable({
                    appendTo : searchPanel
                });

                searchTable.appendRow({});
                searchTable.appendKeyColumn({
                    content : '수료증 유형'
                });
                searchTable.appendValueColumn({
                    content :  new Triton.ComboBox({
                        form : { name : 'document_type_code' },
                        optionList : DocumentType.getOptionList()
                    })
                });

                searchTable.appendKeyColumn({
                    content : '수료증 발행 일자'
                });
                searchTable.appendValueColumn({
                    content : new Triton.DatetimePeriodPicker({
                        startOptions  : {
                            type : Triton.DatetimePicker.TYPE_DATE,
                            form : { name : 'start_date' }
                        },
                        endOptions : {
                            type : Triton.DatetimePicker.TYPE_DATE,
                            form : { name : 'end_date' }
                        }
                    })
                });

                searchTable.appendRow({});
                searchTable.appendKeyColumn({
                    content : '과목명'
                });
                searchTable.appendValueColumn({
                    content : new Triton.TextInput({
                        form : {name : 'course_service_title'},
                        theme : Triton.TextInput.Theme.Full,
                        onKeyPress : function ( e ) {

                            if ( e.which == Lia.KeyCode.ENTER ) {
                                page.search();
                            }
                        }

                    }),
                    attr : {
                        colspan : 3
                    }
                });


                searchTable.appendRow({});
                searchTable.appendKeyColumn({
                    content : '수료자 이름'
                });
                searchTable.appendValueColumn({
                    content : new Triton.TextInput({
                        form : {name : 'student_user_name'},
                        theme : Triton.TextInput.Theme.Full,
                        onKeyPress : function ( e ) {

                            if ( e.which == Lia.KeyCode.ENTER ) {
                                page.search();
                            }
                        }
                    })
                })

                searchTable.appendKeyColumn({
                    content : '수료자 아이디'
                });
                searchTable.appendValueColumn({
                    content : new Triton.TextInput({
                        form : {name : 'student_user_id'},
                        theme : Triton.TextInput.Theme.Full,
                        onKeyPress : function ( e ) {

                            if ( e.which == Lia.KeyCode.ENTER ) {
                                page.search();
                            }
                        }
                    })
                })

                ProjectSettings.Document.onSearchOptionDocumentList(searchTable);

                var btnSection = new Triton.ButtonSection({
                    appendTo : container,
                })

                btnSection.appendToRight(new Triton.FlatButton({
                    content : '검색조건 초기화',
                    onClick : function() {

                        var map = Triton.extractFormData( page.searchSection );
                        for ( var key in map ) {
                            map[key] = '';
                        }
                        PageManager.cpcpm(map);
                    }
                }))

                btnSection.appendToRight(new Triton.FlatButton({
                    content : '검색',
                    onClick : function() {

                        page.search();
                    }
                }))
            }

            var buttonSection = new Triton.ButtonSection({
                appendTo : container,
                css : {'margin-bottom' : '10px'}
            })

            buttonSection.appendToLeft(new Triton.ComboBox({
                form: {name: 'count'},
                theme: Triton.ComboBox.Theme.Category,
                optionList: ProjectSettings.CountOptionList,
                onSelected: function (val) {
                    PageManager.goCurrentPageWithCurrentParameterMap({'count': val});
                }
            }))

            page.content = new Triton.Section({
                appendTo : container
            })
        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            Triton.placeFormData(page.searchSection, parameterMap);

            var pageIndex = PageManager.pcd(1, 'page');
            var pageCount = PageManager.pcd(20 , 'count');

            var searchOptionList = undefined;

            var courseTitle = PageManager.pc('course_service_title');
            var startDate = PageManager.pc('start_date');
            var endDate = PageManager.pc('end_date');
            var userName = PageManager.pc('student_user_name');
            var userId = PageManager.pc('student_user_id');
            var typeCode = PageManager.pcd(undefined , 'document_type_code');
            var credit = PageManager.pcd(undefined , 'credit_type');

            
            //검색 옵션
            if ( String.isNotBlank(courseTitle) ) {

                if ( searchOptionList == undefined ) {
                    searchOptionList = new SearchOptionList();
                }

                searchOptionList.add(SearchOption.Document.COURSE_TITLE, courseTitle);
            }

            if ( String.isNotBlank(startDate) ) {

                if ( searchOptionList == undefined ) {
                    searchOptionList = new SearchOptionList();
                }

                searchOptionList.add(SearchOption.Document.START_DATE, startDate);
            }


            if ( String.isNotBlank(endDate) ) {

                if ( searchOptionList == undefined ) {
                    searchOptionList = new SearchOptionList();
                }

                searchOptionList.add(SearchOption.Document.END_DATE, endDate);
            }

            if ( String.isNotBlank(credit) ) {

                if ( searchOptionList == undefined ) {
                    searchOptionList = new SearchOptionList();
                }

                searchOptionList.add(SearchOption.Document.PROPERTY, credit , 'credit');
            }

            if ( String.isNotBlank(userName) ) {

                if ( searchOptionList == undefined ) {
                    searchOptionList = new SearchOptionList();
                }

                searchOptionList.add(SearchOption.Document.STUDENT_NAME, userName);
            }

            if ( String.isNotBlank(userId) ) {

                if ( searchOptionList == undefined ) {
                    searchOptionList = new SearchOptionList();
                }

                searchOptionList.add(SearchOption.Document.STUDENT_ID, userId);
            }

            var searchOptionListString = undefined;
            if ( searchOptionList != undefined ) {
                searchOptionListString = searchOptionList.get();
            }

            Requester.awb(ApiUrl.Document.GET_DOCUMENT_SUMMARY_LIST , {
                typeCode : typeCode,
                searchOptionList : searchOptionListString,
                page : pageIndex,
                count : pageCount,
                orderByCode : DocumentOrderBy.REGISTERED_DATE_DESC
            } , function (status, data, request) {

                if(!status) {
                    return;
                }

                page.data = data;
                page.list = Lia.p(data , 'body' , 'list');
                page.totalCount = Lia.p(data , 'body' , 'total_count')

                page.content.empty()

                var panel = new Triton.Panel({appendTo : page.content});

                var table = new Triton.ListTable({appendTo : panel});

                table.appendHeaderRow({});
                table.appendHeaderColumn({ content : '번호' , css : {'width' : '50px'}});
                table.appendHeaderColumn({ content : '수료증 코드' , css : {'width' : '200px'}});
                table.appendHeaderColumn({ content : '강의명' , css : {'width' : '700px'}});
                table.appendHeaderColumn({ content : '수료자' , css : {'width' : '150px'}});
                table.appendHeaderColumn({ content : '수료증 발행 일자' , css : {'width' : '150px'}});

                ProjectSettings.Document.onHeaderDocumentSummaryList(table);

                var list = page.list;

                if(Array.isEmpty(list)) {

                    new Triton.Section({
                        appendTo : panel,
                        theme : Triton.Section.Theme.ListMessage,
                        content : '조회 가능한 수료증이 없습니다.'
                    });

                } else {

                    for (var idx in list) {

                        var item = Lia.p(list, idx);

                        var id = Lia.p(item, 'id');
                        var rowNumber = parseInt(Lia.p(item, 'row_number'));
                        var code = Lia.pcd('-' , item , 'code');
                        var title = Lia.pcd(Lia.p(item,'properties', 'service_title'), item, 'course_service_title');
                        var userName = Lia.pd('-' , item, 'student_user_name');
                        var registeredDate = Lia.p(item, 'registered_date');
                        var properties = Lia.p(item , 'properties');
                        var credit = Lia.pcd('-' , properties , 'credit');

                        table.appendRow({
                            attr: {'document_id': id},
                            theme : Triton.ListTable.Row.Theme.NoLink
                            // onClick: function () {
                            //     PageManager.go(['payment/coupon_detail'], {
                            //         'id': $(this).attr('coupon_id')
                            //     });
                            // }
                        });



                        table.appendColumn({ content : rowNumber });
                        table.appendColumn({content: code});
                        table.appendColumn({content: title});

                        var nameAndIdText = UserHelper.getStudentUserTextOnList(item);
                        OpenHelper.bindUserInfo(table.appendColumn({content: nameAndIdText}), item['student_user_idx']);


                        table.appendColumn({content: registeredDate});

                        ProjectSettings.Document.onDocumentSummaryList(table , item);
                    }
                }

                var pageContainer = new Triton.Section({
                    appendTo : panel,
                    css : { 'margin-top' : '30px', 'line-height' : '30px', 'text-align' : 'center' }
                })

                new Triton.Pager({
                    appendTo : pageContainer,
                    'pageNumber': Lia.p(request, 'parameterMap', 'page'),
                    'countPerPage': Lia.p(request, 'parameterMap', 'count'),
                    'totalCount': Lia.p(page.data, 'body', 'total_count'),
                    'onPageSelected': function (pageNumber) {

                        PageManager.goCurrentPageWithCurrentParameterMap({
                            page: pageNumber
                        });
                    }
                });
            })
        },

        onRelease: function (j) {
        }
    };
})();
