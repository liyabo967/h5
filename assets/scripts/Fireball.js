cc.Class({
    extends: cc.Component,

    properties: {
        attackPower: 10,
        target: null,
    },

    init: function (master) {
        this.master = master;
    },

    onLoad: function () {
        
    },

    attack: function(){
        cc.log('Fireball ----------------- Fireball');
        var action = cc.moveTo(2, 100, 100);
        this.node.runAction(action);
    },

    onCollisionEnter: function (other, self) {
        if(other.getComponent('Enemy') != null){
            this.target = other.getComponent('Enemy');
            this.target.beAttacked(this.attackPower);
            this.master.despawnFireBall(this);
        }
    },
    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other, self) {

    },

});
