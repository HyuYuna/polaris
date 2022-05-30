(function () {

    return {

        htmlLoading : false,
        cssLoading : false,


        headerRowHeight : '30px',
        rowHeight : '18px',
        totalColor : '#efefef',
        totalColor2 : '#fafafa',

        onInit: function (j) {

            var page = this;

            var container = new Triton.Container({
                appendTo: j
            });

            new Triton.Title({
                appendTo: container,
                content : '종사자 보수교육 현황'
            });

            var searchPanel = new Triton.Panel({
                appendTo: container,
                contentMinWidth: '900px'
            });

            var searchTable = new Triton.DetailTable({
                appendTo: searchPanel
            });

            var date = new Date();
            var year = date.getFullYear();

            var yearList = [];
            for (var y = year, yl = 2021; y >= yl; y--) {
                yearList.push({name: y, value: y});
            }

            searchTable.appendRow({});
            searchTable.appendKeyColumn({
                content: '년도'
            });
            searchTable.appendValueColumn({
                content : page.courseYearComboBox = new Triton.ComboBox({
                    form : { name : 'course_year' },
                    optionList: yearList,
                    onSelected: function (val) {
                    }
                })
            });



            var currentDate = new Date();

            // var lastDate = currentDate.clone().moveToLastDayOfMonth();
            //
            // searchTable.appendValueColumn({
            //     content: new Triton.DatetimePeriodPicker({
            //         startOptions : {
            //             form : { name : 'start_date'},
            //             type : Triton.DatetimePicker.TYPE_DATE,
            //             value : currentDate.toString('yyyy-MM-01')
            //         },
            //         endOptions : {
            //             form : { name : 'end_date'},
            //             type : Triton.DatetimePicker.TYPE_DATE,
            //             value : lastDate.toString('yyyy-MM-dd')
            //         }
            //     })
            // });
            

            searchTable.appendKeyColumn({
                content: '학기구분'
            });
            searchTable.appendValueColumn({
                content: new Triton.ComboBox({
                    form : { name : 'term_type_code'},
                    optionList : [
                        { name : '전체', value : '' },
                        { name : '기수제', value : TermType.REGULAR },
                        { name : '상시제', value : TermType.DEFAULT }
                    ]

                })
            });


            searchTable.appendKeyColumn({
                content: '수료여부'
            });
            searchTable.appendValueColumn({
                content: new Triton.ComboBox({
                    form : { name : 'is_completed'},
                    optionList : [
                        { name : '참여', value : '' },
                        { name : '수료', value : 1 }
                    ]

                })
            });


            var buttonSection = new Triton.ButtonSection({
                appendTo: container
            });

            buttonSection.appendToRight(new Triton.FlatButton({
                theme: Triton.FlatButton.Theme.Normal,
                content: '검색',
                onClick: function () {

                    page.search();
                }
            }));

            page.buttonSection = new Triton.ButtonSection({
                appendTo : container
            });
            
            page.buttonSection.appendToRight(new Triton.FlatButton({
                theme : Triton.FlatButton.Theme.Header,
                content : '엑셀 다운로드',
                onClick : function() {

                    AjaxPopupManager.show(PopupUrl.EXPORT_DOWNLOAD_PROGRESS, {
                        url: ProjectApiUrl.Stat.exportStatistics,
                        requestMap: page.requestMap,
                        filename : '통계_' + (new Date().toString('yyyy_MM_dd'))
                    });

                }
            }));
            


            page.contentSection = new Triton.Section({
                appendTo : container
            });

            page.search();
        },


        computeTotal : function( list ) {

            var total = {};
            for ( var i = 0, l = list.length; i < l; i++ ) {

                var item = list[i];

                for( var key in item ) {
                    total[ key ] = Lia.pd(0, total[ key ]) + Lia.pcd(0, item, key);
                }
            }

            return total;
        },

        appendListTable : function( listTable, list, count, highlightMap  ) {

            var page = this;

            var typeCodeList = [

                {name : 'GB'},

                {name : 'AB'},
                {name : 'AI'},

                {name : 'BB'},
                {name : 'BI'},
                {name : 'BA'},

                {name : 'CB'},
                {name : 'CI'},
                {name : 'CA'},

                {name : 'DB'},
                {name : 'DI'},
                {name : 'DA'}
            ];


            var typeCodeMap = Lia.convertListToMap(typeCodeList, 'name');
            var map = Lia.convertListToMap(list, 'type_code');

            // 목록 분류
            var sortedList = [];

            for ( var i = 0, l = typeCodeList.length; i < l; i++ ) {

                sortedList.push( Lia.pd( {}, map, Lia.p(typeCodeList, i, 'name') ));
            }

            var uncategoriedList = [];
            for ( var key in map ) {

                if ( typeCodeMap[key] == undefined ) {
                    uncategoriedList.push( map[key] );
                }
            }

            sortedList.push(page.computeTotal(uncategoriedList));
            sortedList.push(page.computeTotal(list));


            var jTd = listTable.find('tr').eq(0).children('td');

            for ( var i = 0, l = sortedList.length; i < l; i++ ) {

                listTable.appendRow({ theme : Triton.ListTable.Row.Theme.NoLink });

                if ( i == 0 ) {
                    listTable.appendColumn({content: '양성교육', css: {'width' : '120px', height : page.rowHeight },  attr: { colspan : 1}});
                    listTable.appendColumn({content: '상담원 양성교육(G)',  css: {'width' : '150px', height : page.rowHeight}});
                    listTable.appendColumn({content: '기본(Basic)',  css: {'width' : '200px', height : page.rowHeight} });
                } else if ( i == 1 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight}, content : '보수교육<br/>(A+B+C+D)', attr : { rowspan : 11 } });
                    listTable.appendColumn({  css : {height : page.rowHeight }, content : '공통역량 강화교육(A)', attr : { rowspan : 2 } });
                    listTable.appendColumn({  css : {height : page.rowHeight }, content : '기본(Basic)' });
                } else if ( i == 2 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '중급(Intermediate)' });
                } else if ( i == 3 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '직무(전문)(B)', attr : { rowspan : 3 } });
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '기본(Basic)' });
                } else if ( i == 4 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '중급(Intermediate)' });
                } else if ( i == 5 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '고급(Advanced)' });
                } else if ( i == 6 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '직무(통합)(C)', attr : { rowspan : 3 } });
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '기본(Basic)' });
                } else if ( i == 7 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '중급(Intermediate)' });
                } else if ( i == 8 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '고급(Advanced)' });
                } else if ( i == 9 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '리더십 역량(D)', attr : { rowspan : 3 } });
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '기본(Basic)' });
                } else if ( i == 10 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '중급(Intermediate)' });
                } else if ( i == 11 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '고급(Advanced)' });
                } else if ( i == 12 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight },content : '소진방지', attr : { colspan : 3 } });
                } else if ( i == 13 ) {
                    listTable.appendColumn({  css : {height : page.rowHeight, 'background-color' : page.totalColor },content : '합계', attr : { colspan : 3 }  });
                }

                var item = sortedList[i];

                for ( var ii = 0, ll = count + 1; ii < ll; ii++ ) {

                    var backColor = '';

                    if ( jTd.eq(ii+1).text().indexOf('합계') >= 0 || Lia.p(highlightMap, ii) == true ) {
                        backColor = page.totalColor2;
                    }

                    if (i == l - 1 ) {
                        backColor = page.totalColor;
                    }


                    listTable.appendColumn({  css : {
                                height : page.rowHeight,
                                'background-color' : backColor
                            },content : FormatHelper.numberWithCommas(Lia.pd(0, item, 'a' + ii)) });
                }
            }
        },

        makeTable1 : function( section, list ) {

            var page = this;

            //교육추진현황
            new Triton.SubTitle({
                appendTo : section,
                content : '총괄표'
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '30px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1
            });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css : { height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 2}})

            f1table.appendHeaderColumn({content : '과정 수(개)', css: { width : '60px', height : page.headerRowHeight }, attr : {'rowspan' : 2}})

            f1table.appendHeaderColumn({content : '횟수(회)' , css : { height : page.headerRowHeight }, attr : {'colspan' : 5}})
            f1table.appendHeaderColumn({content : '정원(명)' , css : { height : page.headerRowHeight }, attr : {'colspan' : 5}})
            f1table.appendHeaderColumn({content : '참여(명)' , css : { height : page.headerRowHeight }, attr : {'colspan' : 5}})
            f1table.appendHeaderColumn({content : '수료(명)' , css : { height : page.headerRowHeight }, attr : {'colspan' : 5}})

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '집체', css  : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '화상', css : { height : page.headerRowHeight, width : '60px'} });
            f1table.appendHeaderColumn({content : '이러닝', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '블랜디드러닝', css : { height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계', css : {  height:  page.headerRowHeight, width : '60px'}});

            f1table.appendHeaderColumn({content : '집체', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '화상', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '이러닝', css : { height:  page.headerRowHeight,  width : '60px'}});
            f1table.appendHeaderColumn({content : '블랜디드러닝', css : { height:  page.headerRowHeight,  width : '60px'}});
            f1table.appendHeaderColumn({content : '합계', css : {  height:  page.headerRowHeight, width : '60px'}});

            f1table.appendHeaderColumn({content : '집체', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '화상', css : { height:  page.headerRowHeight,  width : '60px'}});
            f1table.appendHeaderColumn({content : '이러닝', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '블랜디드러닝', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계', css : { height:  page.headerRowHeight,  width : '60px'}});

            f1table.appendHeaderColumn({content : '집체', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '화상', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '이러닝', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '블랜디드러닝', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계', css : {  height:  page.headerRowHeight, width : '60px'}});

            page.appendListTable(f1table, list, 20, {
                    5 : true,
                    10 : true,
                    15 : true,
                    20 : true
            });
        },

        makeTable2 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 지정성별',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '10px', 'max-width' : '800px'},
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1,
                css : {
                    'max-width' : '800px'
                },
            });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css:{ height : page.headerRowHeight },attr : {'colspan' :3 , 'rowspan' : 1}})

            f1table.appendHeaderColumn({content : '여성(명)', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '남성(명)', css : {  height:  page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계', css : { height:  page.headerRowHeight,  width : '60px'}});
            
            page.appendListTable(f1table, list, 2);
        },

        makeTable3 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 소속기관 유형별',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '10px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1
            });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css:{ height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 1}})

            f1table.appendHeaderColumn({content : '가정폭력<br/>성폭력 ', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '가정폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성매매', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '1366', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '폭력피해이주', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '해바라기', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '기타', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계(명)', css : { height : page.headerRowHeight, width : '60px'}});

            page.appendListTable(f1table, list, 8);
        },

        makeTable4 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 지역별',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '10px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1
            });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css:{ height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 1}})

            f1table.appendHeaderColumn({content : '강원', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '경기', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '경남', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '경북', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '광주', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '대구', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '대전', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '부산', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '서울', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '세종', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '울산', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '인천', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '전남', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '전북', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '제주', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '충남', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '충북', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '기타', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계(명)', css : { height : page.headerRowHeight, width : '60px'}});

            page.appendListTable(f1table, list, 18);
        },

        makeTable5 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 직위별',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                    appendTo : section,
                    css : {'margin-bottom' : '10px', 'max-width' : '1200px'}
                })

                var f1table = new Triton.ListTable({
                    theme : Triton.ListTable.Theme.Shape,
                    appendTo : foldable1,
                    css : {
                        'max-width' : '1200px'
                    }
                });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css:{ height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 1}})

            f1table.appendHeaderColumn({content : '기관장', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '중간관리자', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '상담원', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '사무원', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '기타', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계(명)', css : { height : page.headerRowHeight, width : '60px'}});

            page.appendListTable(f1table, list, 5);
        },


        makeTable6 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 여성폭력방지기관 총 경력',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '10px', 'max-width' : '1200px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1,
                css : {
                    'max-width' : '1200px'
                }
            });
            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분',css:{ height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 1}})

            f1table.appendHeaderColumn({content : '1년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '1년 이상~2년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '2년 이상~4년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '4년 이상~10년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '10년 이상', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '합계(명)', css : { height : page.headerRowHeight, width : '120px'}});

            page.appendListTable(f1table, list, 5);
        },



        makeTable7 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 현 기관 총 경력',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '10px', 'max-width' : '1200px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1,
                css : {
                    'max-width' : '1200px'
                }
            });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css:{ height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 1}});

            f1table.appendHeaderColumn({content : '1년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '1년 이상~2년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '2년 이상~4년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '4년 이상~10년 미만', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '10년 이상', css : { height : page.headerRowHeight, width : '120px'}});
            f1table.appendHeaderColumn({content : '합계(명)', css : { height : page.headerRowHeight, width : '120px'}});

            page.appendListTable(f1table, list, 5);
        },



        makeTable8 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육생 현황 - 중복 수강 여부',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                    css : {'margin-bottom' : '10px', 'max-width' : '800px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                css : {
                    'max-width' : '800px'
                },
                appendTo : foldable1
            });


            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '횟수(회)', css : {'width' : '60px' }, attr : {'colspan' :1 , 'rowspan' : 1}});

            f1table.appendHeaderColumn({content : '성폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '가정폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성매매', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '1366', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '폭력피해이주', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '해바라기', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '기타', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계(명)', css : { height : page.headerRowHeight, width : '60px'}});

            if ( Array.isEmpty(list) ) {
                new Triton.Section({
                    appendTo : foldable1,
                    theme : Triton.Section.Theme.ListMessage,
                    content : '표시할 내역이 없습니다.'
                });
                return;
            }

            // 최대값 찾기
            var maxStudentCount = 0;
            for ( var i = 0, l = list.length; i < l; i ++ ) {

                var item = Lia.p(list, i);

                maxStudentCount = Math.max(maxStudentCount, item['course_count'] );
            }

            var map = Lia.convertListToListMap(list, 'course_count');

            var sumMap = {};

            for ( var i = 1, l = maxStudentCount; i <= l; i++ ) {

                var mapList = map[i];
                if( Array.isEmpty(mapList) ) {
                    continue;
                }

                var totalCount = 0;
                var etcCount = 0;
                for (var ii = 0, ll = mapList.length; ii < ll; ii++ ) {

                    var item = Lia.p(mapList, ii);
                    totalCount += Lia.pcd(0, item, 'count');

                    var typeCode = Lia.p(item, 'type_code')

                    if ( typeCode < 46 || typeCode > 52 ) {
                        etcCount += Lia.pcd(0, item, 'count');
                    }
                }

                var mapListMap =Lia.convertListToMap(mapList, 'type_code');

                sumMap['total_count'] = Lia.pcd(0, sumMap, 'total_count') + totalCount;
                sumMap['etc_count'] = Lia.pcd(0, sumMap, 'etc_count') + etcCount;

                f1table.appendRow({ theme : Triton.ListTable.Row.Theme.NoLink });
                f1table.appendColumn({css : {height : page.rowHeight },content: (i), attr: { colspan : 1}});
                for ( var iii = 46, lll = 52; iii <= lll; iii++ ) {

                    sumMap[iii] =  Lia.pcd(0, sumMap[iii])+ Lia.pcd(0, mapListMap, iii, 'count');
                    f1table.appendColumn({css : {height : page.rowHeight },content: ( Lia.pcd(0, mapListMap, iii, 'count')), attr: { colspan : 1}});
                }

                f1table.appendColumn({css : {height : page.rowHeight },content: etcCount, attr: { colspan : 1}});
                f1table.appendColumn({css : {height : page.rowHeight,'background-color' : page.totalColor2 },content: totalCount, attr: { colspan : 1}});
            }

            f1table.appendRow({ theme : Triton.ListTable.Row.Theme.NoLink });
            f1table.appendColumn({css : {height : page.rowHeight, 'background-color' : page.totalColor },content: '합계', attr: { colspan : 1}});
            for ( var iii = 46, lll = 52; iii <= lll; iii++ ) {

                f1table.appendColumn({css : {height : page.rowHeight, 'background-color' : page.totalColor},content: ( Lia.pcd(0, sumMap, iii)), attr: { colspan : 1}});
            }

            f1table.appendColumn({css : {height : page.rowHeight, 'background-color' : page.totalColor },content: Lia.pcd(0,sumMap,'etc_count'), attr: { colspan : 1}});
            f1table.appendColumn({css : {height : page.rowHeight, 'background-color' : page.totalColor },content: Lia.pcd(0,sumMap,'total_count'), attr: { colspan : 1}});
        },


        makeTable9 : function( section, list ) {

            var page = this;

            new Triton.SubTitle({
                appendTo : section,
                content : '교육현황 - 주제유형별',
                css : {'margin-bottom' : '10px'}
            })

            var foldable1 = new Panel({
                appendTo : section,
                css : {'margin-bottom' : '10px'}
            })

            var f1table = new Triton.ListTable({
                theme : Triton.ListTable.Theme.Shape,
                appendTo : foldable1
            });

            f1table.appendHeaderRow({});
            f1table.appendHeaderColumn({content : '구분', css:{ height : page.headerRowHeight }, attr : {'colspan' :3 , 'rowspan' : 1}})

            f1table.appendHeaderColumn({content : '유형무관', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '가정폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '스토킹', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '데이트폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '디지털성폭력', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성희롱', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '성매매', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '해바라기센터', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '여성긴급전화1366', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '장애', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '폭력피해이주여성', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '아동, 청소년', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '자살', css : { height : page.headerRowHeight, width : '60px'}});
            f1table.appendHeaderColumn({content : '합계', css : { height : page.headerRowHeight, width : '60px'}});

            page.appendListTable(f1table, list, 14);
        },


        search : function() {

            var page = this;

            var container = page.contentSection;
            container.empty();

            var parameterMap = Triton.extractFormData(page.get());

            var courseYear = parameterMap['course_year'];

            var historyYear = undefined;
            if ( courseYear != new Date().getFullYear() ) {
                historyYear = courseYear;
            }

            Requester.awb(ProjectApiUrl.Stat.getStatistics, page.requestMap = {
                // startDate : (String.isNotBlank(parameterMap['start_date'])?parameterMap['start_date'] + ' 00:00:00': ''),
                // endDate : (String.isNotBlank(parameterMap['end_date'])?parameterMap['end_date'] + ' 23:59:59': ''),
                courseYear : courseYear,
                historyYear: historyYear,
                isCompleted : parameterMap['is_completed'],
                termTypeCode : parameterMap['term_type_code']
            }, function( status, data ) {

                if ( !status ) {
                    return;
                }

                var list1 = Lia.p(data,'body', 'list1');
                page.makeTable1(container, list1);

                page.makeTable9(container, Lia.p(data,'body', 'list9'));

                var list2 = Lia.p(data,'body', 'list2');
                page.makeTable2(container, list2);

                page.makeTable3(container, Lia.p(data,'body', 'list3'));
                page.makeTable4(container, Lia.p(data,'body', 'list4'));
                page.makeTable5(container, Lia.p(data,'body', 'list5'));
                page.makeTable6(container, Lia.p(data,'body', 'list6'));
                page.makeTable7(container, Lia.p(data,'body', 'list7'));
                page.makeTable8(container, Lia.p(data,'body', 'list8'));


            });



        },

        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;
        },
        onRelease: function (j) {

        }
    };
})();
