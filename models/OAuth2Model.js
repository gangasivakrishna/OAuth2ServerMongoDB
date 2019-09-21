
/**
 * Module dependencies.
 */
const debug = require('debug')('OAuth2Model');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * Schema definitions.
 */

mongoose.model('OAuthTokens', new Schema({
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    client : { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    user : { type: Object },
    userId: { type: String },
  }));
  
  mongoose.model('OAuthClients', new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
  }));
  
  mongoose.model('OAuthUsers', new Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
  }));
  
  var OAuthTokensModel = mongoose.model('OAuthTokens');
  var OAuthClientsModel = mongoose.model('OAuthClients');
  var OAuthUsersModel = mongoose.model('OAuthUsers');
 
  

  /**
 * Get access token.
 */

module.exports.getAccessToken = async function(bearerToken) {

    const tokenObj = await OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
    return tokenObj;
  };
  
  /**
   * Get client.
   */
  
  module.exports.getClient = async function(clientId, clientSecret) {

      const clientDetails =  await OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
      return clientDetails;
  };
  
  /**
   * Get refresh token.
   */
  
  module.exports.getRefreshToken = async function(refreshToken) {
    return await OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
  };
  
  /**
   * Get user.
   */
  
  module.exports.getUser = async function(username, password) {
    return await OAuthUsersModel.findOne({ username: username, password: password }).lean();
  };
  
  /**
   * Save token.
   */
  
  module.exports.saveToken = function(token, client, user) {
    var accessToken = new OAuthTokensModel({
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      client : client,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      user : user,
      userId: user._id,
    });
    console.log("accesss token",accessToken)
    return new Promise( function(resolve,reject){
      accessToken.save(function(err,data){
        if( err ) reject( err );
        else resolve( data );
      }) ;
    }).then(function(saveResult){
      saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;
      
      var data = new Object();
      for( var prop in saveResult ) data[prop] = saveResult[prop];
      
      data.client = data.clientId;
      data.user = data.userId;
  
      return data;
    });
  };