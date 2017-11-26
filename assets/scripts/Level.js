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
    },

    // use this for initialization
    onLoad: function () {
        cc._initDebugSetting(cc.DebugMode.INFO); 
        cc.log('Level-------------onLoad');
        this.playerComponent = this.player.getComponent('Player');
        this.playerComponent.init(this);
        this.enemyComponent = this.enemy.getComponent('Enemy')
        this.enemyComponent.init(this);
        this.skillFrame.getComponent('SkillFrame').init(this);
    },
});
