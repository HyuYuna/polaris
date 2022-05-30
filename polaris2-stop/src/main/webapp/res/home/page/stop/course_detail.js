(function () {
    return {
        onInit: function ( jPage, jPageContainer, i, parameterMap, beforeParameterMap ) {
            var page = this;

            page.attributeDepth2ExistMap = null;
            page.available = false;

            Lia.scrollTo(0, 1000);

            $('.course_divider').find('.course_divider_header').on('click', function (e){
                e.preventDefault();

                var jThis = $(this);

                if ( jThis.hasClass('on') ) {

                    jThis.parent().find('.course_divider_content').slideUp(400, function(){

                        jThis.parent().removeClass('active');
                        jThis.removeClass('on');

                    });

                } else {

                    jThis.parent().addClass('active');
                    jThis.addClass('on');

                    jThis.parent().find('.course_divider_content').slideDown(400, function(){});

                }

            });

            $('.course_divider .course_divider_content').css( { 'display': 'none'} );

            $('.course_divider .course_divider_header').eq(0).trigger('click');


            page.menuPageManager = new MenuPageManager ({
                page:page
            });

            page.loadingCourseDetail(parameterMap);

            Requester.func(function() {

                $('.course_header_info_buttons_enroll').on('click', function(e){
                    var jThis = $(this);

                    //강좌가 이용불가능
                    if(jThis.hasClass(('unavailable'))) {
                        return;
                    }

                    if(Server.loggedIn) {

                        var courseId = PageManager.pc('course_id');

                        if(courseId == undefined) {
                            PopupManager.alert('안내', '정상적이지 않은 접근입니다.', function (){
                                PageManager.go(['courses']);
                            });
                        } else {
                            //상시제과목 + 미수료 상태 +
                            page.anyTimeCourseReEnrollFlag = Lia.p(page.course , 'term_type_code') == TermType.DEFAULT
                            && Lia.p(page.course , 'is_completed') == 0
                            && Lia.p(page.course , 'status_code') == CourseStatus.FINISHED ? 1 : 0 ;

                            Requester.awb(ApiUrl.User.GET_USER_PROFILE, {}, function (status, data) {

                                var agTypeDp = null;
                                var agTypeDp2 = null
                                var agPosition = Lia.p(data, 'body', 'company_position');
                                var agPhone = Lia.p(data, 'body', 'office_phone_number');
                                var userProperties = Lia.p(data, 'body', 'properties');
                                var address1 = Lia.p(data, 'body', 'address_1');
                                var address2 = Lia.p(data, 'body', 'address_2');
                                var agName = Lia.p(data, 'body', 'company_name');

                                var userPropertyMap = {};

                                for(var i in  userProperties) {
                                    var userProp = userProperties[i];

                                    userPropertyMap[Lia.p(userProp , 'name')] = Lia.p(userProp , 'value');

                                    if(Lia.p(userProp , 'name') == 'agTypeDp') {
                                        agTypeDp = Lia.p(userProp , 'value')
                                    } else if(Lia.p(userProp , 'name') == 'agTypeDp2') {
                                        agTypeDp2 = Lia.p(userProp , 'value')
                                    } else if(Lia.p(userProp , 'name') == 'career') {
                                        career = Lia.p(userProp , 'value')
                                    }
                                }

                                var career = Lia.p(userPropertyMap, 'career');
                                var career_present = Lia.p(userPropertyMap, 'career_present');
                                var company_attachment_document_file = Lia.p(userPropertyMap, 'company_attachment_document_file');

                                //depth2가 있어야하지만 depth1만 선택한 경우
                                if(page.attributeDepth2ExistMap[agTypeDp] && String.isBlank(agTypeDp2)) {
                                    PopupManager.alert('안내', '교육신청 및 수료증 발급을 위해 추가 정보 입력이 필요합니다.<br/>지금 추가 정보를 입력하시겠습니까?', function (){
                                        PageManager.go(['user', 'check_pw'] ,{
                                            course_id : PageManager.pc('course_id')
                                        });
                                    }, function () {
                                        return;
                                    });
                                } else {
                                    if (String.isBlank(agName) || String.isBlank(agPosition) || String.isBlank(agPhone) ||
                                        String.isBlank(agTypeDp) || String.isBlank(address1) || String.isBlank(address2) ||
                                        String.isBlank(career) || String.isBlank(career_present) || String.isBlank(company_attachment_document_file)
                                    ) {
                                        PopupManager.alert('안내', '교육신청 및 수료증 발급을 위해 추가 정보 입력이 필요합니다.<br/>지금 추가 정보를 입력하시겠습니까?', function () {
                                            PageManager.go(['user', 'check_pw'], {
                                                course_id : PageManager.pc('course_id')
                                            });
                                        }, function () {
                                            return;
                                        });
                                    } else {


                                        // 체크
                                        var enrollType = false;
                                        var enrollD2Type = false;
                                        var enrollCareer = false;
                                        var enrollPosition = false;

                                        var attributeList = page.attributeList;

                                        for(var i in attributeList) {
                                            var tmpAttrId = Lia.p(attributeList , i , 'attribute_id');
                                            if( tmpAttrId == agTypeDp) {
                                                enrollType = true;
                                            }

                                            if(tmpAttrId == agTypeDp2) {
                                                enrollD2Type = true;
                                            }

                                            if( tmpAttrId == career) {
                                                enrollCareer = true;
                                            }

                                            if(tmpAttrId == agPosition) {
                                                enrollPosition = true;
                                            }
                                        }

                                        // 모든 정보 들어가 있어야 하고 dp2가 없는 경우에는 2번째 꺼 있는걸로 체크
                                        if ( String.isBlank(agTypeDp2) ){
                                            enrollD2Type = true;
                                        }

                                        if(enrollType && enrollD2Type && enrollPosition && enrollCareer) {
                                            page.available = true
                                        }

                                        if ( !page.available ) {

                                            PopupManager.alert('안내',' 교육대상이 일치하지 않습니다.');
                                            return;
                                        }


                                        //약관 존재
                                        if (String.isNotBlank(page.termsOfServiceId)) {

                                            AjaxPopupManager.show(ProjectPopupUrl.ENROLL_CONFIRM_POPUP, {
                                                terms_of_service_id: page.termsOfServiceId,
                                                is_traning: page.isTraning,
                                                course_id: courseId,
                                                enroll_available : page.available,
                                                onComplete: function (doc_obj, termsOfServiceIdList) {
                                                    Requester.awb(ApiUrl.Document.REGISTER_USER_TERMS_OF_SERVICE, {
                                                        termsOfServiceId: page.termsOfServiceId,
                                                        courseId: courseId,
                                                        termsOfServiceItemIdList: termsOfServiceIdList.toString()
                                                    }, function (status, data) {

                                                        //status 비정상일 때
                                                        if (status != Requester.Status.SUCCESS) {
                                                            var code = Lia.p(data, 'code');

                                                            //이미이 동의
                                                            if (code != Code.ALREADY_AGREED_TERMS_OF_SERVICE) {

                                                                PopupManager.alertByResponse(data);
                                                                return;

                                                            } else {
                                                                //이미 동의
                                                                if(page.anyTimeCourseReEnrollFlag == 1) {
                                                                    PopupManager.alert('안내' , "기존 학습했던 이력은 초기화 이후 다시 수강신청 합니다. <br /> 진행 하시겠습니까?" , function () {
                                                                        page.enrollCourse(courseId, doc_obj.toString(), 1);
                                                                    } , function() {return;})
                                                                } else {
                                                                    page.enrollCourse(courseId, doc_obj.toString(), 0);
                                                                }

                                                            }

                                                        } else {
                                                            //status  정상일 때
                                                            if(page.anyTimeCourseReEnrollFlag == 1) {
                                                                PopupManager.alert('안내' , "기존 학습했던 이력은 초기화 이후 다시 수강신청 합니다. <br /> 진행 하시겠습니까?" , function () {
                                                                    page.enrollCourse(courseId, doc_obj.toString(), 1);
                                                                } , function() {return;})
                                                            } else {
                                                                page.enrollCourse(courseId, doc_obj.toString(), 0);
                                                            }
                                                        }


                                                    }, {
                                                        autoPopup: false
                                                    });

                                                }
                                            });

                                        } else {

                                            //약관 미존재
                                            AjaxPopupManager.show(ProjectPopupUrl.ENROLL_CONFIRM_POPUP, {
                                                terms_of_service_id: page.termsOfServiceId,
                                                is_traning: page.isTraning,
                                                course_id: courseId,
                                                enroll_available : page.available,
                                                onComplete: function (doc_obj) {

                                                    if(page.anyTimeCourseReEnrollFlag == 1) {
                                                        PopupManager.alert('안내' , "기존 학습했던 이력은 초기화 이후 다시 수강신청 합니다. <br /> 진행 하시겠습니까?" , function () {
                                                            page.enrollCourse(courseId, doc_obj.toString(), 1);
                                                        } , function() {return;})
                                                    } else {
                                                        page.enrollCourse(courseId, doc_obj.toString(), 0);
                                                    }

                                                }
                                            });

                                        }

                                    }

                                }

                            });


                        }


                    } else {
                        PopupManager.alert('안내', '로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?', function(){
                            // 수강신청 로직 필요
                            PageManager.go(['/user/login']);
                        }, function (){ return; }, '예', '아니오')
                    }


                });
            })

            page.find('.move_course_board_button').on('click' , function(e) {
                //menuId 하드코딩
                PageManager.go(['courses'] , {'menu_id': MenuId.COURSE});
            });

            page.loadTab();

            page.menuPageManager.onInit(jPage);

            // if(Server.loggedIn) {
            //     var btnMenu = page.find('.course_header_info_button');
            //     var attachFile = page.find('.course_header_info_attach');
            //
            //     attachFile.on('click' , function () {
            //         //정보연동
            //         AjaxPopupManager.show(ProjectPopupUrl.COURSE_ATTACH_FILE, {
            //         });
            //     })
            //
            //     btnMenu.prepend(attachFile);
            // }

        },
        onChange : function( jPage, jPageContainer, i, parameterMap, beforeParameterMap ) {
            var page = this;

            var menu = MenuManager.getLastSelectedMenu();
            // /var menuId = menu['id'];

            page.menuPageManager.onChange(jPage, jPageContainer, i, parameterMap, beforeParameterMap);
        },
        onRelease: function ( jPage, jPageContainer, i, parameterMap, beforeParameterMap ) {
        },

        loadingCourseDetail : function(parameterMap) {
            var page = this;
            
            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST ,{

            },function (status, data) {

                var currentDate = Lia.p(data,'current_date');

                var attrTotalList = Lia.p(data , 'body' , 'list');
                var fieldAttrListLength = 0;
                var positionAttrListLength = 0;
                var careerAttrListLength = 0;

                //소속기관 유형 필터링 위한 객체 3개
                var fieldChild2ParentMap = {
                }
                var fieldParentChildNumber = {
                }
                var fieldDepth1Map = {}

                page.attributeDepth2ExistMap = {}
                for(var i in attrTotalList) {
                    if(Lia.p(attrTotalList , i , 'depth') == 2) {
                        page.attributeDepth2ExistMap[Lia.p(attrTotalList , i , 'parent_id')] = true;
                    }
                }

                for(var i in attrTotalList) {
                    var attr = attrTotalList[i];
                    if(Lia.p(attr , 'depth') == 1) {
                        fieldParentChildNumber[String(Lia.p(attr , 'id'))] = 0;
                        fieldDepth1Map[String(Lia.p(attr , 'id'))] = Lia.p(attr , 'name')
                    } else {
                        fieldChild2ParentMap[String(Lia.p(attr , 'id'))] = Lia.p(attr , 'parent_id');
                        fieldParentChildNumber[String(Lia.p(attr , 'parent_id'))]++;
                    }
                    switch (Lia.p(attr ,'category_code')) {
                        case '소속기관' : {
                            if(Lia.p(attr , 'name') != '기타')
                                fieldAttrListLength++;
                        }break;
                        case '직위' : {
                            positionAttrListLength++;
                        }break;
                        case '경력' : {
                            careerAttrListLength++;
                        }break;
                    }
                }

                //부모id : 자식갯수-1 통해 이후 로직에서 자식 attr 1개씩 차감 후 -1 인 것만 추출하기 위해 갯수 -1 함.
                //원래 갯수 5개 -> 객체 갯수 4개  --> 이후 로직에서 1개씩 차감시 어떤 depth1아이템의 자식이 모두 표현 될 경우 
                //갯수 - 갯수로 0개가 되야하나, 자식이 없는 부모attr인경우 기본으로 0을 가지고 있기때문에, 자식이 있는경우 갯수에서 -1 하여
                // -1로 만들어 음수만 추출하여 필터링
                for(var i in fieldParentChildNumber) {
                    if(fieldParentChildNumber[i] != 0) {
                        fieldParentChildNumber[i]--;
                    }
                }

                // console.log(fieldChild2ParentMap)
                // console.log(fieldParentChildNumber)

                Requester.awb(ApiUrl.Learning.GET_COURSE ,{
                    id : Lia.p(parameterMap , 'course_id')
                }, function(state, data)
                {
                    var item = page.course = Lia.p(data, 'body');
                    page.termsOfServiceId = Lia.p(item,'terms_of_service_id');
                    var introVideo = Lia.p(item, 'course_video');// 맛보기 영상 관련
                    var courseImageUrl = Lia.p(item, 'course_image_url');//courseImg
                    var fileList = Lia.p(item , 'properties' , 'attachment'); //첨부파일
                    var enrollStatus = Lia.p(item, 'status_code');
                    var attributeList = page.attributeList = Lia.p(item, 'attribute_list');// 과정분야
                    page.isTraning = false;

                    page.anyTimeCourseReEnrollFlag = Lia.p(page.course , 'term_type_code') == TermType.DEFAULT
                    && Lia.p(page.course , 'is_completed') == 0
                    && Lia.p(page.course , 'status_code') == CourseStatus.FINISHED ? 1 : 0 ;

                    for(var i in attributeList) {
                        var attr = attributeList[i];
                        if(attr['attribute_id'] == 16) {
                            page.isTraning = true;
                        }
                    }
                    

                    if(introVideo == undefined) {
                        $('.course_header_info_buttons_video').hide();
                        $('.course_header_info_buttons_enroll').css('width', '100%');
                    } else {
                        $('.course_header_info_buttons_video').on('click', function (e){

                            var source = Lia.p(introVideo, 'video_source');
                            var typecode = Lia.p(introVideo, 'video_type_code');

                            // AjaxPopupManager.show(LmsPopupUrl.VIDEO, {
                            //     videoUrl: source
                            // });

                            AjaxPopupManager.show(ProjectPopupUrl.INTRO_VIDEO, {
                                videoTypeCode: typecode,
                                videoSource: source
                            });

                            // switch (Number(typecode)) {
                            //     case VideoContentVideoType.FILE: {
                            //         LmsPopupUrl
                            //         var fileUrl = PathHelper.getVideoUrl(source);
                            //         PopupManager.alert('맛보기 영상', '<embed class="youtube_test" src="'+ fileUrl +'" width="360" height="202" />');
                            //     } break;
                            //     case VideoContentVideoType.YOU_TUBE: {
                            //         var id = YouTubeHelper.extractId(source);
                            //         PopupManager.alert('맛보기 영상', '<iframe class="youtube_test" width="360" height="202" src="https://www.youtube.com/embed/'+ id +'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
                            //     } break;
                            //     case VideoContentVideoType.VIMEO: {
                            //         var id = VimeoHelper.extractId(source);
                            //         PopupManager.alert('맛보기 영상', '<iframe class="youtube_test" src="https://player.vimeo.com/video/'+ id +'?color=ffffff&title=0&byline=0&portrait=0" style="width:360px;height:202px;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>');
                            //     } break;
                            //     default: {
                            //         PopupManager.alert('안내', '맛보기 영상이 등록되어 있지 않습니다.');
                            //     }
                            // }

                        });
                    }


                    if(Lia.p(item ,  'course_enrollment' , 'status_code') == '10') {
                        page.find('.course_header_info_buttons_enroll').addClass('unavailable');
                        page.find('.course_header_info_buttons_enroll').text('수강신청 승인 대기 중');
                    }

                    if(Lia.p(item, 'absolute_status_code') == CourseStatus.WAITING) {
                        var status = page.find('.course_header_info_status').empty();
                        status.css('backgroundColor' , '#373a5b');
                        status.text('모집예정')
                    }

                    if(Lia.p(item, 'absolute_status_code') == CourseStatus.REGISTERING) {
                        var status = page.find('.course_header_info_status').empty();
                        status.css('backgroundColor' , '#ffc423');
                        status.text('모집중')
                    }

                    if(Lia.p(item, 'absolute_status_code') > CourseStatus.REGISTERING) {
                        var status = page.find('.course_header_info_status').empty();
                        status.css('backgroundColor' , '#aaaaaa');
                        status.text('모집종료')
                    }

                    courseImageUrl = Lia.p(courseImageUrl, 0, 'url')
                    if ( String.isBlank(courseImageUrl) ) {
                        courseImageUrl = '/res/home/img/stop/common/img_none.png'
                    } else {
                        courseImageUrl = PathHelper.getFileUrl(courseImageUrl);
                    }

                    page.find('.course_header_thumb_img').css('backgroundImage' , 'url('+ courseImageUrl +')')

                    //course title
                    if(Lia.p(item, 'service_title') != undefined) {
                        var title = Lia.p(item, 'service_title')
                        page.find('.course_header_info_title').empty();
                        page.find('.course_header_info_title').text(title);
                    }

                    if(attributeList != undefined || attributeList != [] || String.isNotBlank(attributeList)) {
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

                        page.find('.category_type').text(str);

                    } else {

                    }

                    //course 기간

                    if(Lia.p(item , 'term_type_code') != '1') {

                        if (Lia.p(item, 'start_date') != undefined && Lia.p(item, 'end_date') != undefined) {
                            var jDate = page.find('.date')

                            var start = Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', item, 'start_date'), '.');

                            var end = Lia.formatDateWithSeparator(Lia.pd('2021-00-00 00:00:00', item, 'end_date'), '.');

                            jDate.text(start + ' ~ ' + end);
                        }
                    } else {
                        var jDate = page.find('.date');
                        if (Lia.p(item, 'study_days') != undefined) {
                            jDate.text(Lia.p(item, 'study_days') + '일');
                        }  else {
                            jDate.text('-');
                        }
                    }

                    //
                    // //course 시수
                    var hour = page.find('.hour')
                    if ( String.isNotBlank(Lia.p(item, 'study_time_in_hours')) ) {
                        hour.text(Lia.p(item, 'study_time_in_hours') + '시간');
                    } else {
                        hour.text('-');
                    }



                    // 모집인원
                    var maxStudentCount = Lia.pcd(Lia.p(item, 'max_student_count'), item, 'properties', 'max_student_count');
                    var courseMaxStudentCount = Lia.p(item, 'max_student_count');
                    var studentCount = Lia.pd('-', item, 'student_count');
                    var jStudentCount = page.find('.course_header_info_detail_sentance_data.stdcount');
                    if(maxStudentCount == undefined) {
                        jStudentCount.text('인원 제한 없음');
                    } else {
                        var stdcount = '(정원)' + maxStudentCount + '명' + ' / ' +  studentCount + '명';
                        jStudentCount.html(stdcount);
                    }


                    var jIsOnline = page.find('.course_header_info_detail_sentance_data.online');// 온라인 여부
                    var learningMethod = Lia.p(item, 'learning_method_code')
                    if (learningMethod === CourseLearningMethod.ONLINE) {
                        jIsOnline.text('이러닝');
                    } else if (learningMethod === CourseLearningMethod.OFFLINE) {
                        jIsOnline.text('집체');
                    } else if(learningMethod ===  CourseLearningMethod.BLENDED_LEARNING) {
                        jIsOnline.text('블렌디드 러닝');
                    } else {
                        jIsOnline.text('화상');   
                    }

                    //숙박여부
                    var stay = Lia.pd('-' , item , 'properties' , 'stay');
                    if(stay != undefined) {
                        if(stay == 1) {
                            page.find('.course_header_info_detail_sentance_data.sleep').text('숙박')
                        } else if(stay == 0) {
                            page.find('.course_header_info_detail_sentance_data.sleep').text('비숙박')
                        } else {
                            page.find('.course_header_info_detail_sentance_data.sleep').text(stay)
                        }
                    }



                    // 과정소개
                    var courseIntroduction =  Lia.p(item , 'properties' , 'course_introduction');
                    if ( String.isNotBlank(courseIntroduction)) {

                        var content_desc = $('.contents_desc');
                        var jHtml = $('<div>' + courseIntroduction + '</div>');
                        jHtml.find('table').css({'width' : '100%'});

                        content_desc.html(jHtml);
                    }


                    // //학습목표
                    var learningObjectives = Lia.p(item, 'properties', 'learning_objectives');
                    if (String.isNotBlank(learningObjectives)) {

                        var learningObj = $('.learning_desc');
                        var jHtml = $('<div>' + learningObjectives + '</div>');
                        jHtml.find('table').css({'width' : '100%'});
                        learningObj.html(jHtml);
                    }

                    // //유의사항

                    var teachingStrategies = Lia.p(item, 'properties', 'teaching_strategies');
                    if (String.isNotBlank(teachingStrategies)) {
                        var warnOption = $('.warning_desc');
                        var jHtml = $('<div>' + teachingStrategies + '</div>');
                        jHtml.find('table').css({'width' : '100%'});
                        warnOption.html(jHtml);
                    }

                    // if(String.isNotBlank(Lia.p(item , 'properties' , 'course_introduction'))) {
                    //
                    //     var div = $('<div></div>');
                    //
                    //     div.append($(Lia.p(item , 'properties' , 'course_introduction')));
                    //     div.find('table').css('width' , '100%');
                    //
                    //     div.css('margin-bottom' , '50px');
                    //
                    //     // page.find('.course_intro_subtitle').remove();
                    //     // page.find('.course_intro_subcontent').remove();
                    //
                    //     page.find('.course_intro_subtitle_introduction').append(div);
                    // } else {
                    //     page.find('.course_intro_subtitle_introduction').css('display' , 'none');
                    // }
                    page.find('.course_intro_subtitle_introduction').css('display' , 'none');

                    //담당자 정보
                    if(String.isNotBlank(Lia.p(item ,  'properties' , 'course_admin'))) {
                        var text = Lia.p(item , 'properties' , 'course_admin');
                        page.find('.course_memo_sentance.teacher .course_memo_sentance_data').empty();
                        // var text = ''
                        //
                        // for(var i in list ) {
                        //     var listItem = list[i];
                        //     text += Lia.p(listItem , 'admin_user_name') + '<br>'
                        // }
                        page.find('.course_memo_sentance.teacher .course_memo_sentance_data').html(text)
                    }

                    //첨부파일
                    if(Array.isNotEmpty(fileList)) {
                        page.find('.course_memo_sentance.attachment .course_memo_sentance_data').empty();

                        for(var i in fileList) {
                            var file = Lia.p(fileList , i);
                            var fileName = Lia.p(file , 'original_filename')
                            var url = Lia.p(file , 'url');
                            url = PathHelper.getFileUrl(url, fileName);
                            var jFile = $('<p>'+ fileName + '</p>');
                            jFile.append($('<span class="course_memo_sentance_data_size"></span>'))

                            if(fileName == undefined) {
                                jFile.css('cursor' , 'none');
                            }

                            if(Lia.p(file , 'size') != 0) {
                                jFile.find('.course_memo_sentance_data_size').text('[' + Lia.convertBytesToSize(Lia.p(file , 'size')) + ']');
                            }

                            jFile.on('click' ,{
                                url : url,
                                fileName : fileName
                            } ,function(e) {
                                window.open(e.data.url);
                            })

                            page.find('.course_memo_sentance.attachment .course_memo_sentance_data').append(jFile);
                        }
                    } else {
                        page.find('.attachment .course_memo_sentance_data').css('cursor' , 'default');
                    }
                    //비고
                    if(String.isNotBlank(Lia.p(item , 'properties' , 'comment'))) {
                        var comment = Lia.p(item , 'properties' , 'comment');
                        page.find('.course_memo_sentance.content_desc .course_memo_sentance_data').html(comment);

                    }


                    if( attributeList !=  undefined) {

                        var pcType = page.find('.course_divider_table.pc_show .type').empty();
                        var tmType = page.find('.course_divider_content .type').empty();

                        var pcPosition = page.find('.course_divider_table.pc_show .position').empty();
                        var tmPosition = page.find('.course_divider_content .position').empty();

                        var pcCareer = page.find('.course_divider_table.pc_show .career').empty();
                        var tmCareer = page.find('.course_divider_content .career').empty();

                        var positionCnt = 0;
                        var careerCnt = 0;
                        var fieldCnt = 0;
                        var totCnt = 0;

                        for (var idx in attributeList) {
                            var attr = attributeList[idx];
                            var attrId = Lia.p(attr, 'attribute_id');
                            var cateCode = Lia.p(attr, 'attribute_category_code');
                            var depth = Lia.p(attr, 'attribute_depth');
                            var name = Lia.p(attr, 'attribute_name');
                            var pp = $(document.createElement('p'));
                            var pp2 = $(document.createElement('p'));

                            //소속기관 핕터
                            if(cateCode == '소속기관' && depth == 1) {
                                totCnt ++;
                            }

                            name = Lia.pcd('-', name);

                            pp.text(name);
                            pp2.text(name);

                            //수정 바람
                            if(cateCode == '소속기관') {

                                if(name != '기타') {
                                    fieldCnt++;
                                }

                                if(depth == 2) {
                                    var parentId = fieldChild2ParentMap[attrId];
                                    fieldParentChildNumber[String(parentId)]--;

                                    pp.attr('parent_id' , parentId)
                                    pp2.attr('parent_id' , parentId)
                                } else {
                                    pp.attr('attr_id' , attrId)
                                    pp2.attr('attr_id' , attrId)
                                }

                                pcType.append(pp);
                                tmType.append(pp2);

                                continue;
                            }
                            if (cateCode == '직위') {
                                tmPosition.append(pp2);
                                pcPosition.append(pp);
                                positionCnt++;
                                continue;
                            }
                            if (cateCode == '경력') {
                                tmCareer.append(pp2);
                                pcCareer.append(pp);
                                careerCnt++;
                                continue;
                            }
                        }

                        //직위 모두 체크시
                        if(positionCnt == positionAttrListLength) {
                            pcPosition.empty();
                            tmPosition.empty();
                            var pp = $(document.createElement('p'));
                            var pp2 = $(document.createElement('p'));
                            pp.text('직위 무관');
                            pp2.text('직위 무관');
                            tmPosition.append(pp2);
                            pcPosition.append(pp);
                            page.enroll1 = true;
                        }

                        //경력 모두 체크시
                        if(careerCnt == careerAttrListLength) {
                            pcCareer.empty()
                            tmCareer.empty()
                            var pp = $(document.createElement('p'));
                            var pp2 = $(document.createElement('p'));
                            pp.text('경력 무관');
                            pp2.text('경력 무관');
                            tmCareer.append(pp2);
                            pcCareer.append(pp);
                            page.enroll2 = true;
                        }

                        //소속기관 유형 모두 체크 시
                        if(fieldCnt == fieldAttrListLength) {
                            pcType.empty()
                            tmType.empty()
                            var pp = $(document.createElement('p'));
                            var pp2 = $(document.createElement('p'));
                            pp.text('여성폭력 피해자 보호·지원시설 종사자 전체');
                            pp2.text('여성폭력 피해자 보호·지원시설 종사자 전체');
                            tmType.append(pp2);
                            pcType.append(pp);
                            page.enroll3 = true;
                        }

                        for(var i in fieldParentChildNumber) {
                            if(i >= 46 && fieldParentChildNumber[i] < 0) {
                                page.find('p[parent_id="' + i + '"]').remove();
                                page.find('p[attr_id="' + i + '"]').text(fieldDepth1Map[i] + ' 전체');
                            }
                        }


                    }



                    // //TODO : 수강신청 버튼 및 안내문구
                    //수강 대상자 판별(내정보 추가정보)
                    Requester.func(function() {
                        //사람모두 찼을 때
                        if(Number(courseMaxStudentCount) <= studentCount) {
                            var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                            jEnrollBtn.text('수강 인원이 마감되었습니다.');
                            jEnrollBtn.addClass('unavailable').off();
                            jEnrollBtn.on('click', function () {
                                PopupManager.alert('안내', '수강 인원이 마감되었습니다.');
                            })
                        }

                        switch (enrollStatus) {
                            case CourseStatus.WAITING: {
                                var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                                jEnrollBtn.text('수강 신청 기간이 아닙니다.');
                                jEnrollBtn.addClass('unavailable').off();
                                jEnrollBtn.on('click', function () {
                                    PopupManager.alert('안내', '현재는 해당과목의 수강신청기간이 아닙니다.');
                                })
                            }
                                break;
                            case CourseStatus.PENDING: {
                                var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                                jEnrollBtn.text('수강 신청 기간이 아닙니다.');
                                jEnrollBtn.addClass('unavailable').off();
                                jEnrollBtn.on('click', function () {
                                    PopupManager.alert('안내', '현재는 해당과목의 수강신청기간이 아닙니다.');
                                })
                            }
                                break;
                            case CourseStatus.OPERATING: {
                                var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                                jEnrollBtn.text('학습 중입니다.');
                                jEnrollBtn.addClass('unavailable').off();
                                jEnrollBtn.on('click', function () {
                                    PopupManager.alert('안내', '현재는 해당과목의 수강신청기간이 아닙니다.');
                                })

                            }
                                break;
                            case CourseStatus.MARK_REVIEWING: {
                                var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                                jEnrollBtn.text('점수 리뷰 중입니다.');
                                jEnrollBtn.addClass('unavailable').off();
                                jEnrollBtn.on('click', function () {
                                    PopupManager.alert('안내', '현재는 해당과목의 수강신청기간이 아닙니다.');
                                })
                            }
                                break;
                            case CourseStatus.REVIEWING: {
                                var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                                jEnrollBtn.text('복습 기간입니다.');
                                jEnrollBtn.addClass('unavailable').off();
                                jEnrollBtn.on('click', function () {
                                    PopupManager.alert('안내', '현재는 해당과목의 수강신청기간이 아닙니다.');
                                })
                            }
                                break;
                            case CourseStatus.FINISHED: {
                                if(page.anyTimeCourseReEnrollFlag != 1) {
                                    var jEnrollBtn = page.find('.course_header_info_buttons_enroll');
                                    jEnrollBtn.text('교육 종료');
                                    jEnrollBtn.addClass('unavailable').off();
                                    jEnrollBtn.on('click', function () {
                                        PopupManager.alert('안내', '현재는 해당과목이 종료되었습니다.');
                                    })
                                }
                            }
                                break;
                        }

                    });


                })

                //학습목차
                // Requester.awb(ApiUrl.Learning.GET_COURSE_LEARNING_CONTENT_LIST, {
                //         courseId : Lia.p(parameterMap , 'course_id'),
                //         includeCourseContentItemLesson: 1,
                //         isAvailable : 1
                //     } ,
                //     function(state, data) {
                //
                //         var contentList = Lia.p(data, 'body', 'list');
                //         var courseContentList = $('.course_index');
                //         // console.log(contentList);
                //
                //
                //         //contentList == empty 인 경우(어떤 차시나 주차도 등록되지 아니한 경우)
                //         if(contentList == undefined || contentList.length == 0) {
                //             var jItem = $('<p style="font-weight: bold; margin-top: 35px">등록된 강의가 존재하지 않습니다.</p>')
                //             courseContentList.append(jItem);
                //
                //         } else {
                //             var jTable = courseContentList.find('.course_index_table');
                //
                //             for(var idx in contentList) {
                //                 var contentItem = contentList[idx];
                //
                //                 var isOffline = Lia.p(contentItem, 'is_offline');
                //                 var typeCode = Lia.p(contentItem, 'type_code');
                //                 var subtitle = Lia.pd(Lia.p(contentItem, 'title'),Lia.p(contentItem, 'course_content_item_lesson', 'title'));
                //
                //                 var jTr = $('<tr><th class="course_index_num"></th><td class="course_index_type"><div class="type_badge"></div></td><td class="course_index_subtitle"></td><td class="course_index_time"></td></tr>')
                //                 jTr.find('.course_index_num').text(Number(idx) + 1);
                //                 jTr.find('.type_badge').text( CourseLearningContentType.getName(typeCode) );
                //                 jTr.find('.course_index_subtitle').text(subtitle);
                //
                //                 // TODO : 연동 필요
                //                 // jTr.find('.course_index_time').text('00:' + Math.floor(Math.random() * (30 - 10) + 10) + ':' + Math.floor(Math.random() * (30 - 10) + 10));
                //
                //                 jTable.append(jTr);
                //             }
                //
                //         }
                //     })
            })


        },
        loadTab: function () {
            var page = this;
            var jTabItem = page.find('.detail_tab_list .detail_tab_item');

            jTabItem.on('click', function (e){
               var jThis = $(this);
               var tabName = jThis.attr('tab-name');


               jTabItem.removeClass('current');
               jThis.addClass('current');

               var jTarget = page.find('article[tab-name='+ tabName +']');

               Lia.scrollTo(jTarget.position().top);


            });

        },
        enrollCourse : function(courseId, properties , reEnroll) {

            Requester.awb(ApiUrl.Learning.ENROLL, {
                courseId: courseId,
                isAuditing: 0,
                putOnWaitingList: 0,
                reEnrollIfEnrolled: reEnroll,
                properties : properties
            }, function (status, data , request) {

                if (!status) {
                    PopupManager.alertByResponse(data);
                    return;
                }

                PopupManager.alert('안내', '수강신청이 완료되었습니다.<br/>신청목록으로 이동하시겠습니까?', function () {
                    Lia.redirect('/page/lms', {
                        'm1': 'my_courses'
                    });
                }, function () {
                    Lia.refresh();
                });


            } , {
                autoPopup : false
            });

        }
    };
})();