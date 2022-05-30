(function () {

    return {

        search: function () {

            var page = this;
            var item = Triton.extractFormData(page.get());
            item['page'] = 1;
            PageManager.cpcpm(item);
        },


        change: function (parameterMap) {

            var page = this;

            var searchByCourseOperationCode = Lia.pd('', parameterMap, 'search_by_course_operation_code');
            page.courseOperationCodeTextInput.setValue(searchByCourseOperationCode);

            var searchByCourseName = Lia.pd('', parameterMap, 'search_by_course_name');
            page.courseNameTextInput.setValue(searchByCourseName);

            page.searchPeriod.startDatetimePicker.setValue(Lia.p(parameterMap , 'start_date'))
            page.searchPeriod.endDatetimePicker.setValue(Lia.p(parameterMap , 'end_date'))


            // var searchByYear = Lia.pd('', parameterMap, 'search_by_year');
            // page.yearCB.setValue(searchByYear);
            //
            // var searchByMonth = Lia.pd('', parameterMap, 'search_by_month');
            // page.monthCB.setValue(searchByMonth);

            Requester.func(function () {

                var institutionId = Lia.pd(page.institutionId, parameterMap, 'institution_id');
                var organizationId = Lia.pd(page.organizationId, parameterMap, 'organization_id');
                var termTypeCode = Lia.pd(page.termTypeCode, parameterMap, 'term_type_code');
                var isAvailable = Lia.pd('', parameterMap, 'is_available');
                // var statusCodeList = Lia.pd(CourseStatus.WAITING + ',' + CourseStatus.REGISTERING + ',' + CourseStatus.OPERATING + ',' + CourseStatus.MARK_REVIEWING, parameterMap, 'status_code_list');
                var statusCodeList = Lia.pd('ALL', parameterMap, 'status_code_list');

                page.termTypeComboBox.setValue(termTypeCode, true);
                termTypeCode = page.termTypeComboBox.getValue();

                if (TermType.isNotDefault(termTypeCode)) {

                    page.termYearComboBox.show();
                    page.termComboBox.show();

                } else {

                    page.termYearComboBox.hide();
                    page.termComboBox.hide();
                }

                if (UserManager.getUserRoleCode() == UserRole.ADMIN || UserManager.getUserRoleCode() == UserRole.INSTITUTION_ADMIN) {

                    if (page.institutionId != institutionId || page.organizationId != organizationId || page.termTypeCode != termTypeCode) {

                        page.institutionId = institutionId;
                        page.organizationId = organizationId;
                        page.termTypeCode = termTypeCode;

                        // if (TermType.isNotDefault(termTypeCode)) {
                        //
                        //     page.addTermButton.show();
                        //     page.editTermButton.show();
                        //
                        // } else {
                        //
                        //     page.addTermButton.hide();
                        //     page.editTermButton.hide();
                        // }
                    }
                }

                Requester.func(function () {

                    var termYear = Lia.p(parameterMap, 'term_year');
                    page.termYearComboBox.setValue(termYear, true);
                    termYear = page.termYearComboBox.getValue();

                    var currentSelectedTermTypeCode = page.termTypeComboBox.getValue();

                    if (page.selectedTermTypeCode == undefined)
                        page.selectedTermTypeCode = currentSelectedTermTypeCode;

                    if ((page.selectedTermTypeCode != currentSelectedTermTypeCode || page.termYearinstitutionId != institutionId || page.termYearOrgId != organizationId || page.termYear != termYear)) {

                        page.termYearinstitutionId = institutionId;
                        page.termYearOrgId = organizationId;
                        page.termYear = termYear;
                        page.selectedTermTypeCode = currentSelectedTermTypeCode;

                        Requester.ajaxWithoutBlank(ApiUrl.Learning.GET_SIMPLE_TERM_LIST, {
                            institutionId: institutionId,
                            organizationId: organizationId,
                            typeCodeList: termTypeCode,
                            year: termYear,
                            adminPage: 1,
                            'orderByCode': PolarisSettings.DEFAULT_TERM_ORDER_BY
                        }, function (status, data, request) {

                            if (status != Requester.Status.SUCCESS) {
                                return;
                            }

                            var optionList = OptionListHelper.convertTermOptionList(Lia.p(data, 'body', 'list'), true);
                            page.termComboBox.setOptionList(optionList);
                        });

                    }
                });
            });
        },

        onInit: function (j) {

            var page = this;

            page.allowAcademicAdvisorAssignment = true;

            if (!Configs.containsUserRole(UserRole.ACADEMIC_ADVISOR)) {

                page.allowAcademicAdvisorAssignment = false;

            } else {

                if (UserManager.getUserRoleCode() == UserRole.ORGANIZATION_ADMIN && Server.allowHomepageOperation == 0)
                    page.allowAcademicAdvisorAssignment = false;
            }

            page.allowCourseEnrollment = true;

            if (UserManager.getUserRoleCode() == UserRole.ORGANIZATION_ADMIN && Server.allowHomepageOperation == 0)
                page.allowCourseEnrollment = false;

            var container = new Triton.Container({
                appendTo: j
            });

            new Triton.Title({
                appendTo : container,
                content : PageConstructor.getCurrentMenuName()
            });

            var section = new Triton.Section({
                appendTo: container
            });


            {
                // var searchYearPanel = new Triton.Panel({
                //     appendTo: section,
                //     css : { 'margin-bottom' : '10px' }
                // });
                // var searchYearTable = page.searchYearTable = new Triton.DetailTable({appendTo: searchYearPanel});
                //
                // searchYearTable.appendRow({});
                // searchYearTable.appendKeyColumn({
                //     content: '기준년도'
                // });
                //
                // searchYearTable.appendValueColumn({
                //     content : page.historyYearComboBox = new Triton.ComboBox({
                //         form: {name: 'history_year'},
                //         css: {'float': 'left', 'margin-right': '5px', 'width': '150px'},
                //         optionList: OptionListHelper.createCourseYearList(true, '현재 기준'),
                //         onSelected: function (val) {
                //         }
                //     })
                // });


                var searchPanel = new Triton.Panel({appendTo: section});
                var searchTable = page.searchTable = new Triton.DetailTable({appendTo: searchPanel});

                {

                    var date = new Date();
                    var year = date.getFullYear();

                    var yearList = [];
                    for (var y = year, yl = 2021; y >= yl; y--) {
                        yearList.push({name: y, value: y});
                    }

                    searchTable.appendRow({});
                    searchTable.appendKeyColumn({
                        content: Strings.getString(Strings.COURSE_YEAR)
                    });

                    searchTable.appendValueColumn({
                        content : page.courseYearComboBox = new Triton.ComboBox({
                            form: {name: 'course_year'},
                            css: {'float': 'left', 'margin-right': '5px', 'width': '150px'},
                            optionList: yearList,
                            onSelected: function (val) {
                            }
                        })
                    });


                    searchTable.appendRow({});
                    searchTable.appendKeyColumn({
                        content: Strings.getString(Strings.TERM)
                    });

                    var termSection = new Triton.Section({});


                    page.termTypeComboBox = new Triton.ComboBox({
                        appendTo: termSection,
                        form: {name: 'term_type_code'},
                        css: {'float': 'left', 'margin-right': '5px', 'width': '150px'},
                        optionList: TermType.createOptionList(true),
                        onSelected: function (val) {

                            var map = Triton.extractFormData(page.get());
                            var termYearValue = page.termYearComboBox.getValue();

                            map['term_type_code'] = val;
                            map['term_year'] = Lia.pd('', termYearValue);
                            map['term_id'] = '';

                            page.change(map);
                        }
                    });

                    page.termYearComboBox = new Triton.ComboBox({
                        appendTo: termSection,
                        form: {name: 'term_year'},
                        optionList: OptionListHelper.createTermYearList(true),
                        css: {'float': 'left', 'margin-right': '5px', 'width': '90px'},
                        onSelected: function (val) {
                            var map = Triton.extractFormData(page.get());

                            map['term_year'] = val;
                            map['term_id'] = '';

                            page.change(map);
                        }
                    });
                    page.termYearComboBox.hide();

                    page.termComboBox = new Triton.ComboBox({
                        appendTo: termSection,
                        form: {name: 'term_id'},
                        css: {'float': 'left', 'margin-right': '10px', 'width': '350px'},
                        onSelected: function (val, selectedOption, options) {
                            var map = Triton.extractFormData(page.get());
                            map['term_id'] = val;
                            page.change(map);
                        }
                    });
                    page.termComboBox.hide();

                    searchTable.appendValueColumn({
                        content: termSection, attr: {'colspan': 5}
                    });
                }

                {
                    searchTable.appendRow({});

                    searchTable.appendKeyColumn({
                        content: Strings.getString(Strings.COURSE) + ' 운영코드'
                    });
                    searchTable.appendValueColumn({
                        content: page.courseOperationCodeTextInput = new Triton.TextInput({
                            form: {name: 'search_by_course_operation_code'},
                            theme: Triton.TextInput.Theme.Full,
                            onEnter: function (e) {
                                page.search();
                            }
                        })
                    });


                    searchTable.appendKeyColumn({
                        content: Strings.getString(Strings.COURSE) + '명'
                    });
                    searchTable.appendValueColumn({
                        content: page.courseNameTextInput = new Triton.TextInput({
                            form: {name: 'search_by_course_name'},
                            theme: Triton.TextInput.Theme.Full,
                            onEnter: function (e) {
                                page.search();
                            }
                        })
                    });

                    searchTable.appendKeyColumn({
                        content: '과목 시작일'
                    });
                    searchTable.appendValueColumn({
                        content : page.searchPeriod = new Triton.DatetimePeriodPicker({
                            startOptions: {
                                type: Triton.DatetimePicker.TYPE_DATE,
                                form: {name : 'start_date'}
                            },

                            endOptions: {
                                type: Triton.DatetimePicker.TYPE_DATE,
                                form: {name : 'end_date'}
                            }
                        })
                    });
                }



                {
                    searchTable.appendRow({});

                    searchTable.appendKeyColumn({
                        content: '수강생 아이디'
                    });
                    searchTable.appendValueColumn({
                        content: new Triton.TextInput({
                            form: {name: 'search_by_id'},
                            theme: Triton.TextInput.Theme.Full,
                            onEnter: function (e) {
                                page.search();
                            }
                        })
                    });


                    searchTable.appendKeyColumn({
                        content: '수강생 이름'
                    });
                    searchTable.appendValueColumn({
                        content: new Triton.TextInput({
                            form: {name: 'search_by_name'},
                            theme: Triton.TextInput.Theme.Full,
                            onEnter: function (e) {
                                page.search();
                            }
                        })
                    });

                    searchTable.appendKeyColumn({
                        content: '수료 여부'
                    });
                    searchTable.appendValueColumn({
                        content : new Triton.ComboBox({
                            form: {name: 'is_completed'},
                            optionList : [
                                { name : '전체' , value : '' },
                                { name : '수료' , value : 1 },
                                { name : '미수료' , value : 0 }
                            ]
                        })
                    });
                }

                var searchButtonSection = new Triton.LeftRightSection({
                    appendTo: searchPanel
                });

                searchButtonSection.appendToRight(new Triton.FlatButton({
                    content: '검색 조건 초기화',
                    theme: Triton.FlatButton.Theme.Normal,
                    page: page,
                    onClick: function (e) {

                        var item = Triton.extractFormData(searchPanel);

                        if (item != undefined && Lia.assocArraySize(item) > 0) {

                            for (var key in item) {
                                item[key] = '';
                            }
                        }

                        item['page'] = 1;
                        PageManager.cpcpm(item);
                    }
                }));

                searchButtonSection.appendToRight(new Triton.FlatButton({
                    content: '검색',
                    theme: Triton.FlatButton.Theme.Normal,
                    page: page,
                    onClick: function (e) {

                        page.search();
                    }
                }));
            }

            var middleSection = new Triton.Section({
                appendTo: container,
                css: {'margin-top': '10px'}
            });

            var categorySection = page.categorySection = new Triton.Section({
                appendTo: middleSection,
                theme: Triton.Section.Theme.Category,
                css: {'margin-top': '10px'},
                addClass: 'category_section'
            });

            page.resultButton = new Triton.FlagRadioButtonSection({
                appendTo: page.categorySection,
                executeBySameValue: true,
                onSelected: function (val) {}
            });
            page.resultButton.appendFlagRadioButton({
                option : {
                    name : '전체 ' + '-'
                }
            });
            page.resultButton.setValue(undefined, true);

            page.countComboBox = new Triton.ComboBox({
                appendTo: categorySection,
                theme: Triton.ComboBox.Theme.Category,
                form: {name: 'count'},
                css: {'width': '150px'},
                optionList: PolarisSettings.CountOptionList,
                onSelected: function (val) {
                    PageManager.goCurrentPageWithCurrentParameterMap({'page': 1, 'count': val});
                }
            });

            new Triton.FlatButton({
                appendTo: categorySection,
                theme: Triton.FlatButton.Theme.Normal,
                css: {'margin-left': '8px', 'border-radius': '10px', 'float': 'right'},
                content: '엑셀 다운로드',
                onClick: function () {

                    if (page.responseTotalCount == undefined)
                        page.responseTotalCount = 0;

                    var excelExportParameterMap = page.requestMap;
                    excelExportParameterMap['orderByCode'] = 2000;

                    AjaxPopupHelper.exportDownload({
                        requestMap: excelExportParameterMap,
                        responseTotalCount: page.responseTotalCount,
                        url: ProjectApiUrl.Stat.EXPORT_COURSE_ENROLLMENT_SUMMARY_LIST_FOR_HISTORY
                    });
                }
            });

            page.contentSection = new Triton.Section({
                appendTo: container
            });


            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {
                if (!status) {
                    return
                }

                page.attrList = Lia.p(data, 'body', 'list');
            })
        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            Requester.func(function () {

                Requester.func(function () {

                    Requester.func(function () {

                        Triton.placeFormData(page.get(), parameterMap);

                        var requestCount = PageManager.pcd(20, 'count');
                        if (requestCount != undefined) {
                            page.countComboBox.setValue(requestCount, true);
                        }

                        var map = FormatHelper.arrayKeyToCamel(Triton.extractFormData(page.get()));

                        var searchOption = new SearchOption();
                        var searchKeyword = map['searchByCourseName'];
                        if (String.isNotBlank(searchKeyword)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.COURSE_NAME, searchKeyword);
                        }

                        var searchById = map['searchById'];
                        if (String.isNotBlank(searchById)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.USER_ID, searchById);
                        }

                        var searchByName = map['searchByName'];
                        if (String.isNotBlank(searchByName)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.USER_NAME, searchByName);
                        }

                        var searchByAcademicAdvisorId = map['searchByAcademicAdvisorId'];
                        if (String.isNotBlank(searchByAcademicAdvisorId)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.ACADEMIC_ADVISOR_USER_ID, searchByAcademicAdvisorId);
                        }

                        var searchByAcademicAdvisorName = map['searchByAcademicAdvisorName'];
                        if (String.isNotBlank(searchByAcademicAdvisorName)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.ACADEMIC_ADVISOR_USER_NAME, searchByAcademicAdvisorName);
                        }

                        var searchByReceiveEmail = map['searchByReceiveEmail'];
                        if (String.isNotBlank(searchByReceiveEmail) && searchByReceiveEmail >= 0) {

                            searchOption.add(SearchOption.CourseEnrollemntSummary.RECEIVE_EMAIL, searchByReceiveEmail);
                        }

                        var searchByReceiveTextMessage = map['searchByReceiveTextMessage'];
                        if (String.isNotBlank(searchByReceiveTextMessage) && searchByReceiveTextMessage >= 0) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.RECEIVE_TEXT_MESSAGE, searchByReceiveTextMessage);
                        }

                        var searchByReceivePushMessage = map['searchByReceivePushMessage'];
                        if (String.isNotBlank(searchByReceivePushMessage) && searchByReceivePushMessage >= 0) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.RECEIVE_TEXT_MESSAGE, searchByReceivePushMessage);
                        }


                        var searchByCourseStartDatePeriodStartDate = map['searchByCourseStartDatePeriodStartDate'];
                        if (String.isNotBlank(searchByCourseStartDatePeriodStartDate)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.FROM_COURSE_START_DATE, searchByCourseStartDatePeriodStartDate + ' 00:00:00');
                        }

                        var searchByCourseStartDatePeriodEndDate = map['searchByCourseStartDatePeriodEndDate'];
                        if (String.isNotBlank(searchByCourseStartDatePeriodEndDate)) {
                            searchOption.add(SearchOption.CourseEnrollemntSummary.TO_COURSE_START_DATE, searchByCourseStartDatePeriodEndDate + ' 23:59:59');
                        }


                        if (searchOption.size() > 0) {
                            map['searchOptionList'] = searchOption.get();
                        }

                        map['statusCode'] = CourseEnrollmentStatus.ENROLLED;
                        map['count'] = page.countComboBox.getValue();
                        map['page'] = PageManager.pcd(1, 'page');

                        map['orderByCode'] = 1000;
                        map['includeStudentProperties'] = 1;
                        map['courseExcludeFromStatistics'] = 0;
                        map['includeCourseProperties'] = 1;


                        if ( map['courseYear'] != new Date().getFullYear() ) {
                            map['historyYear'] = map['courseYear'];
                        }

                        Requester.awb(ProjectApiUrl.Stat.GET_COURSE_ENROLLMENT_SUMMARY_LIST_FOR_HISTORY, page.requestMap = map, function (status, data, request) {

                            if (status != Requester.Status.SUCCESS) {
                                return;
                            }

                            var contentSection = page.contentSection;
                            contentSection.empty();

                            var contentPanel = new Triton.Panel({
                                appendTo: contentSection,
                                theme: Triton.Panel.Theme.List,
                                // css : {
                                //     'overflow-x' : 'auto',
                                //     'max-width' : '2000px'
                                // },
                                //contentMinWidth: '2505px'
                            });

                            var listTable = new Triton.ListTable({
                                appendTo: contentPanel
                            });

                            var listStatusCode = map['statusCode'];

                            listTable.appendHeaderRow({});
                            listTable.appendHeaderColumn({content: '번호', css: {'width': '50px'}});
                            listTable.appendHeaderColumn({content: '기수 구분', css: {'width': '150px'}});
                            listTable.appendHeaderColumn({content: '양성/보수', css: {'width': '100px'}});
                            listTable.appendHeaderColumn({content: '구분1', css: {'width': '50px'}});
                            //listTable.appendHeaderColumn({content: '구분2', css: {'width': '100px'}});
                            listTable.appendHeaderColumn({
                                content: Strings.getString(Strings.COURSE),
                                css: {'width': '600px'}
                            });
                            listTable.appendHeaderColumn({
                                content: Strings.getString(Strings.STUDENT),
                                css: {'width': '100px'}
                            });
                            // listTable.appendHeaderColumn({content: '연락처 ', css: {'width': '100px'}});
                            // listTable.appendHeaderColumn({content: '생년월일 ', css: {'width': '100px'}});
                            // listTable.appendHeaderColumn({content: '이메일 ', css: {'width': '100px'}});
                            // listTable.appendHeaderColumn({content: '지정 성별 ', css: {'width': '85px'}});
                            listTable.appendHeaderColumn({content: '소속기관명 ', css: {'width': '150px'}});
                            listTable.appendHeaderColumn({content: '소속기관 유형 ', css: {'width': '150px'}});
                            listTable.appendHeaderColumn({content: '소속기관 소재지 ', css: {'width': '100px'}});
                            // listTable.appendHeaderColumn({content: '국비지원여부 ', css: {'width': '85px'}});
                            // listTable.appendHeaderColumn({content: '소속기관연락처', css: {'width': '100px'}});
                            // listTable.appendHeaderColumn({content: '현 기관<br/>총 경력', css: {'width': '140px'}});
                            // listTable.appendHeaderColumn({content: '여성폭력방지기관<br/>총 경력', css: {'width': '140px'}});
                            // listTable.appendHeaderColumn({content: '직위', css: {'width': '85px'}});
                            // listTable.appendHeaderColumn({content: '신청 일시 ', css: {'width': '85px'}});
                            listTable.appendHeaderColumn({content: '수료 여부', css: {width: '80px'}});
                            listTable.appendHeaderColumn({content: '수료 일자', css: {width: '100px'}});
                            listTable.appendHeaderColumn({content: '담당자 ', css: {'width': '100px'}});

                            var body = page.body = data['body'];
                            var list = page.list = Lia.p(body, 'list');
                            var totalCount = Lia.pd(0, data, 'body', 'total_count');

                            page.resultButton.clear();
                            page.resultButton.appendFlagRadioButton({
                                option: {
                                    name: '전체 ' + FormatHelper.numberWithCommas(totalCount)
                                }
                            });
                            page.resultButton.setValue(undefined, true);

                            if (list == undefined || list.length == 0) {

                                new Triton.Section({
                                    appendTo: contentSection,
                                    theme: Triton.Section.Theme.ListMessage,
                                    content: '표시할 데이터가 없습니다.'
                                });

                            } else {

                                Requester.func(function () {
                                    var attrMap = Lia.convertListToMap(page.attrList, 'id');

                                    for (var i = 0, l = list.length; i < l; i++) {

                                        var item = list[i];

                                        var statusCode = Lia.p(item, 'status_code');
                                        var statusColor;

                                        if (statusCode == CourseEnrollmentStatus.UNENROLLED
                                            || statusCode == CourseEnrollmentStatus.AUDITING_CANCELLED
                                            || statusCode == CourseEnrollmentStatus.AUTO_UNENROLLED_DUE_TO_USER_DELETE
                                            || statusCode == CourseEnrollmentStatus.AUTO_UNENROLLED_DUE_TO_USER_ROLE_CHANGE) {

                                            statusColor = '#FF0000'

                                        } else if (statusCode == CourseEnrollmentStatus.ENROLLED
                                            || statusCode == CourseEnrollmentStatus.AUDITING) {

                                            statusColor = '#5775f9';
                                        }

                                        var status = '<span class="mobile_hide" style="color: ' + statusColor + '; font-size: 13px; font-weight: bold;">' +
                                            CourseEnrollmentStatus.getName(statusCode) + '</span>';

                                        listTable.appendRow({
                                            attr: {'student-user-idx': item['student_user_idx']},
                                            theme: Triton.ListTable.Row.Theme.NoLink
                                        });

                                        listTable.appendColumn({content: item['row_number']});

                                        // 기수
                                        var termString;

                                        if (Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

                                            var year = Lia.p(item, 'term_year');
                                            var typeCode = Lia.p(item, 'term_type_code');
                                            var number = Lia.p(item, 'term_number');
                                            var name = TermNumber.getName(number);
                                            termString = year + '년 ' + name;

                                        } else {

                                            termString = '상시';
                                            var termTypeCode = item['term_type_code'];
                                            var termName = Lia.pcd('-', item, 'term_name');

                                            if (termTypeCode != TermType.DEFAULT) {

                                                var termYear = Lia.p(item, 'term_year');
                                                var termNumber = Lia.p(item, 'term_number');
                                                termString = termYear + '-' + termNumber;
                                            }

                                            if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)) {

                                                var organizationName = Lia.pd('자체운영', item, 'organization_name');
                                                termString = termString + '<br/>(' + organizationName + ')';
                                            }
                                        }

                                        // listTable.appendColumn({content: termString});
                                        listTable.appendColumn({content: termName});

                                        //양성/보수 구분2 구분3
                                        var courseAttrList = Lia.p(item, 'course_attribute_list');
                                        var isTraning = '보수'
                                        for (var k in courseAttrList) {
                                            var attr = courseAttrList[k];
                                            if (Lia.p(attr, 'attribute_id') == '16') {
                                                isTraning = '양성'
                                            }
                                        }
                                        var courseCode = Lia.pcd('-', item, 'course_operation_code')

                                        listTable.appendColumn({content: isTraning});
                                        listTable.appendColumn({content: Lia.pcd('-', courseCode.split('-')[1])});
                                        //listTable.appendColumn({content: Lia.pcd('-', courseCode.split('-')[2])});


                                        OpenHelper.bindCourse(listTable.appendColumn({
                                            content: Lia.p(item, 'course_service_title'),
                                            css: {'text-align': 'left', 'padding-left': '10px'}
                                        }), item['course_code_id'], item['course_content_id'], item['course_id']);

                                        var nameAndIdText = UserHelper.getStudentUserTextOnList(item);
                                        OpenHelper.bindUserInfo(listTable.appendColumn({content: nameAndIdText}), item['student_user_idx']);


                                        var studentProperties = Lia.convertListToMap(Lia.p(item, 'student_user_properties'), 'name');

                                        // listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_mobile_phone_number')});
                                        // listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_date_of_birth').split(' ')[0]});
                                        // listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_email')});
                                        // listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_gender_code')});

                                        listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_company_name')});
                                        listTable.appendColumn({content: Lia.pcd('-', attrMap, Lia.pcd('-', studentProperties, 'agTypeDp', 'value'), 'name')});
                                        listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_address_1').split(' ')[0]});
                                        // listTable.appendColumn({content: Lia.pcd('-', item, 'support', 'value') == 1 ? '지원' : '미지원'});
                                        // listTable.appendColumn({content: Lia.pcd('-', item, 'student_user_office_phone_number')});
                                        // listTable.appendColumn({content: Lia.pcd('-', attrMap, Lia.pcd('-', studentProperties, 'career_present', 'value'), 'name')});
                                        // listTable.appendColumn({content: Lia.pcd('-', attrMap, Lia.pcd('-', studentProperties, 'career', 'value'), 'name')});
                                        // listTable.appendColumn({content: Lia.pcd('-', attrMap, Lia.pcd('-', studentProperties, 'company_position', 'value'), 'name') == undefined ? Lia.pcd('-', studentProperties, 'positionText', 'value') : Lia.pcd('-', attrMap, Lia.pcd('-', studentProperties, 'company_position', 'value'), 'name')});
                                        //
                                        // listTable.appendColumn({content: Lia.pd('-', item, 'registered_date')});

                                        if (listStatusCode == CourseEnrollmentStatus.ENROLLED) {


                                            var isCompleted = item['is_completed'];
                                            var completionStatusText;

                                            if (isCompleted == 1) {

                                                completionStatusText = '수료';

                                            } else {

                                                completionStatusText = '미수료';
                                            }


                                            listTable.appendColumn({
                                                content: completionStatusText
                                            });


                                            var completionDate = Lia.pcd('-', item, 'completion_date');

                                            listTable.appendColumn({
                                                content: completionDate
                                            })
                                        }

                                        listTable.appendColumn({content: Lia.pd('-', item, 'course_properties', 'course_admin_for_report')});

                                    }

                                })
                            }

                            var jPagerContainer = new Triton.Section({
                                theme: Triton.Section.Theme.Pager,
                                appendTo: contentSection
                            });

                            new Triton.Pager({
                                appendTo: jPagerContainer,
                                'pageNumber': Lia.p(request, 'parameterMap', 'page'),
                                'countPerPage': Lia.p(request, 'parameterMap', 'count'),
                                'totalCount': page.responseTotalCount = Lia.p(data, 'body', 'total_count'),
                                'onPageSelected': function (pageNumber) {
                                    PageManager.goCurrentPageWithCurrentParameterMap({
                                        page: pageNumber
                                    });
                                }
                            });

                            // 창 크기에 따라 조절하는 부분
                            var $window = $(window);
                            var lastWindowWidth = $window.width();

                            if (lastWindowWidth <= 1628) {

                                page.find('.additional_info').hide();

                            } else {

                                page.find('.additional_info').show();
                            }

                            $window.resize(function () {

                                var windowWidth = $window.width();

                                if (lastWindowWidth !== windowWidth) {

                                    if (windowWidth < 1628) {

                                        page.find('.additional_info').hide();

                                    } else {

                                        page.find('.additional_info').show();
                                    }

                                    lastWindowWidth = windowWidth;
                                }
                            });
                        });
                    });
                });
            });
        },
        onRelease: function (j) {

        }
    };
})();
