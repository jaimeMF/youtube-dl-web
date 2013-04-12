
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
		link.textContent = message || url;
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
			imageHTML=document.createElement('img');
			imageHTML.src = video.thumbnail;
			imageHTML.className = "video-thumbnail";
		}
		else {imageHTML=null;}
		
		var cell_image = document.createElement('td');
		cell_image.appendChild(imageHTML);
		var cell_title = document.createElement('td');
		cell_title.textContent = video.title;
		var cell_ext = document.createElement('td');
		cell_ext.textContent = video.ext;
		var cell_video_link=document.createElement('td');
		cell_video_link.appendChild(this.html_video_link(video.url,"Download video"));
		var cells=[cell_image,cell_title, cell_ext, cell_video_link];
		for (var i=0; i< cells.length; i++)
		{
			el.appendChild(cells[i]);
		}
		return el;
	},
	display_error: function(error_msg) {
		var el = this.video_section();
		var div = document.createElement('div');
		div.className = 'alert alert-error';
		
		var close = document.createElement('button');
		close.type='button';
		close.className='close';
		close.setAttribute('data-dismiss', 'alert');
		close.textContent =  '×';
		div.appendChild(close);
		
		var oops = document.createElement('strong');
		oops.textContent = 'Oops!';
		div.appendChild(oops);
		
		div.appendChild(error_msg);
		
		var msg = document.createElement('p');
		
		msg.textContent = 'Make sure the website is supported by youtube-dl.';
		
		div.appendChild(msg);

		el.appendChild(div);
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
			var err_msg = document.createElement('code');
			err_msg.textContent = data.error;
			this.display_error(err_msg);
			return;
		}
		el.innerHTML ='Videos for: ';
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
