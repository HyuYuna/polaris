
// 사용자 계정
Configs.setConfig(Configs.RECEIVE_USER_DELETE_REQUEST, false);

// 콘텐츠 개발 및 관리
Configs.setConfig(Configs.USE_CONTENT_DEVELOPMENT_MANAGEMENT, false);
Configs.setConfig(Configs.ALLOW_MULTIPLE_AVAILABLE_COURSE_CONTENT, true);

// 과목
Configs.setConfig(Configs.USE_COURSE_REVIEW_PERIOD, true);
Configs.setConfig(Configs.USE_COURSE_PRICE, false);
Configs.setConfig(Configs.USE_COURSE_ENROLLMENT_RESTRICTION_MESSAGE, true);

Configs.setConfig(Configs.USE_NOTIFICATION, false);

Configs.setConfig(Configs.USE_LETTER_GRADE, true);

Configs.setConfig(Configs.SHOW_COURSE_COMPLETED_ON_LIST, false);

Configs.setConfig(Configs.SHOW_TERM_STUDENT_COUNT_DETAILS, false);

Configs.setConfig(Configs.USE_INTERNAL_USER_PASSWORD, true);

Configs.setConfig(Configs.USE_COURSE_REQUIRED_LEARNING_TIME_IN_SECONDS, true);
Configs.setConfig(Configs.USE_COURSE_ATTENDANCE_COUNT, false);

Configs.setConfig(Configs.FORUM, false);
Configs.setConfig(Configs.AUDITING, false);
Configs.setConfig(Configs.COURSE_YEAR, true);

// 강의실 메뉴
Configs.setConfig(Configs.LEARNING_MENU_LIVE_SEMINAR, Configs.getConfig(Configs.LIVE_SEMINAR));

// Configs.setConfig(Configs.REMOTE_SUPPORT_URL, '');
Configs.setConfig(Configs.CMS_LOGOUT_REDIRECT_URL, '/page/lms/login');
Configs.setConfig(Configs.LEARNING_PLAYER_FIT, 0);
Configs.setConfig(Configs.SHOW_TEST_QUESTION_TO_TEACHER, false);
Configs.setConfig(Configs.CHECK_VIDEO_CONTENT_STATUS, false);
Configs.setConfig(Configs.USE_TEST_QUESTION_CATEGORY, true);

// 콘텐츠 다운로드 업로드 관련 금지
Configs.setConfig(Configs.COURSE_CONTENT_ITEM_FILE_UPLOAD, false);
Configs.setConfig(Configs.COURSE_CONTENT_ITEM_FILE_DOWNLOAD, false);
Configs.setConfig(Configs.ATTENDANCE_DETAIL_STUDENT_MODE, true);

Configs.setConfig(Configs.USE_CERTIFICATE_TEMPLATE, false);
Configs.setConfig(Configs.USE_ENGLISH_CERTIFICATE_TEMPLATE, false);

Configs.setConfig(Configs.COURSE_OUTLINE_SHORT_DESCRIPTION, false);

Configs.setConfig(Configs.ENTER_COURSE_IN_WAITING, true);
Configs.setConfig(Configs.DEFAULT_USER_BOARD_CONTENT_PRIVATE, true);

Configs.setConfig(Configs.USER_GROUP, true);
Configs.setConfig(Configs.USER_NATIONALITY, false);
Configs.setConfig(Configs.USER_NUMBER, false);
Configs.setConfig(Configs.USER_COMPANY, false);

Configs.setConfig(Configs.EXCLUDE_FROM_STATISTICS, true);

// Strings.setString('알림톡', Strings.TEXT_MESSAGE);

Strings.setString('미선정', Strings.COURSE_ENROLLMENT_STATUS.ENROLLMENT_REJECTED);
Strings.setString('신청 완료', Strings.COURSE_ENROLLMENT_STATUS.ENROLLMENT_REQUESTED);
Strings.setString('선정', Strings.COURSE_STATUS.PENDING);

Configs.setConfig(Configs.USE_SURVEY_QUESTION_CATEGORY, true);
Configs.setConfig(Configs.CHECK_ONLY_MOVIE_CONTENT_ATTENDANCE, true);
Configs.setConfig(Configs.CHECK_VIDEO_CONTENT_STATUS, false)

Configs.setConfig(Configs.COURSE_CODE_CATEGORY, false);

Configs.setConfig(Configs.VIEW_ON_CDN, true);