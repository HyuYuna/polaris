ProjectSettings.MenuThemeList = [
  { name : '한국여성인권진흥원', value : 'stop'}
];

BannerType.setMap({
  1: '상단',
  2: '중간',
  // 3: '하단',
  6: '팝업',
  9: '퀵메뉴'
});

MessageManager.setNotificationCheckPeriodMs(5000);
MessageManager.setFromCategoryCode(MessageCategory.NORMAL);
MessageManager.setToCategoryCode(MessageCategory.NEW_COURSE_TASK);

Triton.ComboBox.setMode(Triton.ComboBox.Mode.MIX);
Triton.ComboBox.setMaxSelectCount(20);
Triton.ComboBox.setPopupUrl(Triton.PopupUrl.COMBO_BOX);

MessageManager.setMessageHandler(function(item){

  var categoryCode = Lia.p(item, 'category_code');

  if (categoryCode == MessageCategory.NORMAL) {
    PageManager.go(['note_detail'], { id : item['id'] });
    return true;
  }
});
if ( Configs.getConfig(Configs.USE_NOTIFICATION) ) {
  MessageManager.init();
}
