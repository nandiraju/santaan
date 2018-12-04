var newsItems;

function loadData(text) {
    var skey = "'" + escape(text) + "'";

    text = encodeURI(text);
    var yql = encodeURIComponent("select * from xml where url='https://news.google.com/news/rss/search/section/q/" + text + "/?ned=us&gl=US&hl=en'");
    var modifiedItems = [];
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + yql + "&format=json&callback=?", function(data) {
        if (!data.query.results.rss.channel.item || data.query.results.rss.channel.item.length < 1) {
            alert("No data found");
            return;
        }
        var items = data.query.results.rss.channel.item;
        $.each(items, function(i, item) {

            var img = "";

            if (img = "") {
                img = $(item.description)
                    .find("img:first")
                    .attr("src");
            }

            if (item.content) {
                img = item.content.url;
            }


            var oneItem = {
                feedlink: item.link,
                title: item.title,
                date: item.pubDate,
                description: $(item.description).text(),
                richDescription: item.description,
                col2: $(item.description).find("td:first-child+td").html(),
                // image: $(item.description).find("img:first").attr("src")
                image: img
            };
            modifiedItems.push(oneItem);
        });
        newsItems = modifiedItems;
        renderNews(modifiedItems);
    });
}


function renderNews(newsItems) {
    var tiletemplate = $('#ONE_NEWS').html();
    var tilesHtml = Mustache.to_html(tiletemplate, {
        news: newsItems
    });
    $("#feeds").html(tilesHtml);
}