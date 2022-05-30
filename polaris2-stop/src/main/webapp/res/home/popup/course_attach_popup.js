
(function () {

    return {
        onInit: function (jLayout, path, parameterMap, jPopupListLayout) {
            var page = this

            var docApprove = null;
            var docAttachLink = null;
            var docName = null;
            var docSize = null;

            var userProp = null;
            var userProfile = null;

            var editparam = null

            //close button
            page.find('.close').on('click', {
                popup: page
            }, function (e) {
                var popup = e.data.popup;
                popup.hide();
            });

            page.find('.button_group .cancel').on('click', {
                popup: page
            }, function (e) {
                var popup = e.data.popup;
                popup.hide();
            });

            //파일 입력
            page.find('.popup_body .file_input_input').on('click' , function() {
                //file upload api
                var jBody = page.find('.popup_body');
                $.initFileUploader(jBody , {
                    onUploaded : function (fileObj) {
                        console.log(fileObj);
                        docAttachLink = Lia.p(fileObj[0] , 'url');
                        docName = Lia.p(fileObj[0] , 'original_filename');
                        docSize = Lia.p(fileObj[0] , 'size');

                        page.find('.file_name').text(docName)
                        page.find('.input_files .file_size').text('['+Lia.convertBytesToSize(docSize)+']')
                    }
                })
                jBody.find('.file_uploader input[type="file"]').trigger('click');
            })

            page.find('.file_delete').on('click' , function () {
                page.find('.file_name').text('제출된 파일이 없습니다.')
                page.find('.input_files .file_size').text('[0MB]')
                docAttachLink = null;
                docName = null;
                docSize = null;
            });


            //계속 버튼
            page.find('.button_group .continue').on('click' , function() {
                if(docAttachLink == null) {
                    alert('파일을 추가해 주세요.');
                } else {
                    // userProp.push({name : 'doc_name' , value : docName});
                    // userProp.push({name : 'doc_url' , value : docAttachLink});
                    // userProp.push({name : 'doc_size' , value : docSize});
                    // userProp.push({name : 'doc_approve' , value : '0'});
                    // editparam.properties = userProp;
                    // editparam.properties = JSON.stringify(editparam.properties);
                    // Requester.awb(ApiUrl.User.EDIT_USER_PROFILE ,editparam,function (status, data) {
                    //     if(status) {
                    //         page.find('.status_approve').text('승인대기');
                    //     }
                    // })

                    userProp = {
                        'doc_name' : docName,
                        'doc_url' : docAttachLink,
                        'doc_size' : docSize
                    }

                    // if(docName == null) {
                    //     parameterMap.onComplete(null);
                    //     return;
                    // }

                    if(Lia.p(parameterMap , 'termsOfServiceItemIdList') != undefined) {
                        parameterMap.onComplete(JSON.stringify(userProp), Lia.p(parameterMap, 'termsOfServiceItemIdList'));
                    } else {
                        parameterMap.onComplete(JSON.stringify(userProp));
                    }

                    // AjaxPopupHelper.enrollmentArgument(parameterMap.terms_of_service_id, undefined, function () {
                    // }, {
                    //     courseId: PageManager.pc('course_id'),
                    //     isAuditing: 0,
                    //     putOnWaitingList: 0,
                    //     reEnrollIfEnrolled: 0,
                    //     properties : JSON.stringify(userProp),
                    // });

                    // Requester.awb(ApiUrl.Learning.ENROLL, {
                    //     courseId: PageManager.pc('course_id'),
                    //     isAuditing: 0,
                    //     putOnWaitingList: 0,
                    //     reEnrollIfEnrolled: 0,
                    //     properties : JSON.stringify(userProp),
                    // }, function (status, data){
                    //     // 학생 체크
                    //     var code = Lia.p(data, 'code');
                    //
                    //     if(status == Requester.Status.SUCCESS) {
                    //         page.hide();
                    //         PopupManager.alert('안내', '수강신청이 완료되었습니다.<br/>신청목록으로 이동하시겠습니까?', function (){
                    //             Lia.redirect('/page/lms', {
                    //                 'm1': 'my_courses'
                    //             });
                    //         }, true)
                    //
                    //     } else {
                    //         // PopupManager.alertByResponse(data);
                    //     }
                    //
                    // })
                }
            })

            // Requester.awb(ApiUrl.User.GET_USER_PROFILE , {} , function (status, data) {
            //     var user = Lia.p(data , 'body');
            //     userProfile = user;
            //     userProp = Lia.p(user , 'properties');
            //
            //
            //     // editparam = {
            //     //     name : Lia.p(user, 'name'),
            //     //     address1: Lia.p(user, 'address_1'),
            //     //     genderCode : Lia.p(user , 'gender_code'),
            //     //     companyName : Lia.p(user, 'company_name'),
            //     //     companyPosition : Lia.p(user,'company_position'),
            //     //     email : Lia.p(user,'email'),
            //     //     mobilePhoneNumber : Lia.p(user,'mobile_phone_number'),
            //     //     dateOfBirth : user.date_of_birth.split(' ')[0],
            //     //     officePhoneNumber : Lia.p(user, 'office_phone_number'),
            //     //     receiveEmail : 0,
            //     //     receiveTextMessage : 0,
            //     //     receivePushMessage : 0,
            //     //     idx :  Lia.p(user, 'idx'),
            //     //     roleCode :  Lia.p(user,'role_code'),
            //     //     studentTypeCode :  Lia.p(user,'student_type_code'),
            //     //     statusCode :  Lia.p(user,'status_code'),
            //     //     allowedToEnroll : Lia.p(user,'allowed_to_enroll'),
            //     //     profileImageUrl : Lia.p(user,'profile_image_url')
            //     // }
            //
            //     // for(var i in userProp) {
            //     //     var item = userProp[i];
            //     //
            //     //     console.log(item);
            //     //
            //     //     if(item.name == 'doc_approve') {
            //     //         docApprove = item.value;
            //     //         if(docApprove == 0 || docApprove != null) {
            //     //                 page.find('.status_approve').text('미승인');
            //     //             } else if(docApprove == 1) {
            //     //                 page.find('.status_approve').text('승인완료');
            //     //             } else {
            //     //                 page.find('.status_approve').text('승인대기');
            //     //             }
            //     //     }
            //     //
            //     //     if(item.name == 'doc_name') {
            //     //         docName = item.value;
            //     //         page.find('.input_files .file_name').text(docName);
            //     //     }
            //     //
            //     //     if(item.name == 'doc_size') {
            //     //         docSize = item.value;
            //     //         page.find('.input_files .file_size').text('['+Lia.convertBytesToSize(docSize)+']');
            //     //     }
            //     // }
            // })


        },
        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {
        }
    };
})();

