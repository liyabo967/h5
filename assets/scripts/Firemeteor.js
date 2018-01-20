cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10,
        target: null,
    },

    init: function (master,target) {
        this.master = master;
        this.target = target;
        if(this.master.node.scaleX == -0.5){
            this.node.scaleX = 0.5;
        } else {
            this.node.scaleX = -0.5;
        }
    },

    onLoad: function () {
        this.attackPower = 30;
    },

    attack: function(){
        if(this.master.node.scaleX == -0.5){
            this.node.scaleX = 0.5;
        } else {
            this.node.scaleX = -0.5;
        }
        cc.log('fire meteor attack, this.node.scaleX: '+this.node.scaleX);
        var dragonDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
        dragonDisplay.armatureName = 'Armature';
        dragonDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.aramtureEventHandler,this);
        dragonDisplay.playAnimation('fireball');
        this.target.beAttacked(this.attackPower);
    },

    aramtureEventHandler: function(){
        this.master.despawnFiremeteor(this.node);
        if(!this.target.isAlive()){
            this.master.enemyKilled();
        }
        //cc.log('fire meteor -------------- aramtureEventHandler');
    }
});
