package com.vsquare.polaris2.stop.handler;

import com.vsquare.polaris2.core.model.system.SystemConfiguration;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.service.system.impl.DefaultSystemServiceHandler;
import org.springframework.stereotype.Component;

@Component
public class StopSystemServiceHandler extends DefaultSystemServiceHandler {

    @Override
    public void doDefineSystemConfiguration(SystemConfiguration systemConfiguration) throws Exception {

        systemConfiguration.setType(SystemConfiguration.Type.SINGLE_SERVICE_PROVIDER_AND_SINGLE_INSTITUTION_AND_SINGLE_INSTITUTION_WEBSITE);
        systemConfiguration.setUrlType(SystemConfiguration.UrlType.SUBDOMAIN);

        systemConfiguration.includeUserRole(User.Role.ADMIN);
        systemConfiguration.includeUserRole(User.Role.INSTITUTION_ADMIN);
        systemConfiguration.includeUserRole(User.Role.TEACHER);
//        systemConfiguration.includeUserRole(User.Role.TEACHING_ASSISTANT);
//        systemConfiguration.includeUserRole(User.Role.CONTENT_PROVIDER);
        systemConfiguration.includeUserRole(User.Role.STUDENT);

        systemConfiguration.includeComponent(SystemConfiguration.Component.LMS);
        systemConfiguration.includeComponent(SystemConfiguration.Component.LCMS);
//        systemConfiguration.includeComponent(SystemConfiguration.Component.CDMS);

//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.AUTHORIZATION_CERTIFICATE);
//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.INTERNAL_MESSAGE);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.EMAIL);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.TEXT_MESSAGE);
//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.PUSH_MESSAGE);
//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.MOBILE_APP);

        systemConfiguration.includeOption(SystemConfiguration.LMSOption.CERTIFICATE);
        systemConfiguration.includeOption(SystemConfiguration.LMSOption.LIVE_SEMINAR);
        systemConfiguration.includeOption(SystemConfiguration.LMSOption.STUDY_MATERIAL_DELIVERY);
//        systemConfiguration.includeOption(SystemConfiguration.LMSOption.LETTER_GRADE);
        systemConfiguration.includeOption(SystemConfiguration.LCMSOption.COURSE_CONTENT_ITEM_AVAILABILITY);
        systemConfiguration.includeOption(SystemConfiguration.LCMSOption.COURSE_CONTENT_ITEM_FILE_UPLOAD);
        systemConfiguration.includeOption(SystemConfiguration.LCMSOption.COURSE_CONTENT_ITEM_DISPLAY_ORDER);

        // 네이밍 변경 필요

//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.CHECK_PASSWORD_HISTORY);
//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.USER_STUDENT_TYPE);
//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.USER_YEAR);
//        systemConfiguration.includeOption(SystemConfiguration.CommonOption.USER_DEPARTMENT);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.SHOW_COMPLETED_COURSE_IN_OPERATING);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.USER_ID);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.USER_STATUS);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.INSERT_USER_TERMS_OF_SERVICE_ON_ADMIN_PAGE);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.SYNC_COURSE_WITH_CONTENT);
        systemConfiguration.includeOption(SystemConfiguration.CommonOption.USE_COMMON_TERMS_OF_SERVICE);
    }
}