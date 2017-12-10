var BgElementResList = cc.Class({
    name: 'BgElementResList',
    properties: {
        id: 0,
        resUrl: cc.String,
        width: 0,
        height: 0
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        resList:{
            default:[],
            type: BgElementResList
        }
    },

    // use this for initialization
    onLoad: function () {
        // let currentBgHeight = 0; 
        // for(let i = 0; i < this.resList.length; i++) {
        //     let nodeElement = new cc.Node();
        //     nodeElement.setContentSize(this.resList[i].width, this.resList[i].height);
        //     let spriteElement = nodeElement.addComponent(cc.Sprite);

        //     this._addSpritePic(spriteElement, this.resList[i].resUrl);

        //     nodeElement.setAnchorPoint(0.5, 1);
        //     nodeElement.x = 0;
        //     nodeElement.y = - currentBgHeight;

        //     currentBgHeight += nodeElement.height;

        //     cc.log(currentBgHeight + " " + nodeElement.width + " " + nodeElement.height);
        //     this.node.addChild(nodeElement);
        // }
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
