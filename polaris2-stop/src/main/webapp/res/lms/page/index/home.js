(function () {

    return {

        weekCount: 15,
        showYear: undefined,
        showMonth: undefined,

        getCourseEventDateList: function (inputDate) {

            var page = this;
            var date = inputDate ? new Date(inputDate) : new Date();

            var selectedYear = date.getFullYear();
            var selectedMonth = date.getMonth() + 1;
            var selectedDate = date.getDate();

            var currentMonthFirstDay = date.moveToFirstDayOfMonth();
            var selectedDay = currentMonthFirstDay.getDay();

            Requester.awbwq(ApiUrl.Learning.GET_COURSE_EVENT_DATE_LIST, {
                // courseContentId: PageManager.pc('course_id'),courseContentId
                year: selectedYear,
                month: selectedMonth,
                adminPage: 0
            }, function (status, data, request) {

                var dateString = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                var lastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0)
                    lastDate[1] = 29;

                var currentLastDate = lastDate[selectedMonth - 1];
                var week = Math.ceil((selectedDay + currentLastDate) / 7);

                var dateNum = 1 - selectedDay;

                page.find('.day_list').empty();

                var selectedMonth2 = selectedMonth < 10 ? '0' + selectedMonth : selectedMonth;


                for (var i = 0; i < week; i++) {

                    var div = $('<div></div>');

                    for (var j = 0; j < 7; j++, dateNum++) {

                        var dateNum2 = dateNum < 10 ? '0' + dateNum : dateNum;

                        var on = dateNum == selectedDate ? 'today' : '';
                        if (dateNum < 1 || dateNum > currentLastDate) {
                            div.append('<div class="' + dateString[j] + '"></div>');
                            continue;
                        }

                        div.append('<div class="date ' + dateString[j] + ' ' + on + ' date' + dateNum + '"date="' + selectedYear + '-' + selectedMonth2 + '-' + dateNum2 + '"><p>' + dateNum + '</p></div>');
                    }
                    page.find('.day_list').append(div);

                    div.find('.date').click(function () {

                        page.find('.today').removeClass('today');

                        $(this).addClass('today');

                        date = new Date($(this).attr('date'));

                        page.getCourseEventList(date);

                    });

                    if (i == week - 1) {

                        var list = Lia.p(data, 'body', 'list');

                        if (list == undefined)
                            return;

                        for (var k = 0; k < list.length; k++) {

                            var eventDate = list[k]['event_date'].split(' ');

                            page.find('.day_list [date=' + eventDate[0] + ']').addClass('has_schedule');

                        }
                    }
                }


            });

        },

        getCourseEventList: function (selectedDate) {

            var page = this;
            var date = selectedDate ? new Date(selectedDate) : new Date();


            var dateString = date.toString('yyyy. MM. dd.');
            page.find('.schedule_header_title').html(dateString);

            var selectedYear = date.getFullYear();
            var selectedMonth = date.getMonth() + 1;
            var selectedDate = date.getDate();
            var selectedDay = date.getDay();

            var CourseEventType = {
                COURSE: 10,
                COURSE_LEARNING_CONTENT: 20,
                COURSE_TASK: 30
            };

            Requester.awbwq(ApiUrl.Learning.GET_COURSE_EVENT_LIST, {
                // courseContentId: PageManager.pc('course_id'),
                year: selectedYear,
                month: selectedMonth,
                day: selectedDate,
                adminPage: 0
            }, function (status, data, request) {


                page.find('.list_schedule').empty();
                page.find('.show_date').text(selectedYear + '. ' + selectedMonth);
                page.find('.selected_date').text(selectedYear + '. ' + selectedMonth + '. ' + selectedDate);

                var jContainer = page.find('.list_schedule').empty();

                var list = Lia.p(data, 'body', 'list');

                if (list == undefined || list.length == 0) {
                    var jEmpty = $('<div class="box_no_result" style="padding:135px 58px;text-align: center">' +
                        '<div class="box_no_result_inner"><img src="/res/cms/img/common/ico_nocontents.png">' +
                        '<div class="box_no_result_info">' +
                        '<p class="tit_no_result" style="margin-top:30px;">' + Strings.getString(Strings.EMPTY_LIST_MESSAGE.CONTENT) + '</p>' +
                        '</div></div>' +
                        '</div>');
                    jContainer.append(jEmpty);
                    return;
                }


                var dateKorString = [
                    Strings.getString(Strings.SUNDAY),
                    Strings.getString(Strings.MONDAY),
                    Strings.getString(Strings.TUESDAY),
                    Strings.getString(Strings.WEDNESDAY),
                    Strings.getString(Strings.THURSDAY),
                    Strings.getString(Strings.FRIDAY),
                    Strings.getString(Strings.FRIDAY)
                ];

                for (var i = 0; i < list.length; i++) {

                    var item = list[i];
                    var startDate = item['start_date'] ? item['start_date'].split(' ') : '-';
                    var endDate = item['end_date'] ? item['end_date'].split(' ') : '-';
                    var checkDate = startDate != '-' ? startDate[0].split('-') : '-';

                    if (selectedDate == undefined) {

                        // page.find('.date' + Number(checkDate[2])).addClass('has_schedule');
                        continue;

                    }

                    var thisDate = new Date(item['start_date']);
                    var thisDay = Number(thisDate.getDay());

                    var startDay = dateKorString[thisDay] ? dateKorString[thisDay] : '';
                    var endDay = dateKorString[thisDay] ? dateKorString[thisDay] : '';
                    var courseTaskTypeCode = item['course_task_type_code'];

                    var isProcess = item['type_code'];
                    if (isProcess == CourseEventType.COURSE) {
                        isProcess = Strings.getString(Strings.COURSE);
                    }
                    if (isProcess == CourseEventType.COURSE_LEARNING_CONTENT) {
                        isProcess = Strings.getString(Strings.LESSON)
                    }
                    if (isProcess == CourseEventType.COURSE_TASK) {
                        isProcess = CourseTaskType.getName(courseTaskTypeCode);
                    }


                    var titleString = '[' + item['course_service_title'] + ']';
                    var title = item['title'];
                    if (String.isNotBlank(title)) {
                        titleString += ' ' + title;
                    }


                    var jHtmlStart = $('<div class="item_schedule public">' +
                        '<div class="box1">' +
                        '<p class="day_num">' + startDate[0].substr(8, 2) + '</p>' +
                        '<p class="day_string">' + startDay + '</p>' +
                        '</div>' +
                        '<div class="box2">' +
                        '<p class="tit">' + titleString + '</p>' +
                        '<p class="time">' + isProcess + ' ' + Strings.getString(Strings.START) + ' : ' + item['start_date'] + '</p>' +
                        '</div>' +
                        '</div>');


                    var jHtmlEnd = $('<div class="item_schedule public">' +
                        '<div class="box1">' +
                        '<p class="day_num">' + endDate[0].substr(8, 2) + '</p>' +
                        '<p class="day_string">' + endDay + '</p>' +
                        '</div>' +
                        '<div class="box2">' +
                        '<p class="tit">' + titleString + '</p>' +
                        '<p class="time">' + isProcess + ' ' + Strings.getString(Strings.END) + ' : ' + item['end_date'] + '</p>' +
                        '</div>' +
                        '</div>');


                    jHtmlStart.data('item', item);
                    jHtmlEnd.data('item', item);


                    if (selectedDate) {

                        if (startDate != '-' && startDate[0].substr(8, 2) == selectedDate)
                            page.find('.list_schedule').prepend(jHtmlStart);

                        if (endDate != '-' && endDate[0].substr(8, 2) == selectedDate)
                            page.find('.list_schedule').prepend(jHtmlEnd);


                    } else {

                        if (startDate != '-')
                            jContainer.prepend(jHtmlEnd);
                        if (endDate != '-')
                            jContainer.prepend(jHtmlStart);

                    }


                }


                page.find('.item_schedule').click(function () {

                    var data = $(this).data('item');

                    if (data['type_code'] == CourseEventType.PROCESS) {

                        var pageMap = {
                            course_code_id: data['course_code_id'],
                            course_content_id: data['course_content_id'],
                            board_id: data['board_id'],
                            id: data['id']
                        };

                        PageManager.go(['content/course_content_manage', 'process_control_detail'], pageMap);
                    }

                    if (data['type_code'] == CourseEventType.FILMING) {

                        var pageMap = {
                            course_code_id: data['course_code_id'],
                            course_content_id: data['course_content_id'],
                            id: data['id']
                        };

                        PageManager.go(['content/course_content_manage', 'process_control', 'calendar'], pageMap);
                    }


                });


            });
        },

        getNoticeBoardContentSummaryList: function (type) {

            var page = this;

            var params = {
                serviceProviderId: Server.serviceProviderId,
                institutionId: Server.institutionId,
                isAvailable: 1,
                isDeleted: 0,
                count: 4,
                page: 1,
                ignoreAlwaysOnTop: 1,
                parentBoardContentId: -1,
                showOnCmsOnly: 0,
            };

            Requester.func(function () {

                if (type == 0) {

                    params['boardIdList'] = BoardId.NOTICE;
                    params['boardTypeCode'] = BoardType.ANNOUNCEMENT;
                    params['organizationId'] = -1;
                    params['courseCodeId'] = -1;
                    params['courseContentId'] = -1;
                    params['curriculumId'] = -1;
                    params['termId'] = -1;
                    params['courseId'] = -1;
                    params['courseTaskId'] = -1;

                } else if (type == 1) {

                    params['boardTypeCode'] = BoardType.ANNOUNCEMENT;
                    params['courseId'] = 0;
                    params['courseTaskId'] = -1;
                }

                Requester.awbwq(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST, params, function (status, data, request) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    var jContainer = page.find('.list_notice').empty();
                    var list = Lia.p(data, 'body', 'list');

                    if (list == undefined || list.length == 0) {
                        jContainer.append('<div class="box_no_result" style="padding:60px 58px;text-align: center"><div class="box_no_result_inner"><img src="/res/cms/img/common/ico_nocontents.png"><div class="box_no_result_info"><p class="tit_no_result" style="margin-top:30px;">' +
                            Strings.getString(Strings.EMPTY_LIST_MESSAGE.CONTENT) + '</p></div></div></div>');
                        return;
                    }

                    var courseIdParam = params['courseId'];
                    var jHtml;

                    for (var i = 0; i < list.length; i++) {

                        var item = list[i];
                        var tit = item['title'];

                        if (courseIdParam != -1) {

                            var courseServiceTitle = CourseHelper.getCourseTitleForStudent(item);
                            if (String.isNotBlank(courseServiceTitle)) {
                                tit = '[' + courseServiceTitle + '] ' + tit;
                            }
                        }

                        var isNew = item['is_new'];
                        if (isNew == 1) {
                            tit += ' <img src="/res/cms/img/common/ico_notice_new.png">';
                        }


                        var date = item['registered_date'].substr(0, 10);
                        var rowNum = item['row_number'];
                        var isAlwaysOnTop = item['is_always_on_top'];
                        if (isAlwaysOnTop == 1) {
                            rowNum = '<img src="/res/cms/img/common/ico_notice2.png">';
                        }

                        jHtml = $('<div class="item_notice btn" type-code="' + type + '">'
                            + '<div class="no">' + rowNum + '</div>'
                            + '<div class="tit">' + tit + '</div>'
                            + '<div class="date mobile_hide">' + date + '</div>'
                            + '</div>');

                        if (i == 3)
                            jHtml.css('border-bottom', 'none');

                        jHtml.data('item', item);
                        jContainer.append(jHtml);
                    }

                    jContainer.find('.btn').click(function () {

                        var item = $(this).data('item');

                        if ( type == 1 ) {

                            var name = 'student/announcement' + '_detail';
                            PageManager.go([name], {
                                board_id: item['board_id'],
                                id: item['id']
                            });

                        } else {

                            Lia.redirect('/?m1=page_board_detail&menu_id=22&board_content_id=' + item['id']);
                        }
                    });
                });
            });
        },

        getQnABoardContentSummaryList: function (type) {

            var page = this;

            var params = {
                serviceProviderId: Server.serviceProviderId,
                institutionId: Server.institutionId,
                isAvailable: 1,
                isDeleted: 0,
                count: 4,
                page: 1,
                ignoreAlwaysOnTop: 1,
                parentBoardContentId: -1,
                showOnCmsOnly: 0,
            };

            Requester.func(function () {

                if (type == 0) {

                    params['boardIdList'] = BoardId.FAQ;
                    params['boardTypeCode'] = BoardType.FAQ;
                    params['organizationId'] = -1;
                    params['courseCodeId'] = -1;
                    params['courseContentId'] = -1;
                    params['curriculumId'] = -1;
                    params['termId'] = -1;
                    params['courseId'] = -1;
                    params['courseTaskId'] = -1;

                } else if (type == 1) {

                    params['boardTypeCode'] = BoardType.QUESTION_AND_ANSWER;
                    params['isRequesterContent'] = 1;
                }

                Requester.awbwq(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST, params, function (status, data, request) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    var jContainer = page.find('.list_qna').empty();
                    var list = Lia.p(data, 'body', 'list');

                    if (list == undefined || list.length == 0) {
                        jContainer.append('<div class="box_no_result" style="padding:60px 58px;text-align: center"><div class="box_no_result_inner"><img src="/res/cms/img/common/ico_nocontents.png"><div class="box_no_result_info"><p class="tit_no_result" style="margin-top:30px;">' +
                            Strings.getString(Strings.EMPTY_LIST_MESSAGE.CONTENT) + '</p></div></div></div>');
                        return;
                    }

                    var courseIdParam = params['courseId'];
                    var jHtml;

                    for (var i = 0; i < list.length; i++) {

                        var item = list[i];
                        var tit = item['title'];

                        if (courseIdParam != -1) {

                            var courseServiceTitle = CourseHelper.getCourseTitleForStudent(item);
                            if (String.isNotBlank(courseServiceTitle)) {
                                tit = '[' + courseServiceTitle + '] ' + tit;
                            }
                        }

                        var isNew = item['is_new'];
                        if (isNew == 1) {
                            tit += ' <img src="/res/cms/img/common/ico_notice_new.png">';
                        }


                        var date = item['registered_date'].substr(0, 10);
                        var rowNum = item['row_number'];
                        var isAlwaysOnTop = item['is_always_on_top'];
                        if (isAlwaysOnTop == 1) {
                            rowNum = '<img src="/res/cms/img/common/ico_notice2.png">';
                        }

                        jHtml = $('<div class="item_qna btn" type-code="' + type + '">'
                            + '<div class="no">' + rowNum + '</div>'
                            + '<div class="tit">' + tit + '</div>'
                            + '<div class="date mobile_hide">' + date + '</div>'
                            + '</div>');

                        if (i == 3)
                            jHtml.css('border-bottom', 'none');

                        jHtml.data('item', item);
                        jContainer.append(jHtml);
                    }

                    jContainer.find('.btn').click(function () {

                        var item = $(this).data('item');

                        if ( type == 0 ) {

                            Lia.redirect('/?m1=page&menu_id=14');

                        } else if ( type == 1 ) {

                            PageManager.go([ 'student/my_qna_detail'], {
                                board_id: item['board_id'],
                                id: item['id']
                            });

                        }
                    });
                });
            });
        },

        getCourseSummaryList: function () {

            var page = this;

            var opt = {
                institutionId: page.institutionId,
                includeCourseSectionList: 0,
                statusCodeList: [CourseStatus.OPERATING, CourseStatus.MARK_REVIEWING].join(','),
                courseEnrollmentStatusCodeList: 20, // 수강중
                includeStudentAttendanceDetails: 1,
                groupByCourseContentId: 0,
                groupByCourseCodeId: 0,
                orderByCode: 14,
                adminPage: 0,
                studentPage: 1,
                page: 1,
                count: 20,
                isDeleted: 0
            };


            for (var i = 0, l = page.weekCount; i < l; i++) {
                page.find('.thead_course').append('<div class="attendance_item">' + (i + 1) + '</div>');
            }

            page.find('.thead_course').append('<div class="attendance_item_padding"></div>');

            Requester.awbwq(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST, opt, function (status, data, request) {

                if (status != Requester.Status.SUCCESS) {
                    return;
                }


                var jContainer = $('.tbody_course');
                var list = Lia.p(data, 'body', 'list');
                if (list == undefined || list.length == 0) {

                    var jEmpty = $('<div class="box_no_result" style="padding:135px 58px;text-align: center">' +
                        '<div class="box_no_result_inner"><img src="/res/cms/img/common/ico_nocontents.png">' +
                        '<div class="box_no_result_info">' +
                        '<p class="tit_no_result" style="margin-top:30px;">' + Strings.getString(Strings.EMPTY_LIST_MESSAGE.ENROLLED_COURSE) + '</p>' +
                        '</div></div>' +
                        '</div>');
                    jContainer.append(jEmpty);
                    return;
                }


                var currentDate = Lia.p(data, 'current_date');

                var institutionIdMap = {};

                for (var i = 0; i < list.length; i++) {

                    var item = list[i];

                    var categoryCode = '-';

                    var departmentName = Lia.pd('-', item, 'department_mapping_list', 0, 'department_mapping', 'department_name');

                    var ternName = Lia.p(item, 'term_year');
                    var termNumber = Lia.p(item, 'term_number');
                    ternName += '년 ' + TermNumber.getName(termNumber);

                    var title = CourseHelper.getCourseTitleForStudent(item);
                    var courseCode = Lia.pd('-', item, 'course_code_code');
                    var credit = Lia.pd('-', item, 'credit');
                    var year = Lia.pd('-', item, 'year');
                    var studentCount = Lia.pd('-', item, 'student_count');
                    var profName = Lia.pd('-', item, 'course_administrator_list', 0, 'admin_user_name');
                    var studentLearningProgress = ScoreHelper.getScore(Lia.p(item, 'course_enrollment_learning_progress'));

                    var jHtml = $('<div class="item_course">'
                        // + '<div class="category">' + categoryCode + '</div>'
                        // + '<div class="major">' + departmentName + '</div>'
                        + '<div class="name">' + title + '</div>'
                        // + '<div class="count">' + studentCount + '명</div>'
                        + '<div class="degree pc_show">' + credit + '</div>'
                        // + '<div class="process"><span>' + studentLearningProgress + '%</span><div class="total"><div class="done" style="width:' + studentLearningProgress + '%;"></div></div></div>'
                        + '</div>');

                    page.find('.tbody_course').append(jHtml);

                    var studentAttendanceList = Lia.p(item, 'student_attendance_list');
                    var courseLearningContentList = Lia.p(item, 'course_learning_content_list');
                    var courseLearningContentListCount = 0;
                    if (courseLearningContentList != undefined) {
                        courseLearningContentListCount = courseLearningContentList.length;
                    }

                    for (var i2 = 0, l2 = page.weekCount; i2 < l2; i2++) {

                        var jItem = $('<div class="attendance_item">' +
                            '<div style="font-size:11px;width:25px;height:25px;font-family:NanumGothicBold;margin-top:12px;margin-left:auto;margin-right:auto;">' +
                            '</div>' +
                            '</div>');

                        var jItemList = jItem.children('div');

                        jHtml.append(jItem);

                        if (i2 >= courseLearningContentListCount) {
                            continue;
                        }

                        // jItem.find('div').css({'border':'1px solid ' + color, color:color}).text(text);

                        var sa = Lia.p(studentAttendanceList, i2);

                        var saItemList = Lia.p(sa, 'item_list');
                        if (saItemList != undefined && saItemList.length > 0) {

                            for (var i3 = 0, l3 = saItemList.length; i3 < l3; i3++) {

                                var saItem = Lia.p(saItemList, i3);

                                var statusCode = Lia.p(saItem, 'status_code');
                                var text = '결석';
                                var color = '#e05562';
                                if (statusCode == StudentAttendanceStatus.PRESENT) {
                                    color = '#1970b9';
                                    text = '출석';
                                } else if (statusCode == StudentAttendanceStatus.LATE) {
                                    color = '#fca74d';
                                    text = '지각';
                                }

                                var jAItem = $('<div style="background-color:' + color + ';"></div>');
                                jAItem.css({
                                    'height': ((25 - (l3 - 1)) / l3) + 'px'
                                });

                                if (i3 > 0) {
                                    jAItem.css({'margin-top': '1px'});
                                }

                                jItemList.append(jAItem);
                            }

                        } else {

                            var statusCode = Lia.p(sa, 'status_code');
                            var text = '결석';
                            var color = '#e05562';
                            if (statusCode == StudentAttendanceStatus.PRESENT) {
                                color = '#1970b9';
                                text = '출석';
                            } else if (statusCode == StudentAttendanceStatus.LATE) {
                                color = '#fca74d';
                                text = '지각';
                            }

                            var jAItem = $('<div style="background-color:' + color + ';"></div>');
                            jAItem.css({
                                'height': 25 + 'px'
                            });
                            jItemList.append(jAItem);
                        }

                        var startDate = Lia.pd(undefined, courseLearningContentList, i2, 'start_date');
                        var endDate = Lia.pd(undefined, courseLearningContentList, i2, 'end_date');

                        if (startDate <= currentDate && currentDate <= endDate) {
                            jItem.css({'background-color': '#eeeeee'});
                        } else {
                            // jItem.css({'opacity': '0.5'});
                        }
                    }

                    jHtml.append('<div class="attendance_item_padding"></div>');

                    if (i == 19)
                        jHtml.css('border-bottom', 'none');

                    jHtml.data('item', item);

                    institutionIdMap[item['institution_id']] = true;
                }


                for (var insId in institutionIdMap) {

                    Requester.awbwq(ApiUrl.Website.GET_AVAILABLE_BANNER_LIST, {
                            serviceProviderId : Server.serviceProviderId,
                            institutionId: insId,
                            organizationId: -1,
                            isAvailable: 1,
                            isDeleted: 0
                        },
                        function (status, data, request) {

                            if (status != Requester.Status.SUCCESS) {
                                return;
                            }

                            var body = data['body'];
                            if (body == undefined)
                                return;

                            var popup = undefined;
                            var list = Lia.p(body, 'list');
                            if (list == undefined)
                                return;

                            // div 팝업 처리
                            for (var i = 0; i < list.length; i++) {

                                var item = list[i];
                                var typeCode = item['type_code'];

                                if (typeCode != BannerType.POPUP)
                                    continue;

                                var id = item['id'];

                                var bannerPopupCookieName = 'BANNER_POPUP_COOKIE' + id;
                                var bannerPopupCookie = CookieHelper.get(bannerPopupCookieName);

                                var dateString = Date.today().toString("yyyy/M/d");
                                if (String.isBlank(bannerPopupCookie) || dateString != bannerPopupCookie) {

                                    popup = AjaxPopupManager.show(LmsPopupUrl.BANNER_POPUP, {
                                        item: item,
                                        cookie: bannerPopupCookieName,
                                        beforePopup: popup
                                    });
                                }
                            }
                        });
                }


                page.find('.tbody_course').find('.item_course').click(function () {
                    var item = $(this).data('item');

                    var statusCode = Lia.p(item, 'status_code');

                    // if (statusCode != CourseStatus.OPERATING) {
                    //
                    //     PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '현재 운영중이 아닌 과목입니다.');
                    //     return;
                    // }

                    var courseId = Lia.p(item,'id');

                    if ( ProjectSettings.CourseEnrollment.checkEnteringCourse(item) ) {

                        AjaxPopupHelper.checkSurveyRequirement({
                                typeCodeList: SurveyRequestType.BEFORE_STARTING_TO_LEARN + ',' + SurveyRequestType.BEFORE_LEARNING_AND_AFTER_LEARNING,
                                courseId: courseId
                            }, function () {

                                Lia.redirect(PageUrl.LEARNING, {
                                    m1: 'class',
                                    course_id: courseId
                                });
                            }
                        );

                    }
                });

            });
        },

        getStudentCourseEnrollmentStatus: function (inputDate) {

            var page = this;

            Requester.awbwq(ApiUrl.Learning.GET_STUDENT_COURSE_ENROLLMENT_STATUS, {}, function (status, data, request) {

                if (status != Requester.Status.SUCCESS) {
                    return;
                }

                var body = Lia.p(data, 'body');

                if (body == undefined)
                    return;

                var completedCourseCount = Lia.p(body, 'completed_course_count');
                var earnedCredits = Lia.p(body, 'earned_credits');
                var requiredCredits = Lia.p(body, 'required_credits');
                var earnedCreditsRatio = earnedCredits / requiredCredits * 100;
                earnedCreditsRatio = earnedCreditsRatio.toFixed(1);
                var earnedCreditsRatioPieChartClass = 'c100 p' + parseInt(earnedCreditsRatio) + ' middle';

                var studentCourseCountHtml = '<div class="' + earnedCreditsRatioPieChartClass + '">'
                    + '<span>' + earnedCreditsRatio + '%</span>'
                    + '<div class="slice">'
                    + '<div class="bar"></div>'
                    + '<div class="fill"></div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="left" style="text-align: left">'
                    + '<p style="margin-bottom: 10px;">총 이수: ' + completedCourseCount + '과목</p>'
                    + '<div style="color:#aaa;">'
                    + '<span style="color: #000;"><strong style="font-size: 24px;margin-right: 10px;">' + earnedCredits + '</strong>학점</span> / ' + requiredCredits + ' 학점'
                    + '</div>'
                    + '</div>';

                page.find('.student_course_count').html(studentCourseCountHtml);

                var requiredCreditsForMajor = Lia.p(body, 'required_credits_for_major');
                var earnedCreditsForMajor = Lia.p(body, 'earned_credits_for_major');
                var earnedMajorCreditRatio = earnedCreditsForMajor / requiredCreditsForMajor * 100;
                earnedMajorCreditRatio = earnedMajorCreditRatio.toFixed(1);


                var studentMajorCourseStatusHtml = '<p class="tit_process">전공 이수 현황</p>'
                    + '<div class="total"><div class="percent" style="width:' + earnedMajorCreditRatio + '%;"></div></div>'
                    + '<div class="bar_status"><span class="right">'
                    + '<span>' + earnedCreditsForMajor + '학점</span> / ' + requiredCreditsForMajor + '학점</span><span class="left">' + earnedMajorCreditRatio + '%</span></div>';

                page.find('.student_major_course_status').html(studentMajorCourseStatusHtml);

                var requiredCreditsForElective = Lia.p(body, 'required_credits_for_elective');
                var earnedCreditsForElective = Lia.p(body, 'earned_credits_for_elective');
                var earnedElectiveCreditRatio = earnedCreditsForElective / requiredCreditsForElective * 100;
                earnedElectiveCreditRatio = earnedElectiveCreditRatio.toFixed(1);

                var studentElectiveCourseStatusHtml = '<p class="tit_process">기타 이수 현황</p>'
                    + '<div class="total"><div class="percent" style="width:' + earnedElectiveCreditRatio + '%;"></div></div>'
                    + '<div class="bar_status"><span class="right">'
                    + '<span>' + earnedCreditsForElective + '학점</span> / ' + requiredCreditsForElective + '학점</span><span class="left">' + earnedElectiveCreditRatio + '%</span></div>';

                page.find('.student_elective_course_status').html(studentElectiveCourseStatusHtml);
            });
        },

        getStudentTodoList: function (inputDate) {

            var page = this;

            Requester.awbwq(ApiUrl.Learning.GET_STUDENT_TODO_LIST, {}, function (status, data, request) {

                if (status != Requester.Status.SUCCESS) {
                    return;
                }

                var currentStickNumber = 0;

                var examTakenCount = 0;
                var examTotalCount = 0;
                var examStickNumber = currentStickNumber;
                currentStickNumber++;

                var quizTakenCount = 0;
                var quizTotalCount = 0;
                var quizStickNumber = 0;

                if (Configs.getConfig(Configs.QUIZ)) {

                    quizStickNumber = currentStickNumber;
                    currentStickNumber++;
                }

                var assignmentTakenCount = 0;
                var assignmentTotalCount = 0;
                var assignmentStickNumber = currentStickNumber;
                currentStickNumber++;

                var forumTakenCount = 0;
                var forumTotalCount = 0;
                var forumStickNumber = 0;

                if (Configs.getConfig(Configs.FORUM)) {

                    forumStickNumber = currentStickNumber;
                    currentStickNumber++;
                }

                var liveSeminarTakenCount = 0;
                var liveSeminarTotalCount = 0;
                var liveSeminarStickNumber = 0;

                if (Configs.getConfig(Configs.LIVE_SEMINAR)) {

                    liveSeminarStickNumber = currentStickNumber;
                    currentStickNumber++;
                }

                var leftPositionPaddingRatio = 20 / currentStickNumber;
                var leftPositionRatioPerStick = 100 / currentStickNumber;

                var courseTaskTodoList = Lia.p(data, 'body', 'course_task_todo_list');
                if (courseTaskTodoList != undefined) {

                    for (var k = 0; k < courseTaskTodoList.length; k++) {

                        var typeCode = courseTaskTodoList[k]['type_code'];
                        var isSubmitted = courseTaskTodoList[k]['is_submitted'];

                        if (typeCode == CourseTaskType.EXAM
                            || typeCode == CourseTaskType.MIDTERM_EXAM
                            || typeCode == CourseTaskType.FINAL_EXAM
                            || typeCode == CourseTaskType.EXAM_REPLACEMENT_REPORT_ASSIGNMENT
                            || typeCode == CourseTaskType.EXAM_REPLACEMENT_PROBLEM_ASSIGNMENT
                            || typeCode == CourseTaskType.EXTERNAL_EXAM) {

                            examTotalCount++;

                            if (isSubmitted == 1)
                                examTakenCount++;

                        } else if (typeCode == CourseTaskType.QUIZ
                            || typeCode == CourseTaskType.EXTERNAL_QUIZ) {

                            quizTotalCount++;

                            if (isSubmitted == 1)
                                quizTakenCount++;

                        } else if (typeCode == CourseTaskType.REPORT_ASSIGNMENT
                            || typeCode == CourseTaskType.PROBLEM_ASSIGNMENT
                            || typeCode == CourseTaskType.EXTERNAL_ASSIGNMENT) {

                            assignmentTotalCount++;

                            if (isSubmitted == 1)
                                assignmentTakenCount++;

                        } else if (typeCode == CourseTaskType.FORUM
                            || typeCode == CourseTaskType.REAL_TIME_FORUM
                            || typeCode == CourseTaskType.EXTERNAL_FORUM) {

                            forumTotalCount++;

                            if (isSubmitted == 1)
                                forumTakenCount++;

                        } else if (typeCode == CourseTaskType.LIVE_SEMINAR) {

                            liveSeminarTotalCount++;

                            if (isSubmitted == 1)
                                liveSeminarTakenCount++;
                        }
                    }

                }

                // var surveyTodoList = Lia.p(data, 'body', 'survey_todo_list');


                var examTakenRatio = examTakenCount / examTotalCount * 100;
                page.find('.exam_stick_info').html('<span>' + examTakenCount + '</span> / ' + examTotalCount + '');
                page.find('.exam_fill').css('height', examTakenRatio + '%');

                var examStickLeftPositionRatio = leftPositionPaddingRatio + leftPositionRatioPerStick * examStickNumber;
                page.find('.vertical_chart .stick_group.test').css({'left': examStickLeftPositionRatio + '%'});
                page.find('.vertical_chart .name.test').css({'left': examStickLeftPositionRatio + '%'});

                var quizTakenRatio = quizTakenCount / quizTotalCount * 100;
                page.find('.quiz_stick_info').html('<span>' + quizTakenCount + '</span> / ' + quizTotalCount + '');
                page.find('.quiz_fill').css('height', quizTakenRatio + '%');

                if (Configs.getConfig(Configs.QUIZ)) {
                    var quizStickLeftPositionRatio = leftPositionPaddingRatio + leftPositionRatioPerStick * quizStickNumber;
                    page.find('.vertical_chart .stick_group.quiz').css({'left': quizStickLeftPositionRatio + '%'});
                    page.find('.vertical_chart .name.quiz').css({'left': quizStickLeftPositionRatio + '%'});
                }

                var assignmentTakenRatio = assignmentTakenCount / assignmentTotalCount * 100;
                page.find('.assignment_stick_info').html('<span>' + assignmentTakenCount + '</span> / ' + assignmentTotalCount + '');
                page.find('.assignment_fill').css('height', assignmentTakenRatio + '%');

                var assignmentStickLeftPositionRatio = leftPositionPaddingRatio + leftPositionRatioPerStick * assignmentStickNumber;
                page.find('.vertical_chart .stick_group.assignment').css({'left': assignmentStickLeftPositionRatio + '%'});
                page.find('.vertical_chart .name.assignment').css({'left': assignmentStickLeftPositionRatio + '%'});

                var forumTakenRatio = forumTakenCount / forumTotalCount * 100;
                page.find('.forum_stick_info').html('<span>' + forumTakenCount + '</span> / ' + forumTotalCount + '');
                page.find('.forum_fill').css('height', forumTakenRatio + '%');

                if (Configs.getConfig(Configs.FORUM)) {

                    var forumStickLeftPositionRatio = leftPositionPaddingRatio + leftPositionRatioPerStick * forumStickNumber;
                    page.find('.vertical_chart .stick_group.forum').css({'left': forumStickLeftPositionRatio + '%'});
                    page.find('.vertical_chart .name.forum').css({'left': forumStickLeftPositionRatio + '%'});
                }

                var liveSeminarTakenRatio = liveSeminarTakenCount / liveSeminarTotalCount * 100;
                page.find('.live_seminar_stick_info').html('<span>' + liveSeminarTakenCount + '</span> / ' + liveSeminarTotalCount + '');
                page.find('.live_seminar_fill').css('height', liveSeminarTakenRatio + '%');

                if (Configs.getConfig(Configs.LIVE_SEMINAR)) {

                    var liveSeminarStickLeftPositionRatio = leftPositionPaddingRatio + leftPositionRatioPerStick * liveSeminarStickNumber;
                    page.find('.vertical_chart .stick_group.live').css({'left': liveSeminarStickLeftPositionRatio + '%'});
                    page.find('.vertical_chart .name.live').css({'left': liveSeminarStickLeftPositionRatio + '%'});
                }
            });
        },

        cssLoading: true,
        htmlLoading: true,

        onInit: function (j) {

            var page = this;

            if (Configs.getConfig(Configs.QUIZ)) {
                page.find('.vertical_chart .quiz').show();
            }

            if (Configs.getConfig(Configs.FORUM)) {
                page.find('.vertical_chart .forum').show();
            }

            if (Configs.getConfig(Configs.LIVE_SEMINAR)) {
                page.find('.vertical_chart .live').show();
            }

            page.institutionId = Server.institutionId;

            page.getNoticeBoardContentSummaryList(0);
            page.getQnABoardContentSummaryList(0);
            page.getCourseSummaryList();

            var date = new Date();
            page.showYear = date.getFullYear();
            page.showMonth = date.getMonth() + 1;

            page.getCourseEventDateList(date);
            page.getCourseEventList(date);
            page.getStudentTodoList();
            page.getStudentCourseEnrollmentStatus();

            page.find('.category_notice li').click(function () {

                var jThis = $(this);
                var m1 = jThis.attr('m1');

                jThis.parents('#notice').find('.more').attr('m1', m1);
                page.find('.category_notice li').removeClass('on');
                jThis.addClass('on');
                page.getNoticeBoardContentSummaryList(jThis.index());
            });

            page.find('.category_qna li').click(function () {

                var jThis = $(this);
                var m1 = jThis.attr('m1');

                jThis.parents('#qna').find('.more').attr('m1', m1);
                page.find('.category_qna li').removeClass('on');
                jThis.addClass('on');
                page.getQnABoardContentSummaryList(jThis.index());

            });

            page.find('.more').click(function () {

                var m1 = $(this).attr('m1');
                if ( m1.startsWith('/') ) {
                    Lia.redirect(m1);
                } else {
                    PageManager.go([m1]);
                }
            });

            page.find('.prev_month').click(function () {

                date.setMonth(date.getMonth() - 1);
                page.getCourseEventDateList(date);
                page.getCourseEventList(date);
            });

            page.find('.next_month').click(function () {
                date.setMonth(date.getMonth() + 1);
                page.getCourseEventDateList(date);
                page.getCourseEventList(date);
            });


        },
        onChange: function (j) {
        },
        onRelease: function (j) {
        }
    };
})();
