package com.vsquare.polaris2.stop.handler;

import com.vsquare.commons.tool.CollectionUtils;
import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.commons.tool.StringEscapeUtils;
import com.vsquare.polaris2.core.model.NameValuePair;
import com.vsquare.polaris2.core.model.common.Attribute;
import com.vsquare.polaris2.core.model.content.Question;
import com.vsquare.polaris2.core.model.learning.Course;
import com.vsquare.polaris2.core.model.survey.*;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserProperties;
import com.vsquare.polaris2.core.service.survey.impl.AbstractSurveyServiceExportHandler;
import com.vsquare.polaris2.core.tool.JSONParseUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.TagNode;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.*;

@Component
public class StopSurveyServiceExportHandler extends AbstractSurveyServiceExportHandler {

    @Override
    public Workbook doExportSurveyRequestParticipantResult(Session session,
                                                           long id,
                                                           SurveyRequest surveyRequest,
                                                           Survey survey,
                                                           List<SurveyParticipantSummary> surveyParticipantSummaryList,
                                                           List<SurveyResponse> surveyResponseList) throws Exception {

        List<Attribute> attributeList = this.commonMapper.selectAttributeListByCategoryCode(null,
                                                                                            null,
                                                                                            null,
                                                                                            null,
                                                                                            null,
                                                                                            null);

        Map<Long, Attribute> attributeMap = new HashMap<>();
        for (Attribute item : attributeList) {
            attributeMap.put(item.getId(),
                             item);
        }


        Workbook workbook = new HSSFWorkbook();

        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "설문 결과");

        List<SurveyQuestion> questionList = survey.getQuestionList();

        if (CollectionUtils.isNotNullOrEmpty(questionList) &&
                CollectionUtils.isNotNullOrEmpty(surveyParticipantSummaryList) &&
                CollectionUtils.isNotNullOrEmpty(surveyResponseList)) {

            ArrayList<String> columnList = new ArrayList<>();

            //문항 id 리스트
            ArrayList<Integer> questionIdList = new ArrayList<>();


            // header Row
            columnList.add("이름");
            columnList.add("아이디");

            columnList.add("연락처");
            columnList.add("생년월일");
            columnList.add("이메일");
            columnList.add("지정성별");
            columnList.add("소속기관명");
            columnList.add("소속기관 유형(대분류)");
            columnList.add("소속기관 유형(소분류)");
            columnList.add("소속기관 소재지");
            columnList.add("소속기관 주소");
            columnList.add("국비지원여부");
            columnList.add("소속기관 연락처");
            columnList.add("현 기관 총 경력");
            columnList.add("여성폭력방지기관 총 경력");
            columnList.add("직위");


            int questionNumber = 0;
            for (SurveyQuestion sq : questionList) {
                questionNumber++;
                String colName = "문항 " + questionNumber;

                columnList.add(colName);
                questionIdList.add(sq.getIdx());
            }

            //sort imple

            int columnCount = columnList.size();
            int currentRowIdx = 0;
            Row headerRow = sheet.createRow(currentRowIdx);

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setBorderTop(BorderStyle.THIN);
            headerCellStyle.setBorderBottom(BorderStyle.THIN);
            headerCellStyle.setBorderLeft(BorderStyle.THIN);
            headerCellStyle.setBorderRight(BorderStyle.THIN);

            for (int i = 0; i < columnCount; i++) {
                String columnName = columnList.get(i);

                Cell headerCell = headerRow.createCell(i);
                headerCell.setCellStyle(headerCellStyle);
                headerCell.setCellValue(columnName);
            }

            //for write body rows
            currentRowIdx++;

            // Body Row settings
            CellStyle bodyCellStyle = workbook.createCellStyle();
            bodyCellStyle.setAlignment(HorizontalAlignment.CENTER);
            bodyCellStyle.setBorderTop(BorderStyle.THIN);
            bodyCellStyle.setBorderBottom(BorderStyle.THIN);
            bodyCellStyle.setBorderLeft(BorderStyle.THIN);
            bodyCellStyle.setBorderRight(BorderStyle.THIN);


            //data parsing to Map
            Map<Long, List<SurveyResponse>> surveyResponseMap = new HashMap<Long, List<SurveyResponse>>();

            for (SurveyResponse sr : surveyResponseList) {

                Long userIdx = sr.getUserIdx();

                List<SurveyResponse> list = surveyResponseMap.get(userIdx);

                if (list == null) {

                    list = new ArrayList<SurveyResponse>();
                    surveyResponseMap.put(userIdx,
                                          list);
                }

                list.add(sr);
            }

            //value column data 전처리 & write column
            for (SurveyParticipantSummary sps : surveyParticipantSummaryList) {
                Long useridx = sps.getUserIdx();

                //get user information and user-properties
                User user = this.userMapper.selectUserByIdx(useridx);
                UserProperties studentUserProperties = userMapper.selectUserPropertyByUserIdx(useridx);
                Map<String, String> propertyMap = new HashMap<>();

                if (studentUserProperties != null) {
                    for (NameValuePair item : studentUserProperties) {
                        if (item.getName() != null && item.getValue() != null) {
                            propertyMap.put(item.getName(),
                                            item.getValue());
                        }
                    }
                }


                // (questionId , answer) pair
//                Map<Integer, String> qnaMap = new HashMap<Integer , String>();
//
//                for (SurveyResponse sr : surveyResponseList) {
//                    Integer questionIdx = sr.getIdx();
//
//                    if (useridx.equals(sr.getUserIdx())) {
//                        qnaPair.put(questionIdx, sr.getAnswer());
//                    }
//                }

                List<SurveyResponse> selectedSurveyResponseList = surveyResponseMap.get(useridx);

                if (CollectionUtils.isNullOrEmpty(selectedSurveyResponseList))
                    continue;

                Map<Integer, String> qnaMap = new HashMap<Integer, String>();

                for (SurveyResponse selectedSurveyResponse : selectedSurveyResponseList) {

                    qnaMap.put(selectedSurveyResponse.getQuestionIdx(),
                               selectedSurveyResponse.getAnswer());
                }


                // start writing body rows
                Row bodyRow = sheet.createRow(currentRowIdx);

                //write user basic information columns
                for (int i = 0; i < columnList.size(); i++) {

                    Cell bodyCell = bodyRow.createCell(i);
                    bodyCell.setCellStyle(bodyCellStyle);

                    String colName = columnList.get(i);

                    if (colName.equals("이름")) {

                        bodyCell.setCellValue(sps.getUserName());

                    } else if (colName.equals("아이디")) {

                        bodyCell.setCellValue(sps.getUserId());

                    } else if (colName.equals("연락처")) {

                        String mobileNumber = user.getMobilePhoneNumber();

                        if (StringUtils.isNotBlank(mobileNumber)) {

                            bodyCell.setCellValue(mobileNumber);

                        } else {

                            bodyCell.setCellValue("-");

                        }

                    } else if (colName.equals("생년월일")) {

                        Date birthDate = user.getDateOfBirth();

                        if (birthDate != null) {

                            String birthString = DateFormats.format(birthDate);
                            birthString = birthString.split(" ")[0];
                            bodyCell.setCellValue(birthString);

                        } else {

                            bodyCell.setCellValue("-");

                        }
                    } else if (colName.equals("이메일")) {

                        String email = user.getEmail();

                        if (StringUtils.isNotBlank(email)) {
                            bodyCell.setCellValue(email);
                        } else {
                            bodyCell.setCellValue("-");
                        }

                    } else if (colName.equals("지정성별")) {
                        User.Gender studentUserGender = user.getGender();

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

                    } else if (colName.equals("소속기관명")) {

                        String company = user.getCompanyName();

                        if (StringUtils.isNotBlank(company)) {
                            bodyCell.setCellValue(company);
                        } else {
                            bodyCell.setCellValue("-");
                        }

                    } else if (colName.equals("소속기관 유형(대분류)")) {

                        String agTypeDp = propertyMap.get("agTypeDp");
                        if (StringUtils.isNotBlank(agTypeDp)) {
                            Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                            if (attribute != null) {
                                bodyCell.setCellValue(attribute.getName());
                            }
                        }

                    } else if (colName.equals("소속기관 유형(소분류)")) {

                        String agTypeDp = propertyMap.get("agTypeDp2");
                        String agTypeParent = propertyMap.get("agTypeDp");

                        if (StringUtils.isNotBlank(agTypeDp)) {
                            Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                            if (attribute != null) {
                                bodyCell.setCellValue(attribute.getName());
                            }
                        } else {

                            if (StringUtils.isNotBlank(agTypeParent)) {

                                //기관유형 depth2 가 존재하지 않을경우 depth1 과 똑같이 함.
                                Attribute attribute = attributeMap.get(Long.parseLong(agTypeParent));
                                if (attribute != null) {
                                    bodyCell.setCellValue(attribute.getName());
                                }
                            }
                        }

                    } else if (colName.equals("소속기관 소재지")) {

                        String studentUserAddress1 = user.getAddress1();
                        if (StringUtils.isNotEmpty(studentUserAddress1)) {

                            String[] studentUserAddress1Split = studentUserAddress1.trim()
                                                                                   .split(" ");
                            if (studentUserAddress1Split.length > 1) {
                                bodyCell.setCellValue(studentUserAddress1Split[0]);
                            }
                        }

                    } else if (colName.equals("소속기관 주소")) {

                        String studentUserAddress1 = user.getAddress1();
                        String studentUserAddress2 = user.getAddress2();

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

                        if (StringUtils.isNotEmpty(studentUserAddress)) {
                            bodyCell.setCellValue(studentUserAddress);
                        }

                    } else if (colName.equals("국비지원여부")) {

                        String support = propertyMap.get("support");
                        if (StringUtils.isNotBlank(support)) {

                            if (support.equals("false")) {
                                bodyCell.setCellValue("미지원");
                            } else {
                                bodyCell.setCellValue("지원");
                            }
                        }

                    } else if (colName.equals("소속기관 연락처")) {

                        String officePhoneNumber = user.getOfficePhoneNumber();

                        if (StringUtils.isNotBlank(officePhoneNumber)) {
                            bodyCell.setCellValue(officePhoneNumber);
                        } else {
                            bodyCell.setCellValue("-");
                        }


                    } else if (colName.equals("현 기관 총 경력")) {

                        String agTypeDp = propertyMap.get("career_present");
                        if (StringUtils.isNotBlank(agTypeDp)) {
                            Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                            if (attribute != null) {
                                bodyCell.setCellValue(attribute.getName());
                            }
                        }

                    } else if (colName.equals("여성폭력방지기관 총 경력")) {

                        String agTypeDp = propertyMap.get("career");
                        if (StringUtils.isNotBlank(agTypeDp)) {
                            Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                            if (attribute != null) {
                                bodyCell.setCellValue(attribute.getName());
                            }
                        }


                    } else if (colName.equals("직위")) {

                        String companyPosition = user.getCompanyPosition();

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

                    }
                }

                // survey result column
                for (int i = 0; i < questionIdList.size(); i++) {
                    Cell bodyCell = bodyRow.createCell(i + 16);
                    bodyCell.setCellStyle(bodyCellStyle);

                    Integer questionId = questionIdList.get(i);
                    Question question = questionList.get(questionId);
                    Question.Type questionType = question.getType();

                    if (questionType == Question.Type.MULTIPLE_CHOICE) {

                        String answer = qnaMap.get(questionId);
                        if (answer == null) {
                            bodyCell.setCellValue("미응답");
                            continue;
                        }

                        SatisfactionType type = this.checkSatisfactionType(question);
                        if (type != null) {

                            bodyCell.setCellValue(getScore(qnaMap.get(questionId),
                                                           type));

                        } else {

                            String questionAnswer = qnaMap.get(questionId);

                            try {
                                JSONObject jsonObject = JSONUtils.parseJSONObject(questionAnswer);
                                questionAnswer = JSONUtils.getChildString(jsonObject, "answer_list", "0","answer");
                            } catch ( Exception e ) {
                            }

                            bodyCell.setCellValue(questionAnswer);
                        }

                    } else {
                        String questionAnswer = qnaMap.get(questionId);

                        try {
                            JSONObject jsonObject = JSONUtils.parseJSONObject(questionAnswer);
                            questionAnswer = JSONUtils.getChildString(jsonObject, "answer_list", "0","answer");
                        } catch ( Exception e ) {
                        }

                        bodyCell.setCellValue(questionAnswer);
                    }
                }

                currentRowIdx++;
            }


            //cell auto resizing
            for (int i = 0; i < columnCount; i++) {
                sheet.autoSizeColumn(i);
            }
        }

        return workbook;
    }

    public Integer getNumberByQuestion(Question question) {

        String stem = StringEscapeUtils.removeHtmlTags(question.getStem())
                                       .replaceAll(" ",
                                                   "");

        String[] splits = stem.split("\\-");
        if (splits.length <= 1) {
            return null;
        }

        String number = splits[0];

        try {
            return Integer.parseInt(number);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean checkFirstQuestion(Question question) {

        String stem = StringEscapeUtils.removeHtmlTags(question.getStem())
                                       .replaceAll(" ",
                                                   "");

        String[] splits = stem.split("\\-");
        if (splits.length <= 1) {
            return false;
        }

        String second = splits[1];
        if (StringUtils.isBlank(second)) {
            return false;
        }

        return second.startsWith("1.");
    }

    public SatisfactionType checkSatisfactionType(Question question) {

        SatisfactionType type = null;

        String optionString = question.getOptionList();
        if (StringUtils.isBlank(optionString)) {
            return null;
        }

        JSONArray jsonArray = JSONUtils.parseJSONArrayWithoutException(optionString);
        if (jsonArray == null || jsonArray.size() == 0) {
            return null;
        }

        String optionStringWS = jsonArray.get(0)
                                         .toString()
                                         .replaceAll(" ",
                                                     "");

        if (optionStringWS.contains("매우그렇다")) {
            type = SatisfactionType.DESC;
        } else if (optionStringWS.contains("전혀그렇지않다")) {
            type = SatisfactionType.ASC;
        } else if (optionStringWS.contains("매우그렇지않다")) {
            type = SatisfactionType.ASC;
        }

        return type;
    }

    public long getScore(SurveyResponseCount surveyResponseCount,
                         SatisfactionType satisfactionType) throws Exception {

        long count = surveyResponseCount.getCount();

        if (satisfactionType == SatisfactionType.DESC) {

            long answer;
            try {
                answer = Long.parseLong(surveyResponseCount.getAnswer());
            } catch ( Exception e ) {
                JSONObject jsonObject = JSONUtils.parseJSONObject(surveyResponseCount.getAnswer());
                answer = JSONUtils.getChildLong(jsonObject, "answer_list", "0","answer");
            }

            long score = 5 - answer;
            return score * count;
        } else if (satisfactionType == SatisfactionType.ASC) {

            long answer;
            try {
                answer = Long.parseLong(surveyResponseCount.getAnswer());
            } catch ( Exception e ) {
                JSONObject jsonObject = JSONUtils.parseJSONObject(surveyResponseCount.getAnswer());
                answer = JSONUtils.getChildLong(jsonObject, "answer_list", "0","answer");
            }

            long score = answer + 1;
            return score * count;
        }

        return 0;
    }

    public long getScore(String answerString,
                         SatisfactionType satisfactionType) throws Exception {

        long answer;
        try {
            answer = Long.parseLong(answerString);
        } catch ( Exception e ) {
            JSONObject jsonObject = JSONUtils.parseJSONObject(answerString);
            answer = JSONUtils.getChildLong(jsonObject, "answer_list", "0","answer");
        }

        if (satisfactionType == SatisfactionType.DESC) {
            long score = 5 - answer;
            return score;
        } else if (satisfactionType == SatisfactionType.ASC) {
            long score = answer + 1;
            return score;
        }

        return 0;
    }

    @Override
    public Workbook doCreateSurveyResultWorkbook(Survey survey,
                                                 SurveyRequest surveyRequest,
                                                 SurveyResult surveyResult) throws Exception {
        boolean before2021= false;
        if ( surveyRequest != null ) {

            Long courseId = surveyRequest.getCourseId();
            if ( courseId != null ) {

                Course course = this.learningMapper.selectCourseById(courseId);
                Integer year = course.getYear();
                if ( year != null && year < 2022 ) {
                    before2021 = true;
                }
            }
        }

        Workbook workbook = new HSSFWorkbook();

        List<SurveyQuestion> surveyQuestionList = survey.getQuestionList();

        String[] columnNames = {"번호", "문항", "전체 응답자 수", "응답", "응답자 수", "비율", "평균점", "카테고리 평균점", "전체 평균"
//                , "응답자 상세 (아이디|이름|이메일)"
        };

        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "설문결과");

        // Header
        int columnCount = columnNames.length;
        int currentRowIdx = 0;
        Row headerRow = sheet.createRow(currentRowIdx);

        CellStyle headerCellStyle = workbook.createCellStyle();
        headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
        headerCellStyle.setBorderTop(BorderStyle.THIN);
        headerCellStyle.setBorderBottom(BorderStyle.THIN);
        headerCellStyle.setBorderLeft(BorderStyle.THIN);
        headerCellStyle.setBorderRight(BorderStyle.THIN);

        for (int i = 0; i < columnCount; i++) {

            String columnName = columnNames[i];

            Cell headerCell = headerRow.createCell(i);
            headerCell.setCellStyle(headerCellStyle);
            headerCell.setCellValue(columnName);
        }

        currentRowIdx++;

        // Body
        CellStyle bodyCellStyle = workbook.createCellStyle();
        bodyCellStyle.setAlignment(HorizontalAlignment.LEFT);
        bodyCellStyle.setBorderTop(BorderStyle.THIN);
        bodyCellStyle.setBorderBottom(BorderStyle.THIN);
        bodyCellStyle.setBorderLeft(BorderStyle.THIN);


        //카테고리 문항 때문에 한번 더 돌아야 함
        //다시돌고..돌고..돌고


        // 맵만들어서 일단 저장
        HashMap<Integer, Long> scoreMap = new HashMap<>();
        HashMap<Integer, Long> countMap = new HashMap<>();

        long totalScore = 0;
        long totalCount = 0;

        {

            for (SurveyQuestion surveyQuestion : surveyQuestionList) {

                SatisfactionType satisfactionType = this.checkSatisfactionType(surveyQuestion);
                if (satisfactionType != null) {

                    // 만족도조사 체크 되었을 때만 계산하는게 나음
                    Integer categoryNumber = getNumberByQuestion(surveyQuestion);
                    if (categoryNumber != null) {

                        int surveyQuestionIdx = surveyQuestion.getIdx();

                        List<SurveyResponseCount> surveyResponseCountList = null;
                        if (surveyResult != null) {
                            surveyResponseCountList = surveyResult.get(surveyQuestionIdx);
                        }

                        int totalAnswerCount = 0;
                        if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                            for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {
                                totalAnswerCount += surveyResponseCount.getCount();
                            }
                        }

                        long total = 0;


                        if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                            for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {

                                if (surveyResponseCount.getAnswer() == null) {
                                    continue;
                                }

                                total += this.getScore(surveyResponseCount,
                                                       satisfactionType);
                            }
                        }

                        Long score = scoreMap.get(categoryNumber);
                        if (score == null) {
                            score = 0L;
                        }
                        score += total;
                        totalScore += total;
                        scoreMap.put(categoryNumber,
                                     score);

                        Long count = countMap.get(categoryNumber);
                        if (count == null) {
                            count = 0L;
                        }
                        count += totalAnswerCount;
                        totalCount += totalAnswerCount;
                        countMap.put(categoryNumber,
                                     count);
                    }
                }
            }

        }


        int questionNumber = 0;

        for (SurveyQuestion surveyQuestion : surveyQuestionList) {

            Row bodyRow = sheet.createRow(currentRowIdx);

            int surveyQuestionIdx = surveyQuestion.getIdx();

            List<SurveyResponseCount> surveyResponseCountList = null;
            if (surveyResult != null) {
                surveyResponseCountList = surveyResult.get(surveyQuestionIdx);
            }

            int totalAnswerCount = 0;
            if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {
                    totalAnswerCount += surveyResponseCount.getCount();
                }
            }

            //만약 설문의 보기 중 '매우그렇다'를 포함할 경우 평균점 계산
            String optionString = surveyQuestion.getOptionList();
            Double avg = 0.0;
            boolean isSatisfy = false;

            SatisfactionType satisfactionType = this.checkSatisfactionType(surveyQuestion);
            if (satisfactionType != null) {

                isSatisfy = true;

                long total = 0;

                if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                    for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {
                        if (surveyResponseCount.getAnswer() == null) {
                            continue;
                        }

                        total += this.getScore(surveyResponseCount,
                                               satisfactionType);
                    }
                }

                avg = total / (double) totalAnswerCount;
            }

            for (int i = 0; i < columnCount; i++) {

                bodyCellStyle.setBorderRight(BorderStyle.THIN);

                Cell bodyCell = bodyRow.createCell(i);
                bodyCell.setCellStyle(bodyCellStyle);

                switch (i) {

                    case 0: {

                        questionNumber++;
                        String questionNumberString = String.valueOf(questionNumber);
                        bodyCell.setCellValue(questionNumberString);
                        break;
                    }

                    case 1: {

                        String surveyQuestionStem = surveyQuestion.getStem();

                        HtmlCleaner cleaner = new HtmlCleaner();
                        TagNode surveyQuestionStemTagNode = cleaner.clean(surveyQuestionStem);

                        bodyCell.setCellValue(surveyQuestionStemTagNode.getText()
                                                                       .toString());
                        break;
                    }

                    case 2: {

                        String totalAnswerCountString = String.valueOf(totalAnswerCount);
                        bodyCell.setCellValue(totalAnswerCountString);
                        break;
                    }

                    case 6: {

                        if (!isSatisfy) {
                            bodyCell.setCellValue("-");
                        } else {
                            if (avg != null) {
                                bodyCell.setCellValue(String.format("%.2f",
                                                                    avg));
                            } else {
                                bodyCell.setCellValue("-");
                            }
                        }

                        break;
                    }

                    case 7: {

                        if (this.checkFirstQuestion(surveyQuestion)) {

                            Integer categoryNumber = this.getNumberByQuestion(surveyQuestion);
                            if (categoryNumber != null) {

                                Long score = scoreMap.get(categoryNumber);
                                Long count = countMap.get(categoryNumber);

                                if (score == null || count == null) {
                                    bodyCell.setCellValue("-");
                                } else {
                                    bodyCell.setCellValue(String.format("%.2f",
                                                                        ((double) score / (double) count)));
                                }

                            } else {
                                bodyCell.setCellValue("-");
                            }

                        } else {
                            bodyCell.setCellValue("-");
                        }

                        break;
                    }

                    case 8: {

                        if (surveyQuestionIdx == 0 && totalCount > 0) {

                            
                            if ( before2021 ) {

                                // 2021년 이전 것들은 이렇게 해야함 ... 전체 총합
                                bodyCell.setCellValue(String.format("%.2f",
                                                                    ((double) totalScore / (double) totalCount)));
                                
                            } else {

                                // 이후것들은 카테고리 별로의 총계로 합산

                                if ( countMap != null && scoreMap != null ) {

                                    double totalSum = 0;
                                    int totalSumCount = 0;

                                    for ( Integer key : countMap.keySet() ) {

                                        Long count = countMap.get(key);
                                        Long score = scoreMap.get(key);

                                        if ( count == null || count == 0 ) {
                                            continue;
                                        }

                                        if ( score == null ) {
                                            score = 0L;
                                        }

                                        totalSum += ((double) score / (double) count);
                                        totalSumCount++;
                                    }

                                    if ( totalSumCount > 0 ) {

                                        bodyCell.setCellValue(String.format("%.2f",
                                                                            ((double) totalSum / (double) totalSumCount)));

                                    } else {
                                        bodyCell.setCellValue("-");
                                    }

                                } else {
                                    bodyCell.setCellValue("-");
                                }

                                
                            }

                        } else {
                            bodyCell.setCellValue("-");
                        }

                        break;
                    }

                    default: {

                        break;
                    }
                }
            }

            currentRowIdx++;

            Question.Type questionType = surveyQuestion.getType();

            switch (questionType) {

                case MULTIPLE_CHOICE: {

                    Map<String, Integer> surveyResponseCountMap = new HashMap<>();

                    if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                        for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {

                            Integer count = surveyResponseCountMap.getOrDefault(surveyResponseCount.getAnswer(),
                                                                                0);
                            count += surveyResponseCount.getCount();
                            surveyResponseCountMap.put(surveyResponseCount.getAnswer(),
                                                       count);

                        }
                    }

                    List<Question.Option> surveyQuestionOptionList = surveyQuestion.getOptionListAsList();
                    int surveyQuestionOptionCount = surveyQuestionOptionList.size();

                    for (int answerIdx = 0; answerIdx < surveyQuestionOptionCount; answerIdx++) {

                        bodyRow = sheet.createRow(currentRowIdx);

                        for (int j = 0; j < columnCount; j++) {

                            bodyCellStyle.setBorderRight(BorderStyle.THIN);

                            Cell bodyCell = bodyRow.createCell(j);
                            bodyCell.setCellStyle(bodyCellStyle);

                            Question.Option surveyQuestionOption = surveyQuestionOptionList.get(answerIdx);
                            String answer = surveyQuestionOption.getText();

                            int answerCount = 0;

                            Integer count = surveyResponseCountMap.get(String.valueOf(answerIdx));

                            if (count != null) answerCount = count;

                            switch (j) {

                                case 3: {

                                    bodyCell.setCellValue(answer);
                                    break;
                                }

                                case 4: {

                                    String answerCountString = String.valueOf(answerCount);
                                    bodyCell.setCellValue(answerCountString);
                                    break;
                                }

                                case 5: {

                                    double ratio = 0;

                                    if (answerCount > 0)
                                        ratio = BigDecimal.valueOf(answerCount)
                                                          .divide(BigDecimal.valueOf(totalAnswerCount),
                                                                  MathContext.DECIMAL128)
                                                          .multiply(BigDecimal.valueOf(100),
                                                                    MathContext.DECIMAL128)
                                                          .doubleValue();

                                    bodyCell.setCellValue(String.format("%.2f",
                                                                        ratio));
                                    break;
                                }

                                default: {

                                    break;
                                }
                            }
                        }

                        currentRowIdx++;
                    }

                    break;
                }

                case MULTIPLE_CHOICE_WITH_OTHER_OPTION: {

                    Map<String, SurveyResponseCount> surveyResponseCountMap = new HashMap<String, SurveyResponseCount>();
                    Set<String> otherAnswerSet = new LinkedHashSet<String>();

                    if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                        for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {

                            String answer = surveyResponseCount.getAnswer();
                            surveyResponseCountMap.put(answer,
                                                       surveyResponseCount);
                            otherAnswerSet.add(answer);
                        }
                    }


                    List<Question.Option> surveyQuestionOptionList = surveyQuestion.getOptionListAsList();
                    int surveyQuestionOptionCount = surveyQuestionOptionList.size();

                    for (int answerIdx = 0; answerIdx < surveyQuestionOptionCount; answerIdx++) {

                        bodyRow = sheet.createRow(currentRowIdx);

                        for (int j = 0; j < columnCount; j++) {

                            bodyCellStyle.setBorderRight(BorderStyle.THIN);

                            Cell bodyCell = bodyRow.createCell(j);
                            bodyCell.setCellStyle(bodyCellStyle);

                            Question.Option surveyQuestionOption = surveyQuestionOptionList.get(answerIdx);
                            String answer = surveyQuestionOption.getText();

                            int answerCount = 0;

                            SurveyResponseCount surveyResponseCount = surveyResponseCountMap.get(String.valueOf(answerIdx));
                            otherAnswerSet.remove(String.valueOf(answerIdx));

                            if (surveyResponseCount != null) answerCount = surveyResponseCount.getCount();

                            switch (j) {

                                case 3: {

                                    bodyCell.setCellValue(answer);
                                    break;
                                }

                                case 4: {

                                    String answerCountString = String.valueOf(answerCount);
                                    bodyCell.setCellValue(answerCountString);
                                    break;
                                }

                                case 5: {

                                    double ratio = 0;

                                    if (answerCount > 0)
                                        ratio = BigDecimal.valueOf(answerCount)
                                                          .divide(BigDecimal.valueOf(totalAnswerCount),
                                                                  MathContext.DECIMAL128)
                                                          .multiply(BigDecimal.valueOf(100),
                                                                    MathContext.DECIMAL128)
                                                          .doubleValue();

                                    bodyCell.setCellValue(String.format("%.2f",
                                                                        ratio));
                                    break;
                                }

                                case 6: {

//                                    if (surveyResponseCount != null) {
//
//                                        List<SurveyResponseParticipant> participantList = surveyResponseCount.getParticipantList();
//
//                                        String participantListString = "";
//
//                                        if (CollectionUtils.isNotNullOrEmpty(participantList)) {
//
//                                            StringBuilder participantListStringBuilder = new StringBuilder();
//
//                                            for (SurveyResponseParticipant participant : participantList) {
//
//                                                participantListStringBuilder.append("[");
//                                                participantListStringBuilder.append(participant.getUserId());
//                                                participantListStringBuilder.append(" | ");
//                                                participantListStringBuilder.append(participant.getUserName());
//                                                participantListStringBuilder.append(" | ");
//                                                participantListStringBuilder.append(participant.getUserEmail());
//                                                participantListStringBuilder.append("]");
//                                            }
//
//                                            participantListString = participantListStringBuilder.toString();
//                                        }
//
//                                        bodyCell.setCellValue(participantListString);
//                                    }

                                    break;
                                }

                                default: {

                                    break;
                                }
                            }
                        }

                        currentRowIdx++;
                    }

                    int otherAnswerCount = otherAnswerSet.size();
                    List<String> otherAnswerList = new ArrayList<>();
                    otherAnswerList.addAll(otherAnswerSet);

                    for (int otherAnswerIdx = 0; otherAnswerIdx < otherAnswerCount; otherAnswerIdx++) {

                        bodyRow = sheet.createRow(currentRowIdx);

                        for (int j = 0; j < columnCount; j++) {

                            bodyCellStyle.setBorderRight(BorderStyle.THIN);

                            Cell bodyCell = bodyRow.createCell(j);
                            bodyCell.setCellStyle(bodyCellStyle);

                            String answer = otherAnswerList.get(otherAnswerIdx);

                            int answerCount = 0;

                            SurveyResponseCount surveyResponseCount = surveyResponseCountMap.get(answer);

                            if (surveyResponseCount != null) answerCount = surveyResponseCount.getCount();

                            switch (j) {

                                case 3: {

                                    bodyCell.setCellValue(answer);
                                    break;
                                }

                                case 4: {

                                    String answerCountString = String.valueOf(answerCount);
                                    bodyCell.setCellValue(answerCountString);
                                    break;
                                }

                                case 5: {

                                    double ratio = 0;

                                    if (answerCount > 0)
                                        ratio = BigDecimal.valueOf(answerCount)
                                                          .divide(BigDecimal.valueOf(totalAnswerCount),
                                                                  MathContext.DECIMAL128)
                                                          .multiply(BigDecimal.valueOf(100),
                                                                    MathContext.DECIMAL128)
                                                          .doubleValue();

                                    bodyCell.setCellValue(String.format("%.2f",
                                                                        ratio));
                                    break;
                                }

                                case 6: {

//                                    List<SurveyResponseParticipant> participantList = surveyResponseCount.getParticipantList();
//
//                                    String participantListString = "";
//
//                                    if (CollectionUtils.isNotNullOrEmpty(participantList)) {
//
//                                        StringBuilder participantListStringBuilder = new StringBuilder();
//
//                                        for (SurveyResponseParticipant participant : participantList) {
//
//                                            participantListStringBuilder.append("[");
//                                            participantListStringBuilder.append(participant.getUserId());
//                                            participantListStringBuilder.append(" | ");
//                                            participantListStringBuilder.append(participant.getUserName());
//                                            participantListStringBuilder.append(" | ");
//                                            participantListStringBuilder.append(participant.getUserEmail());
//                                            participantListStringBuilder.append("]");
//                                        }
//
//                                        participantListString = participantListStringBuilder.toString();
//                                    }
//
//                                    bodyCell.setCellValue(participantListString);
//                                    break;
                                }

                                default: {

                                    break;
                                }
                            }
                        }

                        currentRowIdx++;
                    }

                    break;
                }

                case TRUE_FALSE: {

                    Map<String, SurveyResponseCount> surveyResponseCountMap = new HashMap<String, SurveyResponseCount>();

                    if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {

                        for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {

                            surveyResponseCountMap.put(surveyResponseCount.getAnswer(),
                                                       surveyResponseCount);
                        }
                    }


                    for (int answerIdx = 0; answerIdx < 2; answerIdx++) {

                        bodyRow = sheet.createRow(currentRowIdx);

                        for (int j = 0; j < columnCount; j++) {

                            bodyCellStyle.setBorderRight(BorderStyle.THIN);

                            Cell bodyCell = bodyRow.createCell(j);
                            bodyCell.setCellStyle(bodyCellStyle);

                            String answer = "X";

                            if (answerIdx != 0) answer = "O";

                            int answerCount = 0;

                            SurveyResponseCount surveyResponseCount = surveyResponseCountMap.get(String.valueOf(answerIdx));

                            if (surveyResponseCount != null) answerCount = surveyResponseCount.getCount();

                            switch (j) {

                                case 3: {

                                    bodyCell.setCellValue(answer);
                                    break;
                                }

                                case 4: {

                                    String answerCountString = String.valueOf(answerCount);
                                    bodyCell.setCellValue(answerCountString);
                                    break;
                                }

                                case 5: {

                                    double ratio = 0;

                                    if (answerCount > 0)
                                        ratio = BigDecimal.valueOf(answerCount)
                                                          .divide(BigDecimal.valueOf(totalAnswerCount),
                                                                  MathContext.DECIMAL128)
                                                          .multiply(BigDecimal.valueOf(100),
                                                                    MathContext.DECIMAL128)
                                                          .doubleValue();

                                    bodyCell.setCellValue(String.format("%.2f",
                                                                        ratio));
                                    break;
                                }

                                case 6: {

                                    String participantListString = "";

                                    if (surveyResponseCount != null) {

                                        List<SurveyResponseParticipant> participantList = surveyResponseCount.getParticipantList();

                                        if (CollectionUtils.isNotNullOrEmpty(participantList)) {

                                            StringBuilder participantListStringBuilder = new StringBuilder();

                                            for (SurveyResponseParticipant participant : participantList) {

                                                participantListStringBuilder.append("[");
                                                participantListStringBuilder.append(participant.getUserId());
                                                participantListStringBuilder.append(" | ");
                                                participantListStringBuilder.append(participant.getUserName());
                                                participantListStringBuilder.append(" | ");
                                                participantListStringBuilder.append(participant.getUserEmail());
                                                participantListStringBuilder.append("]");
                                            }

                                            participantListString = participantListStringBuilder.toString();
                                        }
                                    }

                                    bodyCell.setCellValue(participantListString);
                                    break;
                                }

                                default: {

                                    break;
                                }
                            }
                        }

                        currentRowIdx++;
                    }

                    break;
                }

                default: {

                    if (CollectionUtils.isNotNullOrEmpty(surveyResponseCountList)) {


                        for (SurveyResponseCount surveyResponseCount : surveyResponseCountList) {

                            bodyRow = sheet.createRow(currentRowIdx);

                            for (int j = 0; j < columnCount; j++) {

                                bodyCellStyle.setBorderRight(BorderStyle.THIN);

                                Cell bodyCell = bodyRow.createCell(j);
                                bodyCell.setCellStyle(bodyCellStyle);

                                int answerCount = surveyResponseCount.getCount();

                                switch (j) {

                                    case 3: {

                                        bodyCell.setCellValue(surveyResponseCount.getAnswer());
                                        break;
                                    }

                                    case 4: {

                                        String answerCountString = String.valueOf(answerCount);
                                        bodyCell.setCellValue(answerCountString);
                                        break;
                                    }

                                    case 5: {

                                        double ratio = BigDecimal.valueOf(answerCount)
                                                                 .divide(BigDecimal.valueOf(totalAnswerCount),
                                                                         MathContext.DECIMAL128)
                                                                 .multiply(BigDecimal.valueOf(100),
                                                                           MathContext.DECIMAL128)
                                                                 .doubleValue();
                                        bodyCell.setCellValue(String.format("%.2f",
                                                                            ratio));
                                        break;
                                    }

                                    case 6: {

//                                    List<SurveyResponseParticipant> participantList = surveyResponseCount.getParticipantList();
//
//                                    String participantListString = "";
//
//                                    if (CollectionUtils.isNotNullOrEmpty(participantList)) {
//
//                                        StringBuilder participantListStringBuilder = new StringBuilder();
//
//                                        for (SurveyResponseParticipant participant : participantList) {
//
//                                            participantListStringBuilder.append("[");
//                                            participantListStringBuilder.append(participant.getUserId());
//                                            participantListStringBuilder.append(" | ");
//                                            participantListStringBuilder.append(participant.getUserName());
//                                            participantListStringBuilder.append(" | ");
//                                            participantListStringBuilder.append(participant.getUserEmail());
//                                            participantListStringBuilder.append("]");
//                                        }
//
//                                        participantListString = participantListStringBuilder.toString();
//                                    }
//
//                                    bodyCell.setCellValue(participantListString);
//                                    break;
                                    }

                                    default: {

                                        break;
                                    }
                                }
                            }

                            currentRowIdx++;
                        }

                    }

                    break;
                }
            }
        }

        for (int i = 0; i < columnCount; i++) {

            sheet.autoSizeColumn(i);
        }

        return workbook;

    }


    public enum SatisfactionType {

        DESC(1),
        ASC(2);

        private static final Map<Integer, SatisfactionType> VALUE_MAP = new HashMap<Integer, SatisfactionType>();

        static {

            for (SatisfactionType type : SatisfactionType.values()) {

                VALUE_MAP.put(type.getCode(),
                              type);
            }
        }

        private final int code;

        SatisfactionType(final int code) {

            this.code = code;
        }

        public static SatisfactionType parseSatisfactionType(final int code) {

            SatisfactionType type = VALUE_MAP.get(code);

            if (type == null)
                throw new IllegalArgumentException("Illegal code: " + code);

            return type;
        }

        public int getCode() {

            return code;
        }
    }


}
