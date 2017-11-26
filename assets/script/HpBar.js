cc.Class({
    extends: cc.Component,

    properties: {
        maxHp: 100,
        hp: 100,
        width: 90,
        x: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.width = this.node.width;
        this.x = this.node.x;
    },

    init: function(maxHp){
        this.maxHp = maxHp;
    },

    minus: function(value){
        this.hp = this.hp - value;
        if(this.hp <= 0){
            this.hp = 0;
            this.node.width = 0;
        } else {
            this.node.width = this.hp * this.width / this.maxHp; 
        }
    },
});
