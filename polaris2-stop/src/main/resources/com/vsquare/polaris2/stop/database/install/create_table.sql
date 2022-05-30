
create table TB_KOLLUS_ENCODING (

      id                                  INT UNSIGNED     NOT NULL auto_increment,
      upload_key                           VARCHAR(32)     NOT NULL,
      lesson_subitem_id                    INT UNSIGNED     NOT NULL,
      media_key                            VARCHAR(32)     DEFAULT NULL,
      registered_date                      DATETIME     NOT NULL,
      last_modified_date                      DATETIME     DEFAULT NULL,

      primary key (id)
);

CREATE INDEX TB_KOLLUS_ENCODING_IDX_1 ON TB_KOLLUS_ENCODING (upload_key);
CREATE INDEX TB_KOLLUS_ENCODING_IDX_2 ON TB_KOLLUS_ENCODING (lesson_subitem_id);
CREATE INDEX TB_KOLLUS_ENCODING_IDX_3 ON TB_KOLLUS_ENCODING (upload_key);
CREATE INDEX TB_KOLLUS_ENCODING_IDX_4 ON TB_KOLLUS_ENCODING (media_key);




-- 사용자 계정 관련 테이블
CREATE TABLE IF NOT EXISTS TB_USER_HISTORY
(
    history_id                                          INT UNSIGNED            NOT NULL        AUTO_INCREMENT      COMMENT '이력 아이디',
    history_year                                        INT UNSIGNED            NOT NULL                            COMMENT '이력 년도',
    idx                                                 INT UNSIGNED            NOT NULL                            COMMENT '사용자 고유번호',
    id                                                  VARCHAR(100)            NOT NULL                            COMMENT '사용자 ID',
    password                                            VARCHAR(256)            NOT NULL                            COMMENT '비밀번호',
    password_salt                                       VARCHAR(64)                             DEFAULT NULL        COMMENT '비밀번호 SALT',
    password_last_modified_date                         DATETIME                NOT NULL                            COMMENT '최근 비밀번호 수정일',
    password_reset_question                             LONGTEXT                                DEFAULT NULL        COMMENT '비밀번호 초기화 질문',
    password_reset_answer                               LONGTEXT                                DEFAULT NULL        COMMENT '비밀번호 초기화 답변',
    password_reset_temporary_key                        CHAR(36)                                DEFAULT NULL        COMMENT '임시비밀번호',
    login_trial_count                                   TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '로그인 시도 횟수',
    last_login_trial_date                               DATETIME                                DEFAULT NULL        COMMENT '최근 로그인 시도 일시',
    login_block_end_date                                DATETIME                                DEFAULT NULL        COMMENT '로그인 제한 종료 일시',
    role_code                                           TINYINT UNSIGNED        NOT NULL                            COMMENT '권한코드',
    service_provider_id                                 INT UNSIGNED            NOT NULL                            COMMENT '서비스 운영기관 아이디',
    institution_id                                      INT UNSIGNED                            DEFAULT NULL        COMMENT '기관/서비스 아이디',
    group_id                                            INT UNSIGNED                            DEFAULT NULL        COMMENT '그룹ID',
    organization_id                                     INT UNSIGNED                            DEFAULT NULL        COMMENT '위탁기관 ID',
    name                                                VARCHAR(80)                             DEFAULT NULL        COMMENT '성명',
    number                                              VARCHAR(100)                            DEFAULT NULL        COMMENT '학년',
    nationality                                         VARCHAR(40)                             DEFAULT NULL        COMMENT '국적',
    social_security_number                              VARCHAR(50)                             DEFAULT NULL        COMMENT '주민등록번호',
    gender_code                                         TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '성별',
    employment_status_code                              TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '고용상태 코드',
    company_name                                        VARCHAR(45)                             DEFAULT NULL        COMMENT '회사이름',
    company_department                                  VARCHAR(45)                             DEFAULT NULL        COMMENT '부서',
    company_position                                    VARCHAR(45)                             DEFAULT NULL        COMMENT '직책',
    business_registration_number                        VARCHAR(50)                             DEFAULT NULL        COMMENT '사업자등록번호',
    business_registration_certificate_image_url         LONGTEXT                                DEFAULT NULL        COMMENT '사업자등록증 이미지URL',
    education_level_code                                TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '학력 코드',
    date_of_birth                                       DATE                                    DEFAULT NULL        COMMENT '생년월일',
    email                                               VARCHAR(100)                            DEFAULT NULL        COMMENT '이메일 주소',
    personal_email                                      VARCHAR(100)                            DEFAULT NULL        COMMENT '개인 이메일',
    student_type_code                                   TINYINT UNSIGNED        NOT NULL        DEFAULT 1           COMMENT '학습자 타입코드',
    year                                                TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '연도',
    department_id                                       INT UNSIGNED                            DEFAULT NULL        COMMENT '학과ID',
    profile_image_url                                   LONGTEXT                                DEFAULT NULL        COMMENT '프로필 사진URL',
    address_1                                           VARCHAR(2000)                           DEFAULT NULL        COMMENT '주소1',
    address_2                                           VARCHAR(2000)                           DEFAULT NULL        COMMENT '주소2',
    postcode                                            VARCHAR(15)                             DEFAULT NULL        COMMENT '우편번호',
    other_address_1                                     VARCHAR(2000)                           DEFAULT NULL        COMMENT '기타주소1',
    other_address_2                                     VARCHAR(2000)                           DEFAULT NULL        COMMENT '기타주소2',
    other_postcode                                      VARCHAR(15)                             DEFAULT NULL        COMMENT '기타우편번호',
    home_phone_number                                   VARCHAR(20)                             DEFAULT NULL        COMMENT '전화번호',
    mobile_phone_number                                 VARCHAR(20)                             DEFAULT NULL        COMMENT '휴대전화번호',
    office_phone_number                                 VARCHAR(20)                             DEFAULT NULL        COMMENT '사무실전화번호',
    other_phone_number                                  VARCHAR(20)                             DEFAULT NULL        COMMENT '기타전화번호',
    receive_email                                       TINYINT UNSIGNED        NOT NULL                            COMMENT '이메일 수신여부',
    receive_text_message                                TINYINT UNSIGNED        NOT NULL                            COMMENT '문자메세지 수신여부',
    receive_push_message                                TINYINT UNSIGNED        NOT NULL                            COMMENT '푸시매세지 수신여부',
    receive_other_message                               TINYINT UNSIGNED        NOT NULL                            COMMENT '기타메시지 수신여부',
    referrer_type_code                                  TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '가입경로 타입코드',
    referrer_name                                       VARCHAR(80)                             DEFAULT NULL        COMMENT '가입경로 이름',
    picture_id_image_url                                LONGTEXT                                DEFAULT NULL        COMMENT '사진 이미지 URL',
    bank_account_image_url                              LONGTEXT                                DEFAULT NULL        COMMENT '은행계좌 사본 이미지 RUL',
    is_modifiable                                       TINYINT UNSIGNED        NOT NULL                            COMMENT '수정 사용 여부',
    level                                               TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '레벨',
    need_to_update_profile                              TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '프로필 업데이트 필요 여부',
    is_dormant_warned                                   TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '휴면계정경고',
    is_dormant_notified                                 TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '휴면계정알림',
    is_delete_requested                                 TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '삭제요청여부',
    delete_requested_date                               DATETIME                                DEFAULT NULL        COMMENT '삭제요청일시',
    delete_reason                                       LONGTEXT                                DEFAULT NULL        COMMENT '삭제사유',
    status_code                                         TINYINT UNSIGNED        NOT NULL                            COMMENT '상태코드',
    status_code_last_modified_date                      DATETIME                NOT NULL                            COMMENT '최근 상태코드 갱신일',
    is_certification_exempted                           TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '공인인증서 예외 여부',
    certification_exempted_date                         DATETIME                                DEFAULT NULL        COMMENT '공인인증서 예외 처리 종료일',
    allowed_to_enroll                                   TINYINT UNSIGNED        NOT NULL                            COMMENT '수강신청사용여부',
    registered_by_user_idx                              INT UNSIGNED                            DEFAULT NULL        COMMENT '등록 사용자 인덱스',
    registered_from_country                             VARCHAR(20)             NOT NULL                            COMMENT '등록 국가',
    registered_from_ip_address                          VARCHAR(40)             NOT NULL                            COMMENT '등록 IP 주소',
    registered_from_device_type_code                    TINYINT UNSIGNED        NOT NULL                            COMMENT '등록 기기 타입코드',
    registered_date                                     DATETIME                NOT NULL                            COMMENT '등록일시',
    last_modified_by_user_idx                           INT UNSIGNED                            DEFAULT NULL        COMMENT '최근 수정한 사용자 인덱스',
    last_modified_from_country                          VARCHAR(20)             NOT NULL                            COMMENT '최근 수정한 국가명',
    last_modified_from_ip_address                       VARCHAR(40)             NOT NULL                            COMMENT '최근 수정한 IP 주소',
    last_modified_from_device_type_code                 TINYINT UNSIGNED        NOT NULL                            COMMENT '최근 수정한 기기 타입 코드',
    last_modified_date                                  DATETIME                NOT NULL                            COMMENT '최근 수정일시',

    PRIMARY KEY (history_id)

    ) COMMENT '사용자 정보 이력';



-- 사용자 기타 정보 테이블
CREATE TABLE IF NOT EXISTS TB_USER_PROPERTY_HISTORY
(
    history_id                                          INT UNSIGNED            NOT NULL        AUTO_INCREMENT      COMMENT '이력 아이디',
    history_year                                        INT UNSIGNED            NOT NULL                            COMMENT '이력 년도',
    user_idx                                            INT UNSIGNED            NOT NULL                            COMMENT '사용자 인덱스',
    name                                                VARCHAR(80)             NOT NULL                            COMMENT '기타 정보 이름',
    value                                               LONGTEXT                NOT NULL                            COMMENT '기타 정보 값',

    PRIMARY KEY (history_id)
    ) COMMENT '사용자 속성 정보 이력';




-- 수강 신청 테이블
CREATE TABLE IF NOT EXISTS TB_COURSE_ENROLLMENT_HISTORY
(
    history_id                                          INT UNSIGNED            NOT NULL        AUTO_INCREMENT      COMMENT '이력 아이디',
    history_year                                        INT UNSIGNED            NOT NULL                            COMMENT '이력 년도',
    course_id                                           INT UNSIGNED            NOT NULL                            COMMENT '과정 ID',
    student_user_idx                                    INT UNSIGNED            NOT NULL                            COMMENT '학습자 인덱스',
    status_code                                         TINYINT UNSIGNED        NOT NULL                            COMMENT '수강상태코드',
    enrollment_count                                    TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '수강신청 갯수',
    study_material_delivery_status_code                 TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '배송 상태 코드',
    study_material_delivery_status_last_modified_date   DATETIME                                DEFAULT NULL        COMMENT '배송 상태 변경일',
    auditing_start_date                                 DATETIME                                DEFAULT NULL        COMMENT '청강시작일시',
    auditing_end_date                                   DATETIME                                DEFAULT NULL        COMMENT '청강종료일시',
    courseware_homepage_url                             LONGTEXT                                DEFAULT NULL        COMMENT '과목 홈페이지 URL',
    unenroll_url                                        LONGTEXT                                DEFAULT NULL        COMMENT '수강취소 URL',
    certificate_url                                     LONGTEXT                                DEFAULT NULL        COMMENT '인증서 URL',
    properties                                          LONGTEXT                                DEFAULT NULL        COMMENT '속성',
    academic_advisor_user_idx                           INT UNSIGNED                            DEFAULT NULL        COMMENT '담당자 인덱스',
    academic_advisor_assigned_date                      DATETIME                                DEFAULT NULL        COMMENT '담당자 배정일',
    is_prepared                                         TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '선수처리 여부',
    is_repeated                                         TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '재수강 여부',
    unenroll_request_status_code                        TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '취소 요청 상태 코드',
    unenroll_requested_by_user_idx                      INT UNSIGNED                            DEFAULT NULL        COMMENT '취소 요청 사용자 인덱스',
    unenroll_requested_from_country                     VARCHAR(20)                             DEFAULT NULL        COMMENT '취소 요청 국가',
    unenroll_requested_from_ip_address                  VARCHAR(40)                             DEFAULT NULL        COMMENT '취소 요청 IP 주소',
    unenroll_requested_from_device_type_code            TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '취소 요청 기기 타입 코드',
    unenroll_requested_date                             DATETIME                                DEFAULT NULL        COMMENT '취소 요청일',
    unenroll_request_approved_by_user_idx               INT UNSIGNED                            DEFAULT NULL        COMMENT '취소 승인 사용자 인덱스',
    unenroll_request_approved_from_country              VARCHAR(20)                             DEFAULT NULL        COMMENT '취소 승인 국가',
    unenroll_request_approved_from_ip_address           VARCHAR(40)                             DEFAULT NULL        COMMENT '취소 승인 IP 주소',
    unenroll_request_approved_from_device_type_code     TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '쥐소 승인 기기 타입 코드',
    unenroll_request_approved_date                      DATETIME                                DEFAULT NULL        COMMENT '취소 승인일',
    registered_by_user_idx                              INT UNSIGNED            NOT NULL                            COMMENT '등록 사용자 인덱스',
    registered_from_country                             VARCHAR(20)             NOT NULL                            COMMENT '등록 국가명',
    registered_from_ip_address                          VARCHAR(40)             NOT NULL                            COMMENT '등록 IP 주소',
    registered_from_device_type_code                    TINYINT UNSIGNED        NOT NULL                            COMMENT '등록 기기 타입 코드',
    registered_date                                     DATETIME                NOT NULL                            COMMENT '등록일시',
    last_modified_by_user_idx                           INT UNSIGNED            NOT NULL                            COMMENT '최근 수정한 사용자 인덱스',
    last_modified_from_country                          VARCHAR(20)             NOT NULL                            COMMENT '최근 수정한 국가명',
    last_modified_from_ip_address                       VARCHAR(40)             NOT NULL                            COMMENT '최근 수정한 IP 주소',
    last_modified_from_device_type_code                 TINYINT UNSIGNED        NOT NULL                            COMMENT '최근 수정한 기기 타입 코드',
    last_modified_date                                  DATETIME                NOT NULL                            COMMENT '최근 수정일시',

    PRIMARY KEY (history_id)

    ) COMMENT '과목 별 수강 신청 정보 이력';






-- 학생 성적 정보
CREATE TABLE IF NOT EXISTS TB_STUDENT_REPORT_HISTORY
(
    history_id                                          INT UNSIGNED            NOT NULL        AUTO_INCREMENT      COMMENT '이력 아이디',
    history_year                                        INT UNSIGNED            NOT NULL                            COMMENT '이력 년도',
    course_id                                           INT UNSIGNED            NOT NULL                            COMMENT '과목ID',
    student_user_idx                                    INT UNSIGNED            NOT NULL                            COMMENT '학습자 인덱스',
    total_learning_time_in_seconds                      DOUBLE                  NOT NULL        DEFAULT 0           COMMENT '콘텐츠 별 누적 학습 시간  (단위 : 초)',
    learning_progress                                   DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '진도율',
    exam_original_total_mark                            DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '시험 원점수',
    exam_total_mark                                     DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '시험점수',
    quiz_original_total_mark                            DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '퀴즈 원점수',
    quiz_total_mark                                     DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '퀴즈점수',
    assignment_original_total_mark                      DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '과제 원점수',
    assignment_total_mark                               DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '과제 점수',
    forum_original_total_mark                           DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '포럼 원점수',
    forum_total_mark                                    DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '포럼점수',
    live_seminar_original_total_mark                    DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '라이브세미나 원점수',
    live_seminar_total_mark                             DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '라이브세미나 점수',
    etc_original_total_mark                             DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '기타 원점수',
    etc_total_mark                                      DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '기타 점수',
    attendance_original_total_mark                      DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '출석 원점수',
    attendance_total_mark                               DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '출석 점수',
    board_participation_original_total_mark             DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '게시판 참여 원본 점수',
    board_participation_total_mark                      DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '게시판 참여 점수',
    survey_participation_original_total_mark            DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '설문 참여 원본 점수',
    survey_participation_total_mark                     DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '설문 참여 점수',
    original_total_mark                                 DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '총점 원점수',
    total_mark                                          DOUBLE UNSIGNED         NOT NULL        DEFAULT 0           COMMENT '총점',
    ranking                                             INT UNSIGNED                            DEFAULT NULL        COMMENT '등수/석차',
    letter_grade                                        VARCHAR(10)                             DEFAULT NULL        COMMENT '학점등급',
    course_completion_status_code                       TINYINT UNSIGNED        NOT NULL        DEFAULT 1           COMMENT '과목수려상태',
    completion_date                                     DATETIME                                DEFAULT NULL        COMMENT '완료일시',
    comment                                             LONGTEXT                                DEFAULT NULL        COMMENT '비고',
    is_completion_confirmed                             TINYINT UNSIGNED                        DEFAULT NULL        COMMENT '완료 확정 여부',
    is_available                                        TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '게시 여부 (0 : 불가 / 1 : 가능)',
    is_manually_modified                                TINYINT UNSIGNED        NOT NULL        DEFAULT 0           COMMENT '수동 보정 사용 여부',
    registered_by_user_idx                              INT UNSIGNED            NOT NULL                            COMMENT '등록 사용자 인덱스',
    registered_from_country                             VARCHAR(20)             NOT NULL                            COMMENT '등록 국가',
    registered_from_ip_address                          VARCHAR(40)             NOT NULL                            COMMENT '등록 IP 주소',
    registered_from_device_type_code                    TINYINT UNSIGNED        NOT NULL                            COMMENT '등록 기기 타입 코드',
    registered_date                                     DATETIME                NOT NULL                            COMMENT '등록일',
    last_modified_by_user_idx                           INT UNSIGNED            NOT NULL                            COMMENT '최종 수정 사용자 인덱스',
    last_modified_from_country                          VARCHAR(20)             NOT NULL                            COMMENT '최종 수정 국가',
    last_modified_from_ip_address                       VARCHAR(40)             NOT NULL                            COMMENT '최종 수정 IP 주소',
    last_modified_from_device_type_code                 TINYINT UNSIGNED        NOT NULL                            COMMENT '최종 수정 기기 타입 코드',
    last_modified_date                                  DATETIME                NOT NULL                            COMMENT '최종 수정일',

    PRIMARY KEY (history_id)

    ) COMMENT '학습자의 성적정보 이력';








