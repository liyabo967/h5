cc.Class({
    extends: cc.Component,

    properties: {
        maxHp:100,
        hp: 100,
        hpComponent:null,
        attack:10,
        attackRange:150,
        xSpeed: 200,
        moveEnable: false,
        moveAtX: true,
        isPlaying: false,
        animationName: 'idle',
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
        target: null,
        attackCalculate: 30,
        hurtBuff: 0,
        i:0,

    },

    // use this for initialization
    onLoad: function () {
        this.moveEnable = false;
        this.isPlaying = false;
        this.attackRange = 150;
        this.attackCalculate = 30;
        this.xSpeed = 100;
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
            this.playAnim('die');
        }
        this.hpComponent.minus(hurt);
        cc.log('Enemy beAttacked-------------'+this.hp+', -'+hurt);
    },

    playSkill: function(){
        this.playAnim('fish');
    },

    playAnim: function(animationName){
        if(this.isPlaying && this.animationName == animationName){
            return;
        }
        if(animationName == 'attack'){
            // if(this.animationName != 'attack' && this.attackCalculate <= 0){
                
            // }
            this.attackCalculate = 30;
            this.attack = 10;
        } else if(animationName == 'fish'){
            // if(this.animationName != 'fish' && this.attackCalculate <= 0){
                
            // }
            this.attackCalculate = 40;
            this.attack = 20;
        }
        cc.log('playAnim------------------ '+animationName);
        this.isPlaying = true;
        var dragonDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        dragonDisplay.armatureName = 'armatureName';
        dragonDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.aramtureEventHandler,this,);
        dragonDisplay.playAnimation(animationName); 
        this.animationName = animationName;
    },

    aramtureEventHandler: function(){
        if(this.animationName == 'die'){
            this.node.active = false;
        }
        if(this.target != null && this.target.hp > 0){
            this.animationName = 'attack';
            this.attack = 10;
        } else {
            this.animationName = 'idle';
        }
        // if(this.target == null || !this.target.isAlive()){
        //     this.animationName = 'idle';
        // }
        this.isPlaying = false;
        if(this.isAlive()){
            this.playAnim(this.animationName);
        }
    },

    update: function (dt) {
        if(this.target != null && this.target.isAlive() && this.isAlive()){
            
            this.attackCalculate--;
            cc.log('Enemy------------------------ '+this.attackCalculate);
            if(this.attackCalculate == 0){
                cc.log('----------------------------------attack');
                this.target.beAttacked(this.attack);
                if(this.target.hp <= 0){
                    //this.animationName = 'idle';
                }
            }
            this.playAnim('attack');
        }
    },
});
