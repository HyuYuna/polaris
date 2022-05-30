package com.vsquare.polaris2.stop.network.page.controller;

import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.polaris2.stop.database.mapper.ProjectMapper;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.network.BaseController;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value = "/page/id")
public class IDPageController extends BaseController{

    @Autowired
    ProjectMapper projectMapper;

    /* IPIN */
    public void setModelAndView(ModelAndView modelAndView, ServiceProvider serviceProvider) throws ParseException {

        String properties = serviceProvider.getProperties();

        JSONObject propertiesJSON = JSONUtils.parseJSONObject(properties);

        modelAndView.addObject("verification_id", JSONUtils.getChildString(propertiesJSON, "verification_id"));
        modelAndView.addObject("verification_number", JSONUtils.getChildString(propertiesJSON, "verification_number"));
        modelAndView.addObject("verification_password", JSONUtils.getChildString(propertiesJSON, "verification_password"));

    }

    //TODO : 리다이렉트 이슈
    @RequestMapping(value = "/request")
    public ModelAndView request( HttpServletRequest httpServletRequest,
                                 HttpServletResponse httpServletResponse) throws Exception {

        ModelAndView modelAndView = new ModelAndView("id/request");

        ServiceProvider serviceProvider = super.checkAndGetServiceProvider(null, httpServletRequest);

        setModelAndView(modelAndView, serviceProvider);

        modelAndView.addObject("baseUrl", super.getBaseUrl(httpServletRequest));

        return modelAndView;
    }

    @RequestMapping(value = "/step1")
    public ModelAndView step1( HttpServletRequest httpServletRequest,
                               HttpServletResponse httpServletResponse) throws Exception {

        ModelAndView modelAndView = new ModelAndView("id/step1");

        ServiceProvider serviceProvider = super.checkAndGetServiceProvider(null, httpServletRequest);

        setModelAndView(modelAndView, serviceProvider);

        return modelAndView;
    }

    @RequestMapping(value = "/step2")
    public ModelAndView step2( HttpServletRequest httpServletRequest,
                               HttpServletResponse httpServletResponse) throws Exception {

        ModelAndView modelAndView = new ModelAndView("id/step2");

        ServiceProvider serviceProvider = super.checkAndGetServiceProvider(null, httpServletRequest);

        setModelAndView(modelAndView, serviceProvider);

        modelAndView.addObject("projectmapper", this.projectMapper);

        return modelAndView;
    }



    /* 핸드폰 본인인증 */
    
    @RequestMapping(value = "/main")
    public ModelAndView main( HttpServletRequest httpServletRequest,
                                 HttpServletResponse httpServletResponse) throws Exception {

        ModelAndView modelAndView = new ModelAndView("id/checkplus_main");

        ServiceProvider serviceProvider = super.checkAndGetServiceProvider(null, httpServletRequest);

        setModelAndView(modelAndView, serviceProvider);

        modelAndView.addObject("baseUrl", super.getBaseUrl(httpServletRequest));

        return modelAndView;
    }

    @RequestMapping(value = "/fail")
    public ModelAndView fail( HttpServletRequest httpServletRequest,
                               HttpServletResponse httpServletResponse) throws Exception {

        ModelAndView modelAndView = new ModelAndView("id/checkplus_fail");

        ServiceProvider serviceProvider = super.checkAndGetServiceProvider(null, httpServletRequest);

        setModelAndView(modelAndView, serviceProvider);

        return modelAndView;
    }

    @Autowired
    @RequestMapping(value = "/success")
    public ModelAndView success( HttpServletRequest httpServletRequest,
                               HttpServletResponse httpServletResponse) throws Exception {

        ModelAndView modelAndView = new ModelAndView("id/checkplus_success");

        ServiceProvider serviceProvider = super.checkAndGetServiceProvider(null, httpServletRequest);

        setModelAndView(modelAndView, serviceProvider);

        modelAndView.addObject("projectmapper", this.projectMapper);

        return modelAndView;
    }
}
