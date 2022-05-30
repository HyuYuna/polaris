(function () {

    return {

        cssLoading: false,
        htmlLoading: false,
        
        onConstruct: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;

            var title = Lia.pd('수료증 사진 첨부', object, 'title');

            PopupHelper.appendLayout(popup, {
                title: title
            });
        },

        onInit: function (jLayout, path, object, jPopupListLayout) {

            var popup = this;

            var jContent = popup.find('.popup_content');

            jContent.css({
                'padding-left' : '15px',
                'padding-right' : '15px'
            })

            var profileUrl , profileName = ''

            var jProfile = $(' <div class="myinfo_info_company_doc">\n' +
                '                            <div class="myinfo_info_company_doc_input fw" style="width: 100px; height: 125px; border: 1px solid gray; margin-left: 199px;"></div>\n' +
                '                            <div class="myinfo_info_doc_upload" style="border: 1px solid rgb(23, 83, 157); cursor: pointer; border-top : none; display: inline-block; width: 100px; color: rgb(23, 83, 157); margin-bottom : 10px; height: 30px; line-height: 30px">사진첨부</div>\n' +
                '<div style="text-align: left;">\n' +
                '                            <p class="myinfo_desc" style="margin-top:20px;">양성교육 수료증 내 포함할 증명사진을 첨부해주세요.</p>\n' +
                '                            <p class="myinfo_desc" style="margin-bottom: 20px;"></p>\n' +
                '                            <p class="myinfo_desc" style="color: red; font-weight: bold">사진은 추후 변경이 불가능합니다.</p>\n' +
                '                            <p class="myinfo_desc" style="color: red; font-weight: bold">본인 확인이 가능한 증명사진으로 신중하게 등록해주세요.</p>\n' +
                '                            <p class="myinfo_desc" style="color: black; font-size: 12px; font-weight: bold; margin-bottom: 20px;">(잘못된 사진을 등록하여 발급도니 수료증으로 인한 불이익에 대해서는 책임지지 않습니다.)</p>\n' +
                '                            <p class="myinfo_desc"></p>\n' +
                '                            <p class="myinfo_desc">(사진을 제출함으로써 개인정보 제공에 동의합니다.)</p>\n' +
                '                            <p class="myinfo_desc">(교육생은 사진을 제출하지 않을 수 있으며, 이경우 수료증 발급이 불가합니다.)</p>\n' +
                '</div>\n' +
                '                            <div class="file_uploader"></div>\n' +

                '                        </div>')

            jContent.append(jProfile);

            jContent.find('.myinfo_info_company_doc_input').css({'background-color' : '#eeeeee', 'font-size' : '12px'});
            jContent.find('.myinfo_info_company_doc_input').append('<p style="margin-top : 40px;">사진형식</p>');
            jContent.find('.myinfo_info_company_doc_input').append('<p>.jpg .jpeg .png</p>');


            var profileObj = null
            var fileUploader = new Triton.Uploader({
                maxFileCount : 1,
                appendTo : jContent,
                css : {
                    display : 'none',
                    height : '30px',
                    overflow : 'none',
                },
                onUploaded : function (fileObj) {
                    profileObj = fileObj;
                    var url = Lia.p(fileObj,0 , 'url');
                    var fileName = Lia.p(fileObj,0 , 'original_filename');

                    jProfile.find('.myinfo_info_company_doc_input').empty();

                    jProfile.find('.myinfo_info_company_doc_input').css('background-image' , 'url("' + PathHelper.getFileUrl(url , fileName) + '")');
                    jProfile.find('.myinfo_info_company_doc_input').css('background-size' , 'cover');
                    jProfile.find('.myinfo_info_company_doc_input').css('background-position' , 'center');
                    jProfile.find('.myinfo_info_company_doc_input').css('background-repeat' , 'no-repeat');
                }
            })

            jProfile.find('.myinfo_info_doc_upload').on('click' , function() {
                jContent.find('input[type="file"]').trigger('click');
                // jContent.find('.triton_uploader').trigger('click');
            });

            jProfile.find('.myinfo_info_doc_delete').on('click' , function() {
                jProfile.find('.file_uploader_item_delete_button').trigger('click');
                jProfile.find('.myinfo_info_company_doc_input').val('')
            });


            var btnSection = new Triton.ButtonSection({
                appendTo: jContent,
                css: {'width': '500px'}
            });

            new Triton.FlatButton({
                appendTo: btnSection,
                content: '확인',
                theme: Triton.FlatButton.Theme.Normal,
                css: {marginRight : '5px' },
                onClick: function (e) {
                    var url = Lia.p(profileObj,0 , 'url');
                    var fileName = Lia.p(profileObj,0 , 'original_filename');

                    object.onCompleted(url , fileName)
                    popup.hide();
                }
            });
            new Triton.FlatButton({
                appendTo: btnSection,
                content: '취소',
                theme: Triton.FlatButton.Theme.Delete,
                css: { marginLeft : '5px'},
                onClick: function (e) {
                    popup.hide();
                }
            });

        },

        printPDF: function (pdfType, optionList, isConformation) {

            optionList['pdf_type'] = pdfType;

            console.log(optionList)
            console.log(JSON.stringify(optionList));

            Requester.owb(ApiUrl.Document.GET_COURSE_CERTIFICATE, {
                courseId: popup.courseId,
                targetUserIdx: popup.studentUserIdx,
                destFilename: Strings.getString(Strings.CERTIFICATE) + '.pdf',
                properties : JSON.stringify(optionList)
            });
        },

        onShow: function (jLayout, path, parameterMap, jPopupListLayout) {
        },
        onHide: function (jLayout, path, parameterMap, jPopupListLayout) {

        }
    };
})();