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
        columnNameList.add("?????? ??????");
        columnNameList.add("?????? ??????");
        columnNameList.add("?????? ??????");
        columnNameList.add("?????? ??????");
        columnNameList.add("?????????");
        columnNameList.add("?????????");
        columnNameList.add("??????");

        columnNameList.add("?????????");
        columnNameList.add("?????? ????????????");
        columnNameList.add("??????");
        columnNameList.add("???????????? ?????????");
        columnNameList.add("???????????? ?????????");
        columnNameList.add("???????????????????????? ??? ??????");
        columnNameList.add("???????????????????????? ??? ?????? ??????");
        columnNameList.add("??????(?????????) ????????????");
        columnNameList.add("??????????????? ????????????");

        columnNameList.add("??????");
        columnNameList.add("????????????");
        columnNameList.add("?????????");
        columnNameList.add("??????");
        columnNameList.add("????????????");
        columnNameList.add("??????????????????");
        columnNameList.add("??????????????????");

        columnNameList.add("?????????");
        columnNameList.add("????????????");
        columnNameList.add("?????????????????????");
        columnNameList.add("?????? ?????????");
        columnNameList.add("?????? ?????????");
        columnNameList.add("?????? ??????");
        columnNameList.add("????????????");
        columnNameList.add("????????? ????????????");
        columnNameList.add("?????? ????????????");

        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "?????????_???????????????");

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

                if (columnName.equals("?????? ??????")) {
                    bodyCell.setCellValue(courseEnrollmentSummary.getCourseOperationCode());
                } else if (columnName.equals("?????? ??????")) {

                    String termTypeName = null;

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            termTypeName = "?????????";
                            break;
                        }

                        default: {

                            termTypeName = "?????????";
                            break;
                        }
                    }

                    bodyCell.setCellValue(termTypeName);
                } else if (columnName.equals("?????? ??????")) {

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            break;
                        }

                        default: {

                            bodyCell.setCellValue(courseEnrollmentSummary.getTermYear());
                            break;
                        }
                    }


                } else if (columnName.equals("?????? ??????")) {

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            break;
                        }

                        default: {

                            bodyCell.setCellValue(courseEnrollmentSummary.getTermNumber());
                            break;
                        }
                    }

                } else if (columnName.equals("?????????")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getCourseServiceTitle());

                } else if (columnName.equals("?????????")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getStudentUserId());

                } else if (columnName.equals("??????")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getStudentUserName());

                } else if (columnName.equals("?????????")) {

                    bodyCell.setCellValue(companyName);

                } else if (columnName.equals("?????? ????????????")) {

                    bodyCell.setCellValue(officePhoneNumber);

                } else if (columnName.equals("??????")) {

                    if (StringUtils.isNotBlank(companyPosition)) {

                        // TODO ?????? ????????????
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

                } else if (columnName.equals("???????????? ?????????")) {

                    String agTypeDp = propertyMap.get("agTypeDp");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("???????????? ?????????")) {

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

                        //???????????? depth2 ??? ???????????? ???????????? depth1 ??? ????????? ???.
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeParent));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("???????????????????????? ??? ??????")) {

                    String agTypeDp = propertyMap.get("career");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("???????????????????????? ??? ?????? ??????")) {

                    String agTypeDp = propertyMap.get("career_present");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("??????(?????????) ????????????")) {


                    String support = propertyMap.get("support");
                    if (StringUtils.isNotBlank(support)) {

                        if (support.equals("false")) {
                            bodyCell.setCellValue("X");
                        } else {
                            bodyCell.setCellValue("O");
                        }
                    }

                } else if (columnName.equals("??????????????? ????????????")) {

                    String companyAttachmentDocumentFileChecked = propertyMap.get("company_attachment_document_file_checked");
                    if (StringUtils.isNotBlank(companyAttachmentDocumentFileChecked)) {

                        if (companyAttachmentDocumentFileChecked.equals("1")) {
                            bodyCell.setCellValue("????????????");
                        }
                    }

                } else if (columnName.equals("??????")) {

                    User.Gender studentUserGender = courseEnrollmentSummary.getStudentUserGender();

                    if (studentUserGender != null) {

                        switch (studentUserGender) {

                            case MALE: {

                                bodyCell.setCellValue("??????");
                                break;
                            }

                            case FEMALE: {

                                bodyCell.setCellValue("??????");
                                break;
                            }

                            case OTHER: {

                                bodyCell.setCellValue("??????");
                                break;
                            }

                            case UNKNOWN: {

                                bodyCell.setCellValue("????????????");
                                break;
                            }
                        }
                    }


                } else if (columnName.equals("????????????")) {

                    Date studentUserDateOfBirth = courseEnrollmentSummary.getStudentUserDateOfBirth();

                    if (studentUserDateOfBirth != null) {
                        bodyCell.setCellValue(DateFormats.format(studentUserDateOfBirth));
                    }

                } else if (columnName.equals("?????????")) {


                    String studentUserEmail = courseEnrollmentSummary.getStudentUserEmail();

                    if (StringUtils.isNotEmpty(studentUserEmail))
                        bodyCell.setCellValue(studentUserEmail);

                } else if (columnName.equals("??????")) {

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


                } else if (columnName.equals("????????????")) {

                    String studentUserPostcode = courseEnrollmentSummary.getStudentUserPostcode();

                    if (StringUtils.isNotEmpty(studentUserPostcode))
                        bodyCell.setCellValue(studentUserPostcode);


                } else if (columnName.equals("??????????????????")) {


                    String studentUserMobilePhoneNumber = courseEnrollmentSummary
                            .getStudentUserMobilePhoneNumber();

                    if (StringUtils.isNotEmpty(studentUserMobilePhoneNumber))
                        bodyCell.setCellValue(studentUserMobilePhoneNumber);


                } else if (columnName.equals("??????????????????")) {

                    User.Status studentUserStatus = courseEnrollmentSummary.getStudentUserStatus();

                    switch (studentUserStatus) {

                        case ACTIVE: {

                            bodyCell.setCellValue("??????");
                            break;
                        }

                        case DORMANT: {

                            bodyCell.setCellValue("??????");
                            break;
                        }
                        case INACTIVE: {

                            bodyCell.setCellValue("?????????");
                            break;
                        }

                        case DELETE: {

                            bodyCell.setCellValue("??????");
                            break;
                        }

                        case TEMPORARY: {

                            bodyCell.setCellValue("??????");
                            break;
                        }
                    }

                } else if (columnName.equals("?????????")) {

                    Date registeredDate = courseEnrollmentSummary.getRegisteredDate();
                    bodyCell.setCellValue(DateFormats.format(registeredDate));

                } else if (columnName.equals("????????????")) {

                    String courseEnrollmentStatusName = null;

                    switch (courseEnrollmentSummary.getStatus()) {

                        case ENROLLMENT_REQUESTED: {

                            courseEnrollmentStatusName = "?????? ??????";
                            break;
                        }

                        case AUDITING_REQUESTED: {

                            courseEnrollmentStatusName = "?????? ??????";
                            break;
                        }

                        case ENROLLED: {

                            courseEnrollmentStatusName = "?????? ???";
                            break;
                        }
                        case AUDITING: {

                            courseEnrollmentStatusName = "?????? ???";
                            break;
                        }

                        case UNENROLLED: {

                            courseEnrollmentStatusName = "?????? ??????";
                            break;
                        }

                        case AUDITING_CANCELLED: {

                            courseEnrollmentStatusName = "?????? ??????";
                            break;
                        }

                        case AUTO_UNENROLLED_DUE_TO_USER_DELETE: {

                            courseEnrollmentStatusName = "?????? ?????? ??????(??????)";
                            break;
                        }

                        case AUTO_UNENROLLED_DUE_TO_USER_ROLE_CHANGE: {

                            courseEnrollmentStatusName = "?????? ?????? ??????(?????? ??????)";
                            break;
                        }
                    }

                    bodyCell.setCellValue(courseEnrollmentStatusName);


                } else if (columnName.equals("?????????????????????")) {

                    Date courseEnrollmentLastModifiedDate = courseEnrollmentSummary.getLastModifiedDate();

                    bodyCell.setCellValue(DateFormats.format(courseEnrollmentLastModifiedDate));


                } else if (columnName.equals("?????? ?????????")) {

                    String auditingStartDateString = null;

                    Date auditingStartDate = courseEnrollmentSummary.getAuditingStartDate();

                    if (auditingStartDate != null) {

                        auditingStartDateString = DateFormats.format(auditingStartDate);
                        bodyCell.setCellValue(auditingStartDateString);
                    }


                } else if (columnName.equals("?????? ?????????")) {

                    String auditingEndDateString = null;

                    Date auditingEndDate = courseEnrollmentSummary.getAuditingEndDate();

                    if (auditingEndDate != null) {

                        auditingEndDateString = DateFormats.format(auditingEndDate);
                        bodyCell.setCellValue(auditingEndDateString);
                    }

                } else if (columnName.equals("?????? ??????")) {


                    String courseEnrollmentStudyMaterialDeliveryStatusName = null;

                    CourseEnrollment.StudyMaterialDeliveryStatus courseEnrollmentStudyMaterialDeliveryStatus = courseEnrollmentSummary.getStudyMaterialDeliveryStatus();

                    if (courseEnrollmentStudyMaterialDeliveryStatus != null) {

                        switch (courseEnrollmentStudyMaterialDeliveryStatus) {

                            case NOT_RECEIVED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "?????? ??????";
                                break;
                            }

                            case SENT: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "??????";
                                break;
                            }

                            case RECEIVED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "?????? ??????";
                                break;
                            }
                            case RE_SEND_REQUESTED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "????????? ??????";
                                break;
                            }

                            case RE_SENT: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "?????????";
                                break;
                            }

                            case RE_RECEIVED: {

                                courseEnrollmentStudyMaterialDeliveryStatusName = "????????? ??????";
                                break;
                            }
                        }

                        bodyCell.setCellValue(courseEnrollmentStudyMaterialDeliveryStatusName);
                    }


                } else if (columnName.equals("????????????")) {

                    String studyMaterialDeliveryStatusLastModifiedDateString = null;

                    Date studyMaterialDeliveryStatusLastModifiedDate = courseEnrollmentSummary.getAuditingEndDate();

                    if (studyMaterialDeliveryStatusLastModifiedDate != null) {

                        studyMaterialDeliveryStatusLastModifiedDateString = DateFormats.format(studyMaterialDeliveryStatusLastModifiedDate);
                        bodyCell.setCellValue(studyMaterialDeliveryStatusLastModifiedDateString);
                    }


                } else if (columnName.equals("????????? ????????????")) {


                    int receiveEmailInteger = courseEnrollmentSummary.getStudentUserReceiveEmail();
                    boolean receiveEmail = Booleans.integerToBoolean(receiveEmailInteger);

                    String receiveEmailString = "N";

                    if (receiveEmail)
                        receiveEmailString = "Y";

                    bodyCell.setCellValue(receiveEmailString);


                } else if (columnName.equals("?????? ????????????")) {


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
