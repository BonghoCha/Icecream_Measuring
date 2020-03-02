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
        m_isCorrect : cc.Boolean,

        m_manager : "Main_Manager",

        m_closet : "Sticker_Manager",

        m_key : cc.String,
        m_type : cc.String,

        m_initial_pos : cc.p,

        m_target : cc.Sprite,
    },
    
    ClickSound(){
        cc.find("Canvas/Main_Manager").getComponent(cc.AudioSource).play();
    },

    onCollisionEnter(other, self) {
        if (this.m_type == "change"){
            //if (other.node.name == this.m_key){
                this.m_isCorrect = true;
                console.log("Canvas/play/"+this.m_manager.m_main_keyword+"/"+this.m_key);
                if (cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/"+this.m_key) != null){
                    this.m_target = cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/"+this.m_key).children[0].getComponent(cc.Sprite);
                }
            //}
        }
        else {
            //if (other.node.name == this.m_key){
                this.m_isCorrect = true;
                this.m_target = other.node.parent.getChildByName("decoration").getComponent(cc.Sprite);
            //}
        }
    },

    onCollisionExit(other, self) {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.node.name == "ruler"){
            this.node.on(cc.Node.EventType.TOUCH_START, function(event){
                this.ClickSound();

                if (!this.m_manager.m_isRestarted && !this.m_manager.m_onKeypadGuide){
                    this.m_manager.m_onRularDragGuide = true;

                    this.m_manager.m_guide_blind.getChildByName("onRularDragGuide").active = false;
                    this.m_manager.m_guide_blind.getChildByName("onKeypadGuide").active = true;

                    this.m_manager.m_drag_guide.stopAllActions();
                    this.m_manager.m_drag_guide.opacity = 0;
                    //this.m_manager.m_drag_guide.runAction(cc.fadeOut(0.25));

                    this.m_manager.m_guide.setPosition(80, 180);
                    this.m_manager.m_guide.opacity = 255;
                }
            }, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
                var delta = event.touch.getDelta();
                this.node.x += delta.x;
                this.node.y += delta.y;
            }, this);
            this.node.on(cc.Node.EventType.TOUCH_END, function(event){
               
            }, this);
        }
        else {
            this.node.on(cc.Node.EventType.TOUCH_START, function(event){
                this.ClickSound();
                
                if (!this.m_manager.m_isRestarted && !this.m_manager.m_isStickerGuide){
                    this.m_manager.m_isStickerGuide = true;

                    this.m_manager.m_drag_guide.stopAllActions();
                    this.m_manager.m_drag_guide.runAction(cc.fadeOut(0.5));
                }

                this.node.stopAllActions();
                this.node.runAction(cc.scaleTo(0.1, 0.95));
                this.node.getComponent(cc.BoxCollider).enabled = true;

                cc.find("Canvas/play_res/drag_bling").getComponent("Chaser_Particle").Play(this.node);
            }, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
                var delta = event.touch.getDelta();
                this.node.x += delta.x;
                this.node.y += delta.y;
            }, this);
            this.node.on(cc.Node.EventType.TOUCH_END, function(event){
                this.node.getComponent(cc.BoxCollider).enabled = false;

                if (this.m_isCorrect){
                    if (this.m_manager.m_main_keyword == "puppy"){
                        if (this.m_type == "change"){
                            switch (this.m_key){
                                case "head" : {
                                    this.m_target.spriteFrame = this.m_closet.m_heads[parseInt(this.node.name[this.node.name.length-1])];
                                    break;
                                }
                                case "body" : {
                                    this.m_target.spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])];
                                    break;
                                }
                            }
                        }
                        else{
                            var decoration = this.m_target.node.getChildByName(this.m_key);
                            for (var i = 0; i < decoration.children.length; i++){
                                decoration.children[i].active = false;
                            }
                            decoration.getChildByName(this.node.name).active = true;
                            switch (this.m_key){
                                case "neck" : {
                                    cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/"+this.m_key).children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_necks[parseInt(this.node.name[this.node.name.length-1])];

                                    this.m_target.node.parent.getChildByName(this.m_key).active = true;
                                    console.log(this.m_target.spriteFrame + " head " + this.m_closet.name);
                                    break;
                                }
                            }
                        }
                    }
                    else if (this.m_manager.m_main_keyword == "dinosaur"){
                        var decoration = this.m_target.node.getChildByName(this.m_key);
                        for (var i = 0; i < decoration.children.length; i++){
                            decoration.children[i].active = false;
                        }
                        decoration.getChildByName(this.node.name).active = true;
                    }
                    else if (this.m_manager.m_main_keyword == "train"){
                        if (this.m_type == "change"){
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/head").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/"+this.m_key+"_1").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+2];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/"+this.m_key+"_2").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+2];
                        }
                        else{
                            switch (this.m_key){
                                case "link" : {
                                    cc.find("Canvas/play/"+this.m_manager.m_main_keyword).children[0].children[0].active = true;
                                    break;
                                }
                                default : {
                                    var decoration = this.m_target.node.getChildByName(this.m_key);
                                    for (var i = 0; i < decoration.children.length; i++){
                                        decoration.children[i].active = false;
                                    }
                                    decoration.getChildByName(this.node.name).active = true;                                    
                                    break;
                                } 
                            }
                        }
                    }
                    else if (this.m_manager.m_main_keyword == "robot"){
                        if (this.m_type == "change"){
                            switch (this.m_key){
                                case "head" : {
                                    this.m_target.spriteFrame = this.m_closet.m_heads[parseInt(this.node.name[this.node.name.length-1])];
                                    break;
                                }
                                case "body" : {
                                    this.m_target.spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])];
                                    break;
                                }
                            }
                        }
                        else{
                            var decoration = this.m_target.node.getChildByName(this.m_key);
                            for (var i = 0; i < decoration.children.length; i++){
                                decoration.children[i].active = false;
                            }
                            decoration.getChildByName(this.node.name).active = true;
                        }
                    }
                    else if (this.m_manager.m_main_keyword == "alpaca"){
                        var decoration = this.m_target.node.getChildByName(this.m_key);
                        for (var i = 0; i < decoration.children.length; i++){
                            decoration.children[i].active = false;
                        }
                        decoration.getChildByName(this.node.name).active = true;
                        switch (this.m_key){
                            case "body" : {
                                var elements = cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/leg");
                                for (var i = 1; i < elements.children.length; i++){
                                    elements.children[i].active = false;
                                }
                                elements.getChildByName(this.node.name).active = true;
                                break;
                            }
                        }
                    }
                    else if (this.m_manager.m_main_keyword == "scarecrow"){
                        if (this.m_type == "change"){
                            this.m_target.spriteFrame = this.m_closet.m_heads[parseInt(this.node.name[this.node.name.length-1])];
                        }
                        else{
                            switch (this.m_key){
                                case "head" : {
                                    var decoration = this.m_target.node.getChildByName(this.m_key);
                                    for (var i = 0; i < decoration.children.length; i++){
                                        decoration.children[i].active = false;
                                    }
                                    decoration.getChildByName(this.node.name).active = true;
                                    break;
                                }
                                case "neck" : {
                                    if (this.node.name == "hat0"){
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/neck").getChildByName("hat1").active = false;
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/head").getChildByName("hat1").active = false;

                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/neck").getChildByName(this.node.name).active = true;
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/head").getChildByName(this.node.name).active = true;
                                    }
                                    else if (this.node.name == "hat1"){
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/neck").getChildByName("hat0").active = false;
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/head").getChildByName("hat0").active = false;

                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/neck").getChildByName(this.node.name).active = true;
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/head").getChildByName(this.node.name).active = true;
                                    }
                                    break;
                                }
                                case "body" : {
                                    if (this.node.name == "body0" || this.node.name == "body2"){
                                        var elements = cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/leg");
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body/body1").active = false;
                                    }
                                    else if (this.node.name == "body1" || this.node.name == "body3"){
                                        var elements = cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body");

                                        if (this.node.name == "body1"){
                                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/leg/body0").active = false;
                                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/leg/body2").active = false;
                                        }
                                    }
                                    for (var i = 1; i < elements.children.length; i++){
                                        elements.children[i].active = false;
                                    }
                                    elements.getChildByName(this.node.name).active = true;
                                    break;
                                }

                            }
                        }
                    }
                    else if (this.m_manager.m_main_keyword == "snowman"){
                        if (this.m_type == "change"){
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_1").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_2").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+2];
                        }
                        else{
                            var decoration = this.m_target.node.getChildByName(this.m_key);
                            for (var i = 0; i < decoration.children.length; i++){
                                decoration.children[i].active = false;
                            }
                            if (this.node.name == "hat1"){
                                cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/hat_1").getChildByName(this.node.name).active = true;
                                cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/hat_2").getChildByName(this.node.name).active = true;
                            }
                            else if (this.node.name == "hat0" || this.node.name == "hat2"){
                                cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/hat_1").getChildByName("hat1").active = false;
                                cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/hat_2").getChildByName("hat1").active = false;
                            }
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/hat_1").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_heads[0];
                            
                            decoration.getChildByName(this.node.name).active = true;
                        }
                    }
                    else if (this.m_manager.m_main_keyword == "car"){
                        if (this.m_type == "change"){
                            // Skin
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_0").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_1").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+3];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_2").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+6];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_3").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+9];
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/wheel").children[0].getComponent(cc.Sprite).spriteFrame = this.m_closet.m_bodys[parseInt(this.node.name[this.node.name.length-1])+12];

                            // Wheel Accessories
                            var decoration =  cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/decoration/" + this.m_key);
                            for (var i = 0; i < decoration.children.length; i++){
                                decoration.children[i].active = false;
                            }
                            decoration.getChildByName(this.node.name).active = true;

                            // Hat
                            var decoration =  cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/decoration/hat");
                            for (var i = 0; i < decoration.children.length; i++){
                                decoration.children[i].active = false;
                            }
                            decoration.getChildByName("hat" + this.node.name[this.node.name.length-1]).active = true;
                            if (this.node.name == "body0" || this.node.name == "body1"){
                            }

                            // Tail
                            var decoration =  cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_3");
                            for (var i = 1; i < decoration.children.length-1; i++){
                                decoration.children[i].active = false;
                            }
                            decoration.getChildByName("tail" + this.node.name[this.node.name.length-1]).active = true;

                            // Remove Items
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_1").getChildByName("head0").active = false;
                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_3").getChildByName("head0").active = false;

                            cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_1").getChildByName("head1").active = false;
                        }
                        else{
                            switch (this.m_key){
                                case "body" : {
                                    if (this.node.name == "body3"){
                                        // Wheel Accessories
                                        var decoration =  cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/decoration/" + this.m_key);
                                        for (var i = 0; i < decoration.children.length; i++){
                                            decoration.children[i].active = false;
                                        }
                                        decoration.getChildByName(this.node.name).active = true;
                                    }
                                    else{
                                        //Tail
                                        var decoration =  cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_3");
                                        for (var i = 1; i < decoration.children.length-1; i++){
                                            decoration.children[i].active = false;
                                        }
                                        decoration.getChildByName("tail" + this.node.name[this.node.name.length-1]).active = true;
                                    }
                                    break;
                                }
                                case "head" : {
                                    if (this.node.name == "head0"){
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_1").getChildByName(this.node.name).active = true;
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_3").getChildByName(this.node.name).active = true;
                                    }
                                    else if (this.node.name == "head1"){
                                        cc.find("Canvas/play/"+this.m_manager.m_main_keyword+"/body_1").getChildByName(this.node.name).active = true;
                                    }
                                    break;
                                }
                                default : {
                                    var decoration = this.m_target.node.getChildByName(this.m_key);
                                    for (var i = 0; i < decoration.children.length; i++){
                                        decoration.children[i].active = false;
                                    }
                                    decoration.getChildByName(this.node.name).active = true;
                                    break;
                                }
                            }
                            
                        }
                    }
                    
                    this.node.stopAllActions();
                    this.node.runAction(cc.spawn(cc.scaleTo(0.1, 1), cc.moveTo(0, this.m_initial_pos).easing(cc.easeOut(3))));
                }
                else {
                    this.node.stopAllActions();
                    this.node.runAction(cc.spawn(cc.scaleTo(0.1, 1), cc.moveTo(0.25, this.m_initial_pos).easing(cc.easeOut(3))));

                    this.m_isCorrect = false;
                }
                cc.find("Canvas/play_res/drag_bling").getComponent("Chaser_Particle").Stop();
            }, this);
        }
    },

    start () {
        this.m_initial_pos = this.node.getPosition();

        this.m_closet = this.node.parent.getComponent("Sticker_Manager");

        this.m_manager = cc.find("Canvas/Main_Manager").getComponent("Main_Manager");
    },

    // update (dt) {},
});
