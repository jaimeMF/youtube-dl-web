
function InfoViewer(data) {
	this.data = data;
}

InfoViewer.prototype = {
	video_section: function() {
		return document.getElementById('videos-section');
	},
	html_href: function(url) {
		return url
	},
	_html_link: function(url, message) {
		//Html link with no on_click listener
		var link=document.createElement('a');
		link.href=this.html_href(url) || "#";
		link.innerHTML = message || url;
		return link;
	},
	html_link_on_click: function(url) {
		return null;
	},
	html_link: function(url,message) {
		//Html link with an on_click listener
		var link = this._html_link(url,message);
		link.addEventListener("click",this.html_link_on_click(url), false);
		return link;
	},
	html_video_link_on_click: function(url) {
		//Return a function that will be called when the link is clicked.
		return null;
	},
	html_video_link: function(url, message) {
		var link =  this._html_link(url,message);
		link.addEventListener("click",this.html_video_link_on_click(url), false);
		return link;
	},
	video_html: function(video) {
		var el=document.createElement('tr');
		var imageHTML;
		if (video.thumbnail) {
			imageHTML='<img class="video-thumbnail" src="'+video.thumbnail+'"/>';
		}
		else {imageHTML='None';}
		el.innerHTML="<td>"+imageHTML+"</td><td>"+video.title+"</td><td>"+video.ext+"</td> ";
		var video_link_cell=document.createElement('td');
		video_link_cell.appendChild(this.html_video_link(video.url,"Download video"));
		el.appendChild(video_link_cell);
		return el;
	},
	display_error: function(error_msg) {
		var el = this.video_section();
		el.innerHTML='<div class="alert alert-error">\
					  <button type="button" class="close" data-dismiss="alert">&times;</button>\
					  <strong>Oops!</strong><br/>'+
					  error_msg+
					  '<br/>Make sure the website is supported by youtube-dl.</div>';
	},
	display_loading: function(url) {
		this.clear()
		var vid_section=this.video_section();
		var message= document.createElement('p');
		message.innerHTML='Requesting info for the url: '
		message.appendChild(this.html_link(url));
		vid_section.appendChild(message);
		var progress = document.createElement('div');
		progress.setAttribute('class','progress progress-striped active');
		progress.innerHTML='<div class="bar" style="width: 100%;"></div>';
		vid_section.appendChild(progress);
	},
	display: function() {
		this.clear();
		var data = this.data;
		var el = this.video_section();
		if (data.error) {
			this.display_error('<code>'+data.error+'</code>');
			return;
		}
		el.innerHTML ='Videos for: ';//<a href="'+data.url+'">'+data.url+'</a>' ;
		el.appendChild(this.html_link(data.url));
		var table = document.createElement('table');
		table.setAttribute('class','table');
		table.innerHTML='<thead><tr><th>Thumbnail</th><th>Video title</th><th>Format</th><th>Download link</th></tr></thead>'
		var table_body= document.createElement('tbody');
		for (var i=0; i<data.videos.length; i++) {
			var video=data.videos[i];
			table_body.appendChild(this.video_html(video));
		}
		table.appendChild(table_body);
		el.appendChild(table);
	},
	clear: function() {
		this.video_section().innerHTML = '';
	}
}
