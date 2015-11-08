module.exports = function(RED) {
    var ir = require('lirc_node');
    function LircIrInNode(config) {
        RED.nodes.createNode(this,config);
        this.debug = config.debug || false;
        this.keyMap = config.keymap || {};
        var node = this;
        this.on('close', function() {
            if (ir !== undefined && ir.stop !== undefined) {
                ir.stop();
            }
        });
        ir.init();
	var lastKey = null;
        var mappKey = function(key) {
            var mappedKey = node.keyMap[key];
            if (mappedKey == undefined) {
                mappedKey = key;
            }
            return mappedKey;
        }
	ir.addListener(function(data) {
            var mappedKey = mappKey(data.key);
            var myPayload = {code: data.code, repeat: data.repeat, key: mappedKey, remote: data.remote};
            var msg = {payload: myPayload};
            if (node.debug) {   
                node.status({fill:"green",shape:"ring",text:"Key: " + mappedKey});
            }
            node.send(msg);
	}, 250);
    }
    RED.nodes.registerType("lirc-ir in", LircIrInNode);
}
