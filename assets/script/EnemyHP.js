cc.Class({
    extends: cc.Component,

    properties: {
        blood:100,
    },

    // use this for initialization
    onLoad: function () {
        var ctx = this.getComponent(cc.Graphics);
        // 红色矩形
        ctx.lineWidth = 1;
        ctx.fillColor = cc.Color.RED;
        ctx.rect(10,0,10,40);
        ctx.fill();
    },

    minus: function(value){
        var ctx = this.getComponent(cc.Graphics);
        ctx.clear();
        this.blood = this.blood - value;
        if(this.blood > 0){
            // 红色矩形
            ctx.lineWidth = 1;
            ctx.fillColor = cc.Color.RED;
            ctx.rect(10,0,10+this.blood,40);
            ctx.fill();
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
