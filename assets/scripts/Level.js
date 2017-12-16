var enemyPositions = [new cc.p(-180,-380),new cc.p(200,-690),new cc.p(-220,-1030)];
var enemies = new Array();
var enemyIndex = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        scorePrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        player: {
            default: null,
            type: cc.Node
        },
        playerHp: {
            default: null,
            type: cc.Node
        },

        enemy: {
            default: null,
            type: cc.Node
        },

        enemyHp: {
            default: null,
            type: cc.Node
        },

        skillFrame: {
            default: null,
            type: cc.Node
        },
        camera: {
            default: null,
            type: cc.Node
        },

        enemyPool: null,
        scorePool: null,
    },

    // use this for initialization
    onLoad: function () {
        cc._initDebugSetting(cc.DebugMode.INFO); 
        cc.log('Level-------------onLoad');

        this.floorPositions = [-380,-690,-1030];
        this. xBoundMin = -290;
        this. xBoundMax = 290;

        
        this.playerComponent = this.player.getComponent('Player');
        this.playerComponent.init(this);
        this.enemyComponent = this.enemy.getComponent('Enemy')
        this.enemyComponent.init(this);
        this.skillFrame.getComponent('SkillFrame').init(this);

        this.enemyPool = new cc.NodePool();
        this.scorePool = new cc.NodePool();
        let initCount = 3;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.enemyPrefab); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }

        this.createEnemy();
        this.createEnemy();
        this.createEnemy();
        enemyIndex = 0;

        let spriteNode = new cc.Node();
        spriteNode.addComponent(cc.Sprite);
        this.node.addChild(spriteNode);
        //spriteNode.getComponent(cc.Sprite).spriteFrame.setTexture(cc.url.raw('textures/fightScene/diamond.png'));
        
    },

    createEnemy: function () {
        if(enemyIndex < enemyPositions.length){
            console.log('createEnemy--------------- '+enemyIndex);
            let enemy = null;
            if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.enemyPrefab);
            }

            enemy.getComponent('Enemy').init(this,enemyIndex); //接下来就可以调用 enemy 身上的脚本进行初始化
            enemy.setPosition(enemyPositions[enemyIndex]);
            enemy.floor = enemyIndex;
            if(enemyIndex % 2 == 0){
                enemy.scaleX = 0.5;
            } else {
                enemy.scaleX = -0.5;
            }
            this.node.addChild(enemy);

            this.camera.getComponent(cc.Camera).addTarget(enemy);

            this.firstEnemy = enemy;
            enemies.push(enemy);
        }
        enemyIndex++;
    },

    isWin: function(){
        return enemyIndex >= enemyPositions.length;
    },

    getFirstEnemy(){
        if(enemyIndex < enemies.length){
            var ret = enemies[enemyIndex]
            return ret;
        }
        return null; 
    },

    onEnemyKilled: function (enemy) {
        // enemy 应该是一个 cc.Node
        this.enemyPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
        enemyIndex++;
        if(enemyIndex < enemies.length){
            this.enemyHp.getComponent('HpBar').init(100);
        }
    },

    showString: function(str,position){
        cc.log('showString --------- '+str);
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(position);
        fx.setString(str);
        fx.play();
    },

    spawnScoreFX: function () {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('TextAnim');
        } else {
            fx = cc.instantiate(this.scorePrefab).getComponent('TextAnim');
            fx.init(this);
            return fx;
        }
    },

    despawnScoreFX: function (scoreFX){
        this.scorePool.put(scoreFX);
    },

});
