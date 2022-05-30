package com.vsquare.polaris2.stop.network.page.controller.player;

import com.vsquare.polaris2.core.network.BaseController;
import com.vsquare.polaris2.core.network.page.LMSPage;
import com.vsquare.polaris2.core.network.page.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value = "/page/player")
public class PanoptoPlayerPageController extends BaseController {

    @RequestMapping(value = "/panopto")
    public ModelAndView panopto(@RequestParam(value = "videoId") String videoId,
                              HttpServletRequest httpServletRequest,
                              HttpServletResponse httpServletResponse) throws Exception {

        String viewName = "/player/panopto";
        Page page = LMSPage.page(httpServletRequest,
                httpServletResponse,
                super.userService,
                false,
                viewName);
        ModelAndView mv = page.getModelAndView();
        mv.addObject(Page.Model.VIDEO_ID,
                videoId);
        return mv;
    }

}
