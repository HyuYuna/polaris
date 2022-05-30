(function () {

    return {
        onInit: function (j) {
            var page = this;

            // 홈으로 왔을 때는 검색어가 안남게
            $('.nav_search_input').val('');

            page.loadBannerPopup();

            //메인배너 로딩
            page.loadingBanner();
            //퀵메뉴 라우팅.
            page.loadingQuickMenu();

            page.loadingMainCourses();

            page.loadingFooterBanner();

            page.loadNotice();

            page.loadFAQ();
        },



        onChange: function (j) {
            var page = this;

        },

        onRelease: function (j) {
        },

        onResize: function () {

        },


        loadBannerPopup: function () {

            Requester.awb(ApiUrl.Website.GET_AVAILABLE_BANNER_LIST, {
                serviceProviderId : Server.serviceProviderId,
                institutionId: 1,
                typeCode: BannerType.POPUP,
                isDeleted: 0,
                isAvailable: 1
            }, function (status, data) {
                if(!status) { return; }

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

                        popup = AjaxPopupManager.show(ProjectPopupUrl.BANNER_POPUP, {
                            item: item,
                            cookie: bannerPopupCookieName,
                            beforePopup: popup
                        });



                    }
                }

            });

        },

        loadNotice: function () {
            var page = this;
            var jNotice = page.find('.home_board_notice');
            jNotice.find('.home_board_header_more').on('click', function (e) {
                PageManager.go(['page'], { 'menu_id': 22 });
            });

            Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST , {
                boardIdList: 47,
                isAvailable: 1,
                isDeleted: 0,
                page: 1,
                includeBody: 1,
                parentBoardContentId: -1,
            }, function(status, data) {
                var list = Lia.p(data, 'body' , 'list');
                var count = Lia.p(data, 'body' , 'total_count');
                var jWrapper = page.find('.home_board_notice .home_board_content').empty();

                if(count == 0){
                    jWrapper.append('<div class="no_item">등록된 글이 없습니다.</div>')
                }else{
                    for(var idx in list) {
                        if(idx == 4) break;
                        var item = list[idx];
                        var jItem = $('<div class="home_board_content_list">\n' +
                            '                                <div class="home_board_content_title"></div>\n' +
                            '                                <div class="home_board_content_date"></div>\n' +
                            '                            </div>')


                        jItem.find('.home_board_content_title').text(Lia.p(item , 'title') == undefined ? '-'  : Lia.p(item , 'title'));
                        jItem.attr('value' , Lia.p(item , 'id'))

                        var date = Lia.p(item , 'registered_date') == undefined ? '-'  : Lia.p(item , 'registered_date')

                        date = date.split(' ');
                        date[0].replace('-' , '.')
                        jItem.find('.home_board_content_date').text(date[0]);



                        jWrapper.append(jItem)
                    }
                }



                page.find('.home_board_notice .home_board_content_list').on('click' , function () {
                    var jThis = $(this);
                    PageManager.go(['page_board_detail'] , {menu_id : 22, board_content_id : jThis.attr('value')})
                })
            })
        },

        loadFAQ: function () {
            var page = this;
            var jFaq = page.find('.home_board_question');
            jFaq.find('.home_board_header_more').on('click', function (e) {
                PageManager.go(['page'], { 'menu_id': 14 });
            });

            Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST , {
                boardIdList: 24,
                isAvailable: 1,
                isDeleted: 0,
                count: 4,
                includeBody: 1,
                parentBoardContentId: -1,
            }, function(status, data) {
                var list = Lia.p(data, 'body' , 'list');
                var wrapper = page.find('.home_board_question .home_board_content').empty();

                for(var idx in list) {
                    if(idx == 4) break;
                    var item = list[idx];
                    var jItem = $('<div class="home_board_content_list">\n' +
                        '                                <div class="home_board_question_icon"></div>\n' +
                        '                                <div class="home_board_content_title">보수교육 참여를 위한 ZOOM 접속 방법 안내</div>\n' +
                        '                            </div>')


                    jItem.find('.home_board_content_title').text(Lia.p(item , 'title') == undefined ? '-'  : Lia.p(item , 'title'));
                    jItem.attr('category_id' , Lia.p(item , 'category' , 'id'))
                    // var date = Lia.p(item , 'registered_date') == undefined ? '-'  : Lia.p(item , 'registered_date')
                    //
                    // date = date.split(' ');
                    // date[0].replace('-' , '.')
                    // jItem.find('.home_board_content_date').text(date[0]);
                    // jItem.attr('value' , Lia.p(item , 'id'))


                    wrapper.append(jItem)
                }

                page.find('.home_board_question .home_board_content_list').on('click' , function () {
                    var jThis = $(this);
                    PageManager.go(['page'], { 'menu_id': 14, 'page': 1, 'category_id' : jThis.attr('category_id') == undefined ? '' : jThis.attr('category_id')});

                    // PageManager.go(['page_board_detail'] , {menu_id : 14, board_content_id : jThis.attr('value')})
                })
            })
        },

        loadingBanner: function () {
            var page = this;

            Requester.awb(ApiUrl.Website.GET_AVAILABLE_BANNER_LIST, {
                serviceProviderId : Server.serviceProviderId,
                institutionId: 1,
                typeCode: BannerType.MIDDLE
            }, function (status, data) {

                var list = Lia.p(data, 'body', 'list');
                var count = Lia.p(data, 'body', 'count');

                if (Array.isNotEmpty(list)) {
                    var jPrevBtn = $('.home_btn_icon_prev');
                    var jNextBtn = $('.home_btn_icon_next');

                    var bannerList = data.body.list;
                    var bannerListLength = bannerList.length;
                    var idx = 0;

                    //배너 오토롤링 위한 Flags, Variables
                    var isPause = false;
                    var nextBtnFlag = false; //실제로 버튼을 눌렀는지 검사
                    var pauseTime; //대기 timeout 객체
                    var SLIDE_GENERAL_TIME = 6000;
                    var SLIDE_CLICK_SUSPEND_TIME = 5000;

                    if (bannerList[idx] != undefined) {

                        //이전배너 버튼. 버튼 누른 후 5초간 읽을시간(대기)
                        jPrevBtn.on('click', function (e) {

                            e.stopPropagation();

                            //오토 롤링 잠시 멈춤
                            isPause = true;
                            clearTimeout(pauseTime);
                            idx = Number($('.home_item_num').text()) - 1;
                            var jBar = $('.home_btn_box .home_btn_bar');
                            if (idx === 0) {
                                idx = bannerListLength - 1;
                                slider_helper(idx, bannerList)
                                jBar.css('width', 0)
                                jBar.clearQueue();
                                jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);
                            } else {
                                idx--;
                                slider_helper(idx, bannerList)
                                jBar.css('width', 0)
                                jBar.clearQueue();
                                jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);
                            }

                            pauseTime = setTimeout(function () {
                                isPause = !isPause;
                            }, SLIDE_CLICK_SUSPEND_TIME)
                        });

                        //다음배너 버튼. 버튼 누른 후 5초간 읽을시간(대기)
                        jNextBtn.on('click', function (e) {

                            e.stopPropagation();

                            isPause = true;
                            nextBtnFlag = true;
                            clearTimeout(pauseTime);
                            idx = Number($('.home_item_num').text()) - 1
                            var jBar = $('.home_btn_box .home_btn_bar');
                            if (idx === bannerListLength - 1) {
                                idx = 0;
                                slider_helper(idx, bannerList)
                                jBar.css('width', 0)
                                jBar.clearQueue();
                                jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);
                            } else {
                                idx++;
                                slider_helper(idx, bannerList)
                                jBar.css('width', 0)
                                jBar.clearQueue();
                                jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);
                            }

                            if (nextBtnFlag)
                                pauseTime = setTimeout(function () {
                                    isPause = false;
                                }, SLIDE_CLICK_SUSPEND_TIME)
                        });

                        //오토롤링을 위한 커스텀 이벤트, IE 반응 확인 완료.
                        jNextBtn.bind('test', function () {
                            // 배너 계속 넘김
                            idx = Number($('.home_item_num').text()) - 1;
                            var jBar = $('.home_btn_box .home_btn_bar');
                            if (idx == bannerListLength - 1) {
                                idx = 0;
                                slider_helper(idx, bannerList);
                                jBar.css('width', 0)
                                jBar.clearQueue();
                                jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);
                            } else {
                                idx++;
                                slider_helper(idx, bannerList)
                                jBar.css('width', 0)
                                jBar.clearQueue();
                                jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);
                            }
                        });

                        //시작시 첫 데이터 뿌리기
                        slider_helper(idx, bannerList)

                        var jBar = $('.home_btn_box .home_btn_bar');
                        jBar.css('width', 0)
                        jBar.clearQueue();
                        jBar.animate({width: "100%"}, SLIDE_GENERAL_TIME);

                        //오토 롤링 인터벌(시작)
                        var autoRolling = setInterval(function () {
                            if (!isPause)
                                jNextBtn.trigger('test');
                        }, SLIDE_GENERAL_TIME)

                    }

                }
            });

            //배너 데이터 뿌리는 함수
            var slider_helper = function (idx, bannerList) {

                var jItem = $('.home_slide_item');
                var jNumbering = $('.home_slide_item .home_item_num');
                var jBannerCurrentPage = $('.home_btn_num .home_btn_num_first');
                var jBannerTotalPage = $('.home_btn_num .home_btn_num_last');

                if (idx != undefined) {
                    if (idx < 10) {
                        jNumbering.text('0' + String(idx + 1));
                        jBannerCurrentPage.text('0' + String(idx + 1));
                    } else {
                        jNumbering.text(String(idx + 1));
                        jBannerCurrentPage.text(String(idx + 1));
                    }
                }
                var totalLength = Lia.pd('-', bannerList, 'length');
                totalLength = totalLength < 10 ? '0' + totalLength : totalLength;
                jBannerTotalPage.text(totalLength);

                jItem.find('.home_item_title').html(Lia.nl2br(Lia.p(bannerList[idx], 'title')));
                var jBodyText = Lia.p(bannerList[idx], 'body');
                var imgUrl = PathHelper.getFileUrl(Lia.p(bannerList[idx], 'properties', 'image_url', 'url'));

                var url = Lia.p(bannerList[idx], 'properties', 'url');
                if ( String.isNotBlank(url) ) {
                    page.find('.home_slide_wrapper').off().on( 'click', {
                        url : url
                    }, function(e) {

                        var url = e.data.url;
                        Lia.open(url);

                    }).css({ 'cursor':'pointer'});
                } else {
                    page.find('.home_slide_wrapper').off('click').css({'cursor': 'default'});
                }


                jItem.find('.home_item_ment').html(jBodyText);
                jItem.find('.home_slide_img').css('background', 'transparent url("' + imgUrl + '")');

            };
        },

        loadingQuickMenu: function () {
            Requester.awb(ApiUrl.Website.GET_AVAILABLE_BANNER_LIST, {
                serviceProviderId : Server.serviceProviderId,
                institutionId: 1,
                typeCode: BannerType.QUICK_MENU
            }, function (status, data) {


                var list = Lia.p(data,'body','list');
                if ( Array.isNotEmpty(list) ) {

                    var quickList = Lia.p(data, 'body', 'list');
                    var jQuickMenu = page.find('.home_quick_menu').empty();

                    for (var i in quickList) {
                        var quickListItem = quickList[i];
                        var jQuickListItem = $('<div class="home_qm_wrapper">\n' +
                            '                    <div class="home_qm_point">\n' +
                            '                        <div class="home_qm_box pc_show">\n' +
                            '                            <img class="home_qm_icon original" src="" />\n' +
                            '                            <img class="home_qm_icon pressed" src=""/>\n' +
                            '                        </div>\n' +
                            '                        <div class="home_qm_box pc_hide">\n' +
                            '                            <img class="home_qm_icon original" src=""/>\n' +
                            '                            <img class="home_qm_icon pressed" src=""/>\n' +
                            '                        </div>\n' +
                            '                        <div class="home_qm_title">나의강의실</div>\n' +
                            '                    </div>\n' +
                            '                </div>');

                        //이미지 세팅
                        var quickListItemImage = Lia.p(quickListItem, 'properties');

                        var normalIcon = Lia.p(quickListItemImage, 'normal_icon');
                        var mouseOverIcon = Lia.p(quickListItemImage, 'mouse_over_icon');
                        var mobileIcon = Lia.pd(normalIcon, quickListItemImage, 'mobile_icon');
                        var mobileMouseOverIcon = Lia.pd(mouseOverIcon, quickListItemImage, 'mobile_mouse_over_icon');

                        normalIcon = PathHelper.getFileUrl(normalIcon);
                        mouseOverIcon = PathHelper.getFileUrl(mouseOverIcon);
                        mobileIcon = PathHelper.getFileUrl(mobileIcon);
                        mobileMouseOverIcon = PathHelper.getFileUrl(mobileMouseOverIcon);

                        jQuickListItem.find('.home_qm_box.pc_show .home_qm_icon.original').attr('src', normalIcon);
                        jQuickListItem.find('.home_qm_box.pc_show .home_qm_icon.pressed').attr('src', mouseOverIcon);
                        jQuickListItem.find('.home_qm_box.pc_hide .home_qm_icon.original').attr('src', mobileIcon);
                        jQuickListItem.find('.home_qm_box.pc_hide .home_qm_icon.pressed').attr('src', mobileMouseOverIcon);


                        //퀵메뉴 이름 설정
                        jQuickListItem.find('.home_qm_title').html(Lia.p(quickListItem, 'title'))

                        jQuickListItem.on('click', {
                            title: Lia.p(quickListItem, 'title'),
                            url: Lia.p(quickListItem, 'properties', 'url'),
                            requireLogin: Lia.p(quickListItem, 'properties', 'requires_login') == 1
                        }, function (e) {
                            if(!Server.loggedIn && e.data.requireLogin) {
                                PopupManager.alert(e.data.title, '로그인이 필요한 서비스입니다. 로그인 하시겠습니까?', function () {
                                    PageManager.go(['user/login']);
                                    return;
                                }, function () {
                                    return;
                                });
                            } else {
                                if(String.isNotBlank(e.data.url)) {
                                    //나에게 맞는 과정 찾기
                                    if(e.data.url == '/?m1=courses&menu_id=8') {
                                        Requester.awb(ApiUrl.User.GET_USER_PROFILE, {},function (status, data) {
                                            var userProperties = Lia.p(data, 'body', 'properties');
                                            var queryString = ''
                                            if(userProperties != null) {
                                                queryString += '&attribute_code_list'
                                                userProperties.forEach(function (data) {
                                                    var name = Lia.p(data, 'name');
                                                    var value = Lia.p(data, 'value');

                                                    //depth2 제외
                                                    //|| name == 'agTypeDp2'
                                                    if(name == 'agTypeDp' || name=='career') {
                                                        if (queryString == '&attribute_code_list') {
                                                            queryString += '=' + value;
                                                        } else {
                                                            queryString += '%2C' + value;
                                                        }
                                                    }
                                                })
                                                Lia.redirect(e.data.url+queryString);
                                            } else {
                                                Lia.redirect(e.data.url);
                                            }
                                        })
                                    }
                                    Lia.redirect(e.data.url);
                                } else {
                                    PopupManager.alert(e.data.title, '해당 메뉴는 준비중입니다.');
                                }
                            }


                            // PopupManager.alert('잘못 된 접근', '구현 중 입니다.');

                        });

                        //퀵메뉴 추가
                        jQuickMenu.append(jQuickListItem)
                    }

                }
            });
        },

        loadingMainCourses : function() {
            var page = this;

            page.find('.home_card_slide .home_card_more').on('click', function (e){
               PageManager.go(['courses'], {menu_id : MenuId.COURSE});
            });

            Requester.awb(ApiUrl.Learning.GET_COURSE_SUMMARY_LIST, {
                    year : (new Date()).toString('yyyy'),
                    institutionId: Server.institutionId,
                    statusCodeList: [CourseStatus.REGISTERING].join(','),
                    // groupByCode: 1,
                    termIsAvailable: 1,
                    isAvailable: 1,
                    adminPage: 0,
                    studentPage: 0,
                    includeAttributeList: 1,
                    orderByCode : CourseOrderBy.TERM_TYPE_CODE_DESC_AND_REGISTRATION_END_DATE_DESC_TITLE_ASC
                    //searchOptionList : searchOptionListString
                },
                function (status, data) {


                    var currentDate = Lia.p(data,'current_date');

                    var courseList = Lia.p(data,'body','list')
                    var jCourseList = $('.home_card_item_wrapper').empty();

                    //총 건수
                    // var jCourseTotal = $('.course_main_nav_info_total').empty();
                    // jCourseTotal.text('총 '+courseList.length+' 건')

                    //데이터 순회 & 강좌 카드 만들기
                    for(var i in courseList) {
                        var courseItem = courseList[i];

                        var jCourseItem = $(
                            '                    <div class="home_card_item">\n' +
                            '                        <div class="card_item_img">\n' +
                            '                           <div class="card_item_enroll">\n' +
                            '                               <div class="card_item_enroll_end">모집종료</div>\n' +
                            '                               <div class="card_item_enroll_ing">모집중</div>\n' +
                            '                               <div class="card_item_enroll_plan">모집예정</div>\n' +
                            '                           </div>\n' +
                            '                           <div class="card_item_state homecard">\n' +
                            '                               <div class="card_item_state_online">이러닝</div>\n' +
                            '                               <div class="card_item_state_offline">집체</div>\n' +
                            '                           </div>\n' +
                            '                        </div>\n' +
                            '                        <div class="card_item_content">\n' +
                            '                            <div class="card_item_category"></div>\n' +
                            '                            <div class="card_item_title"></div>\n' +
                            '                        </div>\n' +
                            '                        <div class="card_item_info">\n' +
                            '                            <div class="card_item_info_register_period"></div>' +
                            '                            <div class="card_item_info_period"></div>\n' +
                            '                            <div class="card_item_info_personnel"></div>\n' +
                            '                        </div>\n' +
                            '                    </div>')


                        jCourseItem.on('click', {
                            courseId: Lia.p(courseItem, 'id')
                        }, function (e){
                            PageManager.go(['course_detail'], {
                                course_id : e.data.courseId
                            });
                        });

                        var courseImageUrl = Lia.p(courseItem, 'course_image_url');

                        if(String.isBlank(courseImageUrl)) {
                            courseImageUrl =  '/res/home/img/stop/common/img_none.png'
                        } else {
                            courseImageUrl = Lia.convertStrToObj(courseImageUrl);
                            courseImageUrl = PathHelper.getFileUrl(Lia.p(courseImageUrl,0, 'url'));
                        }


                        jCourseItem.find('.card_item_img').css('background-image' , 'url('+ courseImageUrl +')')

                        jCourseItem.find('.card_item_title')
                            .text(Lia.p(courseItem, 'service_title'));
                        //Lia.formatDateWithSeparator()

                        var regStartDate = Lia.pd('-', courseItem, 'registration_start_date');
                        var regEndDate = Lia.pd('-', courseItem, 'registration_end_date');


                        if(Lia.p(courseItem , 'term_type_code') == TermType.DEFAULT) {
                            jCourseItem.find('.card_item_info_register_period').html('<span style="color:#7147a9;">신청기간 :</span> ' + '상시');
                            jCourseItem.find('.card_item_info_period').html('<span style="color:#7147a9;">교육기간 :</span> ' + Lia.p(courseItem , 'study_days') + '일');
                        } else {
                            jCourseItem.find('.card_item_info_register_period').html('<span style="color:#7147a9;">신청기간 :</span> ' +Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'registration_start_date'), '.') + '~' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00',courseItem, 'registration_end_date'), '.'));
                            jCourseItem.find('.card_item_info_period').html('<span style="color:#7147a9;">교육기간 :</span> ' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', courseItem, 'start_date'), '.') + '~' + Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00',courseItem, 'end_date'), '.'));
                        }




                        var maxStudentPropCount = Lia.pcd( Lia.p(courseItem, 'max_student_count'), courseItem,'properties','max_student_count');
                        var maxStudentCount =  Lia.p(courseItem, 'max_student_count');
                        var studentCount = Lia.pd('-',courseItem, 'student_count');
                        if(maxStudentCount == undefined) { //  인원제한이 없는 경우
                            jCourseItem.find('.card_item_info_personnel').html('<span style="color:#7147a9;">인원 제한 없음</span>');
                        } else {
                            if(maxStudentCount <= studentCount) {
                                jCourseItem.find('.card_item_info_personnel').html( '<span style="color:#7147a9;">(정원)' + maxStudentPropCount + '명</span> / <span style="color: red">' + studentCount + '명</span>');
                            } else {
                                jCourseItem.find('.card_item_info_personnel').html('<span style="color:#7147a9;">(정원)' + maxStudentPropCount + '명</span> / ' + studentCount + '명');
                            }
                        }

                        if(courseItem.status_code == CourseStatus.WAITING) {
                            //start
                            jCourseItem.find('.card_item_enroll .card_item_enroll_plan').addClass('active')
                        } else if(courseItem.status_code == CourseStatus.REGISTERING) {
                            //registering
                            jCourseItem.find('.card_item_enroll .card_item_enroll_ing').addClass('active')
                        } else if(courseItem.status_code >= CourseStatus.PENDING) {
                            //end
                            jCourseItem.find('.card_item_enroll .card_item_enroll_end').addClass('active')
                        }

                        switch(jCourseItem.status_code) {
                            case CourseStatus.WAITING: {
                                jCourseItem.find('.card_item_enroll .card_item_enroll_plan').addClass('active')
                            } break;
                            case CourseStatus.REGISTERING: {
                                jCourseItem.find('.card_item_enroll .card_item_enroll_ing').addClass('active')
                            } break;

                            // case CourseStatus.PENDING: {
                            //     jCourseItem.find('.card_item_enroll .card_item_enroll_end').addClass('active')
                            // } break;

                            case CourseStatus.PENDING:
                            case CourseStatus.OPERATING:
                            case CourseStatus.MARK_REVIEWING:
                            case CourseStatus.FINISHED: {
                                jCourseItem.find('.card_item_enroll .card_item_enroll_end').addClass('active')
                            } break;
                            default: {

                            }
                        }

                        //online-offline
                        var learningMethod = Lia.p(courseItem, 'learning_method_code');
                        if (learningMethod == CourseLearningMethod.ONLINE) {
                            jCourseItem.find('.card_item_state_online').css('display', 'block');
                            jCourseItem.find('.list_item_state_online').css('display', 'block');
                        } else if(learningMethod == CourseLearningMethod.BLENDED_LEARNING) {
                            jCourseItem.find('.card_item_state_online').css('display', 'block');
                            jCourseItem.find('.list_item_state_online').css('display', 'block');
                            jCourseItem.find('.card_item_state_offline').css('display', 'none');
                            jCourseItem.find('.list_item_state_offline').css('display', 'none');
                            jCourseItem.find('.card_item_state_online').text('블렌디드 러닝');
                        } else if(learningMethod == CourseLearningMethod.FLIPPED_LEARNING) {
                            jCourseItem.find('.card_item_state_online').css('display', 'block');
                            jCourseItem.find('.list_item_state_online').css('display', 'block');
                            jCourseItem.find('.card_item_state_offline').css('display', 'none');
                            jCourseItem.find('.list_item_state_offline').css('display', 'none');
                            jCourseItem.find('.card_item_state_online').text('화상');
                        } else if (learningMethod == CourseLearningMethod.OFFLINE) {
                            jCourseItem.find('.card_item_state_online').css('display', 'none');
                            jCourseItem.find('.list_item_state_online').css('display', 'none');
                            jCourseItem.find('.card_item_state_offline').css('display', 'block');
                            jCourseItem.find('.list_item_state_offline').css('display', 'block');
                        } else {
                            jCourseItem.find('.card_item_state_online').text('-');
                            jCourseItem.find('.list_item_state_online').text('-');
                        }

                        // 과정분야
                        var attributeList = Lia.p(courseItem, 'attribute_list');

                        if(attributeList != undefined && attributeList != [] && String.isNotBlank(attributeList)) {

                            var categoryTextList = [];
                            var depth2items = ''
                            var str = '';
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

                            jCourseItem.find('.card_item_category').text(str);
                        }

                        jCourseItem.addClass('recommend_main_course');
                        jCourseList.append(jCourseItem);

                    }

                    //TODO: slick 보이는 개수 수정
                    jCourseList.slick({
                        prevArrow : $('.home_card_btn_prev'),
                        nextArrow : $('.home_card_btn_next'),
                        infinite: true,
                        speed: 300,
                        // slidesToShow: 4,
                        centerMode: false,
                        fade: false,
                        autoplay: true,
                        responsive: [
                            {
                                breakpoint: 2561,
                                settings: {
                                    variableWidth: true,
                                    slidesToShow: 4,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 1361,
                                settings: {
                                    variableWidth: true,
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 769,
                                settings: {
                                    variableWidth: true,
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    })
            })
        },

        loadingFooterBanner : function() {
            var page = this;

            var jBottomBanner = page.find('.home_bottom_banner');
            var jList = jBottomBanner.find('.home_banner_img_list');


            Requester.awb(ApiUrl.Board.GET_BOARD_CONTENT_SUMMARY_LIST, {
                boardIdList : BoardId.FOOTER_SLIDE,
                includeBody : 1,
                isDeleted : 0,
                isAvailable: 1,
            }, function (status, data) {

                var list = Lia.p(data, 'body', 'list');

                var totCnt = Lia.p(data, 'body' , 'total_count');
                var totContText = totCnt < 10 ? '0'+totCnt.toString() : totCnt
                jBottomBanner.find('.home_banner_num_last').text(totContText);

                if(Lia.p(data, 'body' , 'total_count') != 0) {
                    jList.empty();
                    for (var i in list) {
                        var item = list[i];
                        var imgUrl = Lia.p(item, 'image_url');

                        imgUrl = JSON.parse(imgUrl);
                        imgUrl = Lia.p(imgUrl, 'url');

                        var jImg = $('<div class="home_banner_img"></div>');
                        jImg.css('background-image', 'url("' + PathHelper.getFileUrl(imgUrl) + '")');
                        jImg.css('background-size', 'cover');

                        jList.append(jImg);
                    }


                    jList.slick({
                        centerMode: false,
                        infinite: true,
                        arrows: false,
                        speed: 850,
                        variableWidth: true,
                        autoplay: true,
                        autoplaySpeed: 10000,
                        dots: false,
                        fade: false,
                        settings: {slidesToShow: 1, slidesToScroll: 1}
                    });

                    jBottomBanner.find('.home_banner_prev').on('click', function (e) {
                        jList.slick('slickPrev');
                    });
                    jBottomBanner.find('.home_banner_next').on('click', function (e) {
                        jList.slick('slickNext');
                    });

                    jList.on('beforeChange, afterChange', function (event, slick, currentSlide, nextSlide) {
                        var current = jList.slick('slickCurrentSlide');
                        if (current + 1 < 10) {
                            $('.home_banner_num_first').text('0' + (current + 1));
                        } else {
                            $('.home_banner_num_first').text(current + 1);
                        }
                    });
                } else {
                    var jItemTemp = $('<div class="home_banner_img" onclick="window.open(\'https://www.stop.or.kr/\')"></div>');
                    // jItemTemp.css('background-size' ,'cover');
                    jItemTemp.css('background-image' , 'url("' +'/res/home/img/stop/main/ad_1.png'+ '")')

                    jBottomBanner.find('.home_banner_num_last').text('01');
                    jList.append(jItemTemp);
                }
            })
        },
    }
})();

