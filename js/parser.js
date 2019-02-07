var newsItems;
var App = {};
App.feedData = {};


function loadDataOld(text) {
    var skey = "'" + escape(text) + "'";

    text = encodeURI(text);
    var rssurl = "https://news.google.com/news/rss/search/section/q/" + text + "/?ned=us&gl=US&hl=en";
    var modifiedItems = [];
    $.get(rssurl, function(data) {
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


// feedLoaded flag

// var feedLoaded = false;
// // stash a copy of the true prefilter function
// var _ajaxPrefilter = $.ajaxPrefilter;
// // create the proxy
// $.ajaxPrefilter = function(func) {
//     _ajaxPrefilter(function() {
//         if (testFlag) {
//             func.apply(this, arguments);
//         }
//     });
// };

// load my libraries here ...

// then restore the original prefilter function
// $.ajaxPrefilter = _ajaxPrefilter;

var _ajaxPrefilter = $.ajaxPrefilter;

function loadData(text) {

    if (newsItems != undefined && newsItems.length > 0) {
        return;
    }


    // jQuery.ajaxPrefilter(function(options) {
    //     options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    // });

    // $.ajaxPrefilter = function(func) {
    //     _ajaxPrefilter(function() {
    //         options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    //     });
    // };


    var skey = "'" + escape(text) + "'";
    if (App.feedData[skey] != undefined) {
        var itemsFound = App.feedData[skey];
        renderView(itemsFound);
    } else {
        text = encodeURI(text);
        var modifiedItems = [];
        var rssurl = "https://news.google.com/news/rss/search/section/q/" + text + "/?ned=us&gl=US&hl=en";

        $.get(rssurl, function(data) { // GET call

            var $xml = $(data);
            $xml.find("item").each(function() { // xml loop

                var item = $(this),
                    one_item = {
                        feedlink: item.find("link").text(),
                        title: item.find("title").text(),
                        date: item.find("pubDate").text(),
                        description: item.find("description").text(),
                        richDescription: item.find("description").text(),
                        author: item.find("author").text(),
                    };

                var content = item.find("media\\:content,content");

                if (content.attr("medium") == "image") {
                    var img = content.attr("url");
                    one_item.has_image = true;
                    one_item.image = img;
                }
                modifiedItems.push(one_item);

            }); // xml loop end

            modifiedItems.sort(function(a, b) {
                return new
                Date(b.date) - new Date(a.date);
            });
            //App.feedData[skey] = modifiedItems;
            //$.ajaxPrefilter = _ajaxPrefilter;
            renderNews(modifiedItems);
        });

    }
}



function renderNews(newsItems) {
    var tiletemplate = $('#ONE_NEWS').html();
    var tilesHtml = Mustache.to_html(tiletemplate, {
        news: newsItems
    });
    $("#feeds").html(tilesHtml);
}