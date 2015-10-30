var fs = require('fs');
var path = require('path')
var needle = require('needle');

module.exports = function(RED) {

  //////////
  // GLOBAL CONFIG
  function IndigoConnectionNode(config) {

    RED.nodes.createNode(this, config);
    this.setMaxListeners(0);
    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.port = config.port;

    var node = this;

    //////////
    // PUBLIC METHODS
    this.executeGroupAtUrl = function(url, callback) {

      var indigoAuth = { username: config.username, password: config.password, auth: 'digest', json: true };
      var actionGroupsUrl = 'http://' + node.host + ':' + node.port + url;
      needle.request('execute', actionGroupsUrl, [], indigoAuth, function(err, resp) {
        if (!err && resp.statusCode == 303) {
          console.log("Result: " + resp);
          callback(true);
        }
        else
        {
          callback(false);
        }
      });

    }

    //////////
    // REGISTER ADMIN SUPPORT ENDPOINTS
    console.log("Registering groups endpoint: /indigo/actiongroups/" + node.id);
    RED.httpAdmin.get('/indigo/actiongroups/' + node.id, function(req, res, next){

      // Get the results from the indigo server, via Needle
      var indigoAuth = { username: config.username, password: config.password, auth: 'digest', json: true };
      var actionGroupsUrl = 'http://' + node.host + ':' + node.port + '/actions.json';
      console.log("Getting " + actionGroupsUrl + " with " + JSON.stringify(indigoAuth));
      needle.request('get', actionGroupsUrl, [], indigoAuth, function(err, resp) {
        if (!err) {
          console.log("Result: " + resp);
          res.json(resp.body);
        }
        else
        {
          res.status(500).send({error: err});
        }
      });

  	});

  }

  //////////
  // REGISTER NODES
  RED.nodes.registerType("indigo-connection", IndigoConnectionNode);



}
