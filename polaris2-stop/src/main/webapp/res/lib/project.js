

var Institution = {
    id : 1
}

var BoardId = {
    NOTICE: 47,
    DOWNLOAD: 23,
    QNA: 25,
    FAQ: 24,
    FOOTER_SLIDE : 240,

    CERTIFICATE : 700
};

var MenuId = {
    COURSE: 8
};


var CompanyPosition = {
    ETC : 10
};

var Project = {
};

var ProjectPopupUrl = {
    BANNER_POPUP : 'home/popup/banner_popup',
    BOARD_PASSWORD_POPUP : 'home/popup/board_password_popup',
    SELECT_PDF_TYPE : 'cms/popup/select_pdf_type',
    INTRO_VIDEO: 'home/popup/intro_video',
    COURSE_ATTACH_FILE : 'home/popup/course_attach_popup',
    ENROLL_CONFIRM_POPUP : 'home/popup/enroll_confirm_popup',
    COURSE_ENROLL_BASIC_POPUP : 'home/popup/course_enroll_basic_popup',

    COURSE_ENROLLMENT_CHECK_POPUP : 'cms/popup/course_enrollment_check_popup',
    COURSE_SEARCH_POPUP : 'home/popup/course_search_popup',
    FOOTER_TERMS_POPUP : 'home/popup/terms_of_service_popup',
    PASSWORD_EXPIRED : 'home/popup/password_expired'
};

var ProjectPageUrl = {
};

var ProjectApiUrl = {
    Print: {
        pdf: '/api/print/pdf_',
    },

    Stop : {
        generateConfirmCertificate : '/api/stop/generateConfirmCertificate',
        generateTrainingConfirmation : '/api/stop/generateTrainingConfirmation',
        requestResetPassword : '/api/stop/requestResetPassword'
    },

    Stat : {

        GET_COURSE_ENROLLMENT_SUMMARY_LIST_FOR_HISTORY: '/api/stat/getCourseEnrollmentSummaryListForHistory',
        EXPORT_COURSE_ENROLLMENT_SUMMARY_LIST_FOR_HISTORY : '/api/stat/exportCourseEnrollmentSummaryListForHistory',

        exportCourseSummaryList : '/api/stat/exportCourseSummaryList',
        getStatistics : '/api/stat/getStatistics',
        exportStatistics : '/api/stat/exportStatistics',
    }
};

var ProjectConstants = {
};

var PDFType = {
    TRAINING: 0, // 양성교육
    MAINTENANCE: 1, // 보수교육
    CONFIRMATION: 2 // 교육확인서
}

var UploadedFileCategory = {

    USER_RESOURCE: 1000,
    BOARD_ATTACHMENT: 2000,

    CONTENT: 3000,
    CONTENT_FTP: 3001,
    CONTENT_SFTP: 3002,

    STUDENT_WORK: 4000,
    HTML_EDITOR: 5000,
    PUBLIC: 6000,
    TEMPORARY: 9000
};

UploadManager.setDefaultSizeLimit(Configs.getConfig(Configs.MAX_FILE_SIZE));
UploadManager.setDefaultExtensionFilter(Configs.getConfig(Configs.ALLOWED_FILE_EXTENSION_LIST));

GradingMethodForm.setNormReferencedGrading(GradingMethodForm.NORM_REFERENCED_GRADING_NORMAL_LIST);
GradingMethodForm.setCriterionReferencedGrading(GradingMethodForm.CRITERION_REFERENCED_GRADING_NORMAL_LIST);
GradingMethodForm.setPassFailGrading(GradingMethodForm.PASS_FAIL_GRADING);

PathHelper.getContentUrl = function( url ) {

    if ( String.isBlank(url) ) {
        return url;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    var jLocation = $(location);
    var baseUrl = jLocation.attr('protocol') + '//' + jLocation.attr('host');

    return baseUrl + '/file/'  + url;
};

// 파일 받아오는 경로
PathHelper.getFileUrl = function (url, destFilename, ignoreDestFilename) {

    if (String.isBlank(url)) {
        return undefined;
    }

    if (url.startsWith('/res/')) {
        return url;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    var jLocation = $(location);
    var baseUrl = jLocation.attr('protocol') + '//' + jLocation.attr('host');
    // var baseUrl = 'https://edu.stop.or.kr'

    var fileParameterMap = {
        path: url
    };

    if (String.isNotBlank(destFilename)) {
        fileParameterMap['destFilename'] = destFilename;
    }

    if (ignoreDestFilename == true || ignoreDestFilename == 1) {
        fileParameterMap['ignoreDestFilename'] = 1;
    }

    return baseUrl + ApiUrl.File.GET + Lia.convertArrayToQueryString(fileParameterMap);
};

var CourseLayoutHelper = {
    getCourseImageUrl : function ( item ) {

        var courseImageUrl = Lia.p(Lia.convertStrToObj(Lia.p(item,'course_image_url')), 0, 'url');
        if ( String.isBlank(courseImageUrl) ) {
            courseImageUrl = '/res/home/img/stop/common/img_none.png';
        } else {
            courseImageUrl = PathHelper.getFileUrl(courseImageUrl);
        }


        return courseImageUrl;
    },
    renderCourseCardItem : function ( courseListItem ) {
        var jItem = $('                            <div class="home_card_item">\n' +
            '                                <div class="card_item_img">\n' +
            '                                    <div class="card_item_state">\n' +
                '                                       <div class="card_item_enroll">\n' +
                '                                       <div class="card_item_enroll_end">모집종료</div>\n' +
                '                                       <div class="card_item_enroll_ing">모집중</div>\n' +
                '                                       <div class="card_item_enroll_plan">모집예정</div>\n' +
                '                                       </div>'+
                '                                       <div class="card_item_state">'+
                '                                        <div class="card_item_state_online">온라인</div>\n' +
                '                                        <div class="card_item_state_offline">오프라인</div>\n' +
                '                                       </div>'+
            '                                    </div>\n' +
            '                                </div>\n' +
                '                                <div class="card_item_content">\n' +
                '                                    <div class="card_item_category">종사자 보수교육</div>\n' +
                '                                    <div class="card_item_title"></div>\n' +
                '                                </div>\n' +
                '                                <div class="card_item_info">\n' +
                '                                    <div class="card_item_info_period"></div>\n' +
                '                                    <div class="card_item_info_personnel"></div>\n' +
                '                                </div>\n' +
            '                            </div>')


        var imgUrl = CourseLayoutHelper.getCourseImageUrl(courseListItem)
            // JSON.parse(courseListItem.course_image_url)

        //VM10690:1 Uncaught SyntaxError: Unexpected token u in JSON at position 0
        jItem.find('.card_item_img').css('background-image' , 'url('+ imgUrl +')')

        jItem.find('.card_item_title')
            .text(Lia.p(courseListItem, 'service_title'));
        jItem.find('.card_item_info_period')
            .text(Lia.p(courseListItem, 'registration_start_date')+
                '~'+
                Lia.p(courseListItem, 'registration_end_date'));

        jItem.find('.card_item_info_personnel')
            .text('총 '+Lia.p(courseListItem, 'max_student_count')+'명');


        return jItem;
    },

};

Lia.UserBoardList.setCommonTheme(Lia.UserBoardList.Theme.Common.Full);
Lia.UserBoardList.setFaqTheme(Lia.UserBoardList.Theme.Faq.Normal);
Lia.UserBoardList.setListTheme(Lia.UserBoardList.Theme.List.Normal);
Lia.UserBoardList.setPagerTheme(Lia.UserBoardList.Theme.Pager.Normal);


var EmailHeper = {

    isValid: function (email) {
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        return regExp.test(email); // 형식에 맞는 경우 true 리턴
    },

    getId: function (email) {
        // var regExp = /
    },

    getHost: function (email) {

    }
}

Lia.setDebugMode(true);



CertificateHelper.issueSampleCertificate = function( options ) {

    var institutionId = options['institutionId'];
    var courseId = options['courseId'];

    var optionList = [];

    optionList.push({
        value : '0',
        name : '양성교육'
    });
    optionList.push({
        value : '1',
        name : '보수교육'
    });

    AjaxPopupHelper.radioSelect('교육 선택', optionList, undefined, function( val ) {

        if ( String.isBlank(val) ) {
            PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.NO_ITEM_HAS_BEEN_SELECTED) );
            return;
        }

        Requester.owb(ApiUrl.Document.GET_SAMPLE_COURSE_CERTIFICATE, {
            institutionId: institutionId,
            courseId: courseId,
            destFilename: Strings.getString(Strings.CERTIFICATE) + '.pdf',
            properties : JSON.stringify({
                credit : val
            })
        });
    } );


};

var UserCertificateType = {

    codeMap : {
        1 : '가정폭력방지상담원' ,
        2 : '성매매방지상담원',
        3 : '성폭력방지상담원',
        4 : '사회복지사' ,
        5 : '정신건강사회복지사',
        6 : '직업상담사',
        7 : '청소년상담/지도사' ,
        8 : '기타'
    },

    getName : function(code){
        return Lia.p(UserCertificateType.codeMap, code);
    }
};

var UserPositionType = {
    ETC : 10
};



CertificateHelper.issueCertificate = function( options ) {

    var page = this;
    var studentPage = options['studentPage'];

    var termCurriculumId = options['termCurriculumId'];
    var courseId = options['courseId'];
    var studentUserIdx = options['studentUserIdx'];

    var isTraining = page.isTraining = false; // 양성교육 여부
    var isMaintenance = page.isMaintenance = false; // 보수교육 여부


    Requester.awb(ApiUrl.Learning.GET_COURSE, {
        id : courseId
    }, function( status ,data ) {

        if ( !status ) {
            return;
        }

        var attributeList = page.attributeList = Lia.p(data,'body','attribute_list');
        var optionList = page.optionList =  {};

        if ( Array.isNotEmpty(page.attributeList) ) {

            for ( var i = 0, l = attributeList.length; i < l; i++ ) {

                var item = attributeList[i];
                var attributeId = Lia.p(item, 'attribute_id');

                // 양성교육 여부
                if(Lia.contains(attributeId, 16)) {
                    page.isTraining = ( page.isTraining || true );
                }

                // 보수교육 여부
                if(Lia.contains(attributeId, 17, 18, 19, 20, 21, 22)) {
                    page.isMaintenance = ( page.isMaintenance || true );
                }

            }
        }

        // 양성교육 여부
        if(page.isTraining) {
            page.pdfType = PDFType.TRAINING;
        }

        // 보수교육 여부
        if(page.isMaintenance) {
            page.pdfType = PDFType.MAINTENANCE;
        }

        // 인쇄 시간


        if (termCurriculumId == undefined) {


            if ( studentPage == 1 ) {

                AjaxPopupHelper.checkSurveyRequirement(
                    {
                        typeCode: SurveyRequestType.BEFORE_PRINTING_CERTIFICATE,
                        courseId: courseId,
                        courseTaskId: undefined
                    },
                    function (e) {

                        Requester.owb(ApiUrl.Document.GET_COURSE_CERTIFICATE, {
                            courseId: courseId,
                            targetUserIdx: studentUserIdx,
                            destFilename: Strings.getString(Strings.CERTIFICATE) + '.pdf'
                        });

                    });

            } else {

                Requester.owb(ApiUrl.Document.GET_COURSE_CERTIFICATE, {
                    courseId: courseId,
                    targetUserIdx: studentUserIdx,
                    destFilename: Strings.getString(Strings.CERTIFICATE) + '.pdf'
                });
            }


        } else {
            PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.ERROR_UNSUPPORTED_FUNCTION) );
        }

    });

};


Lia.UserBoardList.Field.RegisteredDate.attachToBoardList = function (jTable, jRow, boardContent) {

    var registeredDate = Lia.p(boardContent, 'registered_date');
    if (String.isNotBlank(registeredDate)) {
        registeredDate = Lia.formatDateWithSeparator(registeredDate, '.');
    }

    jRow.append('<td class="registered_date">' + registeredDate + '</td>');
};






UploadManager.createVideoUploader = function (options) {

    var serviceProviderCdnTypeCode = Server.serviceProviderCdnTypeCode;

    if (serviceProviderCdnTypeCode == CdnType.NONE) {
        return undefined;
    }

    var fileFormName = 'uploadfile';
    var form = Lia.p(options, 'form');
    var css = Lia.p(options, 'css');
    var addClass = Lia.p(options, 'addClass');

    return new Triton.Uploader({

        singleFileMode: true,

        maxFileSize: Configs.getConfig(Configs.MAX_VIDEO_FILE_SIZE),

        form: form,

        css: css,

        addClass: addClass,

        appendTo: Lia.p(options, 'appendTo'),

        fileFormName: fileFormName,

        uploadFilePathHandler: function (item) {
            return Lia.p(item, 'video_source');
        },

        openFileHandler: function (item) {
            PathHelper.load(item);
        },

        attachmentListSetter: function (uploader, attachmentList) {

            uploader.clear();

            if (Array.isEmpty(attachmentList)) {
                return;
            }

            for (var i = 0, l = attachmentList.length; i < l; i++) {

                var attachment = Lia.p(attachmentList, i);

                var newAttachment = {
                    url: Lia.pd(undefined, attachment, 'video_source'),
                    original_filename: Lia.pcd('동영상_파일', attachment, 'video_filename'),
                    video_status_code: Lia.p(attachment, 'video_status_code')
                };

                var attachmentSize = Lia.p(attachment, 'video_file_size');
                if (String.isNotBlank(attachmentSize)) {
                    newAttachment['size'] = attachmentSize;
                }

                uploader.add(newAttachment);
            }
        },

        attachmentListGetter: function (uploader) {

            var attachmentList = uploader.getFileList();

            if (Array.isEmpty(attachmentList)) {
                return attachmentList;
            }


            var list = [];

            for (var i = 0, l = attachmentList.length; i < l; i++) {

                var attachment = Lia.p(attachmentList, i);

                var newAttachment = {
                    video_status_code: Lia.p(attachment, 'video_status_code'),
                    video_source: Lia.p(attachment, 'url'),
                    video_filename: Lia.p(attachment, 'original_filename')
                };

                var attachmentSize = Lia.p(attachment, 'size');
                if (String.isNotBlank(attachmentSize)) {
                    newAttachment['video_file_size'] = attachmentSize;
                }

                list.push(newAttachment);
            }

            return list;

        },


        uploadHandler: function (thumbnailUploader, uploadUrl, jForm, jInput, parameterMap) {

            var popup = undefined;

            var filename = Lia.extractFilename(jInput.val());
            if (!FileHelper.isVideoFile(filename)) {
                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '동영상 파일을 업로드 해 주십시오. <br/>' +
                    '업로드 가능 확장자는 avi, mp4, mov, mkv 입니다.');
                return;
            }



            Requester.awb('/api/stop/getUploadData', {
            }, function( status ,data ) {

                if ( !status ) {
                    return;
                }

                if (Requester.isProgressSupported) {
                    popup = AjaxPopupManager.show(Lia.Popup.Progress.NAME, {}, {
                        jsFilePath: Lia.Popup.Progress.JS_FILE_PATH,
                        htmlFilePath: Lia.Popup.Progress.HTML_FILE_PATH
                    });
                } else {
                    LoadingPopupManager.show();
                }


                var uploadUrl = Lia.p(data,'body','upload_url')
                var parameterMap = {

                    // 동영상 제목
                    sessionNames : filename,
                    folderId : Lia.p(data,'body','folder_id'),
                    externalId : '',
                    cookie : ''
                };

                Requester.formUploadWithoutBlank(uploadUrl, parameterMap, jForm, function (status, data, request) {

                    var filename = request.object.filename;
                    var jInput = request.object.jInput;
                    var thumbnailUploader = request.object.thumbnailUploader;

                    LoadingPopupManager.hide();

                    if (Requester.isProgressSupported) {
                        var popup = request.object.popup;
                        popup.hide();
                    }

                    var boolResult = Lia.p(data, 'boolResult')
                    if (boolResult != true) {
                        PopupManager.alert('안내', '동영상 업로드에 실패하였습니다.');
                        return;
                    }

                    var item = Lia.p(data,'obj','list', 0);

                    var originalFilename = Lia.p(item, 'name');
                    var id = Lia.p(item, 'id');

                    thumbnailUploader.add({
                        url: id,
                        original_filename: originalFilename
                    });

                    jInput.val('');

                    if (thumbnailUploader.onUploaded != undefined) {
                        thumbnailUploader.onUploaded([{
                            url: id,
                            original_filename: originalFilename
                        }], thumbnailUploader);
                    }


                }, function (data, request) {

                    var popup = request.object.popup;
                    if (popup != undefined) {

                        if (!popup.isInited()) {
                            return;
                        }

                        var percent = Lia.pd(0, data, 'percentComplete');
                        if (popup.setPercent != undefined) {
                            popup.setPercent(percent);
                        }

                        if (!request.loadingShown) {

                            request.loadingShown = true;

                            if (percent >= 100) {
                                LoadingPopupManager.show();
                                popup.setMessage('동영상 서버로 파일 전송 중입니다...');
                            }
                        }
                    }

                }, {
                    filename: filename,
                    thumbnailUploader: thumbnailUploader,
                    jInput: jInput,
                    popup: popup,
                    autoLoading: false,
                    autoPopup: false
                });


            });


        },

        defaultFilename: '동영상',
        parameterMap: {}
    });
};


PlayerHelper.getVideoUrl =  function (parameterMap) {

    var videoUrl = '/page/player/panopto';
    return videoUrl + Lia.convertArrayToQueryString(parameterMap);
};

PlayerHelper.goToCDN =  function (parameterMap) {

    var videoUrl = 'https://kls.ap.panopto.com/Panopto/Pages/Viewer.aspx?id='+ Lia.p(parameterMap,'videoId');

    PopupManager.alert('안내',
        videoUrl,
        function() {

            Lia.open(videoUrl);

        }, function(){}, '이동', '닫기');
};



var YearHelper = {

    createTermYearList : function (includeAll) {

        var date = new Date();
        var year = date.getFullYear();
        var yearList = [];

        if (includeAll) {
            yearList.push({name: '연도 전체', value: ''});
        }

        for (var y = year, yl = 2021; y >= yl; y--) {
            yearList.push({name: y, value: y});
        }

        return yearList;
    }
};


if(Server.loggedIn == true) {
    var jNsso = $('<iframe frameborder="1" width="100%" scrolling="no"></iframe>').attr('src' , '/page/lms/nsso').css({
        'width' : '1px',
        'height' : '1px',
        'position' : 'absolute',
        'left' : '0',
        'top' : '0'});
    $('body').append(jNsso);
}


