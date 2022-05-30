(function () {

    return {

        htmlLoading : false,
        cssLoading : false,


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

            searchTable.appendRow({});
            searchTable.appendKeyColumn({
                content: '년도'
            });
            searchTable.appendValueColumn({
                content: new Triton.ComboBox({
                    form: {name: 'year'},
                    theme: Triton.ComboBox.Theme.Normal,
                    css: {'width': '150px'},
                    optionList : [ { name : '2020년', value : '2020' } ]
                })
            });

            var buttonSection = new Triton.ButtonSection({
                appendTo: container
            });

            buttonSection.appendToRight(new Triton.FlatButton({
                theme: Triton.FlatButton.Theme.Normal,
                content: '검색',
                onClick: function () {
                }
            }));

            //교육추진현황
            new Triton.SubTitle({
                appendTo : container,
                content : '교육 추진 결과'
            })

            var foldable1 = new Panel({
                appendTo : container,
                css : {'margin-bottom' : '30px'}
            })

            var f1table = new Triton.DetailTable({
                appendTo : foldable1
            })
            {
                f1table.appendRow({});
                f1table.appendKeyColumn({content : '구분', attr : {'colspan' :2 , 'rowspan' : 2}})


                f1table.appendKeyColumn({content : '과정수', attr : {'rowspan' : 2}})
                f1table.appendKeyColumn({content : '횟수(회)' , attr : {'colspan' : 3}})
                f1table.appendKeyColumn({content : '정원(명)' , attr : {'colspan' : 3}})
                f1table.appendKeyColumn({content : '참여(명)' , attr : {'colspan' : 3}})
                f1table.appendKeyColumn({content : '수료(명)' , attr : {'colspan' : 3}})

                f1table.appendRow({});
                f1table.appendKeyColumn({content : '온라인'});
                f1table.appendKeyColumn({content : '집체'});
                f1table.appendKeyColumn({content : '합계'});

                f1table.appendKeyColumn({content : '온라인'});
                f1table.appendKeyColumn({content : '집체'});
                f1table.appendKeyColumn({content : '합계'});

                f1table.appendKeyColumn({content : '온라인'});
                f1table.appendKeyColumn({content : '집체'});
                f1table.appendKeyColumn({content : '합계'});

                f1table.appendKeyColumn({content : '온라인'});
                f1table.appendKeyColumn({content : '집체'});
                f1table.appendKeyColumn({content : '합계'});


                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center' , 'width' : '15%'} , content : '공통 역량' , attr : {'colspan' : 2}});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '직무역량' , attr : {'rowspan' : 4}});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '입문'});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '실무'});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '전문'});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '특화'});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '리더십 역량' , attr : {'colspan' : 2}});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

                f1table.appendRow({});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : '합 계' , attr : {'colspan' : 2}});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 3});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 4});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 8});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 120});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 240});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 147});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 266});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 146});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 119});
                f1table.appendValueColumn({css : {'text-align' : 'center'} , content : 265});

            }

            //교육생현황
            new Triton.Title({
                appendTo : container,
                content : '교육생 현황'
            })
            new Triton.SubTitle({
                appendTo : container,
                content : '유형별 교육생 현황'
            })
            var foldable2 = new Panel({
                appendTo : container,
                css : {'margin-bottom' : '30px'}
            })
            var f2table = new Triton.DetailTable({
                appendTo : foldable2,
                attr : {css : {'text-align' : 'center'}}
            })

            {
                f2table.appendRow({})
                f2table.appendKeyColumn({content : '구분'})
                f2table.appendKeyColumn({content : '성폭력'})
                f2table.appendKeyColumn({content : '가정폭력'})
                f2table.appendKeyColumn({content : '통합'})
                f2table.appendKeyColumn({content : '성매매'})
                f2table.appendKeyColumn({content : '1366'})
                f2table.appendKeyColumn({content : '해바라기'})
                f2table.appendKeyColumn({content : '폭력피해이주'})
                f2table.appendKeyColumn({content : '성희롱(진흥원)'})
                f2table.appendKeyColumn({content : '합계'})

                f2table.appendRow({})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '인원(명)'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '825'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '656'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '235'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '429'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '702'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '747'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '128'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '58'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '3780'})

                f2table.appendRow({})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '비율 (%)'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '21.8'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '17.4'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '6.2'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '11.3'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '18.6'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '19.8'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '3.4'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '1.5'})
                f2table.appendValueColumn({css : {'text-align' : 'center'} , content : '100'})
            }

            new Triton.SubTitle({
                appendTo : container,
                content : '지역별 교육생 현황'
            })
            var foldable3 = new Panel({
                appendTo : container,
                css : {'margin-bottom' : '30px'}
            })
            var f3table = new Triton.DetailTable({
                appendTo : foldable3,
            })
            {
                f3table.appendRow({})
                f3table.appendKeyColumn({content : '구분' , attr : {
                    'colspan' : 2
                    }})
                f3table.appendKeyColumn({content : '강원'})
                f3table.appendKeyColumn({content : '경기'})
                f3table.appendKeyColumn({content : '경남'})
                f3table.appendKeyColumn({content : '경북'})
                f3table.appendKeyColumn({content : '광주'})
                f3table.appendKeyColumn({content : '대구'})
                f3table.appendKeyColumn({content : '대전'})
                f3table.appendKeyColumn({content : '부산'})
                f3table.appendKeyColumn({content : '서울'})
                f3table.appendKeyColumn({content : '세종'})
                f3table.appendKeyColumn({content : '울산'})
                f3table.appendKeyColumn({content : '인천'})
                f3table.appendKeyColumn({content : '전남'})
                f3table.appendKeyColumn({content : '전북'})
                f3table.appendKeyColumn({content : '제주'})
                f3table.appendKeyColumn({content : '충남'})
                f3table.appendKeyColumn({content : '층북'})
                f3table.appendKeyColumn({content : '합계'})

                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center', 'width' : '20%'} , content : '공통역량 강화교육' , attr : {
                        'colspan' : 2
                    }})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})


                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '직무역량' , attr : {
                'rowspan' : 4
                }})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '입문'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})

                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '실무'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})

                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '전문'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})

                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '특화'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})

                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '리더십역량 강화교육' , attr : {
                        'colspan' : 2
                    }})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})

                f3table.appendRow({})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '합계' , attr : {
                        'colspan' : 2
                    }})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '8'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '39'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '-'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '9'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '5'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '28'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '14'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '18'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f3table.appendValueColumn({css : {'text-align' : 'center'} , content : '265'})
            }

            new Triton.SubTitle({
                appendTo : container,
                content : '교육생 일반적 현황(직위)'
            })
            var foldable4 = new Panel({
                appendTo : container,
                css : {'margin-bottom' : '30px'}
            })
            var f4table = new Triton.DetailTable({
                appendTo : foldable4,
            })
            {
                f4table.appendRow({})
                f4table.appendKeyColumn({content : '구분' , attr : {
                 'colspan' : 2
                 }})
                f4table.appendKeyColumn({content : '기관장'})
                f4table.appendKeyColumn({content : '중간관리자'})
                f4table.appendKeyColumn({content : '실무자'})
                f4table.appendKeyColumn({content : '기타'})
                f4table.appendKeyColumn({content : '미기재'})
                f4table.appendKeyColumn({content : '합계'})

                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '공통역량 강화교육' , attr : {
                'colspan' : 2
                }})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})



                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '직무역량' , attr : {
                    'rowspan' : 4
                    }})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '입문'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})

                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '실무'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})

                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '전문'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})

                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '특화'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '리더십역량 강화교육' , attr : {
                 'colspan' : 2
                     }})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '22'})


                f4table.appendRow({})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '합계' , attr : {
                 'colspan' : 2
                      }})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f4table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})

            }


            new Triton.SubTitle({
                appendTo : container,
                content : '교육생 일반적 현황(경력)'
            })
            var foldable5 = new Panel({
                appendTo : container,
                css : {'margin-bottom' : '30px'}
            })
            var f5table = new Triton.DetailTable({
                appendTo : foldable5,
            })
            {
                f5table.appendRow({})
                f5table.appendKeyColumn({content : '구분' , attr : {
                        'colspan' : 2
                    }})
                f5table.appendKeyColumn({content : '1년미만'})
                f5table.appendKeyColumn({content : '1년 이상 ~ 4년 미만'})
                f5table.appendKeyColumn({content : '4년 이상 ~ 10년 미만'})
                f5table.appendKeyColumn({content : '10년 이상'})
                f5table.appendKeyColumn({content : '미기재'})
                f5table.appendKeyColumn({content : '합계'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '공통역량 강화교육' , attr : {
                        'colspan' : 2
                    }})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '직무역량' , attr : {
                        'rowspan' : 4
                    }})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '입문'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '실무'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '전문'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '특화'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '리더십역량 강화교육' , attr : {
                        'colspan' : 2
                    }})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})


                f5table.appendRow({})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '합계' , attr : {
                        'colspan' : 2
                    }})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '13'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '35'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '12'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '17'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '3'})
                f5table.appendValueColumn({css : {'text-align' : 'center'} , content : '16'})

            }
            
            




        },
        onChange: function (jPage, jPageContainer, i, parameterMap, beforeParameterMap) {

            var page = this;
        },
        onRelease: function (j) {

        }
    };
})();
