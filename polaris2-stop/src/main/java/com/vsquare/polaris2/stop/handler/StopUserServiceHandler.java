package com.vsquare.polaris2.stop.handler;

import com.vsquare.commons.tool.CryptoUtils;
import com.vsquare.commons.tool.FilenameUtils;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.Code;
import com.vsquare.polaris2.core.database.mapper.UserMapper;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.NameValuePair;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.model.user.Session;
import com.vsquare.polaris2.core.model.user.User;
import com.vsquare.polaris2.core.model.user.UserAccount;
import com.vsquare.polaris2.core.model.user.UserProperties;
import com.vsquare.polaris2.core.service.user.UserServiceTransactionHandler;
import com.vsquare.polaris2.core.service.user.impl.JDBCSessionUserServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class StopUserServiceHandler extends JDBCSessionUserServiceHandler {

    @Autowired
    private UserServiceTransactionHandler userServiceTransactionHandler;

    @Autowired
    private UserMapper userMapper;


    @Override
    public void doAfterRegisterUserAccount(long serviceProviderId,
                                           long userIdx,
                                           String id,
                                           String rawPassword,
                                           boolean adminPage) throws Exception {


        User user = this.userMapper.selectUserByIdx(userIdx);
        if ( user.getRole() != User.Role.STUDENT ) {
            return;
        }


        UserProperties userProperties = userMapper.selectUserPropertyByUserIdx(userIdx);
        if (userProperties == null || userProperties.size() == 0) {
            throw new CodedException(Code.ETC,
                                     "모든 정보를 입력하여 주십시오.");
        }

        String hash = "";

        for (NameValuePair pair : userProperties) {

            if (pair.getName().equals("company_attachment_document_file")) {

                String url = null;
                if ( StringUtils.isNotBlank(pair.getValue()) ) {
                    url = JSONUtils.getChildString(JSONUtils.parseJSONArray(pair.getValue()), "0", "url");
                }

                if (StringUtils.isNotBlank(url)) {
                    String extension = FilenameUtils.getExtension(url)
                                                    .toLowerCase();
                    if (!(extension.equals("jpg") || extension.equals("jpeg") || extension.equals("png") || extension.equals("pdf") || extension.equals("bmp"))) {
                        throw new CodedException(Code.ETC,
                                                 "이미지 파일은 JPG, JPEG, PNG, PDF, BMP 파일만 업로드 할 수 있습니다.");
                    }
                }

            }

            if (pair.getName()
                    .equals("hash")) {
                hash = pair.getValue();
            }
        }

        if (!adminPage && StringUtils.isNotBlank(hash)) {

            if (!hash.equals(CryptoUtils.sha256(user.getName()))) {
                throw new CodedException(Code.ETC,
                                         "잘못된 입력이 존재합니다.");
            }
        }
    }

    @Override
    public UserAccount doGetUserAccount(ServiceProvider serviceProvider,
                                        Long institutionId,
                                        String id,
                                        String password) throws Exception {

        return super.userMapper.selectUserAccountByServiceProviderIdAndId(serviceProvider.getId(),
                                                                          id);
    }

    @Override
    public String doEncryptUserPassword(String password,
                                        boolean passwordEncrypted,
                                        String salt,
                                        String encoding) throws Exception {

        return CryptoUtils.sha512(password)
                          .toUpperCase();
    }


    @Override
    @Transactional(rollbackFor = Exception.class, isolation = Isolation.READ_COMMITTED)
    public void doLogout(Session session,
                         HttpServletRequest httpServletRequest,
                         HttpServletResponse httpServletResponse) throws Exception {

        if (session != null) {

            String sessionKey = session.getSessionKey();
            super.userMapper.deleteSessionBySessionKey(sessionKey);

            // 내부 캐쉬에서 삭제
//            super.cacheManager.removeSessionCache(sessionKey);
        }

        Cookie sessionKeyCookie = new Cookie(SESSION_KEY_COOKIE_NAME,
                                             "");
        sessionKeyCookie.setPath(SESSION_KEY_COOKIE_PATH);
        sessionKeyCookie.setMaxAge(0);
        httpServletResponse.addCookie(sessionKeyCookie);
    }
}
