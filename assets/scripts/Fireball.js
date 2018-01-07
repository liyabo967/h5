cc.Class({
    extends: cc.Component,

    properties: {
        target: null,
    },

    init: function (master) {
        this.master = master;
        if(this.master.node.scaleX == -0.5){
            this.node.scaleX = -0.5;
        } else {
            this.node.scaleX = 0.5;
        }
    },

    onLoad: function () {
        this.attackPower = 7;
    },

    attack: function(){
        var distance = 350 - this.node.x;
        var moveToX = 0;
        if(this.master.node.scaleX == -0.5){
            moveToX = -750;
        } else {
            moveToX = 750;
        }
        // var action = cc.moveTo(1, moveToX, this.node.y);
        var action = cc.moveBy(1.5, cc.p(moveToX, 0));
        this.node.runAction(action);
    },

    onCollisionEnter: function (other, self) {
        if(other.getComponent('Enemy') != null){
            this.target = other.getComponent('Enemy');
            this.target.beAttacked(this.attackPower);
            if(!this.target.isAlive()){
                this.master.enemyKilled();
            }
            this.master.despawnFireBall(this.node);
        }
    },
    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other, self) {

    },

});
