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

var map = Lia.extractGetParameterMap();


Requester.func(function () {

    Requester.func(function () {

        var html = `
            <div style="width:92%;margin:0 auto; position: relative; ">
                <img src="${UrlHelper.get('/res/home/img/stop/pdf/logo.png')}" style="width: 300px; height: 300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>
                <p style="font-size: 14px;">한국여성인권진흥원 제 2020 - 01 - 000호</p>
                <h1 style="font-size: 60px; text-align: center;">수료증</h1>
                <div style="width: 100%; margin-top: 100px; position: relative;" >
                    <p style="font-size: 30px;">교육과정 : <span>교육과정명</span></p>
                    <p style="font-size: 30px;">교육기간 : <span>교육기간</span><span>(1일, 7.5시간)</span></p>
                    <p style="font-size: 30px;">성명 : <span>홍길동</span></p>
                    <p style="font-size: 30px;">생년월일 : <span>1992.02.28</span></p>
                    <p style="font-size: 30px;">소속 : <span>소속</span></p>
                </div>
                <p style="font-size: 30px; margin-top: 70px;">
                    위 사람은「성폭력 방지 및 피해자 보호 등에 관한 법률」제20조, 「가정폭력방지 및 피해자 보호 등에 관한 법률」제8조의 4, 「성매매방지 및 피해자 보호 등에 관한 법률」제20조에 의한 
                    상기 교육과정을 이수하였기에 이 수료증을 수여합니다.                 
                </p>
                <div style="position: relative; margin-top: 70px; text-align: center;">
                    <p style="font-size: 20px;">2020년 00월 00일</p>
                    <p style="font-size: 40px; margin-top: 30px;">한국여성인권진흥원장</p>
                    <img src="${UrlHelper.get('/res/home/img/stop/pdf/sign.png')}" style="width: 80px; height: 80px; position: absolute; bottom: -20px; right: 50px;"/>
                </div>
            </div>
        `;


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

