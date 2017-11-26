cc.Class({
    extends: cc.Component,

    properties: {
        maxHp: 100,
        hp: 100,
        hpComponent:null,
    },

    // use this for initialization
    onLoad: function () {
        cc.log('Enemy-------------onLoad');
    },

    init: function (game) {
        this.game = game;
        this.hpComponent = game.enemyHp.getComponent('HpBar');
        this.hpComponent.init(this.maxHp);
    },

    isAlive:function(){
        return this.hp > 0;
    },

    beAttacked: function(hurt){
        this.hp -= hurt;
        if(this.hp <= 0){
            this.hp = 0;
            this.node.active = false;
        }
        this.hpComponent.minus(hurt);
        cc.log('Enemy-------------'+this.hp+', -'+hurt);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
