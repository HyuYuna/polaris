package com.vsquare.polaris2.stop.handler;

import com.vsquare.commons.network.http.HttpResponseData;
import com.vsquare.commons.network.http.HttpUrlParams;
import com.vsquare.commons.network.http.PostHttpConnector;
import com.vsquare.commons.tool.JSONUtils;
import com.vsquare.polaris2.core.Code;
import com.vsquare.polaris2.core.exception.CodedException;
import com.vsquare.polaris2.core.model.content.LessonSubitem;
import com.vsquare.polaris2.core.model.content.VideoContent;
import com.vsquare.polaris2.core.model.file.PathType;
import com.vsquare.polaris2.core.model.serviceprovider.ServiceProvider;
import com.vsquare.polaris2.core.service.content.impl.AbstractContentServiceHandler;
import com.vsquare.polaris2.core.service.file.FileServiceHandler;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.charset.StandardCharsets;

@Component
public class StopContentServiceHandler extends AbstractContentServiceHandler {

    @Autowired
    private FileServiceHandler fileServiceHandler;

//    private static final Logger LOGGER = LogManager.getLogger(CloudContentServiceHandler.class);
//
//    @Autowired
//    ProjectMapper projectMapper;
//
//    @Transactional(rollbackFor = Exception.class, isolation = Isolation.READ_COMMITTED)
//    public void insert( String uploadKey,
//                        Long lessonSubitemId,
//                        Date registeredDate ) throws Exception {
//        this.projectMapper.insertKollusEncoding(uploadKey, lessonSubitemId, registeredDate);
//    }
//
//    @Transactional(rollbackFor = Exception.class, isolation = Isolation.READ_COMMITTED)
//    public void update( String uploadKey,
//                        String mediaKey,
//                        Date lastModifiedDate ) throws Exception {
//
//        this.projectMapper.updateKollusEncoding(uploadKey, mediaKey, lastModifiedDate);
//    }

    @Override
    public String doEncodeVideoContent(VideoContent videoContent,
                                       LessonSubitem lessonSubitem,
                                       ServiceProvider serviceProvider) throws Exception {

//        String uploadFileKey = videoContent.getVideoSource();
//
//        long lessonSubitemId = lessonSubitem.getId();
//
//        LOGGER.error("doEncodeVideoContent!!! " + uploadFileKey + " " + lessonSubitemId );
//
//        this.insert(uploadFileKey, lessonSubitemId, new Date());
//
//        org.json.simple.parser.JSONParser jsonParser = new JSONParser();
//
//        String cdnProperties = serviceProvider.getCdnProperties();
//        JSONObject cdnPropertiesJsonObject = (JSONObject) jsonParser.parse(cdnProperties);
//
////        {"kollus_api_token":"8tvuyw6mtvn21eso","kollus_cuid":"vsqure","kollus_secret_key":"vsqure","kollus_user_key":"0f3883f60b229a370350970f4f0b97bed03208fe5cd416e3e812ab0f746085ef"}
//
//        String kollusApiToken = cdnPropertiesJsonObject.get("kollus_api_token").toString();
//        String kollusChannelKeyToken = JSONUtils.getChildString(cdnPropertiesJsonObject, "kollus_channel_key");
//
//        while (true) {
//
//            try {
//
//                HttpResponseData data = HttpUtils.get(KollusAPIController.KOLLUS_MEDIA_CONTENT_URL + uploadFileKey +
//                        "?access_token=" + kollusApiToken);
//                String json = data.getContentString();
//
//                JSONObject body = (JSONObject) jsonParser.parse(json);
//
//                Integer transcodingStage = JSONUtils.getChildInteger(body, "result", "item", "transcoding_stage");
//
//                LOGGER.error("Result KOLLUS_MEDIA_CONTENT_URL " + uploadFileKey + " " + transcodingStage);
//
//                if (transcodingStage == null || transcodingStage == 12) {
//                    // do noting
//                } else if (transcodingStage == 21) {
//
//                    if ( StringUtils.isBlank(kollusChannelKeyToken) ) {
//
//                        HttpResponseData channelData = HttpUtils.get(KollusAPIController.KOLLUS_CHANNEL_INDEX_URL, new HttpUrlParams(
//                                "access_token", kollusApiToken
//                        ));
//                        String channelJson = channelData.getContentString();
//                        JSONObject channelJO = (JSONObject) jsonParser.parse(channelJson);
//
////                {"result":{"kind":"package","count":1,"items":{"item":[{"name":"테스트","position":1,"count_of_media_contents":2,"key":"7a2bmsarl8sf4d60","status":1}]},"order":"position_asc"},"error":0}
//                        String channelKey = JSONUtils.getChildString(channelJO, "result", "items", "item", "0", "key");
//                        if (StringUtils.isBlank(channelKey)) {
//                            throw new CodedException(Code.ETC);
//                        }
//
//                        kollusChannelKeyToken = channelKey;
//                    }
//
//
//                    HttpResponseData attachData = HttpUtils.post(KollusAPIController.KOLLUS_CHANNEL_ATTACH_URL + uploadFileKey + "?access_token=" + kollusApiToken, new HttpUrlParams(
//                            "channel_key", kollusChannelKeyToken
//                    ));
//                    String attachJSON = attachData.getContentString();
//
//                    JSONObject attachJO = (JSONObject) jsonParser.parse(attachJSON);
//                    String mediaKey = JSONUtils.getChildString(attachJO, "result", "media_content_key");
//                    if (StringUtils.isBlank(mediaKey)) {
//                        throw new CodedException(Code.ETC);
//                    }
//
//                    this.update(uploadFileKey, mediaKey, new Date());
//
//                    return mediaKey;
//
//                }
//
//            } catch (Exception e) {
//                e.printStackTrace();
//                return null;
//            }
//
//            Thread.sleep(5000);
//        }

        return null;
    }

    @Override
    public void doAttachSubtitleToCDN(ServiceProvider serviceProvider,
                                      String subtitleUrl,
                                      String videoSource) throws Exception {

        String absolutePath = this.fileServiceHandler.doGetAttachmentDownloadPath(subtitleUrl,
                                                                                  PathType.ABSOLUTE);
        File file = new File(absolutePath);
        if (!file.exists()) {
            throw new CodedException(Code.NO_SUCH_FILE);
        }

        String content = FileUtils.readFileToString(file,
                                                    StandardCharsets.UTF_8);
        if (StringUtils.isBlank(content)) {
            throw new CodedException(Code.ETC,
                                     "파일을 읽을 수 없습니다.");
        }

        String requestUrl = "https://kls.utime.kr:10443/pt/caption_upload_type_VSXML_DFXP";

        PostHttpConnector httpConnector = new PostHttpConnector();
        httpConnector.setUrl(requestUrl);
        httpConnector.setHttpUrlParams(new HttpUrlParams(
                "userkey",
                "klsadmin",
                "userpwd",
                "kls123!@",
                "transcript",
                content,
                "sessionId",
                videoSource
        ));

        HttpResponseData data = httpConnector.request();

        String response = data.getContentString();

        data.shutdown();

        JSONObject jsonObject = JSONUtils.parseJSONObject(response);

        Boolean boolResult = JSONUtils.getChildBoolean(jsonObject,
                                                       "boolResult");
        if (boolResult == null || boolResult != true) {
            throw new CodedException(Code.ETC);
        }
    }
}