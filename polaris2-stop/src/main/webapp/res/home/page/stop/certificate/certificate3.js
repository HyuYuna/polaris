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
            <div style="width:92%;margin:0 auto; position: relative;  ">
                <img src="${UrlHelper.get('/res/home/img/stop/pdf/logo.png')}" style="width: 300px; height: 300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>
                <p style="font-size: 14px;">한국여성인권진흥원 제 2020 - 01 - 000호</p>
                <h1 style="font-size: 60px; text-align: center;">교육참가예정안내</h1>
                <table style=" margin-top: 100px; border: 1px solid #333333; width: 100%; border-spacing:0; border-collapse:collapse; font-size: 20px; line-height: 35px;">
                    <colgroup>
                        <col width="20%;" />
                        <col width="30%;" />
                        <col width="20%;" />
                        <col width="30%;" />
                    </colgroup>
                    <tr>
                        <td style="text-align: center;border: 1px solid #333333; padding: 20px;">성명</td>
                        <td style="border: 1px solid #333333; padding: 20px;"></td>
                        <td style="text-align: center;border: 1px solid #333333; padding: 20px;">생년월일</td>
                        <td style="border: 1px solid #333333; padding: 20px;">1900.00.00</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border: 1px solid #333333; padding: 20px;">교육과정</td>
                        <td style="border: 1px solid #333333; padding: 20px;" colspan="3"></td>
                    </tr>
                    <tr>
                        <td style="text-align: center; border: 1px solid #333333; padding: 20px;">교육기간</td>
                        <td style="border: 1px solid #333333; padding: 20px;" colspan="3">2000.0.0. 00:00 ~ 00:00</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; border: 1px solid #333333; padding: 20px;">교육과정</td>
                        <td style="border: 1px solid #333333; padding: 20px;" colspan="3">0시간 수료</td>
                    </tr>
                </table>
                <p style="font-size: 30px; margin-top: 30px; text-align: center;">
                    한국여성인권진흥원에서 위 과정을 실시하고자 하오니, <br>교육생이 본 과정에 참여할 수 있도록 협조하여 주시기 바랍니다.                 
                </p>
                <div style="position: relative; margin-top: 100px; text-align: center;">
                    <p style="font-size: 20px;">2020년 00월 00일</p>
                    <p style="font-size: 40px; margin-top: 150px;">한국여성인권진흥원장</p>
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

