var growl = require('growl'),
	growlTitle = { title: 'JS quality check'};

// This can be used in a 'configure' block, e.g. 
// chook_growl_reporter = require('chook-growl-reporter');
// chook.use(chook_growl_reporter.individualFailureOrError());
// chook.use(chook_growl_reporter.summary());
module.exports = {

	individualFailureOrError: function() {
		return {
			reporter: function(e) {

				function escapeForGrowl(text) {
					var escaped = text.replace(/\(/g, '\\(');
					escaped = escaped.replace(/\)/g, '\\)');
					escaped = escaped.replace(/\"/g, '\\"');
					return escaped;
				}

				function growlIt(type, msg) {
					var title = type + ': ' + msg.name,
						message = msg.error.name + ': ' + msg.error.message;
					//console.log(type + ' found, growl message:', message, 'title:', title);
					growl(escapeForGrowl(message), {title: escapeForGrowl(title)}, function(growlStatus) { 
						if (growlStatus) {
							console.log('growl error: ' + growlStatus);
						}
					});
				};

				e.on('fail', function(msg) {
					growlIt('failure', msg);
				});

				e.on('error', function(msg) {
					growlIt('error', msg);
				});
			}
		};
	},

	summary: function() {
		return {
			reporter: function(e) {

				e.on('complete', function(status) {
					var message = 'TOTAL: ' + status.total
								+ ', pass: ' + status.pass
								+ ', fail: ' + status.fail
								+ ', error: ' + status.error,
						title = (status.fail + status.error) > 0 ? 'FAILURE' : 'SUCCESS';

					growl(message, {title: title});
				});
			}
		};
	}

};