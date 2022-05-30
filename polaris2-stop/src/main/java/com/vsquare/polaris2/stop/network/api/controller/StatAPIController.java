package com.vsquare.polaris2.stop.network.api.controller;

import com.vsquare.commons.tool.Booleans;
import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.Code;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.MapModel;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.SearchOption;
import com.vsquare.polaris2.core.model.learning.*;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.task.AsyncTask;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.network.api.controller.BaseAPIController;
import com.vsquare.polaris2.core.network.api.response.Response;
import com.vsquare.polaris2.core.tool.CommaSeparatedListParser;
import com.vsquare.polaris2.core.tool.ParameterUtils;
import com.vsquare.polaris2.core.tool.ParseUtils;
import com.vsquare.polaris2.core.tool.SearchOptionUtils;
import com.vsquare.polaris2.stop.service.stat.StatService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sun.net.www.ParseUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Api(value = "/api/stat", description = "통계 관련 API", tags = "Stat API")
@RestController
@RequestMapping(value = "/api/stat", produces = "text/plain;charset=UTF-8")
public class StatAPIController extends BaseAPIController {

    @Autowired
    StatService statService;


    @ApiOperation(value = "과목 목록 내보내기", tags = {"Learning API", "Export Excel"})
    @RequestMapping(value = "/exportCourseSummaryList", method = RequestMethod.POST)
    public String exportCourseSummaryList(HttpServletRequest httpServletRequest,
                                          @RequestParam(value = "courseCodeId", required = false) Long courseCodeId,
                                          @RequestParam(value = "courseCodeInstitutionId", required = false) Long courseCodeInstitutionId,
                                          @RequestParam(value = "courseCodeInstitutionIdList", required = false) String courseCodeInstitutionIdListString,
                                          @RequestParam(value = "categoryId", required = false) Long categoryId,
                                          @RequestParam(value = "categoryIdList", required = false) String categoryIdListString,
                                          @RequestParam(value = "courseContentId", required = false) Long courseContentId,
                                          @RequestParam(value = "curriculumId", required = false) Long curriculumId,
                                          @RequestParam(value = "departmentId", required = false) Long departmentId,
                                          @RequestParam(value = "departmentIdList", required = false) String departmentIdListString,
                                          @RequestParam(value = "year", required = false) Integer year,
                                          @RequestParam(value = "termId", required = false) Long termId,
                                          @RequestParam(value = "institutionId", required = false) Long institutionId,
                                          @RequestParam(value = "institutionIdList", required = false) String institutionIdListString,
                                          @RequestParam(value = "organizationId", required = false) Long organizationId,
                                          @RequestParam(value = "termTypeCode", required = false) Integer termTypeCode,
                                          @RequestParam(value = "termTypeCodeList", required = false) String termTypeCodeListString,
                                          @RequestParam(value = "termCurriculumId", required = false) Long termCurriculumId,
                                          @RequestParam(value = "termYear", required = false) Integer termYear,
                                          @RequestParam(value = "termIsAvailable", required = false) Integer termIsAvailable,
                                          @RequestParam(value = "learningMethodCodeList", required = false) String learningMethodCodeListString,
                                          @RequestParam(value = "offerCertificate", required = false) Integer offerCertificateInteger,
                                          @RequestParam(value = "isAvailable", required = false) Integer isAvailable,
                                          @RequestParam(value = "statusCodeList", required = false) String statusCodeListString,
                                          @RequestParam(value = "isFavoriteCourse", required = false) Integer isFavoriteCourse,
                                          @RequestParam(value = "studentPage") int studentPageInteger,
                                          @RequestParam(value = "adminPage") int adminPageInteger,
                                          @RequestParam(value = "courseEnrollmentStatusCodeList", required = false) String courseEnrollmentStatusCodeListString,
                                          @RequestParam(value = "isCompleted", required = false) Integer isCompleted,
                                          @RequestParam(value = "targetUserIdx", required = false) Long targetUserIdx,
                                          @RequestParam(value = "studentEnrollmentFromDate", required = false) String studentEnrollmentFromDateString,
                                          @RequestParam(value = "studentEnrollmentToDate", required = false) String studentEnrollmentToDateString,
                                          @RequestParam(value = "groupByCode", required = false) Integer groupByCode,
                                          @RequestParam(value = "searchOptionList", required = false) String searchOptionListString,
                                          @RequestParam(value = "orderByCode", required = false) Integer orderByCode,
                                          @RequestParam(value = "page", required = false) Integer page,
                                          @RequestParam(value = "count", required = false) Integer count,
                                          HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = super.userService.updateAndGetSession(httpServletRequest,
                                                                    httpServletResponse);

            ServiceProvider serviceProvider = super.checkAndGetServiceProvider(session,
                                                                               httpServletRequest);

            List<Long> courseCodeInstitutionIdList = null;

            if (courseCodeInstitutionId != null) {

                if (courseCodeInstitutionIdList == null)
                    courseCodeInstitutionIdList = new ArrayList<Long>();

                courseCodeInstitutionIdList.add(courseCodeInstitutionId);
            }

            if (StringUtils.isNotBlank(courseCodeInstitutionIdListString)) {

                if (courseCodeInstitutionIdList == null)
                    courseCodeInstitutionIdList = new ArrayList<Long>();

                String[] courseCodeInstitutionIdStrings = courseCodeInstitutionIdListString.split(",");

                for (String courseCodeInstitutionIdStringInArray : courseCodeInstitutionIdStrings) {

                    long courseCodeInstitutionIdInArray = Long.parseLong(courseCodeInstitutionIdListString);

                    if (courseCodeInstitutionId != null && courseCodeInstitutionId.equals(courseCodeInstitutionIdInArray))
                        continue;

                    courseCodeInstitutionIdList.add(courseCodeInstitutionIdInArray);
                }
            }

            List<Long> institutionIdList = null;

            if (institutionId != null) {

                if (institutionIdList == null)
                    institutionIdList = new ArrayList<Long>();

                institutionIdList.add(institutionId);
            }

            if (StringUtils.isNotBlank(institutionIdListString)) {

                if (institutionIdList == null)
                    institutionIdList = new ArrayList<Long>();

                String[] institutionIdStrings = institutionIdListString.split(",");

                for (String institutionIdStringInArray : institutionIdStrings) {

                    long institutionIdInArray = Long.parseLong(institutionIdListString);
                    if (institutionId != null && institutionId.equals(institutionIdInArray))
                        continue;

                    institutionIdList.add(institutionIdInArray);
                }
            }

            List<Long> categoryIdList = CommaSeparatedListParser.parseLongList(categoryIdListString,
                                                                               categoryId);

            List<Long> departmentIdList = null;

            if (departmentId != null) {

                if (departmentIdList == null)
                    departmentIdList = new ArrayList<Long>();

                departmentIdList.add(departmentId);
            }

            if (StringUtils.isNotBlank(departmentIdListString)) {

                if (departmentIdList == null)
                    departmentIdList = new ArrayList<Long>();

                String[] departmentIdStrings = departmentIdListString.split(",");

                for (String departmentIdString : departmentIdStrings) {

                    long parsedDepartmentId = Long.parseLong(departmentIdString);
                    departmentIdList.add(parsedDepartmentId);
                }
            }

            List<Term.Type> termTypeList = null;

            if (StringUtils.isNotBlank(termTypeCodeListString))
                termTypeList = CommaSeparatedListParser.parseIntegerList(termTypeCodeListString,
                                                                         Term.Type::parseType);

            if (termTypeCode != null) {

                Term.Type termType = Term.Type.parseType(termTypeCode);

                if (termTypeList == null)
                    termTypeList = new ArrayList<Term.Type>();

                termTypeList.add(termType);
            }

            Boolean termAvailable = null;

            if (termIsAvailable != null)
                termAvailable = Booleans.integerToBoolean(termIsAvailable);

            List<Course.LearningMethod> learningMethodList = null;

            if (StringUtils.isNotBlank(learningMethodCodeListString))
                learningMethodList = CommaSeparatedListParser.parseIntegerList(learningMethodCodeListString,
                                                                               Course.LearningMethod::parseLearningMethod);

            Boolean offerCertificate = null;

            if (offerCertificateInteger != null)
                offerCertificate = Booleans.integerToBoolean(offerCertificateInteger);

            Boolean available = null;

            if (isAvailable != null)
                available = Booleans.integerToBoolean(isAvailable);

            List<Course.Status> statusList = null;

            if (StringUtils.isNotBlank(statusCodeListString)) {

                statusList = new ArrayList<Course.Status>();

                String[] statusCodeStrings = statusCodeListString.split(",");

                for (String statusCodeString : statusCodeStrings) {

                    int statusCode = Integer.parseInt(statusCodeString);
                    Course.Status status = Course.Status.parseStatus(statusCode);
                    statusList.add(status);
                }
            }

            Boolean favoriteCourse = null;

            if (isFavoriteCourse != null)
                favoriteCourse = Booleans.integerToBoolean(isFavoriteCourse);

            boolean studentPage = Booleans.integerToBoolean(studentPageInteger);
            boolean adminPage = Booleans.integerToBoolean(adminPageInteger);

            List<CourseEnrollment.Status> courseEnrollmentStatusList = null;

            if (StringUtils.isNotBlank(courseEnrollmentStatusCodeListString)) {

                courseEnrollmentStatusList = new ArrayList<CourseEnrollment.Status>();

                String[] courseEnrollmentStatusCodeStrings = courseEnrollmentStatusCodeListString.split(",");

                for (String courseEnrollmentStatusCodeString : courseEnrollmentStatusCodeStrings) {

                    int courseEnrollmentStatusCode = Integer.parseInt(courseEnrollmentStatusCodeString);
                    CourseEnrollment.Status courseEnrollmentStatus = CourseEnrollment.Status
                            .parseStatus(courseEnrollmentStatusCode);
                    courseEnrollmentStatusList.add(courseEnrollmentStatus);
                }
            }

            Boolean completed = null;

            if (isCompleted != null)
                completed = Booleans.integerToBoolean(isCompleted);

            Date studentEnrollmentFromDate = null;

            if (StringUtils.isNotBlank(studentEnrollmentFromDateString))
                studentEnrollmentFromDate = DateFormats.parse(studentEnrollmentFromDateString);

            Date studentEnrollmentToDate = null;

            if (StringUtils.isNotBlank(studentEnrollmentToDateString))
                studentEnrollmentToDate = DateFormats.parse(studentEnrollmentToDateString);

            Course.GroupBy groupBy = null;

            if (groupByCode != null)
                groupBy = Course.GroupBy.parseGroupBy(groupByCode);

            List<SearchOption> searchOptionList = SearchOptionUtils.parse(searchOptionListString,
                                                                          super.getDatabaseType());

            Course.OrderBy orderBy = null;

            if (orderByCode != null)
                orderBy = Course.OrderBy.parseOrderBy(orderByCode);

            Map<String, String[]> parameterMap = ParameterUtils.extractParameterMap(httpServletRequest);

            AsyncTask asyncTask = this.statService.exportCourseSummaryList(session,
                                                                           parameterMap,
                                                                           serviceProvider,
                                                                           courseCodeId,
                                                                           courseCodeInstitutionIdList,
                                                                           categoryIdList,
                                                                           courseContentId,
                                                                           curriculumId,
                                                                           departmentIdList,
                                                                           year,
                                                                           termId,
                                                                           institutionIdList,
                                                                           organizationId,
                                                                           termTypeList,
                                                                           termCurriculumId,
                                                                           termYear,
                                                                           termAvailable,
                                                                           learningMethodList,
                                                                           offerCertificate,
                                                                           available,
                                                                           statusList,
                                                                           favoriteCourse,
                                                                           studentPage,
                                                                           adminPage,
                                                                           courseEnrollmentStatusList,
                                                                           completed,
                                                                           targetUserIdx,
                                                                           studentEnrollmentFromDate,
                                                                           studentEnrollmentToDate,
                                                                           groupBy,
                                                                           searchOptionList,
                                                                           orderBy,
                                                                           page,
                                                                           count);


            response = super.responseFactory.createResponse(Code.SUCCESS,
                                                            asyncTask.toJsonAware(),
                                                            httpServletRequest);

        } catch (CodedException e) {

            response = super.responseFactory.createResponse(e,
                                                            httpServletRequest);
        }

        return response.toJSONString();
    }


    @ApiOperation(value = "과목 수강생/청강생 목록 내보내기", tags = {"Learning API", "Export Excel"})
    @RequestMapping(value = "/exportCourseEnrollmentSummaryListForHistory", method = RequestMethod.POST)
    public String exportCourseEnrollmentSummaryListForHistory(HttpServletRequest httpServletRequest,

                                                    @RequestParam(value = "historyYear", required = false) Integer historyYear,

                                                    @RequestParam(value = "curriculumInstitutionId", required = false) String curriculumInstitutionId,
                                                    @RequestParam(value = "curriculumId", required = false) Long curriculumId,
                                                    @RequestParam(value = "institutionId", required = false) Long institutionId,
                                                    @RequestParam(value = "organizationId", required = false) Long organizationId,
                                                    @RequestParam(value = "termTypeCode", required = false) Integer termTypeCode,
                                                    @RequestParam(value = "termYear", required = false) Integer termYear,
                                                    @RequestParam(value = "termId", required = false) Long termId,
                                                    @RequestParam(value = "courseId", required = false) Long courseId,
                                                    @RequestParam(value = "courseYear", required = false) Integer courseYear,
                                                    @RequestParam(value = "studentUserIdx", required = false) Long studentUserIdx,
                                                    @RequestParam(value = "studentTypeCode", required = false) Integer studentTypeCode,
                                                    @RequestParam(value = "departmentId", required = false) Long departmentId,
                                                    @RequestParam(value = "statusCode", required = false) Integer statusCode,
                                                    @RequestParam(value = "isCompleted", required = false) Integer isCompleted,
                                                    @RequestParam(value = "studyMaterialDeliveryStatusCodeList", required = false) String studyMaterialDeliveryStatusCodeListString,
                                                    @RequestParam(value = "academicAdvisorAssigned", required = false) Integer academicAdvisorAssignedInteger,
                                                    @RequestParam(value = "academicAdvisorUserIdx", required = false) Long academicAdvisorUserIdx,
                                                    @RequestParam(value = "searchOptionList", required = false) String searchOptionListString,
                                                    @RequestParam(value = "orderByCode", required = false) Integer orderByCode,
                                                    @RequestParam(value = "page", required = false) Integer page,
                                                    @RequestParam(value = "count", required = false) Integer count,
                                                    HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = super.userService.updateAndGetSession(httpServletRequest,
                                                                    httpServletResponse);

            ServiceProvider serviceProvider = super.checkAndGetServiceProvider(session,
                                                                               httpServletRequest);

            Term.Type termType = null;

            if (termTypeCode != null)
                termType = Term.Type.parseType(termTypeCode);

            User.StudentType studentType = null;

            if (studentTypeCode != null)
                studentType = User.StudentType.parseStudentType(studentTypeCode);

            CourseEnrollment.Status status = null;

            if (statusCode != null)
                status = CourseEnrollment.Status.parseStatus(statusCode);

            Boolean completed = null;

            if (isCompleted != null)
                completed = Booleans.integerToBoolean(isCompleted);

            List<CourseEnrollment.StudyMaterialDeliveryStatus> studyMaterialDeliveryStatusList = null;

            if (StringUtils.isNotBlank(studyMaterialDeliveryStatusCodeListString)) {

                studyMaterialDeliveryStatusList = new ArrayList<CourseEnrollment.StudyMaterialDeliveryStatus>();

                String[] studyMaterialDeliveryStatusCodeStrings = studyMaterialDeliveryStatusCodeListString.split(",");

                for (String studyMaterialDeliveryStatusCodeString : studyMaterialDeliveryStatusCodeStrings) {

                    int studyMaterialDeliveryStatusCode = Integer.parseInt(studyMaterialDeliveryStatusCodeString);
                    CourseEnrollment.StudyMaterialDeliveryStatus studyMaterialDeliveryStatus = CourseEnrollment.StudyMaterialDeliveryStatus.parseStudyMaterialDeliveryStatus(studyMaterialDeliveryStatusCode);
                    studyMaterialDeliveryStatusList.add(studyMaterialDeliveryStatus);
                }
            }

            Boolean academicAdvisorAssigned = null;

            if (academicAdvisorAssignedInteger != null)
                academicAdvisorAssigned = Booleans.integerToBoolean(academicAdvisorAssignedInteger);

            List<SearchOption> searchOptionList = SearchOptionUtils.parse(searchOptionListString,
                                                                          super.getDatabaseType());

            CourseEnrollment.OrderBy orderBy = null;

            if (orderByCode != null)
                orderBy = CourseEnrollment.OrderBy.parseOrderBy(orderByCode);

            AsyncTask asyncTask = this.statService.exportCourseEnrollmentSummaryListForHistory(session,
                                                                                               httpServletRequest,
                                                                                               serviceProvider,
                                                                                               historyYear,
                                                                                               curriculumInstitutionId,
                                                                                               curriculumId,
                                                                                               institutionId,
                                                                                               organizationId,
                                                                                               termType,
                                                                                               termYear,
                                                                                               termId,
                                                                                               courseId,
                                                                                               courseYear,
                                                                                               studentUserIdx,
                                                                                               studentType,
                                                                                               departmentId,
                                                                                               status,
                                                                                               completed,
                                                                                               studyMaterialDeliveryStatusList,
                                                                                               academicAdvisorAssigned,
                                                                                               academicAdvisorUserIdx,
                                                                                               searchOptionList,
                                                                                               orderBy,
                                                                                               page,
                                                                                               count);

            response = super.responseFactory.createResponse(Code.SUCCESS,
                                                            asyncTask.toJsonAware(),
                                                            httpServletRequest);

        } catch (CodedException e) {

            response = super.responseFactory.createResponse(e,
                                                            httpServletRequest);
        }

        return response.toJSONString();
    }


    @ApiOperation(value = "과목 수강생/청강생 목록 내보내기", tags = {"Learning API", "Export Excel"})
    @RequestMapping(value = "/getStatistics", method = RequestMethod.POST)
    public String getStatistics(HttpServletRequest httpServletRequest,

                                @RequestParam(value = "courseYear", required = false) Integer courseYear,
                                @RequestParam(value = "historyYear", required = false) Integer historyYear,

                                @RequestParam(value = "termTypeCode", required = false) Integer termTypeCode,
                                @RequestParam(value = "isCompleted", required = false) Integer isCompleted,
                                @RequestParam(value = "startDate", required = false) String startDateString,
                                @RequestParam(value = "endDate", required = false) String endDateString,
                                HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = super.userService.updateAndGetSession(httpServletRequest,
                                                                    httpServletResponse);

            ServiceProvider serviceProvider = super.checkAndGetServiceProvider(session,
                                                                               httpServletRequest);

            Date startDate = ParseUtils.parseDate(startDateString);
            Date endDate = ParseUtils.parseDate(endDateString);


            MapModel mapModel = this.statService.getStatistics(session,
                                                               courseYear,
                                                               historyYear,
                                                               termTypeCode,
                                                               isCompleted,
                                                               startDate,
                                                               endDate);

            response = super.responseFactory.createResponse(Code.SUCCESS,
                                                            mapModel.toJsonAware(),
                                                            httpServletRequest);

        } catch (CodedException e) {

            response = super.responseFactory.createResponse(e,
                                                            httpServletRequest);
        }

        return response.toJSONString();
    }


    @ApiOperation(value = "과목 수강생/청강생 목록 내보내기 엑셀", tags = {"Learning API", "Export Excel"})
    @RequestMapping(value = "/exportStatistics", method = RequestMethod.POST)
    public String exportStatistics(HttpServletRequest httpServletRequest,

                                   @RequestParam(value = "courseYear", required = false) Integer courseYear,
                                   @RequestParam(value = "historyYear", required = false) Integer historyYear,

                                   @RequestParam(value = "termTypeCode", required = false) Integer termTypeCode,
                                   @RequestParam(value = "isCompleted", required = false) Integer isCompleted,
                                   @RequestParam(value = "startDate") String startDateString,
                                   @RequestParam(value = "endDate") String endDateString,
                                   HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = super.userService.updateAndGetSession(httpServletRequest,
                                                                    httpServletResponse);

            ServiceProvider serviceProvider = super.checkAndGetServiceProvider(session,
                                                                               httpServletRequest);

            Date startDate = ParseUtils.parseDate(startDateString);
            Date endDate = ParseUtils.parseDate(endDateString);

            AsyncTask asyncTask = this.statService.exportStatistics(session,
                                                                    serviceProvider,

                                                                    courseYear,
                                                                    historyYear,

                                                                    termTypeCode,
                                                                    isCompleted,
                                                                    startDate,
                                                                    endDate);

            response = super.responseFactory.createResponse(Code.SUCCESS,
                                                            asyncTask.toJsonAware(),
                                                            httpServletRequest);

        } catch (CodedException e) {

            response = super.responseFactory.createResponse(e,
                                                            httpServletRequest);
        }

        return response.toJSONString();
    }







    @ApiOperation(value = "과목 수강생 목록 조회", tags = "Learning API")
    @RequestMapping(value = "/getCourseEnrollmentSummaryListForHistory", method = RequestMethod.POST)
    public String getCourseEnrollmentSummaryListForHistory(HttpServletRequest httpServletRequest,

                                                           @RequestParam(value = "historyYear", required = false) Integer historyYear,

                                                           @RequestParam(value = "courseCategoryId", required = false) Long courseCategoryId,
                                                           @RequestParam(value = "courseCategoryIdList", required = false) String courseCategoryIdListString,
                                                           @RequestParam(value = "curriculumInstitutionId", required = false) String curriculumInstitutionId,
                                                           @RequestParam(value = "curriculumId", required = false) Long curriculumId,
                                                           @RequestParam(value = "institutionId", required = false) Long institutionId,
                                                           @RequestParam(value = "organizationId", required = false) Long organizationId,
                                                           @RequestParam(value = "termTypeCode", required = false) Integer termTypeCode,
                                                           @RequestParam(value = "termYear", required = false) Integer termYear,
                                                           @RequestParam(value = "termId", required = false) Long termId,
                                                           @RequestParam(value = "courseId", required = false) Long courseId,
                                                           @RequestParam(value = "courseYear", required = false) Integer courseYear,
                                                           @RequestParam(value = "courseExcludeFromStatistics", required = false) Integer courseExcludeFromStatisticsInteger,
                                                           @RequestParam(value = "includeCourseProperties", required = false) Integer includeCoursePropertiesInteger,
                                                           @RequestParam(value = "studentUserIdx", required = false) Long studentUserIdx,
                                                           @RequestParam(value = "includeStudentProperties", required = false) Integer includeStudentPropertiesInteger,
                                                           @RequestParam(value = "studentTypeCode", required = false) Integer studentTypeCode,
                                                           @RequestParam(value = "departmentId", required = false) Long departmentId,
                                                           @RequestParam(value = "statusCode", required = false) Integer statusCode,
                                                           @RequestParam(value = "isCourseStudentGroupMember", required = false) Integer isCourseStudentGroupMember,
                                                           @RequestParam(value = "isCompleted", required = false) Integer isCompleted,
                                                           @RequestParam(value = "unenrollRequestStatusCode", required = false) Integer unenrollRequestStatusCode,
                                                           @RequestParam(value = "studyMaterialDeliveryStatusCodeList", required = false) String studyMaterialDeliveryStatusCodeListString,
                                                           @RequestParam(value = "academicAdvisorAssigned", required = false) Integer academicAdvisorAssignedInteger,
                                                           @RequestParam(value = "academicAdvisorUserIdx", required = false) Long academicAdvisorUserIdx,
                                                           @RequestParam(value = "courseTaskId", required = false) Long courseTaskId,
                                                           @RequestParam(value = "searchOptionList", required = false) String searchOptionListString,
                                                           @RequestParam(value = "orderByCode", required = false) Integer orderByCode,
                                                           @RequestParam(value = "page", required = false) Integer page,
                                                           @RequestParam(value = "count", required = false) Integer count,
                                                           HttpServletResponse httpServletResponse) throws Exception {

        Response response = null;

        try {

            Session session = super.userService.updateAndGetSession(httpServletRequest,
                                                                    httpServletResponse);

            List<Long> courseCategoryIdList = CommaSeparatedListParser.parseLongList(courseCategoryIdListString,
                                                                                     courseCategoryId);

            Term.Type termType = ParseUtils.parseEnum(termTypeCode, Term.Type::parseType);

            Boolean courseExcludeFromStatistics =  Booleans.integerToBoolean(courseExcludeFromStatisticsInteger);

            boolean includeCourseProperties = Booleans.integerToBooleanDefaultIfNull(includeCoursePropertiesInteger, false);

            User.StudentType studentType = ParseUtils.parseEnum(studentTypeCode, User.StudentType::parseStudentType);

            CourseEnrollment.Status status =  ParseUtils.parseEnum(statusCode, CourseEnrollment.Status::parseStatus);

            Boolean courseStudentGroupMember = Booleans.integerToBoolean(isCourseStudentGroupMember);

            Boolean completed = Booleans.integerToBoolean(isCompleted);

            List<CourseEnrollment.StudyMaterialDeliveryStatus> studyMaterialDeliveryStatusList = CommaSeparatedListParser.parseIntegerList(studyMaterialDeliveryStatusCodeListString, CourseEnrollment.StudyMaterialDeliveryStatus::parseStudyMaterialDeliveryStatus);

            Boolean academicAdvisorAssigned = Booleans.integerToBoolean(academicAdvisorAssignedInteger);

            List<SearchOption> searchOptionList = SearchOptionUtils.parse(searchOptionListString, super.getDatabaseType());

            CourseEnrollment.OrderBy orderBy = ParseUtils.parseEnum(orderByCode, CourseEnrollment.OrderBy::parseOrderBy);

            CourseEnrollment.UnenrollRequestStatus unenrollRequestStatus =  ParseUtils.parseEnum(unenrollRequestStatusCode, CourseEnrollment.UnenrollRequestStatus::parseStatus);

            boolean includeStudentProperties = Booleans.integerToBooleanDefaultIfNull(includeStudentPropertiesInteger, false);

            ModelList<CourseEnrollmentSummary> courseEnrollmentSummaryList = this.statService.getCourseEnrollmentSummaryListForHistory(session,
                                                                                                                                  httpServletRequest,
                                                                                                                                  historyYear,
                                                                                                                                  courseCategoryIdList,
                                                                                                                                  curriculumInstitutionId,
                                                                                                                                  curriculumId,
                                                                                                                                  institutionId,
                                                                                                                                  organizationId,
                                                                                                                                  termType,
                                                                                                                                  termYear,
                                                                                                                                  termId,
                                                                                                                                  courseId,
                                                                                                                                       courseYear,
                                                                                                                                  courseExcludeFromStatistics,
                                                                                                                                  includeCourseProperties,
                                                                                                                                  studentUserIdx,
                                                                                                                                  includeStudentProperties,
                                                                                                                                  studentType,
                                                                                                                                  departmentId,
                                                                                                                                  status,
                                                                                                                                  courseStudentGroupMember,
                                                                                                                                  completed,
                                                                                                                                  unenrollRequestStatus,
                                                                                                                                  studyMaterialDeliveryStatusList,
                                                                                                                                  academicAdvisorAssigned,
                                                                                                                                  academicAdvisorUserIdx,
                                                                                                                                  courseTaskId,
                                                                                                                                  searchOptionList,
                                                                                                                                  orderBy,
                                                                                                                                  page,
                                                                                                                                  count);

            response = super.responseFactory.createResponse(Code.SUCCESS,
                                                            courseEnrollmentSummaryList.toJsonAware(),
                                                            httpServletRequest);

        } catch (CodedException e) {

            response = super.responseFactory.createResponse(e,
                                                            httpServletRequest);
        }

        return response.toJSONString();
    }

}
