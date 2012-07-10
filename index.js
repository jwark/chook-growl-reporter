var growl = require('growl'),
	growlTitle = { title: 'JS quality check'};

var imageBasePath = __dirname + '/resources/',
	errorImage = imageBasePath + 'error.png',
	successImage = imageBasePath + 'success.png';

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

				function growlProblem(type, msg) {
					var title = msg.suiteName + ': ',
						message = msg.name + ':' + msg.error.name + ': ' + msg.error.message;
					growl(escapeForGrowl(message), {title: escapeForGrowl(title), image: errorImage}, function(growlStatus) { 
						if (growlStatus) {
							console.log('growl error: ' + growlStatus);
						}
					});
				};

				e.on('fail', function(msg) {
					growlProblem('failure', msg);
				});

				e.on('error', function(msg) {
					growlProblem('error', msg);
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
						title = (status.fail + status.error) > 0 ? 'FAILURE' : 'SUCCESS',
						imageFile = (status.fail + status.error) > 0 ? errorImage : successImage;
					growl(message, {title: title, image: imageFile});
				});
			}
		};
	}

};