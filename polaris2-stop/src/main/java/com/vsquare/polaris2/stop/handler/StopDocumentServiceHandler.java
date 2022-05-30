package com.vsquare.polaris2.stop.handler;

import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.DateUtils;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.database.Sequence;
import com.vsquare.polaris2.core.model.NameValuePair;
import com.vsquare.polaris2.core.model.document.Document;
import com.vsquare.polaris2.core.model.institution.Institution;
import com.vsquare.polaris2.core.model.learning.*;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserProperties;
import com.vsquare.polaris2.core.service.document.impl.AbstractDocumentServiceHandler;
import com.vsquare.polaris2.core.tool.PDFUtils;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;

import java.io.OutputStream;
import java.util.*;

@Component
public class StopDocumentServiceHandler extends AbstractDocumentServiceHandler {

    @Override
    public void doDrawSampleCourseCertificate(String baseUrl,
                                              OutputStream outputStream,
                                              ServiceProvider serviceProvider,
                                              Institution institution,
                                              Course course,
                                              JSONObject properties,
                                              boolean englishCertificate) throws Exception {

        String studentName = "홍길동"; // 이름
        String courseServiceTitle = "테스트 교육과정"; // 교육과정명
        Integer studyTimeInHours = 12;

        CourseEnrollment courseEnrollment = new CourseEnrollment();
        courseEnrollment.setStudentUserName(studentName);

        StudentReport studentReport = new StudentReport();
        studentReport.setCompletionDate(new Date());

        User user = new User();
        user.setName(studentName);
        user.setDateOfBirth(new Date());
        user.setCompanyName("회사명");
        user.setCompanyPosition("직위명");

        UserProperties userProperties = new UserProperties();
        userProperties.add(new NameValuePair("과정구분",
                                             "보수교육"));
        user.setProperties(userProperties);


        Calendar startDateCalendar = Calendar.getInstance();
        startDateCalendar.set(Calendar.MONTH,
                              0);
        startDateCalendar.set(Calendar.DAY_OF_MONTH,
                              1);
        startDateCalendar.set(Calendar.HOUR_OF_DAY,
                              0);
        startDateCalendar.set(Calendar.MINUTE,
                              0);
        startDateCalendar.set(Calendar.SECOND,
                              0);
        startDateCalendar.set(Calendar.MILLISECOND,
                              0);
        Date startDate = startDateCalendar.getTime();

        Calendar endDateCalendar = Calendar.getInstance();
        endDateCalendar.set(Calendar.MONTH,
                            11);
        endDateCalendar.set(Calendar.DAY_OF_MONTH,
                            31);
        endDateCalendar.set(Calendar.HOUR_OF_DAY,
                            11);
        endDateCalendar.set(Calendar.MINUTE,
                            59);
        endDateCalendar.set(Calendar.SECOND,
                            59);
        endDateCalendar.set(Calendar.MILLISECOND,
                            999);
        Date endDate = endDateCalendar.getTime();

        course = new Course();
        course.setTermType(Term.Type.REGULAR);
        course.setStartDate(startDate);
        course.setEndDate(endDate);
        course.setServiceTitle(courseServiceTitle);
        course.setStudyTimeInHours(studyTimeInHours);
        course.setTitle("테스트 교육");

        // 속성 관련하여 받기

        String pdfType = properties.get("credit")
                                   .toString();
        CourseAttribute attribute = new CourseAttribute();


        if (pdfType.equals("0")) {
            //양성
            attribute.setAttributeId(16);
        } else {
            //보수
            attribute.setAttributeId(17);
        }
        List<CourseAttribute> attributeList = new ArrayList<CourseAttribute>();
        attributeList.add(attribute);
        // TODO: 속성 처리

        course.setAttributeList(attributeList);
        course.setTermName("테스트 기수");

        Date registeredDate = new Date();

        Document document = this.doGetCourseCertificateDocument(0L,
                                                                institution,
                                                                course,
                                                                courseEnrollment,
                                                                studentReport,
                                                                user,
                                                                properties,
                                                                registeredDate);

        this.doDrawCourseCertificate(baseUrl,
                                     outputStream,
                                     document,
                                     serviceProvider,
                                     institution,
                                     course,
                                     courseEnrollment,
                                     studentReport,
                                     user,
                                     properties,
                                     englishCertificate);
    }

    @Override
    public Document doGetCourseCertificateDocument(long documentSequence,
                                                   Institution institution,
                                                   Course course,
                                                   CourseEnrollment courseEnrollment,
                                                   StudentReport studentReport,
                                                   User user,
                                                   JSONObject properties,
                                                   Date registeredDate) throws Exception {

        // 수료증번호
//        String yyyyMMdd = DateFormats.format(new Date(), "yyyyMMdd");
//        String code = "한국여성인권진흥원 제 2020 - 02 - " + yyyyMMdd + "-" + String.format("%03d", documentSequence) + "호"; // TODO : 상장번호
//        String code = "한국여성인권진흥원 제 2020 - 02 - " + String.format("%03d", documentSequence) + "호"; // TODO : 상장번호

        String yyyy = DateFormats.format(registeredDate,
                                         "yyyy");
        String mm = DateFormats.format(registeredDate,
                                       "MM");

        List<CourseAttribute> courseAttributeList = course.getAttributeList();
        String pdfType = null;
        HashSet<Long> maintenance = new HashSet<Long>();

        maintenance.add(17L);
        maintenance.add(18L);
        maintenance.add(19L);
        maintenance.add(20L);
        maintenance.add(21L);
        maintenance.add(22L);

        pdfType = "00";

        for (int i = 0; i < courseAttributeList.size(); i++) {
            long attributeId = courseAttributeList.get(i)
                                                  .getAttributeId();
            if (attributeId == 16) {
                pdfType = "01";
                break;
            } else if (maintenance.contains(new Long(attributeId))) {
                pdfType = "02";
                break;
            }
        }
//
//        //아무것도 걸리지 않을경우 (양성,  보수)
//        if(pdfType == null) {
//            pdfType = "03";
//        }


        String code = "한국여성인권진흥원 제 " + yyyy + " - " + pdfType + " - " + String.format("%03d",
                                                                                      documentSequence) + "호"; // TODO : 상장번호

        Document document = new Document();
        document.setId(documentSequence);
        document.setCode(code);

        return document;
    }

    @Override
    public void doDrawCourseCertificate(String baseUrl,
                                        OutputStream outputStream,
                                        Document document,
                                        ServiceProvider serviceProvider,
                                        Institution institution,
                                        Course course,
                                        CourseEnrollment courseEnrollment,
                                        StudentReport studentReport,
                                        User user,
                                        JSONObject properties,
                                        boolean englishCertificate) throws Exception {

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

//        String baseUrl = "http://edu.stop.or.kr";

        String html = "";

//        JSONObject jo = new JSONObject();

//        String abc = JSONUtils.getChildString(jo, "abcde", "Acdsafdsa");
//        String abc = JSONUtils.getChildString(jo, "abcde", "0", "Acdsafdsa");


//        String pdfType = properties.get("pdf_type").toString();
//        String name = JSONUtils.getChildString(properties, "name"); // 성명
//        String dateOfBirth = JSONUtils.getChildString(properties, "date_of_birth"); // 생년월일
//        String companyName = JSONUtils.getChildString(properties, "company_name"); // 소속 - 기관
//        String companyPosition = JSONUtils.getChildString(properties, "company_position"); // 소속 - 직책
//        String termName = JSONUtils.getChildString(properties, "term_name"); // 기수
//        String courseTitle = JSONUtils.getChildString(properties, "course_title"); // 과정명
//        String startDate = JSONUtils.getChildString(properties, "start_date"); // 시작일자
//        String endDate = JSONUtils.getChildString(properties, "end_date"); // 끝 일자
//        String studyTimeInHours = JSONUtils.getChildString(properties, "study_time_in_hours"); // 학습시간(단위: 시간)
//        String profileImageUrl = JSONUtils.getChildString(properties, "profile_image_url"); // 학습시간(단위: 시간)
//        String printDate = JSONUtils.getChildString(properties, "print_date"); // 현재 날짜

        String name = user.getName();
        String dateOfBirth = DateFormats.format(user.getDateOfBirth(),
                                                false);
        String companyName = user.getCompanyName();
        String companyPosition = user.getCompanyPosition();
        String termName = course.getTermName();
        String courseTitle = course.getTitle();


        String startDate = null;
        String endDate = null;

        if (course.getTermType()
                  .getCode() == Term.Type.DEFAULT.getCode()) {

            startDate = DateFormats.format(course.getCourseEnrollmentLastModifiedDate(),
                                           false);
            endDate = DateFormats.format(DateUtils.addTimeMillis(course.getCourseEnrollmentLastModifiedDate(),
                                                                 (long) course.getStudyDays() * 24 * 60 * 60 * 1000),
                                         false);

        } else {

            startDate = DateFormats.format(course.getStartDate(),
                                           false);
            endDate = DateFormats.format(course.getEndDate(),
                                         false);
        }

        String studyTimeInHours = "-";
        if (course.getStudyTimeInHours() != null) {
            studyTimeInHours = course.getStudyTimeInHours()
                                     .toString();
        }


        String profileImageUrl = JSONUtils.getChildString(properties,
                                                          "profile_image_url");

        List<CourseAttribute> courseAttributeList = course.getAttributeList();
        HashSet<Long> maintenance = new HashSet<Long>();

        maintenance.add(17L);
        maintenance.add(18L);
        maintenance.add(19L);
        maintenance.add(20L);
        maintenance.add(21L);
        maintenance.add(22L);

        String pdfType = null;
        for (int i = 0; i < courseAttributeList.size(); i++) {
            long attributeId = courseAttributeList.get(i)
                                                  .getAttributeId();
            if (attributeId == 16) {
                pdfType = "1";
                break;
            } else if (maintenance.contains(new Long(attributeId))) {
                pdfType = "2";
                break;
            }
        }
//
//        //아무것도 걸리지 않을경우 (양성,  보수)sse
//        if(pdfType == null) {
//            pdfType = "2";
//        }


        Date completionDate = null;
        if (course.getTermType()
                  .getCode() == Term.Type.DEFAULT.getCode()) {
            completionDate = studentReport.getCompletionDate();
        } else {
            completionDate = course.getEndDate();
        }

        if (pdfType.equals("1")) { // 양성교육
            html = " <img src=\"#{base_url}/res/home/img/stop/pdf/bg_frame.png\" style=\"position:absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; z-index: -100;\" />\n" +
                    "<div style=\"box-sizing: border-box; width:90%;margin:0 auto; position: relative; padding: 20px 5px; padding-left: 10px; \"> " +
                    "    <img src=\"#{base_url}/res/home/img/stop/pdf/logo.png\" style=\"width: 300px; height: 300px; position: absolute; z-index: -99; top: 50%; left: 50%; transform: translate(-50%, -50%);\"/> " +
                    "    <p style=\"font-family:KoPubBatangLight;font-size: 14px; position: absolute; top: 50px; left: 5%; \">#{document_code}</p> " +
                    "    <h1 style=\"font-family:KoPubBatangBold; font-weight: normal; font-size: 60px; text-align: center; margin-left : 50px; letter-spacing: 30px; padding-top: 50px;\">수료증</h1> " +
                    "    <div style=\"font-family:KoPubBatangBold; width: 100%; margin-top: 80px; position: relative;\" > " +
                    "        <p style=\"font-size: 26px; line-height: 26px; margin-bottom: 15px;\">성 명 : <span>#{name}</span></p> " +
                    "        <p style=\"font-size: 26px; line-height: 26px;\">생년월일 : <span>#{date_of_birth}</span></p> " +
//                    "        <div style=\"width: 3cm; height: 4cm; border: 1px solid #333333; position: absolute; right: 0; top: -40px;\"> " +
//                    "            <img src=\"#{profile_image_url}\" style=\"width: 100%; height: 100%;\"/> " +
//                    "        </div> " +
                    "    </div> " +
                    "    <p style=\"font-family:KoPubBatangMedium;font-size: 28px; line-height:38px;  margin-top: 60px;\">   「성매매방지 및 피해자보호 등에 관한 법률 시행규칙」제7조에 따른 성매매방지 상담원 양성교육 과정을 이수하였음을 증명합니다.</p> " +
                    "    <div style=\"font-family:KoPubBatangLight; font-size: 20px; line-height: 20px; margin-top: 40px;\"> " +
                    "        <p>· <span style=\"letter-spacing: 3.2px;\" >교육과정명</span> : #{course_title}</p> " +
                    "        <p>· <span style=\"letter-spacing: 9.1px;\" >교육기간</span> : #{start_date}. ~ #{end_date}. (#{study_time_in_hours}시간)</p> " +
                    "        <p>· <span style=\"\" >교육위탁기관</span> : 여성가족부</p> " +
                    "        <p>· <span style=\"\" >교육실시기관</span> : 한국여성인권진흥원</p> " +
                    "        <p>· <span style=\"\" >수료일</span> : #{completion_date}</p> " +
                    "    </div> " +
                    "    <div style=\" position: relative; margin-top: 50px; text-align: center;\"> " +
                    "        <p style=\"font-family:KoPubBatangLight;font-size: 20px;\">#{print_date}</p> " +
                    "        <p style=\"font-family:KoPubBatangBold;font-size: 40px; margin-top: 30px;\">한국여성인권진흥원장</p> " +
                    "        <img src=\"#{base_url}/res/home/img/stop/pdf/sign.png\" style=\"width: 80px; height: 80px; position: absolute; z-index: -98; bottom: -20px; right: 50px;\"/> " +
                    "    </div> " +
                    "</div>";
        } else if (pdfType.equals("2")) { // 보수교육

            html = " <img src=\"#{base_url}/res/home/img/stop/pdf/bg_frame.png\" style=\"position:absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; z-index: -100;\" />\n" +
                    "<div style=\"box-sizing: border-box; width:90%; margin:0 auto; padding: 20px 5px; position: relative; padding-left: 10px;\">\n" +
                    "                <img src=\"#{base_url}/res/home/img/stop/pdf/logo.png\" style=\"width: 300px; height: 300px; position: absolute;z-index:-99; top: 50%; left: 50%; transform: translate(-50%, -50%);\"/>\n" +
                    "                <p style=\"font-family:KoPubBatangLight;font-size: 14px; position: absolute; top: 50px; left: 5%; \">#{document_code}</p>\n" +
                    "                <h1 style=\"font-family:KoPubBatangBold; font-weight: normal; font-size: 60px; text-align: center; margin-left : 50px; letter-spacing: 30px; padding-top: 50px;\">수료증</h1>\n" +
                    "                <div style=\"font-family:KoPubBatangMedium;width: 100%; margin-top: 50px; position: relative;\" >\n" +
                    "                    <p style=\"font-size: 22px;\"><span style=\"\">교육과정</span> : <span>#{course_title}</span></p>\n" +
                    "                    <p style=\"font-size: 22px;\"><span style=\"\">교육기간</span> : <span>#{start_date}. ~ #{end_date}.</span><span>(#{study_time_in_hours}시간)</span></p>\n" +
                    "                    <p style=\"font-size: 22px;\"><span style=\"letter-spacing:42px;\">성</span>명 : <span>#{name}</span></p>\n" +
                    "                    <p style=\"font-size: 22px;\"><span style=\"\">생년월일</span> : <span>#{date_of_birth}</span></p>\n" +
                    "                    <p style=\"font-size: 22px;\"><span style=\"letter-spacing:42px;\">소</span>속 : <span>#{company_name} #{company_position}</span></p>\n" +
                    "                    <p style=\"font-size: 22px;\"><span style=\"letter-spacing:12px;\">수료</span>일 : <span>#{completion_date}</span></p>\n" +
                    "                </div>\n" +
                    "                <p style=\"font-family:KoPubBatangBold;font-size: 23px; line-height: 40px;letter-spacing:-0.5px; margin-top: 40px;text-align:center;\">\n" +
                    "                    위 사람은 <br/>「성폭력 방지 및 피해자 보호 등에 관한 법률」제20조, <br/>「가정폭력방지 및 피해자 보호 등에 관한 법률」제8조의 4, <br/>「성매매방지 및 피해자 보호 등에 관한 법률」제20조에 의한<br/> \n" +
                    "                    상기 교육과정을 이수하였기에 이 수료증을 수여합니다.\n" +
                    "                </p>\n" +
                    "                <div style=\"position: relative; margin-top: 40px; text-align: center;\">\n" +
                    "                    <p style=\"font-family:KoPubBatangLight;font-size: 20px;\">#{print_date}</p>\n" +
                    "                    <p style=\"font-family:KoPubBatangBold;font-size: 40px; margin-top: 30px;\">한국여성인권진흥원장</p>\n" +
                    "                    <img src=\"#{base_url}/res/home/img/stop/pdf/sign.png\" style=\"width: 80px; height: 80px; position: absolute; z-index:-98; bottom: -20px; right: 50px;\"/>\n" +
                    "                </div>\n" +
                    "            </div>";
        }

        HashMap<String, String> map = new HashMap<>();
        map.put("base_url",
                baseUrl);
        map.put("name",
                name);
        map.put("date_of_birth",
                dateOfBirth);

        companyName = PDFUtils.stripHtml(companyName);
        courseTitle = PDFUtils.stripHtml(courseTitle);
        termName = PDFUtils.stripHtml(termName);

        map.put("company_name",
                companyName);
        map.put("company_position",
                "");
        map.put("term_name",
                termName);
        map.put("course_title",
                courseTitle);
        map.put("start_date",
                startDate);
        map.put("end_date",
                endDate);
        map.put("study_time_in_hours",
                studyTimeInHours);
        map.put("document_code",
                document.getCode());
//        map.put("document_code", "###");
        map.put("profile_image_url",
                profileImageUrl);

        if (completionDate != null) {
            map.put("completion_date",
                    DateFormats.format(completionDate,
                                       false));
            map.put("print_date",
                    DateFormats.format(completionDate,
                                       "yyyy년 MM월 dd일"));
        }


        for (String key : map.keySet()) {
            String value = map.get(key);

            if (StringUtils.isBlank(value)) {
                value = "";
            }

            html = html.replaceAll("#\\{" + key + "\\}",
                                   value);
        }

        PDFUtils.drawHtml(baseUrl,
                          outputStream,
                          header + html + footer,
                          false);
    }

    @Override
    public long doGetCourseCertificateDocumentSequence(long documentId,
                                                       Institution institution,
                                                       Course course,
                                                       CourseEnrollment courseEnrollment,
                                                       StudentReport studentReport,
                                                       User user,
                                                       JSONObject properties,
                                                       Date registeredDate) throws Exception {


        List<CourseAttribute> courseAttributeList = course.getAttributeList();
        String pdfType = null;
        HashSet<Long> maintenance = new HashSet<Long>();

        maintenance.add(17L);
        maintenance.add(18L);
        maintenance.add(19L);
        maintenance.add(20L);
        maintenance.add(21L);
        maintenance.add(22L);

        for (int i = 0; i < courseAttributeList.size(); i++) {
            long attributeId = courseAttributeList.get(i)
                                                  .getAttributeId();
            if (attributeId == 16) {
                pdfType = "1";
                break;
            } else if (maintenance.contains(new Long(attributeId))) {
                pdfType = "2";
                break;
            }
        }

        String yyyy = DateFormats.format(registeredDate,
                                         "yyyy");

        this.documentMapper.insertDocumentSequence(Document.Type.CURRICULUM_CERTIFICATE,
                                                   yyyy + "_" + pdfType);

        long documentSequenceId = super.commonMapper.selectLastInsertId(Sequence.DOCUMENT_SEQUENCE.getName());

        long sequence = this.documentMapper.selectDocumentSequenceValueById(documentSequenceId);

        return sequence;
    }
}
