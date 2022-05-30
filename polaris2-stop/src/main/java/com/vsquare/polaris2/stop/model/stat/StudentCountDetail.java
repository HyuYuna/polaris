package com.vsquare.polaris2.stop.model.stat;

import com.vsquare.polaris2.core.model.BaseModel;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;

public class StudentCountDetail extends BaseModel {

    private long courseId;
    private int studentCount;
    private int maleStudentCount;
    private int femaleStudentCount;
    private int companyType46StudentCount;
    private int companyType47StudentCount;
    private int companyType48StudentCount;
    private int companyType49StudentCount;
    private int companyType50StudentCount;
    private int companyType51StudentCount;
    private int companyType52StudentCount;
    private int companyTypeEtcStudentCount;
    private int companyTypeNullStudentCount;

    public long getCourseId() {
        return this.courseId;
    }

    public void setCourseId(long courseId) {
        this.courseId = courseId;
    }

    public int getStudentCount() {
        return this.studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public int getMaleStudentCount() {
        return this.maleStudentCount;
    }

    public void setMaleStudentCount(int maleStudentCount) {
        this.maleStudentCount = maleStudentCount;
    }

    public int getFemaleStudentCount() {
        return this.femaleStudentCount;
    }

    public void setFemaleStudentCount(int femaleStudentCount) {
        this.femaleStudentCount = femaleStudentCount;
    }

    public int getCompanyType46StudentCount() {
        return this.companyType46StudentCount;
    }

    public void setCompanyType46StudentCount(int companyType46StudentCount) {
        this.companyType46StudentCount = companyType46StudentCount;
    }

    public int getCompanyType47StudentCount() {
        return this.companyType47StudentCount;
    }

    public void setCompanyType47StudentCount(int companyType47StudentCount) {
        this.companyType47StudentCount = companyType47StudentCount;
    }

    public int getCompanyType48StudentCount() {
        return this.companyType48StudentCount;
    }

    public void setCompanyType48StudentCount(int companyType48StudentCount) {
        this.companyType48StudentCount = companyType48StudentCount;
    }

    public int getCompanyType49StudentCount() {
        return this.companyType49StudentCount;
    }

    public void setCompanyType49StudentCount(int companyType49StudentCount) {
        this.companyType49StudentCount = companyType49StudentCount;
    }

    public int getCompanyType50StudentCount() {
        return this.companyType50StudentCount;
    }

    public void setCompanyType50StudentCount(int companyType50StudentCount) {
        this.companyType50StudentCount = companyType50StudentCount;
    }

    public int getCompanyType51StudentCount() {
        return this.companyType51StudentCount;
    }

    public void setCompanyType51StudentCount(int companyType51StudentCount) {
        this.companyType51StudentCount = companyType51StudentCount;
    }

    public int getCompanyType52StudentCount() {
        return this.companyType52StudentCount;
    }

    public void setCompanyType52StudentCount(int companyType52StudentCount) {
        this.companyType52StudentCount = companyType52StudentCount;
    }

    public int getCompanyTypeEtcStudentCount() {
        return this.companyTypeEtcStudentCount;
    }

    public void setCompanyTypeEtcStudentCount(int companyTypeEtcStudentCount) {
        this.companyTypeEtcStudentCount = companyTypeEtcStudentCount;
    }

    public int getCompanyTypeNullStudentCount() {
        return this.companyTypeNullStudentCount;
    }

    public void setCompanyTypeNullStudentCount(int companyTypeNullStudentCount) {
        this.companyTypeNullStudentCount = companyTypeNullStudentCount;
    }

    @Override
    public JSONAware toJsonAware() {

        JSONObject jsonObject = new JSONObject();

        jsonObject.put("course_id",
                       this.courseId);
        jsonObject.put("male_student_count",
                       this.maleStudentCount);
        jsonObject.put("female_student_count",
                       this.femaleStudentCount);

        jsonObject.put("company_type_46_student_count",
                       this.companyType46StudentCount);
        jsonObject.put("company_type_47_student_count",
                       this.companyType47StudentCount);
        jsonObject.put("company_type_48_student_count",
                       this.companyType48StudentCount);
        jsonObject.put("company_type_49_student_count",
                       this.companyType49StudentCount);
        jsonObject.put("company_type_50_student_count",
                       this.companyType50StudentCount);
        jsonObject.put("company_type_51_student_count",
                       this.companyType51StudentCount);
        jsonObject.put("company_type_52_student_count",
                       this.companyType52StudentCount);
        jsonObject.put("company_type_etc_student_count",
                       this.companyTypeEtcStudentCount);
        jsonObject.put("company_type_null_student_count",
                       this.companyTypeNullStudentCount);

        return jsonObject;
    }
}
