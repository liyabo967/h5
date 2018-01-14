cc.Class({
    extends: cc.Component,

    properties: {
        target: null,
        moveEnable: false,
        xSpeed: 500,
    },

    init: function (master) {
        this.master = master;
        if(this.master.node.scaleX == -0.5){
            this.node.scaleX = -0.5;
            this.xSpeed = -500;
        } else {
            this.node.scaleX = 0.5;
            this.xSpeed = 500;
        }
    },

    onLoad: function () {
        this.moveEnable = false;
        this.attackPower = 7;
    },

    attack: function(){
        this.moveEnable = true;
        // var action = cc.moveTo(1, moveToX, this.node.y);
        // var action = cc.moveBy(1.5, cc.p(moveToX, 0));
        // this.node.runAction(action);
    },

    onCollisionEnter: function (other, self) {
        if(other.getComponent('Enemy') != null){
            this.target = other.getComponent('Enemy');
            // this.target.beAttacked(this.attackPower);
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

    update: function (dt) {
        if(this.moveEnable){
            this.node.x += this.xSpeed * dt;
            if(this.node.x > 400 || this.node.x < -400){
                this.master.despawnFireBall(this.node);
            }
        }
    }
});
