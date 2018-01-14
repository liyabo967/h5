cc.Class({
    extends: cc.Component,

    properties: {

    },

    init: function(master){
        this.master = master;
    },

    // use this for initialization
    onLoad: function () {
        this.attackPower = 8;
    },

    // direction 为1则向右 为0向左
    shoot: function(direction, range, toY, maxHeight, duration, angle) {
        if(this.master.node.scaleX == -0.5){
            direction = 0;
        } else {
            direction = 1;
        }
        var toX = range;
        var rotateAngle = 2*angle;
    	if(direction == 0) {
    		toX = -range;
            rotateAngle = -2*angle;
            this.node.rotation = - (180 - angle);
    	} else {
            this.node.rotation = -angle;
        }

        var jumpTo = cc.jumpBy(duration, cc.p(toX, toY), maxHeight, 1);
        var rotateTo = cc.rotateBy(duration,rotateAngle).easing(cc.easeSineInOut());
        var spawn = cc.spawn(jumpTo, rotateTo);

        this.node.runAction(spawn);

        this.scheduleOnce(this.actionFinished,duration);
    },

    actionFinished: function(){
        this.node.removeFromParent();
    },


    onCollisionEnter: function (other, self) {
        if(other.getComponent('Enemy') != null){
            //cc.log('---------- onCollisionEnter attack');
            this.target = other.getComponent('Enemy');
            this.target.beAttacked(this.attackPower);
            if(!this.target.isAlive()){
                this.master.enemyKilled();
            }
            this.node.stopAllActions();
            this.unschedule(this.actionFinished);
            this.master.despawnSkill(this.node);
        }
    },
    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other, self) {

    },
    

});
