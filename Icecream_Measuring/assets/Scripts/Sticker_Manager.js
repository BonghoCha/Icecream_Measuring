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
        m_heads : [cc.SpriteFrame],
        m_necks : [cc.SpriteFrame],
        m_ears : [cc.SpriteFrame],
        m_bodys : [cc.SpriteFrame],
        m_windows : [cc.SpriteFrame],
        m_shoulder : [cc.SpriteFrame],
        m_hands : [cc.SpriteFrame],
        m_legs : [cc.SpriteFrame],
        m_foots : [cc.SpriteFrame],
        m_ceiling : [cc.SpriteFrame],
        m_wheel : [cc.SpriteFrame],
        m_pillar : [cc.SpriteFrame],
        m_link : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
