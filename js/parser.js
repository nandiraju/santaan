function parseRSS(url) {
	$.ajax({
		url : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&callback=?&q=' + encodeURIComponent(url),
		dataType : 'json',
		success : function(data) {
			console.log(data);
			var news = [];
			var img = '';

			for (var i = 0; i < data.responseData.feed.entries.length; i++) {
				var value = data.responseData.feed.entries[i];
				try {
					var firstimg = $(value.content).find("img:first").attr("src");
					if (firstimg) {
						img = firstimg;
					} else {
						img = 'http://lorempixel.com/80/80/fashion/';
					}

				} catch(err) {
					console.log("error");
				}
				var oneItem = {
					title : value.title,
					link : value.link,
					image : img,
					contentSnippet : value.contentSnippet,
					content : value.content,
					publishedDate : value.publishedDate,
					readableDay : moment(value.publishedDate).fromNow(),
					author : value.author
				};
				news.push(oneItem);
			}
			renderNews(news);
		}
	});

}

function renderNews(newsItems) {
	var tiletemplate = $('#ONE_NEWS').html();
	var tilesHtml = Mustache.to_html(tiletemplate, {
		news : newsItems
	});
	$("#feeds").html(tilesHtml);
}
