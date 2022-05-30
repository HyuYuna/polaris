(function () {

    return {

        onInit: function (j) {

            var page = this;

            var id = PageManager.pc('id');

            if (id != undefined) {

                Requester.ajaxWithoutBlank(ApiUrl.Website.GET_BANNER, {
                    id: id
                }, function (status, data, request) {

                    if (status != Requester.Status.SUCCESS) {
                        return;
                    }

                    var page = request.object.page;
                    page.body = data['body'];

                }, {
                    page: page
                });
            }

            var container = new Triton.Container({
                appendTo: j
            });

            var section = new Triton.Section({
                appendTo: container
            });

            new Triton.Title({
                appendTo: section,
                content: '배너'
            });

            Requester.func(function () {

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

                        if (id != undefined) {

                            detailTable.appendValueColumn({
                                content: Lia.p(page.body, 'institution_name')
                            });

                        } else {

                            detailTable.appendValueColumn({
                                content: page.institutionComboBox = new Triton.ComboBox({
                                    optionList: page.institutionList,
                                    theme: Triton.ComboBox.Theme.Full,
                                    form: {name: 'institutionId'},
                                    onSelected: function (val, selectedOption, options) {

                                        if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)) {

                                            Requester.ajaxWithoutBlank(ApiUrl.Organization.GET_SIMPLE_ORGANIZATION_LIST, {
                                                typeCode: OrganizationType.ENTRUST,
                                                institutionId: val,
                                                allowHomepageOperation: 1
                                            }, function (status, data, request) {

                                                if (status != Requester.Status.SUCCESS) {

                                                    return;
                                                }

                                                var list = Lia.p(data, 'body', 'list');

                                                if (list == undefined) {

                                                    PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '등록된 ' + Strings.getString(Strings.ORGANIZATION) + '이 없습니다.', function (object) {
                                                        PopupManager.hide();
                                                        PageManager.go(['operation_manage/organization']);
                                                    }, null, Strings.getString(Strings.BUTTON_TEXT.OK), false, {});

                                                    return;
                                                }

                                                var defaultOrganization = list[0];

                                                if (UserManager.getUserRoleCode() == UserRole.ADMIN)
                                                    defaultOrganization = '';

                                                page.defaultOrganizationId = defaultOrganization['id'];

                                                page.selectedOrganizationId = PageManager.pcd(page.defaultOrganizationId, 'organization_id');

                                                if (String.isNotBlank(id))
                                                    page.selectedOrganizationId = Lia.pd(page.selectedOrganizationId, page.body, 'organization_id');

                                                page.organizationList = OptionListHelper.convertOrganizationOptionList(list);

                                                page.organizationComboBox.setOptionList(page.organizationList);
                                                page.organizationComboBox.setValue(page.selectedOrganizationId);
                                            });
                                        }
                                    }
                                })
                            });
                        }
                    }

                    if (Configs.containsUserRole(UserRole.ORGANIZATION_ADMIN)) {
                        var organizationName = Lia.p(page.body, 'organization_name');

                        if (id == undefined || String.isNotBlank(organizationName)) {

                            detailTable.appendRow({});
                            detailTable.appendKeyColumn({
                                content: Strings.getString(Strings.ORGANIZATION)
                            });

                            if (id != undefined) {

                                detailTable.appendValueColumn({
                                    content: organizationName
                                });

                            } else {

                                detailTable.appendValueColumn({
                                    content: page.organizationComboBox = new Triton.ComboBox({
                                        optionList: page.organizationList,
                                        theme: Triton.ComboBox.Theme.Full,
                                        form: {name: 'organizationId'},
                                        onSelected: function (val, selectedOption, options) {
                                        }
                                    })
                                });
                            }
                        }
                    }

                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: '타입'
                        });
                        detailTable.appendValueColumn({
                            content: page.typeCodeComboBox = new Triton.ComboBox({
                                form: {name: 'typeCode'},
                                optionList: BannerType.createOptionList(),
                                selectedValue: Lia.pd(PageManager.pc('type_code'), page.body, 'type_code'),
                                theme: Triton.ComboBox.Theme.Normal,
                                onSelected: function (val, selectedOption, options) {

                                    page.find('.type_row').hide();
                                    page.find('.type_' + val).show();

                                    if (val == BannerType.QUICK_MENU)
                                        page.find('.title_key_column').text('이름');
                                    else
                                        page.find('.title_key_column').text('제목');
                                }
                            })
                        });
                    }

                    {

                        var titleKeyColumnText = '제목';

                        if (String.isNotBlank(page.body)) {

                            if (page.body['type_code'] == BannerType.QUICK_MENU)
                                titleKeyColumnText = '이름';
                        }
                    }
                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            addClass: 'title_key_column', content: titleKeyColumnText
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.TextArea({
                                form: {name: 'title'},
                                value: Lia.p(page.body, 'title'),
                                theme: Triton.TextInput.Theme.Full,
                                attr: { 'rows': 2 },
                                css: { 'height': '70px', 'resize': 'disable' }
                            })
                        });
                    }

                    var textEditor;

                    {
                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.MIDDLE + ' ' + 'type_' + BannerType.BOTTOM
                                + ' ' + 'type_' + BannerType.TOP + ' ' + 'type_' + BannerType.POPUP,
                        });
                        detailTable.appendKeyColumn({
                            content: '내용'
                        });
                        detailTable.appendValueColumn({
                            content: textEditor = new Triton.TextEditor({
                                form: {name: 'body'},
                                value: Lia.p(page.body, 'body')
                            })
                        });
                    }

                    textEditor.initTextEditor();

                    {
                        var imageUrl = Lia.p(page.body, 'properties', 'image_url');

                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.MIDDLE + ' ' + 'type_' + BannerType.BOTTOM
                                + ' ' + 'type_' + BannerType.TOP + ' ' + 'type_' + BannerType.POPUP
                        });
                        detailTable.appendKeyColumn({
                            content: '이미지'
                        });
                        detailTable.appendValueColumn({
                            content: page.uploader = new Triton.ThumbnailUploader({

                                parameterMap: {
                                    categoryCode: UploadedFileCategory.BOARD_ATTACHMENT
                                },
                                form: {name: 'image_url'}
                            })
                        });

                        if (String.isNotBlank(imageUrl)) {
                            page.uploader.setAttachment(imageUrl);
                        }
                    }

                    {
                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.MIDDLE + ' ' + 'type_' + BannerType.BOTTOM,
                        });
                        detailTable.appendKeyColumn({
                            content: 'Video URL'
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.TextInput({
                                form: {name: 'video_url'},
                                theme: Triton.TextInput.Theme.Full,
                                value: Lia.p(page.body, 'properties', 'video_url')
                            })
                        });
                    }

                    {

                        var normalIcon = Lia.p(page.body, 'properties', 'normal_icon');

                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.QUICK_MENU
                        });
                        detailTable.appendKeyColumn({
                            content: '일반 아이콘<br />( 40px X 40px )'
                        });
                        detailTable.appendValueColumn({
                            content: page.normalIconUploder = new Triton.ThumbnailUploader({
                                form: {'name': 'normalIcon'},
                                parameterMap: {
                                    categoryCode: UploadedFileCategory.BOARD_ATTACHMENT
                                }
                            })
                        });

                        if (String.isNotBlank(normalIcon)) {
                            page.normalIconUploder.setValue(normalIcon);
                        }
                    }

                    {

                        var hoverIcon = Lia.p(page.body, 'properties', 'mouse_over_icon');

                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.QUICK_MENU
                        });
                        detailTable.appendKeyColumn({
                            content: '마우스오버 아이콘<br />( 40px X 40px )'
                        });
                        detailTable.appendValueColumn({
                            content: page.hoverIconUploder = new Triton.ThumbnailUploader({
                                form: {'name': 'mouseOverIcon'},
                                parameterMap: {
                                    categoryCode: UploadedFileCategory.BOARD_ATTACHMENT
                                }
                            })
                        });

                        if (String.isNotBlank(hoverIcon)) {
                            page.hoverIconUploder.setValue(hoverIcon);
                        }
                    }

                    {

                        var mobileIcon = Lia.p(page.body, 'properties', 'mobile_icon');

                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.QUICK_MENU
                        });
                        detailTable.appendKeyColumn({
                            content: '모바일 아이콘<br />( 30px X 30px )'
                        });
                        detailTable.appendValueColumn({
                            content: page.mobileIconUploder = new Triton.ThumbnailUploader({
                                form: {'name': 'mobileIcon'},
                                parameterMap: {
                                    categoryCode: UploadedFileCategory.BOARD_ATTACHMENT
                                }
                            })
                        });

                        if (String.isNotBlank(mobileIcon)) {
                            page.mobileIconUploder.setValue(mobileIcon);
                        }
                    }

                    {

                        var mobileMouseOverIcon = Lia.p(page.body, 'properties', 'mobile_mouse_over_icon');

                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.QUICK_MENU
                        });
                        detailTable.appendKeyColumn({
                            content: '모바일 마우스오버 아이콘<br />( 30px X 30px )'
                        });
                        detailTable.appendValueColumn({
                            content: page.mobileHoverIconUploder = new Triton.ThumbnailUploader({
                                form: {'name': 'mobileMouseOverIcon'},
                                parameterMap: {
                                    categoryCode: UploadedFileCategory.BOARD_ATTACHMENT
                                }
                            })
                        });

                        if (String.isNotBlank(mobileMouseOverIcon)) {
                            page.mobileHoverIconUploder.setValue(mobileMouseOverIcon);
                        }
                    }

                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: 'URL'
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.TextInput({
                                form: {name: 'url'},
                                theme: Triton.TextInput.Theme.Full,
                                value: Lia.p(page.body, 'properties', 'url')
                            })
                        });
                    }

                    {
                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.MIDDLE + ' ' + 'type_' + BannerType.BOTTOM
                                + ' ' + 'type_' + BannerType.TOP + ' ' + 'type_' + BannerType.POPUP
                        });
                        detailTable.appendKeyColumn({
                            content: '시작 일시'
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.DatetimePicker({
                                form: {name: 'effectiveStartDate'},
                                value: Lia.p(page.body, 'effective_start_date')
                            })
                        });
                    }

                    {
                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.MIDDLE + ' ' + 'type_' + BannerType.BOTTOM
                                + ' ' + 'type_' + BannerType.TOP + ' ' + 'type_' + BannerType.POPUP
                        });
                        detailTable.appendKeyColumn({
                            content: '종료 일시'
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.DatetimePicker({
                                form: {name: 'effectiveEndDate'},
                                value: Lia.p(page.body, 'effective_end_date')
                            })
                        });
                    }

                    {
                        detailTable.appendRow({});
                        detailTable.appendKeyColumn({
                            content: '설정'
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.CheckBox({
                                content: '게시',
                                form: {name: 'isAvailable'},
                                pressed: Lia.p(page.body, 'is_available')
                            })
                        });
                    }

                    {
                        detailTable.appendRow({
                            addClass: 'type_row type_' + BannerType.QUICK_MENU
                        });
                        detailTable.appendKeyColumn({
                            content: '로그인 여부'
                        });
                        detailTable.appendValueColumn({
                            content: new Triton.CheckBox({
                                form: {'name': 'requiresLogin'},
                                content: '로그인 여부',
                                pressed: Lia.p(page.body, 'properties', 'requires_login')
                            })
                        });
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

                            if (String.isNotBlank(id)) {

                                PageManager.go(['homepage/banner_detail'], {
                                    institution_id: PageManager.pc('institution_id'),
                                    organization_id: PageManager.pc('organization_id'),
                                    id: PageManager.pc('id'),
                                    type_code: PageManager.pc('type_code'),
                                    is_deleted: PageManager.pc('is_deleted')
                                });

                            } else {

                                PageManager.go(['homepage/banner'], {
                                    institution_id: PageManager.pc('institution_id'),
                                    organization_id: PageManager.pc('organization_id'),
                                    type_code: PageManager.pc('type_code'),
                                    is_deleted: PageManager.pc('is_deleted')
                                });
                            }
                            //PageManager.goWithCurrentParameterMap('homepage/banner');

                        }
                    }));

                    var rightButtonSection = new Triton.Section({
                        appendTo: buttonSection,
                        css: {
                            'float': 'right'
                        }
                    });

                    rightButtonSection.append(new Triton.FlatButton({
                        theme: Triton.FlatButton.Theme.NormalLeft,
                        css: {
                            'float': 'left'
                        },
                        content: '저장',
                        page: page,
                        onClick: function (e) {


                            var page = e.data.page;
                            var dataMap = Triton.extractFormData(page.get());

                            var id = PageManager.getParameter('id');

                            if (dataMap['typeCode'] == 0) {
                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '타입을 선택해주세요.');
                                return;
                            }
                            if (String.isNullOrWhitespace(dataMap['title'])) {
                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '제목을 입력해주세요.');
                                return;
                            }

                            var properties = {};

                            var imageUrl = page.uploader.getAttachment();

                            if (String.isNotBlank(imageUrl)) {
                                properties['image_url'] = imageUrl;
                            }

                            if (String.isNotBlank(dataMap['url'])) {
                                properties['url'] = dataMap['url'];
                            }

                            if (String.isNotBlank(dataMap['video_url'])) {
                                properties['video_url'] = dataMap['video_url'];
                            }

                            var normalIcon = page.normalIconUploder.getAttachment();
                            if (String.isNotBlank(normalIcon)) {
                                properties['normal_icon'] = dataMap['normalIcon'];
                            }

                            var hoverIcon = page.hoverIconUploder.getAttachment();
                            if (String.isNotBlank(hoverIcon)) {
                                properties['mouse_over_icon'] = dataMap['mouseOverIcon'];
                            }

                            var mobileIcon = page.mobileIconUploder.getAttachment();
                            if (String.isNotBlank(mobileIcon)) {
                                properties['mobile_icon'] = dataMap['mobileIcon'];
                            }

                            var mobileMouseOverIcon = page.mobileHoverIconUploder.getAttachment();
                            if (String.isNotBlank(mobileMouseOverIcon)) {
                                properties['mobile_mouse_over_icon'] = dataMap['mobileMouseOverIcon'];
                            }

                            if (dataMap['typeCode'] == BannerType.QUICK_MENU) {

                                if (String.isNotBlank(dataMap['requiresLogin'])) {
                                    properties['requires_login'] = dataMap['requiresLogin'];
                                }

                            }

                            if (dataMap['organizationId'] == -1) {
                                dataMap['organizationId'] = '';
                            }

                            dataMap['serviceProviderId'] = Server.serviceProviderId;

                            dataMap['properties'] = JSON.stringify(properties);

                            if (String.isNullOrWhitespace(id)) {

                                Requester.ajaxWithoutBlank(ApiUrl.Website.ADD_BANNER, dataMap, function (status, data, request) {
                                    if (status != Requester.Status.SUCCESS) {
                                        return;
                                    }

                                    PageManager.go(['homepage/banner'], {
                                        institution_id: PageManager.pc('institution_id'),
                                        organization_id: PageManager.pc('organization_id'),
                                        type_code: PageManager.pc('type_code'),
                                        is_deleted: PageManager.pc('is_deleted')
                                    });

                                }, {});

                            } else {

                                dataMap['id'] = id;

                                PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), PopupTitleHelper.getEditPopupTitle(), function (object) {

                                    Requester.ajaxWithoutBlank(ApiUrl.Website.EDIT_BANNER, dataMap, function (status, data, request) {
                                        if (status != Requester.Status.SUCCESS) {
                                            return;
                                        }

                                        PageManager.go(['homepage/banner_detail'], {
                                            institution_id: PageManager.pc('institution_id'),
                                            organization_id: PageManager.pc('organization_id'),
                                            type_code: PageManager.pc('type_code'),
                                            is_deleted: PageManager.pc('is_deleted'),
                                            id: PageManager.pc('id')
                                        });

                                    }, {});

                                }, function (object) {
                                    PopupManager.hide();
                                }, Strings.getString(Strings.BUTTON_TEXT.OK), Strings.getString(Strings.BUTTON_TEXT.CANCEL), {});

                            }
                        }
                    }));

                    rightButtonSection.append(new Triton.FlatButton({
                        theme: Triton.FlatButton.Theme.DeleteRight,
                        css: {
                            'float': 'left'
                        },
                        content: Strings.getString(Strings.BUTTON_TEXT.CANCEL),
                        page: page,
                        onClick: function (e) {

                            PageManager.go(['homepage/banner'], {
                                institution_id: PageManager.pc('institution_id'),
                                organization_id: PageManager.pc('organization_id'),
                                type_code: PageManager.pc('type_code'),
                                is_deleted: PageManager.pc('is_deleted')
                            });
                        }
                    }));
                }

                page.typeCodeComboBox.change();

                if (id == undefined) {

                    var param = [];

                    if (UserManager.getUserRoleCode() == UserRole.INSTITUTION_ADMIN) {

                        param['filterCodeList'] = InstitutionFilter.ADMINISTERING;

                    } else if (UserManager.getUserRoleCode() == UserRole.ORGANIZATION_ADMIN) {

                        if (Server.allowTermOperation == '1')
                            param['filterCodeList'] = InstitutionFilter.ADMINISTERING_TERM;

                    } else if (UserManager.getUserRoleCode() == UserRole.TEACHER || UserManager.getUserRoleCode() == UserRole.TEACHING_ASSISTANT) {

                        param['filterCodeList'] = InstitutionFilter.ADMINISTERING_COURSE;
                    }

                    param['isManageable'] = 1;
                    param['allowHomepageOperation'] = 1;

                    Requester.ajaxWithoutBlank(ApiUrl.Institution.GET_SIMPLE_INSTITUTION_LIST, param, function (status, data, request) {

                        if (status != Requester.Status.SUCCESS) {
                            return;
                        }

                        var list = Lia.p(data, 'body', 'list');

                        if (list == undefined) {

                            PopupManager.alert(Strings.getString(Strings.POPUP_TITLE.INFO), '등록된 ' + Strings.getString(Strings.INSTITUTION) + '이 없습니다.', function (object) {
                                PopupManager.hide();
                                PageManager.go(['operation_manage/institution']);
                            }, null, Strings.getString(Strings.BUTTON_TEXT.OK), false, {});

                            return;
                        }

                        var defaultInstitution = list[0];
                        page.defaultInstitutionId = defaultInstitution['id'];

                        page.selectedInstitutionId = PageManager.pcd(page.defaultInstitutionId, 'institution_id');

                        if (String.isNotBlank(id))
                            page.selectedInstitutionId = Lia.pd(page.selectedInstitutionId, page.body, 'institution_id');

                        page.institutionList = OptionListHelper.convertInstitutionOptionList(list);

                        page.institutionComboBox.setOptionList(page.institutionList);
                        page.institutionComboBox.setValue(page.selectedInstitutionId);
                    });
                }
            });
        },
        onChange: function (j) {

            var page = this;

        },
        onRelease: function (j) {
        }
    };
})();