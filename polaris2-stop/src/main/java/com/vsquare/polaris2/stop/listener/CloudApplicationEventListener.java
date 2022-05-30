package com.vsquare.polaris2.stop.listener;

import com.vsquare.polaris2.core.context.impl.DefaultApplicationEventListener;
import org.springframework.stereotype.Component;

@Component
public class CloudApplicationEventListener extends DefaultApplicationEventListener {

//    @Override
//    public void onContextRefreshedEvent(ContextRefreshedEvent event) throws Exception {
//        super.onContextRefreshedEvent(event);
//
//        List<SimpleInstitution> simpleInstitutionList = super.institutionMapper.selectSimpleInstitutionList(null,
//                                                                                                            null,
//                                                                                                            null,
//                                                                                                            null);
//
//        for (SimpleInstitution simpleInstitution : simpleInstitutionList) {
//
//            try {
//
//                String code = simpleInstitution.getCode();
//
//                super.institutionMapper.createStudentAttendanceTable(code);
//                super.institutionMapper.createStudentAttendanceTableIndex1(code);
//                super.institutionMapper.createStudentAttendanceTableIndex2(code);
//                super.institutionMapper.createStudentAttendanceTableIndex3(code);
//                super.institutionMapper.createStudentAttendanceTableIndex4(code);
//                super.institutionMapper.createStudentAttendanceTableIndex5(code);
//                super.institutionMapper.createStudentAttendanceTableIndex6(code);
//                super.institutionMapper.createStudentAttendanceTableIndex7(code);
//
//                super.institutionMapper.createStudentAttendanceItemTable(code);
//                super.institutionMapper.createStudentAttendanceItemTableIndex1(code);
//                super.institutionMapper.createStudentAttendanceItemTableIndex2(code);
//                super.institutionMapper.createStudentAttendanceItemTableIndex3(code);
//                super.institutionMapper.createStudentAttendanceItemTableIndex4(code);
//                super.institutionMapper.createStudentAttendanceItemTableIndex5(code);
//
//                super.institutionMapper.createStudentAttendanceLogTable(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex1(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex2(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex3(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex4(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex5(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex6(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex7(code);
//                super.institutionMapper.createStudentAttendanceLogTableIndex8(code);
//
//                super.institutionMapper.createStudentWorkSaveLogTable(code);
//                super.institutionMapper.createStudentWorkSaveLogTableIndex1(code);
//
//                super.institutionMapper.createStudentWorkUserInputTable(code);
//                super.institutionMapper.createStudentWorkUserInputTableIndex1(code);
//                super.institutionMapper.createStudentWorkUserInputTableIndex2(code);
//
//            } catch (Exception e) {
//
//                // Intentionally ignored.
//                e.printStackTrace();
//            }
//        }
//    }
}
