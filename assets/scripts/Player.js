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
        xSpeed: 200,
        moveEnable: false,
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
        floor:0,

    },

    // use this for initialization
    onLoad: function () {
        this.moveEnable = false;
        this.isPlaying = false;
        this.attackRange = 150;
        this.attackCalculate = 20;
        this.xSpeed = 120;
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
    
    update: function (dt) {
        //cc.log('update: '+dt+',times------------: '+this.i)
        if(this.target != null && this.target.isAlive()){
            this.attackCalculate--;
            //cc.log('this.attackCalculate------------------------ '+this.attackCalculate);
            if(this.attackCalculate == 0){
                cc.log('----------------------------------attack');
                this.target.beAttacked(this.attack);
                if(this.target.hp <= 0){
                    this.target = null;
                    if(this.game.isWin()){
                        this.moveEnable = false;
                        this.animationName = 'win';
                    }
                    console.log('====================== enemy died');
                }
            }
        }

        if(this.game.isWin()){
            this.animationName = 'win';
        } else {
            this.moveEnable = true;
        }

        //根据当前速度更新主角的位置
        var enemy = this.game.getFirstEnemy();
        if(enemy != null && enemy.getComponent('Enemy').isAlive()){
            cc.log('floor--------------- '+this.floor+', '+enemy.floor+', enemy.x: '+enemy.x);
            this.moveEnable = true;
            if(this.floor == enemy.floor){
                //cc.log('this same floor-------------------------------- '+this.floor);
                var enemyAttackable = false;
                if((Direction == Left) && (this.node.x - this.attackRange <= enemy.x)){
                    enemyAttackable = true;
                } else if((Direction == Right) && (this.node.x + this.attackRange >= enemy.x)){
                    enemyAttackable = true;
                }
                if(enemyAttackable){
                    //cc.log('enemyAttackable--------------- '+enemyAttackable);
                    this.moveEnable = false;
                    if(this.target == null){
                        console.log("-----------------this.playAnim('attack')");
                        this.target = this.game.getFirstEnemy().getComponent('Enemy');
                        this.target.target = this;
                        this.playAnim('attack');
                    }
                }
            }
        }

        if(this.moveEnable){
            // if(this.animationName != 'walk'){
            //     this.playAnim('walk');
            // }
            this.animationName = 'walk';
            if(Direction == Left){
                this.node.x -= this.xSpeed * dt;
                // if(this.floor < this.game.floorPositions.length){
                    
                // }
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
            //this.playAnim('idle');
            this.animationName = 'idle';
        }
    },

});
