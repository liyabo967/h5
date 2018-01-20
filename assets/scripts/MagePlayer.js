var Left = 1;
var Right = 2;
var Top = 3;
var Down = 4;

var Direction = Left;

cc.Class({
    extends: cc.Component,

    properties: {
        fireballPrefab: {
            default: null,
            type: cc.Prefab
        },
        firemeteorPrefab: {
            default: null,
            type: cc.Prefab
        },
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
        this.hp = 100;
        this.isPlaying = true;
        this.moveEnable = true;
        this.playAnim('walk');

        this.fireballPool = new cc.NodePool();
        this.firemeteorPool = new cc.NodePool();

        let initCount = 2;
        for (let i = 0; i < initCount; ++i) {
            let fireball = cc.instantiate(this.fireballPrefab);
            this.fireballPool.put(fireball);
        }

        for (let i = 0; i < initCount; ++i) {
            let firemeteor = cc.instantiate(this.firemeteorPrefab);
            this.firemeteorPool.put(firemeteor);
        }
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
            this.game.onPlayerKilled(this);
        }
        this.game.showString("-"+hurt,new cc.p(-70,550));
        this.hpComponent.minus(hurt);
        //cc.log('Player beAttacked-------------'+this.hp+', -'+hurt);
    },

    playSkill: function(){
        if(this.target != null && this.isAlive()){
            var firemeteor = this.spawnFiremeteor();
            if(firemeteor != null){
                cc.log('magePlayer play skill fire meteor');
                firemeteor.setPosition(this.target.node.x,this.target.node.y + 100);
                firemeteor.getComponent('Firemeteor').init(this,this.target);
                this.game.node.addChild(firemeteor);
                this.game.camera.getComponent(cc.Camera).addTarget(firemeteor);
                firemeteor.getComponent('Firemeteor').attack();
            }
        }
    },

    playAnim: function(animationName){
        if(this.isPlaying && this.animationName == animationName){
            return;
        }
        if(animationName == 'attack'){
            this.attack = 15;
        } else if(animationName == 'rage'){
            this.attack = 50;
        }
        //cc.log('playAnim------------------ '+animationName);
        this.isPlaying = true;
        var dragonDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        dragonDisplay.armatureName = 'armatureName';
        if(animationName == 'attack'){
            // dragonDisplay.timeScale = 0.5;
        }
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
        if(this.isAlive()){
            if(this.target != null && this.target.isAlive()){
                var fireball = this.spawnFireBall();
                if(fireball != null){
                    this.game.node.addChild(fireball);
                    this.game.camera.getComponent(cc.Camera).addTarget(fireball);
                    fireball.setPosition(this.node.x, this.node.y + 50);
                    fireball.getComponent('Fireball').init(this);
                    fireball.getComponent('Fireball').attack();
                }
                this.scheduleOnce(function() {
                    this.attackEnemy();
                }, 1.5);
            } else {
                cc.log('MagePlayer ---------------------- enemy null');
                this.target = null;
            }
        }
    },

    enemyKilled: function(){
        cc.log('magePlayer killed an enemy');
        this.target = null;
    },

    spawnFireBall: function(){
        let fireball = null;
        if (this.fireballPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            fireball = this.fireballPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            fireball = cc.instantiate(this.fireballPrefab);
        }
        //fireball = cc.instantiate(this.fireballPrefab);
        return fireball;
    },
    despawnFireBall: function(fireball){
        this.fireballPool.put(fireball);
    },

    spawnFiremeteor: function(){
        let firemeteor = null;
        if (this.firemeteorPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            firemeteor = this.firemeteorPool.get();
        } 
        else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            firemeteor = cc.instantiate(this.firemeteorPrefab);
        }
        return firemeteor;
    },
    despawnFiremeteor: function(firemeteor){
        this.firemeteorPool.put(firemeteor);
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
            console.log("MagePlayer ============================ get target: "+(other.getComponent('Enemy') != null));
            this.target = other.getComponent('Enemy');
            this.playAnim('attack');
            this.attackEnemy();
        }
    },
    onCollisionStay: function (other, self) {
        //console.log('Player on collision stay');
    },
    onCollisionExit: function (other, self) {
        this.moveEnable = true;
        this.playAnim('walk');
    },

});
