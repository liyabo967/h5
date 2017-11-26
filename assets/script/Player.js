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
        attackCalculate: 2,
        hurtBuff: 0,
        i:0,

    },

    // use this for initialization
    onLoad: function () {
        this.moveEnable = false;
        this.isPlaying = false;
        this.attackRange = 150;
        this.attackCalculate = 20;
        this.xSpeed = 100;
        // 初始化键盘输入监听
        this.setInputControl();
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
        this.hpComponent.minus(hurt);
        cc.log('Player beAttacked-------------'+this.hp+', -'+hurt);
    },

    setInputControl: function () {
        var self = this;
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // set a flag when key pressed
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.moveEnable = true;
                        self.xSpeed = -50;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.moveEnable = true;
                        self.xSpeed = 50;
                        break;
                }
            },
            // unset a flag when key released
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.moveEnable = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.moveEnable = false;
                        break;
                }
            }
        }, self.node);
    },

    playSkill: function(){
        this.playAnim('fish');
    },

    playAnim: function(animationName){
        if(this.isPlaying && this.animationName == animationName){
            return;
        }
        if(animationName == 'attack'){
            this.attackCalculate = 30;
            this.attack = 15;
        } else if(animationName == 'fish'){
            // if(this.animationName != 'fish' && this.attackCalculate <= 0){
                
            // }
            this.attackCalculate = 40;
            this.attack = 50;
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
        if(this.target != null ){
            if(this.target.hp > 0){
                this.animationName = 'attack';
                this.attack = 10;
            } else {
                this.animationName = 'win';
            }
        }
    
        this.isPlaying = false;
        if(this.isAlive()){
            this.playAnim(this.animationName);
        }
    },

    // getEnemyPosition: function () {
    //     return this.game.enemy.x;
    // },


    // getPlayerDistance: function () {
    //     // 根据 player 节点位置判断距离
    //     var playerPos = this.game.player.getCenterPos();
    //     // 根据两点位置计算两点之间距离
    //     var dist = cc.pDistance(this.node.position, playerPos);
    //     return dist;
    // },


    update: function (dt) {
        //cc.log('update: '+dt+',times------------: '+this.i)
        this.i = this.i + 1;
        if(this.target != null && this.target.isAlive()){
            this.attackCalculate--;
            cc.log('this.attackCalculate------------------------ '+this.attackCalculate);
            if(this.attackCalculate == 0){
                cc.log('----------------------------------attack');
                this.target.beAttacked(this.attack);
                if(this.target.hp <= 0){
                    //this.animationName = 'idle';
                }
            }
        }

        //根据当前速度更新主角的位置
        if(this.node.x + this.attackRange >= this.game.enemy.x){
            this.moveEnable = false;
            if(this.target == null){
                this.target = this.game.enemy.getComponent('Enemy');
                this.target.target = this;
                this.playAnim('attack');
            }
        } else {
            this.moveEnable = true;
        }

        if(this.node.x + 100 > 350){
            this.moveAtX = false;
        }

        //cc.log('this.moveAtX: '+this.moveAtX);
        if(this.moveEnable){
            if(this.moveAtX){
                this.node.x += this.xSpeed * dt;
            } else {
                this.node.y -= this.xSpeed * dt;
            }
            //this.playAnim('walk');
            this.animationName = 'walk';
        } else {
            //this.playAnim('idle');
            this.animationName = 'idle';
        }
    },


});
