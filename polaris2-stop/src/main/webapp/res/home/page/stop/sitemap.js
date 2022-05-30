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

            page.loadingSiteMap();
        },

        menuId : undefined,

        onChange: function (j) {
            var page = this;;

            page.menuPageManager.onChange(j);

        },


        onRelease: function (j) {

            var page = this;
            page.menuPageManager.onRelease(j);

        },
        onResize : function() {

            var page = this;
        },

        //method
        loadingSiteMap : function() {
            MenuManager.setMenuList( Lia.p(MENU_LIST, 'list') );

            var list = MenuManager.getMenuList();
            var menuList = Lia.p(list[0] , 'child_list')

            var jSitemap = page.find('.sitemap')

            for(var i in menuList) {
                var jSitemapWrapper = $(
                    ' <section class="sitemap_wrapper">\n' +
                    '            <div class="sitemap_content">\n' +
                    '                <p class="sitemap_title"></p>\n' +
                    '                <ul class="sitemap_content_list">\n' +
                    // '                    <li class="sitemap_item_link">교육소개</li>\n' +
                    // '                    <li class="sitemap_item_link">회원가입 안내</li>\n' +
                    // '                    <li class="sitemap_item_link">교육 참여 방법 안내</li>\n' +
                    // '                    <li class="sitemap_item_link">찾아오시는 길</li>\n' +
                    '                </ul>\n' +
                    '            </div>\n' +
                    '        </section>')

                var item = menuList[i];

                var jTitle = jSitemapWrapper.find('.sitemap_content .sitemap_title').empty();
                jTitle.text(item.title);
                jTitle.attr('menu_id' , Lia.p(item, 'id'));

                if(item.hasOwnProperty('child_list')) {
                    var jWrapper = jSitemapWrapper.find('.sitemap_wrapper');
                    jSitemapWrapper.addClass('has_child');

                    var linkList = item.child_list;

                    for(var j in linkList) {
                        var linkItem = linkList[j];
                        var jLink = $('<li class="sitemap_item_link"></li>');
                        jLink.attr('menu_id' , Lia.p(linkItem , 'id'));
                        jLink.text(Lia.p(linkItem , 'title'));
                        // console.log(jLink)

                        jSitemapWrapper.find('.sitemap_content_list').append(jLink);
                    }


                    //jSitemap.append(jSitemapWrapper);
                }
                    jSitemapWrapper.find('.sitemap_item_link').on('click',function(e) {
                        var menuId = $(this).attr('menu_id');

                        //교육신청 라우팅 하드코딩
                        if(menuId != MenuId.COURSE) {
                            PageManager.go(['page'] , {'menu_id': menuId});
                        } else {
                            PageManager.go(['courses'], {'menu_id': menuId});
                        }

                    })
                    jSitemapWrapper.find('.sitemap_title').on('click',function(e) {
                        var menuId = $(this).attr('menu_id');
                        if(menuId == 16) {
                            if (!Server.loggedIn) {
                                // 로그인 여부 부터 조사
                                PopupManager.alert('안내', '로그인이 필요한 서비스 입니다.', function () {
                                    PageManager.go(['user/login']);
                                }, function () {
                                    PageManager.go(['home']);
                                }, '확인', '취소');
                            } else {
                                // 학습자가 아닌 경우에 조사
                                if (Lia.contains(Server.userRoleCode, UserRole.ADMIN, UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT)) {
                                    PopupManager.alert('안내', '학습자가 아닙니다.');
                                    return;
                                } else {
                                    //문제 발생 시 코드 수정
                                    Lia.redirect('/page/lms');
                                    return;
                                }
                            }
                        } else if(menuId != MenuId.COURSE) {
                            PageManager.go(['page'] , {'menu_id': menuId});
                        }else {
                            PageManager.go(['courses'], {'menu_id': menuId});
                        }
                    })


                   jSitemap.append(jSitemapWrapper);
            }


        }
    };
})();