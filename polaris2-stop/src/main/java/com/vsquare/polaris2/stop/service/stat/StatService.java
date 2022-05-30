package com.vsquare.polaris2.stop.service.stat;

import com.vsquare.polaris2.core.model.MapModel;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.SearchOption;
import com.vsquare.polaris2.core.model.learning.*;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.task.AsyncTask;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface StatService {
    AsyncTask exportCourseEnrollmentSummaryListForHistory(Session session,
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
                                                          Integer count) throws Exception;

    AsyncTask exportCourseSummaryList(Session session,
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
                                      Integer count) throws Exception;

    MapModel getStatistics(Session session,
                           Integer courseYear,
                           Integer historyYear,
                           Integer termTypeCode,
                           Integer isCompleted,
                           Date startDate,
                           Date endDate) throws Exception;

    AsyncTask exportStatistics(Session session,
                               ServiceProvider serviceProvider,
                               Integer courseYear,
                               Integer historyYear,
                               Integer termTypeCode,
                               Integer isCompleted,
                               Date startDate,
                               Date endDate) throws Exception;

    ModelList<CourseEnrollmentSummary> getCourseEnrollmentSummaryListForHistory(Session session,
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
                                                                                Integer count) throws Exception;
}