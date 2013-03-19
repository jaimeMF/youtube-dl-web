var API_URL="http://youtube-dl.appspot.com/api/"

function htmlForVideo(video) {
	var el=document.createElement('tr');
	var imageHTML;
	if (video.thumbnail) {
		imageHTML='<img class="video-thumbnail" src="'+video.thumbnail+'"/>';
	}
	else {imageHTML='None';}
	el.innerHTML="<td>"+imageHTML+"</td><td>"+video.title+"</td><td>"+video.ext+"</td> ";
	var video_link_cell=document.createElement('td');
	var video_link=document.createElement('a');
	video_link.href=video.url;
	video_link.innerHTML="Download video";
	video_link_cell.appendChild(video_link);
	el.appendChild(video_link_cell);
	return el;
}
function processVideosData(data) {
	var el = document.getElementById('videos-section');
	if (data.error) {
		reportError('<code>'+data.error+'</code>');
		return;
	}
	el.innerHTML ='Videos for: <a href="'+data.url+'">'+data.url+'</a>' ;
	var table = document.createElement('table');
	table.setAttribute('class','table');
	table.innerHTML='<thead><tr><th>Thumbnail</th><th>Video title</th><th>Format</th><th>Download link</th></tr></thead>'
	var table_body= document.createElement('tbody');
	for (var i=0; i<data.videos.length; i++) {
		var video=data.videos[i];
		table_body.appendChild(htmlForVideo(video));
	}
	table.appendChild(table_body);
	el.appendChild(table);
}

function reportError(error_msg) {
	var el = document.getElementById('videos-section');
	el.innerHTML='<div class="alert alert-error">\
				  <button type="button" class="close" data-dismiss="alert">&times;</button>\
				  <strong>Oops!</strong><br/>'+
				  error_msg+
				  '<br/>Make sure the website is supported by youtube-dl.</div>';
}

function apiCallFailed(jqXHR, textStatus, errorThrown) {
		reportError('Something went wrong.');
}
	
function processVideosURL(video_url) {
	$.getJSON(
			 API_URL,
			 {'url':video_url},
			 processVideosData
			 ).error(apiCallFailed);

}

function processURLform(URLform) {
	var url_value=URLform.url.value;
	if (url_value!="") {
		var vid_section=document.getElementById('videos-section');
		vid_section.innerHTML='<p>Requesting info for the url: '+url_value+'</p>';
		var progress = document.createElement('div');
		progress.setAttribute('class','progress progress-striped active');
		progress.innerHTML='<div class="bar" style="width: 100%;"></div>';
		vid_section.appendChild(progress);
		processVideosURL(url_value);
		
	}
	return false;	
}
