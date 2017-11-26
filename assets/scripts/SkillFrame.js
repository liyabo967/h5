
var SkillBlockResList = cc.Class({
    name: 'SkillBlockResList',
    properties: {
        id: 0,
        iconSF: cc.SpriteFrame
    }
});

cc.Class({
    extends: cc.Component,

    properties: {

        skillBlockResList: {
            default: [],
            type: SkillBlockResList
        },

        skillBlockPrefab: cc.Prefab,

        skillBlockDuration:1,

        maxSkillNum:6,

        maxEreaseNum:3,

        fullMoveTime:0.3,

        fullMoveDistance:745,

        skillBlockWidth:105,

        skillBlockMargin:18,

        skillBlockOriginX:-440,

        skillBlockOriginY:65,

        skillBlockArray:{
            default: [],
            type: [cc.Prefab],
            visible: false
        }
    },

    // use this for initialization
    onLoad: function() {
        this.timer = 0;
    },

    init: function(game){
        this.game = game;
    },

    addSkillBlock: function() {
        var arrayLength = this.skillBlockArray.length ;

        if(arrayLength < this.maxSkillNum) {
            cc.log("add skill SkillBlock");
            var item = cc.instantiate(this.skillBlockPrefab);
            var randType = Math.floor(Math.random()*this.skillBlockResList.length);
            var data = this.skillBlockResList[randType];
            this.node.addChild(item);
            item.getComponent("SkillBlock").init({
                id: new Date().getTime(),
                iconSF: data.iconSF,
                type: data.id
            });
            item.x = this.skillBlockOriginX;
            item.y = this.skillBlockOriginY;

            if(arrayLength > 0) {
                var preComponent = this.skillBlockArray[arrayLength - 1].getComponent("SkillBlock");
                if(preComponent.type == randType) {
                    item.getComponent("SkillBlock").setId(preComponent.id);
                }
            }

            item.on(cc.Node.EventType.TOUCH_START, function (event) {
              console.log('Mouse down');
              var checkResult = this.checkErase(0);
              this.eraseSkillBlock(checkResult[0], checkResult[1]);
              this.game.player.getComponent('Player').playSkill();
            }, this);
        
            item.runAction(cc.moveBy(this.fullMoveTime * (this.maxSkillNum - arrayLength) / this.maxSkillNum, 
                this.fullMoveDistance - (this.skillBlockWidth + this.skillBlockMargin) * arrayLength,
                0));

            this.skillBlockArray.push(item);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function(dt) {
        if(this.timer > this.skillBlockDuration) {
            this.addSkillBlock();
            this.timer = 0;
            return ;
        }

        this.timer += dt;
    },

    checkErase: function(index) {
        var left = index - 1;
        var right = index + 1;

        var arrayLength = this.skillBlockArray.length;

        while(left >= 0 && this.skillBlockArray[left].getComponent("SkillBlock").id == 
            this.skillBlockArray[index].getComponent("SkillBlock").id) {   
            left -= 1;
        }
        left += 1;

        while(right < arrayLength && 
        this.skillBlockArray[right].getComponent("SkillBlock").id == 
            this.skillBlockArray[index].getComponent("SkillBlock").id) {
            right += 1;
        }
        right -= 1;

        if(left < 0) {
            left = 0;
        }

        if(right >= arrayLength) {
            right = arrayLength-1;
        }

        if(right - left + 1 > this.maxEreaseNum) {
            right = left + this.maxEreaseNum - 1;
        }

        /**
        * skillType为本次释放的技能类型
        * skillIntensity为本次技能的强度
        */
        var skillType = this.skillBlockArray[index].getComponent("SkillBlock").type;
        var skillIntensity = right - left + 1;

        return [left, right];
    },

    eraseSkillBlock:function(left, right) {
        var arrayLength = this.skillBlockArray.length;

        for(i = left; i <= right; i++) {
            this.skillBlockArray[i].destroy();
        }

        for (i = right + 1; i < arrayLength; i++) {
            if(i < arrayLength-1) {
                this.skillBlockArray[i].runAction(cc.moveBy(this.fullMoveTime * (right - left + 1) / this.maxSkillNum, 
                    (this.skillBlockWidth + this.skillBlockMargin) * (right - left + 1),
                    0));
            } else {
                var finished = cc.callFunc(function(target, gap) {
                    this.skillBlockArray.splice(gap[0], gap[1] - gap[0] + 1);
                }, this, [left, right]);
                this.skillBlockArray[i].runAction(cc.sequence(cc.moveBy(this.fullMoveTime * (right - left + 1) / this.maxSkillNum, 
                    (this.skillBlockWidth + this.skillBlockMargin) * (right - left + 1),
                    0), finished));
            }
        }
    }

});
