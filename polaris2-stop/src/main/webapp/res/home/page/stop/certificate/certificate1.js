//Requester 관련 코드
var Requester = new jQuery.Requester({

    onRequestStart: function (request) {

        var autoLoading = Lia.p(request, 'object', 'autoLoading');
        if (autoLoading == undefined)
            autoLoading = false;

        if (autoLoading) {
            LoadingPopupManager.show();
        }
    },

    onRequestEnded: function (status, data, request) {

        var autoLoading = Lia.p(request, 'object', 'autoLoading');
        if (autoLoading == undefined)
            autoLoading = false;

        if (autoLoading) {
            LoadingPopupManager.hide();
        }
    },

    responseCheckHandler: function (status, data, request) {

        // 응답 체크하여 결과값 전달
        var code = undefined;
        var error = (status == Requester.Status.ERROR || data == undefined);
        if (!error) {

            if (request['dataType'] == 'json') {

                code = Lia.p(data, 'code');

                if (code != Code.SUCCESS) {
                    error = true;
                }
            }
        }

        if (error) {

            var autoPopup = Lia.p(request, 'object', 'autoPopup');
            if (autoPopup == undefined)
                autoPopup = true;

            if (autoPopup) {

                if (String.isNotBlank(Lia.p(data, 'message'))) {
                    alert(Lia.p(data, 'message'));
                }


            }

            return Lia.Requester.Status.ERROR;
        }

        return status;
    }
});
Requester.Status = jQuery.Requester.Status;





var UrlHelper = {

    get : function( url ){

        var baseUrl = location.protocol + '//' + location.host;
        return baseUrl + url;

    }
};
// <img src="${UrlHelper.get('/res/home/img/stop/pdf/logo.png')}"/>
// <img src="${UrlHelper.get('/res/home/img/stop/pdf/sign.png')}"/>
var map = Lia.extractGetParameterMap();


Requester.func(function () {

    Requester.func(function () {



        var html =
            '<div style="width:92%;margin:0 auto; position: relative; "> ' +
            '    <img src="' + UrlHelper.get('/res/home/img/stop/pdf/logo.png') + '" style="width: 300px; height: 300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/> ' +
            '    <p style="font-size: 14px;">한국여성인권진흥원 제 2020 - 01 - 000호</p> ' +
            '    <h1 style="font-size: 60px; text-align: center;">수료증</h1> ' +
            '    <div style="width: 100%; margin-top: 100px; position: relative;" > ' +
            '        <p style="font-size: 30px;">성 명 : <span>홍길동</span></p> ' +
            '        <p style="font-size: 30px;">생년월일 : <span>1992.02.28</span></p> ' +
            '        <div style="width: 3cm; height: 4cm; border: 1px solid #333333; position: absolute; right: 0; top: -40px;"> ' +
            '            <img src="' + UrlHelper.get('/res/home/img/stop/pdf/sample.jpg') + '" style="width: 100%; height: 100%;"/> ' +
            '        </div> ' +
            '    </div> ' +
            '    <p style="font-size: 30px; margin-top: 70px;">「성매매방지 및 피해자보호 등에 관한 법률 시행규칙」제7조에 따른 성매매방지 상담원 양성교육 과정을 이수하였음을 증명합니다.</p> ' +
            '    <div style="font-size: 20px; line-height: 30px; margin-top: 70px;"> ' +
            '        <p>∙교육과정명 : 2020년 제 0기 성매매방지 상담원 양성교육</p> ' +
            '        <p>∙교육기간 : 2020. 00. 00. ~ 2020. 00. 00. (120시간)</p> ' +
            '        <p>∙교육위탁기관 : 여성가족부</p> ' +
            '        <p>∙교육실시기관 : 한국여성인권진흥원</p> ' +
            '    </div> ' +
            '    <div style="position: relative; margin-top: 70px; text-align: center;"> ' +
            '        <p style="font-size: 20px;">2020년 00월 00일</p> ' +
            '        <p style="font-size: 40px; margin-top: 30px;">한국여성인권진흥원장</p> ' +
            '        <img src="' + UrlHelper.get('/res/home/img/stop/pdf/sign.png') + '" style="width: 80px; height: 80px; position: absolute; bottom: -20px; right: 50px;"/> ' +
            '    </div> ' +
            '</div> ';

        console.log(html);
        // $('#wrapper').append(html);
        var jPrintButton = $('<div style="text-align: right;"><div style="cursor:pointer;display:inline-block;border:1px solid #000000;border-radius: 50px;padding:20px 30px;font-family: NanumGothicBold;font-size:14px;">PDF 파일로 출력</div></div>');
        // $('#wrapper').append(jPrintButton);
        jPrintButton.on('click', function () {

            var preHtml = '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '    <meta http-equiv="Expires" content="-1"></meta>\n' +
                '    <meta charset="UTF-8"></meta>\n' +
                '    <meta http-equiv="Pragma" content="No-Cache"></meta>\n' +
                '    <meta http-equiv="Cache-Control" content="No-Cache"></meta>\n' +
                '\n' +
                '    <meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>\n' +
                '\n' +
                '    <meta http-equiv="Content-type" content="text/html; charset=UTF-8"></meta>\n' +
                '\n' +
                '</head>\n' +
                '<body>\n' +
                '<div id="wrapper">\n';

            var postHtml = '</div>' +
                '\n' +
                '</body>\n' +
                '</html>';


            Lia.redirectPost(ProjectApiUrl.Print.pdf + (new Date()).toString('yyyyMMddHHmmss'), {
                html: preHtml + html + postHtml
            });
        });

        jPrintButton.trigger('click');

        // setTimeout(function() {
        //
        //     jPrintButton.trigger('click');
        // }, 5000);

    });
});

