(function () {

    return {

        joinName : undefined,
        joinId: undefined,
        onInit: function (j) {
            var page = this;

            page.joinName = Lia.decodeUri(PageManager.p("name"));
            page.joinId = PageManager.p("id");
            if( String.isNullOrWhitespace(page.joinName)){
                // PageManager.go(['user', 'join1']);
                page.find(".floating_box").show();
            }else{
                page.find(".floating_box").show();
            }
            page.find("span.join_id").html(page.joinId);
            page.find("span.join_name").html(page.joinName);

            page.find("#btnAgree").on("click", function (e) {
                e.preventDefault();
                PageManager.go(['user/myPage'], {
                    'afterjoin': 1
                });
            });

            page.find("#btnDisAgree").on("click", function (e) {
                e.preventDefault();
                PageManager.go(['home']);
            });

            page.find("#btnHome").on("click", function (e) {
                e.preventDefault();
                PageManager.go(['home']);
            });

        },
        onChange: function (j) {
            var page = this;
            page.joinName = undefined;
        },


        onRelease: function (j) {

        },
        onResize : function() {

        }
    };
})();