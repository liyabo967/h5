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
        floor: 0,
        normalAttack: 6,
        heavyAttack: 12,

    },

    // use this for initialization
    onLoad: function () {
        this.moveEnable = false;
        this.isPlaying = false;
        this.attackRange = 150;
        this.attackCalculate = 30;
        this.xSpeed = 100;
        this.playAnim('idle');
    },

    init: function (game,floor) {
        this.game = game;
        this.floor = floor;
        this.hp = 100;
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
        this.game.showString("-"+hurt,new cc.p(-70,460));
        this.hpComponent.minus(hurt);
        //cc.log('Enemy beAttacked-------------'+this.hp+', -'+hurt);
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
            this.attack = this.normalAttack;
            if(Math.random() < 0.25){
                animationName = 'attack_big';
                this.attackCalculate = 40;
                this.attack = this.heavyAttack;
            }
        }
        //cc.log('playAnim------------------ '+animationName);
        this.isPlaying = true;
        var dragonDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        dragonDisplay.armatureName = 'armatureName';
        dragonDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.aramtureEventHandler,this,);
        dragonDisplay.playAnimation(animationName); 
        this.animationName = animationName;
    },

    aramtureEventHandler: function(){
        if(this.animationName == 'die'){
            console.log('Enemy--------------------die');
            this.target = null;
            this.game.onEnemyKilled(this.node);
            this.animationName = 'idle';
            return;
        }

        if(this.target != null && this.target.hp > 0){
            this.animationName = 'attack';
            this.attack = 10;
        } else {
            this.animationName = 'idle';
        }
        this.isPlaying = false;
        if(this.isAlive()){
            this.playAnim(this.animationName);
        }
    },

    attackEnemy: function(){
        if(this.isAlive()){
            if(this.target != null && this.target.isAlive()){
                cc.log('target is alive');
                this.playAnim('attack');
                this.scheduleOnce(function() {
                    this.target.beAttacked(this.attack);
                    this.attackEnemy();
                }, 1);
            } else {
                cc.log('target is dead');
                this.target = null;
            }
        }
    },

    update: function (dt) {

    },

    onCollisionEnter: function (other, self) {
        if(this.target == null){
            var collisionComponent = null;
            if(other.getComponent('Player') != null){
                collisionComponent = other.getComponent('Player');
            } else if(other.getComponent('Fireball') != null){
                collisionComponent = other.getComponent('Fireball').master; 
            } else if(other.getComponent('Arrow') != null){
                collisionComponent = other.getComponent('Arrow').master; 
            }
            this.target = collisionComponent;
            this.attackEnemy();
        }
    },
    onCollisionStay: function (other, self) {
        //console.log('Enemy on collision stay');
    },
    onCollisionExit: function (other, self) {
        //console.log('Enemy on collision exit');
    },
});
