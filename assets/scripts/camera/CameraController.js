cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);
    },

    onEnable: function () {
       // cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
       // cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    //called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var liveNode = null;
        for(let i = 0;i<this.target.length;i++){
            var obj = this.target[i];
            if(obj.active){
                liveNode = obj;
                break;
            }
        }
        if(liveNode != null){
            let targetPos = liveNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            this.node.y = this.node.parent.convertToNodeSpaceAR(targetPos).y;
        }
    },
});
