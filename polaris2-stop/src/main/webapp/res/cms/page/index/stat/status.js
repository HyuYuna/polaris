(function () {

    return {

        institutionList: undefined,
        organizationList: undefined,
        listOrderByCode: undefined,

        refreshByOrderCode: function () {

            PageManager.cpcpm({
                order_by_code: page.listOrderByCode
            });
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
                var termTypeCode = Lia.pd(page.termTypeCode, parameterMap, 'term_type_code_list');
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

        search: function () {

            var page = this;
            var item = Triton.extractFormData(page.get());
            item['page'] = 1;
            PageManager.cpcpm(item);
        },

        onInit: function (j) {

            var page = this;

            page.prepared = false;

            var container = new Triton.Container({
                appendTo: j
            });

            var section = new Triton.Section({
                appendTo: container
            });

            new Triton.Title({
                appendTo: section,
                content: PageConstructor.getCurrentMenuName()
            });

            {
                // var searchYearPanel = new Triton.Panel({
                //     appendTo: section,
                //     css : { 'margin-bottom' : '10px' }
                // });
                //
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

                    searchTable.appendRow({});
                    searchTable.appendKeyColumn({
                        content: Strings.getString(Strings.COURSE_YEAR)
                    });


                    var date = new Date();
                    var year = date.getFullYear();

                    var yearList = [];
                    for (var y = year, yl = 2021; y >= yl; y--) {
                        yearList.push({name: y, value: y});
                    }

                    searchTable.appendValueColumn({
                        content : page.courseYearComboBox = new Triton.ComboBox({
                            form: {name: 'year'},
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
                        form: {name: 'term_type_code_list'},
                        css: {'float': 'left', 'margin-right': '5px', 'width': '150px'},
                        optionList: TermType.createOptionList(true),
                        onSelected: function (val) {

                            var map = Triton.extractFormData(page.get());
                            var organizationValue;

                            if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN))
                                organizationValue = page.organizationComboBox.getValue();

                            var termYearValue = page.termYearComboBox.getValue();

                            map['term_type_code_list'] = val;
                            map['organization_id'] = Lia.pd('', organizationValue);
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

                //{
                //    searchTable.appendRow({});
                //    searchTable.appendKeyColumn({
                //        content: '강사 배정여부'
                //    });
                //
                //    var optionList = [];
                //    optionList.push({name: '전체', value: ''});
                //    optionList.push({name: '배정', value: '1'});
                //    optionList.push({name: '미배정', value: '0'});
                //
                //    searchTable.appendValueColumn({
                //        content: page.teacherCountComboBox = new Triton.ComboBox({
                //            form: {name: 'is_teacher_assigned'},
                //            theme: Triton.ComboBox.Theme.Normal,
                //            optionList: optionList,
                //            onSelected: function (val) {
                //
                //            }
                //        })
                //    });
                //
                //    searchTable.appendKeyColumn({
                //        content: '튜터 배정여부'
                //    });
                //
                //    var optionList = [];
                //    optionList.push({name: '전체', value: ''});
                //    optionList.push({name: '배정', value: '1'});
                //    optionList.push({name: '미배정', value: '0'});
                //
                //    searchTable.appendValueColumn({
                //        content: page.isAvailableComboBox = new Triton.ComboBox({
                //            form: {name: 'is_teaching_assistant_assigned'},
                //            theme: Triton.ComboBox.Theme.Normal,
                //            optionList: optionList,
                //            onSelected: function (val) {
                //
                //            }
                //        })
                //    });
                //}

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

                            if (key.indexOf('institution_id')) {
                                page.institutionComboBox.setValue(page.defaultInstitutionId);
                            } else if (key.index('curriculum_id')) {

                                if (Configs.getConfig(Configs.CURRICULUM))
                                    page.curriculumComboBox.setValue('');

                            } else if (key.index('term_type_code_list')) {
                                page.termTypeComboBox.setValue('');
                            } else if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN) && key.indexOf('organization_id')) {
                                page.organizationComboBox.setValue('')
                            } else if (key.indexOf('term_year')) {
                                page.termYearComboBox.setValue('')
                            } else if (key.indexOf('term_id')) {
                                page.termComboBox.setValue('');
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

            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {
                if (!status) {
                    return;
                }

                page.attribute = Lia.p(data, 'body', 'list')
            })

            page.categorySection = new Triton.Section({
                css: {'margin-top': '10px'},
                theme: Triton.Section.Theme.Category,
                appendTo: container
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
                appendTo: page.categorySection,
                form: {name: 'count'},
                selectedValue: PageManager.pc('count'),
                theme: Triton.ComboBox.Theme.Category,
                optionList: PolarisSettings.CountOptionList,
                onSelected: function (val) {
                    PageManager.cpcpm({count: val});
                }
            });

            new Triton.FlatButton({
                appendTo: page.categorySection,
                theme: Triton.FlatButton.Theme.Normal,
                css: {'margin-left': '10px', 'border-radius': '10px', 'float': 'right'},
                content: '엑셀 다운로드',
                onClick: function () {

                    if (page.responseTotalCount == undefined)
                        page.responseTotalCount = 0;

                    var excelExportParameterMap = page.requestMap;
                    excelExportParameterMap['orderByCode'] = 2000;

                    AjaxPopupHelper.exportDownload({
                        requestMap: excelExportParameterMap,
                        responseTotalCount: page.responseTotalCount,
                        url: ProjectApiUrl.Stat.exportCourseSummaryList
                    });
                }
            });

            page.contentSection = new Triton.Section({
                appendTo: container
            });

        },


        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            page.change(parameterMap);

            Requester.func(function () {

                Requester.func(function () {
                    Requester.func(function () {

                        var termId = PageManager.pc('term_id');
                        page.termComboBox.setValue(termId, true);

                        var termTypeCode = PageManager.pc('term_type_code_list');
                        page.termTypeComboBox.setValue(termTypeCode, true);

                        if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)) {

                            var organizationId = PageManager.pc('organization_id');
                            page.organizationComboBox.setValue(organizationId, true);
                        }

                        var termYear = PageManager.pc('term_year');
                        page.termYearComboBox.setValue(termYear, true);

                        if (Configs.getConfig(Configs.CURRICULUM) && (UserManager.getUserRoleCode() == UserRole.ADMIN || UserManager.getUserRoleCode() == UserRole.INSTITUTION_ADMIN)) {

                            var curriculumId = PageManager.pc('curriculum_id');
                            page.curriculumComboBox.setValue(curriculumId);
                        }

                        page.termTypeComboBox.change();

                        var param = FormatHelper.arrayKeyToCamel(Triton.extractFormData(page.get()));

                        param['page'] = Lia.pd(1, parameterMap, 'page');
                        param['count'] = Lia.pd(20, parameterMap, 'count');

                        if (parameterMap['is_available'] != undefined) {
                            param['isAvailable'] = parameterMap['is_available'];
                        }

                        var searchOption = new SearchOption();

                        if (String.isNotBlank(param['searchByCourseOperationCode'])) {

                            searchOption.add(SearchOption.CourseSummary.CODE, param['searchByCourseOperationCode']);
                            param['searchOptionList'] = searchOption.get();
                        }

                        if (String.isNotBlank(param['searchByCourseName'])) {

                            searchOption.add(SearchOption.CourseSummary.DEFAULT, param['searchByCourseName']);
                            param['searchOptionList'] = searchOption.get();
                        }

                        if (String.isNotBlank(param['searchByYear'])) {

                            searchOption.add(SearchOption.CourseSummary.START_DATE_YEAR, param['searchByYear']);
                            param['searchOptionList'] = searchOption.get();
                        }

                        if (String.isNotBlank(param['searchByMonth'])) {

                            searchOption.add(SearchOption.CourseSummary.START_DATE_MONTH, param['searchByMonth']);
                            param['searchOptionList'] = searchOption.get();
                        }

                        if(String.isNotBlank(param['startDate'])) {
                            searchOption.add(SearchOption.CourseSummary.FROM_START_DATE , param['startDate'] + ' 00:00:00');
                            param['searchOptionList'] = searchOption.get();
                        }

                        if(String.isNotBlank(param['endDate'])) {
                            searchOption.add(SearchOption.CourseSummary.TO_START_DATE , param['endDate'] + ' 23:59:59');
                            param['searchOptionList'] = searchOption.get();
                        }

                        param['groupByCourseContentId'] = 0;
                        param['groupByCourseCodeId'] = 0;
                        param['filterOutEntrustedCourses'] = 0;
                        param['orderByCode'] = page.listOrderByCode = PageManager.pc('order_by_code');
                        param['includeAttributeList'] = 1;
                        param['includeStudentCountDetails'] = 1;

                        // 상시제일 경우 termId 삭제
                        if (termTypeCode == TermType.DEFAULT) {
                            param['termId'] = undefined;
                            param['termYear'] = undefined;
                            param['organizationId'] = undefined;

                            if (param['orderByCode'] == undefined) {
                                param['orderByCode'] = CourseOrderBy.REGISTERED_DATE_DESC;
                            }

                        } else {

                            if (param['orderByCode'] == undefined) {
                                param['orderByCode'] = 1000;
                            }
                        }

                        if (UserManager.getUserRoleCode() == UserRole.TEACHER || UserManager.getUserRoleCode() == UserRole.TEACHING_ASSISTANT) {
                            param['isTeachingCourse'] = 1;
                        }

                        param['adminPage'] = 1;
                        param['studentPage'] = 0;
                        param['excludeFromStatistics'] = 0;

                        if ( param['year'] != new Date().getFullYear() ) {
                            param['historyYear'] = param['year'];
                        }

                        Requester.awbwq(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST,
                            page.requestMap = param, function (status, data, request) {

                                if (status != Requester.Status.SUCCESS) {
                                    return;
                                }

                                var section = page.contentSection;
                                section.empty();

                                var panel = new Triton.Panel({
                                    appendTo: section,
                                    theme: Triton.Panel.Theme.List,
                                    // contentMinWidth: '2100px',
                                    // css : {
                                    //     'overflow-x' : 'auto',
                                    //     'max-width' : '2500px'
                                    // },
                                });

                                var listTable = page.listTable = new Triton.ListTable({
                                    appendTo: panel
                                });

                                listTable.appendHeaderRow({});

                                listTable.appendHeaderColumn({content: '번호', css: {'width': '50px'}});

                                listTable.appendHeaderColumn({content: '양성/보수', css: {'width': '100px'}});
                                listTable.appendHeaderColumn({content: '구분1', css: {'width': '80px'}});
                                //listTable.appendHeaderColumn({content: '구분2', css: {'width': '100px'}});

                                if (page.managingInstitutionCount > 1)
                                    listTable.appendHeaderColumn({
                                        content: Strings.getString(Strings.INSTITUTION),
                                        css: {'width': '150px'}
                                    });

                                var termHeaderText = Strings.getString(Strings.TERM);

                                if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)) {

                                    termHeaderText = termHeaderText + '<br/>(' + Strings.getString(Strings.ORGANIZATION) + ')';
                                }

                                // listTable.appendHeaderColumn({content: termHeaderText, css: {'width': '140px'}});

                                listTable.appendHeaderColumn({
                                    content: new Triton.FlagSpan({
                                        content: Strings.getString(Strings.COURSE) + '명',
                                        addClass: 'course_name_column',
                                        theme: Triton.FlagSpan.Theme.OrderBy,
                                        onClick: function (e) {

                                            if (page.listOrderByCode == CourseOrderBy.TITLE_DESC) {
                                                page.listOrderByCode = CourseOrderBy.TITLE_ASC;
                                            } else {
                                                page.listOrderByCode = CourseOrderBy.TITLE_DESC;
                                            }

                                            page.refreshByOrderCode();
                                        }
                                    }), css: {'width': '800px'}
                                });


                                if (Configs.getConfig(Configs.COURSE_SECTION)) {

                                    listTable.appendHeaderColumn({
                                        content: '분반',
                                        css: {'width': '80px'}
                                    });
                                }

                                //소속기관 유형, 교육대상직위, 경력
                                listTable.appendHeaderColumn({content: '소속기관 유형', css: {'width': '200px'}});
                                listTable.appendHeaderColumn({content: '교육대상<br/>(직위)', css: {'width': '140px'}});
                                listTable.appendHeaderColumn({content: '교육대상<br/>(경력)', css: {'width': '140px'}});


                                //연도 월 시작일 종료일
                                listTable.appendHeaderColumn({content: '연도', css: {'width': '50px'}});
                                listTable.appendHeaderColumn({content: '월', css: {'width': '50px'}});
                                //listTable.appendHeaderColumn({content: '시작일', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '종료일', css: {'width': '100px'}});

                                //교육형태, 지역, 장소명 등
                                listTable.appendHeaderColumn({content: '교육형태', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '장소<br/>지역', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '장소<br/>장소명', css: {'width': '100px'}});

                                //수강생 통계
                                listTable.appendHeaderColumn({content: '시수', css: {'width': '100px'}});
                                listTable.appendHeaderColumn({content: '실제 교육 운영 시간', css: {'width': '150px'}});
                                listTable.appendHeaderColumn({content: '정원(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '신청인원<br/>(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '미선정(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '취소인원(명)', css: {'width': '100px'}});
                                listTable.appendHeaderColumn({content: '수료(명)', css: {'width': '100px'}});
                                listTable.appendHeaderColumn({content: '미수료(명)', css: {'width': '100px'}});
                                listTable.appendHeaderColumn({content: '담당자', css: {'width': '100px'}});


                                //지정성별
                                // listTable.appendHeaderColumn({content: '지정성별<br />여', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '지정성별<br />남', css: {'width': '100px'}});

                                //수강생 통계2(분류 등)
                                // listTable.appendHeaderColumn({content: '참여자분류<br />성폭(명)', css: {'width': '150px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />가폭(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />통합(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />성매매(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />1366(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />해센(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />폭력피해<br />이주(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />기타(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '참여자분류<br />합계', css: {'width': '100px'}});

                                //만족도
                                //listTable.appendHeaderColumn({content: '응답자수<br />(명)', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '교육운영', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '교육과정', css: {'width': '100px'}});
                                // listTable.appendHeaderColumn({content: '강의만족도', css: {'width': '100px'}});
                                //listTable.appendHeaderColumn({content: '총 평균', css: {'width': '100px'}});


                                // listTable.appendHeaderColumn({
                                //     content: UserRole.getName(UserRole.TEACHER),
                                //     css: {'width': '80px'}
                                // });
                                //
                                // if (Configs.containsUserRole(UserRole.TEACHING_ASSISTANT)) {
                                //
                                //     listTable.appendHeaderColumn({
                                //         content: UserRole.getName(UserRole.TEACHING_ASSISTANT),
                                //         css: {'width': '120px'}
                                //     });
                                // }
                                //
                                // listTable.appendHeaderColumn({
                                //     content: '학습기간',
                                //     css: {'width': '100px'}
                                // });
                                //
                                // listTable.appendHeaderColumn({content: '정원'});
                                //
                                // listTable.appendHeaderColumn({
                                //     content: new Triton.FlagSpan({
                                //         content: '수강생',
                                //         theme: Triton.FlagSpan.Theme.OrderBy,
                                //         onClick: function (e) {
                                //
                                //             if (page.listOrderByCode == CourseOrderBy.STUDENT_COUNT_DESC) {
                                //                 page.listOrderByCode = CourseOrderBy.STUDENT_COUNT_ASC;
                                //             } else {
                                //                 page.listOrderByCode = CourseOrderBy.STUDENT_COUNT_DESC;
                                //             }
                                //
                                //             page.refreshByOrderCode();
                                //         }
                                //     }), css: {'width': '60px'}
                                // });
                                //
                                // listTable.appendHeaderColumn({
                                //     content: '수료인원',
                                //     css: {'width': '70px'}
                                // });
                                //
                                // listTable.appendHeaderColumn({
                                //     content: new Triton.FlagSpan({
                                //         content: '등록일',
                                //         theme: Triton.FlagSpan.Theme.OrderBy,
                                //         onClick: function (e) {
                                //
                                //             if (page.listOrderByCode == CourseOrderBy.REGISTERED_DATE_DESC) {
                                //                 page.listOrderByCode = CourseOrderBy.REGISTERED_DATE_ASC;
                                //             } else {
                                //                 page.listOrderByCode = CourseOrderBy.REGISTERED_DATE_DESC;
                                //             }
                                //
                                //             page.refreshByOrderCode();
                                //         }
                                //     }), css: {'width': '90px'}
                                // });

                                var body = data['body'];
                                var list = body['list'];
                                var totalCount = Lia.pd(0, data, 'body', 'total_count');

                                page.resultButton.clear();
                                page.resultButton.appendFlagRadioButton({
                                    option : {
                                        name : '전체 ' + FormatHelper.numberWithCommas(totalCount)
                                    }
                                });
                                page.resultButton.setValue(undefined, true);


                                if (list == undefined) {

                                    new Triton.Section({
                                        appendTo: panel,
                                        theme: Triton.Section.Theme.ListMessage,
                                        content: '등록된 ' + Strings.getString(Strings.COURSE) + '이 없습니다.'
                                    });

                                } else {

                                    for (var i = 0, l = list.length; i < l; i++) {

                                        var item = list[i];
                                        var termTypeCode = item['term_type_code'];
                                        var courseAttrList = Lia.p(item, 'attribute_list');

                                        listTable.appendRow({
                                            item: item,
                                            addClass: 'course_row',
                                            attr: {
                                                'course-content-id': item['course_content_id'],
                                                'term-id': item['term_id'],
                                                'course-id': item['id'],
                                                'term-type-code': termTypeCode
                                            },
                                            theme: Triton.ListTable.Row.Theme.NoLink
                                            // onClick: function (e) {
                                            //
                                            //     var item = e.data.item;
                                            //
                                            //     var termId = $(this).attr('term-id');
                                            //     var courseId = $(this).attr('course-id');
                                            //     var courseContentId = $(this).attr('course-content-id');
                                            //     var termTypeCode = $(this).attr('term-type-code');
                                            //     // var statusCodeList = PageManager.pc('status_code_list');
                                            //
                                            //     var defaultCoursePage = 'dashboard';
                                            //
                                            //     if (Lia.pd(true, PolarisSettings.FunctionFlag, 'showDashboard') == false)
                                            //         defaultCoursePage = 'course_outline_detail';
                                            //
                                            //     PageManager.go(['operation_manage/course_manage', defaultCoursePage],
                                            //         {
                                            //             'course_code_id': item['course_code_id'],
                                            //             'course_content_id': courseContentId,
                                            //             'term_id': termId,
                                            //             'course_id': courseId,
                                            //             'term_type_code_list': termTypeCode
                                            //             // 'status_code_list': statusCodeList
                                            //         });
                                            // }
                                        });

                                        listTable.appendColumn({content: item['row_number']});

                                        if (page.managingInstitutionCount > 1)
                                            listTable.appendColumn({content: item['institution_name']});

                                        // 구분1,2
                                        var courseCode = Lia.pcd('-', item, 'course_code_code')
                                        var isTraning = false;

                                        for(var ii in courseAttrList) {
                                            var attr = Lia.p(courseAttrList , ii);
                                            if(attr['attribute_id'] == 16) {
                                                isTraning = true;
                                            }
                                        }
                                        listTable.appendColumn({content: isTraning ? '양성교육' : '보수교육'});
                                        listTable.appendColumn({content: Lia.pcd('-', courseCode.split('-')[1])});
                                        //listTable.appendColumn({content: Lia.pcd('-', courseCode.split('-')[2])});


                                        var termString;

                                        if (Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

                                            var year = Lia.p(item, 'term_year');
                                            var number = Lia.p(item, 'term_number');
                                            var name = TermNumber.getName(number);

                                            termString = year + '년 ' + name;

                                        } else {

                                            termString = '상시';
                                            var typeCode = item['term_type_code'];
                                            var termStringColor = '';

                                            if (typeCode != TermType.DEFAULT) {

                                                var termCurriculumId = Lia.p(item, 'term_curriculum_id');

                                                if (String.isNotBlank(termCurriculumId))
                                                    termStringColor = '#ff6f00';
                                                else
                                                    termStringColor = '#17a931';

                                                var termYear = Lia.p(item, 'term_year');
                                                var termNumber = Lia.p(item, 'term_number');
                                                termString = termYear + '-' + termNumber;

                                            } else {

                                                termStringColor = '#22449c';
                                            }

                                            if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)) {

                                                var organizationName = Lia.pd('자체운영', item, 'organization_name');
                                                termString = '<strong style="color: ' + termStringColor + '">' + termString + '</strong>' + '<br/>(' + organizationName + ')';
                                            }
                                        }

                                        //listTable.appendColumn({content: termString});

                                        listTable.appendColumn({
                                            content: Lia.pd('-', CourseHelper.getCourseTitle(item))
                                            ,css : {'text-align' : 'left' , 'padding-left' : '10px'}
                                        });

                                        if (Configs.getConfig(Configs.COURSE_SECTION)) {
                                            listTable.appendColumn({content: Lia.p(item, 'section_number') + '분반'});
                                        }



                                        var agType = '', position = '', career = '';
                                        var agCount = 0, positionCount = 0, careerCount = 0;
                                        var agCnt = 0, positionCnt = 0, careerCnt = 0;

                                        for (var jdx in page.attribute) {
                                            var attr = Lia.p(page.attribute, jdx);
                                            var depth = Lia.p(attr, 'depth');
                                            var category = Lia.p(attr, 'category_code');
                                            var name = Lia.p(attr, 'name');

                                            if (depth == 1) {

                                                switch (category) {

                                                    case '소속기관' : {

                                                        if (name != '기타') {

                                                            agCount++;
                                                        }

                                                        break;
                                                    }

                                                    case '직위' : {

                                                        positionCount++;
                                                        break;
                                                    }

                                                    case '경력' : {

                                                        careerCount++;
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        for (var idx in courseAttrList) {

                                            var attr = Lia.p(courseAttrList, idx)
                                            var category = Lia.p(attr, 'attribute_category_code');
                                            var depth = Lia.p(attr, 'attribute_depth');
                                            var name = Lia.p(attr, 'attribute_name');

                                            if (depth == 1) {

                                                switch (category) {

                                                    case '소속기관' : {

                                                        if (String.isBlank(agType)) {

                                                            agType = name;

                                                        } else {

                                                            agType += ', ' + name;
                                                        }

                                                        if (name != '기타') {

                                                            agCnt++;
                                                        }

                                                        break;
                                                    }

                                                    case '직위' : {

                                                        if (String.isBlank(position)) {

                                                            position = name;

                                                        } else {

                                                            position += ', ' + name;
                                                        }

                                                        positionCnt++;
                                                        break;
                                                    }

                                                    case '경력' : {

                                                        if (String.isBlank(career)) {

                                                            career = name;

                                                        } else {

                                                            career += ', ' + name;
                                                        }

                                                        careerCnt++;
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (agCount == agCnt) {

                                            agType = '여성 폭력 방지 기관 전체'
                                        }

                                        if (positionCount == positionCnt) {

                                            position = '직위 전체'
                                        }

                                        if (careerCount == careerCnt) {

                                            career = '경력 전체'
                                        }

                                        listTable.appendColumn({content: String.isBlank(agType) ? '-' : agType});
                                        listTable.appendColumn({content: String.isBlank(position) ? '-' : position});
                                        listTable.appendColumn({content: String.isBlank(career) ? '-' : career});

                                        //연도 월 시작 종료
                                        var startDate = Lia.pcd('-', item, 'start_date');
                                        var year, month;
                                        if (startDate != '-') {

                                            year = startDate.split('-')[0];
                                            month = startDate.split('-')[1];
                                        }
                                        listTable.appendColumn({content: year});
                                        listTable.appendColumn({content: month});
                                        // listTable.appendColumn({content: startDate});
                                        // listTable.appendColumn({content: Lia.pcd('-' , item ,'end_date')});

                                        //교육형태 및 지역, 장소명
                                        var learningType = Lia.p(item, 'learning_method_code');
                                        var learningTypeString;
                                        if (learningType != undefined) {
                                            if (learningType === CourseLearningMethod.ONLINE) {
                                                learningTypeString = "이러닝";
                                            } else if (learningType === CourseLearningMethod.OFFLINE) {
                                                learningTypeString = "집체";
                                            } else if (learningType === CourseLearningMethod.BLENDED_LEARNING) {
                                                learningTypeString = "블렌디드<br />러닝";
                                            } else if (learningType === CourseLearningMethod.FLIPPED_LEARNING) {
                                                learningTypeString = "화상";
                                            } else {
                                                learningTypeString = "-";
                                            }
                                        }
                                        listTable.appendColumn({content: learningTypeString == undefined ? '-' : learningTypeString});
                                        // listTable.appendColumn({content: Lia.pcd('-' , item , 'properties' , 'district')});
                                        // listTable.appendColumn({content: Lia.pcd('-' , item , 'properties' , 'venue')});

                                        var totalParticipateStudentCount = 0;
                                        var totalUnenrolledStudentCount = 0;


                                        var enrollRequestStudentCount = Lia.pcd('-', item, 'enrollment_requested_student_count');
                                        var rejectedStudentCount = Lia.pcd('-', item, 'enrollment_rejected_student_count');
                                        var enrolledStudentCount = Lia.pcd('-', item, 'enrolled_student_count');
                                        var unenrolledStudentCount = Lia.pcd('-', item, 'unenrolled_student_count');
                                        var autoUnenrolledDueToUserDeleteStudentCount = Lia.pcd('-', item, 'auto_unenrolled_due_to_user_delete_student_count');
                                        var autoUnenrolledDueToUserRoleChangeStudentCount = Lia.pcd('-', item, 'auto_unenrolled_due_to_user_role_change_student_count');

                                        var completeStudentCount = Lia.pcd('-', item, 'completed_student_count_from_student_report');
                                        var notCompleteStudentCount = undefined;

                                        if (enrollRequestStudentCount != '-') {
                                            totalParticipateStudentCount += enrollRequestStudentCount;
                                        }
                                        if (rejectedStudentCount != '-') {
                                            totalParticipateStudentCount += rejectedStudentCount;
                                        }
                                        if (enrolledStudentCount != '-') {
                                            totalParticipateStudentCount += enrolledStudentCount;
                                        }
                                        if (unenrolledStudentCount != '-') {
                                            totalParticipateStudentCount += unenrolledStudentCount;
                                            totalUnenrolledStudentCount += unenrolledStudentCount;
                                        }
                                        if (autoUnenrolledDueToUserDeleteStudentCount != '-') {
                                            totalParticipateStudentCount += autoUnenrolledDueToUserDeleteStudentCount;
                                            totalUnenrolledStudentCount += autoUnenrolledDueToUserDeleteStudentCount;
                                        }
                                        if (autoUnenrolledDueToUserRoleChangeStudentCount != '-') {
                                            totalParticipateStudentCount += autoUnenrolledDueToUserRoleChangeStudentCount;
                                            totalUnenrolledStudentCount += autoUnenrolledDueToUserRoleChangeStudentCount;
                                        }

                                        if (completeStudentCount != '-' && enrolledStudentCount != '-') {
                                            notCompleteStudentCount = enrolledStudentCount - completeStudentCount
                                        }


                                        //수강생 통계
                                        var actualTime = Lia.pcd('-', item, 'properties' , 'actual_study_hour_per_day');
                                        listTable.appendColumn({content: Lia.pcd('-', item, 'study_time_in_hours')});
                                        listTable.appendColumn({content: actualTime == undefined ? '-' : actualTime});
                                        listTable.appendColumn({content: Lia.pd('-', item, 'properties', 'max_student_count')});
                                        // listTable.appendColumn({content: totalParticipateStudentCount});
                                        // listTable.appendColumn({content: enrolledStudentCount});
                                        // listTable.appendColumn({content: rejectedStudentCount});
                                        // listTable.appendColumn({content: totalUnenrolledStudentCount});
                                        listTable.appendColumn({content: completeStudentCount});
                                        listTable.appendColumn({content: notCompleteStudentCount == undefined ? '-' : notCompleteStudentCount});
                                        listTable.appendColumn({content: Lia.pd('-', item, 'properties', 'course_admin_for_report')});


                                        //지정 성별
                                        //listTable.appendColumn({content: '-'});
                                        //listTable.appendColumn({content: '-'});

                                        //수강생 통계2(분류 등)
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});


                                        //만족도
                                        //listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        // listTable.appendColumn({content: '-'});
                                        //listTable.appendColumn({content: '-'});

                                        // var courseAdminList = Lia.p(item, 'course_administrator_list');
                                        //
                                        // if (courseAdminList != undefined) {
                                        //
                                        //     var courseTeacherNameList = '';
                                        //     var courseTeachingAssistantNameList = '';
                                        //     var courseTeacherCount = 0;
                                        //     var courseTeachingAssistantCount = 0;
                                        //     var courseAdminCount = courseAdminList.length;
                                        //
                                        //     for (var k = 0; k < courseAdminCount; k++) {
                                        //
                                        //         var courseAdmin = courseAdminList[k];
                                        //         var courseAdminUserRoleCode = courseAdmin['admin_user_role_code'];
                                        //         var courseAdminUserName = courseAdmin['admin_user_name'];
                                        //
                                        //         if (courseAdminUserRoleCode == UserRole.TEACHER) {
                                        //
                                        //             courseTeacherCount++;
                                        //
                                        //             if (String.isBlank(courseTeacherNameList)) {
                                        //
                                        //                 courseTeacherNameList = courseAdminUserName;
                                        //
                                        //             } else {
                                        //
                                        //                 courseTeacherNameList = courseTeacherNameList + ',' + courseAdminUserName;
                                        //             }
                                        //
                                        //         } else if (courseAdminUserRoleCode == UserRole.TEACHING_ASSISTANT) {
                                        //
                                        //             courseTeachingAssistantCount++;
                                        //
                                        //             if (String.isBlank(courseTeachingAssistantNameList)) {
                                        //
                                        //                 courseTeachingAssistantNameList = courseAdminUserName;
                                        //
                                        //             } else {
                                        //
                                        //                 courseTeachingAssistantNameList = courseTeachingAssistantNameList + ',' + courseAdminUserName;
                                        //             }
                                        //
                                        //         } else {
                                        //
                                        //
                                        //         }
                                        //     }
                                        //
                                        //     if (courseTeacherCount > 0) {
                                        //
                                        //         // listTable.appendColumn({content: courseTeacherCount});
                                        //         listTable.appendColumn({content: courseTeacherNameList});
                                        //
                                        //     } else {
                                        //
                                        //         listTable.appendColumn({
                                        //             content: '미배정',
                                        //             css: {
                                        //                 'color': '#FF0000',
                                        //                 'font-weight': 'bold'
                                        //             }
                                        //         });
                                        //     }
                                        //
                                        //     if (Configs.containsUserRole(UserRole.TEACHING_ASSISTANT)) {
                                        //
                                        //         if (courseTeachingAssistantCount > 0) {
                                        //
                                        //             // listTable.appendColumn({content: courseTeachingAssistantCount});
                                        //             listTable.appendColumn({content: courseTeachingAssistantNameList});
                                        //
                                        //         } else {
                                        //
                                        //             listTable.appendColumn({
                                        //                 content: '미배정',
                                        //                 css: {
                                        //                     'color': '#FF0000',
                                        //                     'font-weight': 'bold'
                                        //                 }
                                        //             });
                                        //         }
                                        //     }
                                        //
                                        // } else {
                                        //
                                        //     listTable.appendColumn({
                                        //         content: '미배정',
                                        //         css: {
                                        //             'color': '#FF0000',
                                        //             'font-weight': 'bold'
                                        //         }
                                        //     });
                                        //
                                        //     if (Configs.containsUserRole(UserRole.TEACHING_ASSISTANT)) {
                                        //
                                        //         listTable.appendColumn({
                                        //             content: '미배정',
                                        //             css: {
                                        //                 'color': '#FF0000',
                                        //                 'font-weight': 'bold'
                                        //             }
                                        //         });
                                        //     }
                                        // }
                                        //
                                        // var studyPeriod = '-';
                                        //
                                        // if (termTypeCode == TermType.DEFAULT) {
                                        //
                                        //     studyPeriod = Lia.pd('-', item, 'study_days') + ' 일'
                                        //
                                        // } else {
                                        //
                                        //     studyPeriod = Lia.pd('-', item, 'start_date').substring(0, 10) + ' ~ </br>' + Lia.pd('-', item, 'end_date').substring(0, 10);
                                        // }
                                        //
                                        // listTable.appendColumn({content: studyPeriod});
                                        //
                                        // listTable.appendColumn({content: Lia.p(item, 'max_student_count')});
                                        // listTable.appendColumn({content: Lia.p(item, 'student_count')});
                                        //
                                        // listTable.appendColumn({content: Lia.p(item, 'completed_student_count')});
                                        //
                                        // listTable.appendColumn({content: Lia.p(item, 'registered_date')});
                                    }
                                }

                                var jPagerContainer = new Triton.Section({
                                    theme: Triton.Section.Theme.Pager,
                                    appendTo: section
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

                            });

                        page.prepared = true;
                    });
                });
            });

        },
        onRelease: function (j) {

        }
    };
})();
