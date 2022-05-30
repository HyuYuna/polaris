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

            var message = '현재 학습 중인 ' + Strings.getString(Strings.COURSE) + ' 목록을 확인할 수 있습니다.<br/>' + '각 항목을 클릭하면 강의실로 입장합니다.';
            if (!Strings.isLocaleKo()) {
                message = 'Check the list of your enrolled courses. </br> You can go to classroom if you click a course on the list.';
            }

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

                var opt = {
                    institutionId: page.institutionId,
                    year : learningMethodCode,
                    includeCourseSectionList: 0,
                    // statusCodeList: CourseStatus.WAITING + ',' + CourseStatus.PENDING + ',' + CourseStatus.REGISTERING + ',' + CourseStatus.OPERATING + ',' + CourseStatus.MARK_REVIEWING,
                    courseEnrollmentStatusCodeList: CourseEnrollmentStatus.ENROLLMENT_REQUESTED + ','
                        + CourseEnrollmentStatus.ENROLLED + ',' + CourseEnrollmentStatus.ENROLLMENT_REJECTED, // 수강중
                    groupByCourseContentId: 0,
                    groupByCourseCodeId: 0,
                    orderByCode: CourseOrderBy.TERM_TYPE_CODE_DESC_AND_REGISTRATION_END_DATE_DESC_TITLE_ASC,
                    adminPage: 0,
                    studentPage: 1
                };

                Requester.ajaxWithoutBlank(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST, opt, function (status, data, request) {

                    if (status != Requester.Status.SUCCESS)
                        return;

                    page.list = Lia.p(data, 'body', 'list');
                });
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

                    if (Configs.getConfig(Configs.IN_PROGRESS_TERM)) {

                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.TERM),
                            css: {'width': '150px'}
                        });

                    }

                    listTable.appendHeaderColumn({content: '교육방법', addClass: 'triton_mobile_hide',
                        css: {'width': '150px'}
                    });

                    listTable.appendHeaderColumn({content: Strings.getString(Strings.TABLE_COLUMN_TITLE.COURSE) });

                    listTable.appendHeaderColumn({
                        addClass: 'triton_mobile_hide',
                        content: Strings.getString(Strings.TABLE_COLUMN_TITLE.COURSE_OPERATION_CODE),
                        css: {'width': '150px'}
                    });

                    if (Configs.getConfig(Configs.IN_PROGRESS_STUDY_PERIOD)) {

                        listTable.appendHeaderColumn({
                            addClass: 'triton_mobile_hide',
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.STUDY_PERIOD),
                            css: {'width': '200px'}
                        });
                    }

                    listTable.appendHeaderColumn({
                        content: Strings.getString(Strings.TABLE_COLUMN_TITLE.COURSE_STATUS),
                        css: {'width': '100px'}
                    });

                    ProjectSettings.CourseEnrollment.onHeaderStudentInProgressList(listTable);

                    if (Configs.getConfig(Configs.USER_ENROLLMENT)) {

                        listTable.appendHeaderColumn({
                            content: Strings.getString(Strings.TABLE_COLUMN_TITLE.UNENROLL),
                            css: {'width': '120px'}
                        });
                    }

                    if (page.list == undefined || page.list.length == 0) {

                        new Triton.Section({
                            appendTo: contentSection,
                            theme: Triton.Section.Theme.ListMessage,
                            content: Strings.getString(Strings.EMPTY_LIST_MESSAGE.ENROLLED_COURSE),
                        });

                        return;
                    }

                    for (var i = 0, l = page.list.length; i < l; i++) {

                        var item = page.list[i];

                        var operationCode = Lia.pd('-', item, 'operation_code');
                        var title = CourseHelper.getCourseTitleForStudent(item);


                        var termTypeCode = Lia.p(item, 'term_type_code');
                        var enrollmentStatusCode = Lia.p(item, 'course_enrollment_status_code');
                        var enrolledCheck = (Lia.p(item, 'course_enrollment_properties','enrolled_check') == 1);

                        if ( termTypeCode == TermType.DEFAULT ) {
                            enrolledCheck = 1;
                        }


                        if ( enrollmentStatusCode == CourseEnrollmentStatus.ENROLLED && !enrolledCheck ) {
                            enrollmentStatusCode = CourseEnrollmentStatus.ENROLLMENT_REQUESTED;
                        }

                        var statusCode = Lia.p(item, 'status_code');
                        var statusName = undefined;

                        // 학습 대기 상태
                        var enterable = (enrollmentStatusCode == CourseEnrollmentStatus.ENROLLED && statusCode == CourseStatus.OPERATING);

                        if (Lia.contains(enrollmentStatusCode, CourseEnrollmentStatus.ENROLLMENT_REJECTED)) {
                            statusName = CourseEnrollmentStatus.getName(CourseEnrollmentStatus.ENROLLMENT_REJECTED);
                        } else if (Lia.contains(enrollmentStatusCode, CourseEnrollmentStatus.ENROLLMENT_REQUESTED)) {
                            statusName = CourseEnrollmentStatus.getName(CourseEnrollmentStatus.ENROLLMENT_REQUESTED);
                        } else if (Lia.contains(statusCode, CourseStatus.WAITING, CourseStatus.REGISTERING, CourseStatus.PENDING)) {
                            statusName = CourseStatus.getName(CourseStatus.PENDING);

                            if (Configs.getConfig(Configs.ENTER_COURSE_IN_WAITING)) {
                                enterable = true;
                            }

                        } else {
                            statusName = CourseStatus.getName(statusCode);
                        }

                        listTable.appendRow({
                            item: item,
                            enterable: enterable,
                            theme: enterable != true ? Triton.ListTable.Row.Theme.NoLink : undefined,
                            onClick: enterable ? function (e) {

                                e.stopPropagation();
                                e.preventDefault();

                                var item = e.data.item;
                                var enterable = e.data.enterable;

                                if (enterable != true) {
                                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.COURSES_NOT_AVAILABLE_FOR_NOW));
                                    return;
                                }

                                var courseId = Lia.p(item, 'id');

                                AjaxPopupHelper.checkSurveyRequirement({
                                        typeCodeList: SurveyRequestType.BEFORE_STARTING_TO_LEARN + ',' + SurveyRequestType.BEFORE_LEARNING_AND_AFTER_LEARNING,
                                        courseId: courseId
                                    }, function () {

                                        Lia.redirect(PageUrl.LEARNING, {
                                            course_id: courseId
                                        });
                                    }
                                );

                            } : undefined,

                        });

                        // listTable.appendColumn({
                        //     addClass: 'triton_mobile_hide',
                        //     content: Lia.p(item, 'row_number')
                        // });

                        if (Configs.getConfig(Configs.IN_PROGRESS_TERM)) {

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
                            css: {'text-align': 'left', 'padding-left': '10px', 'padding-right': '10px'},
                            content: title
                        });

                        listTable.appendColumn({
                            addClass: 'triton_mobile_hide',
                            content: operationCode
                        });

                        if (Configs.getConfig(Configs.IN_PROGRESS_STUDY_PERIOD)) {
                            listTable.appendColumn({
                                addClass: 'triton_mobile_hide',
                                content: CourseHelper.getCourseStudyPeriod(item)
                            });
                        }

                        listTable.appendColumn({
                            content: statusName
                        });


                        ProjectSettings.CourseEnrollment.onStudentInProgressList(listTable, item);

                        if (Configs.getConfig(Configs.USER_ENROLLMENT)) {

                            if (Lia.contains(enrollmentStatusCode, CourseEnrollmentStatus.ENROLLMENT_REQUESTED) || item['available_cancel_days'] > 0) {

                                listTable.appendColumn({
                                    // addClass: 'triton_mobile_hide',
                                    content: new Triton.FlatButton({
                                        theme: Triton.FlatButton.Theme.ListDelete,
                                        content: Strings.getString(Strings.BUTTON_TEXT.UNENROLL),
                                        item: item,
                                        onClick: function (e) {

                                            e.preventDefault();
                                            e.stopPropagation();

                                            var item = e.data.item;
                                            var title = Lia.p(item, 'title');

                                            var message = '선택한 과목 [<span style="color:#17539d;">' + title + '</span>]을 수강 취소 하시겠습니까?';
                                            var caution = '수강 취소 시 학습 기록은 모두 초기화되며 되돌릴 수 없습니다.';

                                            if (!Strings.isLocaleKo()) {
                                                message = 'Do you cancel a selected course [<span style="color:#17539d;">' + title + '</span>] ?';
                                                caution = 'When canceling a course, all study records are deleted and cannot be recovered.';
                                            }

                                            PopupManager.alertWithCaution(Strings.getString(Strings.POPUP_TITLE.INFO), message, caution, function () {

                                                var enrollInfo = {
                                                    courseId: Lia.p(item, 'id')
                                                };

                                                Requester.awb(ApiUrl.Learning.UNENROLL, enrollInfo, function (status, data, request) {

                                                    if (status != Requester.Status.SUCCESS) {
                                                        return;
                                                    }

                                                    PageManager.pageExecuteChange();
                                                });


                                            }, function () {

                                            });

                                        }
                                    })
                                });

                            } else {

                                listTable.appendColumn({
                                    // addClass: 'triton_mobile_hide',
                                    css: {
                                        'color': '#FF0000',
                                        'font-weight': 'bold'
                                    },
                                    content: Strings.getString(Strings.BUTTON_TEXT.CANNOT_CANCEL)
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
