<%@ page session="false" contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Expires" content="-1"/>
    <meta http-equiv="Pragma" content="No-Cache"/>
    <meta http-equiv="Cache-Control" content="No-Cache"/>

    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
    <meta http-equiv="Content-type" content="text/html; charset=UTF-8"/>

    <!-- Font -->
    <link rel="stylesheet" type="text/css" href="/res/lia/font/opensans/stylesheet.css?V=7491"  charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/font/roboto_normal.css?V=7491"  charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/font/notokr-medium/stylesheet.css?V=7491"  charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/font/notokr-regular/stylesheet.css?V=7491"  charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/font/notokr-bold/stylesheet.css?V=7491"  charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/font/gyeonggi/stylesheet.css?V=7491"  charset="UTF-8"/>
    <!-- Lia / Vendor -->
    <link rel="stylesheet" type="text/css" href="/res/lia/lia.css?V=7491"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/vendor/slick/slick.css?V=7491"/>

    <!-- CSS ㅣ list -->
    <link rel="stylesheet" type="text/css" href="/res/home/css/stop/common.css?V=7491" />
    <link rel="stylesheet" type="text/css" href="/res/home/css/stop/page.css?V=7491" />
    <link rel="stylesheet" type="text/css" href="/res/home/css/stop/home.css?V=7491" />
    <link rel="stylesheet" type="text/css" href="/res/home/css/stop/user.css?V=7491" />

    <title> <c:out value="${title}" default="여성폭력 피해자 보호·지원시설 종사자 교육포털" /> </title>
    <meta name="title" content="여성폭력 피해자 보호·지원시설 종사자 교육포털">
    <meta name="description" content="여성폭력 예방과 근절, 폭력 피해자에 대한 지원을 위해 전문성과 경험을 바탕으로 최선을 다하는 한국여성인권 진흥원입니다.">
    <meta name="keywords" content="여성폭력예방, 교육플랫폼, 여성인권진흥원, 여성폭력피해자보호시설, 여성폭력피해자지원시설, 여성인권, 교육">
    <meta name="robots" content="index, follow">
    <meta name="language" content="Korean">
    <meta name="revisit-after" content="2 days">
    <meta name="author" content="한국여성인권진흥원">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://edu.stop.or.kr/">
    <meta property="og:title" content="여성폭력 피해자 보호·지원시설 종사자 교육포털">
    <meta property="og:description" content="여성폭력 예방과 근절, 폭력 피해자에 대한 지원을 위해 전문성과 경험을 바탕으로 최선을 다하는 한국여성인권 진흥원입니다.">
    <meta property="og:image" content="/res/home/img/stop/meta/img_meta.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://edu.stop.or.kr/">
    <meta property="twitter:title" content="여성폭력 피해자 보호·지원시설 종사자 교육포털">
    <meta property="twitter:description" content="여성폭력 예방과 근절, 폭력 피해자에 대한 지원을 위해 전문성과 경험을 바탕으로 최선을 다하는 한국여성인권 진흥원입니다.">
    <meta property="twitter:image" content="/res/home/img/stop/meta/img_meta.png">
    
</head>
<body>

<div class="page_loading">
    <div class="page_loading_bar" style="width: 0;"></div>
</div>

<div id="wrapper">

    <nav class="common_header container">
        <div class="common_header_left">
            <div class="header_logo">
                <img class="nav_logo pc_show" src="/res/home/img/stop/common/btn_logo_header.png" alt="womens_logo" />
                <img class="nav_logo tablet_show" src="/res/home/img/stop/common/tablet/btn_logo_header.png" alt="womens_logo" />
                <img class="nav_logo mobile_show" src="/res/home/img/stop/common/mobile/btn_logo_header.png" alt="womens_logo" />
            </div>
            <div class="header_title ie_pc pc_show">여성폭력 피해자 보호·지원시설<br/><span>종사자 교육포털</span></div>
            <div class="header_title ie_tablet tablet_show">여성폭력 피해자 보호·지원시설<br/><span>종사자 교육포털</span></div>
            <div class="header_title ie_mobile mobile_show">여성폭력 피해자 보호·지원시설<br/><span>종사자 교육포털</span></div>
        </div>
        <div class="common_header_right">
            <div class="header_top_search">
                <input class="nav_search_input" type="text" placeholder="강의명 검색"/>
                <button class="nav_btn_search">
                    <img src="/res/home/img/stop/common/btn_header_search.png" alt="search" class="pc_show"/>
                    <img src="/res/home/img/stop/common/btn_search.png" alt="search" class="tm_show"/>
                </button>
            </div>
            <div class="header_top_nav_wrapper">
                <div class="header_top_nav login">로그인</div>
                <div class="header_top_line"></div>
                <div class="header_top_nav signup">회원가입</div>
            </div>
        	<div class="header_top_nav_remote">	
            	<button class="remote-button" onclick="location.href='https://113366.com/stop'">원격지원</button>
                &nbsp;<span style="color:#7147a9;">운영시간 :</span> <span>월~금 (09:00~18:00) / 토, 일, 공유일 휴무</span>
            </div>    
         
            <div class="common_menu_icon mobile">
                <img src="/res/home/img/stop/common/btn_menu.png"/>
            </div>
        </div>
    </nav>

    <div class="common_menu_wrapper">
        <div class="container">
            <ul class="common_menu_list">
<%--                <li class="common_menu_item">교육 소개</li>--%>
<%--                <li class="comhttps://www.youtube.com/embed/UDR5nJejDVEmon_menu_item">교육 안내</li>--%>
<%--                <li class="common_menu_item">교육 신청</li>--%>
<%--                <li class="common_menu_item">고객센터</li>--%>
<%--                <li class="common_menu_item">나의 강의실</li>--%>
            </ul>
            <div class="common_menu_icon common_sitemap">
                <img class="mobile_menu_sitemap" src="/res/home/img/stop/common/btn_menu.png"/>
            </div>
        </div>
        <ul class="common_submenu_list" style="display: none;">
<%--            <li class="common_submenu_item">교육소개</li>--%>
<%--            <li class="common_submenu_item">회원가입 안내</li>--%>
<%--            <li class="common_submenu_item">교육 참여 방법 안내</li>--%>
<%--            <li class="common_submenu_item">찾아오시는 길</li>--%>
        </ul>
    </div>

<%--    <div class="sub_menu pc_show">--%>
<%--        <ul class="sub_menu_list">--%>

<%--        </ul>--%>
<%--    </div>--%>

    <section class="page1">
        <div>
            <header class="page_header">
                <div class="container">
                    <h1 class="subpage_title"></h1>
                    <p class="breadcrumb">
                    </p>
                    <ul class="breadcrumb_submenu showing">
                    </ul>
                </div>
            </header>

            <div class="page_content_body">

            </div>
        </div>
    </section>

    <footer class="footer">

        <div class="top_helper">
            <span>TOP</span>
        </div>

        <div class="container">
            <div class="footer_logo">
                <img src="/res/home/img/stop/common/btn_logo_footer.png"/>
            </div>
            <div class="footer_content">
                <div class="footer_content_menu">
                    <ul>
                        <li onclick="window.open('https://www.stop.or.kr/modedg/contentsView.do?ucont_id=CTX000056&srch_menu_nix=Ak20GP4Z')">개인정보처리방침</li>
                        <li onclick="window.open('https://www.stop.or.kr/modedg/contentsView.do?ucont_id=CTX000057&srch_menu_nix=9e67SjA6&')">영상정보처리기기</li>
                        <li onclick="AjaxPopupManager.show(ProjectPopupUrl.FOOTER_TERMS_POPUP , {type : 'email'});">이메일주소무단수집거부</li>
                        <li onclick="AjaxPopupManager.show(ProjectPopupUrl.FOOTER_TERMS_POPUP , {type : 'use'});">이용약관</li>
                    </ul>
                </div>
                <div class="footer_content_info">
                    <p class="footer_info_address">(우)04505 서울특별시 중구 서소문로 50 센트럴플레이스 3층</p>
                    <p class="footer_info_num"><a href="tel:02-6363-8454">TEL 02-6363-8454 (시스템관련 문의)</a></p>
                    <p class="footer_info_num"><a href="tel:02-6363-8447">TEL 02-6363-8447 (교육관련 문의)</a></p>
<%--                    <p class="footer_info_num"><a href="tel:1366">상담전화 1366(유료)</a></p>--%>
                </div>
                <div class="footer_content_copy">
                    <p>COPYRIGHT 2020 WOMEN'S HUMAN RIGHTS INSTITUTE OF KOREA, ALL RIGHT RESERVED.</p>
                </div>
            </div>
            <div class="footer_sns">
                <div class="footer_sns_box fb"><img src="/res/home/img/stop/common/btn_sns01.png"/></div>
                <div class="footer_sns_box twit"><img src="/res/home/img/stop/common/btn_sns02.png"/></div>
                <div class="footer_sns_box you"><img src="/res/home/img/stop/common/btn_sns03.png"/></div>
            </div>
        </div>
    </footer>

    <div id="popup_layout_list"></div>
    <div class="dim" id="loading_dim" data-lia-opacity="0" data-lia-popup="#loading_popup"></div>
    <div class="popup loading" id="loading_popup" data-lia-dim="#loading_dim"
         data-lia-src="/res/lia/triton/img/loading_bar_gray/img_{index}.png" data-lia-index="1" data-lia-start-index="1" data-lia-end-index="8"
         style="background:transparent;"></div>

    <!-- mobile menu -->
    <div class="womens_menu_wrapper">
        <div class="common_header container">
            <div class="common_header_left">
                <div class="header_logo">
                    <img class="nav_logo tablet_show" src="/res/home/img/stop/common/tablet/btn_logo_header.png" alt="womens_logo">
                    <img class="nav_logo mobile_show" src="/res/home/img/stop/common/mobile/btn_logo_header.png" alt="womens_logo">
                </div>
                <div class="header_title">여성폭력 피해자 보호·지원시설<br class="mobile_show"/> 종사자 교육포털</div>
            </div>
            <div class="common_header_right">
                <div class="header_close"></div>
            </div>
        </div>
        <div class="womens_menu_header">
            <div class="womens_header_login container">
                <div class="womens_member_name"><span>홍길동</span>님</div>
                <ul class="womens_member_content">
                    <li class="womens_member_info">내정보</li>
                    <li class="womens_member_logout">로그아웃</li>
                </ul>
            </div>
            <div class="womens_header_basic container">
                <div class="womens_header_btn">
                    <div class="womens_btn_join">회원가입</div>
                    <div class="womens_btn_login">로그인</div>
                </div>
            </div>
        </div>

        <div class="womens_menu_content">

        </div>
    </div>
</div>

<jsp:include page="system_config.jsp" />

<script type="text/javascript">

    var Server = {
        serverMode : '${serverMode}',
        serviceProviderId : '${serviceProviderId}',
        userRoleCode : '${userRoleCode}',
        theme : '${theme}',
        loggedIn : ${loggedIn},

        serviceProviderProperties : undefined,
        serviceProviderSystemConfig : undefined,
        serviceProviderSystemString : undefined,

        userId : '${userId}'
    };

    <%
        Object serviceProviderProperties = request.getAttribute("serviceProviderProperties");

        if ( serviceProviderProperties != null ) {
    %>
    Server.serviceProviderProperties = ${serviceProviderProperties};
    <%
        }
    %>

    <%
        Object serviceProviderSystemConfig = request.getAttribute("serviceProviderSystemConfig");

        if ( serviceProviderSystemConfig != null ) {
    %>
    Server.serviceProviderSystemConfig = ${serviceProviderSystemConfig};
    <%
        }
    %>

    <%
        Object serviceProviderSystemString = request.getAttribute("serviceProviderSystemString");

        if ( serviceProviderSystemString != null ) {
    %>
    Server.serviceProviderSystemString = ${serviceProviderSystemString};
    <%
        }
    %>

    var MENU_LIST = ${menuList};

</script>
<!--kakao map API KEY -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=7b9f127d18bbf9965d2ef151422bb88c&libraries=services"></script>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=7b9f127d18bbf9965d2ef151422bb88c"></script>

<!-- 다음 맵 -->
<script src="https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js"></script>

<script src="/res/lia/vendor/vendor.js?V=7491" type="text/javascript" charset="utf-8"></script>
<script src="/res/lia/vendor/slick/slick.min.js?V=7491" type="text/javascript" charset="utf-8"></script>

<script src="/res/lia/lia.all.js?V=7491" type="text/javascript" charset="utf-8"></script>

<link href="/res/lia/vendor/froala/css/froala_editor.pkgd.min.css?V=7491" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/res/lia/vendor/html2pdf/html2pdf.bundle.js?V=7491"></script>
<script type="text/javascript" src="/res/lia/vendor/froala/js/froala_editor.pkgd.min.js?V=7491"></script>
<script src="/res/lia/lia.texteditor.froala.js?V=7491" type="text/javascript" charset="utf-8"></script>
<script src="/res/lia/vendor/froala/js/languages/ko.js?V=7491" type="text/javascript" charset="utf-8"></script>

<script src="/res/player/player.js?V=7491" type="text/javascript" charset="utf-8"></script>

<script src="/res/polaris/js/polaris.js?V=7491" type="text/javascript"></script>
<script src="/res/polaris/js/configs.js?V=7491" type="text/javascript"></script>
<script src="/res/polaris/js/constants.js?V=7491" type="text/javascript"></script>
<script src="/res/polaris/js/settings.js?V=7491" type="text/javascript"></script>

<script src="/res/lib/core.js?V=7491" type="text/javascript" charset="utf-8"></script>
<script src="/res/lib/project.js?V=7491" type="text/javascript" charset="utf-8"></script>

<script src="/res/home/lib/home.js?V=7491" type="text/javascript" charset="utf-8"></script>



<script type="text/javascript">

    UserManager.setLoggedIn(Server.loggedIn);

</script>

<script src="/res/home/page/stop/index.js?V=7491" type="text/javascript" charset="utf-8"></script>
<%--<script charset="UTF-8" class="daum_roughmap_loader_script" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js?V=7491"></script>--%>

<jsp:include page="footer.jsp" />

</body>
</html>