<%@ page import="java.util.Map" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" contentType="text/html; charset=UTF-8" %>
<%@  page import="java.util.Map,  
                 java.util.HashMap,  
                 java.util.Iterator" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
    <meta http-equiv="Content-type" content="text/html; charset=UTF-8" />

    <link rel="stylesheet" type="text/css" href="/res/lia/lia.css?V=7491"  charset="UTF-8"/>

    <%--  FONT  --%>
    <link rel="stylesheet" href="/res/lia/font/notokr-medium/stylesheet.css?V=7491" />
    <link rel="stylesheet" href="/res/lia/font/notokr-regular/stylesheet.css?V=7491" />
    <link rel="stylesheet" href="/res/lia/font/klavika-bold/stylesheet.css?V=7491" />
    <link rel="stylesheet" href="/res/lia/font/notokr-bold/stylesheet.css?V=7491" />

    <%--  AOS : Copyright (c) 2015 Michał Sajnóg  --%>
    <link rel="stylesheet" href="/res/service/aos/aos.css?V=7491" />

    <%--  Slick  --%>
    <link rel="stylesheet" href="/res/service/slick-1.8.1/slick/slick.css?V=7491" />
    <link rel="stylesheet" href="/res/service/slick-1.8.1/slick/slick-theme.css?V=7491" />

    <%--  랜딩 페이지용 스타일  --%>
    <link rel="stylesheet" href="/res/service/css/main.css?V=7491" />

    <title>VSQUARE CLOUD LMS</title>

</head>

<body>
    <div id="wrapper">

        <%--    태블릿 이상 네비게이션 바    --%>
        <nav id="nav" class="navbar_large">
            <div class="container nav_wrapper">
                <img class="nav_logo" src="/res/service/img/logo.png" srcset="/res/service/img/logo@2x.png 2x" alt="(주)브이스퀘어" />
                <ul class="nav_link_group">
                    <li class="nav_link_item">
                        <a href="#">요금제</a>
                    </li>
                    <li class="nav_link_item">
                        <a href="#">주요기능</a>
                    </li>
                    <li class="nav_link_item">
                        <a class="nav_link_emphasis" href="mailto:hello@vsquare.cc">
                            <span>도입문의</span>
                            <img class="nav_contact_bubble" src="/res/service/img/contact_bubble.png" srcset="/res/service/img/contact_bubble@2x.png 2x" alt="이동"/>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <%--    모바일 네비게이션 바    --%>
        <nav id="nav" class="navbar_mobile">
            <div class="container">
                <img class="nav_logo" src="/res/service/img/logo.png" srcset="/res/service/img/logo@2x.png 2x" alt="(주)브이스퀘어" />
            </div>
        </nav>

        <section>

            <article class="main_article_1">
                <div class="container">
                    <div class="main_catch_wrapper">
                        <h2 data-aos="fade-up" data-aos-duration="1000" data-aos-easing="ease-out-cubic" class="catch_header">
                            <span>CLOUD LMS</span>
                            <span class="red_dot"></span>
                        </h2>
                        <p data-aos="fade-up" data-aos-duration="1000" data-aos-easing="ease-out-cubic" class="catch_description">
                            SaaS(Software as a Service) 형태로 제공되는 <br />클라우드 기반의 임대형 학습관리시스템(Learning Management System)
                        </p>
                        <p data-aos="fade-up" data-aos-duration="1000" data-aos-easing="ease-out-cubic" class="catch_description_mobile">
                            SaaS(Software as a Service) 형태로 <br />제공되는 클라우드 기반의 임대형 학습관리시스템<br />(Learning Management System)
                        </p>
                        <button
                                data-aos="fade-up" data-aos-duration="1000" data-aos-easing="ease-out-cubic"
                                class="red_round_button bounce"
                                onclick="location.href='mailto:hello@vsquare.cc'"
                        >도입문의</button>
                    </div>
                    <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-easing="ease-out-cubic" class="catch_image_wrapper">
                        <img class="catch_img"
                             src="/res/service/img/cloud_lms_catch.png"
                             srcset="/res/service/img/cloud_lms_catch@2x.png 2x"
                             alt="Cloud LMS 서비스 모습" />
                    </div>
                    <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-easing="ease-out-cubic" class="catch_image_wrapper_mobile">
                        <img class="catch_img" src="/res/service/img/cloud_lms_mobile.png"  alt="Cloud LMS 서비스 모습" />
                    </div>
                </div>
            </article>

            <article class="main_article_2">
                <div class="article_2_wrapper">
                    <ul class="service_target_list">
                        <li data-aos="fade-up" data-aos-duration="800">
                            <img class="check_mark_img" src="/res/service/img/check_mark.svg" alt="1."/>
                            사이버 강의 및 e-class를 운영하고자하는 오프라인 대학교
                        </li>
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
                            <img class="check_mark_img" src="/res/service/img/check_mark.svg" alt="2."/>
                            이러닝 기반의 사내 교육을 운영하고자 하는 기업
                        </li>
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                            <img class="check_mark_img" src="/res/service/img/check_mark.svg" alt="3."/>
                            기업/공공기관 대상 위탁 교육을 진행하는 훈련기관
                        </li>
                    </ul>
                </div>
            </article>

            <article class="main_article_3">
                <div class="container">
                    <div class="logo_slider_left_button">
                        <img src="/res/service/img/arrow_left.svg" alt="<" />
                    </div>
                    <div class="logo_slider" id="logo_slider">
                        <div class="logo_slider_item">
                            <img src="/res/service/img/logos/chongshin.png" srcset="/res/service/img/logos/chongshin@2x.png" alt="총신대학교" />
                        </div>
                        <div class="logo_slider_item">
                            <img src="/res/service/img/logos/gukbang.png" srcset="/res/service/img/logos/gukbang@2x.png" alt="국방대학교" />
                        </div>
                        <div class="logo_slider_item">
                            <img src="/res/service/img/logos/mmooc.png" srcset="/res/service/img/logos/mmooc@2x.png" alt="POLARIS 2" />
                        </div>
                        <div class="logo_slider_item">
                            <img src="/res/service/img/logos/nam_seoul.png" srcset="/res/service/img/logos/nam_seoul@2x.png" alt="남서울대학교" />
                        </div>
                    </div>
                    <div class="logo_slider_right_button">
                        <img src="/res/service/img/arrow_right.svg" alt=">" />
                    </div>
                </div>
            </article>

            <article class="main_article_4">
                <div class="container">
                    <ul class="feature_item_list">
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="500" class="feature_item" id="feature_item_1">
                            <div class="feature_item_image">
                                <img src="/res/service/img/feature1.png" srcset="/res/service/img/feature1@2x.png 2x" alt="1" />
                            </div>
                            <div class="feature_item_description_wrapper">
                                <p class="feature_item_header">Full Featured LMS</p>
                                <p class="feature_item_description">단순 콘텐츠 시청이 아닌 <br />평가 진행·진도 처리·성적 산출 등 <br />LMS의 고급 핵심 기능 모두 제공</p>
                                <p class="feature_item_description_mobile">단순 콘텐츠 시청이 아닌 평가 진행·진도 처리·<br />성적 산출 등 LMS의 고급 핵심 기능 모두 제공</p>
                            </div>
                        </li>
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="800" class="feature_item" id="feature_item_2">
                            <div class="feature_item_image">
                                <img src="/res/service/img/feature2.png" srcset="/res/service/img/feature2@2x.png 2x" alt="2" />
                            </div>
                            <div class="feature_item_description_wrapper">
                                <p class="feature_item_header">낮은 초기 비용</p>
                                <p class="feature_item_description">솔루션 구매/도입 비용없이 <br />저렴한 초기 세팅비 <br />*초기 기술 지원 범위에 따름</p>
                                <p class="feature_item_description_mobile">솔루션 구매/도입 비용없이 저렴한 초기 세팅비 <br />*초기 기술 지원 범위에 따름</p>
                            </div>
                        </li>
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="1100" class="feature_item" id="feature_item_3">
                            <div class="feature_item_image">
                                <img src="/res/service/img/feature3.png" srcset="/res/service/img/feature3@2x.png 2x" alt="3" />
                            </div>
                            <div class="feature_item_description_wrapper">
                                <p class="feature_item_header">종량제 과금</p>
                                <p class="feature_item_description">구축형 운영 및 <br />유지보수 비용 + @ 수준의 <br />사용한 만큼만 지불하는 과금 방식</p>
                                <p class="feature_item_description_mobile">구축형 운영 및 유지보수 비용 + @ 수준의 <br />사용한 만큼만 지불하는 과금 방식</p>
                            </div>
                        </li>
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="1400" class="feature_item" id="feature_item_4">
                            <div class="feature_item_image">
                                <img src="/res/service/img/feature4.png" srcset="/res/service/img/feature4@2x.png 2x" alt="4" />
                            </div>
                            <div class="feature_item_description_wrapper">
                                <p class="feature_item_header">짧은 구축 기간</p>
                                <p class="feature_item_description">즉시 또는 최대 2주 내에 운영 가능 <br />*초기 기술 지원 범위에 따름</p>
                                <p class="feature_item_description_mobile">즉시 또는 최대 2주 내에 운영 가능 <br />*초기 기술 지원 범위에 따름</p>
                            </div>
                        </li>
                        <li data-aos="fade-up" data-aos-duration="800" data-aos-delay="1700" class="feature_item" id="feature_item_5">
                            <div class="feature_item_image">
                                <img src="/res/service/img/feature5.png" srcset="/res/service/img/feature5@2x.png 2x" alt="5" />
                            </div>
                            <div class="feature_item_description_wrapper">
                                <p class="feature_item_header">탄력적인 운영 및 확장</p>
                                <p class="feature_item_description">필요 용량에 대한 예측 불필요 <br />수요에 대한 유연한 확장</p>
                                <p class="feature_item_description_mobile">필요 용량에 대한 예측 불필요 <br />수요에 대한 유연한 확장</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </article>

            <article class="main_article_5">
                <div class="container">
                    <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="500" class="price_wrapper">
                        <h3 class="price_header">요금 안내</h3>
                        <p class="price_notice">초기 기술 지원(콘텐츠 이관·보유 시스템 연계 등) <br class="mobile_show" />신청 여부에 따라 세팅비는 별도 견적</p>
                        <p class="price_notice_small">* 1년 약정으로 계산할 경우의 금액</p>

                    </div>
                    <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="800" class="enquiry_buttons_wrapper">
                        <button class="red_round_button bounce" onclick="location.href='mailto:hello@vsquare.cc'">도입문의</button>
                        <button class="white_round_button bounce" onclick="location.href='mailto:hello@vsquare.cc'">구축형(On-Premise) 문의</button>
                    </div>
                    <div class="flex-wrapper">
                        <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="1100" class="calc_price_card">
                            <div class="calc_price_description_wrapper">
                                <div class="calc_price_header">
                                    <h4>기본 패키지<span class="red_dot_2"></span></h4>
                                    <p>99 <span>만원 / 월</span></p>
                                </div>
                                <table class="calc_price_table" id="calc_price_table1">
                                    <tr>
                                        <th>
                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>
                                            동영상 저장공간
                                        </th>
                                        <td>
                                            100GB
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>
                                            동영상 대역폭
                                        </th>
                                        <td>
                                            50Mbps
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>
                                            웹 저장 공간
                                        </th>
                                        <td>
                                            100GB
                                        </td>
                                    </tr>
<%--                                    <tr>--%>
<%--                                        <th>--%>
<%--                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>--%>
<%--                                            웹 트래픽--%>
<%--                                        </th>--%>
<%--                                        <td>--%>
<%--                                            ∞ Unlimited--%>
<%--                                        </td>--%>
<%--                                    </tr>--%>
                                </table>
                            </div>
                            <div class="calc_price_description_wrapper">
                                <div class="calc_price_header">
                                    <h4>추가요금<span class="red_dot_2"></span></h4>
                                </div>
                                <table class="calc_price_table" id="calc_price_table2">
                                    <tr>
                                        <th>
                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>
                                            동영상 저장공간 추가
                                        </th>
                                        <td>
                                            100GB <span>당</span> 11 <span>만원/월</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>
                                            동영상 대역폭 추가
                                        </th>
                                        <td>
                                            50Mbps<span>당</span> 44<span>만원/월</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <img src="/res/service/img/price_check.png" srcset="/res/service/img/price_check@2x.png 2x" alt="1."/>
                                            웹 저장 공간 추가
                                        </th>
                                        <td>
                                            100GB<span>당</span> 11<span>만원/월</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="1100" class="calculator_card">
                            <div class="calculator_card_top">
                                <h4>요금 계산기<span class="red_dot_2"></span></h4>

                                <div class="calculator_item">
                                    <label for="storage_video_input">동영상 저장공간</label>
                                    <input type="text" id="storage_video_input" class="calculator_input" value="100" /> <span>GB</span>
                                </div>

                                <div class="calculator_item">
                                    <label for="bandwidth_input">동영상 대역폭</label>
                                    <input type="text" id="bandwidth_input" class="calculator_input" value="50" /> <span>Mbps</span>
                                </div>

                                <div class="calculator_item">
                                    <label for="storage_web_input">웹 저장공간</label>
                                    <input type="text" id="storage_web_input" class="calculator_input" value="100"/> <span>GB</span>
                                </div>

                            </div>
                            <div class="calculator_card_bottom">
                                <p class="calculator_result">
                                    <span id="calculator_sum">99</span> 만원 / 월
                                </p>
                                <p class="calculator_result_include">*부가세(VAT) 포함</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

        </section>

        <footer>
            <div class="container">
                <div class="footer_wrapper">
                    <img class="footer_logo" src="/res/service/img/logo_footer.png" srcset="/res/service/img/logo_footer@2x.png 2x" alt="(주)브이스퀘어"/>
                    <p class="footer_copyright" >CopyrightⓒVSQUARE All Right Reserved</p>
                </div>
            </div>
        </footer>
    </div>

    <script src="/res/lia/vendor/jquery-1.11.1.min.js?V=7491" type="text/javascript" charset="utf-8"></script>
    <script src="/res/lia/vendor/jui/1.12.1/jquery-ui.min.js?V=7491" type="text/javascript" charset="utf-8"></script>
    <script src="/res/lia/lia.all.js?V=7491" type="text/javascript" charset="utf-8"></script>
    <!--[if lt IE 9]>
    <script src="/res/lia/vendor/css3-mediaqueries.js?V=7491" type="text/javascript" charset="utf-8"></script>
    <![endif]-->
    <script src="/res/service/flexibility/flexibility.js?V=7491" type="text/javascript" charset="utf-8"></script>
    <script src="/res/service/aos/aos.js?V=7491"></script>
    <script src="/res/service/slick-1.8.1/slick/slick.min.js?V=7491"></script>

    <%--  프로젝트 JS  --%>
    <script src="/res/service/js/service.js?V=7491"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-180921370-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-180921370-1');
    </script>

</body>
</html>