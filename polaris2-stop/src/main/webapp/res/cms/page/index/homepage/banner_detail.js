(function () {

    return {

        onInit: function (j) {

            var page = this;

            var id = PageManager.pc('id');
            if (id != undefined) {

                Requester.ajaxWithoutBlank(ApiUrl.Website.GET_BANNER, {
                        id: id
                    },
                    function (status, data, request) {

                        if (status != Requester.Status.SUCCESS) {
                            return;
                        }

                        var page = request.object.page;
                        page.body = data['body'];

                    }, {
                        page: page
                    });

            }

            Requester.func(function (execute) {

                var page = execute.object.page;
                var body = page.body;

                var typeCode = Lia.p(body, 'type_code');

                var container = new Triton.Container({
                    appendTo: page.get()
                });

                var section = new Triton.Section({
                    appendTo: container
                });

                new Triton.Title({
                    content: '배너',
                    appendTo: section
                });

                {
                    var panel = new Triton.Panel({
                        appendTo: container
                    });

                    var detailTable = new Triton.DetailTable({
                        appendTo: panel
                    });

                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: Strings.getString(Strings.INSTITUTION)
                        });
                        detailTable.appendValueColumn({
                            content: Lia.p(body, 'institution_name'), attr: {'colspan': '3'}
                        });
                    }


                    var organizationName = Lia.p(body, 'organization_name');
                    if (String.isNotBlank(organizationName)) {

                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: Strings.getString(Strings.ORGANIZATION)
                        });
                        detailTable.appendValueColumn({
                            content: organizationName, attr: {'colspan': '3'}
                        });
                    }


                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: '타입'
                        });
                        detailTable.appendValueColumn({
                            content: BannerType.getName(typeCode), attr: {'colspan': '3'}
                        });
                    }

                    {
                        var titleText = '제목';
                        if (typeCode == BannerType.QUICK_MENU)
                            titleText = '이름';
                    }
                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: titleText
                        });
                        detailTable.appendValueColumn({
                            content: Lia.p(body, 'title'), attr: {'colspan': '3'}
                        });
                    }

                    if (typeCode != BannerType.QUICK_MENU) {

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '내용'
                            });
                            detailTable.appendValueColumn({
                                content: Lia.p(body, 'body'),
                                css: {
                                    'padding-top': '10px',
                                    'padding-bottom': '10px'
                                },
                                attr: {'colspan': '3'}

                            });
                        }

                        var imageUrlText = '-';
                        var imageUrl = Lia.p(body, 'properties', 'image_url');
                        if (String.isNotBlank(imageUrl)) {
                            imageUrlText = $('<img style="max-width:100%;" alt="image"/>').attr('src', PathHelper.getAttachmentUrl(imageUrl));
                        }

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '이미지'
                            });
                            detailTable.appendValueColumn({
                                content: imageUrlText,
                                attr: {'colspan': '3'}

                            });
                        }

                    } else {

                        var normalIconText = '-';
                        var hoverIconText = '-';
                        var mobileIconText = '-';
                        var mobileMouseOverIconText = '-';
                        var normalIcon = Lia.p(body, 'properties', 'normal_icon');
                        var hoverIcon = Lia.p(body, 'properties', 'mouse_over_icon');
                        var mobileIcon = Lia.p(page.body, 'properties', 'mobile_icon');
                        var mobileMouseOverIcon = Lia.p(page.body, 'properties', 'mobile_mouse_over_icon');

                        if (String.isNotBlank(normalIcon)) {
                            normalIconText = $('<img style="max-width:100%;" alt="normal icon"/>').attr('src', PathHelper.getFileUrl(normalIcon));
                        }

                        if (String.isNotBlank(hoverIcon)) {
                            hoverIconText = $('<img style="max-width:100%;" alt="hover icon"/>').attr('src', PathHelper.getFileUrl(hoverIcon));
                        }

                        if (String.isNotBlank(mobileIcon)) {
                            mobileIconText = $('<img style="max-width:100%;" alt="mobile icon"/>').attr('src', PathHelper.getFileUrl(mobileIcon));
                        }

                        if (String.isNotBlank(mobileMouseOverIcon)) {
                            mobileMouseOverIconText = $('<img style="max-width:100%;" alt="mobile icon"/>').attr('src', PathHelper.getFileUrl(mobileMouseOverIcon));
                        }

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '일반 아이콘'
                            });
                            detailTable.appendValueColumn({
                                content: normalIconText,
                                attr: {'colspan': '3'}

                            });
                        }

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '마우스 오버 아이콘'
                            });
                            detailTable.appendValueColumn({
                                content: hoverIconText,
                                attr: {'colspan': '3'}

                            });
                        }

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '모바일 아이콘'
                            });
                            detailTable.appendValueColumn({
                                content: mobileIconText,
                                attr: {'colspan': '3'}

                            });
                        }

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '모바일 마우스 오버 아이콘'
                            });
                            detailTable.appendValueColumn({
                                content: mobileMouseOverIconText,
                                attr: {'colspan': '3'}

                            });
                        }
                    }


                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: 'URL'
                        });
                        detailTable.appendValueColumn({
                            content: Lia.pd('-', body, 'properties', 'url'),
                            attr: {'colspan': '3'}
                        });
                    }

                    if (typeCode != BannerType.QUICK_MENU) {

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '시작 일시'
                            });
                            detailTable.appendValueColumn({
                                content: Lia.pd('무제한', body, 'effective_start_date')
                            });
                            detailTable.appendKeyColumn({
                                content: '종료 일시'
                            });
                            detailTable.appendValueColumn({
                                content: Lia.pd('무제한', body, 'effective_end_date')
                            });

                        }
                    }

                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: '설정'
                        });
                        detailTable.appendValueColumn({
                            content: Lia.p(body, 'is_available') ? '공개' : '비공개',
                            css: {width: '90'}, attr: {'colspan': '3'}
                        });
                    }

                    if (typeCode == BannerType.QUICK_MENU) {

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '로그인 여부'
                            });
                            detailTable.appendValueColumn({
                                content: Lia.p(body, 'properties', 'requires_login') ? '로그인시 공개' : '상관없음',
                                css: {width: '90'}, attr: {'colspan': '3'}
                            });
                        }
                    }

                    var onDeletedPermanently = Lia.p(body, 'is_deleted');
                    if (onDeletedPermanently) {

                        {
                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: '삭제정보'
                            });

                            var separateTable = new Triton.SeparateTable({});
                            detailTable.appendValueColumn({
                                content: separateTable, attr: {'colspan': '3'}
                            });
                            separateTable.appendRow({});

                            var infoSection = new Triton.Section({});
                            separateTable.appendColumn({
                                content: infoSection
                            });

                            infoSection.append(new Triton.KeyValueSection({
                                keyContent: '이름',
                                valueContent: Lia.p(body, 'deleted_by_user_name')
                            }));
                            infoSection.append(new Triton.KeyValueSection({
                                keyContent: 'IP',
                                valueContent: Lia.p(body, 'deleted_from_ip_address')
                            }));
                            infoSection.append(new Triton.KeyValueSection({
                                keyContent: '삭제일시',
                                valueContent: Lia.p(body, 'deleted_date')
                            }));

                            separateTable.appendColumn({
                                theme: Triton.SeparateTable.Column.Theme.Middle,
                                css: {
                                    'text-align': 'right'
                                },
                                content: new Triton.FlatButton({
                                    theme: Triton.FlatButton.Theme.Refresh,
                                    content: Strings.getString(Strings.BUTTON_TEXT.RECOVER),
                                    page: page,
                                    onClick: function (e) {

                                        PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '복구하시겠습니까?', function (object) {

                                            LoadingPopupManager.show();

                                            Requester.ajaxWithoutBlank(ApiUrl.Website.RECOVER_BANNER, {
                                                id: PageManager.pc('id')
                                            }, function (status, data, request) {

                                                if (status != Requester.Status.SUCCESS)
                                                    return;

                                                PageManager.go('homepage/banner', {
                                                    'institution_id': PageManager.pc('institution_id'),
                                                    'organization_id': PageManager.pc('organization_id')
                                                });

                                            })

                                        }, true, undefined, undefined, {});
                                    }
                                })
                            })

                        }

                    }


                    var buttonSection = new Triton.Section({
                        theme: Triton.Section.Theme.ButtonLayout,
                        appendTo: container
                    });

                    buttonSection.append(new Triton.FlatButton({
                        theme: Triton.FlatButton.Theme.Shade,
                        css: {
                            'float': 'left'
                        },
                        content: Strings.getString(Strings.BUTTON_TEXT.LIST),
                        onClick: function (e) {

                            PageManager.go(['homepage/banner'], {
                                'institution_id' : PageManager.pc('institution_id'),
                                'organization_id' : PageManager.pc('organization_id'),
                                'is_deleted' : PageManager.pc('is_deleted'),
                                'count' : PageManager.pc('count'),
                                'type_code' : PageManager.pc('type_code'),
                                'page' : PageManager.pc('page')
                            });
                        }
                    }));

                    var rightButtonSection = new Triton.Section({
                        appendTo: buttonSection,
                        css: {
                            float: 'right'
                        }
                    });

                    if (onDeletedPermanently) {

                        rightButtonSection.append(new Triton.FlatButton({
                            theme: Triton.FlatButton.Theme.Delete,
                            css: {
                                'float': 'left'
                            },
                            content: Strings.getString(Strings.BUTTON_TEXT.DELETE_PERMANENTLY),
                            page: page,
                            onClick: function (e) {

                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '영구 삭제하시겠습니까?', function (object) {

                                    LoadingPopupManager.show();

                                    Requester.ajaxWithoutBlank(ApiUrl.Website.DELETE_BANNER_PERMANENTLY, {
                                        id: PageManager.getParameter('id')
                                    }, function (status, data, request) {

                                        LoadingPopupManager.hide();

                                        if (status != Requester.Status.SUCCESS) {
                                            return;
                                        }

                                        PageManager.go(['homepage/banner'], {
                                            'institution_id' : PageManager.pc('institution_id'),
                                            'organization_id' : PageManager.pc('organization_id'),
                                            'is_deleted' : PageManager.pc('is_deleted'),
                                            'count' : PageManager.pc('count'),
                                            'type_code' : PageManager.pc('type_code'),
                                            'page' : PageManager.pc('page')
                                        });

                                    }, {});

                                }, true, undefined, undefined, {});
                            }
                        }));
                    }
                    else {

                        rightButtonSection.append(new Triton.FlatButton({

                            theme: Triton.FlatButton.Theme.NormalLeft,
                            css: {
                                'float': 'left'
                            },
                            content: Strings.getString(Strings.BUTTON_TEXT.EDIT),
                            page: page,
                            onClick: function (e) {

                                LoadingPopupManager.show();

                                PageManager.goWithCurrentParameterMap(['homepage/banner_write'], {
                                    id: PageManager.getParameter('id')
                                });

                                LoadingPopupManager.hide();
                            }
                        }));

                        rightButtonSection.append(new Triton.FlatButton({
                            theme: Triton.FlatButton.Theme.DeleteRight,
                            css: {
                                'float': 'left'
                            },
                            content: Strings.getString(Strings.BUTTON_TEXT.DELETE),
                            page: page,
                            onClick: function (e) {

                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), Strings.getString(Strings.POPUP_MESSAGE.CONFIRM_DELETE), function (object) {

                                    Requester.ajaxWithoutBlank(ApiUrl.Website.DELETE_BANNER, {
                                        id: PageManager.getParameter('id')
                                    }, function (status, data, request) {

                                        if (status != Requester.Status.SUCCESS) {
                                            return;
                                        }

                                        //PopupManager.hide();
                                        PageManager.go('homepage/banner');

                                    }, {});

                                }, true, undefined, undefined, {});
                            }
                        }));
                    }
                }
            }, {
                page: page
            });
        },
        onChange: function (j) {

        },
        onRelease: function (j) {
        }
    };
})();