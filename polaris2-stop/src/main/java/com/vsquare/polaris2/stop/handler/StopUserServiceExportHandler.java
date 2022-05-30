package com.vsquare.polaris2.stop.handler;

import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.commons.tool.POIUtils;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserSummary;
import com.vsquare.polaris2.core.service.user.impl.AbstractUserServiceExportHandler;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class StopUserServiceExportHandler extends AbstractUserServiceExportHandler {

    @Override
    public Workbook doExportUserSummaryList(ServiceProvider serviceProvider,
                                            ModelList<UserSummary> userSummaryList) throws Exception {

        String properties = serviceProvider.getProperties();
        JSONObject propertiesJO = JSONUtils.parseJSONObject(properties);

        boolean userCompany = ServiceProvider.PropertyKey.extractBoolean(propertiesJO,
                                                                         ServiceProvider.PropertyKey.USER_COMPANY);

        Workbook workbook = new HSSFWorkbook();

        List<String> columnNameList = new ArrayList<>();
        columnNameList.add("아이디");
        columnNameList.add("권한");
        columnNameList.add("권한 그룹");
        columnNameList.add("이름");

        if (userCompany) {
            columnNameList.add("소속");
        }

        columnNameList.add("성별");
        columnNameList.add("생년월일");
        columnNameList.add("휴대폰번호");
        columnNameList.add("이메일");
        columnNameList.add("주소");
        columnNameList.add("등록일시");
        columnNameList.add("상태");
        columnNameList.add("상태변경일");

        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "사용자");

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


        List<UserSummary> list = userSummaryList.getList();

        for (UserSummary userSummary : list) {

            int colIndex = 0;


            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  userSummary.getId(),
                                  bodyCellStyle);

            {
                String userName = "";

                switch (userSummary.getRole()) {

                    case ADMIN: {

                        userName = "관리자";
                        break;
                    }

                    case INSTITUTION_ADMIN: {

                        userName = "관련기관 관리자";
                        break;
                    }

                    case ORGANIZATION_ADMIN: {

                        userName = "위탁기관 관리자";
                        break;
                    }

                    case CONTENT_PROVIDER: {

                        userName = "CP";
                        break;
                    }

                    case TEACHER: {

                        userName = "강사";
                        break;
                    }

                    case TEACHING_ASSISTANT: {

                        userName = "튜터";
                        break;
                    }

                    case ACADEMIC_ADVISOR: {

                        userName = "학습 매니저";
                        break;
                    }

                    case STUDENT: {

                        userName = "학습자";
                        break;
                    }
                }

                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      colIndex++,
                                      userName,
                                      bodyCellStyle);
            }

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  userSummary.getGroupName(),
                                  bodyCellStyle);

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  userSummary.getName(),
                                  bodyCellStyle);

            if (userCompany) {
                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      colIndex++,
                                      userSummary.getCompanyName(),
                                      bodyCellStyle);
            }

            {
                String genderName = "";

                if (userSummary.getGender() != null) {

                    switch (userSummary.getGender()) {

                        case MALE: {

                            genderName = "남성";
                            break;
                        }

                        case FEMALE: {

                            genderName = "여성";
                            break;
                        }

                        case OTHER: {

                            genderName = "기타";
                            break;
                        }

                        case UNKNOWN: {

                            genderName = "알수없음";
                            break;
                        }
                    }
                }

                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      colIndex++,
                                      genderName,
                                      bodyCellStyle);
            }


            String dateOfBirthString = "";
            if (userSummary.getDateOfBirth() != null) {
                dateOfBirthString = DateFormats.format(userSummary.getDateOfBirth());
            }

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  dateOfBirthString,
                                  bodyCellStyle);

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  userSummary.getMobilePhoneNumber(),
                                  bodyCellStyle);

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  userSummary.getEmail(),
                                  bodyCellStyle);


            String address = "";
            if (StringUtils.isNotBlank(userSummary.getAddress1())) {
                address += userSummary.getAddress1();
            }

            if (StringUtils.isNotBlank(userSummary.getAddress2())) {
                address += " " + userSummary.getAddress2();
            }

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  address,
                                  bodyCellStyle);

            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  DateFormats.format(userSummary.getRegisteredDate(),
                                                     true),
                                  bodyCellStyle);

            {
//                ACTIVE(1),
//                        INACTIVE(2),
//                        DORMANT(3),
//                        DELETE(4),
//                        TEMPORARY(5);

                User.Status status = userSummary.getStatus();

                String statusName = "";

                switch (status) {

                    case ACTIVE: {

                        statusName = "활성";
                        break;
                    }

                    case INACTIVE: {

                        statusName = "비활성";
                        break;
                    }

                    case DORMANT: {

                        statusName = "휴면";
                        break;
                    }

                    case DELETE: {

                        statusName = "탈퇴";
                        break;
                    }

                    case TEMPORARY: {

                        statusName = "임시";
                        break;
                    }
                }


                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      colIndex++,
                                      statusName,
                                      bodyCellStyle);
            }


            POIUtils.setCellValue(sheet,
                                  currentRowIdx,
                                  colIndex++,
                                  DateFormats.format(userSummary.getStatusLastModifiedDate(),
                                                     true),
                                  bodyCellStyle);

            currentRowIdx++;
        }

        for (int i = 0; i < columnCount; i++) {

            sheet.autoSizeColumn(i);
        }

        return workbook;
    }
}
