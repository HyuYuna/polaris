(function () {

    return {

        search: function () {

            var page = this;

            var item = Triton.extractFormData(page.get());
            item['page'] = 1;
            PageManager.cpcpm(item);
        },

        onInit: function (j) {

            var page = this;

            var section = new Triton.Section({
                appendTo : j
            });

            var title = new Triton.Title({
                content : '뉴스레터 목록',
                appendTo : section
            })

            var searchPanel = new Triton.Panel({
                appendTo: section
            });

            var searchTable = new Triton.DetailTable({
                appendTo: searchPanel
            });

            {
                searchTable.appendRow({});
                searchTable.appendKeyColumn({
                    content: '이름'
                });

                searchTable.appendValueColumn({
                    content: new Triton.TextInput({
                        form: {name: 'name'},
                        theme: Triton.TextInput.Theme.Full,
                        onKeyPress: function (e) {

                            if (e.which == Lia.KeyCode.ENTER) {

                                page.search();
                                //PageManager.goCurrentPageWithCurrentParameterMap({
                                //    name : $(this).val(),
                                //    page : 1
                                //});
                            }

                        }
                    })
                });
                searchTable.appendKeyColumn({
                    content: '아이디'
                });

                searchTable.appendValueColumn({
                    content: new Triton.TextInput({
                        form: {name: 'id'},
                        theme: Triton.TextInput.Theme.Full,
                        onKeyPress: function (e) {

                            if (e.which == Lia.KeyCode.ENTER) {

                                page.search();
                                //PageManager.goCurrentPageWithCurrentParameterMap({
                                //    name : $(this).val(),
                                //    page : 1
                                //});
                            }

                        }
                    })
                });

                searchTable.appendRow({});
                searchTable.appendKeyColumn({
                    content: '전화번호'
                });

                searchTable.appendValueColumn({
                    content: new Triton.TextInput({
                        form: {name: 'mobile_phone_number'},
                        theme: Triton.TextInput.Theme.Full,
                        onKeyPress: function (e) {

                            if (e.which == Lia.KeyCode.ENTER) {

                                page.search();
                                //PageManager.goCurrentPageWithCurrentParameterMap({
                                //    name : $(this).val(),
                                //    page : 1
                                //});
                            }

                        }
                    })
                });

                searchTable.appendKeyColumn({
                    content: '이메일'
                });

                searchTable.appendValueColumn({
                    content: new Triton.TextInput({
                        form: {name: 'email'},
                        theme: Triton.TextInput.Theme.Full,
                        onKeyPress: function (e) {

                            if (e.which == Lia.KeyCode.ENTER) {

                                page.search();
                                //PageManager.goCurrentPageWithCurrentParameterMap({
                                //    name : $(this).val(),
                                //    page : 1
                                //});
                            }

                        }
                    })
                });



            }

            var searchButtonSection = new Triton.ButtonSection({
                appendTo: section
            });


            searchButtonSection.appendToRight(new Triton.FlatButton({
                content: '검색 조건 초기화',
                theme: Triton.FlatButton.Theme.Normal,
                page: page,
                onClick: function (e) {

                    var item = Triton.extractFormData(page.get());

                    for (var key in item) {
                        item[key] = '';
                    }

                    item['page'] = 1;
                    PageManager.cpcpm(item);

                }
            }, {
                page: page
            }));

            page.jSearchButton = new Triton.FlatButton({
                content: '검색',
                theme: Triton.FlatButton.Theme.Normal,
                css: {},
                page: page,
                onClick: function (e) {

                    page.search();
                }
            }, {
                page: page
            });

            searchButtonSection.appendToRight(page.jSearchButton);


            var middleSection = new Triton.ButtonSection({
                appendTo: section
            });

            var categorySection = page.categorySection = new Triton.Section({
                appendTo: middleSection,
                theme: Triton.Section.Theme.Category
            });

            new Triton.ComboBox({
                appendTo: categorySection,
                form: {name: 'count'},
                theme: Triton.ComboBox.Theme.Category,
                optionList: ProjectSettings.CountOptionList,
                selectedValue: PageManager.pcd(20, 'count'),
                onSelected: function (val) {

                    PageManager.cpcpm({
                        'page': 1,
                        'count': val
                    });
                }
            });

            new Triton.FlatButton({
                appendTo: categorySection,
                theme: Triton.FlatButton.Theme.Normal,
                css: {'margin-left': '10px', 'border-radius': '10px', 'float': 'right'},
                content: '엑셀 다운로드',
                onClick: function () {

                    if (page.responseTotalCount == undefined)
                        page.responseTotalCount = 0;

                    AjaxPopupHelper.exportDownload({
                        requestMap: page.requestMap,
                        responseTotalCount: page.responseTotalCount,
                        url: ApiUrl.User.EXPORT_USER_SUMMARY_LIST
                    });
                }
            });


            page.contentSection = new Triton.Section({
                appendTo : section
            });

        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            Requester.func(function () {

                Requester.func(function () {

                    parameterMap['count'] = PageManager.pcd('20', 'count');

                    Triton.placeFormData(page.get(), parameterMap);

                    var param = Triton.extractFormData(page.get());
                    param = FormatHelper.arrayKeyToCamel(param);

                    param['page'] = Lia.pd(1, parameterMap, 'page');
                    param['roleCodeList'] = UserRole.STUDENT;
                    param['statusCodeList'] = UserStatus.ACTIVE;

                    var id = Lia.p(param, 'id');
                    var name = Lia.p(param, 'name');
                    var mobilePhoneNumber = Lia.p(param, 'mobile_phone_number');
                    var email = Lia.p(param, 'email');

                    var searchOptionList = new SearchOptionList();
                    if (String.isNotBlank(id)) {
                        searchOptionList.add(SearchOption.User.ID, id);
                    }

                    if (String.isNotBlank(name)) {
                        searchOptionList.add(SearchOption.User.NAME, name);
                    }

                    if (String.isNotBlank(mobilePhoneNumber)) {
                        searchOptionList.add(SearchOption.User.PHONE_NUMBER, mobilePhoneNumber);
                    }

                    if (String.isNotBlank(email)) {
                        searchOptionList.add(SearchOption.User.EMAIL, email);
                    }

                    searchOptionList.add(SearchOption.User.RECEIVE_EMAIL, 1);

                    param['searchOptionList'] = searchOptionList.get();

                    Requester.ajaxWithoutBlank(ApiUrl.User.GET_USER_SUMMARY_LIST,
                        page.requestMap = param, function (status, data, request) {


                            var section = page.contentSection;
                            section.empty();

                            var panel = new Triton.Panel({
                                appendTo: section,
                                theme: Triton.Panel.Theme.List,
                                css: {'margin-top': '10px'}
                            });

                            var listTable = new Triton.ListTable({
                                appendTo: panel
                            });

                            listTable.appendHeaderRow({});
                            listTable.appendHeaderColumn({content: '번호', css: {'width': '50px'}});
                            listTable.appendHeaderColumn({content: '이름' });
                            listTable.appendHeaderColumn({content: '전화번호', css: {'width': '200px'}});
                            listTable.appendHeaderColumn({content: '이메일', css: {'width': '200px'}});

                            var list = Lia.p(data,'body','list');

                            if ( Array.isBlank(list)) {
                                new Triton.Section({
                                    appendTo: panel,
                                    theme: Triton.Section.Theme.ListMessage,
                                    content: '검색 결과에 맞는 내용이 없습니다.'
                                });
                            } else {

                                for (var i = 0, l = list.length; i < l; i++) {

                                    var item = list[i];

                                    listTable.appendRow({
                                        theme : Triton.ListTable.Row.Theme.NoLink
                                    });
                                    listTable.appendColumn({content: Lia.p(item,'row_number') });
                                    listTable.appendColumn({content: Lia.p(item,'name') });
                                    listTable.appendColumn({content: Lia.p(item,'mobile_phone_number') });
                                    listTable.appendColumn({content: Lia.p(item,'email') });

                                }

                            }
                            var pagerSection = new Triton.Section({
                                theme: Triton.Section.Theme.Pager,
                                appendTo: section
                            });

                            new Triton.Pager({
                                appendTo: pagerSection,
                                'pageNumber': Lia.p(request, 'parameterMap', 'page'),
                                'countPerPage': Lia.p(request, 'parameterMap', 'count'),
                                'totalCount': page.responseTotalCount = Lia.p(data, 'body', 'total_count'),
                                'onPageSelected': function (pageNumber) {
                                    PageManager.goCurrentPageWithCurrentParameterMap({
                                        page: pageNumber
                                    });
                                }
                            });
                        });
                });
            });
        },
        onRelease: function (j) {

        }
    };
})();
