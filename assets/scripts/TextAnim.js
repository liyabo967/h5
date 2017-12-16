cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
    },

    init:function (game) {
        this.game = game;
    },

    setString: function(s){
        var text = this.getComponent(cc.Label);
        text.string = s;
    },

    play: function(){
        var anim = this.getComponent(cc.Animation);
        // 如果没有指定播放哪个动画，并且有设置 defaultClip 的话，则会播放 defaultClip 动画
        anim.play();
    },
    
    // update: function (dt) {

    // },
});
