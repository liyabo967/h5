
var SkillBlockResList = cc.Class({
    name: 'SkillBlockResList',
    properties: {
        id: 0,
        iconSF: cc.SpriteFrame,
        color: cc.Color
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
        },

        skillDisappearPrefab: {
            default:null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function() {
        this.timer = 0;
        // 技能块池
        this.skillBlockPool = new cc.NodePool();
        for (let i = 0; i < this.maxSkillNum; i++) {
            let skillBlock = cc.instantiate(this.skillBlockPrefab);
            skillBlock.on(cc.Node.EventType.TOUCH_START, function (event) {
               var checkResult = this.checkErase(0);
               this.eraseSkillBlock(checkResult[0], checkResult[1]);
               this.game.player.getComponent('Player').playSkill();
            }, this);
            this.skillBlockPool.put(skillBlock);
        }
        // 技能消失特效池
        this.skillDisappearPool = new cc.NodePool();
        for (let i = 0; i < 5; i++) {
            let skillDisappear = cc.instantiate(this.skillDisappearPrefab);
            this.skillDisappearPool.put(skillDisappear);
        }
    },

    init: function(game){
        this.game = game;
    },

    addSkillBlock: function() {
        var arrayLength = this.skillBlockArray.length ;

        if(arrayLength < this.maxSkillNum) {
            var item = null;
            if(this.skillBlockPool.size() > 0) {
                item = this.skillBlockPool.get();
            } else {
                item = cc.instantiate(this.skillBlockPrefab);
                item.on(cc.Node.EventType.TOUCH_START, function (event) {
                  var checkResult = this.checkErase(0);
                  this.eraseSkillBlock(checkResult[0], checkResult[1]);
                  this.game.player.getComponent('Player').playSkill();
                }, this);
            }
            
            var randType = Math.floor(Math.random()*this.skillBlockResList.length);
            var data = this.skillBlockResList[randType];
            this.node.addChild(item);
            item.getComponent("SkillBlock").init({
                id: new Date().getTime(),
                iconSF: data.iconSF,
                type: data.id,
                color:data.color
            });
            item.x = this.skillBlockOriginX;
            item.y = this.skillBlockOriginY;

            if(arrayLength > 0) {
                var preComponent = this.skillBlockArray[arrayLength - 1].getComponent("SkillBlock");
                if(preComponent.type == randType) {
                    item.getComponent("SkillBlock").setId(preComponent.id);
                }
            }
        
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
            // 获取技能消失特效
            let skillDisappearItem = null;
            if(this.skillDisappearPool.size() > 0) {
                skillDisappearItem = this.skillDisappearPool.get();
            } else {
                skillDisappearItem = cc.instantiate(this.skillDisappearPrefab);
            }
            skillDisappearItem.x = this.skillBlockArray[i].x;
            skillDisappearItem.y = this.skillBlockArray[i].y;
            skillDisappearItem.color = this.skillBlockArray[i].getComponent("SkillBlock").color;
            this.node.addChild(skillDisappearItem);
            skillDisappearItem.getComponent("SkillDisappear").blink(function(){
                    this.skillDisappearPool.put(skillDisappearItem);
                }, this);

            this.skillBlockPool.put(this.skillBlockArray[i]);
        }

        for (i = right + 1; i < arrayLength; i++) {
            if(i < arrayLength-1) {
                this.skillBlockArray[i].runAction(cc.sequence(cc.delayTime(0.3),
                    cc.moveBy(this.fullMoveTime * (right - left + 1) / this.maxSkillNum, 
                    (this.skillBlockWidth + this.skillBlockMargin) * (right - left + 1),
                    0)));
            } else {
                var finished = cc.callFunc(function(target, gap) {
                    this.skillBlockArray.splice(gap[0], gap[1] - gap[0] + 1);
                }, this, [left, right]);
                this.skillBlockArray[i].runAction(cc.sequence(cc.delayTime(0.3), 
                    cc.moveBy(this.fullMoveTime * (right - left + 1) / this.maxSkillNum, 
                    (this.skillBlockWidth + this.skillBlockMargin) * (right - left + 1),
                    0), finished));
            }
        }
    }
});
