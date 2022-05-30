
LoadingPopupManager.init();
AjaxPopupHelper.setAgreementPopupUrl(LmsPopupUrl.REGISTER_AGREEMENT);

$.setFileUploaderHtml('<div style="overflow:hidden;position:relative;color:#707070;width:100%;height:54px; ">\n    ' +
    '<div style="background:#ffffff;line-height:54px;border:1px solid #7147a9;height:50px;color: #7147a9; box-sizing: border-box;font-size:14px;height:54px;font-family:notokr-regular;text-align:center; cursor: pointer;">\n        ' +
    '<span>파일추가</span>' +
    '</div>\n    ' +

    '<div style="position:absolute;left:0;top:0; cursor: pointer;">\n        <form method="post" enctype="multipart/form-data">' +
    '<input type="hidden" name="categoryCode" value="' + UploadedFileCategory.BOARD_ATTACHMENT + '"/>' +
    '<input\n                type="file" name="file" style="font-size:999px;opacity:0;filter: alpha(opacity=0);"/></form>\n    </div>\n' +
    '</div>\n' +

    '<div class="file_uploader_list">' +
    '</div>');

$.setFileUploaderAttachmentHtml('<div class="file_uploader_item" style="clear:both;cursor:pointer;background-color:#f8f8f8;margin-top:16px;position:relative;">' +
    '<span class="file_uploader_content">파일첨부</span><span class="file_uploader_item_name ellipsis"></span></div>');

$.setFileUploaderAttachmentDeleteButtonHtml('<img class="file_uploader_item_delete_button" style="position:absolute;right:20px;top:50%; transform: translate(0, -50%);" src="/res/home/img/stop/common/btn_cancel.png" />');

var VIEWPORT = {
    init: function () {
        var windowWidth = window.outerWidth;
        var jViewport = $('meta[name=viewport]');

        if(windowWidth >= 1280 && windowWidth < 1440) {
            jViewport.attr('content','width=device-width, initial-scale=0.89, maximum-scale=0.89, minimum-scale=0.89');
        } else {
            jViewport.attr('content','width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0');
        }

        $(window).on('resize', function () {
            var windowWidth = screen.width;
           VIEWPORT.onResize(windowWidth);
        });
    },
    onResize: function (windowWidth) {
        var jViewport = $('meta[name=viewport]');
        if(windowWidth >= 1280 && windowWidth <= 1441) {
            jViewport.attr('content','width=device-width, initial-scale=0.89, maximum-scale=0.89, minimum-scale=0.89');
        } else {
            jViewport.attr('content','width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0');
        }
    }
}

VIEWPORT.init();


var MENU_SCROLL = {
    init: function () {
        var jSubMenu = $('.common_menu_wrapper');

        $('body').on('scroll', function (e){
            var top = $(this).scrollTop();
            MENU_SCROLL.effect(jSubMenu, top);
        });
    },
    effect: function (jSubMenu, top) {
        if(top <= 112) {
            jSubMenu.css({
                'top': 112 - top,
                'border-top': '1px solid #ccc',
                'border-bottom': 'none'
            });
        } else {
            jSubMenu.css({
                'top': 0,
                'border-top': 'none',
                'border-bottom': '1px solid #ccc'
            });
        }
    }
}

MENU_SCROLL.init();


var TIMER = {
    j: $('<div class="header_active_time pc_show">\n' +
        '    <span class="time_digit"></span>\n' +
        '    <button class="time_extension"><span>연장</span></button>\n' +
        '</div>'),
    
    minute: 60, // 기본값 60분
    second: 0,

    counting: false,
    tick: [],

    init: function (minute, second) {
        if(String.isNotBlank(minute) && String.isNotBlank(second)) {
            TIMER.minute = minute;
            TIMER.second = second;
        }

        // 타이머 이벤트
        TIMER.j.find('.time_extension').on('click', {jTime: TIMER.j}, function (e) {

            TIMER.baseDate = new Date();
            TIMER.renderTime();
        });

        return TIMER.j;
    },

    renderTime : function() {

        var totalSecond = 60 * TIMER.minute + TIMER.second;

        var currentDate = new Date();

        var d = currentDate.getTime() - TIMER.baseDate.getTime();

        if ( d >= 0 ) {

            var remain = totalSecond - Math.floor(d / 1000);


            var minutes = Math.floor(remain/ 60);
            var seconds = remain % 60;

            if ( minutes < 10 ) {
                minutes = '0' + minutes;
            }

            if ( seconds < 10 ) {
                seconds = '0' + seconds;
            }

            TIMER.j.find('.time_digit').text(minutes + ':' + seconds);
        }

        if ( remain <= 0 ) {

            Lia.redirect('/page/user/logout', {
                'redirectUrl': '/'
            });
        }
    },

    startCounting: function (jTime) {

        if(TIMER.counting == true) {
            // 이미 카운팅을 하고 있었을 때
            // Do nothing
        } else {
            // 카운팅을 개시 할 때
            TIMER.counting = true;

            TIMER.baseDate = new Date();

            setInterval(function() {

                TIMER.renderTime();

            }, 500);


        }

    }

};


var INDEX = {

    init: function () {

        // 페이지 실행 시 초기화
        PageLinkHelper.applyPageLink();

        INDEX.setHeader();
        INDEX.setMenuList();
        INDEX.setFooterLinks();
        INDEX.setMobileMenu();

        // 관리자 로그인 시 처리
        // if(Server.userRoleCode == UserRole.ADMIN || Server.userRoleCode == UserRole.INSTITUTION_ADMIN) {
        //     if(window.sessionStorage.getItem('goms') == undefined || window.sessionStorage.getItem('goms') == 'true') {
        //         PopupManager.alert('안내', '관리자로 로그인 하셨습니다. 관리자 모드로 전환할까요?', function () {
        //             Lia.redirect('/page/cms');
        //             window.sessionStorage.setItem('goms', false);
        //         }, function () {
        //             window.sessionStorage.setItem('goms', false);
        //             return;
        //         }, '예', '아니오');
        //     }
        // }

        // 선생님 / 튜터 로그인 시 처리
        if(( Lia.contains(Server.userRoleCode, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT) )) {
            if(PageManager.pc('goms') == true || PageManager.pc('goms') == undefined) {
                PopupManager.alert('안내', '강사/튜터로 로그인 하셨습니다. 강사/튜터모드로 전환할까요?', function () {
                    Lia.redirect('/page/lms');
                }, function () {
                    PageManager.cpcpm({
                        goms: false
                    })
                    return;
                }, '예', '아니오');
            }
        }

        $('.common_submenu_list').hide().on('mouseleave' , function() {
            var jThis = $(this);
            jThis.removeClass('showing');
            jThis.hide();
        });


    },
    setHeader: function () {
        //최상단 헤더 이벤트 리스너
        //한국 여성인권진흥원 로고 클릭
        $('.common_header .nav_logo').on('click' , function (e) {
            PageManager.go(['home'] , {});
        })

        $('.header_title').on('click', function (e) {
            PageManager.go(['home'] , {});
        })

        $('.nav_search_input').blur(function() {

        })
        $('.nav_search_input').keydown(function (e){
            if(e.keyCode == 13) {
                var jThis = $(this);
                var search = jThis.val();

                PageManager.go(['courses'] , {menu_id : MenuId.COURSE, searchOptionString : search});
            }
        })

        $('.header_top_search .nav_btn_search').on('click' ,function (e){
            if(screen.width > 1290) {
                var jThis = $('.nav_search_input');
                var search = jThis.val();

                PageManager.go(['courses'], {menu_id: MenuId.COURSE, searchOptionString: search});
            } else {
                AjaxPopupManager.show(ProjectPopupUrl.COURSE_SEARCH_POPUP,{});
            }
        })


        var loggedIn = Server.loggedIn
        // console.log(loggedIn)


        if(loggedIn) {

            //로그인 되있다면
            var jNavWrapper = $('.header_top_nav_wrapper').empty();
            var jNavItem = $('<div class="header_top_nav">로그아웃</div>');
            // var jNavItem = $('<div class="header_top_nav login">로그아웃</div>');
            var jDivider = $('<div class="header_top_line"></div>');


            jNavItem.on('click' , function (e) {
                //로그아웃
                Lia.redirect('/page/user/logout', {
                    'redirectUrl': '/'
                });
            })
            // jNavWrapper.append(jDivider);
            //jNavWrapper.append(jNavItem);

            if(Lia.contains(Server.userRoleCode, UserRole.STUDENT, UserRole.STUDENT)) {
                var jMyInfo = $('<div class="header_top_nav login">내정보</div>');

                jMyInfo.on('click' , function(e) {
                    PageManager.go(['/user/check_pw']);
                })

                jNavWrapper.append(jMyInfo);
                jNavWrapper.append(jDivider);
                jNavWrapper.append(jNavItem);

            }
            if(Lia.contains(Server.userRoleCode, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT)) {
                var jNavItemTeacher = $('<div class="header_top_nav teacher">강사/튜터 모드</div>');
                //&nbsp;&nbsp;&nbsp;
                jNavItemTeacher.on('click', function (e){
                    Lia.redirect('/page/lms');
                });
                jNavWrapper.append(jNavItemTeacher);
                jNavWrapper.append(jDivider);
                jNavWrapper.append(jNavItem);
            }

            if(Lia.contains(Server.userRoleCode, UserRole.ADMIN, UserRole.INSTITUTION_ADMIN) ) {
                // var jNavItemAdmin = $('<div class="header_top_nav admin">관리자 모드</div>');
                // // &nbsp;&nbsp;&nbsp;
                // jNavItemAdmin.on('click', function (e){
                //     Lia.redirect('/page/cms');
                // });
                // jNavWrapper.append(jNavItemAdmin);
                // jNavWrapper.append(jDivider);
                jNavWrapper.append(jNavItem);

            } else {


                var jTime = TIMER.init();
                jNavWrapper.append(jTime);
                TIMER.startCounting(jTime);
            }


        } else {
            var jLogin = $('.header_top_nav.login');
            var jRegister = $('.header_top_nav.signup');

            jLogin.on('click' , function (e) {
                PageManager.go(['/user/login']);
            });
            jRegister.on('click' , function(e) {
                PageManager.go(['/user/join1'])
            });
        }

    },

    setMenuList: function () {

        // 메뉴 리스트로 초기화
        //var page = this.page
        MenuManager.setMenuList( Lia.p(MENU_LIST, 'list') );

        var list = MenuManager.getMenuList();
        if(list != undefined) {
            var childList = list[0].child_list
            var jCommonMenuList = $('.common_menu_list').empty();

            for(var idx in childList) {
                var commonListItem = childList[idx];
                var jCommonListItem = $('<li class="common_menu_item">' + commonListItem.title + '</li>');
                var menuId = Lia.p(commonListItem, 'id');

                jCommonListItem.attr('menu_id', menuId)
                var menu = MenuManager.getMenu(menuId);
                if(menu.hasOwnProperty('child_list')) {
                    jCommonListItem.off().on('mouseenter', {
                        menuId: menuId
                    }, function (e) {
                        var jThis = $(this);
                        //마우스 오버시 색상변환
                        $('.common_menu_item').removeClass('clicked');
                        $('.common_submenu_list').removeClass('showing');
                        jThis.addClass('clicked');
                        
                        var menuId = e.data.menuId;
                        $(this).toggleClass('focus');
                        //서브 메뉴 찍기
                        INDEX.setSubMenuList(menuId, $(this));
                    })
                    jCommonListItem.on('mouseleave' , function () {
                        var jThis = $(this);
                    })
                } else {
                    jCommonListItem.off().on('click', {
                        menuId: menuId
                    }, function (e) {
                        var jThis = $(this);
                        var menuId = e.data.menuId;
                        $(this).toggleClass('focus');
                        INDEX.setSubMenuList(menuId, $(this));
                    })
                    
                    //마우스 오버시 색상 변환
                    jCommonListItem.on('mouseenter' , function() {
                        var jThis = $(this)
                        $('.common_menu_item').removeClass('clicked');
                        $('.common_submenu_list').removeClass('showing');
                        $(this).addClass('clicked');

                    })
                    jCommonListItem.on('mouseleave' , function() {
                        var jThis = $(this)
                        $('.common_menu_item').removeClass('clicked');
                    })
                }

                jCommonMenuList.append(jCommonListItem);

            }
        }

        initPage();

        INDEX.setMenuId( PageManager.pc('menu_id') );
    },

    setSubMenuList: function(menuId, jMenu) {

        var menu = MenuManager.getMenu(menuId);
        var jSubmenuList = $('.common_submenu_list').empty();
        var menuContentType = Lia.p(menu, 'content', 'type_code');



        if(menu.hasOwnProperty('child_list')) {
            // 위치 옮기기
            var leftPos = jMenu.offset().left;
            var offset = -100 + jMenu.width() / 2;

            jSubmenuList.toggleClass('showing');
            jSubmenuList.css('left', leftPos + offset + 'px');
            jSubmenuList.fadeIn('fast');

            // 서브 메뉴 뿌리기
            var childList = menu['child_list'];
            var idx, jSubMenuItem,childMenu;
            for(idx in childList) {
                childMenu = childList[idx];
                jSubMenuItem = $('<li class="common_submenu_item" menu-id="'+ Lia.p(childMenu, 'id') +'">' + Lia.p(childMenu, 'title') + '</li>');
                jSubMenuItem.on('click', function (e){
                   var jThis = $(this);
                    //클릭시 메뉴 색상 변경
                   $('.common_menu_wrapper .common_menu_list .common_menu_item').removeClass('clicked');

                    var menuId = jThis.attr('menu-id');
                    if(menuId == 15) {

                        // 1:1 문의
                        if(!Server.loggedIn) {
                            PopupManager.alert('안내', '로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?', function () {
                                PageManager.go(['user/login']);
                                return;
                            }, function () {
                                PageManager.go(['home']);
                                return;
                            }, '확인', '취소');
                        } else {
                            PageManager.go(['page'], { 'menu_id': menuId });
                        }

                    } else {
                        PageManager.go(['page'], { 'menu_id': menuId });
                    }


                    jSubmenuList.hide();
                });
                jSubmenuList.append(jSubMenuItem);
            }
        } else {
            if(menuContentType == MenuContentType.LINK) {
                // TODO : 하드코딩
                var menuId = Lia.p(menu, 'id');
                var menuLinkUrl = Lia.p(menu, 'content', 'data');
                // 나의 강의실 인 경우
                if(menuId == 16) {
                    if(!Server.loggedIn) {
                        // 로그인 여부 부터 조사
                        PopupManager.alert('안내', '로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?', function () {
                            PageManager.go(['user/login']);
                        }, function () {
                            PageManager.go(['home']);
                        }, '확인', '취소');
                    } else {
                        // 학습자가 아닌 경우에 조사
                        if(Lia.contains(Server.userRoleCode, UserRole.ADMIN,UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT)) {
                            PopupManager.alert('안내', '학습자가 아닙니다.');
                            return;
                        } else {
                            PageManager.redirect(menuLinkUrl);
                            return;
                        }
                    }
                } else {
                    // Requester.owb(menuLinkUrl);
                    PageManager.redirect(menuLinkUrl);
                }
            } else {
                if(menuId == 8) {
                    PageManager.go(['courses'] , {'menu_id': menuId});
                    return;
                } else {
                    PageManager.go(['page'], {'menu_id': menuId});
                    //교육신청 라우팅 하드코딩
                }
            }
        }
    },

    setFooterLinks : function () {
        $('.footer .footer_logo').on('click' , function(e) {
            PageManager.redirect('/',{'redirectUrl': '/'})
        })

        $('.footer_sns .fb').on('click' , function (e) {
            window.open('https://www.facebook.com/wrstar');
        })
        $('.footer_sns .twit').on('click' , function (e) {
            window.open('https://twitter.com/search?q=whrik2009');
        })
        $('.footer_sns .you').on('click' , function (e) {
            window.open('https://www.youtube.com/channel/UCicENtEiT1hcvAOKJqztyYg');
        })
    },

    setMenuId : function( menuId ) {

        // 메뉴 설정되었을 때 초기화

        MenuManager.setMenuId(menuId);

    },

    setMobileMenu : function () {

        var jMobileBtn = $('.common_menu_icon.mobile');
        var jPcBtn = $('.common_sitemap');
        var jMobileMenuClose = $('.womens_menu_wrapper .header_close');
        var jMobileMenu = $('.womens_menu_wrapper');

        if(jMobileMenu.css('display') == 'none'){
            // $('body').css('overflow-y', 'scroll');
        }
        jMobileBtn.on('click', function (e) {
                jMobileMenu.css('display', 'block');
                // $('body').css('overflow-y', 'hidden');

                jMobileMenuClose.on('click', function (e) {
                    jMobileMenu.css('display', 'none');
                    // $('body').css('overflow-y', 'scroll');
                })



                // var loggedIn = UserManager.loggedIn;
                var loggedIn = Server.loggedIn;

                //비로그인 회원전용 뷰 <-> 회원전용 뷰 전환
                if(loggedIn) {
                    Requester.awb(ApiUrl.User.GET_USER_PROFILE, {}, function (status, data) {
                        if(!status) { return; }

                        var body = Lia.p(data, 'body');
                        var userName = Lia.pd('-', body, 'name');

                        $('.womens_header_basic').css('display' , 'none');
                        $('.womens_header_login').css('display', 'block');

                        //이름 정의
                        $('.womens_member_name').find('span').text(userName);

                        //권한 따라 ui 변경
                        if(Lia.contains(Server.userRoleCode, UserRole.STUDENT, UserRole.STUDENT)) {
                            $('.womens_member_content .womens_member_info').text('내정보')
                        } else if(Lia.contains(Server.userRoleCode, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT)) {
                            $('.womens_member_content .womens_member_info').text('강사/튜터 모드')
                        } else if(Lia.contains(Server.userRoleCode, UserRole.ADMIN, UserRole.INSTITUTION_ADMIN)) {
                            // $('.womens_member_content .womens_member_info').text('관리자 모드')
                        }
                        $('.womens_member_content .womens_member_info').on('click' , function(e) {
                            //마이페이지
                            //TODO
                            if(Lia.contains(Server.userRoleCode, UserRole.STUDENT, UserRole.STUDENT)) {
                                PageManager.go(['/user/check_pw']);
                                jMobileMenu.css('display' , 'none');
                            } else if(Lia.contains(Server.userRoleCode, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT)) {
                                Lia.redirect('/page/lms');
                                jMobileMenu.css('display' , 'none');
                            } else if(Lia.contains(Server.userRoleCode, UserRole.ADMIN, UserRole.INSTITUTION_ADMIN)) {
                                Lia.redirect('/page/cms');
                                jMobileMenu.css('display' , 'none');
                            }
                        })

                        //로그아웃 버튼
                        $('.womens_member_content .womens_member_logout').on('click' , function(e) {
                            Lia.redirect('/page/user/logout', {
                                'redirectUrl': '/'
                            });
                        })
                    });

                } else {
                    $('.womens_header_btn .womens_btn_join').on('click' , function(e) {
                        PageManager.go(['/user/join1']);
                        jMobileMenu.css('display' , 'none');
                    })
                    $('.womens_header_btn .womens_btn_login').on('click' , function(e) {
                        PageManager.go(['/user/login']);
                        jMobileMenu.css('display' , 'none');
                    })
                }

                //메뉴 찍기 시작
                var menuList = Lia.p(MENU_LIST, 'list', 0, 'child_list');
                var jMenu = $('.womens_menu_content').empty();
                // console.log(menuList)

                //Depth1
                for(var idx in menuList) {
                    var jDepth1Item = $('<div class="womens_depth_wrapper">\n' +
                        '            <div class="container">\n' +
                        '                <div class="womens_depth_title">\n' +
                        '                    <span class="womens_main_title"></span>\n' +
                        '                    <div class="womens_depth_btn"></div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '        </div>')
                    var item = menuList[idx];

                    //menu link(마이페이지 전용)
                    var menuLinkUrl = Lia.p(item, 'content', 'data');
                    var menuId =  Lia.p(item, 'id')

                    //Depth1 menu-id/title 처리
                    jDepth1Item.find('.womens_main_title').text(item.title);
                    jDepth1Item.attr('menu_id' ,menuId);

                    //강좌페이지로 이동 Hard Coding
                    if(menuId == 8) {
                        jDepth1Item.on('click' , function(e) {
                            PageManager.go(['courses'], { 'menu_id': MenuId.COURSE });
                            jMobileMenu.css('display' , 'none');
                        })
                    }
                    //마이페이지로 이동
                    if(menuId == 16) {
                        jDepth1Item.on('click' , function(e) {
                            if(!Server.loggedIn) {
                                // 로그인 여부 부터 조사
                                PopupManager.alert('안내', '로그인이 필요한 서비스 입니다.', function () {
                                    PageManager.go(['user/login']);
                                    jMobileMenu.css('display' , 'none');
                                }, function () {
                                    PageManager.go(['home']);
                                    jMobileMenu.css('display' , 'none');
                                }, '확인', '취소');
                            } else {
                                // 학습자가 아닌 경우에 조사
                                if(Lia.contains(Server.userRoleCode, UserRole.ADMIN,UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT)) {
                                    PopupManager.alert('안내', '학습자가 아닙니다.');
                                    return;
                                } else {
                                    Requester.owb(menuLinkUrl);
                                    return;
                                }
                            }
                        })
                    }

                    //Depth2
                    if(item.hasOwnProperty('child_list')) {
                        var subMenuList = item.child_list;
                        var jDepth2Item = $('<ul class="womens_depth_sub_title">\n' +

                            '                </ul>');
                        //Depth2 찍기
                        for(var jdx in subMenuList) {

                            var jDepth2ItemTitle = $('<li class="womens_sub_title"></li>');
                            var subItem = subMenuList[jdx];
                            var menuId = Lia.p(subItem, 'id');


                            jDepth2ItemTitle.text(subItem.title);
                            jDepth2ItemTitle.attr('menu_id' , menuId);

                            //page 이동
                            jDepth2ItemTitle.on('click' , function(e) {
                                var jThis = $(this)
                                PageManager.go(['page'], { 'menu_id': jThis.attr('menu_id') });
                                jMobileMenu.css('display' , 'none');
                            })

                            jDepth2Item.append(jDepth2ItemTitle);
                            jDepth1Item.find('.container').append(jDepth2Item);
                        }
                        //Depth2가 있다면 + -> - , 접엇다 폈다
                        jDepth1Item.on('click' , function(e) {
                            var jThis = $(this);
                            jThis.find('.womens_depth_title').next().toggleClass('active')
                            jThis.find('.womens_depth_btn').toggleClass('active');
                        })
                    }

                    jMenu.append(jDepth1Item)
                }
        })
        jPcBtn.on('click' , function(e) {
            PageManager.go(['sitemap']);
        })
    },

    agreementList: undefined,
    setAgreementList: function (agreementList) {
        INDEX.agreementList = agreementList;
    },
    getAgreementList: function () {
        return INDEX.agreementList;
    },

    idProperties: undefined,
    setIDProperties: function (properties) {
        INDEX.idProperties = properties;
    },

    getIDProperties: function () {
        return INDEX.idProperties;
    }
};

INDEX.init();

function onIdVerificationCompleted(properties) {
    INDEX.setIDProperties(properties);
}

var onMessage = function( e ) {

    var content = e.data;

    var data = Lia.p(content,'data');

    onIdVerificationCompleted(data);

    PageManager.go(['user', 'join3']);
};

try {
    if (window.addEventListener) {
        window.addEventListener("message", function (e) {
            onMessage(e);
        });
    } else {
        window.attachEvent("message", function (e) {
            onMessage(e);
        });
    }
} catch (e) {
}







var PageManager = $.PageManager;
function initPage() {

    PageManager.init({

        onPageSwitchStart: function (beforeDepth, baseDepth, depth, parameterMap, beforeParameterMap) {
            INDEX.setMenuId(Lia.p(parameterMap,'menu_id'));

            // 페이지가 로딩되기 시작할 때 로딩바를 노출함
            var jLoading = $('.page_loading');
            jLoading.addClass('showing');
            jLoading.children('.page_loading_bar').animate({
                width: 60 + 10 * 30 - 10 + '%'
            }, 300);

            // 페이지 로딩 되었을 때 열려있는 서브메뉴를 닫음
            var jSubmenuList = $('.common_submenu_list');
            jSubmenuList.removeClass('showing');

            if($('.common_menu_wrapper').hasClass('showing')){
                jSubmenuList.show();
            }else{
                jSubmenuList.hide();
            }

            // 타이머 갱신
            TIMER.baseDate = new Date();
            TIMER.renderTime();

        },

        onPageSwitchEnd: function () {

            // 페이지가 스위치 끝날 때 로딩바를 숨김
            var jLoading = $('.page_loading');
            jLoading.children('.page_loading_bar').animate({
                width: 100 + '%'
            }, 300, function () {
                $(this).css('width', 0);
                jLoading.removeClass('showing');
            });


        },

        onPageInit: function (j, jPageContainer, i, parameterMap, beforeParameterMap) {
        },

        onChange: function (j) {
        },

        onSameCheck: function (parameter) {
            return true;
        },

        onMoveCheck: function (parameterMap) {


            var m1 = Lia.p(parameterMap,'m1');
            if ( Lia.contains(m1, 'courses', 'course_detail' ) )  {

                if ( !Server.loggedIn ) {

                    PopupManager.alert('안내', '로그인이 필요한 서비스입니다.<br/>로그인 하시겠습니까?', function() {

                        PageManager.go('/user/login');

                    }, function() {
                    });

                    return false;
                }

            }

            return true;
        },

        onPageCheck: function (parameter) {

            if(PageManager.pc('m1') == 'courses') {
                // ...
            } else {
                Lia.scrollTo(0, 200);
            }


            return true;
        },

        onProgress: function (status) {

            if (status == PageManager.Status.START) {
            } else if (status == PageManager.Status.ERROR) {
                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.PAGE_NOT_FOUND) );
            } else if (status == PageManager.Status.SUCCESS) {
            }
        },
        onNormalizeParameter: function (data) {

            var m1 = Lia.pd('home', data, 'm1');
            data['m1'] = m1;
            return data;
        },

        cssFilePathFormatHandler: function (path, data, depth) {
            return undefined;
        },

        htmlFilePathFormatHandler: function (path, data, depth) {
            return '/res/home/page/'+Server.theme + '/' + path + '.html';
        },
        jsFilePathFormatHandler: function (path, data, depth) {
            return '/res/home/page/' +Server.theme + '/' + path + '.js';
        },

        title: $('title').text(),
        htmlLoading: true,
        cssLoading: false,
        jsLoading: true,
        parameterPostfixAdding: false,
        pageParameterNameList: [
            'm1', 'm2', 'm3', 'm4'
        ],
        pageContainerSelectorList: [
            '.page1', '.page2', '.page3', '.page4'
        ]
    });
}

function windowOnResize() {
    PageManager.pageExecute('onResize');
    var width = screen.width;
    if(width > 1359) {
        $('.womens_menu_wrapper').css('display' , 'none');
        // $('body').css('overflow-y', 'scroll');
    }
}

windowOnResize();

$(window).resize(function () {
    windowOnResize();
});





var MenuPageManager = function (options) {

    this.page = options['page'];

};
MenuPageManager.prototype.onInit = function (j) {

    var page = this.page;

};
MenuPageManager.prototype.onChange = function (j) {

    var page = this.page;

    var menu1 = MenuManager.getSelectedMenuAt(0);
    var menu2 = MenuManager.getSelectedMenuAt(1);
    var menu3 = MenuManager.getSelectedMenuAt(2);
    var menu4 = MenuManager.getSelectedMenuAt(3);


    (function() {
        var jHeaderTitle = page.find('.page_header_title').not('.static');
        var jBreadCrumb = page.find('.page_header_breadcrumb').not('.static').empty();

        jBreadCrumb.append('<li class="page_header_breadcrumb_item tohome">' +
            '<img class="page_header_breadcrumb_item_home_img" src="/res/home/img/stop/common/ico_home.png">'+'</li>');

        var jDepth1Item = $('<li class="page_header_breadcrumb_item"></li>').text(Lia.p(menu2, 'title'));
        jDepth1Item.attr('menu_id', Lia.p(menu2, 'id'));
        jHeaderTitle.text(Lia.p(menu3, 'title'));
        jBreadCrumb.append(jDepth1Item);

        if (Lia.p(menu3, 'title') != undefined) {
            var jDepth2Item = $('<li class="page_header_breadcrumb_item"></li>').text(Lia.p(menu3, 'title'))
            jDepth2Item.attr('menu_id', Lia.p(menu3, 'id'));
            jBreadCrumb.append(jDepth2Item);
        }

        page.find('.page_header_breadcrumb_item').on('click', function (e) {
            var jThis = $(this);
            if (jThis.hasClass('tohome')) {
                PageManager.redirect('/',{'redirectUrl': '/'})
            } else {
                PageManager.go(['page'], {'menu_id': jThis.attr('menu_id')});
            }
        })
    })();

};

MenuPageManager.prototype.onRelease = function (j) {

    var page = this.page;

};



// TOP 버튼 처리

$('.top_helper').on('click', function (e){
    Lia.scrollTo(0, 500);
})
