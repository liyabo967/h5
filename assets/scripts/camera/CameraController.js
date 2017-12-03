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
        let targetPos = this.target[0].convertToWorldSpaceAR(cc.Vec2.ZERO);
        cc.log(targetPos.x + " " + targetPos.y);
        this.node.y = this.node.parent.convertToNodeSpaceAR(targetPos).y;
        cc.log("camera node: " + this.node.x + " " + this.node.y);
    },
});
