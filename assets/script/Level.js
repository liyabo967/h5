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

        skillButton1: {
            default: null,
            type: cc.Button
        },

        skillButton2: {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    onLoad: function () {
        cc._initDebugSetting(cc.DebugMode.INFO); 
        cc.log('Level-------------onLoad');

        // this.player.on(cc.Node.EventType.MOUSE_ENTER,function(event){
        //     cc.log('-------------onClick');
        // });
        this.playerComponent = this.player.getComponent('Player');
        this.playerComponent.init(this);
        this.enemyComponent = this.enemy.getComponent('Enemy')
        this.enemyComponent.init(this);
        this.skillButton1.node.on('click', this.playSkill1, this);
        this.skillButton2.node.on('click', this.playSkill2, this);

        this.skillFrame.getComponent('SkillFrame').init(this);
    },

    playSkill1: function (event) {
        cc.log('onClick-------------');
        this.playerComponent.playSkill();
        //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
        // var button = event.detail;

        // var dragonDisplay = this.player.getComponent(dragonBones.ArmatureDisplay);
        // dragonDisplay.armatureName = 'armatureName';
        // dragonDisplay.playAnimation('fish'); 
        
        //do whatever you want with button
        //另外，注意这种方式注册的事件，也无法传递 customEventData
     },

     playSkill2: function (event) {
        var dragonDisplay = this.enemy.getComponent(dragonBones.ArmatureDisplay);
        dragonDisplay.armatureName = 'armatureName';
        dragonDisplay.playAnimation('attack_big');
     }
});
