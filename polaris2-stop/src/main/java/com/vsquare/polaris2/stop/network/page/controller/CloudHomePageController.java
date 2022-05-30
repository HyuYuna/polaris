package com.vsquare.polaris2.stop.network.page.controller;

import com.vsquare.commons.network.http.HttpResponseData;
import com.vsquare.commons.network.http.HttpUrlParams;
import com.vsquare.commons.network.http.HttpUtils;
import com.vsquare.commons.tool.CryptoUtils;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.ModelList;
import com.vsquare.polaris2.core.model.menu.Menu;
import com.vsquare.polaris2.core.model.menu.MenuInfo;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.network.page.LMSPage;
import com.vsquare.polaris2.core.network.page.Page;
import com.vsquare.polaris2.core.network.page.controller.BaseHomePageController;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Controller
public class CloudHomePageController extends BaseHomePageController {


    @Override
    @RequestMapping(value = {"{service_provider_code}", ""})
    public ModelAndView index(
            @PathVariable(value = "service_provider_code", required = false) String service_provider_code,
            HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {



        ModelAndView sslModelAndView = super.checkSsl(httpServletRequest);
        if ( sslModelAndView != null) {
            return sslModelAndView;
        }

        Page page = LMSPage.page(httpServletRequest,
                                 httpServletResponse,
                                 super.userService,
                                 false, "");

        Session session = page.getSession();

        ModelAndView mv = page.getModelAndView();

        ServiceProvider serviceProvider = setSystemVariable(session,
                                                            httpServletRequest,
                                                            mv);

        long serviceProviderId = serviceProvider.getId();

        ModelList<MenuInfo> menuInfoModelList = this.menuService.getMenuInfoList(session,
                                                                                 serviceProviderId,
                                                                                 -1L,
                                                                                 -1L,
                                                                                 true,
                                                                                 false,
                                                                                 true,
                                                                                 Locale.KOREAN.getLanguage() );

        List<MenuInfo> menuInfoList = menuInfoModelList.getList();
        if ( menuInfoList == null || menuInfoList.size() == 0 ) {
            return new ModelAndView("redirect:/page/lms");
        }

        long rootMenuId = menuInfoList.get(0).getId();

        Menu menu = this.menuService.getMenu(session, rootMenuId);

        String body = menu.getContent().getData();

        JSONObject bodyJO = JSONUtils.parseJSONObject(body);

        String theme = JSONUtils.getChildString(bodyJO, "theme");

        mv.setViewName("home/" + theme );

        if ( session != null ) {
            User.Role userRole = session.getUserRole();
            if ( userRole != null ) {
                mv.addObject("userRoleCode", userRole.getCode());
            }

            mv.addObject("userId" , session.getUserId());
        }

        mv.addObject("theme", theme);
        mv.addObject("title", menu.getTitle());
        mv.addObject("menuList", menuInfoModelList.toJsonAware() );

        return mv;
    }






    @RequestMapping(value = "/page/lms/nsso")
    public ModelAndView nsso(HttpServletRequest httpServletRequest,
                             HttpServletResponse httpServletResponse) throws Exception {

//        API KEY    kls_5273adc8f3855bb8779983wderk9dba
//        Domain kls.utime.kr
//        EID_SP : kls-panopto.com

        String API_KEY = "kls_5273adc8f3855bb8779983wderk9dba";

        boolean existed = false;

        Session session = this.userService.updateAndGetSession(httpServletRequest, httpServletResponse);
        if ( session == null ) {
            return null;
        }

        User user = this.userMapper.selectUserByIdx(session.getUserIdx());

        String userId = user.getId();
        String userEmail = user.getEmail();
        String userName = user.getName();
        String userPw = CryptoUtils.sha512(userId + "_STOP");

        {
            String checkApiUrl = "https://kls.utime.kr/wp/?REQ=api_WP_USER_CHECK";

            HttpResponseData httpResponseData =  HttpUtils.post(checkApiUrl, new HttpUrlParams(
                    "USER_ID", userId,
                    "API_KEY", API_KEY));

            String content = httpResponseData.getContentString();

            System.out.println(content);

            JSONObject jsonObject = JSONUtils.parseJSONObject(content);

            String result = JSONUtils.getChildString(jsonObject, "RESULT");

            existed = result.equals("200 OK");

            httpResponseData.shutdown();
        }


        if ( !existed ) {

            String uuid = UUID.randomUUID().toString().replace("-", "");

            String joinApiUrl = "https://kls.utime.kr/wp/?REQ=api_WP_USER_ADD";

            HttpResponseData httpResponseData = HttpUtils.post(joinApiUrl, new HttpUrlParams(
                    "user_name1", "STOP",
                    "USER_ID", userId,
                    "USER_PW", userPw,
                    "NAME2", uuid.substring(0, 6),
                    "USER_EMAIL", uuid + "@stopemail.or.kr",
                    "GROUP", "STOP",
                    "API_KEY", API_KEY));

            String content = httpResponseData.getContentString();
            System.out.println(content);

            httpResponseData.shutdown();
        }

        return new ModelAndView("redirect:https://kls.utime.kr/wp/wp-login.php?action=wp-saml-auth"
                                        + "&EID_SP=kls-panopto" + "&SSO_USER=" + userId + "&SSO_PASS=" + userPw );

//        String deleteApiUrl = "https://kls.utime.kr/wp/?REQ=api_WP_USER_DEL";
//
//        String userId = session.getUserId();
//
//        HttpResponseData httpResponseData1 =  HttpUtils.post(deleteApiUrl, new HttpUrlParams(
//                "USER_ID", userId,
//                "API_KEY", "kls_5273adc8f3855bb8779983wderk9dba"));
//
//        System.out.println(httpResponseData1.getContentString());
//        httpResponseData1.shutdown();


    }


    @ResponseBody
    @RequestMapping(value = ".well-known/pki-validation/05AD0E4538F1B30B233C9477B4535598.txt")
    public String ssl(HttpServletRequest httpServletRequest,
                      HttpServletResponse httpServletResponse) throws Exception {

        return "DFD5455E6A23ABD9DF7D508E8E6A09C679E85A28BBCB51A5103BE7E6EEAE6F1A\n" +
                "comodoca.com";
    }

    // 양성교육 수료증
    @RequestMapping(value = "certificate1")
    public ModelAndView certificate1(HttpServletRequest httpServletRequest,
                                     HttpServletResponse httpServletResponse,
                                     Locale locale) throws Exception {

        Page page = LMSPage.page(httpServletRequest,
                                 httpServletResponse,
                                 this.userService,
                                 false,
                                 "home/certificate1");

        ModelAndView modelAndView = page.getModelAndView();

        try {

        } catch ( Exception e) {

            System.out.println("Exception Occured");

            String message = "오류가 발생 하였습니다.";

            if ( e instanceof CodedException) {

                CodedException codedException = (CodedException)e;
                message = codedException.getMessage();
            }

            ModelAndView messageModelAndView = new ModelAndView("service/popup_message");
            messageModelAndView.addObject("message", message);
            return messageModelAndView;
        }

        return modelAndView;
    }


    // 보수교육 수료증
    @RequestMapping(value = "certificate2")
    public ModelAndView certificate2(HttpServletRequest httpServletRequest,
                                     HttpServletResponse httpServletResponse,
                                     Locale locale) throws Exception {

        Page page = LMSPage.page(httpServletRequest,
                                 httpServletResponse,
                                 this.userService,
                                 false,
                                 "home/certificate2");

        ModelAndView modelAndView = page.getModelAndView();

        try {

        } catch ( Exception e) {

            System.out.println("Exception Occured");

            String message = "오류가 발생 하였습니다.";

            if ( e instanceof CodedException) {

                CodedException codedException = (CodedException)e;
                message = codedException.getMessage();
            }

            ModelAndView messageModelAndView = new ModelAndView("service/popup_message");
            messageModelAndView.addObject("message", message);
            return messageModelAndView;
        }

        return modelAndView;
    }

    // 교육확인서
    @RequestMapping(value = "certificate3")
    public ModelAndView certificate3(HttpServletRequest httpServletRequest,
//                                @RequestParam(value = "key") long key,
                                     HttpServletResponse httpServletResponse,
                                     Locale locale) throws Exception {

        Page page = LMSPage.page(httpServletRequest,
                                 httpServletResponse,
                                 this.userService,
                                 false,
                                 "home/certificate3");

        ModelAndView modelAndView = page.getModelAndView();

        try {

        } catch ( Exception e) {

            System.out.println("Exception Occured");

            String message = "오류가 발생 하였습니다.";

            if ( e instanceof CodedException) {

                CodedException codedException = (CodedException)e;
                message = codedException.getMessage();
            }

            ModelAndView messageModelAndView = new ModelAndView("service/popup_message");
            messageModelAndView.addObject("message", message);
            return messageModelAndView;
        }

        return modelAndView;
    }

    @Override
    public ModelAndView checkSsl(HttpServletRequest httpServletRequest) {

        if (!super.isSslForced()) {
            return null;
        }

        int port = httpServletRequest.getRemotePort();

        String currentUrl = httpServletRequest.getRequestURL()
                                              .toString();
        if (port == 80 || port == 8080) {

            String queryString = httpServletRequest.getQueryString();
            if (StringUtils.isNotBlank(queryString)) {
                queryString = "?" + queryString;
            } else {
                queryString = "";
            }

            return new ModelAndView("redirect:" + "https" + currentUrl.substring(4) + queryString);
        }

        return null;
    }

}
