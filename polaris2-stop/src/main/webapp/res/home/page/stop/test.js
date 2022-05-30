(function () {

    return {

        menuPageManager : undefined,
        menuPage : undefined,
        currentMenuId : undefined,

        onInit: function (j) {
            var page = this;

            page.menuPageManager = new MenuPageManager({
                page : page
            });
            page.menuPageManager.onInit(j);

        },

        menuId : undefined,

        onChange: function (j) {

            var page = this;

            var menu = MenuManager.getLastSelectedMenu();
            var menuId = menu['id'];


            page.menuPageManager.onChange(j);
        },


        onRelease: function (j) {

            var page = this;
            page.menuPageManager.onRelease(j);

        },
        onResize : function() {

            var page = this;
        }
    };
})();