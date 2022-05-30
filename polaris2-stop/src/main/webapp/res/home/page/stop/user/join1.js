(function () {

    return {

        onInit: function (j) {
            var page = this;

            var agreeShouldList = [];
            var agreeConfirmList = [];

            Requester.awb(ApiUrl.Document.GET_CURRENT_SIGN_UP_TERMS_OF_SERVICE , {
                serviceProviderId : Server.serviceProviderId
            } , function(status, data) {

                var articleList = Lia.p(data , 'body' , 'item_list');

                var list = [];

                if ( Array.isNotEmpty(articleList) ) {

                    for ( var i = 0, l =articleList.length; i < l; i++ ) {

                        var item = articleList[i];
                        var isOptional = Lia.p(item ,'is_optional');
                        var agreeId = Lia.p(item , 'id')

                        list.push(item['id']);

                        var jItem = $('<li class="terms_bx">\n' +
                            '                    <div class="course_sidebar_list">\n' +
                            '                        <div class="course_sidebar_list_depth1">\n' +
                            '                            <label><input type="checkbox" class="terms_box_check"><span class="checkmark"></span></label>\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '                    <div class="terms_box">\n' +
                            '                    </div>\n' +
                            '                </li>');

                        page.find('.terms_bx_list').append(jItem);
                        // jItem.find('.terms_box_check').after(Lia.p(item ,'title'));
                        jItem.find('.terms_box').html(Lia.p(item ,'body'));

                        jItem.find('input').attr('agreeId' , agreeId);

                        if(isOptional == 0) {
                            //필수
                            jItem.find('.terms_box_check').after(Lia.p(item ,'title') + '(필수)');
                            agreeShouldList.push(agreeId)

                        } else {
                            //선택
                            jItem.find('.terms_box_check').after(Lia.p(item ,'title') + '(선택)');
                        }


                    }
                }

                // page.agreementList = list.join(',');

            })

            //만약 전체 선택 체크박스가 체크된상태일경우
            page.find("#chk_all").on("click", function(e) {
                if ($(this).prop("checked")) {
                    page.find("input[type=checkbox]").prop("checked", true);
                } else {
                    page.find("input[type=checkbox]").prop("checked", false);
                }
            });

            page.find("input[type=checkbox]").on("click", function (e) {
                var isAllCheck= true;
                page.find("ul.terms_bx_list li").find("input[type=checkbox]").each(function() {

                    if (!$(this).prop("checked")) {
                        isAllCheck = false;
                        return false;
                    }
                });
                if( isAllCheck){
                    page.find("#chk_all").prop("checked", true);
                }else{
                    page.find("#chk_all").prop("checked", false);
                }
            });
            page.find(".btn_default").on("click", function (e) {
                e.preventDefault();
                PageManager.back();
            });

            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();

                page.find("input[type=checkbox]").each(function () {
                    if (!$(this).prop("checked")){
                    } else {
                        if($(this).attr('id') != 'chk_all') {
                            agreeConfirmList.push(Number($(this).attr('agreeId')));
                        }
                    }
                })

                var jForm = $('#join_form');
                var fs = new jQuery.FormSerializer();
                var termMap = fs.serialize(jForm);
                var agreementList = '';
                var shouldAgreeCnt = 0;

                for(var i in agreeShouldList) {

                    var item = agreeShouldList[i];
                    for ( var ii = 0, ll =agreeConfirmList.length; ii < ll; ii++ ) {

                        if ( item == agreeConfirmList[ii] ) {
                            shouldAgreeCnt++;
                            break;
                        }
                    }
                }

                if(shouldAgreeCnt != agreeShouldList.length) {
                    PopupManager.alert('한국여성인권진흥원','필수 항목에 대해 모두 동의해주세요.');
                } else {

                    agreementList = agreeConfirmList.join(',');
                    INDEX.setAgreementList(agreementList)
                    PageManager.go(["user", 'join2']);
                }


            });



        },

        onChange: function (j) {

            var page = this;

        },


        onRelease: function (j) {

            var page = this;
        },
        onResize : function() {

            var page = this;
        }
    };
})();