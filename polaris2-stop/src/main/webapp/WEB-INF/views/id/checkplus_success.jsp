<%@ page import="com.vsquare.polaris2.stop.database.mapper.ProjectMapper" %>
<%@ page import="com.vsquare.commons.tool.CryptoUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%--<%@ page import="com.vsquare.polaris2.koica.database.mapper.ProjectMapper" %>--%>
<%--<%@ page import="com.vsquare.polaris2.core.database.mapper.UserMapper" %>--%>
<%--<%@ page import="com.vsquare.polaris2.core.model.user.UserProperties" %>--%>

<%	//인증 후 결과값이 null로 나오는 부분은 관리담당자에게 문의 바랍니다.
    NiceID.Check.CPClient niceCheck = new  NiceID.Check.CPClient();

    String sEncodeData = requestReplace(request.getParameter("EncodeData"), "encodeData");

    String sSiteCode = "BT432";				// NICE로부터 부여받은 사이트 코드
    String sSitePassword = "ldc5rxCpjt7u";			// NICE로부터 부여받은 사이트 패스워드

    String sCipherTime = "";			// 복호화한 시간
    String sRequestNumber = "";			// 요청 번호
    String sResponseNumber = "";		// 인증 고유번호
    String sAuthType = "";				// 인증 수단
    String sName = "";					// 성명
    String sDupInfo = "";				// 중복가입 확인값 (DI_64 byte)
    String sConnInfo = "";				// 연계정보 확인값 (CI_88 byte)
    String sBirthDate = "";				// 생년월일(YYYYMMDD)
    String sGender = "";				// 성별
    String sNationalInfo = "";			// 내/외국인정보 (개발가이드 참조)
	String sMobileNo = "";				// 휴대폰번호
	String sMobileCo = "";				// 통신사
    String sMessage = "";
    String sPlainData = "";
    
    int iReturn = niceCheck.fnDecode(sSiteCode, sSitePassword, sEncodeData);

    if( iReturn == 0 )
    {
        sPlainData = niceCheck.getPlainData();
        sCipherTime = niceCheck.getCipherDateTime();
        
        // 데이타를 추출합니다.
        java.util.HashMap mapresult = niceCheck.fnParse(sPlainData);
        
        sRequestNumber  = (String)mapresult.get("REQ_SEQ");
        sResponseNumber = (String)mapresult.get("RES_SEQ");
        sAuthType		= (String)mapresult.get("AUTH_TYPE");
        sName			= (String)mapresult.get("NAME");
		//sName			= (String)mapresult.get("UTF8_NAME"); //charset utf8 사용시 주석 해제 후 사용
        sBirthDate		= (String)mapresult.get("BIRTHDATE");
        sGender			= (String)mapresult.get("GENDER");
        sNationalInfo  	= (String)mapresult.get("NATIONALINFO");
        sDupInfo		= (String)mapresult.get("DI");
        sConnInfo		= (String)mapresult.get("CI");
        sMobileNo		= (String)mapresult.get("MOBILE_NO");
        sMobileCo		= (String)mapresult.get("MOBILE_CO");
        
        String session_sRequestNumber = (String)session.getAttribute("REQ_SEQ");
        if(!sRequestNumber.equals(session_sRequestNumber))
        {
            sMessage = "세션값 불일치 오류입니다.";
            sResponseNumber = "";
            sAuthType = "";
        } else {
            sMessage = "정상 처리되었습니다.";
        }
    }

    // 동일 유저 가입여부


    ProjectMapper projectMapper = (ProjectMapper) request.getAttribute("projectmapper");

    int count = projectMapper.selectUserByDI(sDupInfo);

    if(count > 0) {
        iReturn = -999;
        sMessage = "이미 가입된 이력이 있습니다.";
    }

    else if( iReturn == -1)
    {
        sMessage = "복호화 시스템 오류입니다.";
    }    
    else if( iReturn == -4)
    {
        sMessage = "복호화 처리 오류입니다.";
    }    
    else if( iReturn == -5)
    {
        sMessage = "복호화 해쉬 오류입니다.";
    }    
    else if( iReturn == -6)
    {
        sMessage = "복호화 데이터 오류입니다.";
    }    
    else if( iReturn == -9)
    {
        sMessage = "입력 데이터 오류입니다.";
    }    
    else if( iReturn == -12)
    {
        sMessage = "사이트 패스워드 오류입니다.";
    }    
    else
    {
        if(iReturn != 0) {
            sMessage = "알수 없는 에러 입니다. iReturn : " + iReturn;
        }
    }

%>
<%!

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

<html>
<head>
    <title>NICE평가정보 - CheckPlus 안심본인인증</title>
</head>
<body>

    <script type="text/javascript">

        window.resizeTo(600,550);

<%
    if ( iReturn == 0 ) {
%>

        var parameterMap = {
            type : 'hs',

            name : "<%=sName%>",
            gender: "<%=sGender%>",
            dateOfBirth : "<%=sBirthDate%>",
            di: "<%=sDupInfo%>",

            cipherTime : "<%=sCipherTime%>",
            requestNumber : "<%=sRequestNumber%>",
            responseNumber : "<%=sResponseNumber%>",
            authType : "<%=sAuthType%>",
            connInfo : "<%=sConnInfo%>",
            nationalInfo : "<%=sNationalInfo%>",
            mobileNo : "<%=sMobileNo%>",
            mobileCo : "<%=sMobileCo%>",

            hash : "<%=CryptoUtils.sha256(sName)%>"
        };

        var parameterMapJson =  JSON.stringify(parameterMap);

        try {

            opener.postMessage({
                type : 'hs',
                data : parameterMapJson
            }, '*');

            console.log('postMessage');

        } catch (e) {

            console.log('e');

            opener.onIdVerificationCompleted(parameterMapJson);
            opener.PageManager.go(['user', 'join3'], {
                // name: parameterMap['name'],
                // gender: parameterMap['gender'],
                // dateOfBirth: parameterMap['dateOfBirth'],
                // mobileNo: parameterMap['mobileNo']
            });

            // if ( opener.IdCert == undefined ) {
            //     opener.IdCert = {};
            // }
            //
            // opener.INDEX.idProperties = JSON.stringify(parameterMap);
            // opener.PageManager.go(['user', 'join3']);
        }

<%
    }
%>

        alert("<%=sMessage%>");
        self.close();
    </script>

</body>
</html>