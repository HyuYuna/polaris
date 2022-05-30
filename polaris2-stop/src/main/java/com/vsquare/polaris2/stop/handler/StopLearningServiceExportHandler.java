package com.vsquare.polaris2.stop.handler;

import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.learning.CourseEnrollmentSummary;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.service.learning.impl.AbstractLearningServiceExportHandler;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Component;
import com.vsquare.commons.tool.Booleans;
import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.NameValuePair;
import com.vsquare.polaris2.core.model.common.Attribute;
import com.vsquare.polaris2.core.model.learning.CourseEnrollment;
import com.vsquare.polaris2.core.model.learning.CourseEnrollmentSummary;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserProperties;
import java.util.*;
import org.apache.poi.ss.usermodel.*;

@Component
public class StopLearningServiceExportHandler extends AbstractLearningServiceExportHandler {


    @Override
    public Workbook doExportCourseEnrollmentSummaryList(ServiceProvider serviceProvider,
                                                        ModelList<CourseEnrollmentSummary> courseEnrollmentSummaryList) throws Exception {


        List<Attribute> attributeList = this.commonMapper.selectAttributeListByCategoryCode(null,
                                                                                            null,
                                                                                            null,
                                                                                            null,
                                                                                            null, null);

        Map<Long, Attribute> attributeMap = new HashMap<>();
        for (Attribute item : attributeList) {
            attributeMap.put(item.getId(),
                             item);
        }

        Workbook workbook = new HSSFWorkbook();

        List<CourseEnrollmentSummary> list = courseEnrollmentSummaryList.getList();

        List<String> columnNameList = new ArrayList<>();
        columnNameList.add("운영 코드");
        columnNameList.add("기수 타입");
        columnNameList.add("기수 년도");
        columnNameList.add("기수 번호");
        columnNameList.add("과목명");
        columnNameList.add("아이디");
        columnNameList.add("이름");

        columnNameList.add("기관명");
        columnNameList.add("기관 전화번호");
        columnNameList.add("직급");
        columnNameList.add("기관유형 대분류");
        columnNameList.add("기관유형 소분류");
        columnNameList.add("여성폭력방지기관 총 경력");
        columnNameList.add("여성폭력방지기관 현 기관 경력");
        columnNameList.add("국비(지방비) 지원여부");
        columnNameList.add("재직증명서 확인여부");

        columnNameList.add("성별");
        columnNameList.add("생년월일");
        columnNameList.add("이메일");
        columnNameList.add("주소");
        columnNameList.add("우편번호");
        columnNameList.add("휴대전화번호");
        columnNameList.add("회원계정상태");

        columnNameList.add("신청일");
        columnNameList.add("수강상태");
        columnNameList.add("수강상태변경일");
        columnNameList.add("청강 시작일");
        columnNameList.add("청강 종료일");
        columnNameList.add("교재 발송");
        columnNameList.add("발송일시");
        columnNameList.add("이메일 수신여부");
        columnNameList.add("문자 수신여부");

        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "수강생_과목청강생");

        // Header
        int columnCount = columnNameList.size();
        int currentRowIdx = 0;
        Row headerRow = sheet.createRow(currentRowIdx);

        CellStyle headerCellStyle = workbook.createCellStyle();
        headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
        headerCellStyle.setBorderTop(BorderStyle.THIN);
        headerCellStyle.setBorderBottom(BorderStyle.THIN);
        headerCellStyle.setBorderLeft(BorderStyle.THIN);
        headerCellStyle.setBorderRight(BorderStyle.THIN);

        for (int i = 0; i < columnCount; i++) {

            String columnName = columnNameList.get(i);

            Cell headerCell = headerRow.createCell(i);
            headerCell.setCellStyle(headerCellStyle);
            headerCell.setCellValue(columnName);
        }

        currentRowIdx++;

        // Body
        CellStyle bodyCellStyle = workbook.createCellStyle();
        bodyCellStyle.setAlignment(HorizontalAlignment.CENTER);
        bodyCellStyle.setBorderTop(BorderStyle.THIN);
        bodyCellStyle.setBorderBottom(BorderStyle.THIN);
        bodyCellStyle.setBorderLeft(BorderStyle.THIN);
        bodyCellStyle.setBorderRight(BorderStyle.THIN);

        for (CourseEnrollmentSummary courseEnrollmentSummary : list) {

            User user = this.userMapper.selectUserByIdx(courseEnrollmentSummary.getStudentUserIdx());

            String companyName = user.getCompanyName();
            String companyPosition = user.getCompanyPosition();
            String officePhoneNumber = user.getOfficePhoneNumber();

            Row bodyRow = sheet.createRow(currentRowIdx);

            for (int i = 0; i < columnCount; i++) {

                Cell bodyCell = bodyRow.createCell(i);
                bodyCell.setCellStyle(bodyCellStyle);

                String columnName = columnNameList.get(i);

                UserProperties studentUserProperties = courseEnrollmentSummary.getStudentUserProperties();

                Map<String, String> propertyMap = new HashMap<>();

                if (studentUserProperties == null) {
                    bodyCell.setCellValue("");
                } else {
                    for (NameValuePair item : studentUserProperties) {
                        if (item.getName() != null && item.getValue() != null) {
                            propertyMap.put(item.getName(),
                                            item.getValue());
                        }
                    }
                }

                if (columnName.equals("운영 코드")) {
                    bodyCell.setCellValue(courseEnrollmentSummary.getCourseOperationCode());
                } else if (columnName.equals("기수 타입")) {

                    String termTypeName = null;

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            termTypeName = "상시제";
                            break;
                        }

                        default: {

                            termTypeName = "기수제";
                            break;
                        }
                    }

                    bodyCell.setCellValue(termTypeName);
                } else if (columnName.equals("기수 년도")) {

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            break;
                        }

                        default: {

                            bodyCell.setCellValue(courseEnrollmentSummary.getTermYear());
                            break;
                        }
                    }


                } else if (columnName.equals("기수 번호")) {

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            break;
                        }

                        default: {

                            bodyCell.setCellValue(courseEnrollmentSummary.getTermNumber());
                            break;
                        }
                    }

                } else if (columnName.equals("과목명")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getCourseServiceTitle());

                } else if (columnName.equals("아이디")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getStudentUserId());

                } else if (columnName.equals("이름")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getStudentUserName());

                } else if (columnName.equals("기관명")) {

                    bodyCell.setCellValue(companyName);

                } else if (columnName.equals("기관 전화번호")) {

                    bodyCell.setCellValue(officePhoneNumber);

                } else if (columnName.equals("직급")) {

                    if (StringUtils.isNotBlank(companyPosition)) {

                        // TODO 직급 하드코딩
                        if (companyPosition.equals("10")) {

                            String companyPositionText = propertyMap.get("positionText");
                            bodyCell.setCellValue(companyPositionText);

                        } else {

                            Attribute attribute = attributeMap.get(Long.parseLong(companyPosition));
                            if (attribute != null) {
                                bodyCell.setCellValue(attribute.getName());
                            }
                        }
                    }

                } else if (columnName.equals("기관유형 대분류")) {

                    String agTypeDp = propertyMap.get("agTypeDp");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("기관유형 소분류")) {

                    String agTypeDp = propertyMap.get("agTypeDp2");
                    String agTypeParent = propertyMap.get("agTypeDp");

                    if (StringUtils.isNotBlank(agTypeDp)) {
                        if (!agTypeDp.equals("-1")) {
                            Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                            if (attribute != null) {
                                bodyCell.setCellValue(attribute.getName());
                            }
                            continue;
                        }
                    }

                    if (StringUtils.isNotBlank(agTypeParent)) {

                        //기관유형 depth2 가 존재하지 않을경우 depth1 과 똑같이 함.
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeParent));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("여성폭력방지기관 총 경력")) {

                    String agTypeDp = propertyMap.get("career");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("여성폭력방지기관 현 기관 경력")) {

                    String agTypeDp = propertyMap.get("career_present");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("국비(지방비) 지원여부")) {


                    String support = propertyMap.get("support");
                    if (StringUtils.isNotBlank(support)) {

                        if (support.equals("false")) {
                            bodyCell.setCellValue("X");
                        } else {
                            bodyCell.setCellValue("O");
                        }
                    }

                } else if (columnName.equals("재직증명서 확인여부")) {

                    String companyAttachmentDocumentFileChecked = propertyMap.get("company_attachment_document_file_checked");
                    if (StringUtils.isNotBlank(companyAttachmentDocumentFileChecked)) {

                        if (companyAttachmentDocumentFileChecked.equals("1")) {
                            bodyCell.setCellValue("확인완료");
                        }
                    }

                } else if (columnName.equals("성별")) {

                    User.Gender studentUserGender = courseEnrollmentSummary.getStudentUserGender();

                    if (studentUserGender != null) {

                        switch (studentUserGender) {

                            case MALE: {

                                bodyCell.setCellValue("남자");
                                break;
                            }

                            case FEMALE: {

                                bodyCell.setCellValue("여자");
                                break;
                            }

                            case OTHER: {

                                bodyCell.setCellValue("기타");
                                break;
                            }

                            case UNKNOWN: {

                                bodyCell.setCellValue("정보없음");
                                break;
                            }
                        }
                    }


                } else if (columnName.equals("생년월일")) {

                    Date studentUserDateOfBirth = courseEnrollmentSummary.getStudentUserDateOfBirth();

                    if (studentUserDateOfBirth != null) {
                        bodyCell.setCellValue(DateFormats.format(studentUserDateOfBirth));
                    }

                } else if (columnName.equals("이메일")) {


                    String studentUserEmail = courseEnrollmentSummary.getStudentUserEmail();

                    if (StringUtils.isNotEmpty(studentUserEmail))
                        bodyCell.setCellValue(studentUserEmail);

                } else if (columnName.equals("주소")) {

                    String studentUserAddress1 = courseEnrollmentSummary.getStudentUserAddress1();
                    String studentUserAddress2 = courseEnrollmentSummary.getStudentUserAddress2();

                    String studentUserAddress = null;

                    StringBuilder studentUserAddressBuilder = null;

                    if (StringUtils.isNotBlank(studentUserAddress1)) {

                        studentUserAddressBuilder = new StringBuilder();
                        studentUserAddressBuilder.append(studentUserAddress1);

                        if (StringUtils.isNotBlank(studentUserAddress2)) {

                            studentUserAddressBuilder.append(" ");
                            studentUserAddressBuilder.append(studentUserAddress2);
                        }

                        studentUserAddress = studentUserAddressBuilder.toString();
                    }

                    if (StringUtils.isNotEmpty(studentUserAddress))
                        bodyCell.setCellValue(studentUserAddress);


                } else if (columnName.equals("우편번호")) {

                    String studentUserPostcode = courseEnrollmentSummary.getStudentUserPostcode();

                    if (StringUtils.isNotEmpty(studentUserPostcode))
                        bodyCell.setCellValue(studentUserPostcode);


                } else if (columnName.equals("휴대전화번호")) {


                    String studentUserMobilePhoneNumber = courseEnrollmentSummary
                            .getStudentUserMobilePhoneNumber();

                    if (StringUtils.isNotEmpty(studentUserMobilePhoneNumber))
                        bodyCell.setCellValue(studentUserMobilePhoneNumber);


                } else if (columnName.equals("회원계정상태")) {

                    User.Status studentUserStatus = courseEnrollmentSummary.getStudentUserStatus();

                    switch (studentUserStatus) {

                        case ACTIVE: {

                            bodyCell.setCellValue("활성");
                            break;
                        }

                        case DORMANT: {

                            bodyCell.setCellValue("휴면");
                            break;
                        }
                        case INACTIVE: {

                            bodyCell.setCellValue("비활성");
                            break;
                        }

                        case DELETE: {

                            bodyCell.setCellValue("탈퇴");
                            break;
                        }

                        case TEMPORARY: {

                            bodyCell.setCellValue("임시");
                            break;
                        }
                    }

                } else if (columnName.equals("신청일")) {

                    Date registeredDate = courseEnrollmentSummary.getRegisteredDate();
                    bodyCell.setCellValue(DateFormats.format(registeredDate));

                } else if (columnName.equals("수강상태")) {

                    String courseEnrollmentStatusName = null;

                    switch (courseEnrollmentSummary.getStatus()) {

                        case ENROLLMENT_REQUESTED: {

                            courseEnrollmentStatusName = "수강 대기";
                            break;
                        }

                        case AUDITING_REQUESTED: {

                            courseEnrollmentStatusName = "청강 대기";
                            break;
                        }

                        case ENROLLED: {

                            courseEnrollmentStatusName = "수강 중";
                            break;
                        }
                        case AUDITING: {

                            courseEnrollmentStatusName = "청강 중";
                            break;
                        }

                        case UNENROLLED: {

                            courseEnrollmentStatusName = "수강 취소";
                            break;
                        }

                        case AUDITING_CANCELLED: {

                            courseEnrollmentStatusName = "청강 취소";
                            break;
                        }

                        case AUTO_UNENROLLED_DUE_TO_USER_DELETE: {

                            courseEnrollmentStatusName = "자동 수강 취소(탈퇴)";
                            break;
                        }

                        case AUTO_UNENROLLED_DUE_TO_USER_ROLE_CHANGE: {

                            courseEnrollmentStatusName = "자동 수강 취소(권한 변경)";
                            break;
                        }
                    }

                    bodyCell.setCellValue(courseEnrollmentStatusName);


                } else if (columnName.equals("수강상태변경일")) {

                    Date courseEnrollmentLastModifiedDate = courseEnrollmentSummary.getLastModifiedDate();

                    bodyCell.setCellValue(DateFormats.format(courseEnrollmentLastModifiedDate));


                } else if (columnName.equals("청강 시작일")) {

                    String auditingStartDateString = null;

                    Date auditingStartDate = courseEnrollmentSummary.getAuditingStartDate();

                    if (auditingStartDate != null) {

                        auditingStartDateString = DateFormats.format(auditingStartDate);
                        bodyCell.setCellValue(auditingStartDateString);
                    }


                } else if (columnName.equals("청강 종료일")) {

                    String auditingEndDateString = null;

                    Date auditingEndDate = courseEnrollmentSummary.getAuditingEndDate();

                    if (auditingEndDate != null) {

                        auditingEndDateString = DateFormats.format(auditingEndDate);
                        bodyCell.setCellValue(auditingEndDateString);
                    }

                } else if (columnName.equals("교재 발송")) {


                    String courseEnrollmentStudyMaterialDeliveryStatusName = null;

                    CourseEnrollment.StudyMaterialDeliveryStatus courseEnrollmentStudyMaterialDeliveryStatus = courseEnrollmentSummary.getStudyMaterialDeliveryStatus();

                    if (courseEnrollmentStudyMaterialDeliveryStatus != null) {

                        switch (courseEnrollmentStudyMaterialDeliveryStatus) {

                            case NOT_RECEIVED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "발송 필요";
                                break;
                            }

                            case SENT: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "발송";
                                break;
                            }

                            case RECEIVED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "수신 완료";
                                break;
                            }
                            case RE_SEND_REQUESTED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "재발송 요청";
                                break;
                            }

                            case RE_SENT: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "재발송";
                                break;
                            }

                            case RE_RECEIVED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "재수신 완료";
                                break;
                            }
                        }

                        bodyCell.setCellValue(courseEnrollmentStudyMaterialDeliveryStatusName);
                    }


                } else if (columnName.equals("발송일시")) {

                    String studyMaterialDeliveryStatusLastModifiedDateString = null;

                    Date studyMaterialDeliveryStatusLastModifiedDate = courseEnrollmentSummary.getAuditingEndDate();

                    if (studyMaterialDeliveryStatusLastModifiedDate != null) {

                        studyMaterialDeliveryStatusLastModifiedDateString = DateFormats.format(studyMaterialDeliveryStatusLastModifiedDate);
                        bodyCell.setCellValue(studyMaterialDeliveryStatusLastModifiedDateString);
                    }


                } else if (columnName.equals("이메일 수신여부")) {


                    int receiveEmailInteger = courseEnrollmentSummary.getStudentUserReceiveEmail();
                    boolean receiveEmail = Booleans.integerToBoolean(receiveEmailInteger);

                    String receiveEmailString = "N";

                    if (receiveEmail)
                        receiveEmailString = "Y";

                    bodyCell.setCellValue(receiveEmailString);


                } else if (columnName.equals("문자 수신여부")) {


                    int receiveTextMessageInteger = courseEnrollmentSummary.getStudentUserReceiveTextMessage();
                    boolean receiveTextMessage = Booleans.integerToBoolean(receiveTextMessageInteger);

                    String receiveTextMessageString = "N";

                    if (receiveTextMessage)
                        receiveTextMessageString = "Y";

                    bodyCell.setCellValue(receiveTextMessageString);
                }
            }

            currentRowIdx++;
        }

        for (int i = 0; i < columnCount; i++) {

            sheet.autoSizeColumn(i);
        }

        return workbook;
    }

}
