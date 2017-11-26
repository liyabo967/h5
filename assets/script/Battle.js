cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        player: {
            default: null,
            type: cc.Node
        },
        button: {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    onLoad: function () {
        //cc.log("------------onLoad");
        //this.groundY = 615; //790,980,1155
        //this.spawnNewEnemy();
        //this.button.node.on('click', this.onClick, this);
    },

    callback: function (event) {
        //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
        var button = event.detail;
        //do whatever you want with button
        //另外，注意这种方式注册的事件，也无法传递 customEventData
     },

    spawnNewEnemy: function() {
        cc.log("----------spawnNewEnemy");
        var enemy = cc.instantiate(this.enemyPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(enemy);
        // 为星星设置一个随机位置
        enemy.setPosition(this.getNewEnemyPosition());
        enemy.getComponent('Enemy').game = this;

        this.timer = 0;
    },

    getNewEnemyPosition: function () {
        var randX = cc.random0To1() * 750;
        var randY = 615;
        var maxX = this.node.width/2;
        //randX = cc.randomMinus1To1() * maxX;
        //return cc.p(randX, randY);
        return cc.p(0, 0);
    },

    onClick: function(){
        cc.log("-----------------------onClick");
        this.player.setPosition(200,200);
        // var dragonDisplay = this.player;
        // dragonDisplay.armatureName = 'armatureName';  
        // dragonDisplay.playAnimation('walk');  
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
