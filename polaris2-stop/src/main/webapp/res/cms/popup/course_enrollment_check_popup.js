(function () {

    return {

        cssLoading: false,
        htmlLoading: false,
        
        onConstruct: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;

            var title = Lia.pd('수강 조건 확인', object, 'title');

            PopupHelper.appendLayout(popup, {
                title: title,
                css: {'width': '800px'}
            });
        },

        onInit: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;

            var jContent = popup.find('.popup_content');

                var item =  Lia.p(object, 'item');


                var statusCode = Lia.p(item ,'status_code')
                var courseId =  Lia.p(item, 'course_id');
                var studentUserIdx =  Lia.p(item, 'student_user_idx');
                var row =  Lia.p(object, 'row');
                var enrollProperties = Lia.p(item , 'properties')

                Requester.awb(ApiUrl.User.GET_USER, {
                    targetUserIdx : studentUserIdx
                }, function( status, data ) {

                    if ( !status ) {
                        return;
                    }


                    popup.user = Lia.p(data,'body');
                });

            Requester.awb(ApiUrl.Learning.GET_COURSE, {
                id : courseId
            }, function( status, data ) {

                if ( !status ) {
                    return;
                }

                popup.course = Lia.p(data,'body');

                console.log(popup.course)



            });




            Requester.func(function() {

                // console.log(popup.user);
                // console.log(popup.course);

                var userObj = popup.user;
                var courseObj = popup.course;
                var userPropertiesList = Lia.p(userObj , 'properties');

                var userProperties = {
                    'position' : Lia.p(userObj , 'company_position'),
                }
                for(var i in userPropertiesList) {
                    var item = Lia.p(userPropertiesList , i);
                    if(Lia.p(item , 'name') != 'certList' && Lia.p(item , 'name') != 'support' && Lia.p(item , 'name') != 'address_1_detail' && Lia.p(item , 'name') != 'career_present') {
                       userProperties[Lia.p(item, 'name')] = Lia.p(item, 'value');
                    }
                }
                var courseAttrList = Lia.p(courseObj , 'attribute_list');

                var agType1Boolean = false , agType2Boolean = false , careerBoolean = false, positionBoolean = false;
                var agTypeDp2Exist = false


                for (var i in courseAttrList) {
                    var attrId = Lia.p(courseAttrList , i , 'attribute_id');

                     for(var j in userProperties) {
                        if(attrId == Number(Lia.p(userProperties , j))) {
                            if(j == 'career') {
                                careerBoolean = true;
                            } else if(j == 'agTypeDp') {
                                agType1Boolean = true;
                            } else if(j == 'agTypeDp2') {
                                agType2Boolean = true;
                                agTypeDp2Exist = true;
                            } else if(j == 'position') {
                                positionBoolean = true;
                            }
                        }
                     }

                     if(agTypeDp2Exist == false) {
                         agType2Boolean = true;
                     }
                }

                //======================================================================================================

                    var panel = new Triton.Panel({
                        appendTo : jContent
                    });

                    var listTable = new Triton.ListTable({
                        appendTo : panel
                    } );

                    listTable.appendHeaderRow({})
                    listTable.appendHeaderColumn({
                        content : '소속기관 유형',
                        css : { width : '120px' }
                    });
                    listTable.appendHeaderColumn({
                        content : '교육대상(직위)',
                        css : { width : '120px' }
                    });
                    listTable.appendHeaderColumn({
                        content : '교육대상(경력)',
                        css : { width : '120px' }
                    });
                    listTable.appendHeaderColumn({
                        content : '첨부파일',
                        css : { width : '120px'
                        }});
                    listTable.appendHeaderColumn({
                        content : '재직증명서',
                        css : { width : '120px'}
                    });
                    listTable.appendHeaderColumn({
                        content : '재직증명서 확인여부',
                        css : { width : '120px'}
                    });



                    listTable.appendRow({
                        theme : Triton.ListTable.Row.Theme.NoLink,
                    })

                    if(agType2Boolean && agType1Boolean) {
                        listTable.appendColumn({
                            css: {'font-family': 'notokr-medium', 'color': '#0000ff'},
                            content: '일치'
                        });
                    } else {
                        listTable.appendColumn({
                            css : { 'font-family' :'notokr-medium', 'color' : '#ff0000'},
                            content : '불일치'
                        });
                    }


                    if(positionBoolean) {
                        listTable.appendColumn({
                            css: {'font-family': 'notokr-medium', 'color': '#0000ff'},
                            content: '일치'
                        });
                    } else {
                        listTable.appendColumn({
                            css: {'font-family': 'notokr-medium', 'color': '#ff0000'},
                            content: '불일치'
                        });
                    }


                    if(careerBoolean) {
                        listTable.appendColumn({
                            css: {'font-family': 'notokr-medium', 'color': '#0000ff'},
                            content: '일치'
                        });
                    } else {
                        listTable.appendColumn({
                            css: {'font-family': 'notokr-medium', 'color': '#ff0000'},
                            content: '불일치'
                        });
                    }


                    //양성교육 첨부파일
                    var docName = '';
                    var docUrl = '';

                    // console.log(courseObj)
                    // console.log(userProperties)

                    docUrl = Lia.p(enrollProperties , 'doc_url');
                    docName = Lia.p(enrollProperties , 'doc_name');

                    //console.log(docUrl , docName

                    if ( String.isNotBlank(docUrl) ) {
                        listTable.appendColumn({ content : new Triton.FlatButton({
                                theme : Triton.FlatButton.Theme.ListNormal,
                                content : '다운로드',
                                docUrl : docUrl,
                                docName : docName,
                                onClick : function(e) {

                                    e.preventDefault();
                                    e.stopPropagation();

                                    var docUrl = e.data.docUrl;
                                    var docName = e.data.docName;

                                     //docUrl = PathHelper.getFileUrl(docUrl);
                                    PathHelper.open(docUrl , docName)
                                }
                            }) });
                    } else {
                        listTable.appendColumn({ content : '-' });
                    }

                    //재직증명서
                    var companyAttachmentDocumentFile = Lia.p(userProperties , 'company_attachment_document_file');
                    if(String.isNotBlank(companyAttachmentDocumentFile)) {

                        var companyAttachmentDocumentFileItem = Lia.p(Lia.convertStrToObj(companyAttachmentDocumentFile), 0);
                        if ( companyAttachmentDocumentFileItem != undefined ) {

                            listTable.appendColumn({ content : new Triton.FlatButton({
                                    theme : Triton.FlatButton.Theme.ListNormal,
                                    content : '다운로드',
                                    companyAttachmentDocumentFileItem : companyAttachmentDocumentFileItem,
                                    onClick : function(e) {

                                        e.preventDefault();
                                        e.stopPropagation();

                                        var companyAttachmentDocumentFileItem = e.data.companyAttachmentDocumentFileItem;
                                        PathHelper.open(companyAttachmentDocumentFileItem['url'] , companyAttachmentDocumentFileItem['original_filename']);
                                    }
                                }) });

                        } else {
                            listTable.appendColumn({content : '-'})
                        }

                    } else {
                        listTable.appendColumn({content : '-'})
                    }

                    //재직증명서 확인
                    var companyAttachmentDocumentFileChecked = Lia.pcd(0, userProperties , 'company_attachment_document_file_checked');
                    var cb = new Triton.CheckBox({
                        manual : true,
                        onClick : function() {

                            var triton = $(this).getTriton();

                            var pressed = triton.getPressed();


                            Requester.awb(ApiUrl.User.SET_USER_PROPERTY , {
                                targetUserIdx : Number(studentUserIdx),
                                name : 'company_attachment_document_file_checked',
                                value : pressed?0:1
                            } , function (status) {

                                if(!status) {
                                    return;
                                }

                                triton.setPressed(!pressed);
                            });
                        }
                    });

                    cb.setStatus(companyAttachmentDocumentFileChecked)
                    listTable.appendColumn({content: cb});

                    var buttonSection = new Triton.Section({
                        appendTo : jContent,
                        css : { 'margin-top' :'10px'}
                    });


                    if(statusCode == CurriculumEnrollmentStatus.ENROLLMENT_REQUESTED) {

                        new Triton.FlatButton({
                            appendTo: buttonSection,
                            content: '수강승인',
                            theme: Triton.FlatButton.Theme.Normal,
                            css: {'margin-left': '5px', 'margin-right': '5px'},
                            onClick: function (e) {
                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '선택한 학습자의 수강을 승인하시겠습니까?', function () {

                                    Requester.awb(ApiUrl.Learning.ENROLL, {
                                        courseId: courseId,
                                        targetUserIdxList: studentUserIdx,
                                        putOnWaitingList: 0,
                                        reEnrollIfEnrolled: 0,
                                        isAuditing: 0
                                    }, function (status) {

                                        if (status != Requester.Status.SUCCESS) {
                                            return;
                                        }
                                        row.remove();
                                        popup.hide();
                                    });

                                }, true);

                            }
                        });

                        new Triton.FlatButton({
                            appendTo: buttonSection,
                            content: Strings.getString(Strings.COURSE_ENROLLMENT_STATUS.ENROLLMENT_REJECTED),
                            theme: Triton.FlatButton.Theme.Delete,
                            css: {'margin-left': '5px', 'margin-right': '5px'},
                            onClick: function (e) {
                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '정말 '+ Strings.getString(Strings.COURSE_ENROLLMENT_STATUS.ENROLLMENT_REJECTED)+' 하시겠습니까?', function () {

                                    Requester.awb(ApiUrl.Learning.REJECT_COURSE_ENROLLMENT_REQUEST, {
                                        courseId: courseId,
                                        targetUserIdxList: studentUserIdx
                                    }, function (status) {

                                        if (status != Requester.Status.SUCCESS) {
                                            return;
                                        }

                                        row.remove();
                                        popup.hide();
                                        location.reload();
                                    });

                                }, true);

                            }
                        });
                    }


                if(String.isNotBlank(companyAttachmentDocumentFile)) {

                    new Triton.FlatButton({
                        appendTo: buttonSection,
                        content: '재직 증명서 삭제',
                        theme: Triton.FlatButton.Theme.Delete,
                        css: {'margin-left': '5px', 'margin-right': '5px'},
                        onClick: function (e) {

                            PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '정말 재직증명서를 삭제 하시겠습니까?', function () {

                                var properties = [];

                                properties.push({ name : 'company_attachment_document_file', value : '' });
                                properties.push({ name : 'company_attachment_document_file_checked', value : '' });
                                properties.push({ name : 'company_attachment_document_update_date', value : '' });
                                properties.push({ name : 'company_attachment_document_file_deleted_by_user_idx', value : Server.userIdx });
                                properties.push({ name : 'company_attachment_document_file_deleted_date', value : new Date().toString('yyyy-MM-dd HH:mm:ss') });
                                properties.push({ name : 'company_attachment_document_file_deleted', value : companyAttachmentDocumentFile });

                                Requester.awb(ApiUrl.User.SET_USER_PROPERTIES, {
                                    targetUserIdx: studentUserIdx,
                                    properties: JSON.stringify(properties)
                                }, function (status) {

                                    if (status != Requester.Status.SUCCESS) {
                                        return;
                                    }

                                    popup.hide();
                                    location.reload();
                                });

                            }, true);

                        }
                    });


                }



                    // new Triton.FlatButton({
                    //     appendTo: buttonSection,
                    //     content: '닫기',
                    //     theme: Triton.FlatButton.Theme.Delete,
                    //     css: {'margin-left': '5px'},
                    //     onClick: function (e) {
                    //         popup.hide();
                    //     }
                    // });
                });


        },


        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {

        }
    };
})();