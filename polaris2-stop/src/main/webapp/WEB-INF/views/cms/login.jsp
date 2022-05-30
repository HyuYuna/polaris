<%@ page import="java.util.Map" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
    <meta http-equiv="Content-type" content="text/html; charset=UTF-8" />

    <script type="text/javascript" src="/res/lia/vendor/jquery-1.11.1.min.js?V=7491"></script>
    <script type="text/javascript" src="/res/lia/lia.all.js?V=7491"></script>
</head>

<body>
    <script type="text/javascript">

        var parameterMap = Lia.extractGetParameterMap();
        var redirectUrl = Lia.p(parameterMap,'redirect_url');


        if ( String.isBlank(redirectUrl) ) {
            redirectUrl = '/page/cms';
        }

        var requestParameterMap = {
            redirect_url : redirectUrl
        };

        Lia.redirect('/page/lms/login', requestParameterMap);

    </script>
</body>
</html>