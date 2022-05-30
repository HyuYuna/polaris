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
import com.vsquare.polaris2.core.network.page.controller.BaseLMSPageController;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Controller
public class CloudLMSPageController extends BaseLMSPageController {

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
