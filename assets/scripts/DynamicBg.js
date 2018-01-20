var BgElementResList = cc.Class({
    name: 'BgElementResList',
    properties: {
        id: 0,
        resUrl: cc.String,
        width: 0,
        height: 0,
        position: cc.Vec2
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

        let that = this;
        
        var url = cc.url.raw('resources/bgData/bgConf.json');
        cc.loader.load( url, function(err, res)
        {
            // 如果有異常會在 err 變數顯示, 否則在res就會是讀進來的json object
            let resJsonList = res;
            for(let i = 0; i < resJsonList.length; i++) {
                let nodeElement = new cc.Node();
                nodeElement.setContentSize(resJsonList[i].width, resJsonList[i].height);
                let spriteElement = nodeElement.addComponent(cc.Sprite);

                that._addSpritePic(spriteElement, resJsonList[i].resUrl);

                nodeElement.setAnchorPoint(0.5, 1);
                nodeElement.x = resJsonList[i].pos_x;
                nodeElement.y = - resJsonList[i].pos_y;

                that.node.addChild(nodeElement);
            }
        });
        
    },



    _addSpritePic: function(container, addres){
        cc.loader.loadRes(addres, cc.SpriteFrame, function (err, spFrame) {
            container.spriteFrame = spFrame;           
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
