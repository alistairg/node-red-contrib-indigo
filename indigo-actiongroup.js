'use strict';

module.exports = function(RED) {

  //////////
  // CONTROL LIGHT WITH MESSAGE
  function IndigoExecuteActionGroupNode(config) {

    this.actionGroupUrl = config.group;
    var node = this;

    // Configure
    RED.nodes.createNode(this, config);

    // Get the connection node
    this.connection = RED.nodes.getNode(config.connection);

    // Register for triggers
    this.on('input', function(msg) {
      node.connection.executeGroupAtUrl(node.actionGroupUrl, function(success) {
        if (success) {
          node.send([msg, null]);
        }
        else {
          node.send([null, msg]);
        }
      });
    })

  }

  //////////
  // REGISTER NODES
  RED.nodes.registerType("indigo-actiongroup", IndigoExecuteActionGroupNode);

}
