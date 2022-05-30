ProjectSettings.TITLE = 'VSQUARE';
ProjectSettings.COPYRIGHT = "Copyright © 2020 VSQUARE Inc. ALL RIGHTS RESERVED.";

ProjectSettings.DEFAULT_EDIT_PROFILE_URL = '/?m1=%2Fuser%2Fcheck_pw';

ProjectSettings.CourseEnrollment.excelOrderByCode = CourseEnrollmentOrderBy.REGISTERED_DATE_ASC;
ProjectSettings.CourseEnrollment.listOrderByCode = CourseEnrollmentOrderBy.REGISTERED_DATE_ASC;

ProjectSettings.CourseEnrollment.onHeaderStudentInProgressList = function (table) {

    table.appendHeaderColumn({
        addClass: 'triton_mobile_hide',
        content: '교육참가예정안내', css: {'width': '120px'}
    });
};
ProjectSettings.CourseEnrollment.onStudentInProgressList = function (table, summaryItem) {

    if (summaryItem['course_enrollment_status_code'] == CourseEnrollmentStatus.ENROLLED && summaryItem['status_code'] <= CourseStatus.PENDING) {

        table.appendColumn({
            addClass: 'triton_mobile_hide',
            content: new Triton.FlatButton({
                theme: Triton.FlatButton.Theme.ListInquiry,
                content: '발급',
                item: summaryItem,
                onClick: function (e) {

                    e.preventDefault();
                    e.stopPropagation();

                    var item = e.data.item;
                    var title = Lia.p(item, 'title');

                    Lia.open(ProjectApiUrl.Stop.generateConfirmCertificate, {
                        courseId: summaryItem['id'],
                        destFilename: '교육참가예정서.pdf'
                    });
                }
            })
        });

    } else {

        table.appendColumn({
            addClass: 'triton_mobile_hide',
            content: '-'
        });
    }

};


ProjectSettings.CourseEnrollment.onPrepareEnrollmentSummaryList = function (statusCode, prepareData) {

    Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {

        var list = Lia.p(data, 'body', 'list');

        prepareData.attributeList = list;
        prepareData.attributeMap = Lia.convertListToMap(list, 'id');

    })


};

ProjectSettings.CourseEnrollment.onHeaderEnrollmentSummaryList = function (table, statusCode, prepareData) {

    table.appendHeaderColumn({
        content: '기관유형소분류', css: {'width': '200px'}
    });

    table.appendHeaderColumn({
        content: '총 경력', css: {'width': '120px'}
    });

    table.appendHeaderColumn({content: '수강조건확인', css: {'width': '120px'}});

    if ( statusCode  == CourseEnrollmentStatus.ENROLLED ) {
        table.appendHeaderColumn({content: '선정표시', css: {'width': '100px'}});
    }

    table.appendHeaderColumn({content: '재직증명서 확인여부', css: {'width': '80px'}});
    table.appendHeaderColumn({content: '신청일', css: {'width': '80px'}});
};

ProjectSettings.CourseEnrollment.onEnrollmentSummaryList = function (table, statusCode, summaryItem, prepareData) {

    var propertyMap = Lia.convertListToMap(Lia.p(summaryItem, 'student_user_properties'), 'name');

    table.appendColumn({
        content: Lia.pcd('-', prepareData.attributeMap, Lia.pcd(Lia.p(propertyMap, 'agTypeDp', 'value'), propertyMap, 'agTypeDp2', 'value'), 'name')
    });

    table.appendColumn({
        content: Lia.pcd('-', prepareData.attributeMap, Lia.p(propertyMap, 'career', 'value'), 'name')
    });


    var row = table.getCurrentRow();
    table.appendColumn({
        content: new Triton.FlatButton({
            theme: Triton.FlatButton.Theme.ListInquiry,
            content: '확인',
            item: summaryItem,
            onClick: function (e) {

                e.stopPropagation();

                var item = e.data.item;
                AjaxPopupManager.show(ProjectPopupUrl.COURSE_ENROLLMENT_CHECK_POPUP, {
                    item: item,
                    row: row
                })

            }
        })
    });

    if ( statusCode  == CourseEnrollmentStatus.ENROLLED ) {

        var courseId = summaryItem['course_id'];
        var studentUserIdx = summaryItem['student_user_idx'];

        table.appendColumn({content: new Triton.CheckBox({
                summaryItem : summaryItem,
                status : Lia.pd(0, summaryItem,'properties', 'enrolled_check'),
                onChecked : function( val ) {


                    Requester.awb(ApiUrl.Learning.SET_COURSE_ENROLLMENT_PROPERTIES, {
                        courseId : courseId,
                        studentUserIdx : studentUserIdx,
                        properties : JSON.stringify({ 'enrolled_check' : val })
                    }, function (status ) {

                        if ( !status ) {
                            PageManager.pageExecuteChange();
                            return;
                        }

                    });

                }
        }), css: {'width': '120px'}});
    }

    var companyDocApprove = Lia.pcd('-', Lia.p(propertyMap, 'company_attachment_document_file_checked', 'value'));

    if (companyDocApprove == '-') {
        companyDocApprove = '미제출'
    } else if (companyDocApprove == 1) {
        companyDocApprove = '승인완료'
    } else if (companyDocApprove == 0) {
        companyDocApprove = '미승인'
    }

    table.appendColumn({content: companyDocApprove})
    table.appendColumn({content: Lia.p(summaryItem, 'registered_date')});


};

ProjectSettings.User.onHeaderSummaryList = function (table) {
    table.appendHeaderColumn({content: '재직증명서', css: {'width': '120px'}});
};
ProjectSettings.User.onSummaryList = function (table, summaryItem) {

    var properties = Lia.p(summaryItem, 'properties');
    var propertiesMap = Lia.convertListToMap(properties, 'name');

    var documentFile = Lia.p(Lia.convertStrToObj(Lia.pcd('[]', propertiesMap, 'company_attachment_document_file', 'value')), 0);

    if (documentFile != undefined) {

        table.appendColumn({
            content: new Triton.FlatButton({
                theme: Triton.FlatButton.Theme.ListNormal,
                content: '재직증명서',
                documentFile: documentFile,
                onClick: function (e) {

                    e.stopPropagation();

                    var documentFile = e.data.documentFile;
                    Lia.open(PathHelper.getAttachmentUrl(documentFile));
                }
            })
        });

    } else {

        table.appendColumn({content: '-'});
    }

};

ProjectSettings.CourseEnrollment.checkEnteringCourse = function (course) {

    var termTypeCode = Lia.p(course,'term_type_code');
    var enrolledCheck = Lia.pcd(0, course, 'course_enrollment_properties','enrolled_check');

    if ( termTypeCode == TermType.DEFAULT ) {
        enrolledCheck = 1;
    }

    if ( enrolledCheck != 1 ) {

        PopupManager.am('선정 이후에 학습 하실 수 있습니다.');
        return false;
    }

    return true;
};



BannerType.setMap(
    Configs.getConfig(Configs.BANNER_TYPE_MAP)
);

CourseLearningMethod.setCodeMap({
    1: '이러닝',
    2 : '블렌디드 러닝',
    3 : '화상',
    4 : '집체'
});


DocumentType.setCodeMap({
    1 : '일반 과목 수료증',
    3 : '과목 교육확인서'
});

TermType.createOptionList = function (addDefault, addDefaultName, addDefaultValue, excludeDefaultTerm ) {

    var optionList = [];

    if (Configs.containsServiceProviderType(ServiceProviderType.UNIVERSITY)) {

        if (addDefault) {

            if (addDefaultName == undefined) {
                addDefaultName = Strings.getString(Strings.TERM_TYPE_REGULAR) + '+' + Strings.getString(Strings.TERM_TYPE_CHILD);
            }

            if (addDefaultValue == undefined) {
                addDefaultValue = '';
            }

            optionList.push({name: addDefaultName, value: addDefaultValue});
        }

        optionList.push({name: Strings.getString(Strings.TERM_TYPE_REGULAR), value: TermType.REGULAR});
        optionList.push({name: Strings.getString(Strings.TERM_TYPE_CHILD), value: TermType.CHILD});

    } else {

        if (addDefault) {

            if (addDefaultName == undefined) {
                addDefaultName = Strings.getString(Strings.TERM_TYPE_REGULAR) + '+' + Strings.getString(Strings.TERM_TYPE_DEFAULT);
            }

            if (addDefaultValue == undefined) {
                addDefaultValue = '';
            }

            optionList.push({name: addDefaultName, value: addDefaultValue});
        }

        optionList.push({name: Strings.getString(Strings.TERM_TYPE_REGULAR), value: TermType.REGULAR});

        if (UserManager.getUserRoleCode() != UserRole.ORGANIZATION_ADMIN) {

            if ( excludeDefaultTerm != true ) {
                optionList.push({name: Strings.getString(Strings.TERM_TYPE_DEFAULT), value: TermType.DEFAULT});
            }
        }
    }

    return optionList;
};

ProjectSettings.CMSLoginButton = ProjectSettings.RedCMSLoginButton;

ProjectSettings.CMSFixedTabList = [
    {
        text: '대시보드',
        parameterMap: {m1: 'home'},
        path: 'home'
    }
];

ProjectSettings.StudyExitButton = {
    onClick: function () {
        PageManager.redirect(PageUrl.LMS, ['my_courses']);
    }
};


ProjectSettings.Logo = {
    logoImageUrl: '/res/lms/img/index/common/img_header_logo.png',
    logoImageHeight: '45px',
    mobileLogoImageHeight: '25px'
};

ProjectSettings.CountOptionList = OptionListHelper.createCountOptionList();
ProjectSettings.TabStorageKey = 'VSQUARE_CMS';

ProjectSettings.DEFAULT_TERM_ORDER_BY = TermOrderBy.YEAR_DESC_NUMBER_DESC;
ProjectSettings.DeletedStatusOptionList = [
    {name: '사용중', value: 0, selected: true},
    {name: '휴지통', value: 1}
];


ProjectSettings.ServiceProviderCustomProperties = [];

ProjectSettings.CourseCodeCustomProperties = [];

ProjectSettings.CourseContentCustomProperties = [];

ProjectSettings.CourseCustomProperties = [
    // {
    //     name: '담당자',
    //     key: 'course_admin',
    //     input: true
    // },
];


ProjectSettings.UserCustomProperties = [
    //현재 주소 = 기관주소
    //직위, 기관명 , 기관연락처 초기화됨
    {name: '재직증명서', key: 'company_attachment_document_file', file: true},
    {name: '재직증명서 업로드 시간', key: 'company_attachment_document_update_date', datePicker: true},
    {name: '재직증명서 확인여부', key: 'company_attachment_document_file_checked', checkBox: true},

    {
        func: true,

        detail: function (detailTable, propertyMap, body, options) {

            //get attributeList -> properties  와 대조 및 문자열 추출 -> row 생성 -> 뿌림
            var attrMap = {}
            var agType1String = null

            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '기관유형 대분류', css: {}
            });

            var agType1ValueCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });

            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '기관유형 소분류', css: {}
            });

            var agType2ValueCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });


            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '기관', css: {}
            });

            var companyNameCol = detailTable.appendValueColumn({
                content: Lia.pcd('-', body, 'company_name'),
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });


            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '기관 전화번호', css: {}
            });

            detailTable.appendValueColumn({
                content: Lia.pcd('-', body, 'office_phone_number'),
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });


            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '직급', css: {}
            });
            var companyPositionCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });


            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '여성폭력방지기관 총 경력', css: {}
            });

            var careerValueCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });

            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '현 재직 기관 경력', css: {}
            });

            var careerPresentValueCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });

            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '국비(지방비) 지원 여부', css: {}
            });


            var supportValueCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });

            detailTable.appendRow({addClass: ''});
            detailTable.appendKeyColumn({
                content: '자격증 목록', css: {}
            });

            var certListValueCol = detailTable.appendValueColumn({
                attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
            });

            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {

                var list = Lia.p(data, 'body', 'list');

                for (var i in list) {
                    var attrItem = Lia.p(list, i)
                    attrMap[Lia.p(attrItem, 'id')] = Lia.p(attrItem, 'name')
                }

                var companyPosition = Lia.p(body, 'company_position');
                if (companyPosition == CompanyPosition.ETC) {
                    companyPositionCol.setContent(propertyMap['positionText']);
                } else {
                    companyPositionCol.setContent(Lia.pcd('-', attrMap, companyPosition));
                }

                agType1ValueCol.setContent(Lia.pcd('-', attrMap, Lia.p(propertyMap, 'agTypeDp')));
                agType2ValueCol.setContent(Lia.pcd('-', attrMap, Lia.p(propertyMap, 'agTypeDp2')));
                careerValueCol.setContent(Lia.pcd('-', attrMap, Lia.p(propertyMap, 'career')))
                careerPresentValueCol.setContent(Lia.pcd('-', attrMap, Lia.p(propertyMap, 'career_present')));
                supportValueCol.setContent(Lia.p(propertyMap, 'support') == '1' ? '지원' : '미지원')


                var certList = Lia.p(propertyMap, 'certList');
                var certListObject = undefined;

                if (String.isNotBlank(certList)) {
                    certListObject = Lia.convertStrToObj(certList);
                }

                var certListString = '-';
                if (Array.isNotEmpty(certListObject)) {
                    certListString = certListObject.join(', ');
                }

                certListValueCol.setContent(certListString);
            })

        },

        write: function (detailTable, properties, body, options) {

            // attr 요청 받고 -> 매핑 드롭박스/랜더링 -> 이벤트

            //기관유형
            //경력 2개
            //국비 여부
            //
            var agType1Prop = Lia.p(properties, 'agTypeDp');
            var agType2Prop = Lia.p(properties, 'agTypeDp2');
            var careerTotal = Lia.p(properties, 'career');
            var careerPres = Lia.p(properties, 'career_present');
            var positionText = Lia.p(properties, 'positionText');
            var companyPosition = Lia.p(body, 'company_position');

            var support = Lia.p(properties, 'support');
            var certList = Lia.p(properties, 'certList');
            if (String.isNotBlank(certList)) {
                certList = Lia.convertStrToObj(certList);
            }


            //agType1
            {
                detailTable.appendRow({addClass: Lia.p(options, 'addClass')});
                detailTable.appendKeyColumn({
                    content: '기관유형 대분류', css: {}
                });
                var agTypeDp1 = new Triton.ComboBox({
                    theme: Triton.ComboBox.Theme.Normal,
                    form: {name: 'agTypeDp'},
                    onSelected: function (val) {


                        // detailTable.agTypeDp2CB
                        Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {
                            parentId: val,
                            depth: 2
                        }, function (status, data) {

                            if (!status) {
                                return;
                            }

                            var optionList = [{
                                name: '--선택--', value: ''
                            }];

                            var list = Lia.p(data, 'body', 'list');

                            for (var i in list) {
                                var attr = Lia.p(list, i)
                                var attrId = Lia.p(attr, 'id')
                                var attrName = Lia.p(attr, 'name')
                                var depth = Lia.p(attr, 'depth');
                                var categoryCode = Lia.p(attr, 'category_code');

                                if (categoryCode == '소속기관' && depth == 2) {
                                    optionList.push({'name': attrName, 'value': attrId});
                                }
                            }

                            detailTable.agTypeDp2CB.setOptionList(optionList);
                        });


                    }
                });
                detailTable.appendValueColumn({
                    content: agTypeDp1,
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });
            }


            //agTypeDp2
            {
                detailTable.appendRow({addClass: Lia.p(options, 'addClass')});
                detailTable.appendKeyColumn({
                    content: '기관유형 소분류', css: {}
                });
                var agTypeDp2 = detailTable.agTypeDp2CB = new Triton.ComboBox({
                    theme: Triton.ComboBox.Theme.Normal,
                    form: {name: 'agTypeDp2'},
                });
                detailTable.appendValueColumn({
                    content: agTypeDp2,
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });
            }


            {

                detailTable.appendRow({addClass: ''});
                detailTable.appendKeyColumn({
                    content: '기관', css: {}
                });

                detailTable.appendValueColumn({
                    content: detailTable.companyNameTextInput = new Triton.TextInput({
                        form: {name: 'companyName'},
                        value: Lia.p(body, 'company_name')
                    }),
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });


                detailTable.appendRow({addClass: ''});
                detailTable.appendKeyColumn({
                    content: '기관 전화번호', css: {}
                });

                detailTable.appendValueColumn({
                    content: detailTable.officePhoneNumberInput = new Triton.TextInput({
                        form: {name: 'officePhoneNumber'},
                        value: Lia.p(body, 'office_phone_number')
                    }),
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });


                detailTable.appendRow({addClass: ''});
                detailTable.appendKeyColumn({
                    content: '직급', css: {}
                });
                var companyPositionCol = detailTable.appendValueColumn({
                    content: detailTable.companyPositionCB = new Triton.ComboBox({
                        form: {name: 'companyPosition'},
                        css: {'float': 'left'},
                        onSelected: function (val, selectedOption, options) {

                            if (val == CompanyPosition.ETC) {
                                detailTable.companyPositionText.show();
                            } else {
                                detailTable.companyPositionText.hide();
                            }
                        }
                    }),

                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });


                detailTable.appendItem(
                    detailTable.companyPositionText = new Triton.TextInput({
                        form: {name: 'companyPositionText'},
                        css: {'float': 'left', 'margin-left': '5px'},
                        attr: {'placeholder': '직접 입력'}
                    }));
                detailTable.companyPositionText.hide();

            }


            //여성인권 기관 전체 경력
            {
                detailTable.appendRow({addClass: Lia.p(options, 'addClass')});
                detailTable.appendKeyColumn({
                    content: '여성폭력방지기관 총 경력', css: {}
                });
                var career = new Triton.ComboBox({
                    theme: Triton.ComboBox.Theme.Normal,
                    form: {name: 'career'},
                });
                detailTable.appendValueColumn({
                    content: career,
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });
            }

            //현 기관 경력
            {
                detailTable.appendRow({addClass: Lia.p(options, 'addClass')});
                detailTable.appendKeyColumn({
                    content: '현 기관 경력', css: {}
                });
                var careerPresent = new Triton.ComboBox({
                    theme: Triton.ComboBox.Theme.Normal,
                    form: {name: 'career_present'},
                });
                detailTable.appendValueColumn({
                    content: careerPresent,
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });
            }

            //국비 지원여부
            {
                detailTable.appendRow({addClass: Lia.p(options, 'addClass')});
                detailTable.appendKeyColumn({
                    content: '국비(지방비) 지원여부', css: {}
                });
                var supportCheckBox = new Triton.CheckBox({
                    form: {name: 'support'},
                });
                detailTable.appendValueColumn({
                    content: supportCheckBox,
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });
            }

            //자격증
            {
                var certSection = new Triton.Section({})
                detailTable.appendRow({addClass: Lia.p(options, 'addClass')});
                detailTable.appendKeyColumn({
                    content: '자격증', css: {}
                });
                detailTable.appendValueColumn({
                    content: certSection,
                    attr: {'colspan': Lia.pd(1, options, 'valueColspan')}
                });
                for (var key in UserCertificateType.codeMap) {

                    var name = UserCertificateType.getName(key);

                    var cb = new Triton.CheckBox({
                        form: {name: 'certList' + key},
                        appendTo: certSection,
                        content: name,
                        css: {'margin-right': '10px'}
                    })

                    for (var l in certList) {

                        if (certList[l] == name) {
                            cb.setStatus(Triton.CheckBox.Status.PRESSED);
                            break;
                        }
                    }
                }
            }

            Requester.awb(ApiUrl.Common.GET_ATTRIBUTE_LIST, {}, function (status, data) {
                var list = Lia.p(data, 'body', 'list');

                var agTypeDp1Map = [{
                    name: '--- 선택 ---', value: ''
                }];
                var agTypeDp2Map = [{
                    name: '--- 선택 ---', value: ''
                }];

                var careerMap = [{
                    name: '--- 선택 ---', value: ''
                }];

                var companyPositionOptionList = [{
                    name: '--- 선택 ---', value: ''
                }];

                for (var i in list) {
                    var attr = Lia.p(list, i)
                    var attrId = Lia.p(attr, 'id')
                    var attrName = Lia.p(attr, 'name')
                    var depth = Lia.p(attr, 'depth');
                    var categoryCode = Lia.p(attr, 'category_code');

                    if (categoryCode == '경력') {
                        careerMap.push({'name': attrName, 'value': attrId});
                    }
                    if (categoryCode == '소속기관' && depth == 1) {
                        agTypeDp1Map.push({'name': attrName, 'value': attrId});
                    }
                    if (categoryCode == '소속기관' && depth == 2) {
                        agTypeDp2Map.push({'name': attrName, 'value': attrId});
                    }

                    if (categoryCode == '직위') {
                        companyPositionOptionList.push({name: attrName, value: attrId});
                    }
                }

                detailTable.companyPositionCB.setOptionList(companyPositionOptionList);
                detailTable.companyPositionCB.setValue(companyPosition);
                detailTable.companyPositionText.setValue(positionText);

                //agTypeDp1
                agTypeDp1.setOptionList(agTypeDp1Map);
                agTypeDp1.setValue(agType1Prop)

                //agTypeDp2
                agTypeDp2.setOptionList(agTypeDp2Map);
                agTypeDp2.setValue(agType2Prop)

                //전체경력
                career.setOptionList(careerMap);
                career.setValue(careerTotal)

                //현 기관 경력
                careerPresent.setOptionList(careerMap);
                careerPresent.setValue(careerPres)

                //국비지원
                supportCheckBox.setStatus(support == 1 ? true : false)
            })

        },

        extract: function (nameValueMap, parameterMap) {

            // var agType1Prop = Lia.p(properties , 'agTypeDp');
            // var agType2Prop = Lia.p(properties , 'agTypeDp2');
            // var careerTotal = Lia.p(properties , 'career');
            // var careerPres = Lia.p(properties , 'career_present');
            //
            // var support = Lia.p(properties , 'support');
            // var certList = Lia.p(properties , 'certList');

            nameValueMap['positionText'] = parameterMap['companyPositionText'];
            nameValueMap['agTypeDp'] = parameterMap['agTypeDp'];
            nameValueMap['agTypeDp2'] = parameterMap['agTypeDp2'];
            nameValueMap['career'] = parameterMap['career'];
            nameValueMap['career_present'] = parameterMap['career_present'];
            nameValueMap['support'] = parameterMap['support'];

            var certList = [];

            for (var key in UserCertificateType.codeMap) {

                if (parameterMap['certList' + key] == 1) {
                    certList.push(UserCertificateType.getName(key));
                }
            }

            nameValueMap['certList'] = JSON.stringify(certList);

            return false;
        }
    },

    // { name : '기관유형 대분류' , key : 'agTypeDp'},
    // { name : '기관유형 중분류' , key : 'agTypeDp2'},
    // { name : '여성폭력방지기관 총 경력' , key : 'career'},
    // { name : '현 재직 기관 경력' , key : 'career_present'},
    //{ name : '자격증 목록' , key : 'certList'},
    // { name : '국비(지방비) 지원 여부' , key : 'support'},
];

ProjectSettings.CourseAttributeList = [
    // { categoryCode : '과정분야',  checkBox : true, once : true,  name : '과정분야', useChildList : true },

    // { categoryCode : '소속기관',  checkBox : true, once : true,  name : '소속기관 유형', useChildList : true },
    // { categoryCode : '직위',  checkBox : true, once : true,  name : '직위' },
    // { categoryCode : '경력',  checkBox : true, once : true,  name : '경력' }
];

ProjectSettings.CourseAttributeListForPanel = [
    {
        name: '과정 분야 및 수강 대상',
        folded: false,
        list: [
            {categoryCode: '과정분야', checkBox: true, once: true, name: '과정분야', useChildList: true},
            {categoryCode: '주제유형', checkBox: true, once: true, name: '주제유형'},
            {categoryCode: '소속기관', checkBox: true, once: true, name: '소속기관 유형', useChildList: true},
            {categoryCode: '직위', checkBox: true, once: true, name: '직위'},
            {categoryCode: '경력', checkBox: true, once: true, name: '경력'}
        ]
    }
];

ProjectSettings.CoursePlanItemList = [
    {
        name: {
            'ko': {DEFAULT: '실제 교육 운영 시간'},
            'en': {DEFAULT: 'Actual Study Hour Per Day'}
        },
        key: 'actual_study_hour_per_day',
        input: true
    },
    {
        name: {
            'ko': {DEFAULT: '최대 수강인원'},
            'en': {DEFAULT: 'Max Student Count'}
        },
        key: 'max_student_count',
        input: true
    },

    {
        name: {
            'ko': {DEFAULT: '과정소개'},
            'en': {DEFAULT: 'Course Introduction'}
        },
        key: 'course_introduction',
        editor: true
    },
    {
        name: {
            'ko': {DEFAULT: '수업목표'},
            'en': {DEFAULT: 'Learning Objectives'}
        },
        key: 'learning_objectives',
        editor: true
    },

    {
        name: {
            'ko': {DEFAULT: '수업운영 전략'},
            'en': {DEFAULT: 'Teaching Strategies'}
        },
        key: 'teaching_strategies',
        editor: true
    },

    // {
    //     name: {
    //         'ko': {DEFAULT: '교재'},
    //         'en': {DEFAULT: 'Textbooks'}
    //     },
    //     key: 'textbooks',
    //     list: true
    // },
    //
    // {
    //     name: {
    //         'ko': {DEFAULT: '문헌'},
    //         'en': {DEFAULT: 'readings'}
    //     },
    //     key: 'readings',
    //     list: true
    // },
    //
    // {
    //     name: {
    //         'ko': {DEFAULT: '학습관련 사이트'},
    //         'en': {DEFAULT: 'links'}
    //     },
    //     key: 'links',
    //     list: true
    // },
    {
        name: {
            'ko': {DEFAULT: '담당자(노출용)'},
            'en': {DEFAULT: 'Course Admin'}
        },
        key: 'course_admin',
        editor: true,
    },
    {
        name: {
            'ko': {DEFAULT: '비고'},
            'en': {DEFAULT: 'Course comment'}
        },
        key: 'comment',
        editor: true,
    },
    {
        name: {
            'ko': {DEFAULT: '첨부파일'},
            'en': {DEFAULT: 'Attachment'}
        },
        key: 'attachment',
        file: true
    },
    // {
    //     name: {
    //         'ko': {DEFAULT: '숙박여부'},
    //         'en': {DEFAULT: 'Stay'}
    //     },
    //     key: 'stay',
    //     checkbox : true
    // },
    {
        name: {
            'ko': {DEFAULT: '숙박여부'},
            'en': {DEFAULT: 'Stay'}
        },
        key: 'stay',
        comboBox: true,
        optionList: [
            {'name': '비숙박', 'value': 0},
            {'name': '숙박', 'value': 1}
        ]
    },

    {
        name: {
            'ko': {DEFAULT: '장소 - 지역(통계용)'},
            'en': {DEFAULT: 'District(Report)'}
        },
        key: 'district',
        comboBox: true,
        optionList: [
            {'name': '서울특별시', 'value': '서울특별시'},
            {'name': '부산광역시', 'value': '부산광역시'},
            {'name': '대구광역시', 'value': '대구광역시'},
            {'name': '인천광역시', 'value': '인천광역시'},
            {'name': '광주광역시', 'value': '광주광역시'},
            {'name': '대전광역시', 'value': '대전광역시'},
            {'name': '울산광역시', 'value': '울산광역시'},
            {'name': '세종특별자치시', 'value': '세종특별자치시'},
            {'name': '경기도', 'value': '경기도'},
            {'name': '강원도', 'value': '강원도'},
            {'name': '충청북도', 'value': '충청북도'},
            {'name': '충청남도', 'value': '충청남도'},
            {'name': '전라북도', 'value': '전라북도'},
            {'name': '전라남도', 'value': '전라남도'},
            {'name': '경상북도', 'value': '경상북도'},
            {'name': '경상남도', 'value': '경상남도'},
            {'name': '제주특별자치도', 'value': '제주특별자치도'}
        ]
    },

    {
        name: {
            'ko': {DEFAULT: '장소 - 장소명(통계용)'},
            'en': {DEFAULT: 'Venue(Report)'}
        },
        key: 'venue',
        input: true
    },

    {
        name: {
            'ko': {DEFAULT: '담당자(통계용)'},
            'en': {DEFAULT: 'Course Admin(Report)'}
        },
        key: 'course_admin_for_report',
        input: true
    },
];



OptionListHelper.createCourseYearList = function (includeAll, textOfAll) {

    var date = new Date();
    var year = date.getFullYear();
    var yearList = [];

    if (includeAll) {

        if ( textOfAll == undefined ) {
            textOfAll = Strings.getString(Strings.COURSE_YEAR) + ' 전체';
        }

        yearList.push({name: textOfAll, value: ''});
    }

    for (var y = year + 1, yl = 2021; y >= yl; y--) {
        yearList.push({name: y, value: y});
    }

    return yearList;
};


var userRoleCodeMap = UserRole.getCodeMap();

var BaseSubMenuList = {};
BaseSubMenuList.DEFAULT_MENU_LIST = {

    'operation_manage/institution_manage': {

        'text': Strings.getString(Strings.INSTITUTION) + ' 관리',
        'menu': ['operation_manage/institution_manage'],
        'subMenuList': [
            {
                'menu': [
                    'operation_manage/institution_manage',
                    'institution_detail'
                ],
                'text': '상세 정보',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/institution_manage/institution_edit'
                ]
            },
            {
                'menu': [
                    'operation_manage/institution_manage',
                    'institution_admin'
                ],
                'text': '관리자 배정',
                'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'operation_manage/institution_manage/institution_admin_register'
                ]
            },
            {
                'menu': [
                    'operation_manage/institution_manage',
                    'institution_retake_setting'
                ],
                'text': '재수강 정책',
                'exclude': []
            },
            {
                'menu': [
                    'operation_manage/institution_manage',
                    'institution_grade_setting'
                ],
                'text': '과락 및 성적 구간 설정',
                'exclude': []
            },
            // {
            //     'menu': [
            //         'operation_manage/institution_manage',
            //         'term_grade_setting'
            //     ],
            //     'text': '기수별 기본 평가 비율',
            //     'exclude': []
            // },
            {
                'menu': [
                    'operation_manage/institution_manage',
                    'institution_announcement'
                ],
                'text': '공지사항',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/institution_manage/institution_announcement_write',
                    'operation_manage/institution_manage/institution_announcement_detail'
                ]
            },
            {
                'menu': [
                    'operation_manage/institution_manage',
                    'institution_qna'
                ],
                'text': '질의응답',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/institution_manage/institution_qna_write',
                    'operation_manage/institution_manage/institution_qna_detail'
                ]
            }
        ]
    },

    'operation_manage/department_manage': {

        'text': Strings.getString(Strings.DEPARTMENT) + ' 관리',
        'menu': ['operation_manage/department_manage'],
        'subMenuList': [
            {
                'menu': [
                    'operation_manage/department_manage',
                    'department_detail'
                ],
                'text': '상세 정보',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/department_manage/department_edit'
                ]
            },
            {
                'menu': [
                    'operation_manage/department_manage',
                    'department_admin'
                ],
                'text': '관리자 배정',
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'operation_manage/department_manage/department_admin_register'
                ]
            },
        ]
    },

    'operation_manage/organization_manage': {

        'text': Strings.getString(Strings.ORGANIZATION) + ' 관리',
        'menu': ['operation_manage/organization_manage'],
        'subMenuList': [
            {
                'menu': [
                    'operation_manage/organization_manage',
                    'organization_detail'
                ],
                'text': '상세 정보',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/organization_manage/organization_edit'
                ]
            },
            {
                'menu': [
                    'operation_manage/organization_manage',
                    'organization_admin'
                ],
                'text': '관리자 배정',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/organization_manage/organization_admin_register'
                ]
            },
            {
                'menu': [
                    'operation_manage/organization_manage',
                    'organization_announcement'
                ],
                'text': '공지사항',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/organization_manage/organization_announcement_detail',
                    'operation_manage/organization_manage/organization_announcement_write'
                ]
            },
            {
                'menu': [
                    'operation_manage/organization_manage',
                    'organization_qna'
                ],
                'text': '질의응답',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/organization_manage/organization_qna_detail',
                    'operation_manage/organization_manage/organization_qna_write'
                ]
            }
        ]
    },

    'operation_manage/course_manage': {

        'text': '',
        'menu': ['operation_manage/course_manage'],
        'subMenuList': [
            {
                'menu': [
                    'operation_manage/course_manage',
                    'dashboard'
                ],
                'text': '대시보드',
                'markPrefixList': []
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'course_operation_config_detail'
                ],
                'text': '운영 설정',
                'markPrefixList': []
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'course_outline_detail'
                ],
                'text': '강의계획서',
                'markPrefixList': []
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'grade_setting'
                ],
                'text': '과락 및 성적 구간 설정',
                'markPrefixList': []
            },

            {
                'text': '강의 목록',
                'markPrefixList': [
                    'operation_manage/course_manage/learning_lesson_write'
                ],
                'menu': [
                    'operation_manage/course_manage',
                    'learning'
                ],
            },

            {
                'text': '출석 현황',
                'markPrefixList': [],
                'menu': [
                    'operation_manage/course_manage',
                    'student_attendance'
                ],
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'course_administrator'
                ],
                'text': '' + UserRole.getName(UserRole.TEACHER) + '/' + UserRole.getName(UserRole.TEACHING_ASSISTANT) + ' 관리',
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT],
                'markPrefixList': [
                    'operation_manage/course_manage/course_administrator_write'
                ]
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'course_enrollment'
                ],
                'text': '수강생/청강생',
                'exclude': []
            },

            {
                'text': '평가 출제 및 채점',
                'subMenuList': [

                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'test_question_group'
                        ],
                        'text': '문제은행'
                    },

                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'course_task'
                        ],
                        'text': '평가출제',
                        'exclude': []
                    },

                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'student_course_task'
                        ],
                        'text': '학습자 제출 현황',
                        'exclude': []
                    },

                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'student_work'
                        ],
                        'text': '학습자 제출물 채점',
                        'exclude': []
                    },
                ]
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'live_seminar'
                ],
                'text': Strings.getString(Strings.LIVE_SEMINAR) + ' 관리',
                'exclude': [],
                'hidden': !Configs.getConfig(Configs.LIVE_SEMINAR),
            },

            {
                'menu': [
                    'operation_manage/course_manage',
                    'student_monitoring'
                ],
                'text': '학습 모니터링',
                'exclude': []
            },

            {
                'text': '게시판',
                'subMenuList': [
                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'course_notice'
                        ],
                        'text': '공지사항',
                        'exclude': []
                    },
                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'course_dataroom'
                        ],
                        'text': '자료실',
                        'exclude': []
                    },
                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'course_qna'
                        ],
                        'text': '질의응답',
                        'exclude': []
                    },
                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'course_error_notify'
                        ],
                        'text': '콘텐츠 오류 신고'
                    },
                    {
                        'menu': [
                            'operation_manage/course_manage',
                            'course_board'
                        ],
                        'text': '게시판 관리'
                    }
                ]
            },
            // {
            //     'menu': [
            //         'operation_manage/course_manage',
            //         'score_correction'
            //     ],
            //     'text': '성적 이의 신청',
            //     'exclude': [
            //         'operation_manage/course_manage_detail'
            //     ]
            // },
            {
                'menu': [
                    'operation_manage/course_manage',
                    'student_report'
                ],
                'text': '성적 관리',
                'exclude': []
            }
        ]
    },

    'operation_manage/curriculum_manage': {

        'text': Strings.getString(Strings.CURRICULUM) + ' 관리',
        'menu': ['operation_manage/curriculum_manage'],
        'subMenuList': [
            {
                'menu': [
                    'operation_manage/curriculum_manage',
                    'curriculum_detail'
                ],
                'text': '상세 정보',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/curriculum_manage/curriculum_edit'
                ]
            },
            {
                'menu': [
                    'operation_manage/curriculum_manage',
                    'curriculum_item'
                ],
                'text': '' + Strings.getString(Strings.CURRICULUM) + ' 구성',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/curriculum_manage/curriculum_item_write'
                ]
            },
            {
                'menu': [
                    'operation_manage/curriculum_manage',
                    'curriculum_enrollment'
                ],
                'text': '수강생',
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/curriculum_manage/curriculum_enrollment_register'
                ]
            }
        ]
    },


    'content/course_content_manage': {

        'text': '',
        'menu': ['content/course_content_manage'],
        'subMenuList': [
            {
                'menu': [
                    'content/course_content_manage',
                    'course_content_config_detail'
                ],
                'text': '기본 설정',
                'exclude': [],
                'markPrefixList': [
                    'content/course_content_manage/course_content_config_edit'
                ]
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'course_content_outline_detail'
                ],
                'text': '강의계획서',
                'exclude': [],
                'markPrefixList': [
                    'content/course_content_manage/course_content_outline_edit'
                ]
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'process_control',
                    'task'
                ],
                'text': '개발 공정 관리',
                'exclude': [],
                'hidden': !Configs.getConfig(Configs.USE_CONTENT_DEVELOPMENT_MANAGEMENT)
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'content_construct'
                ],
                'text': '강의 목록',
                'exclude': []
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'editor'
                ],
                'text': Strings.getString(Strings.COURSE_CONTENT_EDITOR_AND_VIEWER) + ' 관리',
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.CONTENT_PROVIDER]
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'test_question_group'
                ],
                'text': '문제 은행',
                'exclude': [UserRole.CONTENT_PROVIDER],
                'markPrefixList': [
                    'content/course_content_manage/test_question_group_detail'
                ]
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'error_report'
                ],
                'text': '콘텐츠 오류 신고',
                'exclude': []
            },
            {
                'menu': [
                    'content/course_content_manage',
                    'refer_course'
                ],
                'text': '콘텐츠 활용 현황',
                'exclude': [UserRole.CONTENT_PROVIDER]
            },
        ]
    }
};


for (var key in userRoleCodeMap) {

    var menuList = [];

    var list = BaseSubMenuList.DEFAULT_MENU_LIST;
    for (var listKey in list) {

        var item = list[listKey];
        if (item == undefined) {
            continue;
        }

        var hidden = item['hidden'];
        if (hidden == true) {
            continue;
        }

        var exclude = item['exclude'];
        if (exclude != undefined && exclude.length > 0) {

            var excluded = false;
            for (var j = 0, jl = exclude.length; j < jl; j++) {

                var roleCode = exclude[j];
                if (key == roleCode) {
                    excluded = true;
                    break;
                }
            }

            if (excluded == true) {
                continue;
            }
        }

        var menu = {};
        menu['menu'] = item['menu'];
        menu['text'] = item['text'];
        menu['markPrefixList'] = item['markPrefixList'];

        var subItemList = item['subMenuList'];
        if (subItemList != undefined) {

            var subMenuList = [];

            for (var j = 0, jl = subItemList.length; j < jl; j++) {

                var subItem = subItemList[j];
                if (subItem == undefined) {
                    continue;
                }

                var subHidden = subItem['hidden'];
                if (subHidden == true) {
                    continue;
                }

                var subExclude = subItem['exclude'];
                var subExcluded = false;

                if (subExclude != undefined && subExclude.length > 0) {

                    for (var k = 0, kl = subExclude.length; k < kl; k++) {

                        var subRoleCode = subExclude[k];
                        if (key == subRoleCode) {
                            subExcluded = true;
                            break;
                        }
                    }
                }

                if (subExcluded == true) {
                    continue;
                }

                var subMenu = {};
                subMenu['menu'] = subItem['menu'];
                subMenu['text'] = subItem['text'];
                subMenu['subMenuList'] = subItem['subMenuList'];
                subMenu['markPrefixList'] = subItem['markPrefixList'];
                subMenuList.push(subMenu);
            }

            menu['subMenuList'] = subMenuList;
        }

        menuList[listKey] = menu;
    }

    BaseSubMenuList[key] = menuList;
}


BaseSubMenuList[UserRole.INSTITUTION_ADMIN]['operation_manage/course_manage'] = {

    'text': '',
    'menu': ['operation_manage/course_manage'],
    'subMenuList': [

        {
            'menu': [
                'operation_manage/course_manage',
                'dashboard'
            ],
            'text': '대시보드',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_operation_config_detail'
            ],
            'text': '운영 설정',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_outline_detail'
            ],
            'text': '강의계획서',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'grade_setting'
            ],
            'text': '과락 및 성적 구간 설정',
            'markPrefixList': []
        },

        {
            'text': '강의 목록',
            'markPrefixList': [
                'operation_manage/course_manage/learning_lesson_write'
            ],
            'menu': [
                'operation_manage/course_manage',
                'learning'
            ],
        },

        {
            'text': '출석 현황',
            'markPrefixList': [],
            'menu': [
                'operation_manage/course_manage',
                'student_attendance'
            ],
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_administrator'
            ],
            'text': '' + UserRole.getName(UserRole.TEACHER) + '/' + UserRole.getName(UserRole.TEACHING_ASSISTANT) + ' 관리',
            'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT],
            'markPrefixList': [
                'operation_manage/course_manage/course_administrator_write'
            ]
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_enrollment'
            ],
            'text': '수강생',
            'exclude': []
        },

        {
            'text': '평가 출제 및 채점',
            'subMenuList': [

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'test_question_group'
                    ],
                    'text': '문제은행'
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_task'
                    ],
                    'text': '평가출제',
                    'exclude': []
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'student_course_task'
                    ],
                    'text': '학습자 제출 현황',
                    'exclude': []
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'student_work'
                    ],
                    'text': '학습자 제출물 채점',
                    'exclude': []
                },
            ]
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'live_seminar'
            ],
            'text': Strings.getString(Strings.LIVE_SEMINAR) + ' 관리',
            'exclude': [],
            'hidden': !Configs.getConfig(Configs.LIVE_SEMINAR),
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'student_monitoring'
            ],
            'text': '학습 모니터링',
            'exclude': []
        },

        {
            'text': '게시판',
            'subMenuList': [
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_notice'
                    ],
                    'text': '공지사항',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_dataroom'
                    ],
                    'text': '자료실',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_qna'
                    ],
                    'text': '질의응답',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_board'
                    ],
                    'text': '게시판 관리'
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_error_notify'
                    ],
                    'text': '콘텐츠 오류 신고'
                }
            ]
        },

        // {
        //     'menu': [
        //         'operation_manage/course_manage',
        //         'score_correction'
        //     ],
        //     'text': '성적 이의 신청',
        //     'exclude': [
        //         'operation_manage/course_manage_detail'
        //     ]
        // },

        {
            'menu': [
                'operation_manage/course_manage',
                'student_report'
            ],
            'text': '성적 관리',
            'exclude': []
        }
    ]
};


BaseSubMenuList[UserRole.TEACHER]['operation_manage/course_manage'] = {

    'text': '',
    'menu': ['operation_manage/course_manage'],
    'subMenuList': [

        {
            'menu': [
                'operation_manage/course_manage',
                'dashboard'
            ],
            'text': '대시보드',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_outline_detail'
            ],
            'text': '강의계획서',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'grade_setting'
            ],
            'text': '과락 및 성적 구간 설정',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'learning'
            ],
            'text': '강의 목록',
            'markPrefixList': [
                'operation_manage/course_manage/learning_lesson_write'
            ]
        },

        {
            'text': '출석 현황',
            'markPrefixList': [],
            'menu': [
                'operation_manage/course_manage',
                'student_attendance'
            ],
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_enrollment'
            ],
            'text': '수강생',
            'exclude': []
        },

        {
            'text': '평가 출제 및 채점',
            'subMenuList': [

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'test_question_group'
                    ],
                    'text': '문제은행'
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_task'
                    ],
                    'text': '평가출제',
                    'exclude': []
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'student_course_task'
                    ],
                    'text': '학습자 제출 현황',
                    'exclude': []
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'student_work'
                    ],
                    'text': '학습자 제출물 채점',
                    'exclude': []
                },
            ]
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'live_seminar'
            ],
            'text': Strings.getString(Strings.LIVE_SEMINAR) + ' 관리',
            'exclude': [],
            'hidden': !Configs.getConfig(Configs.LIVE_SEMINAR),
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'student_monitoring'
            ],
            'text': '학습 모니터링',
            'exclude': []
        },

        {
            'text': '게시판',
            'subMenuList': [
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_notice'
                    ],
                    'text': '공지사항',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_dataroom'
                    ],
                    'text': '자료실',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_qna'
                    ],
                    'text': '질의응답',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_board'
                    ],
                    'text': '게시판 관리'
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_error_notify'
                    ],
                    'text': '콘텐츠 오류 신고'
                }
            ]
        },
        // {
        //     'menu': [
        //         'operation_manage/course_manage',
        //         'score_correction'
        //     ],
        //     'text': '성적 이의 신청',
        //     'exclude': [
        //         'operation_manage/course_manage_detail'
        //     ]
        // },
        {
            'menu': [
                'operation_manage/course_manage',
                'student_report'
            ],
            'text': '성적 관리',
            'exclude': []
        }
    ]
};


BaseSubMenuList[UserRole.TEACHING_ASSISTANT]['operation_manage/course_manage'] = {

    'text': '',
    'menu': ['operation_manage/course_manage'],
    'subMenuList': [

        {
            'menu': [
                'operation_manage/course_manage',
                'dashboard'
            ],
            'text': '대시보드',
            'markPrefixList': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'course_outline_detail'
            ],
            'text': '강의계획서',
            'exclude': []
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'learning'
            ],
            'text': '강의 목록',
            'markPrefixList': [
                'operation_manage/course_manage/learning_lesson_write'
            ]
        },

        {
            'text': '출석 현황',
            'markPrefixList': [],
            'menu': [
                'operation_manage/course_manage',
                'student_attendance'
            ],
        },

        {
            'text': '평가 출제 및 채점',
            'menu': [
                'operation_manage/course_manage', 'course_task'
            ],
            'subMenuList': [

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'test_question_group'
                    ],
                    'text': '문제은행'
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_task'
                    ],
                    'text': '평가출제',
                    'exclude': []
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'student_course_task'
                    ],
                    'text': '학습자 제출 현황',
                    'exclude': []
                },

                {
                    'menu': [
                        'operation_manage/course_manage',
                        'student_work'
                    ],
                    'text': '학습자 제출물 채점',
                    'exclude': []
                },
            ]
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'live_seminar'
            ],
            'text': Strings.getString(Strings.LIVE_SEMINAR) + ' 관리',
            'exclude': [],
            'hidden': !Configs.getConfig(Configs.LIVE_SEMINAR),
        },

        {
            'menu': [
                'operation_manage/course_manage',
                'student_monitoring'
            ],
            'text': '학습 모니터링',
            'exclude': []
        },

        {
            'text': '게시판',
            'menu': [
                'operation_manage/course_manage',
                'board'
            ],
            'subMenuList': [
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_notice'
                    ],
                    'text': '공지사항',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_dataroom'
                    ],
                    'text': '자료실',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_qna'
                    ],
                    'text': '질의응답',
                    'exclude': []
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_board'
                    ],
                    'text': '게시판 관리'
                },
                {
                    'menu': [
                        'operation_manage/course_manage',
                        'course_error_notify'
                    ],
                    'text': '콘텐츠 오류 신고'
                }
            ]
        },
        // {
        //     'menu': [
        //         'operation_manage/course_manage',
        //         'score_correction'
        //     ],
        //     'text': '성적 이의 신청',
        //     'exclude': [
        //         'operation_manage/course_manage_detail'
        //     ]
        // },
        {
            'menu': [
                'operation_manage/course_manage',
                'student_report'
            ],
            'text': '성적 관리',
            'exclude': []
        },
        // {
        //     'menu': [
        //         'operation_manage/course_manage',
        //         'self_evaluation'
        //     ],
        //     'text': '자가 점검',
        //     'exclude': []
        // }
    ]
};


/////////////////////////////////////////////////////////////////////////////
// 기본 메뉴 설정

var BaseMenuList = {};
BaseMenuList.DEFAULT_MENU_LIST = [

    {
        'id': 'N01',
        'logoImageUrl': '/res/cms/img/index/img_gnb_home.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_home_pressed.png',
        'text': '대시보드',
        'menu': ['home'],
        'exclude': [UserRole.STUDENT],
        'markPrefixList': [
            'teacher_dashboard'
        ]
    },
    {
        'id': 'N02',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu15.png',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico1.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico1_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_integrated_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_integrated_management_pressed.png',

        'text': 'VOC 관리',
        'exclude': [UserRole.CONTENT_PROVIDER],
        'subMenuList': [
            {
                'id': 'N0202',

                'text': Strings.getString(Strings.COURSE) + ' 질의응답', 'menu': ['website/board'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
                'markPrefixList': [
                    'website/board_detail',
                    'website/board_write'
                ]
            },
            {
                'id': 'N0208',

                'text': '콘텐츠 오류 신고', 'menu': ['website/error_notify'],
                'exclude': [UserRole.ORGANIZATION_ADMIN],
                'hidden': (Server.allowBoardOperation == '0'),
                'markPrefixList': [
                    'website/error_notify_detail',
                    'website/error_notify_write'
                ]
            }
        ]
    },
    {
        'id': 'N03',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu02.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico9.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico9_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_user_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_user_management_pressed.png',
        'text': '사용자',
        'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
        'menu': ['user/account'],
        'subMenuList': [
            {
                'id': 'N0301',
                'text': '계정 관리',
                'menu': ['user/account'],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
            },
            {
                'id': 'N0304',
                'text': '뉴스레터 목록',
                'menu': ['user/newsletter'],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
            },
            {
                'id': 'N0302',
                'text': '활동이력 조회',
                'menu': ['user/user_event'],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
            },
            {
                'id': 'N0303',
                'text': '권한 그룹',
                'menu': ['user/group'],
                'markPrefixList': [
                    'usr/group_add'
                ],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
            }
        ]
    },
    {
        'id': 'N05',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu11.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico12.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico12_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_content_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_content_management_pressed.png',
        'text': '콘텐츠',
        'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.ACADEMIC_ADVISOR],
        'hidden': (Server.isOrganizationTeacher == '1'),
        'subMenuList': [
            {
                'id': 'N0502',

                'text': '콘텐츠 마스터', 'menu': ['content/course_code'],
                // 'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'markPrefixList': [
                    'content/course_code_detail',
                    'content/course_code_write',
                    'content/course_content_write',
                    'content/course_content_manage'
                ],
                'markSubMenuList': [
                    BaseSubMenuList.DEFAULT_MENU_LIST['content/course_content_manage']
                ]
            },
            {
                'text': Strings.getString(Strings.COURSE_CONTENT_EDITOR_AND_VIEWER) + ' 관리',
                'menu': ['content/course_cp_manage'],
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'markPrefixList': [
                    'content/course_cp_detail',
                    'content/course_cp_register',
                    'content/course_add_content'
                ]
            },

            {
                'text': Strings.getString(Strings.COURSE_CATEGORY) + ' 관리',
                'menu': ['content/course_category'],
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden' : !Configs.getConfig(Configs.COURSE_CODE_CATEGORY),
                'markPrefixList': [
                    'content/course_category'
                ]
            },
        ]
    },
    {
        'id': 'N0401',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu03.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico11.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico11_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_operation_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_operation_management_pressed.png',
        'text': '운영',
        'exclude': [UserRole.CONTENT_PROVIDER],
        'hidden': (Server.allowTermOperation == '0'),
        'subMenuList': [
            // {
            //     'id': 'N040105',
            //
            //     'text': '교과목개설표 관리',
            //     'menu': ['content/content_development_plan'],
            //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
            //     'markPrefixList': [
            //         'content/content_development_plan_detail'
            //     ]
            // },
            {
                'id': 'N040101',

                'text': Strings.getString(Strings.TERM) + ' 개설 관리',
                'menu': ['operation_manage/term'],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'operation_manage/create_term'
                ]
            },
            // {
            //     'id': 'N040208',
            //
            //     'text': Strings.getString(Strings.TERM) + '별 수료기준 및 평가비율',
            //     'menu': ['website/term_grade_setting'],
            //     'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
            //     'hidden': (Server.allowTermOperation == '0')
            // },
            {
                'id': 'N040103',

                'text': Strings.getString(Strings.COURSE) + ' 개설 관리',
                'menu': ['operation_manage/course'],
                'exclude': [],
                'markPrefixList': [
                    'operation_manage/create_course',
                    'operation_manage/course_operation_config_detail'
                ],
                'markSubMenuList': [
                    BaseSubMenuList.DEFAULT_MENU_LIST['operation_manage/course_manage']
                ]
            },
            // {
            //     'id': 'N040209',
            //
            //     'text': Strings.getString(Strings.COURSE) + '별 수료평가 및 평가비율',
            //     'menu': ['website/course_grade_setting'],
            //     'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
            //     'hidden': (Server.allowTermOperation == '0')
            // },
            {
                'id': 'N040104',

                'text': Strings.getString(Strings.COURSE) + ' 일괄 설정',
                'menu': ['operation_manage/course_setting'],
                'exclude': [],
                'markPrefixList': []
            },
            {
                'id': 'N040107',

                'text': Strings.getString(Strings.COURSE) + ' 운영 준비 현황',
                'menu': ['operation_manage/course_preparation'],
                'exclude': [],
                'markPrefixList': []
            },
            {
                'id': 'N040108',

                'text': Strings.getString(Strings.COURSE) + ' 공지사항',
                'menu': ['website/notice'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
                'markPrefixList': [
                    'website/notice_detail',
                    'website/notice_write'
                ]
            },
            {
                'id': 'N040109',

                'text': Strings.getString(Strings.COURSE) + ' 자료실',
                'menu': ['website/dataroom'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
                'markPrefixList': [
                    'website/dataroom_detail',
                    'website/dataroom_write'
                ]
            },

            {
                'id': 'N040110',

                'text': '교재 발송 관리',
                'menu': ['website/study_material_delivery_manage'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
            },


            {
                'id': 'N040111',

                'text': '수료증 목록',
                'menu': ['operation_manage/document_manage/document'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
            }
        ]
    },
    {
        'id': 'N0402',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu03.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico8.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico8_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_operation_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_operation_management_pressed.png',
        'text': '수강생',
        'exclude': [UserRole.CONTENT_PROVIDER],
        'hidden': (Server.allowTermOperation == '0'),
        'subMenuList': [
            {
                'id': 'N040401',

                'text': Strings.getString(Strings.COURSE) + ' 수강생/청강생', 'menu': ['website/user_manage'],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'website/user_manage_detail',
                    'website/course_enrollment_register',
                    'website/sign_course_register'
                ]
            },
            {
                'id': 'N040201',

                'text': '학습자 제출물 관리', 'menu': ['website/student_work'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_work_detail'
                ]
            },

            {
                'id': 'N040202',

                'text': '학습자 모니터링', 'menu': ['website/student_monitoring'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_monitoring_detail'
                ]
            },

            {
                'id': 'N040203',

                'text': '학습자 성적 관리', 'menu': ['website/student_report'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_report_detail'
                ]
            },
        ]
    },
    {
        'id': 'N0403',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu03.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6_pressed.png',

        'text': UserRole.getName(UserRole.TEACHER) + '/' + UserRole.getName(UserRole.TEACHING_ASSISTANT),
        'exclude': [UserRole.CONTENT_PROVIDER],
        'hidden': (Server.allowTermOperation == '0'),
        'subMenuList': [

            {
                'id': 'N040301',

                'text': UserRole.getName(UserRole.TEACHER) + '/' + UserRole.getName(UserRole.TEACHING_ASSISTANT) + ' 배정',
                'menu': ['website/instructor_manage'],
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'website/instructor_manage_detail',
                    'website/instructor_register',
                    'website/instructor_add_course'

                ]
            },
            {
                'id': 'N040302',

                'text': UserRole.getName(UserRole.TEACHER) + '/' + UserRole.getName(UserRole.TEACHING_ASSISTANT) + ' 모니터링',
                'menu': ['website/instructor_act'],
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'website/instructor_manage_detail',
                    'website/instructor_add_course'
                ]
            },
            // {
            //     'id': 'N040303',
            //
            //     'text': UserRole.getName(UserRole.TEACHER) + '/' + UserRole.getName(UserRole.TEACHING_ASSISTANT) + ' 강의실 접속 현황',
            //     'menu': ['website/instructor_access'],
            //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
            //     'markPrefixList': []
            // },
        ]
    },
    {
        'id': 'N06',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu06.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_survey_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_survey_management_pressed.png',

        'text': '설문',
        'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
        'subMenuList': [

            {
                'id': 'N0601',

                'text': '설문참여', 'menu': ['survey/survey'],
                'exclude': [UserRole.ADMIN, UserRole.INSTITUTION_ADMIN],
                'markPrefixList': [
                    'survey/survey_detail'
                ]
            },

            {
                'id': 'N0602',

                'text': '설문지 관리', 'menu': ['survey/register'],
                'exclude': [],
                'markPrefixList': [
                    'survey/register_detail',
                    'survey/register_write'
                ]
            },

            // {
            //     'id': 'N0603',
            //
            //     'text': '설문조사 시작하기', 'menu': ['survey/start_survey'],
            //     'exclude': [],
            //     'markPrefixList': [
            //         'survey/start_survey_step2'
            //     ]
            // },

            {
                'id': 'N0604',

                'text': '설문 진행 및 결과 확인', 'menu': ['survey/result'],
                'exclude': [],
                'markPrefixList': [
                    'survey/result_view',
                    'survey/start_survey',
                    'survey/start_survey_step2'
                ]
            }
        ]
    },
    {
        'id': 'N07',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu05.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_homepage_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_homepage_management_pressed.png',
        'text': 'Help Desk',
        'hidden': (Server.allowHomepageOperation == '0' && Server.allowBoardOperation == '0'),
        'exclude': [UserRole.ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
        'subMenuList': [

            {
                'id': 'N0701',

                'menu': ['homepage/notice'],
                'text': '공지사항',
                'markPrefixList': [
                    'homepage/notice_detail',
                    'homepage/notice_write'
                ]
            },
            {
                'id': 'N0702',

                'menu': ['homepage/download'],
                'text': '자료실',
                'markPrefixList': [
                    'homepage/download_detail',
                    'homepage/download_write'
                ]
            },
            {
                'id': 'N0703',

                'menu': ['homepage/faq'],
                'text': '자주묻는질문',
                'markPrefixList': [
                    'homepage/faq_category_manage',
                    'homepage/faq_category_register',
                    'homepage/faq_detail',
                    'homepage/faq_write'
                ]
            },
            {
                'id': 'N0704',

                'menu': ['homepage/question'],
                'text': '질의응답',
                'markPrefixList': [
                    'homepage/question_category_manage',
                    'homepage/question_category_register',
                    'homepage/question_detail',
                    'homepage/question_write'
                ]
            },
            // {
            //     'id': 'N0705',
            //     'exclude': [UserRole.STUDENT],
            //     'menu': ['homepage/teacher_community'],
            //     'text': '교수자 커뮤니티',
            //     'markPrefixList': [
            //         'homepage/teacher_community_detail',
            //         'homepage/teacher_community_write'
            //     ]
            // }
        ]
    },
    // {
    //     'id': 'N08',
    //
    //     'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu07.png',
    //
    //     'logoImageUrl': '/res/cms/img/index/img_gnb_message_management.png',
    //     'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_message_management_pressed.png',
    //     'text': '메시지',
    //     'menu': ['message'],
    //     'exclude': [UserRole.CONTENT_PROVIDER],
    //     'hidden': (Server.isOrganizationTeacher == '1'),
    //     'subMenuList': [
    //         {
    //             'id': 'N0801',
    //
    //             'text': '문자 템플릿', 'menu': ['message/template/text'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/template_detail',
    //                 'message/template_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0802',
    //
    //             'text': '자동문자', 'menu': ['message/auto/text'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/auto_detail',
    //                 'message/auto_text_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0803',
    //
    //             'text': '문자 발송', 'menu': ['message/history/text'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/history_detail/text'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0804',
    //
    //             'text': '이메일 템플릿', 'menu': ['message/template/email'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.EMAIL),
    //             'markPrefixList': [
    //                 'message/template_detail',
    //                 'message/template_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0805',
    //
    //             'text': '자동 이메일', 'menu': ['message/auto/email'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.EMAIL),
    //             'markPrefixList': [
    //                 'message/auto_email_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0806',
    //
    //             'text': '이메일 발송', 'menu': ['message/history/email'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.EMAIL),
    //             'markPrefixList': [
    //                 'message/history_detail/email'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0807',
    //
    //             'text': '쪽지/알림 발송', 'menu': ['message/history/internal'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.INTERNAL_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/history_detail/internal'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0808',
    //
    //             'text': 'PUSH 메시지 발송', 'menu': ['message/history/push'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.PUSH_MESSAGE),
    //             'markPrefixList': [
    //                 'message/history_detail/push'
    //             ]
    //         }
    //     ]
    // },
    {
        'id': 'N09',

        'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu09.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_statistics.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_statistics_pressed.png',
        'text': '통계',
        'menu': ['statistic'],
        'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT],
        'subMenuList': [
            {
                'id': 'N0902',

                'text': '사용자 통계', 'menu': ['statistic/user_statistics']
            },

            {
                'id': 'N0902',

                'text': '학생 수강 통계', 'menu': ['statistic/department_student_statistics']
            },
            {
                'id': 'N0903',

                'text': '강의실 별 수강 통계', 'menu': ['statistic/department_course_statistics']
            }
        ]
    },
    {
        'id': 'N04',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu03.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_operation_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_operation_management_pressed.png',
        'text': '운영 설정',
        'exclude': [UserRole.CONTENT_PROVIDER],
        'hidden': (Server.allowTermOperation == '0'),
        'subMenuList': [

            {
                'id': 'N1102',
                'text': Strings.getString(Strings.INSTITUTION) + ' 관리', 'menu': ['operation_manage/institution'],
                'markPrefixList': [
                    'operation_manage/institution_write'
                ],
                'markSubMenuList': [
                    BaseSubMenuList.DEFAULT_MENU_LIST['operation_manage/institution_manage']
                ]
            },
            {
                'id': 'N040102',

                'text': Strings.getString(Strings.DEPARTMENT), 'menu': ['operation_manage/department'],
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'hidden': Configs.containsServiceProviderType(ServiceProviderType.ADULT_EDUCATION),
                'markPrefixList': [],
                'markSubMenuList': [
                    BaseSubMenuList.DEFAULT_MENU_LIST['operation_manage/department_manage']
                ]
            },
            // {
            //     'id': 'N040207',
            //
            //     'text': Strings.getString(Strings.INSTITUTION) + '별 재수강 정책',
            //     'menu': ['website/institution_retake_setting'],
            //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR]
            // },
            // {
            //     'id': 'N040206',
            //
            //     'text': Strings.getString(Strings.INSTITUTION) + '별 수료기준 및 평가비율',
            //     'menu': ['website/institution_grade_setting'],
            //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR]
            // },
            {

                id: 'N040105',

                'text': '사용자 약관', 'menu': ['user/terms_of_service'],
                'markPrefixList': [
                    'user/terms_of_service_detail',
                    'user/terms_of_service_register'
                ]
            },
            {

                id: 'N040106',

                'text': '게시판 금칙어', 'menu': ['operation_manage/forbidden_word_manage'],
                'markPrefixList': [
                    'operation_manage/writer_restriction',
                    'operation_manage/restriction_register'
                ]
            },

            {

                id: 'N040107',

                'text': '홈페이지', 'menu': ['menu'],
                'exclude': [UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': []
            },

            {
                id: 'N040108',

                'text': '배너', 'menu': ['homepage/banner'],
                'exclude': [UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'homepage/banner_detail',
                    'homepage/banner_write'
                ]
            }
        ]
    },
    // {
    //     'id': 'N11',
    //
    //     // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu08.png',
    //     'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico14.png',
    //     'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico14_pressed.png',
    //
    //     'logoImageUrl': '/res/cms/img/index/img_gnb_system_management.png',
    //     'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_system_management_pressed.png',
    //     'text': '시스템',
    //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
    //     'subMenuList': [
    //
    //         {
    //             'id': 'N1101',
    //
    //             'menu': ['system/notice'],
    //             'text': '시스템 공지사항',
    //             'markPrefixList': [
    //                 'system/notice_detail',
    //                 'system/notice_write'
    //             ]
    //         },
    //         {
    //             'id': 'N1102',
    //
    //             'menu': ['system/download'],
    //             'text': '시스템 자료실',
    //             'markPrefixList': [
    //                 'system/download_detail',
    //                 'system/download_write'
    //             ]
    //         },
    //         {
    //             'id': 'N1103',
    //
    //             'menu': ['system/question'],
    //             'text': '시스템 문의사항',
    //             'markPrefixList': [
    //                 'system/question_category_manage',
    //                 'system/question_category_register',
    //                 'system/question_detail',
    //                 'system/question_write'
    //             ]
    //         },
    //         {
    //             'id': 'N1104',
    //
    //             'menu': ['system/usage'],
    //             'text': '시스템 사용량',
    //             'hidden' : Server.isServiceProviderAdministrator!=1
    //         }
    //
    //     ]
    // },

    {
        'id': 'N08',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico3.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico3_pressed.png',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu07.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_message_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_message_management_pressed.png',
        'text': '메시지',
        'menu': ['message'],
        'exclude': [UserRole.CONTENT_PROVIDER],
        'hidden': (Server.isOrganizationTeacher == '1'),
        'subMenuList': [
            // {
            //     'id': 'N0801',
            //
            //     'text': '문자 템플릿', 'menu': ['message/template/text'],
            //     'exclude': [],
            //     'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
            //     'markPrefixList': [
            //         'message/template_detail',
            //         'message/template_write'
            //     ]
            // },
            //
            // {
            //     'id': 'N0802',
            //
            //     'text': '자동문자', 'menu': ['message/auto/text'],
            //     'exclude': [],
            //     'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
            //     'markPrefixList': [
            //         'message/auto_detail',
            //         'message/auto_text_write'
            //     ]
            // },
            //

            //
            // {
            //     'id': 'N0804',
            //
            //     'text': '이메일 템플릿', 'menu': ['message/template/email'],
            //     'exclude': [],
            //     'hidden': !Configs.getConfig(Configs.EMAIL),
            //     'markPrefixList': [
            //         'message/template_detail',
            //         'message/template_write'
            //     ]
            // },
            //
            // {
            //     'id': 'N0805',
            //
            //     'text': '자동 이메일', 'menu': ['message/auto/email'],
            //     'exclude': [],
            //     'hidden': !Configs.getConfig(Configs.EMAIL),
            //     'markPrefixList': [
            //         'message/auto_email_write'
            //     ]
            // },


            {
                'id': 'N0806',

                'text': '이메일', 'menu': ['message/history/email'],
                'exclude': [],
                'hidden': !Configs.getConfig(Configs.EMAIL),
                'markPrefixList': [
                    'message/history_detail/email'
                ]
            },

            {
                'id': 'N0807',

                'text': '문자 메세지', 'menu': ['message/history/text'],
                'exclude': [],
                'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
                'markPrefixList': [
                    'message/history_detail/text'
                ]
            },

            // {
            //     'id': 'N0807',
            //
            //     'text': '쪽지/알림 발송', 'menu': ['message/history/internal'],
            //     'exclude': [],
            //     'hidden': (Configs.getConfig(Configs.INTERNAL_MESSAGE) != true),
            //     'markPrefixList': [
            //         'message/history_detail/internal'
            //     ]
            // },
            //
            // {
            //     'id': 'N0808',
            //
            //     'text': 'PUSH 메시지 발송', 'menu': ['message/history/push'],
            //     'exclude': [],
            //     'hidden': !Configs.getConfig(Configs.PUSH_MESSAGE),
            //     'markPrefixList': [
            //         'message/history_detail/push'
            //     ]
            // }
        ]
    },

    {

        'id': 'statistics',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu09.png',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico7.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico7_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_statistics.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_statistics_pressed.png',

        'text': '통계',
        'subMenuList': [

            {
                'id': 'statistics_01',

                'text': '종사자 보수교육 현황',
                'menu': ['stat/statistics'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
            },
            {
                'id': 'statistics_02',

                'text': '과정 현황',
                'menu': ['stat/status'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
            },

            {
                'id': 'statistics_02',

                'text': '교육생 목록',
                'menu': ['stat/enrollment_list'],
                'exclude': [UserRole.ACADEMIC_ADVISOR],
                'hidden': (Server.allowBoardOperation == '0' && Server.allowTermOperation == '0'),
            },
        ]
    },


    {
        'id': 'N15',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6_pressed.png',
        'text': '교육확인서 발급관리',
        'menu': ['certificate'],
        'markPrefixList': [
            'certificate',
            'certificate_write',
            'certificate_detail'
        ]
    },

    {
        'id': 'N15',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10_pressed.png',
        'text': '관리자 게시판',

        'menu': ['homepage/admin'],
        'markPrefixList': [
            'homepage/admin_detail',
            'homepage/admin_write'
        ]
    },

    {
        'id': 'N14',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico13.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico13_pressed.png',
        'text': '관리자 메뉴얼',
        'openUrl': '/res/data/한국여성인권진흥원_관리자매뉴얼(211109).pdf'
    },


    {
        'id': 'N12',

        'logoImageUrl': '/res/cms/img/index/img_gnb_user_profile.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_user_profile_pressed.png',
        'text': '내 정보',
        'menu': ['myinfo'],
        'markPrefixList': [
            'myinfo_edit'
        ]
    },
    // {
    //     'id': 'N13',
    //
    //     // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu10.png',
    //     'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15.png',
    //     'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15_pressed.png',
    //
    //     'logoImageUrl': '/res/cms/img/index/img_gnb_logout.png',
    //     'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_logout_pressed.png',
    //     'menu': ['logout'],
    //     'text': '로그아웃'
    // }

];

for (var key in userRoleCodeMap) {

    var list = BaseMenuList.DEFAULT_MENU_LIST;
    BaseMenuList[key] = MenuHelper.menuMapping(list, key);
}

BaseMenuList[UserRole.ADMIN] = [

    {
        'id': 'N01',
        'logoImageUrl': '/res/cms/img/index/img_gnb_home.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_home_pressed.png',
        'text': '대시보드',
        'menu': ['home'],
        'exclude': [UserRole.STUDENT],
        'markPrefixList': [
            'teacher_dashboard'
        ]
    },
    {
        'id': 'N11',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu08.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico14.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico14_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_system_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_system_management_pressed.png',
        'text': '시스템',
        'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
        'subMenuList': [

            {
                'id': 'N1101',

                'menu': ['system/notice'],
                'text': '시스템 공지사항',
                'markPrefixList': [
                    'system/notice_detail',
                    'system/notice_write'
                ]
            },
            {
                'id': 'N1102',

                'menu': ['system/download'],
                'text': '시스템 자료실',
                'markPrefixList': [
                    'system/download_detail',
                    'system/download_write'
                ]
            },
            {
                'id': 'N1103',

                'menu': ['system/question'],
                'text': '시스템 문의사항',
                'markPrefixList': [
                    'system/question_category_manage',
                    'system/question_category_register',
                    'system/question_detail',
                    'system/question_write'
                ]
            },
            {
                'text': 'API 요청키', 'menu': ['api/api_key'],
                'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'api/api_key_detail',
                    'api/api_key_write'
                ]
            },
            {
                'id': 'N1103',
                'text': '시스템 환경설정', 'menu': ['monitoring/environment'],
                'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
                'markPrefixList': [
                    'monitoring/environment_edit'
                ]
            },
            {

                id: 'N040105',

                'text': '서비스 이용약관 관리', 'menu': ['user/terms_of_service'],
                'markPrefixList': [
                    'user/terms_of_service_detail',
                    'user/terms_of_service_register'
                ]
            },

            {

                id: 'N040106',

                'text': '시스템 사용량', 'menu': ['system/usage'],
                'markPrefixList': []
            },
        ]
    },
    {
        'id': 'N04',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu03.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_operation_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_operation_management_pressed.png',
        'text': '고객사',
        'exclude': [UserRole.CONTENT_PROVIDER],
        'hidden': (Server.allowTermOperation == '0'),
        'subMenuList': [

            {
                'id': 'N1102',
                'text': Strings.getString(Strings.SERVICE_PROVIDER) + ' 관리',
                'menu': ['operation_manage/service_provider'],
                'markPrefixList': [
                    'operation_manage/service_provider_write',
                    'operation_manage/service_provider_detail'
                ],
                'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR]
            },
            {
                'id': 'N1102',
                'text': Strings.getString(Strings.INSTITUTION) + ' 관리', 'menu': ['operation_manage/institution'],
                'markPrefixList': [
                    'operation_manage/institution_write'
                ],
                'markSubMenuList': [
                    BaseSubMenuList.DEFAULT_MENU_LIST['operation_manage/institution_manage']
                ]
            },
        ]
    },
    {
        'id': 'N03',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu02.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico9.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico9_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_user_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_user_management_pressed.png',
        'text': '사용자',
        'exclude': [UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
        'menu': ['user/account']
    },
    {
        'id': 'N06',

        // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu06.png',
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2_pressed.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_survey_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_survey_management_pressed.png',

        'text': '설문',
        'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
        'subMenuList': [

            {
                'id': 'N0602',

                'text': '설문지 관리', 'menu': ['survey/register'],
                'exclude': [],
                'markPrefixList': [
                    'survey/register_detail',
                    'survey/register_write'
                ]
            },

            // {
            //     'id': 'N0603',
            //
            //     'text': '설문조사 시작하기', 'menu': ['survey/start_survey'],
            //     'exclude': [],
            //     'markPrefixList': [
            //         'survey/start_survey_step2'
            //     ]
            // },

            {
                'id': 'N0604',

                'text': '설문 진행 및 결과 확인', 'menu': ['survey/result'],
                'exclude': [],
                'markPrefixList': [
                    'survey/result_view',
                    'survey/start_survey',
                    'survey/start_survey_step2'
                ]
            }

        ]
    },
    // {
    //     'id': 'N08',
    //
    //     'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu07.png',
    //
    //     'logoImageUrl': '/res/cms/img/index/img_gnb_message_management.png',
    //     'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_message_management_pressed.png',
    //     'text': '메시지',
    //     'menu': ['message'],
    //     'exclude': [UserRole.CONTENT_PROVIDER],
    //     'hidden': (Server.isOrganizationTeacher == '1'),
    //     'subMenuList': [
    //         {
    //             'id': 'N0801',
    //
    //             'text': '문자 템플릿', 'menu': ['message/template/text'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/template_detail',
    //                 'message/template_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0802',
    //
    //             'text': '자동문자', 'menu': ['message/auto/text'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/auto_detail',
    //                 'message/auto_text_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0803',
    //
    //             'text': '문자 발송', 'menu': ['message/history/text'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.TEXT_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/history_detail/text'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0804',
    //
    //             'text': '이메일 템플릿', 'menu': ['message/template/email'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.EMAIL),
    //             'markPrefixList': [
    //                 'message/template_detail',
    //                 'message/template_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0805',
    //
    //             'text': '자동 이메일', 'menu': ['message/auto/email'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.EMAIL),
    //             'markPrefixList': [
    //                 'message/auto_email_write'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0806',
    //
    //             'text': '이메일 발송', 'menu': ['message/history/email'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.EMAIL),
    //             'markPrefixList': [
    //                 'message/history_detail/email'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0807',
    //
    //             'text': '쪽지/알림 발송', 'menu': ['message/history/internal'],
    //             'exclude': [],
    //             'hidden': (Configs.getConfig(Configs.INTERNAL_MESSAGE) != true),
    //             'markPrefixList': [
    //                 'message/history_detail/internal'
    //             ]
    //         },
    //
    //         {
    //             'id': 'N0808',
    //
    //             'text': 'PUSH 메시지 발송', 'menu': ['message/history/push'],
    //             'exclude': [],
    //             'hidden': !Configs.getConfig(Configs.PUSH_MESSAGE),
    //             'markPrefixList': [
    //                 'message/history_detail/push'
    //             ]
    //         }
    //     ]
    // },
    {
        'id': 'N09',

        'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu09.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_statistics.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_statistics_pressed.png',
        'text': '통계',
        'menu': ['statistic'],
        'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT],
        'subMenuList': [
            {
                'id': 'N0902',

                'text': '사용자 통계', 'menu': ['statistic/user_statistics']
            },

            {
                'id': 'N0902',

                'text': '학생 수강 통계', 'menu': ['statistic/department_student_statistics']
            },
            {
                'id': 'N0903',

                'text': '강의실 별 수강 통계', 'menu': ['statistic/department_course_statistics']
            }
        ]
    },
    {
        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico6_pressed.png',
        'text': '교육확인서 발급관리',
        'menu': ['certificate'],
        'markPrefixList': [
            'certificate',
            'certificate_write',
            'certificate_detail'
        ]
    },
    // {
    //     'id': 'N13',
    //
    //     // 'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu10.png',
    //     'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15.png',
    //     'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15_pressed.png',
    //
    //     'logoImageUrl': '/res/cms/img/index/img_gnb_logout.png',
    //     'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_logout_pressed.png',
    //     'menu': ['logout'],
    //     'text': '로그아웃'
    // }

];

BaseMenuList[UserRole.TEACHER] = [

    {
        'id': 'T01',

        'text': '대시보드',
        'menu': ['home']
    },
    {
        'id': 'T02',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico1.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico1_pressed.png',

        'text': '통합 관리',
        'menu': ['website'],
        'subMenuList': [

            {
                'id': 'T0201',

                'text': Strings.getString(Strings.COURSE) + ' 공지사항', 'menu': ['website/notice'],
                'markPrefixList': [
                    'website/notice_detail',
                    'website/notice_write'
                ]
            },
            {
                'id': 'T0202',

                'text': Strings.getString(Strings.COURSE) + ' 자료실', 'menu': ['website/dataroom'],
                'markPrefixList': [
                    'website/dataroom_detail',
                    'website/dataroom_write'
                ]
            },
            {
                'id': 'T0203',

                'text': Strings.getString(Strings.COURSE) + ' 질의응답', 'menu': ['website/board'],
                'markPrefixList': [
                    'website/board_detail',
                    'website/board_write'
                ]
            },
            {
                'id': 'T0204',

                'text': '콘텐츠 오류 신고', 'menu': ['website/error_notify'],
                'markPrefixList': [
                    'website/error_notify_detail',
                    'website/error_notify_write'
                ]
            },
            {
                'id': 'T0205',

                'text': '학습자 제출물 관리', 'menu': ['website/student_work'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_work_detail'
                ]
            },

            {
                'id': 'T0206',

                'text': '학습 모니터링', 'menu': ['website/student_monitoring'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_report_detail'
                ]
            }
        ]
    },
    {
        'id': 'T03',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico5_pressed.png',

        'text': '담당 ' + Strings.getString(Strings.COURSE),
        'menu': ['operation_manage/course'],
        'exclude': [],
        'markPrefixList': [
            'operation_manage/create_course',
            'operation_manage/course_operation_config_detail'
        ],
        'markSubMenuList': [
            BaseSubMenuList.DEFAULT_MENU_LIST['operation_manage/course_manage']
        ]
    },
    // {
    //     'id': 'T06',
    //
    //     'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu15.png',
    //     'text': '메시지',
    //     'menu': ['prof_service'],
    //     'subMenuList': [
    //         {
    //             'id': 'T0602',
    //
    //             'text': '나의 활동현황',
    //             'menu': ['my_activity']
    //         },
    //         {
    //             'id': 'T0603',
    //
    //             'text': 'SMS 발송이력',
    //             'menu': ['message/history/text']
    //         },
    //         {
    //             'id': 'T0604',
    //
    //             'text': 'PUSH 발송이력',
    //             'menu': ['message/history/push']
    //         }
    //     ]
    //
    // },
    {
        'id': 'T09',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico2_pressed.png',

        'text': '설문',
        'menu': ['survey'],
        'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.CONTENT_PROVIDER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR],
        'subMenuList': [


            {
                'id': 'T0901',

                'text': '설문 참여', 'menu': ['survey/survey'],
                'exclude': [UserRole.ADMIN, UserRole.INSTITUTION_ADMIN],
                'markPrefixList': [
                    'survey/survey_detail'
                ]
            },

            {
                'id': 'T0902',

                'text': '설문지 관리', 'menu': ['survey/register'],
                'exclude': [],
                'markPrefixList': [
                    'survey/register_detail',
                    'survey/register_write'
                ]
            },

            // {
            //     'id': 'T0903',
            //
            //     'text': '설문조사 시작하기', 'menu': ['survey/start_survey'],
            //     'exclude': [],
            //     'markPrefixList': [
            //         'survey/register_detail',
            //         'survey/register_write',
            //         'survey/start_survey_step2'
            //     ]
            // },

            {
                'id': 'T0904',

                'text': '설문 진행 및 결과 확인', 'menu': ['survey/result'],
                'exclude': [],
                'markPrefixList': [
                    'survey/result_view',
                    'survey/start_survey',
                    'survey/start_survey_step2'
                ]
            }
        ]
    },
    {
        'id': 'T08',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico10_pressed.png',

        'text': 'Help Desk',
        'menu': ['homepage'],
        'exclude': [UserRole.ADMIN],
        'subMenuList': [
            {
                'id': 'T0801',

                'menu': ['homepage/notice'],
                'text': '공지사항',
                'markPrefixList': [
                    'homepage/notice_category_manage',
                    'homepage/notice_category_register',
                    'homepage/notice_detail',
                    'homepage/notice_write'
                ]
            },
            {
                'id': 'T0802',

                'menu': ['homepage/download'],
                'text': '자료실',
                'markPrefixList': [
                    'homepage/download_detail',
                    'homepage/download_write'
                ]
            },
            {
                'id': 'T0803',

                'menu': ['homepage/faq'],
                'text': '자주묻는질문',
                'markPrefixList': [
                    'homepage/faq_category_manage',
                    'homepage/faq_category_register',
                    'homepage/faq_detail',
                    'homepage/faq_write'
                ]
            },
            {
                'id': 'T0804',

                'menu': ['homepage/question'],
                'text': '질의응답',
                'markPrefixList': [
                    'homepage/question_category_manage',
                    'homepage/question_category_register',
                    'homepage/question_detail',
                    'homepage/question_write'
                ]
            },
            {
                'id': 'T0804',
                'exclude': [UserRole.STUDENT],
                'menu': ['homepage/teacher_community'],
                'text': '교수자 커뮤니티',
                'markPrefixList': [
                    'homepage/teacher_community_detail',
                    'homepage/teacher_community_write'
                ]
            }
        ]
    },
    {
        'id': 'T10',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico12.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico12_pressed.png',

        'text': '나의 활동현황',
        'menu': ['my_activity'],
        'exclude': [],
        'markPrefixList': [
            'my_activity'
        ],
    },

    {
        'id': 'N14',

        'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico13.png',
        'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico13_pressed.png',
        'text': '교수자 메뉴얼',
        'openUrl': '/res/data/여성인권진흥원_학습관리시스템_교수자_매뉴얼.pdf'
    },


    {
        'id': 'T11',

        'text': '내 정보',
        'menu': ['myinfo'],
        'exclude': [],
        'markPrefixList': [
            'myinfo'
        ]
    },

    // {
    //     'id': 'T12',
    //
    //     'iconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15.png',
    //     'pressedIconImageUrl': '/res/lia/triton/img/menu_sidedropdown/ico15_pressed.png',
    //
    //     'menu': ['logout'],
    //     'text': '로그아웃'
    // }
];

BaseMenuList[UserRole.TEACHING_ASSISTANT] = [

    {
        'id': 'A01',

        'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu_home.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_home.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_home_pressed.png',
        'text': '대시보드',
        'menu': ['home']
    },
    {
        'id': 'A02',

        'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu01.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_integrated_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_integrated_management_pressed.png',
        'text': '통합 관리',
        'menu': ['website'],
        'subMenuList': [

            {
                'id': 'A0201',

                'text': Strings.getString(Strings.COURSE) + ' 공지사항', 'menu': ['website/notice'],
                'markPrefixList': [
                    'website/notice_detail',
                    'website/notice_write'
                ]
            },
            {
                'id': 'A0202',

                'text': Strings.getString(Strings.COURSE) + ' 자료실', 'menu': ['website/dataroom'],
                'markPrefixList': [
                    'website/dataroom_detail',
                    'website/dataroom_write'
                ]
            },
            {
                'id': 'A0203',

                'text': Strings.getString(Strings.COURSE) + ' 질의응답', 'menu': ['website/board'],
                'markPrefixList': [
                    'website/board_detail',
                    'website/board_write'
                ]
            },
            {
                'id': 'A0204',

                'text': '콘텐츠 오류 신고', 'menu': ['website/error_notify'],
                'markPrefixList': [
                    'website/error_notify_detail',
                    'website/error_notify_write'
                ]
            },
            // {
            //     'text': Strings.getString(Strings.COURSE) + ' 수강생/청강생 관리', 'menu': ['website/user_manage'],
            //     'markPrefixList': [
            //         'website/user_manage_detail',
            //         'website/course_enrollment_register',
            //         'website/sign_course_register'
            //     ]
            // },
            {
                'id': 'A0205',

                'text': '학습자 제출물 관리', 'menu': ['website/student_work'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_work_detail'
                ]
            },

            {
                'id': 'A0206',

                'text': '학습 모니터링', 'menu': ['website/student_monitoring'],
                'exclude': [],
                'markPrefixList': [
                    'website/student_monitoring_detail'
                ]
            }]
    },
    {
        'id': 'A03',

        'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu03.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_operation_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_operation_management_pressed.png',
        'text': '강의 운영',
        'menu': ['operation_manage/course'],
        'exclude': [],
        'markPrefixList': [
            'operation_manage/create_course',
            'operation_manage/course_operation_config_detail'
        ],
        'markSubMenuList': [
            BaseSubMenuList.DEFAULT_MENU_LIST['operation_manage/course_manage']
        ]
    },

    {
        'id': 'A09',

        'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu06.png',

        'logoImageUrl': '/res/cms/img/index/img_gnb_survey_management.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_survey_management_pressed.png',
        'text': '설문',
        'menu': ['survey/survey'],
        'markPrefixList': [
            'survey/survey_detail'
        ]
    },

    {
        'id': 'A11',

        'logoImageUrl': '/res/cms/img/index/img_gnb_user_profile.png',
        'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_user_profile_pressed.png',
        'text': '내 정보',
        'menu': ['myinfo'],
        'markPrefixList': [
            'myinfo'
        ]
    },

    // {
    //     'id': 'A12',
    //
    //     'iconImageUrl': '/res/lia/triton/img/menu_topdropdown/ico_menu10.png',
    //
    //     'logoImageUrl': '/res/cms/img/index/img_gnb_logout.png',
    //     'pressedLogoImageUrl': '/res/cms/img/index/img_gnb_logout_pressed.png',
    //     'menu': ['logout'],
    //     'text': '로그아웃'
    // }
];


var BaseCategoryMenuList = {};
BaseCategoryMenuList.DEFAULT_MENU_LIST = [

    {
        'menu': ['user/account'],
        'exclude': [],
        items: [
            {
                name: '전체 보기',
                src: '/res/cms/img/category/user_account/img_tab_all.png',
                parameterMap: {
                    role_code_list: ''
                },
                'exclude': []
            },
            {
                name: UserRole.getName(UserRole.ADMIN),
                src: '/res/cms/img/category/user_account/img_tab_manager.png',
                parameterMap: {
                    role_code_list: UserRole.ADMIN
                },
                'exclude': [UserRole.INSTITUTION_ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
            },
            {
                name: UserRole.getName(UserRole.INSTITUTION_ADMIN),
                src: '/res/cms/img/category/user_account/img_tab_user03.png',
                parameterMap: {
                    role_code_list: UserRole.INSTITUTION_ADMIN
                },
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.INSTITUTION_ADMIN)

            },
            {
                name: UserRole.getName(UserRole.ORGANIZATION_ADMIN),
                src: '/res/cms/img/category/user_account/img_tab_user04.png',
                parameterMap: {
                    role_code_list: UserRole.ORGANIZATION_ADMIN
                },
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)
            },
            {
                name: UserRole.getName(UserRole.TEACHER),
                src: '/res/cms/img/category/user_account/img_tab_professor.png',
                parameterMap: {
                    role_code_list: UserRole.TEACHER
                },
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.TEACHER)
            },
            {
                name: UserRole.getName(UserRole.TEACHING_ASSISTANT),
                src: '/res/cms/img/category/user_account/img_tab_assistant.png',
                parameterMap: {
                    role_code_list: UserRole.TEACHING_ASSISTANT
                },
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.TEACHING_ASSISTANT)
            },
            {
                name: UserRole.getName(UserRole.ACADEMIC_ADVISOR),
                src: '/res/cms/img/category/user_account/img_tab_user01.png',
                parameterMap: {
                    role_code_list: UserRole.ACADEMIC_ADVISOR
                },
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.ACADEMIC_ADVISOR)
            },
            {
                name: UserRole.getName(UserRole.CONTENT_PROVIDER),
                src: '/res/cms/img/category/user_account/img_tab_user02.png',
                parameterMap: {
                    role_code_list: UserRole.CONTENT_PROVIDER
                },
                'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.CONTENT_PROVIDER)
            },
            {
                name: UserRole.getName(UserRole.STUDENT),
                src: '/res/cms/img/category/user_account/img_tab_student.png',
                parameterMap: {
                    role_code_list: UserRole.STUDENT
                },
                'exclude': [UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
                'hidden': !Configs.containsUserRole(UserRole.STUDENT)
            }
        ],
        defaultIndex: 0
    },

    {
        menu: ['operation_manage/course'],
        items: [
            {
                name: '전체',
                src: '/res/cms/img/category/learning_manage/img_tab_all.png',
                parameterMap: {
                    status_code_list: CourseStatus.WAITING + ',' + CourseStatus.REGISTERING + ',' + CourseStatus.OPERATING + ',' + CourseStatus.MARK_REVIEWING + ',' + CourseStatus.FINISHED + ',' + CourseStatus.REVIEWING
                },
                'exclude': []
            },
            {
                name: '운영',
                src: '/res/cms/img/category/learning_manage/img_tab_operating.png',
                parameterMap: {
                    status_code_list: CourseStatus.REGISTERING + ',' + CourseStatus.OPERATING + ',' + CourseStatus.MARK_REVIEWING
                },
                'exclude': []
            },
            {
                name: '종료',
                src: '/res/cms/img/category/learning_manage/img_tab_finished.png',
                parameterMap: {
                    status_code_list: CourseStatus.FINISHED + ',' + CourseStatus.REVIEWING
                },
                'exclude': []
            },
            {
                name: '대기',
                src: '/res/cms/img/category/learning_manage/img_tab_waiting.png',
                parameterMap: {
                    status_code_list: CourseStatus.WAITING
                },
                'exclude': []
            }
        ],
        defaultIndex: 0
    }

    // {
    //
    //    menu : [ 'website/user_manage' ],
    //    items : [
    //        {
    //            name: '상시제',
    //            src: '/res/cms/img/category/user_account/img_tab_manager.png',
    //            parameterMap : {
    //                term_type_code : TermType.DEFAULT
    //            }
    //        },
    //        {
    //            name: '기수제',
    //            src: '/res/cms/img/category/user_account/img_tab_manager.png',
    //            parameterMap : {
    //                term_type_code : TermType.REGULAR
    //            }
    //        }
    //    ],
    //    defaultIndex : 0
    //},

    // {
    //
    //    menu : [ 'survey/result' ],
    //    items : [
    //        {
    //            name: '진행 중',
    //            src: '/res/cms/img/category/learning_manage/img_tab_manager.png',
    //            parameterMap : {
    //                category : SurveyRequestStatus.STARTED
    //            }
    //        },
    //        {
    //            name: '진행 완료',
    //            src: '/res/cms/img/category/learning_manage/img_tab_running.png',
    //            parameterMap : {
    //                category : SurveyRequestStatus.FINISHED
    //            }
    //        },
    //        {
    //            name: '진행 대기',
    //            src: '/res/cms/img/category/learning_manage//img_tab_waiting.png',
    //            parameterMap : {
    //                category : SurveyRequestStatus.PENDING
    //            }
    //        },
    //        {
    //            name: '진행 취소',
    //            src: '/res/cms/img/category/learning_manage//img_tab_waiting.png',
    //            parameterMap : {
    //                category : SurveyRequestStatus.CANCELLED
    //            }
    //        }
    //    ],
    //    defaultIndex : 0
    //}

];


for (var key in userRoleCodeMap) {

    var menuList = [];

    var list = BaseCategoryMenuList.DEFAULT_MENU_LIST;
    for (var listKey in list) {

        var item = list[listKey];
        var exclude = item['exclude'];
        var hidden = item['hidden'];
        if (hidden == true) {
            continue;
        }

        if (exclude != undefined && exclude.length > 0) {

            var excluded = false;
            for (var j = 0, jl = exclude.length; j < jl; j++) {

                var roleCode = exclude[j];
                if (key == roleCode) {
                    excluded = true;
                    break;
                }
            }

            if (excluded == true) {
                continue;
            }
        }

        var menu = {};
        menu['menu'] = item['menu'];
        menu['defaultIndex'] = item['defaultIndex'];

        var subItemList = item['items'];
        if (subItemList != undefined) {

            var subMenuList = [];

            for (var j = 0, jl = subItemList.length; j < jl; j++) {

                var subItem = subItemList[j];
                var subExclude = subItem['exclude'];
                var subHIdden = subItem['hidden'];
                if (subHIdden == true) {
                    continue;
                }

                var subExcluded = false;

                if (subExclude != undefined && subExclude.length > 0) {

                    for (var k = 0, kl = subExclude.length; k < kl; k++) {

                        var subRoleCode = subExclude[k];
                        if (key == subRoleCode) {
                            subExcluded = true;
                            break;
                        }
                    }
                }

                if (subExcluded == true) {
                    continue;
                }

                var subMenu = {};
                subMenu['name'] = subItem['name'];
                subMenu['src'] = subItem['src'];
                subMenu['parameterMap'] = subItem['parameterMap'];
                subMenuList.push(subMenu);
            }

            menu['items'] = subMenuList;
        }

        menuList[listKey] = menu;
    }

    BaseCategoryMenuList[key] = menuList;
}

var BaseQuickMenuList = {};
BaseQuickMenuList.DEFAULT_MENU_LIST = [
    // {
    //     text: Strings.getString(Strings.COURSE_CODE) + ' 등록',
    //     menu: ['content/course_code_write'],
    //     menuParameterMap: {},
    //     iconImageUrl: '/res/lia/triton/img/quick_menu/img_quick_01.png',
    //     logoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_01.png',
    //     pressedLogoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_01_pressed.png',
    //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
    //     'hidden': false
    // },
    //
    // {
    //     text: Strings.getString(Strings.TERM) + ' 등록',
    //     menu: ['operation_manage/create_term'],
    //     menuParameterMap: {
    //         copy_term: 0
    //     },
    //     iconImageUrl: '/res/lia/triton/img/quick_menu/img_quick_02.png',
    //     logoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_02.png',
    //     pressedLogoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_02_pressed.png',
    //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
    //     'hidden': false
    // },
    //
    // {
    //     text: Strings.getString(Strings.TERM) + ' 복사',
    //     menu: ['operation_manage/create_term'],
    //     menuParameterMap: {
    //         copy_term: 1
    //     },
    //     iconImageUrl: '/res/lia/triton/img/quick_menu/img_quick_03.png',
    //     logoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_03.png',
    //     pressedLogoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_03_pressed.png',
    //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
    //     'hidden': false
    // },
    //
    // {
    //     text: Strings.getString(Strings.COURSE) + ' 등록',
    //     menu: ['operation_manage/create_course'],
    //     menuParameterMap: {},
    //     iconImageUrl: '/res/lia/triton/img/quick_menu/img_quick_04.png',
    //     logoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_04.png',
    //     pressedLogoImageUrl: '/res/lia/triton/img/quick_menu/img_quick_04_pressed.png',
    //     'exclude': [UserRole.ORGANIZATION_ADMIN, UserRole.TEACHER, UserRole.TEACHING_ASSISTANT, UserRole.ACADEMIC_ADVISOR, UserRole.CONTENT_PROVIDER, UserRole.STUDENT],
    //     'hidden': false
    // }

];


for (var key in userRoleCodeMap) {

    var menuList = [];

    var list = BaseQuickMenuList.DEFAULT_MENU_LIST;
    for (var listKey in list) {

        var item = list[listKey];
        var exclude = item['exclude'];
        var hidden = item['hidden'];
        if (hidden == true) {
            continue;
        }

        if (exclude != undefined && exclude.length > 0) {

            var excluded = false;
            for (var j = 0, jl = exclude.length; j < jl; j++) {

                var roleCode = exclude[j];
                if (key == roleCode) {
                    excluded = true;
                    break;
                }
            }

            if (excluded == true) {
                continue;
            }
        }

        var menu = {};
        menu['text'] = item['text'];
        menu['menu'] = item['name'];
        menu['onClick'] = item['onClick'];
        menu['menuParameterMap'] = item['menuParameterMap'];
        menu['iconImageUrl'] = item['iconImageUrl'];
        menu['logoImageUrl'] = item['logoImageUrl'];
        menu['pressedLogoImageUrl'] = item['pressedLogoImageUrl'];

        menuList.push(menu);
    }

    BaseQuickMenuList[key] = menuList;
}

Lia.setDebugMode(true);

ProjectSettings.CustomMenuBoard.onBoardListMode = function (menu) {

    var isFaq = Lia.p(menu, 'content', 'data', 'type_code') == BoardType.FAQ;

    if (isFaq) {
        return Triton.BoardList.Mode.DISPLAY_ORDER;
    } else {
        return Triton.BoardList.Mode.GENERAL;
    }
};
