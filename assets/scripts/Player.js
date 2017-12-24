var Left = 1;
var Right = 2;
var Top = 3;
var Down = 4;

var Direction = Left;

cc.Class({
    extends: cc.Component,

    properties: {
        maxHp:100,
        hp: 100,
        hpComponent:null,
        attack:10,
        attackRange:150,
        xSpeed: 0,
        moveEnable: false,
        isPlaying: false,
        animationName: 'idle',
        game: null,   // 暂存 Game 对象的引用
        target: null,
        hurtBuff: 0,
        floor:0,
    },

    // use this for initialization
    onLoad: function () {
        this.attackRange = 150;
        this.xSpeed = 130;
        this.isPlaying = true;
        this.moveEnable = true;
        this.playAnim('walk');
    },

    init: function (game) {
        this.game = game;
        this.hpComponent = game.playerHp.getComponent('HpBar');
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
        this.game.showString("-"+hurt,new cc.p(-70,550));
        this.hpComponent.minus(hurt);
        cc.log('Player beAttacked-------------'+this.hp+', -'+hurt);
    },

    playSkill: function(){
        this.playAnim('fish');
    },

    playAnim: function(animationName){
        if(this.isPlaying && this.animationName == animationName){
            return;
        }
        if(animationName == 'attack'){
            this.attack = 15;
        } else if(animationName == 'fish'){
            this.attack = 50;
        }
        //cc.log('playAnim------------------ '+animationName);
        this.isPlaying = true;
        var dragonDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        dragonDisplay.armatureName = 'armatureName';
        dragonDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.aramtureEventHandler,this);
        dragonDisplay.playAnimation(animationName); 
        this.animationName = animationName;
    },

    aramtureEventHandler: function(){
        if(this.target != null && this.target.isAlive()){
            this.animationName = 'attack';
            this.attack = 10;
        }
        if(this.game.isWin()){
            this.animationName = 'win';
            this.moveEnable = false;
        }
        this.isPlaying = false;
        if(this.isAlive()){
            this.playAnim(this.animationName);
        }
    },

    attackEnemy: function(){
        if(this.target != null && this.target.isAlive()){
            this.scheduleOnce(function() {
                this.target.beAttacked(this.attack);
                this.attackEnemy();
            }, 1);
        } else {
            this.target = null;
        }
    },
    
    update: function (dt) {
        //根据当前速度更新主角的位置
        if(this.moveEnable){
            this.animationName = 'walk';
            if(Direction == Left){
                this.node.x -= this.xSpeed * dt;
                if(this.node.x < this.game.xBoundMin){
                    Direction = Down;
                }
            } else if(Direction == Right){
                this.node.x += this.xSpeed * dt;
                if(this.node.x > this.game.xBoundMax){
                    Direction = Down;
                }
            } else if(Direction == Down){
                this.node.y -= this.xSpeed * dt;
                if(this.node.y < this.game.floorPositions[this.floor+1]){
                    this.floor++;
                    cc.log('this.floor----------- '+this.floor);
                    if(this.floor % 2 == 0){
                        Direction = Left;
                        this.node.scaleX = -0.5;
                    } else {
                        Direction = Right;
                        this.node.scaleX = 0.5;
                    }
                }
            }
        } else {
            this.animationName = 'idle';
        }
    },

    onCollisionEnter: function (other, self) {
        console.log('Player on collision enter');
        this.moveEnable = false;
        if(this.target == null){
            console.log("-----------------this.playAnim('attack')");
            this.target = other.getComponent('Enemy');
            this.playAnim('attack');
            this.attackEnemy();
        }
    },
    onCollisionStay: function (other, self) {
        //console.log('Player on collision stay');
    },
    onCollisionExit: function (other, self) {
        console.log('Player on collision exit');
        this.moveEnable = true;
        this.playAnim('walk');
    },

});
