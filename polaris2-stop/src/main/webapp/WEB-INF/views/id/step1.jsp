<%@ page contentType="text/html; charset=UTF-8" %>

<%
    /*********************************************************************************************
     NICE평가정보 Copyright(c) KOREA INFOMATION SERVICE INC. ALL RIGHTS RESERVED

     서비스명 : IPIN 가상주민번호 서비스
     페이지명 : IPIN 가상주민번호 서비스 인증결과 처리 페이지

     리턴받은 인증결과 데이터를 호출 페이지로 전달하고 인증팝업을 닫는 페이지
     **********************************************************************************************/

    // 인증결과 암호화 데이터 취득 (인증요청 암호화 데이터 값과 달라야 정상)
    String sResponseData = requestReplace(request.getParameter("enc_data"), "encodeData");

    String baseUrl = (String)request.getAttribute("baseUrl");
%>

<html>
<head>
    <meta charset="EUC-KR">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NICE평가정보 가상주민번호 서비스</title>

    <script src="/res/lia/vendor/jquery-1.12.4.min.js?V=7491" type="text/javascript" charset="utf-8"></script>
    <script src="/res/lia/lia.all.js?V=7491" type="text/javascript" charset="utf-8"></script>

    <script>

        var baseUrl = '<%=baseUrl%>';

        function fnLoad()
        {
            Lia.redirectPost('/page/id/step2', {
                'enc_data' : "<%= sResponseData %>"
            });
        }
    </script>
</head>

<%
    // 인증결과 암호화 데이터가 존재하는 경우
    if (!sResponseData.equals("") && sResponseData != null)
    {
%>
<body onLoad="fnLoad()">
    <%
	// 인증결과 암호화 데이터가 존재하지 않는 경우
	} else {
%>
<body onLoad="self.close()">
<%
    }
%>

<%!
    // 문자열 점검 함수
    public String requestReplace (String paramValue, String gubun) {
        String result = "";

        if (paramValue != null) {

            paramValue = paramValue.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

            paramValue = paramValue.replaceAll("\\*", "");
            paramValue = paramValue.replaceAll("\\?", "");
            paramValue = paramValue.replaceAll("\\[", "");
            paramValue = paramValue.replaceAll("\\{", "");
            paramValue = paramValue.replaceAll("\\(", "");
            paramValue = paramValue.replaceAll("\\)", "");
            paramValue = paramValue.replaceAll("\\^", "");
            paramValue = paramValue.replaceAll("\\$", "");
            paramValue = paramValue.replaceAll("'", "");
            paramValue = paramValue.replaceAll("@", "");
            paramValue = paramValue.replaceAll("%", "");
            paramValue = paramValue.replaceAll(";", "");
            paramValue = paramValue.replaceAll(":", "");
            paramValue = paramValue.replaceAll("-", "");
            paramValue = paramValue.replaceAll("#", "");
            paramValue = paramValue.replaceAll("--", "");
            paramValue = paramValue.replaceAll("-", "");
            paramValue = paramValue.replaceAll(",", "");

            if(gubun != "encodeData"){
                paramValue = paramValue.replaceAll("\\+", "");
                paramValue = paramValue.replaceAll("/", "");
                paramValue = paramValue.replaceAll("=", "");
            }
            result = paramValue;

        }
        return result;
    }
%>
</body>
</html>