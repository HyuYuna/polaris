package com.vsquare.polaris2.stop.handler;

import com.vsquare.commons.network.http.HttpUrlParams;
import com.vsquare.commons.tool.Booleans;
import com.vsquare.commons.tool.DateFormats;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.model.BaseModel;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.NameValuePair;
import com.vsquare.polaris2.core.model.common.Attribute;
import com.vsquare.polaris2.core.model.learning.CourseEnrollment;
import com.vsquare.polaris2.core.model.learning.CourseEnrollmentSummary;
import com.vsquare.polaris2.core.model.learning.CourseSummary;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserProperties;
import com.vsquare.polaris2.core.service.learning.impl.AbstractLearningServiceHandler;
import com.vsquare.polaris2.core.tool.ParameterUtils;
import com.vsquare.polaris2.stop.database.mapper.StatMapper;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Component
public class StopLearningServiceHandler extends AbstractLearningServiceHandler {

    @Autowired
    StatMapper statMapper;

    @Override
    public void afterGetCourseSummaryList(Session session,
                                          Map<String, String[]> parameterMap,
                                          ModelList<CourseSummary> modelList) throws Exception {

        List<CourseSummary> courseSummaryList = modelList.getList();

        String historyYearString = ParameterUtils.getParameter(parameterMap, "historyYear");
        if ( StringUtils.isNotBlank(historyYearString) ) {

            int historyYear = Integer.parseInt(historyYearString);
            List<Long> courseIdList = new ArrayList<>();

            for ( CourseSummary courseSummary : courseSummaryList ) {
                courseIdList.add(courseSummary.getId());
            }

            List<Map<String, Object>> countMapList =  this.statMapper.selectCourseDetailCounts(historyYear, courseIdList);

            Map<Long, Map<String, Object>> countMap = new HashMap<>();

            for ( Map<String, Object> map : countMapList ) {

                long courseId = Long.parseLong(map.get("COURSE_ID").toString());
                countMap.put(courseId, map);
            }

            for ( CourseSummary courseSummary : courseSummaryList ) {

                Map<String, Object> map = countMap.get(courseSummary.getId());

                int studentCount = 0;
                Object studentCountObject = map.get("STUDENT_COUNT");
                if ( studentCountObject != null ) {
                    studentCount = Integer.parseInt(studentCountObject.toString());
                }
                courseSummary.setStudentCount(studentCount);

                int completedStudentCount = 0;
                Object completedStudentCountObject = map.get("COMPLETED_STUDENT_COUNT");
                if ( completedStudentCountObject != null ) {
                    completedStudentCount = Integer.parseInt(completedStudentCountObject.toString());
                }
                courseSummary.setMaxStudentCount(completedStudentCount);
            }
        }
    }
}

