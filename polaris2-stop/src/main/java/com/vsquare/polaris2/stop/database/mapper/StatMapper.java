package com.vsquare.polaris2.stop.database.mapper;

import com.vsquare.polaris2.core.model.SearchOption;
import com.vsquare.polaris2.core.model.learning.CourseEnrollment;
import com.vsquare.polaris2.core.model.learning.CourseEnrollmentSummary;
import com.vsquare.polaris2.core.model.learning.Term;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserPropertiesWrapper;
import com.vsquare.polaris2.stop.model.stat.StudentCountDetail;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface StatMapper {

    long selectCourseEnrollmentCount(
            @Param("history_year") Integer historyYear,
            @Param("select_mode") CourseEnrollment.SelectMode selectMode,
                                     @Param("select_mode_user_idx") Long selectModeUserIdx,
                                     @Param("is_term_operating_organization_admin") int isTermOperatingOrganizationAdmin,
                                     @Param("student_organization_id") Long studentOrganizationId,
                                     @Param("course_category_id_list") List<Long> courseCategoryIdList,
                                     @Param("curriculum_institution_id") String curriculumInstitutionId,
                                     @Param("curriculum_id") Long curriculumId,
                                     @Param("institution_id") Long institutionId,
                                     @Param("organization_id") Long organizationId,
                                     @Param("term_type_code") Term.Type termType,
                                     @Param("term_year") Integer termYear,
                                     @Param("term_id") Long termId,
                                     @Param("course_id") Long courseId,
                                     @Param("course_year") Integer courseYear,
                                     @Param("course_exclude_from_statistics") Integer courseExcludeFromStatistics,
                                     @Param("student_user_idx") Long studentUserIdx,
                                     @Param("student_type_code") User.StudentType studentType,
                                     @Param("department_id") Long departmentId,
                                     @Param("status_code") CourseEnrollment.Status status,
                                     @Param("is_prepared") Integer isPrepared,
                                     @Param("is_course_student_group_member") Integer isCourseStudentGroupMember,
                                     @Param("is_completed") Integer isCompleted,
                                     @Param("unenroll_request_status_code") CourseEnrollment.UnenrollRequestStatus unenrollRequestStatus,
                                     @Param("study_material_delivery_status_code_list") List<CourseEnrollment.StudyMaterialDeliveryStatus> studyMaterialDeliveryStatusList,
                                     @Param("academic_advisor_assigned") Integer academicAdvisorAssignedInteger,
                                     @Param("academic_advisor_user_idx_list") List<Long> academicAdvisorUserIdx,
                                     @Param("course_task_id") Long courseTaskId,
                                     @Param("search_option_list") List<SearchOption> searchOptionList) throws Exception;

    List<CourseEnrollmentSummary> selectCourseEnrollmentSummaryList(
            @Param("history_year") Integer historyYear,
            @Param("select_mode") CourseEnrollment.SelectMode selectMode,
                                                                    @Param("select_mode_user_idx") Long selectModeUserIdx,
                                                                    @Param("is_term_operating_organization_admin") int isTermOperatingOrganizationAdmin,
                                                                    @Param("student_organization_id") Long studentOrganizationId,
                                                                    @Param("course_category_id_list") List<Long> courseCategoryIdList,
                                                                    @Param("curriculum_institution_id") String curriculumInstitutionId,
                                                                    @Param("curriculum_id") Long curriculumId,
                                                                    @Param("institution_id") Long institutionId,
                                                                    @Param("organization_id") Long organizationId,
                                                                    @Param("term_type_code") Term.Type termType,
                                                                    @Param("term_year") Integer termYear,
                                                                    @Param("term_id") Long termId,
                                                                    @Param("course_id") Long courseId,
            @Param("course_year") Integer courseYear,
                                                                    @Param("course_exclude_from_statistics") Integer courseExcludeFromStatistics,
                                                                    @Param("include_course_properties") int includeCourseProperties,
                                                                    @Param("student_user_idx") Long studentUserIdx,
                                                                    @Param("student_type_code") User.StudentType studentType,
                                                                    @Param("department_id") Long departmentId,
                                                                    @Param("status_code") CourseEnrollment.Status status,
                                                                    @Param("is_prepared") Integer isPrepared,
                                                                    @Param("is_course_student_group_member") Integer isCourseStudentGroupMember,
                                                                    @Param("is_completed") Integer isCompleted,
                                                                    @Param("unenroll_request_status_code") CourseEnrollment.UnenrollRequestStatus unenrollRequestStatus,
                                                                    @Param("study_material_delivery_status_code_list") List<CourseEnrollment.StudyMaterialDeliveryStatus> studyMaterialDeliveryStatusList,
                                                                    @Param("academic_advisor_assigned") Integer academicAdvisorAssignedInteger,
                                                                    @Param("academic_advisor_user_idx_list") List<Long> academicAdvisorUserIdx,
                                                                    @Param("course_task_id") Long courseTaskId,
                                                                    @Param("search_option_list") List<SearchOption> searchOptionList,
                                                                    @Param("order_by") CourseEnrollment.OrderBy orderBy,
                                                                    @Param("page") Integer page,
                                                                    @Param("count") Integer count) throws Exception;

    List<UserPropertiesWrapper> selectUserPropertiesWrapperListByUserIdxList(
            @Param("history_year") Integer historyYear,
            @Param("user_idx_list") List<Long> userIdxList) throws Exception;

    List<Map<String, Object>> selectCourseDetailCounts(@Param("history_year") int historyYear, @Param("course_id_list") List<Long> courseIdList) throws Exception;
}
