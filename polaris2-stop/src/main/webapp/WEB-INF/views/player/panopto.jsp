<%@ page session="false" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Expires" content="-1"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <meta http-equiv="Cache-Control" content="No-Cache"/>
    <meta http-equiv="Content-type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/lia.css?V=7491"  charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/res/lia/font/notokr-regular/stylesheet.css?V=7491"/>

    <script src="/res/lia/vendor/jquery-1.12.4.min.js?V=7491" type="text/javascript" language="javascript" charset="UTF-8"></script>
    <script src="/res/lia/lia.all.js?V=7491" type="text/javascript" language="javascript" charset="UTF-8"></script>

    <style>

        html, body {
            width: 100%;
            height: 100%;
        }

        body {
            padding: 0;
            margin: 0;
            font-weight: normal;
            overflow: hidden;
            color: #ffffff;
        }

        #wrapper {
            width: 100%;
            height: 100%;
        }

        #player {
            width: 100%;
            height: 100%;
        }

    </style>

    <script type="text/javascript">

        var map = Lia.extractGetParameterMap();
        var bookmark = Lia.p(map, 'bookmark');
        var number = Lia.p(map, 'number');
        var gSubtitleUrl = Lia.p(map, 'subtitle_url');

        // Code to load the IFrame player API code asynchronously
        var tag = document.createElement('script');

        tag.src = "https://developers.panopto.com/scripts/embedapi.min.js?V=7491"
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // The following function creates an <iframe> and Panopto player
        var embedApi;
        function onPanoptoEmbedApiReady()
        {
            embedApi = new EmbedApi("player", {
                width: "100%",
                height: "100%",
                //This is the URL of your Panopto site
                serverName: "kls.ap.panopto.com",
                sessionId: "${videoId}",
                videoParams: { // Optional parameters
                    //interactivity parameter controls if the user sees table of contents, discussions, notes, & in-video search
                    "interactivity": "none",
                    "showtitle": "false",
                    "offerviewer": "false",
                    'autoplay' : 'false'
                },
                events: {
                    "onIframeReady": onPanoptoIframeReady,
                    "onReady": onPanoptoVideoReady,
                    "onStateChange": onPanoptoStateUpdate
                }
            });
        }

        //The API will call this function when the iframe is ready
        function onPanoptoIframeReady()
        {
            // The iframe is ready and the video is not yet loaded (on the splash screen)
            // Load video will begin playback
            embedApi.loadVideo();
        }

        //The API will call this function when the video player is ready
        function onPanoptoVideoReady()
        {
            embedApi.unmuteVideo();

            IFrameManager.parentMessage('load', number, undefined );

            seekTo(Lia.pcd(0, bookmark));

            setInterval(function() {

                var currentTime = embedApi.getCurrentTime();

                IFrameManager.parentMessage('play_time', number, currentTime );

                var curTime = currentTime * 1000;

                if ( g_subtitleData != undefined ) {

                    var text =  jQuery.SubtitleHelper.extractText(g_subtitleData, curTime);

                    if (String.isNullOrWhitespace(text)) {

                        $('#subtitle_layout').hide();
                        $('#subtitle_text').hide()


                    } else {

                        $('#subtitle_layout').show();
                        $('#subtitle_text').show().html(text);

                    }
                }

            }, 500);
        }

        //The API calls this function when a player state change happens
        function onPanoptoStateUpdate(state)
        {
            if (state === PlayerState.Playing)
            {
                IFrameManager.parentMessage('play', number, undefined );

            } else if (state === PlayerState.Paused) {

                IFrameManager.parentMessage('pause', number, undefined );

            } else if (state === PlayerState.Ended) {

                IFrameManager.parentMessage('pause', number, undefined );
            }
        }

        function seekTo( time ) {

            if ( embedApi == undefined ) {
                return;
            }

            embedApi.seekTo(time);
        }

        function play() {

            if ( embedApi == undefined ) {
                return;
            }

            embedApi.playVideo();
        }

        function pause() {

            if ( embedApi == undefined ) {
                return;
            }

            embedApi.pauseVideo();
        }

        function windowscreen() {
        }

        function fullscreen() {
        }

        var SubtitleLoader = {

            load : function(options) {

                var onLoad = Lia.p(options, 'onLoad');
                var url = Lia.p(options, 'url');

                if ( String.isNotBlank(url) ) {

                    var ext = Lia.extractFileExt(url);
                    if ( ext == '.srt') {

                        var requestUrl = '/api/file/getFileContent' + Lia.convertArrayToQueryString({'path' :url, 'encoding' : 'UTF-8' });

                        var ajaxOptions = {
                            method: 'get',
                            url: requestUrl,
                            dataType: 'text',
                            error: function (xhr, options, error ) {

                                if (xhr && xhr.status == 0)
                                    return;
                            },
                            success: function (data) {

                                onLoad(jQuery.SubtitleHelper.parseSrt(data));
                            }
                        };

                        $.ajax(ajaxOptions);

                    } else if ( ext == '.smi' ) {

                        var requestUrl = '/api/file/getFileContent' + Lia.convertArrayToQueryString({'path' :url, 'encoding' : 'UTF-8' });

                        var ajaxOptions = {
                            method: 'get',
                            url: requestUrl,
                            dataType: 'text',
                            error: function (xhr, options, error) {

                                if (xhr && xhr.status == 0)
                                    return;
                            },
                            success: function (data) {

                                onLoad(jQuery.SubtitleHelper.parseSmi(data));
                            }
                        };

                        $.ajax(ajaxOptions);
                    }
                }
            }
        };

        var g_subtitleData = undefined;
        SubtitleLoader.load({
            url : gSubtitleUrl,
            onLoad : function( list ) {
                g_subtitleData = list;
            }
        });

    </script>


</head>

<body>

<div id="wrapper">

    <div id="player"></div>

    <div id="subtitle_layout" style="text-align: center;position:fixed; bottom:12%;left:0px;width:100%;display:none;">
        <div style="background:#000000;color:#FFFFFF; display: -moz-inline-stack;display: inline-block;zoom: 1; *display: inline;margin-left:15px;margin-right:15px;">
		<span id="subtitle_text" style="background:#000000;color:#FFFFFF;font-size:16px;line-height:20px;display:none;padding:5px;font-family: notokr-regular">
		</span>
        </div>
    </div>

</div>

</body>
</html>