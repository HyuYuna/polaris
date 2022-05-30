package com.vsquare.polaris2.stop.database.mapper;

import com.vsquare.polaris2.stop.model.stat.StudentCountDetail;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface ProjectMapper {

    int selectUserByDI(@Param("di") String di) throws Exception;

    List<StudentCountDetail> selectStudentCountDetailListByCourseIdList(@Param("course_id_list") List<Long> courseIdList) throws Exception;

    List<Map<String, Object>> selectStatisticsList1(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList2(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList3(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList4(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList5(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList6(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList7(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList8(@Param("table_postfix") String tablePostfix,
                                                    @Param("course_year") Integer courseYear,
                                                    @Param("history_year") Integer historyYear,
                                                    @Param("type_code") Integer termTypeCode,
                                                    @Param("is_completed") Integer isCompleted,
                                                    @Param("start_date") Date startDate,
                                                    @Param("end_date") Date endDate) throws Exception;

    List<Map<String, Object>> selectStatisticsList9(
            @Param("table_postfix") String tablePostfix,
            @Param("course_year") Integer courseYear,
            @Param("history_year") Integer historyYear,
            @Param("type_code") Integer termTypeCode,
            @Param("is_completed") Integer isCompleted,
            @Param("start_date") Date startDate,
            @Param("end_date") Date endDate) throws Exception;
}
