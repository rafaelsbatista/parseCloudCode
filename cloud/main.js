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