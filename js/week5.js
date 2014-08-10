if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var MyTwitterApi = (function(options) {

	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/')

	// FETCH STUFF

	var timelineSelector = $('form[name="timeline"] .results ul');
	var query1Selector = $('form[name="search1"] .results ul');
	var query2Selector = $('form[name="search2"] .results ul');

	var updateUI = function (data, selector, query) {

		var tweets = "";

		for (var i = 0; i < data.length; i++) {

			var tweet = "<li>" + data[i].text + "</li>";

			if (query) {
				var highlightText = new RegExp('(' + query +')', 'i');
				tweet = tweet.replace(highlightText, '<span class="highlight">$1</span>');
			}

			tweets += tweet;

		};	

		selector.html(tweets);

	};

	var fetchStuff = function() {

		// TIMELINE

		$('form[name="timeline"] button').on('click', function() {

			var twitterHandle = $('input[name="screen_name"]').val();

			$.ajax({
				url: "twitter-proxy.php?op=getTimeline",
				data: {
					screen_name: twitterHandle,
					exclude_replies: true,
					include_rts: false,
					trim_user: true,
					count: 10
				},
				success: function (data) {
					updateUI(data, timelineSelector);
				},
				dataType: 'json'
			});

			return false;

		});

		// QUERY

		$('form[name="search1"] button').on('click', function() {

			var query = $('input[name="q1"]').val();

			$.ajax({
				url: "twitter-proxy.php?op=search",
				data: {
					q: query,
					lang: "en",
					result_type: "popular",
					count: 10
				},
				success:  function(data) {
					var data2 = data.statuses;
					updateUI(data2, query1Selector, query);	
				},
				dataType: 'json'
			});

			return false;

		});

	};

	var fetchBigSexy = function() {

		$('form[name="search2"] button').on('click', function() {

			var query = $('input[name="q2"]').val();
			var limit = $('input[name="count"]').val();
			var resultType = $('input[name="result_type"] option:selected').val();

			$.ajax({
				url: "twitter-proxy.php?op=search",
				data: {
					q: query,
					lang: "en",
					result_type: resultType,
					count: limit
				},
				success:  function(data) {
					var data2 = data.statuses;
					updateUI(data2, query2Selector, query);	
				},
				dataType: 'json'
			});

			return false;

		});

	};

	var init = function() {
		fetchStuff();
		fetchBigSexy();
	};

	shared.init = init;

	return shared;

}());

$(document).ready(function() {
	MyTwitterApi.init();
});