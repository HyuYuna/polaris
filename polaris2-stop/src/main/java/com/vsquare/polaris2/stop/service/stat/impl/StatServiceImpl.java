package com.vsquare.polaris2.stop.service.stat.impl;

import com.vsquare.commons.tool.*;
import com.vsquare.polaris2.core.Code;
import com.vsquare.polaris2.core.database.mapper.CommonMapper;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.MapModel;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.NameValuePair;
import com.vsquare.polaris2.core.model.SearchOption;
import com.vsquare.polaris2.core.model.common.Attribute;
import com.vsquare.polaris2.core.model.department.SimpleDepartment;
import com.vsquare.polaris2.core.model.institution.Institution;
import com.vsquare.polaris2.core.model.learning.*;
import com.vsquare.polaris2.core.model.organization.Organization;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.task.AsyncTask;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserProperties;
import com.vsquare.polaris2.core.model.user.UserPropertiesWrapper;
import com.vsquare.polaris2.core.service.BaseComponent;
import com.vsquare.polaris2.core.service.learning.LearningService;
import com.vsquare.polaris2.core.service.task.TaskService;
import com.vsquare.polaris2.stop.database.mapper.ProjectMapper;
import com.vsquare.polaris2.stop.database.mapper.StatMapper;
import com.vsquare.polaris2.stop.model.stat.StudentCountDetail;
import com.vsquare.polaris2.stop.service.stat.StatService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class StatServiceImpl extends BaseComponent implements StatService {

    private static final Logger LOGGER = LogManager.getLogger();

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private StatMapper statMapper;

    @Autowired
    private CommonMapper commonMapper;

    @Autowired
    private TaskService taskService;

    @Autowired
    private LearningService learningService;

    @Override
    public AsyncTask exportCourseEnrollmentSummaryListForHistory(Session session,
                                                                 HttpServletRequest httpServletRequest,
                                                                 ServiceProvider serviceProvider,
                                                                 Integer historyYear,
                                                                 String curriculumInstitutionId,
                                                                 Long curriculumId,
                                                                 Long institutionId,
                                                                 Long organizationId,
                                                                 Term.Type termType,
                                                                 Integer termYear,
                                                                 Long termId,
                                                                 Long courseId,
                                                                 Integer courseYear,
                                                                 Long studentUserIdx,
                                                                 User.StudentType studentType,
                                                                 Long departmentId,
                                                                 CourseEnrollment.Status status,
                                                                 Boolean completed,
                                                                 List<CourseEnrollment.StudyMaterialDeliveryStatus> studyMaterialDeliveryStatusList,
                                                                 Boolean academicAdvisorAssigned,
                                                                 Long academicAdvisorUserIdx,
                                                                 List<SearchOption> searchOptionList,
                                                                 CourseEnrollment.OrderBy orderBy,
                                                                 Integer page,
                                                                 Integer count) throws Exception {

        final AsyncTask asyncTask = this.taskService.registerAsyncTask(AsyncTask.Type.EXPORT_COURSE_ENROLLMENT_SUMMARY_LIST,
                                                                       null,
                                                                       null,
                                                                       null,
                                                                       null,
                                                                       null);

        final long asyncTaskId = asyncTask.getId();

        new Thread(new Runnable() {

            @Override
            public void run() {

                Workbook workbook = null;

                try {

                    taskService.updateAsyncTaskStatus(asyncTaskId,
                                                      null,
                                                      null,
                                                      AsyncTask.Status.PROCESSING);

                    ModelList<CourseEnrollmentSummary> courseEnrollmentSummaryList = getCourseEnrollmentSummaryListForHistory(session,
                                                                                                                              httpServletRequest,
                                                                                                                              historyYear,
                                                                                                                              null,
                                                                                                                              curriculumInstitutionId,
                                                                                                                              curriculumId,
                                                                                                                              institutionId,
                                                                                                                              organizationId,
                                                                                                                              termType,
                                                                                                                              termYear,
                                                                                                                              termId,
                                                                                                                              courseId,
                                                                                                                              courseYear,
                                                                                                                              false,
                                                                                                                              true,
                                                                                                                              studentUserIdx,
                                                                                                                              true,
                                                                                                                              studentType,
                                                                                                                              departmentId,
                                                                                                                              status,
                                                                                                                              null,
                                                                                                                              completed,
                                                                                                                              null,
                                                                                                                              studyMaterialDeliveryStatusList,
                                                                                                                              academicAdvisorAssigned,
                                                                                                                              academicAdvisorUserIdx,
                                                                                                                              null,
                                                                                                                              searchOptionList,
                                                                                                                              orderBy,
                                                                                                                              page,
                                                                                                                              count);

                    workbook = doExportCourseEnrollmentSummaryList(courseEnrollmentSummaryList);

                    String resultFilePath = taskService.saveAsyncTaskResult(session,
                                                                            serviceProvider,
                                                                            asyncTaskId,
                                                                            workbook);

                    taskService.updateAsyncTaskStatus(asyncTaskId,
                                                      null,
                                                      resultFilePath,
                                                      AsyncTask.Status.COMPLETED);

                } catch (Exception e) {

                    try {

                        JSONAware properties = null;

                        if (e instanceof CodedException) {

                            CodedException codedException = (CodedException) e;
                            properties = codedException.toJsonAware();
                        }

                        taskService.updateAsyncTaskStatus(asyncTaskId,
                                                          properties,
                                                          null,
                                                          AsyncTask.Status.FAILED);

                    } catch (Exception e1) {

                        System.out.println("Exception Occured");

                    }

                } finally {

                    try {

                        if (workbook != null) {
                            workbook.close();
                        }

                    } catch (IOException e) {
                        System.out.println("Exception Occured");
                    }
                }
            }
        }).start();

        return asyncTask;
    }

    @Override
    public AsyncTask exportCourseSummaryList(Session session,
                                             Map<String, String[]> parameterMap,
                                             ServiceProvider serviceProvider,
                                             Long courseCodeId,
                                             List<Long> courseCodeInstitutionIdList,
                                             List<Long> categoryIdList,
                                             Long courseContentId,
                                             Long curriculumId,
                                             List<Long> departmentIdList,
                                             Integer year,
                                             Long termId,
                                             List<Long> institutionIdList,
                                             Long organizationId,
                                             List<Term.Type> termTypeList,
                                             Long termCurriculumId,
                                             Integer termYear,
                                             Boolean termAvailable,
                                             List<Course.LearningMethod> learningMethodList,
                                             Boolean offerCertificate,
                                             Boolean available,
                                             List<Course.Status> statusList,
                                             Boolean favoriteCourse,
                                             boolean studentPage,
                                             boolean adminPage,
                                             List<CourseEnrollment.Status> courseEnrollmentStatusList,
                                             Boolean completed,
                                             Long targetUserIdx,
                                             Date studentEnrollmentFromDate,
                                             Date studentEnrollmentToDate,
                                             Course.GroupBy groupBy,
                                             List<SearchOption> searchOptionList,
                                             Course.OrderBy orderBy,
                                             Integer page,
                                             Integer count) throws Exception {


        final AsyncTask asyncTask = this.taskService.registerAsyncTask(AsyncTask.Type.EXPORT_COURSE_SUMMARY_LIST,
                                                                       null,
                                                                       null,
                                                                       null,
                                                                       null,
                                                                       null);

        final long asyncTaskId = asyncTask.getId();

        new Thread(new Runnable() {

            @Override
            public void run() {

                Workbook workbook = null;

                try {

                    taskService.updateAsyncTaskStatus(asyncTaskId,
                                                      null,
                                                      null,
                                                      AsyncTask.Status.PROCESSING);

                    ModelList<CourseSummary> courseSummaryList = learningService.getCourseSummaryList(session,
                                                                                                      parameterMap,
                                                                                                      serviceProvider,
                                                                                                      serviceProvider.getId(),
                                                                                                      null,
                                                                                                      null,
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
                                                                                                      null,
                                                                                                      null,
                                                                                                      available,
                                                                                                      false,
                                                                                                      statusList,
                                                                                                      favoriteCourse,
                                                                                                      studentPage,
                                                                                                      adminPage,
                                                                                                      courseEnrollmentStatusList,
                                                                                                      completed,
                                                                                                      targetUserIdx,
                                                                                                      true,
                                                                                                      true,
                                                                                                      false,
                                                                                                      false,
                                                                                                      studentEnrollmentFromDate,
                                                                                                      studentEnrollmentToDate,
                                                                                                      groupBy,
                                                                                                      false,
                                                                                                      searchOptionList,
                                                                                                      orderBy,
                                                                                                      page,
                                                                                                      count);

                    workbook = doExportCourseSummaryList(courseSummaryList);

                    String resultFilePath = taskService.saveAsyncTaskResult(session,
                                                                            serviceProvider,
                                                                            asyncTaskId,
                                                                            workbook);

                    taskService.updateAsyncTaskStatus(asyncTaskId,
                                                      null,
                                                      resultFilePath,
                                                      AsyncTask.Status.COMPLETED);

                } catch (Exception e) {


                    try {

                        JSONAware properties = null;

                        if (e instanceof CodedException) {

                            CodedException codedException = (CodedException) e;
                            properties = codedException.toJsonAware();
                        }

                        taskService.updateAsyncTaskStatus(asyncTaskId,
                                                          properties,
                                                          null,
                                                          AsyncTask.Status.FAILED);

                    } catch (Exception e1) {

                        System.out.println("Exception Occured");

                    }

                } finally {

                    try {

                        if (workbook != null) {
                            workbook.close();
                        }

                    } catch (IOException e) {
                        System.out.println("IO Exception Occured");
                    }
                }
            }

        }).start();

        return asyncTask;
    }

    @Override
    public MapModel getStatistics(Session session,
                                  Integer courseYear,
                                  Integer historyYear,
                                  Integer termTypeCode,
                                  Integer isCompleted,
                                  Date startDate,
                                  Date endDate) throws Exception {

        if (session == null) {
            throw new CodedException(Code.UNAUTHORIZED_USER);
        }

        User.Role userRole = session.getUserRole();
        if (userRole != User.Role.INSTITUTION_ADMIN) {
            throw new CodedException(Code.UNAUTHORIZED_USER);
        }


        String tablePostfix = "";
        if ( historyYear != null ) {
            tablePostfix = "_HISTORY";
        }

        Map<String, Object> map = new HashMap<>();

        map.put("list1",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList1(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        startDate,
                        endDate)));
        map.put("list2",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList2(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list3",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList3(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list4",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList4(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list5",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList5(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list6",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList6(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list7",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList7(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list8",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList8(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));
        map.put("list9",
                MapModel.createMapModelList(this.projectMapper.selectStatisticsList9(
                        tablePostfix,
                        courseYear,
                        historyYear,
                        termTypeCode,
                        isCompleted,
                        startDate,
                        endDate)));


        MapModel mapModel = new MapModel();
        mapModel.setMap(map);
        return mapModel;
    }

    @Override
    public AsyncTask exportStatistics(Session session,
                                      ServiceProvider serviceProvider,
                                      Integer courseYear,
                                      Integer historyYear,
                                      Integer termTypeCode,
                                      Integer isCompleted,
                                      Date startDate,
                                      Date endDate) throws Exception {


        final AsyncTask asyncTask = this.taskService.registerAsyncTask(AsyncTask.Type.EXPORT_STATISTICS,
                                                                       null,
                                                                       null,
                                                                       null,
                                                                       null,
                                                                       null);

        final long asyncTaskId = asyncTask.getId();

        new Thread(new Runnable() {

            @Override
            public void run() {

                Workbook workbook = null;

                try {

                    taskService.updateAsyncTaskStatus(asyncTaskId,
                                                      null,
                                                      null,
                                                      AsyncTask.Status.PROCESSING);

                    MapModel mapModel = getStatistics(session,
                                                      courseYear,
                                                      historyYear,
                                                      termTypeCode,
                                                      isCompleted,
                                                      startDate,
                                                      endDate);

                    workbook = doExportStatistics(mapModel);

                    String resultFilePath = taskService.saveAsyncTaskResult(session,
                                                                            serviceProvider,
                                                                            asyncTaskId,
                                                                            workbook);

                    taskService.updateAsyncTaskStatus(asyncTaskId,
                                                      null,
                                                      resultFilePath,
                                                      AsyncTask.Status.COMPLETED);

                } catch (Exception e) {

                    try {

                        JSONAware properties = null;

                        if (e instanceof CodedException) {

                            CodedException codedException = (CodedException) e;
                            properties = codedException.toJsonAware();
                        }

                        taskService.updateAsyncTaskStatus(asyncTaskId,
                                                          properties,
                                                          null,
                                                          AsyncTask.Status.FAILED);

                    } catch (Exception e1) {

                        // TODO
                        e1.printStackTrace();
                    }

                } finally {

                    try {

                        if (workbook != null)
                            workbook.close();

                    } catch (IOException e) {

                        e.printStackTrace();
                    }
                }
            }

        }).start();

        return asyncTask;

    }

    @Override
    public ModelList<CourseEnrollmentSummary> getCourseEnrollmentSummaryListForHistory(Session session,
                                                                                       HttpServletRequest httpServletRequest,
                                                                                       Integer historyYear,
                                                                                       List<Long> courseCategoryIdList,
                                                                                       String curriculumInstitutionId,
                                                                                       Long curriculumId,
                                                                                       Long institutionId,
                                                                                       Long organizationId,
                                                                                       Term.Type termType,
                                                                                       Integer termYear,
                                                                                       Long termId,
                                                                                       Long courseId,
                                                                                       Integer courseYear,
                                                                                       Boolean courseExcludeFromStatistics,
                                                                                       boolean includeCourseProperties,
                                                                                       Long studentUserIdx,
                                                                                       boolean includeStudentProperties,
                                                                                       User.StudentType studentType,
                                                                                       Long departmentId,
                                                                                       CourseEnrollment.Status status,
                                                                                       Boolean courseStudentGroupMember,
                                                                                       Boolean completed,
                                                                                       CourseEnrollment.UnenrollRequestStatus unenrollRequestStatus,
                                                                                       List<CourseEnrollment.StudyMaterialDeliveryStatus> studyMaterialDeliveryStatusList,
                                                                                       Boolean academicAdvisorAssigned,
                                                                                       Long academicAdvisorUserIdx,
                                                                                       Long courseTaskId,
                                                                                       List<SearchOption> searchOptionList,
                                                                                       CourseEnrollment.OrderBy orderBy,
                                                                                       Integer page,
                                                                                       Integer count) throws Exception {

        // 로그인 여부 확인
        super.checkUserSessionAndStatus(session);

        CourseEnrollment.SelectMode selectMode = null;
        Long selectModeUserIdx = null;

        if (institutionId != null) {

            Institution institution = super.cacheManager.getInstitutionCache(institutionId);

            if (institution == null)
                throw new CodedException(Code.NO_SUCH_INSTITUTION);
        }

        if (organizationId != null && organizationId > 0) {

            Organization organization = super.organizationMapper.selectOrganizationById(organizationId);

            if (organization == null)
                throw new CodedException(Code.NO_SUCH_ORGANIZATION);
        }

        Term term = null;

        if (termId != null) {

            term = super.cacheManager.getTermCache(termId);

            if (term == null)
                throw new CodedException(Code.NO_SUCH_TERM);

            long termInstitutionId = term.getInstitutionId();

            if (institutionId == null) {

                institutionId = termInstitutionId;

            } else {

                if (!institutionId.equals(termInstitutionId))
                    throw new CodedException(Code.INSTITUTION_ID_MISMATCH);
            }

            Long termOrganizationId = term.getOrganizationId();

            if (organizationId == null) {

                organizationId = termOrganizationId;

            } else {

                if (organizationId > 0) {

                    if (termOrganizationId == null)
                        throw new CodedException(Code.ORGANIZATION_ID_MISMATCH);

                    if (!termOrganizationId.equals(organizationId))
                        throw new CodedException(Code.ORGANIZATION_ID_MISMATCH);
                }
            }

            if (termType != null) {

                if (!termType.equals(term.getType()))
                    throw new CodedException(Code.TERM_TYPE_MISMATCH);
            }

            if (termYear != null) {

                if (term.getYear() == null)
                    throw new CodedException(Code.TERM_YEAR_MISMATCH);

                if (!termYear.equals(term.getYear()))
                    throw new CodedException(Code.TERM_YEAR_MISMATCH);
            }
        }

        // 평가항목 아이디에 따른 설정 처리
        if (courseTaskId != null) {

            CourseTask courseTask = super.learningMapper.selectCourseTaskById(courseTaskId);

            if (courseTask == null)
                throw new CodedException(Code.NO_SUCH_COURSE_TASK);

            if (courseId == null)
                courseId = courseTask.getCourseId();
        }

        Course course = null;

        if (courseId != null) {

            // 과목 존재 여부 확인
            course = super.learningMapper.selectCourseById(courseId);

            if (course == null)
                throw new CodedException(Code.NO_SUCH_COURSE);

            long courseTermId = course.getTermId();

            if (termId == null) {

                if (term == null)
                    term = super.cacheManager.getTermCache(courseTermId);

                if (term == null)
                    throw new CodedException(Code.NO_SUCH_TERM);

            } else {

                if (courseTermId != termId)
                    throw new CodedException(Code.TERM_ID_MISMATCH);
            }

            if (termId == null)
                termId = course.getTermId();

            if (organizationId == null)
                organizationId = course.getOrganizationId();

            if (institutionId == null)
                institutionId = course.getInstitutionId();
        }

        // 사용자 권한 확인
        User.Role absoluteUserRole = session.getUserRole();
        long userIdx = session.getUserIdx();

        User.Role relativeUserRole = super.getRelativeUserRole(userIdx,
                                                               absoluteUserRole,
                                                               course);

        boolean termOperatingOrganizationAdmin = false;
        Long studentOrganizationId = null;

        switch (relativeUserRole) {

            case ADMIN: {

                selectMode = CourseEnrollment.SelectMode.GENERAL;
                selectModeUserIdx = null;

                break;
            }

            case INSTITUTION_ADMIN: {

                Long selectedInstitutionId = institutionId;

                if (selectedInstitutionId == null) {

                    if (term != null) {

                        selectedInstitutionId = term.getInstitutionId();

                    } else {

                        if (course != null)
                            selectedInstitutionId = course.getInstitutionId();
                    }
                }

                if (selectedInstitutionId == null) {

                    List<Long> managingInstitutionIdList = super.institutionMapper.selectInstitutionIdListByInstitutionAdminUserIdx(userIdx);

                    if (CollectionUtils.isNullOrEmpty(managingInstitutionIdList))
                        throw new CodedException(Code.UNAUTHORIZED_USER);

                } else {

                    if (!super.isInstitutionAdministrator(selectedInstitutionId,
                                                          userIdx))
                        throw new CodedException(Code.NOT_AN_INSTITUTION_ADMINISTRATOR);
                }

                selectMode = CourseEnrollment.SelectMode.INSTITUTION_ADMINISTRATOR;
                selectModeUserIdx = userIdx;

                institutionId = selectedInstitutionId;

                break;
            }

            case ORGANIZATION_ADMIN: {

                Long selectedOrganizationId = organizationId;

                if (selectedOrganizationId == null) {

                    if (term != null) {

                        selectedOrganizationId = term.getOrganizationId();

                    } else {

                        if (course != null)
                            selectedOrganizationId = course.getOrganizationId();
                    }
                }

                if (selectedOrganizationId == null) {

                    List<Long> organizationIdList = super.organizationMapper.selectOrganizationIdListByAdminUserIdx(userIdx);

                    if (CollectionUtils.isNullOrEmpty(organizationIdList))
                        throw new CodedException(Code.UNAUTHORIZED_USER);

                    selectedOrganizationId = organizationIdList.get(0);
                }

                Organization selectedOrganization = super.organizationMapper.selectOrganizationById(selectedOrganizationId);

                if (selectedOrganization == null)
                    throw new CodedException(Code.NO_SUCH_ORGANIZATION);

                if (!super.isOrganizationAdministrator(selectedOrganizationId,
                                                       userIdx))
                    throw new CodedException(Code.NOT_AN_ORGANIZATION_ADMINISTRATOR);

                selectMode = CourseEnrollment.SelectMode.ORGANIZATION_ADMINSITRATOR;
                selectModeUserIdx = userIdx;

                int allowTermOperationInteger = selectedOrganization.getAllowTermOperation();
                termOperatingOrganizationAdmin = Booleans.integerToBoolean(allowTermOperationInteger);

                if (!termOperatingOrganizationAdmin) {

                    studentOrganizationId = selectedOrganizationId;
                    organizationId = null;

                } else {

                    organizationId = selectedOrganizationId;
                }

                break;
            }

            case TEACHER:
            case TEACHING_ASSISTANT: {

                if (courseId == null) {

                    if (!super.isDepartmentAdministrator(userIdx)) {

                        if (!super.isCourseAdministrator(userIdx))
                            throw new CodedException(Code.UNAUTHORIZED_USER);

                        selectMode = CourseEnrollment.SelectMode.COURSE_ADMINISTRATOR;

                    } else {

                        selectMode = CourseEnrollment.SelectMode.DEPARTMENT_ADMINISTRATOR;
                    }

                    selectModeUserIdx = userIdx;

                } else {

                    if (super.isCourseAdministrator(courseId,
                                                    userIdx)) {

                        selectMode = CourseEnrollment.SelectMode.COURSE_ADMINISTRATOR;
                        selectModeUserIdx = userIdx;

                    } else {

                        List<CourseDepartmentMapping> departmentMappingList = super.learningMapper.selectCourseDepartmentMappingListByCourseIdList(Arrays.asList(courseId),
                                                                                                                                                   Arrays.asList(CourseDepartmentMapping.Type.MASTER));

                        if (CollectionUtils.isNullOrEmpty(departmentMappingList))
                            throw new CodedException(Code.NOT_A_COURSE_ADMINISTRATOR);

                        long masterDepartmentId = departmentMappingList.get(0)
                                                                       .getDepartmentId();

                        if (!super.isDepartmentAdministrator(userIdx,
                                                             masterDepartmentId))
                            throw new CodedException(Code.NOT_A_COURSE_ADMINISTRATOR);

                        selectMode = CourseEnrollment.SelectMode.DEPARTMENT_ADMINISTRATOR;
                        selectModeUserIdx = userIdx;
                    }
                }

                break;
            }

            default: {

                if (courseId == null)
                    throw new CodedException(Code.UNAUTHORIZED_USER);

                if (!super.isEnrolled(courseId,
                                      userIdx))
                    throw new CodedException(Code.UNENROLLED_STUDENT);

                curriculumInstitutionId = null;
                curriculumId = null;
                institutionId = null;
                organizationId = null;
                termType = null;
                termYear = null;
                termId = null;
                studentUserIdx = null;
                status = CourseEnrollment.Status.ENROLLED;
                completed = null;
                studyMaterialDeliveryStatusList = null;
                academicAdvisorAssigned = null;
                academicAdvisorUserIdx = null;
//                searchOptionList = null;
                orderBy = CourseEnrollment.OrderBy.STUDENT_NAME_ASC;

                selectMode = CourseEnrollment.SelectMode.GENERAL;
                selectModeUserIdx = userIdx;

                break;
            }
        }

        Integer courseExcludeFromStatisticsInteger = null;

        if (courseExcludeFromStatistics != null)
            courseExcludeFromStatisticsInteger = Booleans.booleanToInteger(courseExcludeFromStatistics);

        int includeCoursePropertiesInteger = Booleans.booleanToInteger(includeCourseProperties);

        Integer academicAdvisorAssignedInteger = null;

        if (academicAdvisorAssigned != null)
            academicAdvisorAssignedInteger = Booleans.booleanToInteger(academicAdvisorAssigned);

        List<Long> academicAdvisorUserIdxList = null;

        if (academicAdvisorUserIdx != null) {

            academicAdvisorUserIdxList = new ArrayList<Long>();
            academicAdvisorUserIdxList.add(academicAdvisorUserIdx);
        }

        int isTermOperatingOrganizationAdmin = Booleans.booleanToInteger(termOperatingOrganizationAdmin);

        Integer isCourseStudentGroupMember = null;

        if (courseStudentGroupMember != null) {

            isCourseStudentGroupMember = Booleans.booleanToInteger(courseStudentGroupMember);
        }

        Integer isCompleted = null;

        if (completed != null)
            isCompleted = Booleans.booleanToInteger(completed);

        long totalCount = this.statMapper.selectCourseEnrollmentCount(
                historyYear,
                selectMode,
                selectModeUserIdx,
                isTermOperatingOrganizationAdmin,
                studentOrganizationId,
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
                courseExcludeFromStatisticsInteger,
                studentUserIdx,
                studentType,
                departmentId,
                status,
                null,
                isCourseStudentGroupMember,
                isCompleted,
                unenrollRequestStatus,
                studyMaterialDeliveryStatusList,
                academicAdvisorAssignedInteger,
                academicAdvisorUserIdxList,
                courseTaskId,
                searchOptionList);

        // Row Number 처리
        Integer originalPage = page;

        if (page != null && count != null)
            page = (page - 1) * count;

        List<CourseEnrollmentSummary> list = this.statMapper.selectCourseEnrollmentSummaryList(
                historyYear,
                selectMode,
                selectModeUserIdx,
                isTermOperatingOrganizationAdmin,
                studentOrganizationId,
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
                courseExcludeFromStatisticsInteger,
                includeCoursePropertiesInteger,
                studentUserIdx,
                studentType,
                departmentId,
                status,
                null,
                isCourseStudentGroupMember,
                isCompleted,
                unenrollRequestStatus,
                studyMaterialDeliveryStatusList,
                academicAdvisorAssignedInteger,
                academicAdvisorUserIdxList,
                courseTaskId,
                searchOptionList,
                orderBy,
                page,
                count);


        if (CollectionUtils.isNotNullOrEmpty(list)) {

            List<Long> coursesIdList = new ArrayList<>();

            for (CourseEnrollmentSummary ces : list) {

                Long cesCourseId = ces.getCourseId();
                coursesIdList.add(cesCourseId);
            }

            List<CourseAttribute> courseAttributeList = super.learningMapper.selectCourseAttributeListByCourseIdList(coursesIdList);
            if (CollectionUtils.isNotNullOrEmpty(courseAttributeList)) {

                HashMap<Long, List<CourseAttribute>> courseAttributeMap = new HashMap<Long, List<CourseAttribute>>();
                for (CourseAttribute courseAttribute : courseAttributeList) {

                    long courseAttributeCourseId = courseAttribute.getCourseId();
                    List<CourseAttribute> courseAttributeMapList = courseAttributeMap.get(courseAttributeCourseId);
                    if (courseAttributeMapList == null) {
                        courseAttributeMapList = new ArrayList<>();
                        courseAttributeMap.put(courseAttributeCourseId,
                                               courseAttributeMapList);
                    }

                    courseAttributeMapList.add(courseAttribute);
                }

                for (CourseEnrollmentSummary ces : list) {

                    List<CourseAttribute> courseAttributeMapList = courseAttributeMap.get(ces.getCourseId());
                    ces.setCourseAttributeList(courseAttributeMapList);
                }
            }
        }


        List<Long> userIdxList = null;

        if (includeStudentProperties) {

            userIdxList = new ArrayList<Long>();
        }

        long startRowNumber = totalCount;

        if (originalPage != null && count != null)
            startRowNumber = startRowNumber - ((originalPage - 1) * count);

        // 성능 상의 이유로 학과 정보는 별도로 쿼리하여 가지고 오도록 처리
        List<SimpleDepartment> simpleDepartmentList = super.departmentMapper.selectSimpleDepartmentList();

        Map<Long, String> departmentIdNameMap = null;

        if (CollectionUtils.isNotNullOrEmpty(simpleDepartmentList)) {

            departmentIdNameMap = new HashMap<Long, String>();

            for (SimpleDepartment simpleDepartment : simpleDepartmentList) {

                departmentIdNameMap.put(simpleDepartment.getId(),
                                        simpleDepartment.getName());
            }
        }

        for (CourseEnrollmentSummary courseEnrollmentSummary : list) {

            Long studentUserDepartmentId = courseEnrollmentSummary.getStudentUserDepartmentId();

            if (studentUserDepartmentId != null && CollectionUtils.isNotNullOrEmpty(departmentIdNameMap)) {

                String departmentName = departmentIdNameMap.get(studentUserDepartmentId);
                courseEnrollmentSummary.setStudentUserDepartmentName(departmentName);
            }

            courseEnrollmentSummary.setRowNumber(startRowNumber);
            startRowNumber--;

            if (includeStudentProperties) {

                userIdxList.add(courseEnrollmentSummary.getStudentUserIdx());
            }
        }

        if (includeStudentProperties) {

            if (CollectionUtils.isNotNullOrEmpty(userIdxList)) {

                Map<Long, UserProperties> userPropertiesMap = new HashMap<>();

                List<UserPropertiesWrapper> userPropertiesWrapperList = this.statMapper.selectUserPropertiesWrapperListByUserIdxList(historyYear,
                                                                                                                                     userIdxList);
                if (userPropertiesWrapperList != null) {

                    for (int i = 0, l = userPropertiesWrapperList.size(); i < l; i++) {

                        UserPropertiesWrapper wrapper = userPropertiesWrapperList.get(i);
                        userPropertiesMap.put(wrapper.getUserIdx(),
                                              wrapper.getUserProperties());
                    }
                }

                for (CourseEnrollmentSummary summary : list) {
                    summary.setStudentUserProperties(userPropertiesMap.get(summary.getStudentUserIdx()));
                }

            }
        }

        ModelList<CourseEnrollmentSummary> courseEnrollmentSummaryList = new ModelList<CourseEnrollmentSummary>();
        courseEnrollmentSummaryList.setTotalCount(totalCount);
        courseEnrollmentSummaryList.setList(list);

        return courseEnrollmentSummaryList;
    }

    private int appendTable(Sheet sheet,
                            int currentRowIndex,
                            List<MapModel> list,
                            int count,
                            CellStyle headerCellStyle,
                            CellStyle bodyCellStyle) {

        String[] typeCodeList = new String[]{
                "GB",
                "AB",
                "AI",
                "BB",
                "BI",
                "BA",
                "CB",
                "CI",
                "CA",
                "DB",
                "DI",
                "DA"
        };


        Map<String, Map<String, Object>> map = new HashMap<>();

        List<Map<String, Object>> mapList = new ArrayList<>();
        for (int i = 0, l = list.size(); i < l; i++) {

            MapModel mapModel = list.get(i);
            Map<String, Object> itemMap = mapModel.getMap();
            String typeCode = MapUtils.getChildString(itemMap,
                                                      "type_code");
            map.put(typeCode,
                    itemMap);

            mapList.add(itemMap);
        }


        Map<String, String> typeCodeMap = new HashMap<>();

        List<Map<String, Object>> sortedList = new ArrayList<>();

        for (int i = 0, l = typeCodeList.length; i < l; i++) {

            String typeCode = typeCodeList[i];

            typeCodeMap.put(typeCode,
                            typeCode);

            Map<String, Object> itemMap = null;
            if (map.containsKey(typeCode)) {
                itemMap = map.get(typeCode);
            } else {
                itemMap = new HashMap<>();
            }

            sortedList.add(itemMap);
        }

        List<Map<String, Object>> uncategoriedList = new ArrayList<>();

        for (String key : map.keySet()) {

            if (!typeCodeMap.containsKey(key)) {
                uncategoriedList.add(map.get(key));
            }
        }

        sortedList.add(this.computeTotal(uncategoriedList));
        sortedList.add(this.computeTotal(mapList));


        for (int i = 0, l = sortedList.size(); i < l; i++) {

            if (i == 0) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      0,
                                      "양성교육",
                                      bodyCellStyle);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      1,
                                      "상담원 양성교육(G)",
                                      bodyCellStyle);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "기본(Basic)",
                                      bodyCellStyle);
            } else if (i == 1) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      0,
                                      "보수교육 (A+B+C+D)",
                                      bodyCellStyle,
                                      1,
                                      11);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      1,
                                      "공통역량 강화교육(A)",
                                      bodyCellStyle,
                                      1,
                                      2);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "기본(Basic)",
                                      bodyCellStyle);
            } else if (i == 2) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "중급(Intermediate)",
                                      bodyCellStyle,
                                      1,
                                      1);
            } else if (i == 3) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      1,
                                      "직무(전문)(B)",
                                      bodyCellStyle,
                                      1,
                                      3);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "기본(Basic)",
                                      bodyCellStyle);
            } else if (i == 4) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "중급(Intermediate)",
                                      bodyCellStyle);
            } else if (i == 5) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "고급(Advanced)",
                                      bodyCellStyle);
            } else if (i == 6) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      1,
                                      "직무(통합)(C)",
                                      bodyCellStyle,
                                      1,
                                      3);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "기본(Basic)",
                                      bodyCellStyle);
            } else if (i == 7) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "중급(Intermediate)",
                                      bodyCellStyle);
            } else if (i == 8) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "고급(Advanced)",
                                      bodyCellStyle);
            } else if (i == 9) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      1,
                                      "리더십 역량(D)",
                                      bodyCellStyle,
                                      1,
                                      3);
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "기본(Basic)",
                                      bodyCellStyle);
            } else if (i == 10) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "중급(Intermediate)",
                                      bodyCellStyle);
            } else if (i == 11) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      2,
                                      "고급(Advanced)",
                                      bodyCellStyle);
            } else if (i == 12) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      0,
                                      "소진방지",
                                      bodyCellStyle,
                                      3,
                                      1);
            } else if (i == 13) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      0,
                                      "합계",
                                      bodyCellStyle,
                                      3,
                                      1);
            }

            Map<String, Object> item = sortedList.get(i);
            for (int ii = 0, ll = count + 1; ii < ll; ii++) {
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      ii + 3,
                                      String.valueOf(MapUtils.getChildIntegerWithDefault(0,
                                                                                         item,
                                                                                         "a" + ii)),
                                      bodyCellStyle,
                                      1,
                                      1);
            }

            currentRowIndex++;
        }

        return currentRowIndex;
    }

    private int appendTable_1(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 20;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "총괄표",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }

        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  2);
            columnIndex += 3;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "과정 수(개)",
                                  headerCellStyle,
                                  1,
                                  2);
            columnIndex += 1;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "횟수(회)",
                                  headerCellStyle,
                                  5,
                                  1);
            columnIndex += 5;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "정원(명)",
                                  headerCellStyle,
                                  5,
                                  1);
            columnIndex += 5;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "참여(명)",
                                  headerCellStyle,
                                  5,
                                  1);
            columnIndex += 5;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "수료(명)",
                                  headerCellStyle,
                                  5,
                                  1);
            columnIndex += 5;

            currentRowIndex += 1;
        }

        {
            int columnIndex = 4;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "집체",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "화상",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "이러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "블랜디드러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "집체",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "화상",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "이러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "블랜디드러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "집체",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "화상",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "이러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "블랜디드러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "집체",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "화상",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "이러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "블랜디드러닝",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_9(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 14;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육현황 - 주제유형별",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "유형무관",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "가정폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "스토킹",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "데이트폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "디지털성폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성희롱",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성매매",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "해바라기센터",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "여성긴급전화1366",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "장애",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "폭력피해이주여성",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "아동, 청소년",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "자살",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계",
                                  headerCellStyle);


            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_2(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 2;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 지정성별",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "여성(명)",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "남성(명)",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_3(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 8;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 소속기관 유형별",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "가정폭력.성폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "가정폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성매매",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "1366",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "폭력피해이주",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "해바라기",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "기타",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계(명)",
                                  headerCellStyle);


            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_4(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 18;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 지역별",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "강원",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "경기",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "경남",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "경북",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "광주",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "대구",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "대전",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "부산",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "서울",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "세종",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "울산",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "인천",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "전남",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "전북",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "제주",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "충남",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "충북",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "기타",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계(명)",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_5(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 5;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 직위별",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "기관장",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "중간관리자",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "상담원",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "사무원",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "기타",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계(명)",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_6(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 5;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 여성폭력방지기관 총 경력",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "1년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "1년 이상~2년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "2년 이상~4년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "4년 이상~10년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "10년 이상",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계(명)",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_7(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 5;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 현 기관 총 경력",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "구분",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "1년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "1년 이상~2년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "2년 이상~4년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "4년 이상~10년 미만",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "10년 이상",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계(명)",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        return this.appendTable(sheet,
                                currentRowIndex,
                                list,
                                columnCount,
                                headerCellStyle,
                                bodyCellStyle);
    }


    private int appendTable_8(Sheet sheet,
                              int currentRowIndex,
                              List<MapModel> list,
                              CellStyle headerCellStyle,
                              CellStyle bodyCellStyle) {

        int columnCount = 8;


        {
            POIUtils.setCellValue(sheet,
                                  currentRowIndex++,
                                  0,
                                  "교육생 현황 - 중복 수강 여부",
                                  headerCellStyle,
                                  columnCount + 4,
                                  1);
        }
        {
            int columnIndex = 0;

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex,
                                  "횟수(회)",
                                  headerCellStyle,
                                  3,
                                  1);
            columnIndex += 3;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "가정폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성매매",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "성폭력",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "1366",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "폭력피해이주",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "해바라기",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "기타",
                                  headerCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  columnIndex++,
                                  "합계(명)'",
                                  headerCellStyle);

            currentRowIndex += 1;
        }

        Map<Integer, List<Map<String, Object>>> map = new HashMap<>();

        int maxStudentCount = 0;
        for (int i = 0, l = list.size(); i < l; i++) {

            MapModel mapModel = list.get(i);
            Map<String, Object> item = mapModel.getMap();

            int courseCount = MapUtils.getChildIntegerWithDefault(0,
                                                                  item,
                                                                  "course_count");
            maxStudentCount = Math.max(maxStudentCount,
                                       courseCount);

            List<Map<String, Object>> mapList = map.get(maxStudentCount);
            if (mapList == null) {
                mapList = new ArrayList<>();
            }

            mapList.add(item);

            map.put(maxStudentCount,
                    mapList);
        }

        Map<String, Integer> sumMap = new HashMap<>();

        for (int i = 1, l = maxStudentCount; i < l; i++) {

            List<Map<String, Object>> mapList = map.get(i);
            if (CollectionUtils.isNullOrEmpty(mapList)) {
                continue;
            }

            int totalCount = 0;
            int etcCount = 0;
            Map<Integer, Integer> mapListMap = new HashMap<>();

            for (int ii = 0, ll = mapList.size(); ii < ll; ii++) {

                Map<String, Object> item = mapList.get(ii);

                int count = MapUtils.getChildIntegerWithDefault(0,
                                                                item,
                                                                "count");
                totalCount += count;

                int typeCode = MapUtils.getChildIntegerWithDefault(0,
                                                                   item,
                                                                   "type_code");
                if (typeCode < 46 || typeCode > 52) {
                    etcCount += count;
                }

                mapListMap.put(typeCode,
                               count);
            }

            sumMap.put("total_count",
                       MapUtils.getChildIntegerWithDefault(0,
                                                           sumMap,
                                                           "total_count") + totalCount);
            sumMap.put("etc_count",
                       MapUtils.getChildIntegerWithDefault(0,
                                                           sumMap,
                                                           "etc_count") + etcCount);

            int colIndex = 0;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  colIndex,
                                  String.valueOf(i),
                                  bodyCellStyle,
                                  3,
                                  1);
            colIndex += 3;
            for (int iii = 46, lll = 52; iii <= lll; iii++) {

                int count = MapUtils.getChildIntegerWithDefault(0,
                                                                mapListMap,
                                                                iii);

                sumMap.put(String.valueOf(iii),
                           MapUtils.getChildIntegerWithDefault(0,
                                                               sumMap,
                                                               String.valueOf(iii)) + count
                );

                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      colIndex++,
                                      String.valueOf(count),
                                      bodyCellStyle);
            }

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  colIndex++,
                                  String.valueOf(etcCount),
                                  bodyCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  colIndex++,
                                  String.valueOf(totalCount),
                                  bodyCellStyle);

            currentRowIndex++;
        }

        {
            int colIndex = 0;
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  colIndex,
                                  "합계",
                                  bodyCellStyle,
                                  3,
                                  1);
            colIndex += 3;
            for (int iii = 46, lll = 52; iii <= lll; iii++) {

                int count = MapUtils.getChildIntegerWithDefault(0,
                                                                sumMap,
                                                                String.valueOf(iii));
                POIUtils.setCellValue(sheet,
                                      currentRowIndex,
                                      colIndex++,
                                      String.valueOf(count),
                                      bodyCellStyle);
            }

            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  colIndex++,
                                  String.valueOf(MapUtils.getChildIntegerWithDefault(0,
                                                                                     sumMap,
                                                                                     "etc_count")),
                                  bodyCellStyle);
            POIUtils.setCellValue(sheet,
                                  currentRowIndex,
                                  colIndex++,
                                  String.valueOf(MapUtils.getChildIntegerWithDefault(0,
                                                                                     sumMap,
                                                                                     "total_count")),
                                  bodyCellStyle);

            currentRowIndex++;
        }


        return currentRowIndex;
    }


    private Workbook doExportStatistics(MapModel mapModel) {

        Workbook workbook = new HSSFWorkbook();

        Sheet sheet = workbook.createSheet("통계");

        Map<String, Object> map = mapModel.getMap();

        int currentRowIndex = 0;


        CellStyle headerCellStyle = workbook.createCellStyle();
        headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
        headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerCellStyle.setBorderTop(BorderStyle.THIN);
        headerCellStyle.setBorderBottom(BorderStyle.THIN);
        headerCellStyle.setBorderLeft(BorderStyle.THIN);
        headerCellStyle.setBorderRight(BorderStyle.THIN);
        headerCellStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Body
        CellStyle bodyCellStyle = workbook.createCellStyle();
        bodyCellStyle.setAlignment(HorizontalAlignment.CENTER);
        bodyCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        bodyCellStyle.setBorderTop(BorderStyle.THIN);
        bodyCellStyle.setBorderBottom(BorderStyle.THIN);
        bodyCellStyle.setBorderLeft(BorderStyle.THIN);
        bodyCellStyle.setBorderRight(BorderStyle.THIN);


        currentRowIndex = this.appendTable_1(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list1"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_9(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list9"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_2(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list2"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_3(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list3"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_4(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list4"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_5(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list5"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_6(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list6"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_7(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list7"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;
        currentRowIndex = this.appendTable_8(sheet,
                                             currentRowIndex,
                                             (List<MapModel>) map.get("list8"),
                                             headerCellStyle,
                                             bodyCellStyle) + 1;

        for (int i = 0; i < 3; i++) {

            sheet.setColumnWidth(i,
                                 6000);
        }

        for (int i = 3; i < 50; i++) {

            sheet.setColumnWidth(i,
                                 2000);
        }


        return workbook;
    }


    public Map<String, Object> computeTotal(List<Map<String, Object>> list) {

        Map<String, Object> map = new HashMap<>();

        for (int i = 0, l = list.size(); i < l; i++) {

            Map<String, Object> item = list.get(i);

            for (String key : item.keySet()) {

                if (!key.startsWith("a")) {
                    continue;
                }

                int v1 = MapUtils.getChildIntegerWithDefault(0,
                                                             map,
                                                             key);
                int v2 = MapUtils.getChildIntegerWithDefault(0,
                                                             item,
                                                             key);

                map.put(key,
                        v1 + v2);
            }

        }

        return map;
    }


    public Workbook doExportCourseSummaryList(ModelList<CourseSummary> courseSummaryList) throws Exception {

        Workbook workbook = new HSSFWorkbook();

        List<CourseSummary> list = courseSummaryList.getList();

        int careerCount = 0;
        int positionCount = 0;
        int agTypeCount = 0;

        List<Attribute> careerAttributeList = commonMapper.selectAttributeListByCategoryCode(null,
                                                                                             Arrays.asList("경력"),
                                                                                             null,
                                                                                             1L,
                                                                                             null,
                                                                                             null);

        if (CollectionUtils.isNotNullOrEmpty(careerAttributeList)) {

            careerCount = careerAttributeList.size();
        }

        List<Attribute> positionAttributeList = commonMapper.selectAttributeListByCategoryCode(null,
                                                                                               Arrays.asList("직위"),
                                                                                               null,
                                                                                               1L,
                                                                                               null,
                                                                                               null);

        if (CollectionUtils.isNotNullOrEmpty(positionAttributeList)) {

            positionCount = positionAttributeList.size();
        }

        List<Attribute> agTypeAttributeList = commonMapper.selectAttributeListByCategoryCode(null,
                                                                                             Arrays.asList("소속기관"),
                                                                                             null,
                                                                                             1L,
                                                                                             null,
                                                                                             null);

        if (CollectionUtils.isNotNullOrEmpty(agTypeAttributeList)) {

            // 기타 카운트는 제외
            agTypeCount = agTypeAttributeList.size() - 1;
        }

        List<String> columnNameList = new ArrayList<String>();

        columnNameList.add("연번"); //0
        columnNameList.add("양성/보수"); //1
        columnNameList.add("구분1"); //2
        columnNameList.add("구분2"); //3
        columnNameList.add("과목코드"); //4
        columnNameList.add("주제유형"); //5
        columnNameList.add("과목명"); //6

        columnNameList.add("소속기관 유형"); //7
        columnNameList.add("직위");//8
        columnNameList.add("경력");//9

        columnNameList.add("연도");//10
        columnNameList.add("월");//11
        columnNameList.add("시작일");//10
        columnNameList.add("종료일");//11
        columnNameList.add("교육형태"); //12

        columnNameList.add("장소 지역");//13
        columnNameList.add("장소 명"); //14

        columnNameList.add("실제 교육 시간");
        columnNameList.add("시수");

        columnNameList.add("정원(명)"); //17
        columnNameList.add("신청인원(명)"); //18
        columnNameList.add("참여(명)"); //19
        columnNameList.add("미선정(명)"); //20
        columnNameList.add("취소인원(명)"); //21
        columnNameList.add("수료(명)"); //22
        columnNameList.add("미수료(명)"); //23
        columnNameList.add("담딩자"); //24

        columnNameList.add("여"); // 25
        columnNameList.add("남"); // 26

        columnNameList.add("성폭(명)"); // 27
        columnNameList.add("가폭(명)"); // 28
        columnNameList.add("통합(명)"); // 29
        columnNameList.add("성매매(명)"); // 30
        columnNameList.add("1366(명)"); // 31
        columnNameList.add("해센(명)"); // 32
        columnNameList.add("폭력피해이주(명)"); // 33
        columnNameList.add("기타(명)"); // 34
        columnNameList.add("미분류(명)"); // 35
        columnNameList.add("합계"); // 36

//        columnNameList.add("응답자수 (명)"); // 36
//        columnNameList.add("교육운영"); // 37
//        columnNameList.add("교육과정"); // 38
//        columnNameList.add("강의만족도"); // 39
//        columnNameList.add("총 평균"); // 40

        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "과목");

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

        int skipCount = 0;

        for (int i = 0; i < columnCount; i++) {

            String columnName = columnNameList.get(i);

            Cell headerCell = headerRow.createCell(i);

            headerCell.setCellStyle(headerCellStyle);

            if (columnName.equals("소속기관 유형")) {

                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      i,
                                      "교육 대상",
                                      headerCellStyle,
                                      skipCount = 3,
                                      1);

            } else if (columnName.equals("성폭(명)")) {

                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      i,
                                      "참여자 분류(수료생 기준)",
                                      headerCellStyle,
                                      skipCount = 10,
                                      1);

            } else if (columnName.equals("여")) {

                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      i,
                                      "지정성별(수료생 기준)",
                                      headerCellStyle,
                                      skipCount = 2,
                                      1);
            }

            if (skipCount > 0) {

                skipCount--;

                POIUtils.setCellValue(sheet,
                                      currentRowIdx + 1,
                                      i,
                                      columnName,
                                      headerCellStyle,
                                      1,
                                      1);

            } else {

                POIUtils.setCellValue(sheet,
                                      currentRowIdx,
                                      i,
                                      columnName,
                                      headerCellStyle,
                                      1,
                                      2);
            }
        }

        currentRowIdx++;
        currentRowIdx++;

        // Body
        CellStyle bodyCellStyle = workbook.createCellStyle();
        bodyCellStyle.setAlignment(HorizontalAlignment.LEFT);
        bodyCellStyle.setBorderTop(BorderStyle.THIN);
        bodyCellStyle.setBorderBottom(BorderStyle.THIN);
        bodyCellStyle.setBorderLeft(BorderStyle.THIN);
        bodyCellStyle.setBorderRight(BorderStyle.THIN);

        int index = 0;

        List<Long> courseIdList = new ArrayList<Long>();

        for (CourseSummary courseSummary : list) {

            courseIdList.add((courseSummary.getId()));
        }

        List<StudentCountDetail> studentCountDetailList = this.projectMapper.selectStudentCountDetailListByCourseIdList(courseIdList);

        Map<Long, StudentCountDetail> studentCountDetailMap = new HashMap<Long, StudentCountDetail>();

        for (StudentCountDetail studentCountDetail : studentCountDetailList) {

            studentCountDetailMap.put(studentCountDetail.getCourseId(),
                                      studentCountDetail);
        }

        for (CourseSummary courseSummary : list) {

            StudentCountDetail studentCountDetail = studentCountDetailMap.get(courseSummary.getId());

            String propertiesJSONString = courseSummary.getProperties();

            JSONObject propertiesJSONObject = null;

            if (StringUtils.isNotBlank(propertiesJSONString)) {

                propertiesJSONObject = JSONUtils.parseJSONObject(propertiesJSONString);
            }

            Row bodyRow = sheet.createRow(currentRowIdx);
            List<CourseAttribute> attrList = this.learningMapper.selectCourseAttributeListByCourseId(courseSummary.getId(),
                                                                                                     null);

            for (int i = 0; i < columnCount; i++) {

                Cell bodyCell = bodyRow.createCell(i);
                bodyCell.setCellStyle(bodyCellStyle);

                String name = columnNameList.get(i);

                if (name.equals("연번")) {

                    bodyCell.setCellValue((++index));

                } else if (name.equals("양성/보수")) {

                    String content = "보수교육";

                    if (attrList != null) {

                        for (CourseAttribute attr : attrList) {

                            if (attr.getAttributeId() == 16) {

                                content = "양성교육";
                            }
                        }
                    }

                    bodyCell.setCellValue(content);

                } else if (name.equals("구분1")) {

                    String operationCode = courseSummary.getOperationCode();

                    if (StringUtils.isNotBlank(operationCode)) {

                        String[] subString = operationCode.split("-");

                        if (subString.length > 2) {

                            bodyCell.setCellValue(subString[1]);

                        } else {

                            bodyCell.setCellValue("-");
                        }

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("구분2")) {

                    String operationCode = courseSummary.getOperationCode();

                    if (StringUtils.isNotBlank(operationCode)) {

                        String[] subString = operationCode.split("-");

                        if (subString.length > 3) {

                            bodyCell.setCellValue(subString[2]);

                        } else {

                            bodyCell.setCellValue("-");
                        }

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("과목코드")) {

                    bodyCell.setCellValue(courseSummary.getOperationCode());


                } else if (name.equals("주제유형")) {


                    String content = "";

                    if (attrList != null) {

                        for (CourseAttribute attr : attrList) {

                            if (attr.getAttributeCategoryCode()
                                    .equals("주제유형")) {

                                if (StringUtils.isNotBlank(content)) {
                                    content += ",";
                                }

                                content += attr.getAttributeName();

                            }
                        }
                    }

                    if (StringUtils.isNotBlank(content)) {
                        bodyCell.setCellValue(content);
                    } else {
                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("과목명")) {

                    bodyCell.setCellValue(courseSummary.getServiceTitle());

                } else if (name.equals("소속기관 유형")) {

                    String content = "";
                    int cnt = 0;

                    if (attrList != null) {

                        for (CourseAttribute attr : attrList) {

                            String attrName = attr.getAttributeName();
                            long depth = attr.getAttributeDepth();
                            String categoryCode = attr.getAttributeCategoryCode();

                            if (depth == 1 && categoryCode.equals("소속기관")) {

                                if (!attrName.equals("기타")) {

                                    cnt++;
                                }

                                if (StringUtils.isBlank(content)) {

                                    content = attrName;

                                } else {

                                    content += ", " + attrName;
                                }
                            }
                        }
                    }

                    if (StringUtils.isBlank(content)) {

                        bodyCell.setCellValue("-");

                    } else {

                        if (cnt == agTypeCount) {

                            bodyCell.setCellValue("여성 폭력 방지 기관 전체");

                        } else {

                            bodyCell.setCellValue(content);
                        }
                    }

                } else if (name.equals("직위")) {

                    String content = "";
                    int cnt = 0;

                    if (attrList != null) {

                        for (CourseAttribute attr : attrList) {

                            String attrName = attr.getAttributeName();
                            String categoryCode = attr.getAttributeCategoryCode();

                            if (categoryCode.equals("직위")) {

                                cnt++;

                                if (StringUtils.isBlank(content)) {

                                    content = attrName;

                                } else {

                                    content += ", " + attrName;
                                }
                            }
                        }
                    }

                    if (StringUtils.isBlank(content)) {

                        bodyCell.setCellValue("-");

                    } else {

                        if (cnt == positionCount) {

                            bodyCell.setCellValue("직위 전체");

                        } else {

                            bodyCell.setCellValue(content);
                        }
                    }


                } else if (name.equals("경력")) {

                    String content = "";
                    int cnt = 0;

                    if (attrList != null) {

                        for (CourseAttribute attr : attrList) {

                            String attrName = attr.getAttributeName();
                            String categoryCode = attr.getAttributeCategoryCode();

                            if (categoryCode.equals("경력")) {

                                cnt++;

                                if (StringUtils.isBlank(content)) {

                                    content = attrName;

                                } else {

                                    content += ", " + attrName;
                                }
                            }
                        }
                    }

                    if (StringUtils.isBlank(content)) {

                        bodyCell.setCellValue("-");

                    } else {

                        if (cnt == careerCount) {

                            bodyCell.setCellValue("경력 전체");

                        } else {

                            bodyCell.setCellValue(content);
                        }
                    }

                } else if (name.equals("연도")) {

                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");
                    Date startDate = courseSummary.getStartDate();

                    if (startDate != null) {

                        bodyCell.setCellValue(simpleDateFormat.format(startDate));

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("월")) {

                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM");
                    Date startDate = courseSummary.getStartDate();

                    if (startDate != null) {

                        bodyCell.setCellValue(simpleDateFormat.format(startDate));

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("시작일")) {

                    switch (courseSummary.getTermType()) {

                        case DEFAULT: {

                            bodyCell.setCellValue("-");
                            break;
                        }

                        default: {

                            String startDateString = "-";

                            Date startDate = courseSummary.getStartDate();

                            if (startDate != null) {

                                startDateString = DateFormats.format(startDate);
                                startDateString = startDateString.split(" ")[0];
                            }

                            bodyCell.setCellValue(startDateString);
                            break;
                        }
                    }

                } else if (name.equals("종료일")) {

                    switch (courseSummary.getTermType()) {

                        case DEFAULT: {

                            bodyCell.setCellValue("-");
                            break;
                        }

                        default: {

                            String endDateString = "-";

                            Date endDate = courseSummary.getEndDate();

                            if (endDate != null) {

                                endDateString = DateFormats.format(endDate);
                                endDateString = endDateString.split(" ")[0];
                            }

                            bodyCell.setCellValue(endDateString);
                            break;
                        }
                    }

                } else if (name.equals("교육형태")) {

                    Course.LearningMethod learningMethod = courseSummary.getLearningMethod();

                    switch (learningMethod) {

                        case ONLINE: {

                            bodyCell.setCellValue("이러닝");
                            break;
                        }

                        case BLENDED_LEARNING: {

                            bodyCell.setCellValue("블렌디드 러닝");
                            break;
                        }

                        case FLIPPED_LEARNING: {

                            bodyCell.setCellValue("화상");
                            break;
                        }

                        case OFFLINE: {

                            bodyCell.setCellValue("집체");
                            break;
                        }

                        default: {

                            bodyCell.setCellValue("-");
                            break;
                        }
                    }

                } else if (name.equals("장소 지역")) {

                    String courseAdmin = JSONUtils.getChildString(propertiesJSONObject,
                                                                  "district");
                    String exceptionString = "-";

                    if (courseAdmin != null) {

                        bodyCell.setCellValue(courseAdmin);

                    } else {

                        bodyCell.setCellValue(exceptionString);
                    }

                } else if (name.equals("장소 명")) {

                    String courseAdmin = JSONUtils.getChildString(propertiesJSONObject,
                                                                  "venue");
                    String exceptionString = "-";

                    if (courseAdmin != null) {

                        bodyCell.setCellValue(courseAdmin);

                    } else {

                        bodyCell.setCellValue(exceptionString);
                    }

                } else if (name.equals("실제 교육 시간")) {

                    String courseAdmin = JSONUtils.getChildString(propertiesJSONObject,
                                                                  "actual_study_hour_per_day");
                    String exceptionString = "-";

                    if (courseAdmin != null) {
                        bodyCell.setCellValue(courseAdmin);
                    } else {
                        bodyCell.setCellValue(exceptionString);
                    }

                } else if (name.equals("시수")) {

                    Integer studyTimeInHours = courseSummary.getStudyTimeInHours();

                    if (studyTimeInHours != null) {

                        bodyCell.setCellValue(studyTimeInHours);

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("정원(명)")) {

                    String content = "-";

                    String maxStudentCount = JSONUtils.getChildString(propertiesJSONObject,
                                                                      "max_student_count");
                    if (StringUtils.isNotBlank(maxStudentCount)) {

                        bodyCell.setCellValue(maxStudentCount);

                    } else {

                        if (courseSummary.getMaxStudentCount() != null) {
                            bodyCell.setCellValue(courseSummary.getMaxStudentCount()
                                                               .toString());
                        } else {
                            bodyCell.setCellValue(content);
                        }
                    }

                } else if (name.equals("신청인원(명)")) {

                    int enrollmentRequestedStudentCountSum = -1;

                    // 수강 승인 대기 인원 수
                    Integer enrollmentRequestedStudentCount = courseSummary.getEnrollmentRequestedStudentCount();

                    if (enrollmentRequestedStudentCount != null) {

                        if (enrollmentRequestedStudentCountSum < 0) {

                            enrollmentRequestedStudentCountSum = 0;
                        }

                        enrollmentRequestedStudentCountSum += enrollmentRequestedStudentCount;
                    }

                    // 수강 미승인 인원 수
                    Integer enrollmentRejectedStudentCount = courseSummary.getEnrollmentRejectedStudentCount();

                    if (enrollmentRejectedStudentCount != null) {

                        if (enrollmentRequestedStudentCountSum < 0) {

                            enrollmentRequestedStudentCountSum = 0;
                        }

                        enrollmentRequestedStudentCountSum += enrollmentRejectedStudentCount;
                    }

                    // 수강 확정 인원 수
                    Integer enrolledStudentCount = courseSummary.getEnrolledStudentCount();

                    if (enrolledStudentCount != null) {

                        if (enrollmentRequestedStudentCountSum < 0) {

                            enrollmentRequestedStudentCountSum = 0;
                        }

                        enrollmentRequestedStudentCountSum += enrolledStudentCount;
                    }

                    // 수강 취소 인원
                    Integer unenrolledStudentCount = courseSummary.getUnenrolledStudentCount();

                    if (unenrolledStudentCount != null) {

                        if (enrollmentRequestedStudentCountSum < 0) {

                            enrollmentRequestedStudentCountSum = 0;
                        }

                        enrollmentRequestedStudentCountSum += unenrolledStudentCount;
                    }

                    // 자동 수강 취소 인원(탈퇴)
                    Integer autoUnenrolledDueToUserDeleteStudentCount = courseSummary.getAutoUnenrolledDueToUserDeleteStudentCount();

                    if (autoUnenrolledDueToUserDeleteStudentCount != null) {

                        if (enrollmentRequestedStudentCountSum < 0) {

                            enrollmentRequestedStudentCountSum = 0;
                        }

                        enrollmentRequestedStudentCountSum += autoUnenrolledDueToUserDeleteStudentCount;
                    }

                    // 자동 수강 취소 인원(권한변경)
                    Integer autoUnenrolledDueToUserRoleChangeStudentCount = courseSummary.getAutoUnenrolledDueToUserRoleChangeStudentCount();

                    if (autoUnenrolledDueToUserRoleChangeStudentCount != null) {

                        if (enrollmentRequestedStudentCountSum < 0) {

                            enrollmentRequestedStudentCountSum = 0;
                        }

                        enrollmentRequestedStudentCountSum += autoUnenrolledDueToUserRoleChangeStudentCount;
                    }

                    if (enrollmentRequestedStudentCountSum < 0) {

                        bodyCell.setCellValue("-");

                    } else {

                        bodyCell.setCellValue(enrollmentRequestedStudentCountSum);
                    }

                } else if (name.equals("참여(명)")) {

                    Integer enrolledStudentCount = courseSummary.getEnrolledStudentCount();

                    if (enrolledStudentCount != null) {

                        bodyCell.setCellValue(enrolledStudentCount);

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("미선정(명)")) {


                    Integer enrollmentRejectedStudentCount = courseSummary.getEnrollmentRejectedStudentCount();

                    if (enrollmentRejectedStudentCount != null) {

                        bodyCell.setCellValue(enrollmentRejectedStudentCount);

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("취소인원(명)")) {

                    Integer unenrolledStudentCount = courseSummary.getUnenrolledStudentCount();
                    Integer autoUnenrolledDueToUserDeleteStudentCount = courseSummary.getAutoUnenrolledDueToUserDeleteStudentCount();
                    Integer autoUnenrolledDueToUserRoleChangeStudentCount = courseSummary.getAutoUnenrolledDueToUserRoleChangeStudentCount();
                    Integer total = null;

                    if (unenrolledStudentCount != null) {

                        if (total == null) {

                            total = 0;
                        }

                        total += unenrolledStudentCount;
                    }

                    if (autoUnenrolledDueToUserDeleteStudentCount != null) {

                        if (total == null) {

                            total = 0;
                        }

                        total += autoUnenrolledDueToUserDeleteStudentCount;
                    }

                    if (autoUnenrolledDueToUserRoleChangeStudentCount != null) {

                        if (total == null) {

                            total = 0;
                        }

                        total += autoUnenrolledDueToUserRoleChangeStudentCount;
                    }

                    if (total == null) {

                        bodyCell.setCellValue("-");

                    } else {

                        bodyCell.setCellValue(total);
                    }


                } else if (name.equals("수료(명)")) {

                    Integer completedStudentCount = courseSummary.getCompletedStudentCountFromStudentReport();

                    if (completedStudentCount != null) {

                        bodyCell.setCellValue(completedStudentCount);

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("미수료(명)")) {

                    Integer completedStudentCount = courseSummary.getCompletedStudentCountFromStudentReport();
                    Integer enrolledStudentCount = courseSummary.getEnrolledStudentCount();

                    if (completedStudentCount != null && enrolledStudentCount != null) {

                        bodyCell.setCellValue(enrolledStudentCount - completedStudentCount);

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("담딩자")) {

                    String courseAdmin = JSONUtils.getChildString(propertiesJSONObject,
                                                                  "course_admin_for_report");

                    if (courseAdmin != null) {

                        bodyCell.setCellValue(courseAdmin);

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("여")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getFemaleStudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("남")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getMaleStudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("성폭(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType49StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("가폭(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType47StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("통합(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType46StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("성매매(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType48StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("1366(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType50StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("해센(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType52StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("폭력피해이주(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyType51StudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("기타(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyTypeEtcStudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }

                } else if (name.equals("미분류(명)")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getCompanyTypeNullStudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }


                } else if (name.equals("합계")) {

                    if (studentCountDetail != null) {

                        bodyCell.setCellValue(studentCountDetail.getStudentCount());

                    } else {

                        bodyCell.setCellValue("-");
                    }
                }
            }

            currentRowIdx++;
        }

        int[] colLenList = new int[columnCount];
        for (int i = 0; i < currentRowIdx; i++) {

            for (int j = 0; j < columnCount; j++) {

                String value = null;
                try {
                    value = POIUtils.getStringCellValue(sheet,
                                                        i,
                                                        j);
                } catch (Exception e) {
                    System.out.println("Exception Occured");
                }


                if (value != null) {

                    int valueLen = value.length();
                    if (valueLen > 50) {
                        valueLen = 50;
                    }

                    if (colLenList[j] < valueLen) {
                        colLenList[j] = valueLen;
                    }
                }
            }
        }

        for (int i = 0; i < columnCount; i++) {

            sheet.setColumnWidth(i,
                                 10 + colLenList[i] * 600);
        }


        return workbook;
    }

    public Workbook doExportCourseEnrollmentSummaryList(ModelList<CourseEnrollmentSummary> courseEnrollmentSummaryList) throws Exception {


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

        List<CourseEnrollmentSummary> list = courseEnrollmentSummaryList.getList();

        List<String> columnNameList = new ArrayList<>();
        columnNameList.add("연번");
        columnNameList.add("기수구분");

        columnNameList.add("양성/보수");
        columnNameList.add("구분1");
        columnNameList.add("구분2");

        columnNameList.add("과목코드");
        columnNameList.add("과정명");
        columnNameList.add("이름");
        columnNameList.add("연락처");
        columnNameList.add("생년월일");
        columnNameList.add("이메일");
        columnNameList.add("지정성별");

        columnNameList.add("소속기관명");
        columnNameList.add("소속기관 유형(대분류)");
        columnNameList.add("소속기관 유형(소분류)");
        columnNameList.add("소속기관 소재지");
        columnNameList.add("소속기관 주소");
        columnNameList.add("국비지원여부");
        columnNameList.add("소속기관 연락처");
        columnNameList.add("현 기관 총 경력");
        columnNameList.add("여성폭력방지기관 총 경력");

        columnNameList.add("직위");
        columnNameList.add("신청일시");
        columnNameList.add("수료여부");
        columnNameList.add("수료일");
        columnNameList.add("담당자");


        Sheet sheet = workbook.createSheet();
        workbook.setSheetName(0,
                              "교육생 현황");

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
        bodyCellStyle.setAlignment(HorizontalAlignment.LEFT);
        bodyCellStyle.setBorderTop(BorderStyle.THIN);
        bodyCellStyle.setBorderBottom(BorderStyle.THIN);
        bodyCellStyle.setBorderLeft(BorderStyle.THIN);
        bodyCellStyle.setBorderRight(BorderStyle.THIN);

        int index = 0;

        for (CourseEnrollmentSummary courseEnrollmentSummary : list) {

            User user = this.userMapper.selectUserByIdx(courseEnrollmentSummary.getStudentUserIdx());

//            List<CourseAttribute> courseAttributeList = this.learningMapper.selectCourseAttributeListByCourseId(courseEnrollmentSummary.getCourseId(),
//                                                                                                                null);

            long courseId = courseEnrollmentSummary.getCourseId();
            Course course = this.learningMapper.selectCourseById(courseId);
            List<CourseAttribute> courseAttributeList = this.learningMapper.selectCourseAttributeListByCourseId(courseId,
                                                                                                                null);

            String propertiesJSONString = course.getProperties();
            JSONObject propertiesJSONObject = null;
            if (StringUtils.isNotBlank(propertiesJSONString)) {
                propertiesJSONObject = JSONUtils.parseJSONObject(propertiesJSONString);
            }


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

                if (columnName.equals("연번")) {
                    bodyCell.setCellValue((++index));
                } else if (columnName.equals("기수구분")) {

                    String termTypeName = null;

                    switch (courseEnrollmentSummary.getTermType()) {

                        case DEFAULT: {

                            termTypeName = "상시제";
                            break;
                        }

                        default: {

                            termTypeName = courseEnrollmentSummary.getTermYear() + "-" + courseEnrollmentSummary.getTermNumber() + "기";
                            break;
                        }
                    }

                    bodyCell.setCellValue(termTypeName);

                } else if (columnName.equals("양성/보수")) {
                    String content = "-";
//                    List<CourseAttribute> attrList = course.getAttributeList();


                    if (CollectionUtils.isNotNullOrEmpty(courseAttributeList)) {
                        for (CourseAttribute attr : courseAttributeList) {
                            if (attr.getAttributeId() == 16) {
                                content = "양성교육";
                            } else if (attr.getAttributeId() == 17) {
                                content = "보수교육";
                            }
                        }
                    }

                    bodyCell.setCellValue(content);
                } else if (columnName.equals("구분1")) {

                    String operationCode = courseEnrollmentSummary.getCourseOperationCode();
                    String[] operationCodeArray = operationCode.split("-");
//                    if (CollectionUtils.isNotNullOrEmpty(courseAttributeList)) {
//
//                        for (int i2 = 0, l2 = courseAttributeList.size(); i2 < l2; i2++) {
//
//                            CourseAttribute courseAttribute = courseAttributeList.get(i2);
//                            if ("과정분야".equals(courseAttribute.getAttributeCategoryCode())) {
//
//                                if (courseAttribute.getAttributeDepth() == 1) {
//
//                                    if (StringUtils.isNotBlank(content)) {
//                                        content += ", ";
//                                    }
//
//                                    content += courseAttribute.getAttributeName();
//                                }
//                            }
//                        }
//                    }

                    if (operationCodeArray.length > 2) {
                        bodyCell.setCellValue(operationCodeArray[1]);
                    } else {
                        bodyCell.setCellValue("-");
                    }


                } else if (columnName.equals("구분2")) {

                    String operationCode = courseEnrollmentSummary.getCourseOperationCode();
                    String[] operationCodeArray = operationCode.split("-");

//                    if (CollectionUtils.isNotNullOrEmpty(courseAttributeList)) {
//
//                        for (int i2 = 0, l2 = courseAttributeList.size(); i2 < l2; i2++) {
//
//                            CourseAttribute courseAttribute = courseAttributeList.get(i2);
//                            if ("과정분야".equals(courseAttribute.getAttributeCategoryCode())) {
//
//                                if (courseAttribute.getAttributeDepth() == 2) {
//
//                                    if (StringUtils.isNotBlank(content)) {
//                                        content += ", ";
//                                    }
//
//                                    content += courseAttribute.getAttributeName();
//                                }
//                            }
//                        }
//                    }
                    if (operationCodeArray.length > 2) {
                        bodyCell.setCellValue(operationCodeArray[2]);
                    } else {
                        bodyCell.setCellValue("-");
                    }


                } else if (columnName.equals("과목코드")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getCourseOperationCode());

                } else if (columnName.equals("과정명")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getCourseServiceTitle());

                } else if (columnName.equals("이름")) {

                    bodyCell.setCellValue(courseEnrollmentSummary.getStudentUserName());

                } else if (columnName.equals("연락처")) {

                    String studentUserMobilePhoneNumber = courseEnrollmentSummary
                            .getStudentUserMobilePhoneNumber();

                    if (StringUtils.isNotEmpty(studentUserMobilePhoneNumber)) {
                        bodyCell.setCellValue(studentUserMobilePhoneNumber);
                    }


                } else if (columnName.equals("생년월일")) {

                    Date studentUserDateOfBirth = courseEnrollmentSummary.getStudentUserDateOfBirth();

                    if (studentUserDateOfBirth != null) {
                        String dateOfBirthString = DateFormats.format(studentUserDateOfBirth);
                        dateOfBirthString = dateOfBirthString.split(" ")[0];
                        bodyCell.setCellValue(dateOfBirthString);
                    }


                } else if (columnName.equals("이메일")) {


                    String studentUserEmail = courseEnrollmentSummary.getStudentUserEmail();

                    if (StringUtils.isNotEmpty(studentUserEmail)) {
                        bodyCell.setCellValue(studentUserEmail);
                    }

                } else if (columnName.equals("지정성별")) {

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

                } else if (columnName.equals("소속기관명")) {

                    bodyCell.setCellValue(companyName);

                } else if (columnName.equals("소속기관 유형(대분류)")) {

                    String agTypeDp = propertyMap.get("agTypeDp");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
                        if (attribute != null) {
                            bodyCell.setCellValue(attribute.getName());
                        }
                    }

                } else if (columnName.equals("소속기관 유형(소분류)")) {

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

                } else if (columnName.equals("소속기관 소재지")) {

                    String studentUserAddress1 = courseEnrollmentSummary.getStudentUserAddress1();
                    if (StringUtils.isNotEmpty(studentUserAddress1)) {

                        String[] studentUserAddress1Split = studentUserAddress1.trim()
                                                                               .split(" ");
                        if (studentUserAddress1Split.length > 1) {
                            bodyCell.setCellValue(studentUserAddress1Split[0]);
                        }
                    }

                } else if (columnName.equals("소속기관 주소")) {

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

                    if (StringUtils.isNotEmpty(studentUserAddress)) {
                        bodyCell.setCellValue(studentUserAddress);
                    }

                } else if (columnName.equals("국비지원여부")) {

                    String support = propertyMap.get("support");
                    if (StringUtils.isNotBlank(support)) {

                        if (support.equals("false")) {
                            bodyCell.setCellValue("미지원");
                        } else {
                            bodyCell.setCellValue("지원");
                        }
                    }

                } else if (columnName.equals("소속기관 연락처")) {

                    bodyCell.setCellValue(officePhoneNumber);


                } else if (columnName.equals("현 기관 총 경력")) {

                    String agTypeDp = propertyMap.get("career_present");
                    if (StringUtils.isNotBlank(agTypeDp)) {
                        Attribute attribute = attributeMap.get(Long.parseLong(agTypeDp));
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


                } else if (columnName.equals("직위")) {

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

                } else if (columnName.equals("신청일시")) {

                    Date registeredDate = courseEnrollmentSummary.getRegisteredDate();
                    bodyCell.setCellValue(DateFormats.format(registeredDate));

                } else if (columnName.equals("수료여부")) {

                    int isCompleted = courseEnrollmentSummary.getIsCompleted();
                    if (isCompleted == 0) {
                        bodyCell.setCellValue("미수료");
                    } else {
                        bodyCell.setCellValue("수료");
                    }

                } else if (columnName.equals("수료일")) {

                    Date date = courseEnrollmentSummary.getCompletionDate();
                    if (date != null) {
                        bodyCell.setCellValue(DateFormats.format(date));
                    }

                } else if (columnName.equals("담당자")) {

                    String courseAdmin = JSONUtils.getChildString(propertiesJSONObject,
                                                                  "course_admin_for_report");

                    if (courseAdmin != null) {
                        bodyCell.setCellValue(courseAdmin);
                    }
                }
            }

            currentRowIdx++;
        }

        int[] colLenList = new int[columnCount];
        for (int i = 0; i < currentRowIdx; i++) {

            for (int j = 0; j < columnCount; j++) {

                String value = null;
                try {
                    value = POIUtils.getStringCellValue(sheet,
                                                        i,
                                                        j);
                } catch (Exception e) {
                    System.out.println("Exception Occured");
                }

                if (value != null) {

                    int valueLen = value.length();
                    if (valueLen > 50) {
                        valueLen = 50;
                    }

                    if (colLenList[j] < valueLen) {
                        colLenList[j] = valueLen;
                    }


                }
            }
        }

        for (int i = 0; i < columnCount; i++) {

            sheet.setColumnWidth(i,
                                 10 + colLenList[i] * 600);
        }

        return workbook;
    }
}




