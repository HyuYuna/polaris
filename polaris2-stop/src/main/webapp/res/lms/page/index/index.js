// 사이드 메뉴
{
    jQuery.UserBoardList.setPagerTheme(jQuery.UserBoardList.Theme.Pager.Normal);
    jQuery.UserBoardList.setCommonTheme(jQuery.UserBoardList.Theme.Common.Normal);
    jQuery.UserBoardList.setButtonTheme(jQuery.UserBoardList.Theme.Button.Normal);
    jQuery.UserBoardList.setListTheme(jQuery.UserBoardList.Theme.List.Normal);
    jQuery.UserBoardList.setFaqTheme(jQuery.UserBoardList.Theme.Faq.Normal);

    Triton.Responsive.init(false);

    Triton.Uploader.setMaxFileSize(UploadManager.getDefaultSizeLimit());
    Triton.Uploader.setAllowedExtensionList(UploadManager.getDefaultExtensionFilter());
    Triton.ThumbnailUploader.setMaxFileSize(UploadManager.getDefaultSizeLimit());
    Triton.ThumbnailUploader.setAllowedExtensionList(UploadManager.getDefaultExtensionFilter());

    Triton.Board.setUseUserOpenPopup(false);

    Triton.Board.setRequester(Requester);

    PopupManager.setBindingTitleDrag(true);
    var pageConstructorType = PageConstructor.TYPE_3;
    var tabStorageKey = 'VSQUARE_LMS';
    if (tabStorageKey != undefined) {
        tabStorageKey += ':' + UserManager.getId()
    }

    PageConstructor.init({
        appendTo: $('body'),
        menuOpened: Configs.getConfig(Configs.MENU_OPENED),
        type: pageConstructorType,
        fixedTabList: [
            {
                text: Strings.getString(Strings.MENU_TITLE.DASHBOARD),
                parameterMap: {m1: 'home'},
                path: 'home'
            }
        ],
        tabStorageKey: tabStorageKey,
        unuseTab: false,
        useStatusBar: true,
        statusBar: {
            name: Server.userName,
            lastLoginIpAddress: Server.lastLoginIpAddress,
            lastLoginDate: Server.lastLoginDate,
            currentDate: Server.currentDate,
            // onNameClick: function () {
            //     PageManager.go(['myinfo']);
            // },
            info: Server.departmentName,
            onInfoClick: String.isNotBlank(Server.departmentHomepageUrl) ? function () {
                Requester.open(Server.departmentHomepageUrl)
            } : undefined

        }
    });
    PageConstructor.setMenuShowChecker(function (menu, depth) {

        var name = Lia.p(menu, 0);
        if (Lia.contains(menu, 'home', 'myinfo')) {
            return false;
        }

        return true
    });

    var mainPageUrl = 'home';

    PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_MORE, {});

    // PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_ALARM_BUTTON, {});

    // PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_EMAIL_BUTTON, {
    //     onClick: function () {
    //         PageManager.go(['myinfo']);
    //     }
    // });

    // var emailUrl = Lia.p(PolarisSettings, 'FunctionFlag', 'emailUrl');
    // if ( String.isNotBlank(emailUrl) ) {
    //
    //     PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_EMAIL_BUTTON, {
    //         onClick: function () {
    //             Lia.redirect(emailUrl)
    //         }
    //     });
    // }

    var logoImageUrl = PolarisSettings.Logo.logoImageUrl;
    if (String.isNotBlank(Server.serviceProviderLogoImageUrl)) {
        logoImageUrl = PathHelper.getFileUrl(Server.serviceProviderLogoImageUrl);
    }

    PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_LOGO, {
        logoImageUrl: logoImageUrl,
        logoImageHeight: ProjectSettings.Logo.logoImageHeight,
        mobileLogoImageHeight: ProjectSettings.Logo.mobileLogoImageHeight,
        onClick: function () {
            PageManager.go([mainPageUrl]);
        }
    });

    PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_MENU_BUTTON, {});

    // PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_BUTTON, {
    //     iconImageUrl: PageConstructor.HeaderMenuButtonImageUrl.MYPAGE,
    //     text: Strings.getString(Strings.MENU_TITLE.MY_PROFILE),
    //     onClick: function () {
    //         PageManager.go(['myinfo']);
    //     }
    // });


    if (String.isNotBlank(Server.serviceProviderHomepageUrl)) {

        PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_BUTTON, {
            iconImageUrl: PageConstructor.HeaderMenuButtonImageUrl.HOMEPAGE,
            text: Strings.getString(Strings.MENU_TITLE.HOMEPAGE),
            onClick: function () {

                Lia.redirect(Server.serviceProviderHomepageUrl);
            }
        });
    }

    PageConstructor.setHeaderElement(PageConstructor.HEADER_ELEMENT_BUTTON, {
        iconImageUrl: PageConstructor.HeaderMenuButtonImageUrl.EXIT,
        text: '나가기',
        onClick: function () {
            PageManager.redirect('/');
        }
    });


    var studentMenuList = [];

    studentMenuList.push({
        'text': Strings.getString(Strings.MENU_TITLE.MY_PROFILE),
        'menu': ['myinfo'],
        'markPrefixList': ['myinfo_edit']
    });

    studentMenuList.push({
        'text': Strings.getString(Strings.MENU_TITLE.DASHBOARD),
        'menu': ['home']
    });


    studentMenuList.push({
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5_pressed.png',
        'text': '교육신청',
        'redirectUrl': '/?m1=courses&menu_id=8'
    });

    studentMenuList.push({

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2_pressed.png',
        'text': Strings.getString(Strings.MENU_TITLE.IN_PROGRESS),
        'menu': ['my_courses']
    });

    if (Configs.getConfig(Configs.AUDITING)) {

        studentMenuList.push({
            'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico8.png',
            'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico8_pressed.png',
            'text': Strings.getString(Strings.MENU_TITLE.AUDITING),
            'menu': ['auditing_courses']
        });
    }

    studentMenuList.push({
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico12.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico12_pressed.png',
        'text': '수료관리',
        'menu': ['completed_courses']
    });

    studentMenuList.push({
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6_pressed.png',
        'text': '교육확인서 발급관리',
        'menu': ['certificate'],
        'markPrefixList': [
            'certificate',
            'certificate_write',
            'certificate_detail'
        ]
    });

    var myActivitySubMenuList = [];

    myActivitySubMenuList.push({
        'menu': ['student/survey'],
        'text': Strings.getString(Strings.MENU_TITLE.MY_SURVEY),
        'markPrefixList': [
            'student/survey_detail'
        ]
    });


    myActivitySubMenuList.push({
        'menu': ['student/announcement'],
        'text': Strings.getString(Strings.MENU_TITLE.MY_COURSE_ANNOUNCEMENTS),
        'markPrefixList': [
            'student/announcement_detail'
        ]
    });

    if (Configs.getConfig(Configs.LEARNING_MENU_TASKS)) {

        myActivitySubMenuList.push({
            'menu': ['student/course_task'],
            'text': Strings.getString(Strings.MENU_TITLE.MY_COURSE_TASKS),
        });
    }

    myActivitySubMenuList.push({
        'menu': ['student/my_notes'],
        'text': Strings.getString(Strings.MENU_TITLE.MY_NOTES_AND_BOOKMARKS),
    });
    myActivitySubMenuList.push({
        'menu': ['student/my_qna'],
        'text': Strings.getString(Strings.MENU_TITLE.MY_QUESTIONS),
        'markPrefixList': [
            'student/my_qna_detail'
        ]
    });
    myActivitySubMenuList.push({
        'menu': ['student/content_error_notify'],
        'text': Strings.getString(Strings.MENU_TITLE.MY_CONTENT_ERROR_REPORTS),
        'markPrefixList': [
            'student/content_error_notify_detail'
        ]
    });

    studentMenuList.push({

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico4.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico4_pressed.png',
        'text': '모아보기(설문함 등)',
        'menu': ['student'],
        'subMenuList': myActivitySubMenuList
    });

    studentMenuList.push({

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10_pressed.png',

        'text': ['학습지원'],
        'subMenuList': [

            {
                'text': Strings.getString(Strings.MENU_TITLE.ANNOUNCEMENTS),
                'redirectUrl': '/?m1=page&menu_id=22'
            },
            {
                'text': Strings.getString(Strings.MENU_TITLE.RESOURCES),
                'redirectUrl': '/?m1=page&menu_id=13'
            }, {
                'text': Strings.getString(Strings.MENU_TITLE.FAQ),
                'redirectUrl': '/?m1=page&menu_id=14'
            }, {
                'text': Strings.getString(Strings.MENU_TITLE.QNA),
                'redirectUrl': '/?m1=page&menu_id=15'
            },
        ]
    });

    studentMenuList.push({
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico13.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico13_pressed.png',
        'text': '학습자 메뉴얼',
        'openUrl' : '/res/data/한국여성인권진흥원_교육생매뉴얼(211103).pdf'
    });

    // PageConstructor.add({
    //     'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu_note.png',
    //     'text': '쪽지',
    //     'menu': ['note'],
    //     'markPrefixList': [
    //         'note_send',
    //         'note_detail',
    //         'sent_note',
    //         'sent_note_detail'
    //     ]
    // });

    studentMenuList.push({

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15_pressed.png',

        'text': Strings.getString(Strings.MENU_TITLE.LOGOUT),
        'menu': ['logout']
    });

    for (var key in studentMenuList) {
        PageConstructor.add(studentMenuList[key]);
    }

    jQuery(window).resize(PageConstructor.resize).resize();
}


Triton.ContextMenuPopupManager.setJAppendTo($('#popup_layout_list'));
ContextMenuHelper.initUser();

var AjaxPopupManager = $.AjaxPopupManager;
AjaxPopupManager.init({

    popupListLayoutSelector: '#popup_layout_list',

    //requester : Requester,

    cssLoading: false,
    htmlLoading: true,
    jsLoading: true,

    caching: undefined,

    filePathCachingHandler: function (path, parameterMap, contentType) {
        return true;
    },

    filePathFormatHandler: function (path, parameterMap) {
        return path;
    },
    cssFilePathFormatHandler: function (path, parameterMap) {
        return '/res/' + path + '.css';
    },
    htmlFilePathFormatHandler: function (path, parameterMap) {
        return '/res/' + path + '.html';
    },
    jsFilePathFormatHandler: function (path, parameterMap) {
        return '/res/' + path + '.js';
    },

    onPopupInit: function (jLayout, path, object, jPopupListLayout) {

        Strings.applyStrings(jLayout);

        PopupHelper.bindTitleDrag(jLayout.find('.popup'), jLayout.find('.popup_title'));

    }
});

var Page = {};

var PageManager = $.PageManager;
PageManager.init({

    requester: Requester,

    onPageChangeStart: function () {

    },

    onPageChangeEnd: function () {
    },

    onSameCheck: function (parameter) {

        var m1 = Lia.p(parameter, 'm1');
        return true;
    },

    onMoveCheck: function (parameter) {

        var m1 = PageManager.getParameter('m1');
        var m2 = PageManager.getParameter('m2');
        var moveM1 = parameter['m1'];
        var m1List = m1.split('/');
        var moveM1List = undefined;
        if (!String.isNullOrWhitespace(moveM1))
            moveM1List = moveM1.split('/');

        if (m1List != undefined && m1List.length > 0 && moveM1List != undefined && moveM1List.length > 0 && m1List[0] == moveM1List[0]) {
            var cm = PageManager.getParameter('cm');
            if (String.isNullOrWhitespace(parameter['cm']) && !String.isNullOrWhitespace(cm)) {
                parameter['cm'] = cm;
            }
        }

        if (parameter['m1'] == 'logout') {

            if (Server.isMasterLoggedIn == true) {

                Requester.awb(ApiUrl.User.LOGOUT_ANOTHER_USER, {}, function (status, data) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    MobileAppHelper.onLoggedOut(null, function () {
                        Lia.redirect('/page/cms');
                    });

                }, {
                    autoLoading: false
                });

            } else {

                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.CONFIRM_LOGOUT), function () {

                    var jLocation = $(location);
                    var baseUrl = jLocation.attr('protocol') + '//' + jLocation.attr('host');

                    Lia.redirect(PageUrl.LOGOUT, {redirectUrl: baseUrl});

                    // TODO
                    // Requester.ajaxWithoutBlank(ApiUrl.User.LOGOUT, {}, function (status, data, request) {
                    //
                    //     MobileAppHelper.onLoggedOut(null, function () {
                    //     });
                    // });


                }, true);
            }

            return false;
        }

        return true;
    },

    onPageCheck: function (parameter) {
        return true;
    },

    onPageInit: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {
        Strings.applyStrings(jPage);
    },

    onProgress: function (status, parameterMap, beforeParameterMap) {

        if (status == PageManager.Status.START) {

            LoadingPopupManager.show();

            PageConstructor.mark(parameterMap, beforeParameterMap);

            PageManager.setTitle(Server.serviceProviderName + ' :: ' + PageConstructor.getCurrentMenuName(), true);

        } else if (status == PageManager.Status.ERROR) {

            Requester.func(function () {
                Requester.func(function () {
                    Requester.func(function () {
                        Requester.func(function () {
                            Requester.func(function () {

                                Triton.Responsive.apply(true);
                                LoadingPopupManager.clear();

                            });
                        });
                    });
                });
            });


        } else if (status == PageManager.Status.SUCCESS) {

            var url = undefined;
            var page = PageManager.getPage();
            if (page != undefined) {

                try {
                    if (typeof page.getServicePageUrl == 'function') {
                        url = page.getServicePageUrl();

                    }
                } catch (e) {
                    alert('URL error Occured');
                }


                Requester.func(function () {
                    Requester.func(function () {
                        Requester.func(function () {
                            Requester.func(function () {
                                Requester.func(function () {

                                    Triton.Responsive.apply(true);
                                    LoadingPopupManager.clear();

                                });
                            });
                        });
                    });
                });
            }

            // PageConstructor.setHeaderElement(
            //     PageConstructor.HEADER_ELEMENT_SERVICE_PAGE,
            //     ServicePageHelper.lms());

            if (typeof polaris2footer != 'undefined' && polaris2footer != undefined) {
                polaris2footer();
            }
        }

    },
    onNormalizeParameter: function (data) {

        if (String.isBlank(data['m1'])) {
            data['m1'] = mainPageUrl;
        }

        return PageConstructor.onNormalizeParameter(data);
    },

    filePathFormatHandler: function (path, data, depth) {

        var m1 = data['m1'];
        var m2 = data['m2'];
        var m3 = data['m3'];

        return path;
    },

    cssFilePathFormatHandler: function (path, data, depth) {
        // return undefined;
        return '/res/lms/page/index/' + path + '.css';
    },
    htmlFilePathFormatHandler: function (path, data, depth) {
        // return undefined;
        return '/res/lms/page/index/' + path + '.html';
    },
    jsFilePathFormatHandler: function (path, data, depth) {
        return '/res/lms/page/index/' + path + '.js';
    },

    cssLoading: false,
    htmlLoading: false,
    parameterPostfixAdding: true,
    title: Server.serviceProviderName,
    pageParameterNameList: [
        'm1', 'm2', 'm3', 'm4'
    ],
    pageContainerSelectorList: [
        '.page1', '.page2', '.page3', '.page4'
    ]
});


