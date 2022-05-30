(function () {

    return {
        INIT : 1,
        CHANGE : 2,
        RELEASE : 3,

        onInit: function (j) {
            var page = this;

            page.menuPageManager = new MenuPageManager({
                page : page
            });
            page.menuPageManager.onInit(j);

            // 추가정보 입력 여부 확인
            // page.checkAdditionalInfoSaved();

            var courseId = page.courseId = PageManager.pc('course_id');
            var menuId = PageManager.pc('menu_id');

            page.loadCourseHeader();

            Requester.awb(ApiUrl.Learning.GET_AVAILABLE_SIMPLE_TERM_LIST ,{
            }, function (status, data) {
                // console.log(data)
                var list = Lia.p(data, 'body' ,'list');

                for(var i in list) {
                    var yearItem = Lia.p(list , i)
                    // console.log(yearItem)
                    var option = $('<option></option>');
                    var year = Lia.p(yearItem  , 'year');
                    var typeCode = Lia.p(yearItem, 'type_code');
                    var id = Lia.p(yearItem , 'id')

                    if(typeCode ==1) {
                        option.val(id);
                        option.text( '상시제' );
                    } else {
                        option.val(id);
                        option.text( '기수제 ('+year+')' );
                    }


                    page.find('.course_main_nav_combo').append(option)
                }
            })

            //과정분야, 교육대상
            //page.loadCourseSideBar();
            //page.loadCourseSideBar_target();

            page.loadCourseSideBar_status();
            page.loadCourseSideBar_isOnline();
            page.loadCourseSideBarWithAPI();

            //왼쪽메뉴 접기, 초기상태 = 접힌상태
            {
                var jThis = page.find('.course_sidebar_title');
                jThis.next().css('display', 'none');
                jThis.find('.course_sidebar_btn').addClass('more');
            }
            page.find('.course_sidebar_title').on('click' , function(e) {
                var jThis = $(this);
                if(jThis.next().css('display') == 'none') {
                    // jThis.next().css('display', 'block');
                    var height = jThis.next().innerHeight()
                    jThis.next().slideDown(300);
                    jThis.find('.course_sidebar_btn').removeClass('more');
                } else {
                    jThis.next().slideUp(300);
                    jThis.find('.course_sidebar_btn').addClass('more');
                }
            })
        },



        menuId : undefined,

        onChange: function (j) {

            var page = this;

            var menu = MenuManager.getLastSelectedMenu();
            // var menuId = menu['id'];

            page.menuPageManager.onChange(j);
            // page.loadCourseHeader()

            Requester.func(function() {
                //강좌 로딩
                page.loadCourseItem();

                //쿼리 보존하여 체크박스 유지
                //교욱방법
                page.loadingSidebar_learningMethod_onChange();

                //강의 상태
                page.loadingSidebar_status_onChange();

                //교육방법, 기관유형, 경력 등
                page.loadingSidebar_onChange();

                //서치 스트링
                page.loadingSearch_onChange();
                page.loadingHeader_onChange();

                //태그만들기
                page.makingTag();
            });

        },



        onRelease: function (j) {
            var page = this;
            //page.menuPageManager.onRelease(j);
        },
        onResize : function() {
            var page = this;

            var jSideBar = $('.course_sidebar');
            var windowWidth = $(window).width();

            if(windowWidth > 1359 && jSideBar.css('display') != 'none') {
                jSideBar.css('display' , 'inline-block');

            } else {
                jSideBar.css('display' , 'none');
            }

            page.find('.course_sidebar_tm_header img').on('click', function() {
                var jSideBar = $('.course_sidebar');
                if(windowWidth > 1359) {
                    jSideBar.css('display', 'inline-block');
                } else {
                    jSideBar.css('display', 'none');
                }
            });

            //리스트뷰 선택하고 화면 줄였을 때 카드뷰로 전환
            {
                var viewStatus = page.find('.listv').css('display');

                if (windowWidth <= 1359) {
                    //var listv = PageManager.pc('listv');

                    page.find('.listv').css('display', 'none');
                    page.find('.home_card_item').css('display', 'inline-block');
                } else {
                    var listv = PageManager.pc('listv');

                    if (listv) {
                        page.find('.listv').css('display', 'block');
                        page.find('.home_card_item').css('display', 'none');
                    } else {
                        page.find('.listv').css('display', 'none');
                        page.find('.home_card_item').css('display', 'inline-block');
                    }
                }
            }

            // 화면 변동이 있을 경우 뷰 재지정
            if(windowWidth > 1359) {
                jSideBar.show();
            }

        },

        //onInit====================================================
        //헤더(키워드검색 최신순 인기순 빠른마감순 등)
        loadCourseHeader : function() {
            var page = this;

            if(INDEX.enterBySearch) {
                var filterStatus = $('.course_sidebar').css('display')
                if(filterStatus == 'block') {
                    $('.course_sidebar').css('display', 'none')
                } else {
                    $('.course_sidebar').css('display', 'inline-block')
                }
            }

            //로딩시 searchString
            var searchOptionString = PageManager.pc('searchOptionString');
            if(searchOptionString!=null) {
                $('.course_search_input').val(searchOptionString)
            }


            page.find('.course_main_nav_combo').empty();
            page.find('.course_main_nav_combo').append($('<option value="-1">전체</option>'));

            //전체, 상시 예외처리
            page.find('.course_main_nav_combo').change(function() {
                var jThis = $(this);
                if(jThis.val() == '-1') {
                    PageManager.cpcpm({term_id : ''})
                } else {
                    PageManager.cpcpm({term_id : jThis.val()});
                }
            })

            $('.course_main_nav_info_ul').children().off().on('click' , function(e) {
                e.stopPropagation()
                var jThis = $(this);
                page.find('.course_main_nav_info_ul li').removeClass('filter_click');
                jThis.addClass('filter_click')

                if(jThis.attr('value') == 'new') {
                    PageManager.cpcpm({
                        orderByCode : CourseOrderBy.REGISTERED_DATE_ASC
                    })
                } else if(jThis.attr('value') == 'hot') {
                    PageManager.cpcpm({
                        orderByCode : CourseOrderBy.STUDENT_COUNT_DESC
                    })
                } else {
                    PageManager.cpcpm({
                        orderByCode : CourseOrderBy.ENROLLED_OR_UNEROLLED_DATE_DESC
                    })
                }
            });

            $('.course_main_nav_order').change(function(e) {

                var option = null;
                var selectOption = $('.course_main_nav_order option:selected').attr('value');
                if(selectOption == 'new') {
                    PageManager.cpcpm({
                        orderByCode : CourseOrderBy.REGISTERED_DATE_ASC
                    })
                } else if(selectOption == 'hot') {
                    PageManager.cpcpm({
                        orderByCode : CourseOrderBy.STUDENT_COUNT_DESC
                    })
                } else {
                    PageManager.cpcpm({
                        orderByCode : CourseOrderBy.ENROLLED_OR_UNEROLLED_DATE_DESC
                    })
                }
            })
            //
            //
            // $('.course_main_nav_info_btn').off().on('click' , function(e) {
            //     e.stopPropagation()
            //     PopupManager.alert('안내', '모바일과 태블릿에서는 지원되지 않는 기능입니다.');
            // });


            var isListView = PageManager.pc('listv');

            if(isListView == 'true') {
                $('.course_main_nav_info_viewselect img').attr('src', '/res/home/img/stop/common/btn_listview.png');
            } else {
                $('.course_main_nav_info_viewselect img').attr('src', '/res/home/img/stop/common/btn_cardview.png');
            }


            $('.course_main_nav_info_viewselect').off().on('click' , function(e) {

                e.stopPropagation()

                var jThis = $(this);

                var listImg = '/res/home/img/stop/common/btn_listview.png'
                var cardImg = '/res/home/img/stop/common/btn_cardview.png'

                var src = jThis.find('img').attr('src');

                if(src == cardImg) {
                    jThis.find('img').attr('src' , listImg);
                } else {
                    jThis.find('img').attr('src' , cardImg);
                }



                var cardView = page.find('.home_card_item').css('display');
                var listView = page.find('.course_list_wrapper').css('display');


                if (cardView == 'inline-block') {
                    page.find('.home_card_item').css('display', 'none');
                    page.find('.course_list_wrapper').css('display', 'block'); //listView

                } else {
                    page.find('.home_card_item').css('display', 'inline-block');
                    page.find('.course_list_wrapper').css('display', 'none');

                }

                if (page.find('.course_list_wrapper').css('display') == 'block') {
                    PageManager.cpcpm({
                        listv: true
                    })
                } else {
                    PageManager.cpcpm({
                        listv: ''
                    })
                }





            });

            $('.course_main_nav_info_filter').off().on('click' , function(e) {
                var filterStatus = $('.course_sidebar').css('display')
                if(filterStatus == 'block') {
                    $('.course_sidebar').css('display', 'none')
                } else {
                    $('.course_sidebar').css('display', 'inline-block')
                }
            })

            var windowWidth = $(window).width();

            page.find('.course_sidebar_tm_header img').on('click', function() {
                var jSideBar = $('.course_sidebar');
                if(windowWidth > 1359) {
                    jSideBar.css('display', 'inline-block');
                } else {
                    jSideBar.css('display', 'none');
                }
            });

            page.find('.course_sidebar_tm_button').on('click' , function() {
                $('.course_sidebar').css('display', 'none');
            });

            $('.course_main_nav_taglist_tag.initialize').off().on('click', function(e) {
                e.stopPropagation()
                //쿼리 삭제 및 초기화
                PageManager.go(['courses'] , {menu_id : MenuId.COURSE});
            });

            $('.course_search_img').off().on('click', function(e) {
                e.stopPropagation()

                var searchText = page.find('.course_search_input').val();

                $('.nav_search_input').val(searchText);

                PageManager.cpcpm({
                    searchOptionString : searchText
                });
            });

            $('.course_search_input').keydown(function(e) {
                if(e.keyCode == 13) {
                    var searchText = page.find('.course_search_input').val();
                    // 상단에도 동일하게 적용
                    $('.nav_search_input').val(searchText);
                    PageManager.cpcpm({
                        searchOptionString : searchText
                    })
                }
            })
        },

        //강좌 불러오는 부분
        loadCourseItem : function() {

            var page = this;

            var sol = new SearchOptionList();

            //모집상태(모집예정 모집중 등), 교육방법(온오프) loadCourseSideBar_status(), loadCourseSideBar_isOnline()
            var statusCodeList = PageManager.pc('status_code_list');
            var isOnlineCodeList = PageManager.pc('isonline_code_list');

            //메인리스트 헤더(키워드검색 최신순 인기순 빠른마감순 등. 드롭박스 미구현. loadCourseHeader()
            var orderByCode = PageManager.pcd( CourseOrderBy.TERM_TYPE_CODE_DESC_AND_REGISTRATION_END_DATE_DESC_TITLE_DESC, 'orderByCode')
            var searchTitle = PageManager.pc('searchOptionString');
            var searchYear = PageManager.pc('searchYear');
            var termId = PageManager.pc('term_id');

            if(searchTitle != null) {
                sol.add(SearchOption.CourseSummary.TITLE, searchTitle);
            }


            //교육대상, loadCourseSideBar_target()

            //경력
            var careerCodeList = PageManager.pc('career_code_list');
            if ( String.isNotBlank(careerCodeList) ) {
                var careerCodes = careerCodeList.split(',');
                sol.addKeywordList(SearchOption.CourseSummary.ATTRIBUTE_ID, careerCodes);
            }

            //직위
            var positionCodeList = PageManager.pc('position_code_list');
            if(String.isNotBlank(positionCodeList)) {
                var positionCodes = positionCodeList.split(',');
                sol.addKeywordList(SearchOption.CourseSummary.ATTRIBUTE_ID, positionCodes)
            }

            //소속기관
            var fieldCodeList = PageManager.pc('field_code_list');
            if(String.isNotBlank(fieldCodeList)) {
                var fieldCodes = fieldCodeList.split(',');
                sol.addKeywordList(SearchOption.CourseSummary.ATTRIBUTE_ID, fieldCodes)
            }

            //과정분야
            var AttrCodeList = PageManager.pc('attribute_code_list');
            if(String.isNotBlank(AttrCodeList)) {
                var attrCodes = AttrCodeList.split(',');
                sol.addKeywordList(SearchOption.CourseSummary.ATTRIBUTE_ID, attrCodes);
            }

            var searchOptionList = undefined;
            if ( sol.size() > 0 ) {
                searchOptionList = sol.get();
            }

            // var positionCodeList = PageManager.pc('positionOptionList')
            // var fieldCodeList = PageManager.pc('fieldOptionList')

            var termTypeCodeList = undefined;
            if ( String.isNotBlank(statusCodeList) ) {

                var statusCodeListSplit = statusCodeList.split(',');
                for ( var i = 0, l = statusCodeList.length; i < l; i++ ) {
                    if ( statusCodeListSplit[i] != CourseStatus.REGISTERING ) {
                        termTypeCodeList = TermType.REGULAR + ',' + TermType.CHILD;
                        break;
                    }
                }
            }


            if ( String.isBlank(statusCodeList) ) {
                statusCodeList = [ CourseStatus.WAITING, CourseStatus.REGISTERING ].join(',');
            }

            var courseArg = {
                institutionId: Server.institutionId,
                termTypeCodeList : termTypeCodeList,
                // groupByCode: 1,
                termIsAvailable: 1,
                isAvailable: 1,
                adminPage: 0,
                studentPage: 0,
                statusCodeList : statusCodeList,
                careerCodeList : careerCodeList,
                orderByCode : orderByCode,
                searchOptionList : searchOptionList,
                learningMethodCodeList : isOnlineCodeList, //onoff
                includeAttributeList: 1,
                termId : termId
                // positionOptionList : positionCodeList
                // fieldOptionList : fieldCodeList
            }

            courseArg['year'] = (new Date()).toString('yyyy');

            Requester.awb(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST, courseArg,
                function (status, data) {

                    var currentDate = Lia.p(data,'current_date');

                    var courseList = Lia.p(data,'body','list');
                    var count = Lia.p(data,'body','total_count');

                    //총 건수
                    var jCourseTotal = $('.course_main_nav_info_total').empty();
                    jCourseTotal.text('총 '+ count +' 건');

                    if(count == 0) {
                        var jCourseList = page.find('.home_card_slide').empty();
                        page.find('.course_main_list').css('width' , '100%')
                        var empty = $('<div class="course_list_empty">\n' +
                            '                                <div class="course_list_empty_ico"></div>\n' +
                            '                                <p class="course_list_empty_desc">일치하는 내용이 없습니다.</p>\n' +
                            // '                                <p class="course_list_empty_desc">올해 과정이 모두 종료되었습니다.</p>\n' +
                            '                            </div>')
                        jCourseList.append(empty)
                    } else {

                        var jCourseList = $('.home_card_slide').empty();
                        //데이터 순회 & 강좌 카드 만들기
                        for (var i in courseList) {
                            var courseItem = courseList[i];

                            var jCourseCardItem = $(
                                '<div class="home_card_item"> ' +
                                '<div class="card_item_img"> ' +
                                '<div class="card_item_enroll"> ' +
                                '<div class="card_item_enroll_end">모집종료</div> ' +
                                '<div class="card_item_enroll_ing">모집중</div> ' +
                                '<div class="card_item_enroll_plan">모집예정</div> ' +
                                '</div> ' +
                                '<div class="card_item_state"> ' +
                                '<div class="card_item_state_online">이러닝</div> ' +
                                '<div class="card_item_state_offline">집체</div> ' +
                                '</div> ' +
                                '</div> ' +
                                '<div class="card_item_content">' +
                                '<div class="card_item_category">-</div> ' +
                                '<div class="card_item_title"></div>' +
                                '</div> ' +
                                '<div class="card_item_info"> ' +
                                '<div class="card_item_info_register_period"></div>' +
                                '<div class="card_item_info_period"></div>' +
                                ' <div class="card_item_info_personnel"></div> ' +
                                '</div> ' +
                                '</div>')

                            var jCourseListItem = $('<div class="course_list_wrapper listv">\n' +
                                '                                <div class="course_list_image">\n' +
                                '                                    <div class="list_item_enroll">\n' +
                                '                                        <div class="list_item_enroll_end">모집종료</div>\n' +
                                '                                        <div class="list_item_enroll_ing">모집중</div>\n' +
                                '                                        <div class="list_item_enroll_plan">모집예정</div>\n' +
                                '                                    </div>\n' +
                                '                                    <div class="list_item_state">\n' +
                                '                                        <div class="list_item_state_online">이러닝</div>\n' +
                                '                                        <div class="list_item_state_offline">집체</div>\n' +
                                '                                    </div>\n' +
                                '                                </div>\n' +
                                '                                <div class="course_list_desc">\n' +
                                '                                    <div class="list_item_category">-</div>\n' +
                                '                                    <div class="list_item_title"></div>\n' +
                                '                                    <div class="list_item_info_register_period"></div>' +
                                '                                    <div class="list_item_info_period"></div>\n' +
                                '                                    <div class="list_item_info_personnel"></div>\n' +
                                '                                </div>\n' +
                                '                            </div>')


                            var courseImageUrl = Lia.p(courseItem, 'course_image_url');
                            courseImageUrl = Lia.p(courseImageUrl, 0, 'url')

                            if ( String.isBlank(courseImageUrl) ) {
                                courseImageUrl = '/res/home/img/stop/common/img_none.png'
                            } else {
                                courseImageUrl = PathHelper.getFileUrl(courseImageUrl);
                            }

                            jCourseCardItem.find('.card_item_img').css('background-image', 'url(' + courseImageUrl + ')')
                            jCourseListItem.find('.course_list_image').css('background-image', 'url(' + courseImageUrl + ')')

                            jCourseCardItem.find('.card_item_title').text(Lia.p(courseItem, 'service_title'));
                            jCourseListItem.find('.list_item_title').text(Lia.p(courseItem, 'service_title'));
                            //Lia.formatDateWithSeparator()


                            if(Lia.p(courseItem , 'term_type_code') == '1') {
                                jCourseCardItem.find('.card_item_info_register_period').html('<span style="color:#7147a9;">신청기간 :</span> ' + '상시');
                                jCourseListItem.find('.list_item_info_register_period').html('<span style="color:#7147a9;">신청기간 :</span> ' + '상시');

                                jCourseCardItem.find('.card_item_info_period').html('<span style="color:#7147a9;">교육기간 :</span> ' + Lia.p(courseItem , 'study_days') + '일');
                                jCourseListItem.find('.list_item_info_period').html('<span style="color:#7147a9;">교육기간 :</span> ' + Lia.p(courseItem , 'study_days') + '일');
                            } else {
                                jCourseCardItem.find('.card_item_info_register_period').html('<span style="color:#7147a9;">신청기간 :</span> ' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'registration_start_date'), '.') + '~' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'registration_end_date'), '.'));
                                jCourseListItem.find('.list_item_info_register_period').html('<span style="color:#7147a9;">신청기간 :</span> ' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'registration_start_date'), '.') + '~' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'registration_end_date'), '.'));

                                jCourseCardItem.find('.card_item_info_period').html('<span style="color:#7147a9;">교육기간 :</span> ' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'start_date'), '.') + '~' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00',courseItem, 'end_date'), '.'));
                                jCourseListItem.find('.list_item_info_period').html('<span style="color:#7147a9;">교육기간 :</span> ' +Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'start_date'), '.') + '~' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00',courseItem, 'end_date'), '.'));
                            }





                            // jCourseCardItem.find('.card_item_info_personnel').text('총 ' + (Lia.p(courseItem, 'max_student_count') == undefined ? '- ' :  Lia.p(courseItem, 'max_student_count')) + '명');
                            // jCourseListItem.find('.list_item_info_personnel').text('총 ' + (Lia.p(courseItem, 'max_student_count') == undefined ? '- ' :  Lia.p(courseItem, 'max_student_count')) + '명');

                            var maxStudentPropCount = Lia.pcd( Lia.p(courseItem, 'max_student_count'), courseItem,'properties','max_student_count');
                            var maxStudentCount = Lia.p(courseItem, 'max_student_count');
                            var studentCount = Lia.pd('-',courseItem, 'student_count');
                            if(maxStudentCount == undefined) { //  인원제한이 없는 경우
                                jCourseCardItem.find('.card_item_info_personnel').html('<span style="color:#7147a9;">인원 제한 없음</span>');
                                jCourseListItem.find('.list_item_info_personnel').html('<span style="color:#7147a9;">인원 제한 없음</span>');
                            } else {
                                if(studentCount >= maxStudentCount) {
                                    jCourseCardItem.find('.card_item_info_personnel').html('<span style="color:#7147a9;">(정원)' + maxStudentPropCount + '명</span> / <span style="color: red">' + studentCount + '명</span>');
                                    jCourseListItem.find('.list_item_info_personnel').html('<span style="color:#7147a9;">(정원)' + maxStudentPropCount + '명</span> / <span style="color: red">' + studentCount + '명</span>');
                                } else {
                                    jCourseCardItem.find('.card_item_info_personnel').html('<span style="color:#7147a9;">(정원)' + maxStudentPropCount + '명</span> / ' + studentCount + '명');
                                    jCourseListItem.find('.list_item_info_personnel').html('<span style="color:#7147a9;">(정원)' + maxStudentPropCount + '명</span> / ' + studentCount + '명');
                                }
                            }





                            jCourseCardItem.attr('course_id', Lia.p(courseItem, 'id'))
                            jCourseListItem.attr('course_id', Lia.p(courseItem, 'id'))

                            // 과정분야
                            var attributeList = Lia.p(courseItem, 'attribute_list');

                            if(attributeList != undefined && attributeList != [] && String.isNotBlank(attributeList)) {

                                var categoryTextList = [];
                                var str = '';
                                var depth2items = ''
                                var isCompletion = false;

                                for(var idx in attributeList) {
                                    var attributeItem = attributeList[idx];

                                    var attributeId = Lia.p(attributeItem, 'attribute_id');
                                    var categoryCode = Lia.p(attributeItem, 'attribute_category_code');
                                    var categoryName = Lia.p(attributeItem, 'attribute_name');
                                    var depth = Lia.p(attributeItem, 'attribute_depth');

                                    if(categoryCode == '과정분야') {
                                        if(categoryName == '양성교육') {
                                            str += categoryName;
                                            continue;
                                        } else {
                                            isCompletion = true;
                                            categoryTextList.push(categoryName);

                                            if(depth == 2) {
                                                depth2items = categoryName;
                                            }

                                        }
                                    }
                                }

                                if(isCompletion) {
                                    if(String.isNotBlank(depth2items))
                                        str += categoryTextList.shift() + ' : ' + categoryTextList.join(', ');
                                    else
                                        str += categoryTextList.shift();
                                }

                                jCourseCardItem.find('.card_item_category').text(str);
                                jCourseListItem.find('.list_item_category').text(str);
                            }




                            //learningMethod //online-offline
                            var learningMethod = Lia.p(courseItem, 'learning_method_code');
                            if (learningMethod == CourseLearningMethod.ONLINE) {
                                jCourseCardItem.find('.card_item_state_online').css('display', 'block');
                                jCourseListItem.find('.list_item_state_online').css('display', 'block');
                            } else if(learningMethod == CourseLearningMethod.BLENDED_LEARNING) {
                                jCourseCardItem.find('.card_item_state_online').css('display', 'block');
                                jCourseListItem.find('.list_item_state_online').css('display', 'block');
                                jCourseCardItem.find('.card_item_state_offline').css('display', 'none');
                                jCourseListItem.find('.list_item_state_offline').css('display', 'none');

                                jCourseListItem.find('.card_item_state_online').text('블렌디드 러닝');
                                jCourseCardItem.find('.card_item_state_online').text('블렌디드 러닝');
                            } else if(learningMethod == CourseLearningMethod.FLIPPED_LEARNING) {
                                jCourseCardItem.find('.card_item_state_online').css('display', 'block');
                                jCourseListItem.find('.list_item_state_online').css('display', 'block');
                                jCourseCardItem.find('.card_item_state_offline').css('display', 'none');
                                jCourseListItem.find('.list_item_state_offline').css('display', 'none');

                                jCourseCardItem.find('.card_item_state_online').text('화상');
                                jCourseListItem.find('.card_item_state_online').text('화상');
                            } else if (learningMethod == CourseLearningMethod.OFFLINE) {
                                jCourseCardItem.find('.card_item_state_online').css('display', 'none');
                                jCourseListItem.find('.list_item_state_online').css('display', 'none');
                                jCourseCardItem.find('.card_item_state_offline').css('display', 'block');
                                jCourseListItem.find('.list_item_state_offline').css('display', 'block');
                            } else {
                                jCourseCardItem.find('.card_item_state_online').text('-');
                                jCourseItem.find('.list_item_state_online').text('-');
                            }


                            //모집중 모집예정 모집마감
                            switch (Lia.p(courseItem,'absolute_status_code')) {
                                case CourseStatus.WAITING: {
                                    jCourseCardItem.find('.card_item_enroll .card_item_enroll_plan').addClass('active')
                                    jCourseListItem.find('.list_item_enroll .list_item_enroll_plan').addClass('active')
                                }
                                    break;

                                case CourseStatus.REGISTERING: {
                                    jCourseCardItem.find('.card_item_enroll .card_item_enroll_ing').addClass('active');
                                    jCourseListItem.find('.list_item_enroll .list_item_enroll_ing').addClass('active');
                                }
                                    break;

                                // case CourseStatus.PENDING: {
                                //     jCourseCardItem.find('.card_item_enroll .card_item_enroll_plan').addClass('active');
                                //     jCourseListItem.find('.list_item_enroll .list_item_enroll_plan').addClass('active');
                                //
                                //     jCourseCardItem.find('.card_item_enroll .card_item_enroll_plan').text('모집마감');
                                //     jCourseListItem.find('.list_item_enroll .list_item_enroll_plan').text('모집마감');
                                // }
                                //     break;

                                case CourseStatus.PENDING:
                                case CourseStatus.OPERATING:
                                case CourseStatus.MARK_REVIEWING:
                                case CourseStatus.REVIEWING:
                                case CourseStatus.FINISHED: {
                                    jCourseCardItem.find('.card_item_enroll .card_item_enroll_end').addClass('active')
                                    jCourseListItem.find('.list_item_enroll .list_item_enroll_end').addClass('active')
                                }
                                    break;
                                default: {

                                }
                            }

                            // if(Lia.p(courseItem,'status_code') == CourseStatus.WAITING) {
                            //     jCourseCardItem.find('.card_item_enroll .card_item_enroll_plan').addClass('active')
                            //     jCourseListItem.find('.list_item_enroll .list_item_enroll_plan').addClass('active')
                            // } else if(Lia.p(courseItem,'status_code') == CourseStatus.REGISTERING) {
                            //     jCourseCardItem.find('.card_item_enroll .card_item_enroll_ing').addClass('active')
                            //     jCourseListItem.find('.list_item_enroll .list_item_enroll_ing').addClass('active')
                            // } else {
                            //     jCourseCardItem.find('.card_item_enroll .card_item_enroll_end').addClass('active')
                            //     jCourseListItem.find('.list_item_enroll .list_item_enroll_end').addClass('active')
                            // }





                            jCourseCardItem.on('click', function (e) {
                                var jThis = $(this);
                                PageManager.go(['course_detail'], {
                                    course_id: jThis.attr('course_id')
                                });
                            })
                            jCourseListItem.on('click', function () {
                                var jThis = $(this);
                                PageManager.go(['course_detail'], {
                                    course_id: jThis.attr('course_id')
                                })
                            })


                            //상시제일때는 모집중에만 표시
                            jCourseList.append(jCourseCardItem);
                            jCourseList.append(jCourseListItem);

                            //리스트뷰 선택하고 화면 줄였다가 다시 원상복귀 시
                            if(PageManager.pc('listv')) {
                                page.find('.listv').css('display' , 'block')
                                page.find('.home_card_item').css('display' , 'none')
                            } else {
                                page.find('.listv').css('display' , 'none')
                                page.find('.home_card_item').css('display' , 'inline-block')
                            }
                        }
                    }
                })
        },

        //카테고리
        //과정분야
        loadCourseSideBarWithAPI : function() {
            var page = this;

            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST,{

            },function(status, data) {
                var list = Lia.p(data, 'body' , 'list');
                var categoryCareerMap = {};
                var categoryFieldMap = {};
                var categoryPositionMap = {};
                var categoryDeptMap = {};

                var attrMap = {};

                var jCourseWrapperCareer = $('.course_sidebar_wrapper.career').find('.course_sidebar_list').empty();
                var jCourseWrapperPosition = $('.course_sidebar_wrapper.position').find('.course_sidebar_list').empty();
                var jCourseWrapperField = $('.course_sidebar_wrapper.field').find('.course_sidebar_list').empty();
                var jCourseWrapperDept = $('.course_sidebar_list.courseAttr').empty();

                var CourseCareerLength =0, CoursePositionLength =0, CourseFieldLength = 0;


                // jCourseWrapperCareer.append('<div class="course_sidebar_list_depth1">\n' +
                //     '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth" value="all" data-val="all" checked><span class="title">전체</span><span class="checkmark"></span></label>\n' +
                //     '                        </div>');
                // jCourseWrapperField.append('<div class="course_sidebar_list_depth1">\n' +
                //     '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth" value="all" data-val="all" checked><span class="title">전체</span><span class="checkmark"></span></label>\n' +
                //     '                        </div>');
                // jCourseWrapperPosition.append('<div class="course_sidebar_list_depth1">\n' +
                //     '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth" value="all" data-val="all" checked><span class="title">전체</span><span class="checkmark"></span></label>\n' +
                //     '                        </div>')

                for(var i in list) {
                    var item = list[i];
                    var itemCateCode = Lia.p(item, 'category_code');
                    var depth = Lia.p(item, 'depth');
                    var parentId = Lia.p(item, 'parent_id');

                    switch (itemCateCode) {
                        case '소속기관': {

                            CourseFieldLength++;
                            if(depth == 1) {
                                var jItem = $('<div class="course_sidebar_list_depth1">\n' +
                                    '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth1" value="depth1_1" data-val=""><span class="title"></span><span class="checkmark"></span></label>\n' +
                                    '                        </div>')
                                jItem.find('.title').text(Lia.p(item, 'name'))
                                //체크박스 value설정
                                attrMap[Lia.p(item, 'name')] = Lia.p(item, 'id');
                                jItem.find('input').attr('value', Lia.p(item, 'name'));
                                jItem.find('input').attr('data-val', Lia.p(item, 'id'));
                                jItem.attr('data-val' , Lia.p(item, 'id'))

                                jCourseWrapperField.append(jItem);
                            }
                            // else {
                            //     //depth2
                            //     var jDepth2Wrapper = page.find('div[data-val='+ parentId +']');
                            //     var jDepth2List;
                            //
                            //     if(jDepth2Wrapper.find('.course_sidebar_list_depth2').length == 0) {
                            //         jDepth2Wrapper.append('<div class="course_sidebar_list_depth2"></div>');
                            //         jDepth2List = jDepth2Wrapper.find('.course_sidebar_list_depth2');
                            //         jDepth2List.attr('value' , 'sub-all');
                            //     } else {
                            //         jDepth2List = jDepth2Wrapper.find('.course_sidebar_list_depth2');
                            //     }
                            //
                            //     var jItem = $('<label class="course_sidebar_depth2"><input type="checkbox" name="depth2" value="depth1_2_1" data-val=""  ><span class="title"></span><span class="checkmark"></span></label>');
                            //     attrMap[Lia.p(item, 'name')] = Lia.p(item, 'id');
                            //     jItem.find('.title').text(Lia.p(item, 'name'));
                            //     jItem.find('input').attr('value' , Lia.p(item, 'name'));
                            //     jItem.find('input').attr('data-val' , Lia.p(item, 'id'));
                            //     jItem.find('input').attr('parent-id' , parentId);
                            //
                            //     //for tooltip
                            //     jItem.attr('title' , Lia.p(item, 'name'));
                            //
                            //     jDepth2List.append(jItem);
                            // }
                        } break;
                        case '직위': {
                            CoursePositionLength++;
                            var jItem = $('<div class="course_sidebar_list_depth1">\n' +
                                '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth1" value="depth1_1" data-val=""><span class="title"></span><span class="checkmark"></span></label>\n' +
                                '                        </div>')
                            jItem.find('.title').text(Lia.p(item, 'name'))

                            attrMap[Lia.p(item,'name')] = Lia.p(item,'id');
                            jItem.find('input').attr('value' , Lia.p(item, 'name'));
                            jItem.find('input').attr('data-val' , Lia.p(item, 'id'));
                            jCourseWrapperPosition.append(jItem);
                        } break;
                        case '경력': {
                            CourseCareerLength++;
                            var jItem = $('<div class="course_sidebar_list_depth1">\n' +
                                '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth1" value="depth1_1" data-val=""><span class="title"></span><span class="checkmark"></span></label>\n' +
                                '                        </div>')
                            jItem.find('.title').text(Lia.p(item, 'name'))

                            attrMap[Lia.p(item,'name')] = Lia.p(item,'id');
                            jItem.find('input').attr('value' , Lia.p(item, 'name'));
                            jItem.find('input').attr('data-val' , Lia.p(item, 'id'));
                            jCourseWrapperCareer.append(jItem);
                        } break;
                        case '과정분야' : {
                            if(depth == 1) {
                                var jItem = $('<div class="course_sidebar_list_depth1">\n' +
                                    '                            <label class="course_sidebar_depth1"><input type="checkbox" name="depth1" value="depth1_1" data-val=""><span class="title"></span><span class="checkmark"></span></label>\n' +
                                    '                        </div>')
                                jItem.find('.title').text(Lia.p(item, 'name'))
                                //체크박스 value설정
                                attrMap[Lia.p(item, 'name')] = Lia.p(item, 'id');
                                jItem.find('input').attr('value', Lia.p(item, 'name'));
                                jItem.find('input').attr('data-val', Lia.p(item, 'id'));
                                jItem.attr('data-val' , Lia.p(item, 'id'))
                                jCourseWrapperDept.append(jItem);
                            } else {
                                //depth2
                                var jDepth2Wrapper = page.find('div[data-val='+ parentId +']');
                                var jDepth2List;

                                if(jDepth2Wrapper.find('.course_sidebar_list_depth2').length == 0) {
                                    jDepth2Wrapper.append('<div class="course_sidebar_list_depth2"></div>');
                                    jDepth2List = jDepth2Wrapper.find('.course_sidebar_list_depth2');
                                    jDepth2List.attr('value' , 'sub-all');
                                } else {
                                    jDepth2List = jDepth2Wrapper.find('.course_sidebar_list_depth2');
                                }

                                var jItem = $('<label class="course_sidebar_depth2"><input type="checkbox" name="depth2" value="depth1_2_1" data-val="" ><span class="title"></span><span class="checkmark"></span></label>');
                                attrMap[Lia.p(item, 'name')] = Lia.p(item, 'id');
                                jItem.find('.title').text(Lia.p(item, 'name'));
                                jItem.find('input').attr('value' , Lia.p(item, 'name'));
                                jItem.find('input').attr('data-val' , Lia.p(item, 'id'));
                                jItem.find('input').attr('parent-id' , parentId);

                                jDepth2List.append(jItem);
                            }
                            break;
                        }

                    }
                }
                
                //과정분야
                {
                    var jCheckBox = page.find('.course_sidebar_wrapper.attr input');

                    jCheckBox.on('click', {
                        jCheckBox: jCheckBox
                    }, function (e) {

                        var jThis = $(this);
                        var checked = jThis.prop('checked');

                        jThis.prop('checked' , checked);

                        var jCheckBox = e.data.jCheckBox;

                        //보수교육과 같은 subAll 눌렀을 때.
                        if(jThis.parent().parent().find('.course_sidebar_list_depth2').length > 0) {
                            var subCheckList = jThis.parent().parent().find('.course_sidebar_list_depth2 input');
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                item.prop('checked' , checked);
                            }
                        }


                        //Depth2 CheckBox 클릭 시
                        var subAllChecked = true;
                        if(jThis.attr('name') == 'depth2') {
                            var subCheckList = $(jThis.parent().parent().find('input'));
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                if(!item.prop('checked')) {
                                    subAllChecked = false;
                                }
                            }

                            if (subAllChecked) {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , true)
                                //$(jThis.parent().parent().find('input').prop('checked' , false));
                            } else {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , false)
                            }
                        }

                        var careerCodeListString = '';

                        {
                            var careerCodeList = [];

                            for (var i = 0, l = jCheckBox.length; i < l; i++) {
                                var key = ''
                                if (jCheckBox.eq(i).prop('checked')) {
                                    var checkedVal = jCheckBox.eq(i).attr('value')
                                    careerCodeList.push(attrMap[checkedVal]);
                                }
                            }
                            careerCodeListString = careerCodeList.join(',');
                        }
                        PageManager.cpcpm({
                            'attribute_code_list': careerCodeListString
                        });
                    });
                }

                //career
                {
                    var jCheckBox = page.find('.course_sidebar_wrapper.career input');

                    jCheckBox.on('click', {
                        jCheckBox: jCheckBox
                    }, function (e) {

                        var jThis = $(this);
                        var checked = jThis.prop('checked');

                        jThis.prop('checked' , checked);

                        var jCheckBox = e.data.jCheckBox;

                        //보수교육과 같은 subAll 눌렀을 때.
                        if(jThis.parent().parent().find('.course_sidebar_list_depth2').length > 0) {
                            var subCheckList = jThis.parent().parent().find('.course_sidebar_list_depth2 input');
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                item.prop('checked' , checked);
                            }
                        }


                        //Depth2 CheckBox 클릭 시
                        var subAllChecked = true;
                        if(jThis.attr('name') == 'depth2') {
                            var subCheckList = $(jThis.parent().parent().find('input'));
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                if(!item.prop('checked')) {
                                    subAllChecked = false;
                                }
                            }

                            if (subAllChecked) {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , true)
                                //$(jThis.parent().parent().find('input').prop('checked' , false));
                            } else {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , false)
                            }
                        }

                        var careerCodeListString = '';

                        {
                            var careerCodeList = [];

                            for (var i = 0, l = jCheckBox.length; i < l; i++) {
                                var key = ''
                                if (jCheckBox.eq(i).prop('checked')) {
                                    var checkedVal = jCheckBox.eq(i).attr('value')
                                    careerCodeList.push(attrMap[checkedVal]);
                                }
                            }
                            careerCodeListString = careerCodeList.join(',');
                        }
                        PageManager.cpcpm({
                            'career_code_list': careerCodeListString
                        });
                    });
                }

                //position
                {
                    var jCheckBox = page.find('.course_sidebar_wrapper.position input');

                    jCheckBox.on('click', {
                        jCheckBox: jCheckBox
                    }, function (e) {

                        var jThis = $(this);
                        var checked = jThis.prop('checked');

                        jThis.prop('checked' , checked);

                        var jCheckBox = e.data.jCheckBox;

                        //보수교육과 같은 subAll 눌렀을 때.
                        if(jThis.parent().parent().find('.course_sidebar_list_depth2').length > 0) {
                            var subCheckList = jThis.parent().parent().find('.course_sidebar_list_depth2 input');
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                item.prop('checked' , checked);
                            }
                        }


                        //Depth2 CheckBox 클릭 시
                        var subAllChecked = true;
                        if(jThis.attr('name') == 'depth2') {
                            var subCheckList = $(jThis.parent().parent().find('input'));
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                if(!item.prop('checked')) {
                                    subAllChecked = false;
                                }
                            }

                            if (subAllChecked) {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , true)
                                //$(jThis.parent().parent().find('input').prop('checked' , false));
                            } else {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , false)
                            }
                        }

                        var careerCodeListString = '';

                        {
                            var careerCodeList = [];

                            for (var i = 0, l = jCheckBox.length; i < l; i++) {
                                var key = ''
                                if (jCheckBox.eq(i).prop('checked')) {
                                    var checkedVal = jCheckBox.eq(i).attr('value')
                                    careerCodeList.push(attrMap[checkedVal]);
                                }
                            }
                            careerCodeListString = careerCodeList.join(',');
                        }
                        PageManager.cpcpm({
                            'position_code_list': careerCodeListString
                        });
                    });
                }

                //field
                {
                    var jCheckBox = page.find('.course_sidebar_wrapper.field input');

                    jCheckBox.on('click', {
                        jCheckBox: jCheckBox
                    }, function (e) {

                        var jThis = $(this);
                        var checked = jThis.prop('checked');

                        jThis.prop('checked' , checked);

                        var jCheckBox = e.data.jCheckBox;

                        //보수교육과 같은 subAll 눌렀을 때.
                        if(jThis.parent().parent().find('.course_sidebar_list_depth2').length > 0) {
                            var subCheckList = jThis.parent().parent().find('.course_sidebar_list_depth2 input');
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                item.prop('checked' , checked);
                            }
                        }


                        //Depth2 CheckBox 클릭 시
                        var subAllChecked = true;
                        if(jThis.attr('name') == 'depth2') {
                            var subCheckList = $(jThis.parent().parent().find('input'));
                            for(var j = 0; j<subCheckList.length; j++) {
                                var item = $(subCheckList[j]);
                                if(!item.prop('checked')) {
                                    subAllChecked = false;
                                }
                            }

                            if (subAllChecked) {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , true)
                                //$(jThis.parent().parent().find('input').prop('checked' , false));
                            } else {
                                $(jThis.parent().parent().prev().find('input')).prop('checked' , false)
                            }
                        }

                        var careerCodeListString = '';

                        {
                            var careerCodeList = [];

                            for (var i = 0, l = jCheckBox.length; i < l; i++) {
                                var key = ''
                                if (jCheckBox.eq(i).prop('checked')) {
                                    var checkedVal = jCheckBox.eq(i).attr('value')
                                    careerCodeList.push(attrMap[checkedVal]);
                                }
                            }
                            careerCodeListString = careerCodeList.join(',');
                        }
                        PageManager.cpcpm({
                            'field_code_list': careerCodeListString
                        });
                    });
                }
            })
        },
        //모집상태(모집예정, 모집중, 모집종료)
        loadCourseSideBar_status : function() {
            var page = this;

            var jCheckBox = page.find('.course_sidebar_list_status input');
            jCheckBox.on('click', {
                jCheckBox : jCheckBox
            }, function(e) {

                var jThis = $(this);
                var checked = jThis.prop('checked');

                jThis.prop('checked' , checked)


                var jCheckBox = e.data.jCheckBox;
                var statusCodeListString = '';
                {
                    var statusCodeList = [];

                    for ( var i = 0, l = jCheckBox.length; i < l; i++ ) {

                        var c = jCheckBox.eq(i).prop('checked');

                        if ( c ) {

                            if ( i == 0 ) {
                                statusCodeList.push(CourseStatus.WAITING);
                            } else if ( i == 1 ) {
                                statusCodeList.push( CourseStatus.REGISTERING);
                            } else {
                                statusCodeList.push( CourseStatus.PENDING);
                                statusCodeList.push( CourseStatus.REVIEWING);
                                statusCodeList.push( CourseStatus.FINISHED);
                                statusCodeList.push( CourseStatus.OPERATING);
                                statusCodeList.push( CourseStatus.MARK_REVIEWING);
                            }
                        }
                    }
                    statusCodeListString = statusCodeList.join(',');
                }
                PageManager.cpcpm({
                    status_code_list : statusCodeListString
                });
            });
        },
        //교육방법(온/오프라인)
        loadCourseSideBar_isOnline : function() {
            var page = this;

            var jCheckBox = page.find('.course_sidebar_list_online input');
            jCheckBox.on('click', {
                jCheckBox : jCheckBox
            }, function(e) {

                var jThis = $(this);
                var checked = jThis.prop('checked');

                jThis.prop('checked' , checked);

                var jCheckBox = e.data.jCheckBox;
                var isOnlineCodeListString = '';

                {
                    var isOnlineCodeList = [];

                    for ( var i = 0, l = jCheckBox.length; i < l; i++ ) {

                        var c = jCheckBox.eq(i).prop('checked');
                        if ( c == true) {

                            if ( i == 2 ) {
                                isOnlineCodeList.push( CourseLearningMethod.ONLINE);
                            } else if ( i == 3 ) {
                                isOnlineCodeList.push( CourseLearningMethod.BLENDED_LEARNING);

                            } else if(i==0) {
                                isOnlineCodeList.push( CourseLearningMethod.FLIPPED_LEARNING);
                            } else {
                                isOnlineCodeList.push( CourseLearningMethod.OFFLINE);
                            }
                        }
                    }
                    isOnlineCodeListString = isOnlineCodeList.join(',');
                }
                PageManager.cpcpm({
                    isonline_code_list : isOnlineCodeListString
                });
            });
            // page.loadingSidebar_learningMethod_onChange()
        },


        //onChange, 페이지 이동 시 쿼리 보존===========================
        // 온/오프라인
        loadingSidebar_learningMethod_onChange : function() {
            var page = this;
            var checkedItems = PageManager.pc('isonline_code_list');
            var jCareerCheckBox = page.find('.course_sidebar_list_online input');


            if(checkedItems != null) {
                checkedItems = checkedItems.split(',')

                for(var idx in checkedItems) {
                    checkIdx = Number(checkedItems[idx]);
                    if(checkIdx == CourseLearningMethod.ONLINE) {
                        jCareerCheckBox.eq(2).prop('checked' , true)
                    } else if(checkIdx == CourseLearningMethod.OFFLINE) {
                        jCareerCheckBox.eq(1).prop('checked' , true)
                    } else if(checkIdx == CourseLearningMethod.BLENDED_LEARNING) {
                        jCareerCheckBox.eq(3).prop('checked' , true)
                    } else {
                        jCareerCheckBox.eq(0).prop('checked' , true)
                    }

                }
            } else {
                for(var i=0; i<jCareerCheckBox.length; i++) {
                    jCareerCheckBox.eq(i).prop('checked', false);
                }
                return;
            }
        },

        //모집중 모집종료 등
        loadingSidebar_status_onChange : function() {
            var page = this;
            var checkedItems = PageManager.pc('status_code_list');
            var jCareerCheckBox = page.find('.course_sidebar_list_status input');


            if(checkedItems != null) {
                checkedItems = checkedItems.split(',')

                for(var idx in checkedItems) {
                    checkIdx = Number(checkedItems[idx]);

                    if(checkIdx == 1) {
                        jCareerCheckBox.eq(0).prop('checked' , true)
                    } else if(checkIdx == 2) {
                        jCareerCheckBox.eq(1).prop('checked' , true)
                    } else  {
                        jCareerCheckBox.eq(2).prop('checked' , true)
                    }

                }
            } else {
                for(var i=0; i<jCareerCheckBox.length; i++) {
                    jCareerCheckBox.eq(i).prop('checked', false);
                }
                return;
            }
        },

        //나머지 카테고리
        loadingSidebar_onChange : function() {
            var page = this;

            var attrCheckedItems = PageManager.pc('attribute_code_list');
            var positionCheckItems = PageManager.pc('position_code_list');
            var fieldCheckItems = PageManager.pc('field_code_list');
            var careerCheckItems = PageManager.pc('career_code_list');

            var attrCheckedItemsArray = [];
            var positionCheckItemsArray = [];
            var fieldCheckItemsArray = [];
            var careerCheckItemsArray = [];

            var totalCheckItems = [];

            if(String.isNotBlank(attrCheckedItems)) {
                attrCheckedItemsArray = attrCheckedItems.split(',');
            }

            if(String.isNotBlank(positionCheckItems)) {
                positionCheckItemsArray = positionCheckItems.split(',');
            }

            if(String.isNotBlank(fieldCheckItems)) {
                fieldCheckItemsArray = fieldCheckItems.split(',');
            }
            if(String.isNotBlank(careerCheckItems)) {
                careerCheckItemsArray = careerCheckItems.split(',');
            }

            totalCheckItems = totalCheckItems.concat(attrCheckedItemsArray, positionCheckItemsArray, fieldCheckItemsArray, careerCheckItemsArray);

            var jCareerCheckBox = page.find('.course_sidebar_wrapper input');


            if(Array.isNotEmpty(totalCheckItems)) {

                for(var idx in totalCheckItems) {

                    checkIdx = totalCheckItems[idx];

                    $('.course_sidebar input[data-val='+ checkIdx +']').prop('checked' , true);
                }

            } else {

                for(var i=0; i<jCareerCheckBox.length; i++) {

                    jCareerCheckBox.eq(i).prop('checked', false);
                }

                return;
            }
        },

        //검색창
        loadingSearch_onChange : function() {
            var searchOptionString = PageManager.pc('searchOptionString');
            if(searchOptionString!=null) {
                $('.course_search_input').val(searchOptionString)
            }
        },

        //헤더 (연도, 최신순 등)
        loadingHeader_onChange : function () {
            //로딩 시 년도

            var termId = PageManager.pc('term_id');
            var year = PageManager.pc('searchYear');
            var yearOption = page.find('.course_main_nav_combo option');

            if(termId != undefined) {
                for (var i = 0; i < yearOption.length; i++) {
                    var item = $(yearOption[i]);
                    if (item.val() == termId) {
                        item.prop('selected', 'true');
                        break;
                    }
                }
                return;
            }
            if(year != null) {
                for (var i = 0; i < yearOption.length; i++) {
                    var item = $(yearOption[i]);
                    if (item.val() == year) {
                        item.prop('selected', 'true');
                        break;
                    }
                }
            } else {
                $(yearOption[0]).prop('selected' , true);
            }

            //로딩 시 최신,인기,빠른마감
            var orderBy = Number(PageManager.pc('orderByCode'));
            var orderByMap = {
                5 : 'new',
                8 : 'hot',
                14: 'fast'
            }
            var itemVal = orderByMap[orderBy];
            var orderList = page.find('.course_main_nav_info_ul').children();

            if(!isNaN(orderBy)) {
                for (var i = 0; i < orderList.length; i++) {
                    var item = $(orderList[i]);
                    if (item.attr('value') == itemVal) {
                        item.addClass('filter_click')
                        break;
                    }
                }
            } else {
                page.find('.course_main_nav_info_ul li').removeClass('filter_click');
            }
        },

        //태그 만들기
        makingTag : function() {

            var attrCheckedItems = PageManager.pc('attribute_code_list');
            var positionCheckItems = PageManager.pc('position_code_list');
            var fieldCheckItems = PageManager.pc('field_code_list');
            var careerCheckItems = PageManager.pc('career_code_list');

            var totalCheckedItems = '';

            if(String.isNotBlank(attrCheckedItems)) {

                if(String.isNotBlank(totalCheckedItems)) {

                    totalCheckedItems = totalCheckedItems + ',' + attrCheckedItems;
                } else {
                    totalCheckedItems = attrCheckedItems;
                }
            }

            if(String.isNotBlank(positionCheckItems)) {

                if(String.isNotBlank(totalCheckedItems)) {

                    totalCheckedItems = totalCheckedItems + ',' + positionCheckItems;
                } else {
                    totalCheckedItems = positionCheckItems;
                }
            }

            if(String.isNotBlank(fieldCheckItems)) {

                if(String.isNotBlank(totalCheckedItems)) {

                    totalCheckedItems = totalCheckedItems + ',' + fieldCheckItems;
                } else {
                    totalCheckedItems = fieldCheckItems;
                }
            }

            if(String.isNotBlank(careerCheckItems)) {

                if(String.isNotBlank(totalCheckedItems)) {

                    totalCheckedItems = totalCheckedItems + ',' + careerCheckItems;
                } else {
                    totalCheckedItems = careerCheckItems;
                }
            }

            var isOnlineCheckedItems = PageManager.pc('isonline_code_list');
            var statusCheckedItems = PageManager.pc('status_code_list');
            var orderByCode = PageManager.pc('orderByCode');

            // var searchYear = PageManager.pc('searchYear');
            // var termTypeCode = PageManager.pc('term_type_code');
            var termId = PageManager.pc('term_id');

            var targetMap = {};
            var statusMap = {
                1 : '모집예정',
                2 : '모집중',
                3 : '모집종료',
                6 : '모집종료',
                4 : '모집종료',
                5 : '모집종료',
            };
            var learningMap = {
                1 : '이러닝',
                4 : '집체',
                2 : "블렌디드 러닝",
                3 : "화상",
            };
            var orderByCodeMap = {
                5 : '최신순',
                8 : '인기순',
                14 : '빠른마감순'
            }
            var termMap = {}

            var tagListPc = page.find('.course_main_nav_taglist').empty();
            var tagListTm = page.find('.course_main_nav_tm_taglist').empty();


            //연도 및 정렬순 추가
            if(totalCheckedItems != null || isOnlineCheckedItems != null || statusCheckedItems != null || orderByCode != null || termId != null) {

                var initBtn = $('<div class="course_main_nav_taglist_tag initialize">초기화</div>');
                var initBtnTm = $('<div class="course_main_nav_tm_taglist_tag initialize">초기화</div>');

                initBtn.on('click', function (e) {
                    PageManager.go(['courses'], {menu_id: MenuId.COURSE});
                })

                initBtnTm.on('click', function (e) {
                    PageManager.go(['courses'], {menu_id: MenuId.COURSE});
                })

                page.find('.course_main_nav_taglist').append(initBtn)
                page.find('.course_main_nav_tm_taglist').append(initBtnTm);
            }


            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST , {

            }, function (status, data) {
                var list = Lia.p(data, 'body' , 'list');
                for (idx in list) {
                    var item = list[idx];
                    targetMap[item.id] = item.name;
                }
            });
            Requester.awb(ApiUrl.Learning.GET_AVAILABLE_SIMPLE_TERM_LIST , {} , function (status, data) {
                var list = Lia.p (data, 'body' , 'list');
                // console.log(list)
                for(var i in list) {
                    var item = Lia.p(list , i);
                    termMap[Lia.p(item , 'id')] = Lia.p(item, 'year') == undefined ? Lia.p(item ,'name') : Lia.p(item, 'year')
                }
            })

            Requester.func(function() {
                tagCreateStatic(isOnlineCheckedItems , learningMap);
                tagCreateStatic(statusCheckedItems , statusMap);
                tagCreateOrder(orderByCode, orderByCodeMap)
                // tagCreateYear(searchYear)
                tagCreateYear(termId , termMap);
                // tagCreate(fieldCheckedItems , targetMap);
                // tagCreate(positionCheckedItems , targetMap);
                // tagCreate(careerCheckedItems , targetMap);
                tagCreate(totalCheckedItems , targetMap);

            })

            function tagCreate(checklist , paramMap) {

                if (String.isNotBlank(checklist)) {

                    checklist = checklist.split(',');

                    for (var idx in checklist) {
                        var tag = $('<div class="course_main_nav_taglist_tag"><span class="tagTitle"></span><img src="/res/home/img/stop/common/btn_cancel.png"></div>')
                        var tagTm = $('<div class="course_main_nav_tm_taglist_tag"><span class="tagTitle"></span><img src="/res/home/img/stop/common/mobile/btn_cancel.png"></div>')

                        checkIdx = Number(checklist[idx]);

                        tag.find('.tagTitle').text(paramMap[checkIdx]);
                        tagTm.find('.tagTitle').text(paramMap[checkIdx]);

                        tag.attr('data-val' , checkIdx);
                        tagTm.attr('data-val' , checkIdx);

                        page.find('.course_main_nav_taglist').append(tag);
                        page.find('.course_main_nav_tm_taglist').append(tagTm);
                    }
                } else {
                    //null일때

                }

                page.find('.course_main_nav_taglist_tag').not('.initialize').not('.order').not('.year').off().on('click' , function (e) {
                    var jThis = $(this);
                    $('.course_sidebar input[data-val='+ jThis.attr('data-val') +']').trigger('click');
                })
                page.find('.course_main_nav_tm_taglist_tag').not('.initialize').not('.order').not('.year').off().on('click' , function (e) {
                    var jThis = $(this);
                    $('.course_sidebar input[data-val='+ jThis.attr('data-val') +']').trigger('click');
                })
            }

            function tagCreateStatic(checklist , paramMap) {
                if (checklist != null) {
                    checklist = checklist.split(',');
                    //console.log('paramMap',paramMap)
                    for (var idx in checklist) {
                        var tag = $('<div class="course_main_nav_taglist_tag"><span class="tagTitle"></span><img src="/res/home/img/stop/common/btn_cancel.png"></div>')
                        var tagTm = $('<div class="course_main_nav_tm_taglist_tag"><span class="tagTitle"></span><img src="/res/home/img/stop/common/mobile/btn_cancel.png"></div>')

                        checkIdx = Number(checklist[idx]);

                        tag.find('.tagTitle').text(paramMap[checkIdx]);
                        tagTm.find('.tagTitle').text(paramMap[checkIdx]);

                        tag.attr('data-val' , paramMap[checkIdx]);
                        tagTm.attr('data-val' , paramMap[checkIdx]);

                        if(checkIdx == 2 && paramMap[checkIdx] == '블렌디드 러닝') {
                            tag.attr('data-val' , '블렌디드');
                            tagTm.attr('data-val' , '블렌디드');
                        }

                        if(paramMap == statusMap && checkIdx > 3 ) {
                            continue;
                        }

                        page.find('.course_main_nav_taglist').append(tag);
                        page.find('.course_main_nav_tm_taglist').append(tagTm);
                    }
                } else {
                    //null일때

                }
                page.find('.course_main_nav_taglist_tag').not('.initialize').not('.order').not('.year').off().on('click', function (e) {
                    var jThis = $(this);
                    if(jThis.attr('data-val') == '모집종료') {
                        var str = 'end'
                        $('.course_sidebar input[value=' + str + ']').click();
                    } else {
                        $('.course_sidebar input[data-val=' + jThis.attr('data-val') + ']').click();
                    }
                })

                page.find('.course_main_nav_tm_taglist_tag').not('.initialize').not('.order').not('.year').off().on('click' , function (e) {
                    var jThis = $(this);
                    if(jThis.attr('data-val') == '모집종료') {
                        var str = 'end'
                        $('.course_sidebar input[value=' + str + ']').click();
                    } else {
                        $('.course_sidebar input[data-val=' + jThis.attr('data-val') + ']').click();
                    }
                })
            }

            function tagCreateOrder(checklist , paramMap) {
                if(checklist != null) {
                    var tag = $('<div class="course_main_nav_taglist_tag order"><span class="tagTitle"></span><img src="/res/home/img/stop/common/btn_cancel.png"></div>');
                    var tagTm = $('<div class="course_main_nav_tm_taglist_tag order"><span class="tagTitle"></span><img src="/res/home/img/stop/common/mobile/btn_cancel.png"/></div>');

                    var checkIdx = Number(checklist)

                    var tagText = paramMap[checkIdx];

                    tag.find('.tagTitle').text(tagText);
                    tagTm.find('.tagTitle').text(tagText);

                    tag.val(checkIdx);
                    tagTm.val(checkIdx);

                    tag.on('click' , function(e) {
                        PageManager.cpcpm({orderByCode : ''});
                    })

                    tagTm.on('click' , function(e) {
                        PageManager.cpcpm({orderByCode : ''});
                    })

                    page.find('.course_main_nav_taglist').append(tag);
                    page.find('.course_main_nav_tm_taglist').append(tagTm)
                }
            }

            function tagCreateYear(checklist , paramMap) {
                if(checklist != null)
                {
                    var tag = $('<div class="course_main_nav_taglist_tag year"><span class="tagTitle"></span><img src="/res/home/img/stop/common/btn_cancel.png"></div>');
                    var tagTm = $('<div class="course_main_nav_tm_taglist_tag year"><span class="tagTitle"></span><img src="/res/home/img/stop/common/mobile/btn_cancel.png"></div>');

                    if(termId == 1) {
                        tag.find('.tagTitle').text('상시제');
                        tagTm.find('.tagTitle').text('상시제');

                        //when button clicked
                        tag.on('click' , function(e) {
                            PageManager.cpcpm({term_id : ''});
                        })

                        tagTm.on('click' , function(e) {
                            PageManager.cpcpm({term_id : ''});
                        })

                    } else {
                        var year = paramMap[termId];

                        tag.find('.tagTitle').text(year + '년');
                        tagTm.find('.tagTitle').text(year + '년');
                        //when button clicked
                        tag.on('click' , function(e) {
                            PageManager.cpcpm({term_id : ''});
                        })

                        tagTm.on('click' , function(e) {
                            PageManager.cpcpm({term_id : ''});
                        })
                    }




                    page.find('.course_main_nav_taglist').append(tag);
                    page.find('.course_main_nav_tm_taglist').append(tagTm);
                }
            }
        },
        //=============================================================
    };
})();
