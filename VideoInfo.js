
// Allows to get the video of the url through the api_url (optional)
function BaseVideoInfo(url, api_url) {
    this.url = url || 'null';
    api_url = api_url || "https://youtube-dl.appspot.com";
    this.api_url = api_url + "/api/info";
}

BaseVideoInfo.prototype = {
    log: function () {
        console.log("VideoInfo:\n\t=> URL: " + this.url + "\n\t=> API URL: " + this.api_url);
    },
    // Get the info of the url
    get_info:  function () {
        $.getJSON(
            this.api_url,
            {'url': this.url, flatten: false},
            this.process_video_info
        ).error(this.api_call_failed);
    },
    // This function will be called when the video data is received
    process_video_info: function (data) {
        console.error("Nothing to be done with the data");
    },
    api_call_failed: function (jqXHR, textStatus, errorThrown) {
        console.error("Error on the api call");
    }
};
