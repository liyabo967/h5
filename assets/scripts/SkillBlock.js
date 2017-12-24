cc.Class({
    extends: cc.Component,

    properties: {
        id: 0,
        icon: cc.Sprite,
        type: 0,
        color: cc.Color
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data) {
        this.id = data.id;
        this.icon.spriteFrame = data.iconSF;
        this.type = data.type;
        this.color = data.color;
    },

    setId: function(id) {
        this.id = id;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
