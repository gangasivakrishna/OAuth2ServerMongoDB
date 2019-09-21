const debug = require('debug')('OAuth2Service');
const OAuth2Model = require('../models/OAuth2Model.js');
const OAuth2Server = require('oauth2-server'),     //Represents an OAuth2 server instance.
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;
var instance;
/**
 * Instantiates OAuth2Server using the supplied model.
 */
var oAuth2 = new OAuth2Server({
    model:OAuth2Model,
    accessTokenLifetime: 86500,
    allowBearerTokensInQueryString: true
});
/**
 * Creating constructor
 */
function OAuth2Service(){
}
/**
 * Define the shared properties and methods using the prototype
 */

/**
 * Obtaine OAuth token with Basic Authentication
 */
OAuth2Service.prototype.obtainToken = function(req, res) {
	var request = new Request(req);
    var response = new Response(res);
	return oAuth2.token(request, response)
		.then(function(token) {
            debug("obtainToken: token %s obtained successfully",token);
			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}
/**
 * Authenticates a request.
 */
OAuth2Service.prototype.authenticateRequest = function(req, res, next) {
	var request = new Request(req);
	var response = new Response(res);
	return oAuth2.authenticate(request, response)
		.then(function(token) {
			debug("the request was successfully authenticated")
			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}
/**
 * Export an Instance
 */
module.exports = {
    getInstance: function () {
        if (!instance) {
            instance = new OAuth2Service();
        }

        return instance;
    }
};