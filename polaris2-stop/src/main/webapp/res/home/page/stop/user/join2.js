(function () {

    return {

        onInit: function (j) {
            var page = this;
            var cert  = false;

            console.log('세션', sessionStorage.getItem('cert_return'));

            page.find(".terms_type.ipin_cert").on("click", function (e) {
                e.preventDefault();
                // TODO : 테스트용

                Requester.owb('/page/id/request', undefined, {
                    width : '445px',
                    height : '550px'
                });


                //인증 완료되면 cert  = true

                page.find(".terms_type").removeClass("on");
                $(this).addClass("on");
                // cert = true;
            });
            page.find(".terms_type.mobile_cert").on("click", function (e) {
                e.preventDefault();
                // TODO : 테스트용

                Requester.owb('/page/id/main', undefined, {
                    width : '445px',
                    height : '550px'
                });

                page.find(".terms_type").removeClass("on");
                $(this).addClass("on");
                // cert = true;
            });
            page.find(".btn_default").on("click", function (e) {
                e.preventDefault();
                PageManager.go(["user", 'login']);
            });
            page.find(".btn_primary").on("click", function (e) {
                e.preventDefault();

                var isNext = cert;
                // page.find("li.terms_type").each(function () {
                //     if ($(this).hasClass("on")){
                //         isNext = true;
                //     }
                // });

                if(!cert) {
                    PopupManager.alert('한국여성인권진흥원','인증방식을 선택해주세요.');
                }else{

                    //인증API

                    PageManager.go(["user", 'join3']);
                }


            });

        },

        menuId : undefined,

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