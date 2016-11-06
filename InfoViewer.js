
// Renders the video information contained in the data in the video-section html element
function InfoViewer(data) {
    this.data = data;
}

InfoViewer.prototype = {
    video_section: function () {
        return document.getElementById('videos-section');
    },
    html_href: function (url) {
        return url;
    },
    _html_link: function (url, message) {
        //Html link with no on_click listener
        var link = document.createElement('a');
        link.href = this.html_href(url) || "#";
        link.textContent = message || url;
        return link;
    },
    html_link_on_click: function (url) {
        return null;
    },
    html_link: function (url, message) {
        //Html link with an on_click listener
        var link = this._html_link(url, message);
        link.addEventListener("click", this.html_link_on_click(url), false);
        return link;
    },
    html_video_link_on_click: function (url) {
        //Return a function that will be called when the link is clicked.
        return null;
    },
    html_video_link: function (url, message) {
        var link =  this._html_link(url,message);
        link.addEventListener("click", this.html_video_link_on_click(url), false);
        return link;
    },
    html_rtmp_command: function (video) {
        var url = video.url,
            play_path = video.play_path;
        var command_el = document.createElement('code'),
            command_message = document.createElement('p')
            command = 'rtmpdump -o video.' + video.ext + ' -r "' + url + '"';
        if (play_path) command += ' -y "' + play_path + '"';
        command_el.textContent = command
        command_el.className = 'command'
        command_message.textContent = 'Run this command in the commnad line:'
        command_message.appendChild(command_el)
        return command_message
    },
    html_download_element_for_video: function (video) {
        var url = video.url;
        var protocol = url.substring(0,4)
        if (protocol === 'http') return this.html_video_link(url, 'Download video');
        else if (protocol === 'rtmp') return this.html_rtmp_command(video);
        else console.error('Protocol not supported');
    },
    // Return an html element for the video, it's actually a table row.
    video_html: function (video) {
        var i, imageHTML, el = document.createElement('tr'), cell_image = document.createElement('td'), cell_title = document.createElement('td'), cell_ext = document.createElement('td'), cell_video_link = document.createElement('td'), cells = [cell_image, cell_title, cell_ext, cell_video_link];
        if (video.thumbnail) {
            imageHTML = document.createElement('img');
            imageHTML.src = video.thumbnail;
            imageHTML.className = "video-thumbnail";
        } else {
            imageHTML = document.createElement('p');
            imageHTML.textContent = 'NA';
        }
        cell_image.appendChild(imageHTML);
        cell_title.textContent = video.title;
        cell_ext.textContent = video.ext;
        cell_video_link.appendChild(this.html_download_element_for_video(video));
        for (i = 0; i < cells.length; i++) {
            el.appendChild(cells[i]);
        }
        return el;
    },
    /* Display an error message
       error_msg can be a string or a html element
     */
    display_error: function (error_msg) {
        var el = this.video_section(), div = document.createElement('div'), oops = document.createElement('strong'), close = document.createElement('button'), msg = document.createElement('p'), error;
        div.className = 'alert alert-danger';

        close.type = 'button';
        close.className = 'close';
        close.setAttribute('data-dismiss', 'alert');
        close.textContent = '×';
        div.appendChild(close);

        oops.textContent = 'Oops!';
        div.appendChild(oops);

        if (typeof error_msg === "string") {
            error = document.createElement('p');
            error.textContent = error_msg;
            div.appendChild(error);
        } else { div.appendChild(error_msg); }
        
        msg.textContent = 'Make sure the website is supported by youtube-dl.';
        
        div.appendChild(msg);

        el.appendChild(div);
    },
    // Display a progress bar while the data is being load
    display_loading: function (url) {
        this.clear();
        var vid_section = this.video_section(), message = document.createElement('p'), progress = document.createElement('div');
        message.innerHTML = 'Requesting info for the url: ';
        message.appendChild(this.html_link(url));
        vid_section.appendChild(message);
        progress.id = "progressbar";
        progress.setAttribute('class', 'progress');
        progress.innerHTML = '<div class="progress-bar progress-bar-striped active" style="width: 100%;"></div>';
        vid_section.appendChild(progress);
    },
    // Display the videos information
    display: function () {
        this.clear();
        var data = this.data, el = this.video_section(), err_msg, table, table_body, i;
        if (data.error) {
            err_msg = document.createElement('code');
            err_msg.textContent = data.error;
            this.display_error(err_msg);
            return;
        }
        el.innerHTML = 'Videos for: ';
        el.appendChild(this.html_link(data.url));
        table = document.createElement('table');
        table.setAttribute('class', 'table');
        table.innerHTML = '<thead><tr><th>Thumbnail</th><th>Video title</th><th>Format</th><th>Download link</th></tr></thead>';
        table_body = document.createElement('tbody');
        info = data.info
        result_type = info._type || 'video'
        if (result_type === 'video') {
            var videos = [info]
        } else {
            var videos = info.entries
        }
        for (i = 0; i < videos.length; i++) {
            table_body.appendChild(this.video_html(videos[i]));
        }
        table.appendChild(table_body);
        el.appendChild(table);
    },
    // Clear the video-section
    clear: function () {
        this.video_section().innerHTML = '';
    }
};
