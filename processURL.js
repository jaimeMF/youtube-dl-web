var viewer = new InfoViewer();

function processVideosData(data) {
    viewer.data = data;
    viewer.display();
}

function apiCallFailed(jqXHR, textStatus, errorThrown) {
    viewer.display_error('Something went wrong.');
}

function use_localserver() {
    // return true;
    var localserver = localStorage.localserver;
    if (localserver === "true") { return true; } else { return false; }
}

//We extend BaseVideoInfo
function VideoInfo(url) {
    var api;
    if (use_localserver()) {
        api = "http://localhost:9191";
        console.log("Using " + api + " as API server");
    } else { console.log("Using default API server"); }
    BaseVideoInfo.call(this, url, api);
}

VideoInfo.prototype = Object.create(BaseVideoInfo.prototype,
    {
        process_video_info: {value: processVideosData},
        api_call_failed: {value: apiCallFailed}
    });


function processVideosURL(video_url) {
    viewer.display_loading(video_url);
    var video_info = new VideoInfo(video_url);
    video_info.get_info();
}

function processURLform(URLform) {
    var url_value = URLform.url.value;
    if (url_value !== "") {
        processVideosURL(url_value);
    }
    return false;
}
