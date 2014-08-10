if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var MyTwitterApi = (function(options) {

	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/')

	// SELECTORS
	var timelineSelector = $('form[name="timeline"] .results ul');
	var query1Selector = $('form[name="search1"] .results ul');
	var query2Selector = $('form[name="search2"] .results ul');

	// UPDATE UI FUNCTION THAT'S CALLED INSIDE OF AJAX SUCCESS FUNCTION
	var updateUI = function (data, selector, query) {

		// EMPTY TWEETS STRING
		var tweets = "";

		// LOOP THROUGH DATA ARRAY
		for (var i = 0; i < data.length; i++) {

			// MAKE A NEW STRING CALLED TWEETS AND CONCATONATE LI'S AROUND OUR DATA.TEXT
			var tweet = "<li>" + data[i].text + "</li>";

			// IF THERE IS A QUERY, MAKE A HIGHLIGHT VARIABLE WITH STRICT REGEX
			// THEN ADD THE CLASS HIGHLIGHT INSIDE OF A SPAN ON OUR QUERY.
			if (query) {
				var highlightText = new RegExp('(' + query +')', 'i');
				tweet = tweet.replace(highlightText, '<span class="highlight">$1</span>');
			}

			// APPEND TWEET TO TWEETS
			tweets += tweet;

		};	

		// APPEND TWEETS STRING TO OUR SELECTOR
		selector.html(tweets);

	};

	// AJAX FUNCTION 
	var fetchStuff = function() {

		// TIMELINE CLICK EVENT
		$('form[name="timeline"] button').on('click', function() {

			// QUERY VALUE
			var twitterHandle = $('input[name="screen_name"]').val();

			// AJAX CALL
			$.ajax({
				url: "twitter-proxy.php?op=getTimeline",
				data: {

					// REST API PARAMETERS
					screen_name: twitterHandle,
					exclude_replies: true,
					include_rts: false,
					trim_user: true,
					count: 10
				},

				// SUCCESS FUNCTION
				success: function (data) {

					// UPDATE UI FUNCTION
					updateUI(data, timelineSelector);
				},
				dataType: 'json'
			});

			return false;

		});

		// SEARCH CLICK EVENT
		$('form[name="search1"] button').on('click', function() {

			// QUERY VALUE
			var query = $('input[name="q1"]').val();

			// AJAX CALL
			$.ajax({
				url: "twitter-proxy.php?op=search",
				data: {

					// REST API PARAMETERS
					q: query,
					lang: "en",
					result_type: "popular",
					count: 10
				},

				// SUCCESS FUNCTION
				success:  function(data) {

					// MAKE NEW VARIABLE FOR DATA BECAUSE OF HOW OUR JSON IS
					var data2 = data.statuses;

					// UPDATE UI FUNCTION
					updateUI(data2, query1Selector, query);	
				},
				dataType: 'json'
			});

			return false;

		});

	};

	// AJAX FUNCTION
	var fetchBigSexy = function() {

		// SEARCH CRAZY CLICK EVENT
		$('form[name="search2"] button').on('click', function() {

			// QUERY VALUES
			var query = $('input[name="q2"]').val();
			var limit = $('input[name="count"]').val();
			var resultType = $('input[name="result_type"] option:selected').val();

			// AJAX CALL
			$.ajax({
				url: "twitter-proxy.php?op=search",
				data: {

					// REST API PARAMETERS
					q: query,
					lang: "en",
					result_type: resultType,
					count: limit
				},

				// SUCCESS FUNCTION
				success:  function(data) {

					// MAKE NEW VARIABLE FOR DATA BECAUSE OF HOW OUR JSON IS
					var data2 = data.statuses;

					// UPDATE UI FUNCTION
					updateUI(data2, query2Selector, query);	
				},
				dataType: 'json'
			});

			return false;

		});

	};

	var init = function() {

		// CALL PROTECTED SCRIPTS
		fetchStuff();
		fetchBigSexy();
		
	};

	shared.init = init;

	return shared;

}());

$(document).ready(function() {
	MyTwitterApi.init();
});