Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("isMeditationViewed", function(request, response) {
	var query = new Parse.Query("UserView");
	query.equalTo("meditation",{
        __type: "Pointer",
        className: "meditations",
        objectId: request.params.meditationId
    });
	query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: request.params.userId
    });
	
	query.find({
		success: function(results) {
			if (results.length > 0) {
				response.success(true);
			} else {
				response.success(false);
			}
		},
		error: function() {
			response.error("Could not execute query");
		}
	});
});

Parse.Cloud.define("getMeditationsViewed", function(request, response) {
	var query = new Parse.Query("UserView");
	query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: request.params.userId
    });
	
	query.find({
		success: function(results) {
			var ids =  [];
			for (var i = 0 ; i < results.length ; i++) {
				ids.push(results[i].get("meditation").id);
			}
			
			response.success(ids);
		},
		error: function() {
			response.error("Could not execute query");
		}
	});
});

Parse.Cloud.define("CountMeditationsViewed", function(request, response) {
	var queryView = new Parse.Query("UserView");
	queryView.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: request.params.userId
    });
	
	
	queryView.find({
		success: function(results) {
			
			var meditationsViewedIds = [];
			for (var i = 0 ; i < results.length ; i++) {
				meditationsViewedIds.push(results[i].get("meditation").id);
			}
			
			
			var queryGuide = new Parse.Query("meditations");
			queryGuide.find({
				success: function(results) {
					var result = {};
					for (var i = 0 ; i < results.length ; i++) {
						var guideId = results[i].get("guide").id; 
						var meditationId = results[i].id;
						if (!result[guideId]) {
							result[guideId] = {count: 0, total: 0};
						}
						result[guideId].total += 1;
						if (meditationsViewedIds.indexOf(meditationId) != -1) {
							result[guideId].count += 1;
						} 
					}
					response.success(result);
				},
				error: function() {
					response.error("Could not execute queryGuide");
				}
			});
		},
		error: function() {
			response.error("Could not execute queryView");
		}
	});
});