// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        m_target : cc.Node,
        m_isStart : cc.Boolean,
    },

    Play(target){
        this.m_target = target;
        this.node.setPosition(this.m_target.getPosition().x, this.m_target.getPosition().y + 269.4930115);

        this.m_isStart = true;
        this.node.getComponent(cc.ParticleSystem).emissionRate = 50;
    },

    Stop(){
        this.node.getComponent(cc.ParticleSystem).emissionRate = 0;
        this.m_isStart = false;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        if (this.m_isStart){
            this.node.setPosition(this.m_target.getPosition().x, this.m_target.getPosition().y + 269.4930115);
        }

    },
});
