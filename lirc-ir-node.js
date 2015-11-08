module.exports = function(RED) {
    var ir = require('lirc_node');
    function LircIrInNode(config) {
        RED.nodes.createNode(this,config);
        this.debug = config.debug || false;
        var node = this;
        var statusTimeout;
        node.on('close', function() {
            if (ir !== undefined && listenerId !== undefined) {
                ir.removeListener(listenerId);
            }
            if (statusTimeout !== undefined) {
                clearTimeout(statusTimeout);
            }
        });
        ir.init();
	var lastKey = null;
	var listenerId = ir.addListener(function(data) {
            var myPayload = {code: data.code, repeat: data.repeat, key: data.key, remote: data.remote};
            var msg = {payload: myPayload};
            if (node.debug) {   
                node.status({fill:"green",shape:"ring",text:"Key: " + data.key});
                if (statusTimeout !== undefined) {
                    clearTimeout(statusTimeout);
                }
                statusTimeout = setTimeout(function() { node.status({}); }, 2000);
            }
            node.send(msg);
	}, 450);
    }
    RED.nodes.registerType("lirc-ir in", LircIrInNode);
}
