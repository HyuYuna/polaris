(function () {

    return {


        onInit: function (j) {

            var page = this;

            var section = new Triton.Section({
                appendTo: j
            });

            new Triton.Title({
                appendTo: section,
                content: PageConstructor.getCurrentMenuName()
            });

            page.institutionId = Server.institutionId;

            var message = '수강 완료한 ' + Strings.getString(Strings.COURSE) + ' 목록을 확인할 수 있습니다.<br/>';
            if (!Strings.isLocaleKo())
                message = 'Check the list of your completed courses.';

            new Triton.Section({
                theme: Triton.Section.Theme.Message,
                appendTo: section,
                css: {
                    'font-size': '13px',
                    'font-weight': 'bold'
                },
                content: message
            });

            var searchSection = new Triton.ButtonSection({
                appendTo: section
            });

            var contentSection = page.contentSection = new Triton.Section({
                appendTo: section
            });

            page.termComboBox = new Triton.ComboBox({
                theme: Triton.ComboBox.Theme.Category,
                form: {name: 'year'},
                optionList : YearHelper.createTermYearList(false),
                onSelected: function (val, selectedOption, options) {
                    PageManager.cpcpm({'year': val});
                }
            });
            searchSection.appendToLeft(page.termComboBox);
        },
        onChange: function (j, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;

            var contentSection = page.contentSection;

            Requester.func(function () {


                var learningMethodCode = PageManager.pc('year');
                page.termComboBox.setValue(learningMethodCode, true);
                learningMethodCode = page.termComboBox.getValue();

                if (Configs.getConfig(Configs.SHOW_COMPLETED_COURSE_IN_OPERATING)) {

                    Requester.ajaxWithoutBlank(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST, {
                        institutionId: page.institutionId,
                        year: learningMethodCode,
                        includeCourseSectionList: 0,
                        // statusCodeList: CourseStatus.OPERATING + ',' + CourseStatus.MARK_REVIEWING + ',' + CourseStatus.REVIEWING + ',' + CourseStatus.FINISHED,
                        courseEnrollmentStatusCodeList: CourseEnrollmentStatus.ENROLLED, // 수강중
                        groupByCourseContentId: 0,
                        groupByCourseCodeId: 0,
                        orderByCode: CourseOrderBy.ENROLLED_OR_UNEROLLED_DATE_DESC,
                        adminPage: 0,
                        studentPage: 1
                    }, function (status, data, request) {

                        if (status != Requester.Status.SUCCESS)
                            return;

                        var newList = [];


                        var list = Lia.p(data, 'body', 'list');
                        if ( Array.isNotEmpty(list) ) {
                            for ( var i = 0, l = list.length; i < l; i++ ) {

                                var item = Lia.p(list, i);

                                var statusCode = Lia.p(item,'status_code');
                                var isCompleted = Lia.p(item,'is_completed');
                                var autoCompletionConfirmation = Lia.p(item,'auto_completion_confirmation');

                                var isCompletionConfirmed = Lia.p(item,'is_completion_confirmed');

                                if ( Lia.contains(statusCode, CourseStatus.OPERATING, CourseStatus.MARK_REVIEWING ) && isCompleted == 0 ) {
                                    continue;
                                }

                                if ( Lia.contains(statusCode, CourseStatus.OPERATING, CourseStatus.MARK_REVIEWING ) && autoCompletionConfirmation == 0 && isCompleted == 1 && isCompletionConfirmed == 0 ) {
                                    continue;
                                }

                                newList.push(item);

                            }
                        }

                        page.list =newList;


                    });

                } else {

                    Requester.ajaxWithoutBlank(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST, {
                        institutionId: page.institutionId,
                        year: learningMethodCode,
                        includeCourseSectionList: 0,
                        statusCodeList: CourseStatus.REVIEWING + ',' + CourseStatus.FINISHED,
                        courseEnrollmentStatusCodeList: CourseEnrollmentStatus.ENROLLED, // 수강중
                        groupByCourseContentId: 0,
                        groupByCourseCodeId: 0,
                        orderByCode: CourseOrderBy.TERM_TYPE_CODE_DESC_AND_REGISTRATION_END_DATE_DESC_TITLE_ASC,
                        adminPage: 0,
                        studentPage: 1
                    }, function (status, data, request) {

                        if (status != Requester.Status.SUCCESS)
                            return;

                        var list = Lia.p(data, 'body', 'list');
                        if (Array.isEmpty(page.list)) {

                            page.list = list;

                        } else if (Array.isNotEmpty(list)) {

                            for (var i = 0, l = list.length; i < l; i++) {

                                page.list.push(list[i]);
                            }

                        }
                    });
                }

                Requester.func(function () {

                    contentSection.empty();

                    var listPanel = new Triton.Panel({
                        theme: Triton.Panel.Theme.List,
                        appendTo: contentSection,
                        css: {}
                    });

                    var listTable = new Triton.ListTable({
                        appendTo: listPanel
                    });
                    listTable.appendHeaderRow({});

                    // listTable.appendHeaderColumn({
                    //     addClass: 'triton_mobile_hide',
                    //     content: Strings.getString(Strings.TABLE_COLUMN_TITLE.ROW_NUMBER),
                    //     css: {'width': '80px'}
                    // });

                    if (Configs.getConfig(Configs.COMPLETED_COURSES_TERM)) {

                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.TERM),
                            css: {'width': '150px'}
                        });
                    }


                    listTable.appendHeaderColumn({content: '교육방법', addClass: 'triton_mobile_hide',
                        css: {'width': '150px'}
                    });


                    listTable.appendHeaderColumn({
                        css: { 'min-width': '90px' },
                        content: Strings.getString(Strings.TABLE_COLUMN_TITLE.COURSE),
                    });

                    if (Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

                        listTable.appendHeaderColumn({
                            content: '개설학과',
                            css: {'width': '200px'},
                            addClass: 'triton_mobile_hide'
                        });

                        listTable.appendHeaderColumn({
                            content: '학점',
                            css: {'width': '100px'},
                            addClass: 'triton_mobile_hide'
                        });
                        listTable.appendHeaderColumn({
                            content: '학년',
                            css: {'width': '100px'},
                            addClass: 'triton_mobile_hide'
                        });
                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TEACHER)
                        });
                    }

                    listTable.appendHeaderColumn({
                        addClass: 'triton_mobile_hide',
                        content: Strings.getString(Strings.TABLE_COLUMN_TITLE.COURSE_OPERATION_CODE),
                        css: {'width': '150px'}
                    });

                    if (Configs.getConfig(Configs.COMPLETED_COURSES_STUDY_PERIOD)) {

                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.STUDY_PERIOD),
                            css: {'width': '200px'}
                        });

                    }

                    if (Configs.getConfig(Configs.COMPLETED_COURSES_REVIEW_PERIOD)) {

                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.REVIEW_PERIOD),
                            css: {'width': '200px'}
                        });
                    }

                    if (Configs.getConfig(Configs.COMPLETED_COURSES_COMPLETION_DATE)) {

                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.COMPLETION_DATE),
                            css: {'width': '200px'}
                        });
                    }

                    if (!Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

                        listTable.appendHeaderColumn({
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.CERTIFICATE),
                            css: {'width': '100px'}
                        });
                    }

                    if (page.list == undefined || page.list.length == 0) {

                        new Triton.Section({
                            appendTo: contentSection,
                            theme: Triton.Section.Theme.ListMessage,
                            content: Strings.getString(Strings.EMPTY_LIST_MESSAGE.COMPLETED_COURSE),
                        });

                        return;
                    }


                    for (var i = 0, l = page.list.length; i < l; i++) {

                        var item = page.list[i];

                        var title = CourseHelper.getCourseTitleForStudent(item);
                        var operationCode = Lia.pd('-', item, 'operation_code');
                        var courseCode = Lia.pd('-', item, 'course_code_code');


                        listTable.appendRow({
                            item: item,
                            onClick: function (e) {

                                e.stopPropagation();
                                e.preventDefault();

                                var item = e.data.item;
                                var statusCode = Lia.p(item, 'status_code');

                                if (!Lia.contains(statusCode, CourseStatus.REVIEWING, CourseStatus.OPERATING)) {

                                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '복습 가능한 과목이 아닙니다.');
                                    return;
                                }

                                var courseId = Lia.p(item, 'id');

                                Lia.redirect(PageUrl.LEARNING, {
                                    course_id: courseId
                                });
                            }
                        });

                        // listTable.appendColumn({
                        //     addClass: 'triton_mobile_hide',
                        //     content: Lia.p(item, 'row_number')
                        // });

                        if (Configs.getConfig(Configs.COMPLETED_COURSES_TERM)) {

                            listTable.appendColumn({
                                addClass: 'triton_mobile_hide',
                                content: TermStringHelper.getTermString(item)
                            });
                        }

                        listTable.appendColumn({
                            content: CourseLearningMethod.getName(Lia.p(item,'learning_method_code')),
                            addClass: 'triton_mobile_hide'
                        });



                        listTable.appendColumn({
                            css : { 'text-align':'left', 'padding-left' : '10px', 'padding-right' : '10px' },
                            content: title
                        });

                        if (Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

                            var departmentName = Lia.pd('-', item, 'department_mapping_list', 0, 'department_mapping', 'department_name');
                            listTable.appendColumn({addClass: 'triton_mobile_hide', content: departmentName});

                            var credit = Lia.pd('-', item, 'credit');
                            listTable.appendColumn({addClass: 'triton_mobile_hide', content: credit});

                            var year = Lia.pd('-', item, 'year');
                            listTable.appendColumn({addClass: 'triton_mobile_hide', content: year});

                            var courseAdministratorNameList = '미배정';
                            var courseAdministratorList = Lia.p(item, 'course_administrator_list');

                            if (courseAdministratorList != undefined && courseAdministratorList.length > 0) {

                                courseAdministratorNameList = '';
                                for (var i2 = 0, l2 = courseAdministratorList.length; i2 < l2; i2++) {

                                    var name = Lia.p(courseAdministratorList, i2, 'admin_user_name');
                                    if (String.isNotBlank(courseAdministratorNameList)) {
                                        courseAdministratorNameList += ',';
                                    }

                                    courseAdministratorNameList += name;
                                }

                                listTable.appendColumn({
                                    addClass: 'triton_mobile_hide',
                                    content: courseAdministratorNameList
                                });

                            } else {

                                listTable.appendColumn({
                                    addClass: 'triton_mobile_hide',
                                    content: courseAdministratorNameList,
                                    css: {
                                        'color': '#FF0000',
                                        'font-weight': 'bold'
                                    }
                                });
                            }
                        }



                        listTable.appendColumn({
                            addClass: 'triton_mobile_hide',
                            content: operationCode
                        });

                        if (Configs.getConfig(Configs.COMPLETED_COURSES_STUDY_PERIOD)) {

                            listTable.appendColumn({
                                addClass: 'triton_mobile_hide', content:
                                    CourseHelper.getCourseStudyPeriod(item)
                            });
                        }

                        if (Configs.getConfig(Configs.COMPLETED_COURSES_REVIEW_PERIOD)) {

                            listTable.appendColumn({
                                addClass: 'triton_mobile_hide', content:
                                    CourseHelper.getCourseReviewPeriod(item)
                            });
                        }

                        if (Configs.getConfig(Configs.COMPLETED_COURSES_COMPLETION_DATE)) {

                            var completionDate = Lia.p(item, 'completion_date');
                            if (String.isNotBlank(completionDate)) {
                                completionDate = completionDate.substr(0, 10);
                            } else {
                                completionDate = '-';
                            }

                            listTable.appendColumn({
                                addClass: 'triton_mobile_hide', content:
                                completionDate
                            });
                        }

                        if (!Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

                            if (Lia.p(item, 'offer_certificate') == 1) {

                                if (Lia.p(item, 'is_completed') == 1 &&
                                    (Configs.getConfig(Configs.SHOW_COMPLETED_COURSE_IN_OPERATING) || Lia.pd(0, item, 'available_study_days') <= 1)) {

                                    var autoCompletionConfirmation = Lia.p(item,'auto_completion_confirmation');
                                    var isCompletionConfirmed = Lia.p(item,'is_completion_confirmed');

                                    if ( autoCompletionConfirmation == 0 && isCompletionConfirmed == 0 ) {

                                        listTable.appendColumn({
                                            content: Strings.getString(Strings.NOT_COMPLETED)
                                        });

                                    } else {

                                        listTable.appendColumn({
                                            content: new Triton.FlatButton({
                                                theme: Triton.FlatButton.Theme.ListInquiry,
                                                content: Strings.getString(Strings.ISSUE),
                                                item: item,
                                                onClick: function (e) {

                                                    e.stopPropagation();

                                                    var item = e.data.item;

                                                    CertificateHelper.issueCertificate({
                                                        studentPage: 1,
                                                        termCurriculumId: item['term_curriculum_id'],
                                                        courseId: item['id'],
                                                        studentUserIdx: Server.userIdx
                                                    });

                                                }
                                            })
                                        });
                                    }

                                } else {

                                    listTable.appendColumn({
                                        content: Strings.getString(Strings.NOT_COMPLETED)
                                    });
                                }


                            } else {

                                listTable.appendColumn({
                                    content: Strings.getString(Strings.NOT_PROVIDED)
                                });
                            }
                        }
                    }
                });
            });
        },
        onRelease: function (j) {
        }
    };
})();
