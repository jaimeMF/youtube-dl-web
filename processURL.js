var API_URL="http://localhost:8081/api/"

function htmlForVideo(video) {
	var el=document.createElement('tr');
	el.innerHTML="<td>"+video.title+"</td><td>"+video.ext+"</td> ";
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
	el.innerHTML ='Videos for: <a href="'+data.url+'">'+data.url+'</a>' ;
	var table = document.createElement('table');
	table.setAttribute('class','table');
	table.innerHTML='<thead><tr><th>Video title</th><th>Format</th><th>Download link</th></tr></thead>'
	var table_body= document.createElement('tbody');
	for (var i=0; i<data.videos.length; i++) {
		var video=data.videos[i];
		table_body.appendChild(htmlForVideo(video));
	}
	table.appendChild(table_body);
	el.appendChild(table);
}

function apiCallFailed() {
	//alert('api call failed');
	var el = document.getElementById('videos-section');
	var url_form=document.getElementById('URLform');
	el.innerHTML='<div class="alert alert-error">\
				<button type="button" class="close" data-dismiss="alert">&times;</button>\
              <strong>Oops!</strong> Something went wrong. Make sure the website is supported by youtube-dl.\
            </div>';
    url_form.style.display='block';
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
		//alert(url_value);
		//url_value="http://store.steampowered.com/video/105600/";
		parent=URLform.parentNode
		URLform.style.display='none'//css('display' , 'none'); //.hide()
		//parent.removeChild(URLform);
		parent=document.getElementById('main-part');
		var el = document.createElement('p');
		el.innerHTML='<p>Requesting info for the url: '+url_value+'</p>';
		var progress = document.createElement('div');
		progress.setAttribute('class','progress progress-striped active');
		progress.innerHTML='<div class="bar" style="width: 100%;"></div>';
		el.appendChild(progress);
		el.id='videos-section';
		parent.appendChild(el);
		processVideosURL(url_value);
		
	}
	return false;	
}