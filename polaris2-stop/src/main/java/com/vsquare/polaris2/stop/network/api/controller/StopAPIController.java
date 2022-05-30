package com.vsquare.polaris2.stop.network.api.controller;

import com.vsquare.commons.tool.Booleans;
import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.polaris2.core.Code;
import com.vsquare.polaris2.core.database.Sequence;
import com.vsquare.polaris2.core.database.mapper.BoardMapper;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.MapModel;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.SearchOption;
import com.vsquare.polaris2.core.model.board.BoardContent;
import com.vsquare.polaris2.core.model.document.Document;
import com.vsquare.polaris2.core.model.learning.*;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.survey.SurveyRequest;
import com.vsquare.polaris2.core.model.survey.SurveyRequestSummary;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.network.api.controller.BaseAPIController;
import com.vsquare.polaris2.core.network.api.response.Response;
import com.vsquare.polaris2.core.service.file.FileServiceHandler;
import com.vsquare.polaris2.core.service.survey.SurveyService;
import com.vsquare.polaris2.core.tool.CommaSeparatedListParser;
import com.vsquare.polaris2.core.tool.PDFUtils;
import com.vsquare.polaris2.core.tool.ParseUtils;
import com.vsquare.polaris2.core.tool.SearchOptionUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Api(value = "/api/stop", description = "여성인권진흥원 관련 API", tags = "Document API")
@RestController
@RequestMapping(value = "/api/stop", produces = "text/plain;charset=UTF-8")
public class StopAPIController extends BaseAPIController {

    @Autowired
    public BoardMapper boardMapper;
    @Autowired
    SurveyService surveyService;
    @Autowired
    FileServiceHandler fileServiceHandler;

    public void saveExcel(String basePath,
                          String filename,
                          Workbook workbook) throws Exception {

        // 비동기 작업 존재 여부 확인
        FileOutputStream fos = null;

        try {

            String fileExtension = null;

            if (workbook instanceof HSSFWorkbook) {

                fileExtension = ".xls";

            } else if (workbook instanceof XSSFWorkbook) {

                fileExtension = ".xlsx";

            }

            File fileDir = new File(basePath);
            FileUtils.forceMkdir(fileDir);

            File filePath = new File(basePath,
                                     filename + fileExtension);

            fos = new FileOutputStream(filePath);

            workbook.write(fos);

        } catch (Exception e) {

        } finally {

            if (fos != null)
                fos.close();
        }
    }

    public String convertFilename(String orgnStr) {

        String restrictChars = "|\\\\?*<\":>/";
        String regExpr = "[" + restrictChars + "]+";

        // 파일명으로 사용 불가능한 특수문자 제거
        String tmpStr = orgnStr.replaceAll(regExpr,
                                           "");

        // 공백문자 "_"로 치환
        return tmpStr;
    }

//    @RequestMapping(value = {"/generateSurveyRequestExcel"})
//    @ResponseBody
//    public String generateSurveyRequestExcel(HttpServletRequest httpServletRequest,
//                                             HttpServletResponse httpServletResponse) throws Exception {
//
//        Response response = null;
//
//        try {
//
//
//            Session session = this.userService.updateAndGetSession(httpServletRequest,
//                                                                   httpServletResponse);
//
//            super.checkUserSessionAndStatus(session);
//
//            String basePath = "C:\\workspace\\stop\\";
//
//
//            ModelList<SurveyRequestSummary> modelList = this.surveyService.getSurveyRequestSummaryList(session,
//                                                                                                       httpServletRequest,
//                                                                                                       1L,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       true,
//                                                                                                       true,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null,
//                                                                                                       null);
//
//
//            List<SurveyRequestSummary> list = modelList.getList();
//
//            for (int i = 0, l = list.size(); i < l; i++) {
//
//                long id = list.get(i)
//                              .getId();
//
//                try {
//
//                    SurveyRequest surveyRequest = this.surveyService.getSurveyRequest(session,
//                                                                                      httpServletRequest,
//                                                                                      id);
//
//
//                    String title = this.convertFilename(surveyRequest.getCourseServiceTitle()) + " - " + this.convertFilename(surveyRequest.getTitle());
//
//                    System.out.println(surveyRequest.getId());
//
//                    Workbook workbook = this.surveyService.doExportSurveyRequestResult(session,
//                                                                                       id,
//                                                                                       false);
//
//                    this.saveExcel(basePath,
//                                   title,
//                                   workbook);
//
//                } catch (Exception e) {
//
//                    e.printStackTrace();
//                }
//
//            }
//
//            response = super.responseFactory.createResponse(Code.SUCCESS,
//                                                            httpServletRequest);
//
//        } catch (CodedException e) {
//
//            response = super.responseFactory.createResponse(e,
//                                                            httpServletRequest);
//        }
//
//        return response.toJSONString();
//
//
//    }

    @RequestMapping(value = {"/getUploadData"}, method = RequestMethod.POST)
    @ResponseBody
    public String getUploadData(HttpServletRequest httpServletRequest,
                                HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {


            Session session = this.userService.updateAndGetSession(httpServletRequest,
                                                                   httpServletResponse);

            super.checkUserSessionAndStatus(session);

            MapModel model = new MapModel();
            HashMap<String, Object> map = new HashMap<>();

            map.put("upload_url",
                    "https://kls.utime.kr:9443/pt/s3_upload_once");
            map.put("folder_id",
                    "39e584f8-60ae-4037-9687-ad440028d675");

            model.setMap(map);

            response = super.responseFactory.createResponse(Code.SUCCESS,
                                                            model.toJsonAware(),
                                                            httpServletRequest);

        } catch (CodedException e) {

            response = super.responseFactory.createResponse(e,
                                                            httpServletRequest);
        }

        return response.toJSONString();


    }

    @ApiOperation(value = "과목 수료증 다운로드", tags = "Document API")
    @RequestMapping(value = {"/generateConfirmCertificate", "/getConfirmCertificate"}, method = RequestMethod.GET)
    @ResponseBody
    public String generateConfirmCertificate(HttpServletRequest httpServletRequest,
                                             @RequestParam(value = "targetUserIdx", required = false) Long targetUserIdx,
                                             @RequestParam(value = "courseId") long courseId,
                                             @RequestParam(value = "properties", required = false) String propertiesString,
                                             @RequestParam(value = "destFilename", required = false) String destFilename,
                                             HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = this.userService.updateAndGetSession(httpServletRequest,
                                                                   httpServletResponse);

            super.checkUserSessionAndStatus(session);


            // set file name
            if (StringUtils.isBlank(destFilename))
                destFilename = System.currentTimeMillis() + ".pdf";

            super.setHttpHeaderForFileDownloadResponse(destFilename,
                                                       httpServletRequest,
                                                       httpServletResponse);

            String header = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "    <meta http-equiv=\"Expires\" content=\"-1\"></meta>" +
                    "    <meta http-equiv=\"Pragma\" content=\"No-Cache\"></meta>" +
                    "    <meta http-equiv=\"Cache-Control\" content=\"No-Cache\"></meta>" +
                    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"></meta>" +
                    "    <meta http-equiv=\"Content-type\" content=\"text/html; charset=UTF-8\"></meta>" +
                    "</head>" +
                    "<body>";

            String footer = "</body>" +
                    "</html>";

            String baseUrl = "https://edu.stop.or.kr";

            String html = "";

            html =
//                    " <img src=\"#{base_url}/res/home/img/stop/pdf/bg_frame.png\" style=\"position:absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; z-index: -100;\" />\n" +
                    "<div style=\"width:92%;margin:0 auto; padding: 20px 10px; position: relative;  \">\n" +
                            "                <img src=\"#{base_url}/res/home/img/stop/pdf/logo.png\" style=\"width: 300px; height: 300px; position: absolute; z-index: -99; top: 50%; left: 50%; transform: translate(-50%, -50%);\"/>\n" +
                            "                <p style=\"font-family:KoPubBatangLight; font-size: 14px;\">#{document_code}</p>\n" +
                            "                <h1 style=\"font-family:KoPubBatangBold;font-weight:normal;font-size: 60px; text-align: center; letter-spacing: 15px\">교육참가예정안내</h1>\n" +
                            "                <table style=\" margin-top: 100px; border: 1px solid #333333; width: 100%; border-spacing:0; border-collapse:collapse; font-size: 20px; line-height: 35px;\">\n" +
                            "                    <colgroup>\n" +
                            "                        <col width=\"20%;\" />\n" +
                            "                        <col width=\"30%;\" />\n" +
                            "                        <col width=\"20%;\" />\n" +
                            "                        <col width=\"30%;\" />\n" +
                            "                    </colgroup>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center;border: 1px solid #333333; padding: 20px;\">성명</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\">#{name}</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center;border: 1px solid #333333; padding: 20px;\">생년월일</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\">#{date_of_birth}</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center;border: 1px solid #333333; padding: 20px;\">교육과정</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{course_title}</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center; border: 1px solid #333333; padding: 20px;\">교육기간</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{start_date}. ~ #{end_date}.</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center; border: 1px solid #333333; padding: 20px;\">교육시간</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{study_time_in_hours}시간</td>\n" +
                            "                    </tr>\n" +
                            "                </table>\n" +
                            "                <p style=\"font-family:KoPubBatangBold;font-size: 25px; margin-top: 35px; text-align: center;\">\n" +
                            "                    한국여성인권진흥원에서 위 과정을 실시하고자 하오니,<br/>교육생이 본 과정에 참여할 수 있도록<br/>협조하여 주시기 바랍니다.                 \n" +
                            "                </p>\n" +
                            "                <div style=\"position: relative; margin-top: 50px; text-align: center;\">\n" +
                            "                    <p style=\"font-family:KoPubBatangLight;font-size: 20px;\">#{print_date}</p>\n" +
                            "                    <p style=\"font-family:KoPubBatangBold;font-size: 40px; margin-top: 130px;\">한국여성인권진흥원장</p>\n" +
                            "                    <img src=\"#{base_url}/res/home/img/stop/pdf/sign.png\" style=\"width: 80px; z-index: -98; height: 80px; position: absolute; bottom: -20px; right: 50px;\"/>\n" +
                            "                </div>\n" +
                            "            </div>";


            User user = this.userMapper.selectUserByIdx(session.getUserIdx());
            if (user == null) {
                throw new CodedException(Code.NO_SUCH_USER);
            }

            Course course = this.learningMapper.selectCourseById(courseId);
            if (course == null) {
                throw new CodedException(Code.NO_SUCH_COURSE);
            }

            String name = user.getName();
            String dateOfBirth = null;
            if (user.getDateOfBirth() != null) {
                dateOfBirth = DateFormats.format(user.getDateOfBirth(),
                                                 false);
            }

            String courseTitle = course.getServiceTitle();

            String startDate = null;
            if (course.getStartDate() != null) {
                startDate = DateFormats.format(course.getStartDate(),
                                               false);
            }


            String endDate = null;
            if (course.getEndDate() != null) {
                endDate = DateFormats.format(course.getEndDate(),
                                             false);
            }

            String studyTimeInHours = null;
            if (course.getStudyTimeInHours() != null) {
                studyTimeInHours = course.getStudyTimeInHours()
                                         .toString();
            } else {
                studyTimeInHours = "-";
            }

            String printDate = DateFormats.format(new Date(),
                                                  "yyyy년 MM월 dd일");

            HashMap<String, String> map = new HashMap<>();
            map.put("base_url",
                    baseUrl);
            map.put("name",
                    name);
            map.put("date_of_birth",
                    dateOfBirth);
            map.put("course_title",
                    courseTitle);
            map.put("start_date",
                    startDate);
            map.put("end_date",
                    endDate);
            map.put("study_time_in_hours",
                    studyTimeInHours);
            map.put("document_code",
                    "");
            map.put("print_date",
                    printDate);

            for (String key : map.keySet()) {
                String value = map.get(key);
                html = html.replaceAll("#\\{" + key + "\\}",
                                       value);
            }

            PDFUtils.drawHtml( getBaseUrl(httpServletRequest),
                              httpServletResponse.getOutputStream(),
                              header + html + footer,
                               false);


        } catch (Exception e) {


            CodedException codedException = new CodedException(Code.FAILED_TO_CREATE_STUDENT_CERTIFICATE);
            response = super.responseFactory.createResponse(codedException,
                                                            httpServletRequest);
            return response.toJSONString();
        }

        return null;
    }

    @ApiOperation(value = "과목 수료증 다운로드", tags = "Document API")
    @RequestMapping(value = {"/generateTrainingConfirmation", "/getTrainingConfirmation"}, method = RequestMethod.GET)
    @ResponseBody
    public String getTrainingConfirmation(HttpServletRequest httpServletRequest,
                                          @RequestParam(value = "boardContentId") long boardContentId,
                                          @RequestParam(value = "destFilename", required = false) String destFilename,
                                          HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = this.userService.updateAndGetSession(httpServletRequest,
                                                                   httpServletResponse);

            super.checkUserSessionAndStatus(session);

            BoardContent boardContent = super.boardMapper.selectBoardContentById(boardContentId,
                                                                                 null,
                                                                                 null);
            if (boardContent == null) {
                throw new CodedException(Code.ETC,
                                         "잘못된 입력입니다.");
            }

            BoardContent.Status status = boardContent.getStatus();
            if (status != BoardContent.Status.DONE) {
                throw new CodedException(Code.ETC,
                                         "잘못된 입력입니다.");
            }

            long targetUserIdx = boardContent.getRegisteredByUserIdx();

            String properties = boardContent.getProperties();

            JSONObject jsonObject = JSONUtils.parseJSONObject(properties);

            Date registeredDate = new Date();

            long registeredByUserIdx = session.getUserIdx();
            String registeredFromCountry = session.getRegisteredFromCountry();
            String registeredFromIpAddress = session.getRegisteredFromIpAddress();
            User.DeviceType registeredFromDeviceType = session.getUserDeviceType();

            super.documentMapper.insertDocument(Document.Type.COURSE_TRAINING_CERTIFICATE,
                                                null,
                                                null,
                                                targetUserIdx,
                                                registeredByUserIdx,
                                                registeredFromCountry,
                                                registeredFromIpAddress,
                                                registeredFromDeviceType,
                                                registeredDate);

            long newDocumentId = super.commonMapper.selectLastInsertId(Sequence.DOCUMENT.getName());

            Long documentId = JSONUtils.getChildLong(jsonObject,
                                                     "document_id");

            if ( documentId == null ) {

                documentId = newDocumentId;

                String yyyy = DateFormats.format(registeredDate,
                                                 "yyyy");

                String pdfType = "3";

                this.documentMapper.insertDocumentSequence(Document.Type.COURSE_TRAINING_CERTIFICATE,
                                                           yyyy + "_" + pdfType);

                long documentSequenceId = super.commonMapper.selectLastInsertId(Sequence.DOCUMENT_SEQUENCE.getName());

                long documentSequence = this.documentMapper.selectDocumentSequenceValueById(documentSequenceId);

                String documentCode = "한국여성인권진흥원 제 " + yyyy + " - " + pdfType + " - " + String.format("%03d",
                                                                                                      documentSequence) + "호";

                super.documentMapper.updateDocumentCodeById(documentId,
                                                            documentSequence,
                                                            documentCode,
                                                            jsonObject.toJSONString());

                jsonObject.put("document_id",
                               documentId);

                super.boardMapper.updateBoardContentPropertiesById(boardContentId,
                                                                   jsonObject.toJSONString());

            } else {

                Document prevDocument = super.documentMapper.selectDocumentById(documentId);

                documentId = newDocumentId;

                super.documentMapper.updateDocumentCodeById(documentId,
                                                            prevDocument.getSequenceValue(),
                                                            prevDocument.getCode(),
                                                            jsonObject.toJSONString());
            }

            Document document = super.documentMapper.selectDocumentById(documentId);

            String documentCode = document.getCode();

            // set file name
            if (StringUtils.isBlank(destFilename))
                destFilename = System.currentTimeMillis() + ".pdf";

            super.setHttpHeaderForFileDownloadResponse(destFilename,
                                                       httpServletRequest,
                                                       httpServletResponse);

            String header = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "    <meta http-equiv=\"Expires\" content=\"-1\"></meta>" +
                    "    <meta http-equiv=\"Pragma\" content=\"No-Cache\"></meta>" +
                    "    <meta http-equiv=\"Cache-Control\" content=\"No-Cache\"></meta>" +
                    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"></meta>" +
                    "    <meta http-equiv=\"Content-type\" content=\"text/html; charset=UTF-8\"></meta>" +
                    "</head>" +
                    "<body>";

            String footer = "</body>" +
                    "</html>";

            String baseUrl = "https://edu.stop.or.kr";

            String html = "";

            html =
//                    " <img src=\"#{base_url}/res/home/img/stop/pdf/bg_frame.png\" style=\"position:absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; z-index: -100;\" />\n" +
                    "<div style=\"width:92%;margin:0 auto; padding: 20px 10px; position: relative;  \">\n" +
                            "                <img src=\"#{base_url}/res/home/img/stop/pdf/logo.png\" style=\"width: 300px; height: 300px; position: absolute; z-index: -99; top: 50%; left: 50%; transform: translate(-50%, -50%);\"/>\n" +
                            "                <p style=\"font-family:KoPubBatangLight; font-size: 14px;\">#{document_code}</p>\n" +
                            "                <h1 style=\"font-family:KoPubBatangBold;font-weight:normal;font-size: 60px; text-align: center; letter-spacing: 15px\">교육확인서</h1>\n" +
                            "                <table style=\" margin-top: 100px; border: 1px solid #333333; width: 100%; border-spacing:0; border-collapse:collapse; font-size: 20px; line-height: 20px;\">\n" +
                            "                    <colgroup>\n" +
                            "                        <col width=\"26%;\" />\n" +
                            "                        <col width=\"28%;\" />\n" +
                            "                        <col width=\"20%;\" />\n" +
                            "                        <col width=\"28%;\" />\n" +
                            "                    </colgroup>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center;border: 1px solid #333333; padding: 20px;\">성명</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\">#{name}</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center;border: 1px solid #333333; padding: 20px;\">생년월일</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\">#{date_of_birth}</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center;border: 1px solid #333333; padding: 20px;\">교육과정</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{course_title}</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center; border: 1px solid #333333; padding: 20px;\">교육기간</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{start_date}. ~ #{end_date}.</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center; border: 1px solid #333333; padding: 20px;\">소속(기관)</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{company_name}</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center; border: 1px solid #333333; padding: 20px;\">소속(직책)</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{company_position}</td>\n" +
                            "                    </tr>\n" +
                            "                    <tr>\n" +
                            "                        <td style=\"font-family:KoPubBatangMedium;text-align: center; border: 1px solid #333333; padding: 20px;\">학습시간</td>\n" +
                            "                        <td style=\"font-family:KoPubBatangLight;border: 1px solid #333333; padding: 20px;\" colspan=\"3\">#{study_time_in_hours}시간</td>\n" +
                            "                    </tr>\n" +
                            "                </table>\n" +
                            "                <p style=\"font-family:KoPubBatangBold;font-size: 25px; margin-top: 50px; text-align: center;\">\n" +
                            "                    위 사람이 상기 교육과정에 참여하였음을 확인합니다.\n" +
                            "                </p>\n" +
                            "                <div style=\"position: relative; margin-top: 45px; text-align: center;\">\n" +
                            "                    <p style=\"font-family:KoPubBatangLight;font-size: 20px;\">#{print_date}</p>\n" +
                            "                    <p style=\"font-family:KoPubBatangBold;font-size: 40px; margin-top: 80px;\">한국여성인권진흥원장</p>\n" +
                            "                    <img src=\"#{base_url}/res/home/img/stop/pdf/sign.png\" style=\"width: 80px; z-index: -98; height: 80px; position: absolute; bottom: -20px; right: 50px;\"/>\n" +
                            "                </div>\n" +
                            "            </div>";


            User user = this.userMapper.selectUserByIdx(targetUserIdx);
            if (user == null) {
                throw new CodedException(Code.NO_SUCH_USER);
            }

            String name = user.getName();
            String dateOfBirth = null;
            if (user.getDateOfBirth() != null) {
                dateOfBirth = DateFormats.format(user.getDateOfBirth(),
                                                 false);
            }

            String courseTitle = JSONUtils.getChildString(jsonObject,
                                                          "confirm_service_title");

            String startDate = JSONUtils.getChildString(jsonObject,
                                                        "confirm_start_date");
            String endDate = JSONUtils.getChildString(jsonObject,
                                                      "confirm_end_date");
            String studyTimeInHours = JSONUtils.getChildString(jsonObject,
                                                               "confirm_study_time_in_hours");
            String companyName = JSONUtils.getChildString(jsonObject,
                                                          "confirm_company_name");
            String companyPosition = JSONUtils.getChildString(jsonObject,
                                                              "company_position");

            String printDate = DateFormats.format(new Date(),
                                                  "yyyy년 MM월 dd일");

            HashMap<String, String> map = new HashMap<>();
            map.put("base_url",
                    baseUrl);
            map.put("name",
                    name);
            map.put("date_of_birth",
                    dateOfBirth);
            map.put("course_title",
                    courseTitle);
            map.put("start_date",
                    startDate);
            map.put("end_date",
                    endDate);
            map.put("study_time_in_hours",
                    studyTimeInHours);
            map.put("company_name",
                    companyName);
            map.put("company_position",
                    companyPosition);
            map.put("document_code",
                    documentCode);
            map.put("print_date",
                    printDate);

            for (String key : map.keySet()) {
                String value = map.get(key);
                html = html.replaceAll("#\\{" + key + "\\}",
                                       value);
            }

            PDFUtils.drawHtml(
                    getBaseUrl(httpServletRequest),
                    httpServletResponse.getOutputStream(),
                    header + html + footer,
                              false);


        } catch (Exception e) {


            CodedException codedException = new CodedException(Code.FAILED_TO_CREATE_STUDENT_CERTIFICATE);
            response = super.responseFactory.createResponse(codedException,
                                                            httpServletRequest);
            return response.toJSONString();
        }

        return null;
    }









}
