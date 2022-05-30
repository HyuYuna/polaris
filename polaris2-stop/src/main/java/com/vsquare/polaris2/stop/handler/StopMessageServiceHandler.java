package com.vsquare.polaris2.stop.handler;

import com.surem.api.mms.SureMMSAPI;
import com.surem.api.sms.SureSMSAPI;
import com.surem.net.SendReport;
import com.surem.net.mms.SureMMSDeliveryReport;
import com.surem.net.sms.SureSMSDeliveryReport;
import com.vsquare.commons.tool.StringUtils;
import com.vsquare.polaris2.core.Code;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.file.Attachment;
import com.vsquare.polaris2.core.model.message.Message;
import com.vsquare.polaris2.core.model.message.MessageReceiver;
import com.vsquare.polaris2.core.model.message.MessageTemplate;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.service.message.impl.AbstractMessageServiceHandler;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

@Component
public class StopMessageServiceHandler extends AbstractMessageServiceHandler {


    @Override
    public MessageTemplate doGetDormantUserRegistrationMessageTemplate(Message.Type type,
                                                                       String id,
                                                                       String name) throws Exception {
        MessageTemplate messageTemplate = new MessageTemplate();
        messageTemplate.setMessageType(type);
        messageTemplate.setTitle("휴면 계정 전환 안내");
        messageTemplate.setBody(id + " - " + name);

        return messageTemplate;
    }

    @Override
    public MessageTemplate doGetDormantUserRegistrationWarningMessageTemplate(Message.Type type,
                                                                              String id,
                                                                              String name,
                                                                              Date lastLoggedInDate,
                                                                              Date expectedDormantUserRegistrationDate) throws Exception {
        MessageTemplate messageTemplate = new MessageTemplate();
        messageTemplate.setMessageType(type);
        messageTemplate.setTitle("휴면 계정 전환 사전 안내");
        messageTemplate.setBody(id + " - " + name);

        return messageTemplate;
    }


    //표 관련 데이터 받기
    public String makeEmailForm(String title, String body, int tableRowNumber, boolean enableButton, String buttonText, String buttonLink) {
        String html = "<div style=\"width: 1000px; padding : 100px 150px; background-color: #F8F8F8; box-sizing : border-box;\">\n" +
                "   <div style=\"width: 700px; background-color: #FFFFFF;\">\n" +
                "        <div class=\"gradation\" style=\"height: 4px; width: 100%; background: linear-gradient(to right, #7147A9 , #A951AD);\"></div>\n" +
                "        <div class=\"logoBox\" style=\"height: 96px; border-bottom : 1px solid #E5E5E5; width: 100%;\">\n" +
                "           <div style=\"padding : 32px 0; width : 100%\">" +
                "               <img src=\"http://edu.stop.or.kr/res/home/img/stop/common/btn_logo_header.png\" style=\" width: fit-content; margin: 0 0 0 210px;\">" +
                "           </div>" +
                "        </div>\n" +
                "        <div style=\"width: 620px; margin: 0 auto;\">\n" +
                "            <div class=\"titleAndInfo\" style=\"padding: 30px 0; border-bottom: 1px solid #E5E5E5;\">\n" +
                "                <p style=\"font-size : 24px;\">";

        html += title + "</p>";

        html += "<div style=\"width: 20px; background-color: #7147A9; height: 2px; margin: 30px 0;\"></div>\n" +
                "                <p style=\"color: #474747;\">안녕하세요,</p>\n" +
                "                <p style=\"color: #7147A9;\">한국여성인권진흥원 여성폭력 피해자 보호/지원시설 종사자 교육포털 <span style=\"color: #474747;\">입니다</span></p>\n" +
                "            </div>\n" +
                "            <div class=\"contents\" style=\"padding : 40px 0; border-bottom : 1px solid #E5E5E5; font-size : 14px; color:#474747\">\n" +
                body;

        if (enableButton) {
            html += "<a href = \"" + buttonLink + "\" target=\"_blank\" style=\"width: 140px; height: 56px; display: block; margin : 0 auto; background-color: #7147A9; color: #FFFFFF; font-size: 16px; letter-spacing: -0.32px; text-align:center; line-height:56px; text-decoration:none; margin-top : 40px;\">" + buttonText + "</a>";
        }

        html += "            </div>\n" +
                "            <div class=\"footerInfo1\" style=\"height: 50px; background-color: #F8F8F8; margin-top : 40px;\">\n" +
                "                <p style=\"line-height: 50px; color: #888888; padding-left: 20px; font-size: 13px;\">본 메일은 발신전용으로 회신이 되지 않습니다. 문의사항은 고객센터를 이용하여 주십시오.</p>\n" +
                "            </div>\n" +
                "            <div class=\"footerInfo2\" style=\"padding : 30px 0 42px 0; \">\n" +
                "                <p style=\"margin: 0; margin-bottom: 5px; color: #888888; font-size: 13px;\">한국여성인권진흥원</p>\n" +
                "                <p style=\"margin: 0; margin-bottom: 5px; color: #888888; font-size: 13px;\">(우)04505 서울특별시 중구 서소문로 50 센트럴플레이스 3층</p>\n" +
                "                <p style=\"margin: 0; margin-bottom: 18px; color: #888888; font-size: 13px;\">TEL 02-735-1050 / FAX 02-6363-8493 / 상담전화 1366(유료)</p>\n" +
                "                <p style=\"margin: 0; color: #CCCCCC; font-size: 10px;\">COPYRIGHT 2020 WOMEN'S HUMAN RIGHTS INSTITUTE OF KOREA, ALL RIGHT RESERVED.</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>";


        return html;
    }

    @Override
    public MessageTemplate doGetPasswordResetMessageTemplate(
            HttpServletRequest httpServletRequest,
            ServiceProvider serviceProvider,
            Message.Type type,
            String id,
            String name,
            String temporaryPassword) throws Exception {

        MessageTemplate messageTemplate = new MessageTemplate();
        messageTemplate.setMessageType(type);
        messageTemplate.setTitle("[한국여성인권진흥원 교육포털] 비밀번호 초기화");

        if (type == Message.Type.EMAIL) {

            String mailTemplate = makeEmailForm("[한국여성인권진흥원 교육포털] 비밀번호 초기화", "임시 비밀번호는 다음과 같습니다.<br/> " + temporaryPassword, 0, true, "로그인페이지로 이동", "https://edu.stop.or.kr/?m1=%2Fuser%2Flogin");
            messageTemplate.setBody(mailTemplate);

        } else {

            messageTemplate.setBody("[한국여성인권진흥원 교육포털] 임시 비밀번호 : " + temporaryPassword);

        }

        return messageTemplate;
    }

    @Override
    public MessageTemplate doGetUserDeleteMessageTemplate(Message.Type type,
                                                          String id,
                                                          String name) throws Exception {

        MessageTemplate messageTemplate = new MessageTemplate();
        messageTemplate.setMessageType(type);
        messageTemplate.setTitle("회원 탈퇴 처리 완료");
        messageTemplate.setBody("요청하신 계정의 탈퇴처리가 완료되었습니다. 추후 동일 꼐정으로 재가입 및 이력복구가 불가능한 점 참고해주시기 바랍니다. 감사합니다.");

        return messageTemplate;
    }


    private static String USER_CODE = "edu1234";
    private static String USER_NAME = "여성인권진흥원";
    private static String USER_DEPT_CODE = "LB-URF-GQ";


    @Override
    @Transactional(rollbackFor = Exception.class, isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRES_NEW)
    public void doSendTextMessage(ServiceProvider serviceProvider,
                                  String senderPhoneNumber,
                                  MessageReceiver messageReceiver,
                                  long messageId,
                                  String title,
                                  String body,
                                  List<Attachment> attachmentList,
                                  JSONObject properties,
                                  Date sentDate ) throws Exception {

        String userMobilePhoneNumber = messageReceiver.getMobilePhoneNumber();

        String userName = messageReceiver.getName();
        if (StringUtils.isBlank(userName)) {
            userName = "사용자";
        }

        if (body.getBytes("euc-kr").length > 80) {

            // MMS
            if (StringUtils.isBlank(title)) {
                title = body.substring(0,
                        body.length() > 10 ? 10 : body.length());
            }

            SureMMSAPI mms = new SureMMSAPI() {

                @Override
                public void report(SureMMSDeliveryReport dr) {
                    System.out.print("msgkey=" + dr.getMember() + "\t");    // �޽��� ������
                    System.out.print("result=" + dr.getResult() + "\t");    // '2': ���� ��� ����.  '4': ���� ��� ����
                    System.out.print("errorcode=" + dr.getErrorCode() + "\t");    // ��� �ڵ�
                    System.out.print("recvtime=" + dr.getRecvDate() + dr.getRecvTime() + "\t");    // �ܸ��� ���� �ð�
                    System.out.println();
                }
            };

            SendReport sr = mms.sendMain(
                    (int) messageId, USER_CODE, USER_DEPT_CODE,
                    userMobilePhoneNumber,
                    "0263638447",
                    "00000000000000",
                    title,
                    body,
                    "",
                    "",
                    "");

            if ("1".equals(sr.getStatus())) {
                throw new CodedException(Code.FAILED_TO_SEND_MESSAGE);
            }

//            mms.recvReport("00000000", USER_CODE, USER_DEPT_CODE);

        } else {

            SureSMSAPI sms = new SureSMSAPI() {

                @Override
                public void report(SureSMSDeliveryReport dr) {
                    System.out.print("msgkey=" + dr.getMember() + "\t");
                    System.out.print("result=" + dr.getResult() + "\t");
                    System.out.print("errorcode=" + dr.getErrorCode() + "\t");
                    System.out.print("recvtime=" + dr.getRecvDate() + dr.getRecvTime() + "\t");
                    System.out.println();
                }
            };

            String userMobilePhoneNumber1 = userMobilePhoneNumber.substring(0, 3);
            String userMobilePhoneNumber2 = userMobilePhoneNumber.substring(3, 7);
            String userMobilePhoneNumber3 = userMobilePhoneNumber.substring(7);

            SendReport sr = sms.sendMain((int) messageId, USER_CODE, USER_DEPT_CODE,
                    USER_NAME,
                    userMobilePhoneNumber1, userMobilePhoneNumber2, userMobilePhoneNumber3,
                    userName, "02", "6363", "8447",
                    body, "00000000", "000000");

            if ("1".equals(sr.getStatus())) {
                throw new CodedException(Code.FAILED_TO_SEND_MESSAGE);
            }
//            sms.recvReport("00000000", USER_CODE, USER_DEPT_CODE);

        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class, isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRES_NEW)
    public void doSendPushMessage(ServiceProvider serviceProvider,
                                  String senderName,
                                  MessageReceiver messageReceiver,
                                  long messageId,
                                  String title,
                                  String body,
                                  JSONObject properties,
                                  Date sentDate ) throws Exception {
        super.doSendPushMessage(serviceProvider,
                senderName,
                messageReceiver,
                messageId,
                title,
                body,
                properties,
                sentDate);
    }
}
