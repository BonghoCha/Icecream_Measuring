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
        // Ruler
        m_ruler : cc.Node,
        
        // Answer Res
        m_answer : cc.Label,
        m_current_part_answer : cc.Integer,

        // Clear Res
        m_clear_check : [cc.Integer],
        m_clear_num : cc.Integer,
        m_current_clear_num : cc.Integer,

        // Keypad
        m_keypad_part : cc.Node,
        m_target_wood : cc.Node,

        // Question Part
        m_question_part : cc.Node,

        // Result Part
        m_result_part : cc.Node,

        // Keyword
        m_main_keyword : cc.String,
        m_part_keyword : cc.String,

        m_guide : cc.Node,
        m_drag_guide : cc.Node,
        m_guide_blind : cc.Node,

        m_isRestarted : cc.Boolean,
        m_onFirstGuide : cc.Boolean,
        m_onSecondGuide : cc.Boolean,
        m_onRularGuide : cc.Boolean,
        m_onRularDragGuide : cc.Boolean,
        m_onStickerGuide : cc.Boolean,

        m_onKeypadGuide : cc.Boolean,

        m_ClickIntroButton : cc.Boolean,

        m_result_start : cc.Boolean,

        m_blind : cc.Node,
    },

    ClickSound(){
        this.node.getComponent(cc.AudioSource).play();
    },

    // *Click
    Click(event, customEventData){
        this.ClickSound();

        this.m_main_keyword = customEventData;

        if (this.m_main_keyword != "robot"){
            this.m_isRestarted = true;
            this.m_guide.opacity = 0;
        }

        if (!this.m_isRestarted && !this.m_onSecondGuide){
            this.m_onFirstGuide = true;
            this.m_guide.setPosition(50, 20);

            this.m_guide.stopAllActions();
            this.m_guide.runAction(cc.fadeIn(0.5));
        }

        // BG Sound Pause
        cc.find("Canvas/bg").getComponent(cc.AudioSource).stop();

        var main = cc.find("Canvas/play").getChildByName(customEventData);
        main.active = true;
        main.parent.active = true;
        cc.find("Canvas/play_res/close").active = true;

        // Set Clear Num
        this.m_clear_num = 0;
        for (var i = 1; i < main.children.length-1; i++){
            this.m_clear_num ++;
        }

        switch (customEventData){
            case "puppy" : {
                this.m_clear_num -= 2;
                break;
            }
            case "dinosaur" : {
                this.m_clear_num -= 2;
                break;
            }
            case "train" : {
                this.m_clear_num -= 1;
                break;            
            }
            case "robot" : {
                this.m_clear_num -= 2;
                break;
            }
            case "alpaca" : {
                this.m_clear_num -= 2;
                break;
            }
            case "scarecrow" : {
                this.m_clear_num -= 1;
                break;
            }
            case "snowman" : {
                this.m_clear_num -= 1;
                break;
            }
            case "car" : {
                this.m_clear_num -= 1;
                break;
            }
        }

        // Set Clear Check
        this.m_clear_check.length = this.m_clear_num;
        for (var i = 1; i < this.m_clear_check.length-1; i++){
            this.m_clear_check[i] = 0;
        }
    },

    Replay(){
        this.ClickSound();

        this.m_blind.active = true;

        var keyword = this.m_main_keyword;
        cc.director.loadScene("Main_Scene", function(err, data){
            var PlayScene = cc.director.getScene();
            var Manager = PlayScene.getChildByName("Canvas").getChildByName("Main_Manager").getComponent("Main_Manager");

            Manager.m_isRestarted = true;
            Manager.Click(null, keyword);
            PlayScene.getChildByName("Canvas").getChildByName("bg").getComponent(cc.AudioSource).stop();
        });
        /*
        this.ReturnMain();

        this.Click(null, this.m_main_keyword);
        */
    },

    ReturnMain(){
        this.ClickSound();

        cc.find("Canvas/play_res/close").active = false;        

        // BG Sound Play
        cc.find("Canvas/bg").getComponent(cc.AudioSource).play();                    

        var reset = cc.find("Canvas/play/" + this.m_main_keyword);
        for (var i = 0; i < reset.children.length-1; i++){
            if (reset.name == "puppy"){
                if (reset.children[i].name == "ear_1" || reset.children[i].name == "ear_2") continue;
            }
            else if (reset.name == "dinosaur"){
                if (reset.children[i].name == "leg_1" || reset.children[i].name == "leg_2") continue;
            }
            else if (reset.name == "train"){
                if (reset.children[i].name == "pillar") continue;
            }
            else if (reset.name == "robot"){
                if (reset.children[i].name == "hand_1" || reset.children[i].name == "hand_2") continue;
            }
            else if (reset.name == "alpaca"){
                if (reset.children[i].name == "ear_1" || reset.children[i].name == "ear_2") continue;
            }
            else if (reset.name == "scarecrow"){
                if (reset.children[i].name == "leg") continue;
            }
            else if (reset.name == "snowman"){
                if (reset.children[i].name == "hat_1") continue;
            }
            else if (reset.name == "car"){
                if (reset.children[i].name == "wheel") continue;
            }


            if (reset.children[i].getComponent(cc.Sprite) != null) reset.children[i].getComponent(cc.Sprite).enabled = true;
            if (reset.children[i].getComponent(cc.Button) != null) reset.children[i].getComponent(cc.Button).enabled = true;
            
            if (reset.children[i].children[0] != null) {
                for (var j = 0; j < reset.children[i].children.length; j++){
                    reset.children[i].children[j].active = false;
                }
            }
        }

        cc.loader.loadRes("Prefabs/"+this.m_main_keyword, cc.Prefab, function(err, prefab){
            var new_obj = cc.instantiate(prefab);
            new_obj.active = false;
            for (var i = 0; i < reset.children.length; i++){
                reset.children[i].getComponent
            }
        })

        for (var i = 0; i < reset.children[reset.children.length-1].children.length; i++){
            for (var j = 0; j < reset.children[reset.children.length-1].children[i].children.length; j++){
                reset.children[reset.children.length-1].children[i].children[j].active = false;
            }
        }

        // Hide Another Parts
        for (var i = 0; i < this.m_question_part.getChildByName(this.m_main_keyword).children.length; i++){
            this.m_question_part.getChildByName(this.m_main_keyword).children[i].active = false;
        }        

        this.m_guide.opacity = 0;

        this.m_current_clear_num = 0;

        cc.find("Canvas/play/" + this.m_main_keyword).active = false;
        cc.find("Canvas/play").active = false;

        if (cc.find("Canvas/play_res/" + this.m_main_keyword + "_sticker") != null) cc.find("Canvas/play_res/" + this.m_main_keyword + "_sticker").destroy();
        if (this.m_result_part.getChildByName(this.m_main_keyword) != null) this.m_result_part.getChildByName(this.m_main_keyword).destroy();

        cc.find("Canvas/play_res/reset").active = false;
        cc.find("Canvas/btn_clear").active = false;
        this.m_result_part.active = false;

        if (this.m_ruler.active) this.m_ruler.active = false;
        if (this.m_keypad_part.active) this.m_keypad_part.active = false;        
    },

    Restart() {
        this.ClickSound();

        this.m_blind.active = true;
        this.m_blind.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(function(){
            cc.director.loadScene("Main_Scene", function(err, data){
                var PlayScene = cc.director.getScene();
                var Manager = PlayScene.getChildByName("Canvas").getChildByName("Main_Manager").getComponent("Main_Manager");

                Manager.m_isRestarted = true;
            });
        }, this)));
    },
    
    ClickKeypad(event, customEventData){
        this.ClickSound();

        if (customEventData == -1){
            var last = this.m_answer.string.length-1;
            if (last < 0) last = 0;
            this.m_answer.string = this.m_answer.string.substring(0, last);
        }
        else {
            if (this.m_answer.string.length == 2) return;
            this.m_answer.string += customEventData;
        }
    },

    ShowKeypad(){
        if (!this.m_keypad_part.active){
            this.ClickSound();

            if (!this.m_isRestarted && !this.m_onKeypadGuide){
                this.m_onKeypadGuide = true;

                this.m_guide_blind.getChildByName("onKeypadGuide").active = false;

                this.m_guide.stopAllActions();
                this.m_guide.runAction(cc.fadeOut(0.5));
            }

            this.m_answer.string = "";

            this.m_keypad_part.active = true;
        }
        else {
            this.m_answer.string = "?";

            this.m_keypad_part.active = false;
        }
    },

    ShowQuestion(event, customEventData){
        this.ClickSound();

        if (!this.m_isRestarted && !this.m_onRularGuide){
            this.m_onSecondGuide = true;

            this.m_guide_blind.getChildByName("onRularGuide").active = true;
            this.m_guide.setPosition(-340, 175);
        }

        if (!this.m_question_part.active){
            this.m_part_keyword = customEventData;
            switch(this.m_main_keyword){
                case "puppy" : {
                    if (this.m_part_keyword == "ear" || this.m_part_keyword == "foot"){
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].name;
                    }
                    else{
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].name;
                    }
                    break;
                }
                case "dinosaur" : {
                    if (this.m_part_keyword == "hand" || this.m_part_keyword == "leg"){
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].name;
                    }
                    else{
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].name;
                    }
                    break;
                }
                case "train" : {
                    if (this.m_part_keyword == "body" || this.m_part_keyword == "link"){
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].name;
                    }
                    else{
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].name;
                    }
                    break;            
                }
                case "robot" : {
                    if (this.m_part_keyword == "leg" || this.m_part_keyword == "hand"){
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].name;
                    }
                    else{
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].name;
                    }
                    break;
                }
                case "alpaca" : {
                    if (this.m_part_keyword == "ear"){
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].name;
                    }
                    else{
                        this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].name;
                    }
                    break;
                }
                default : {
                    this.m_current_part_answer = cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].name;
                    break;
                }
            }

            // Hide Another Parts
            for (var i = 0; i < this.m_question_part.getChildByName(this.m_main_keyword).children.length; i++){
                this.m_question_part.getChildByName(this.m_main_keyword).children[i].active = false;
            }
            // Show Target Part
            this.m_target_wood = this.m_question_part.getChildByName(this.m_main_keyword).getChildByName(this.m_part_keyword);
            if (this.m_main_keyword == "puppy" || this.m_main_keyword == "dinosaur" || this.m_main_keyword == "train" || this.m_main_keyword == "robot"){
                this.m_target_wood.setPosition(-this.m_target_wood.width/2, this.m_target_wood.y);
            }
            this.m_target_wood.active = true;

            this.m_question_part.active = true;

            // Debug
            //this.m_answer.string = this.m_current_part_answer[0];
        }
        else {
            this.m_question_part.active = false;
            this.m_answer.string = "?";
            
            // Hide Another Parts
            for (var i = 0; i < this.m_question_part.getChildByName(this.m_main_keyword).children.length; i++){
                this.m_question_part.getChildByName(this.m_main_keyword).children[i].active = false;
            }
                        
            if (this.m_ruler.active) this.m_ruler.active = false;
            if (this.m_keypad_part.active) this.m_keypad_part.active = false;
        }
    },

    CheckAnswer(){
        if (this.m_answer.string == "") return;
        
        this.m_blind.active = true;
        this.m_answer.string = parseInt(this.m_answer.string) + "";

        if (parseInt(this.m_answer.string) + "cm" == this.m_current_part_answer){

            console.log("정답");
            
            this.m_question_part.getChildByName("correct").active = true;
            this.m_question_part.getChildByName("correct").getComponent(cc.AudioSource).play();
            this.m_question_part.getChildByName("correct").runAction(cc.sequence(cc.fadeIn(0.25), cc.delayTime(1), cc.fadeOut(0.25), cc.callFunc(function(){
                this.m_question_part.getChildByName("correct").active = false;
                this.m_question_part.active = false;
                this.m_answer.string = "?";

                this.m_blind.active = false;

                this.SetCorrectPart();
            }, this)));

            if (this.m_ruler.active) this.m_ruler.active = false;
            if (this.m_keypad_part.active) this.m_keypad_part.active = false;
        }
        else{
            console.log("오답");

            this.m_question_part.getChildByName("wrong").active = true;
            this.m_question_part.getChildByName("wrong").getComponent(cc.AudioSource).play();
            this.m_question_part.getChildByName("wrong").runAction(cc.sequence(cc.fadeIn(0.25), cc.delayTime(1.25), cc.fadeOut(0.5), cc.callFunc(function(){
                this.m_question_part.getChildByName("wrong").active = false;
                //this.m_question_part.active = false;

                this.m_answer.string = "";

                this.m_blind.active = false;

            }, this)));
        }
    },

    SetCorrectPart(){
        var len = 0;
        switch(this.m_main_keyword){
            case "puppy" : {
                if (this.m_part_keyword == "ear" || this.m_part_keyword == "foot"){
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Sprite).enabled = false;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].active = true;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").children[0].active = true;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Button).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Button).enabled = false;
                    this.m_current_clear_num += 2;

                    len = 2;
                }
                else{
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 1;

                    len = 1;
                }
                break;
            }
            case "dinosaur" : {
                if (this.m_part_keyword == "hand" || this.m_part_keyword == "leg"){
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Sprite).enabled = false;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].active = true;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").children[0].active = true;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Button).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Button).enabled = false;

                    this.m_current_clear_num += 2;

                    len = 2;
                }
                else{
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 1;

                    len = 1;
                }
                break;
            }
            case "train" : {
                if (this.m_part_keyword == "body" || this.m_part_keyword == "link"){
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Sprite).enabled = false;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].active = true;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Button).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 2;

                    len = 2;
                }
                else{
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 1;

                    len = 1;
                }
                break;            
            }
            case "robot" : {
                if (this.m_part_keyword == "leg" || this.m_part_keyword == "hand"){
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Sprite).enabled = false;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].active = true;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Button).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 2;

                    len = 2;
                }
                else{
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Button).enabled = false;

                    this.m_current_clear_num += 1;

                    len = 1;
                }
                break;
            }
            case "alpaca" : {
                if (this.m_part_keyword == "ear"){
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Sprite).enabled = false;
    
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").children[0].active = true;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_1").getComponent(cc.Button).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword+"_2").getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 2;

                    len = 2;
                }
                else{
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Sprite).enabled = false;
                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].active = true;

                    cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Button).enabled = false;
    
                    this.m_current_clear_num += 1;

                    len = 1;
                }
                break;
            }
            default : {
                cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Sprite).enabled = false;
                cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).children[0].active = true;

                cc.find("Canvas/play/"+this.m_main_keyword+"/"+this.m_part_keyword).getComponent(cc.Button).enabled = false;

                this.m_current_clear_num += 1;

                len = 1;
                break;
            }
        }

        var self = this;
        if (len == 1){
            cc.loader.loadRes("Prefabs/click", cc.Prefab, function(err, prefab){
                var click = cc.instantiate(prefab);
                click.parent = cc.find("Canvas");
                click.setPosition(cc.find("Canvas/play/"+self.m_main_keyword+"/"+self.m_part_keyword).getPosition());
            });
        }
        else {
            cc.loader.loadRes("Prefabs/click", cc.Prefab, function(err, prefab){
                var click1 = cc.instantiate(prefab);
                var click2 = cc.instantiate(prefab);
                click1.parent = cc.find("Canvas");
                click2.parent = cc.find("Canvas");
                click1.setPosition(cc.find("Canvas/play/"+self.m_main_keyword+"/"+self.m_part_keyword+"_1").getPosition());
                click2.setPosition(cc.find("Canvas/play/"+self.m_main_keyword+"/"+self.m_part_keyword+"_2").getPosition());
            });
        }
        if (this.m_clear_num <= this.m_current_clear_num){
            cc.loader.loadRes("Prefabs/"+this.m_main_keyword+"_sticker", cc.Prefab, function(err, prefab){
                cc.find("Canvas/play_res/close").active = false;

                var prefab = cc.instantiate(prefab);
                prefab.parent = cc.find("Canvas/play_res");
                cc.find("Canvas/play_res/reset").active = true;
                cc.find("Canvas/btn_clear").active = true;

                if (!self.m_isRestarted && !self.m_isStickerGuide){
                    self.m_drag_guide.setPosition(-520, 245);
                    self.m_drag_guide.stopAllActions();
                    self.m_drag_guide.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.25), cc.moveTo(1.5, 0, 40).easing(cc.easeIn(1))), cc.spawn(cc.fadeOut(0.25), cc.delayTime(0.25)), cc.callFunc(function(){
                        self.m_drag_guide.setPosition(-520, 245);
                    }, self)).repeatForever());
                }
            });
        }
    },

    ShowResult(){
        this.ClickSound();

        this.m_result_start = true;

        this.m_result_part.getChildByName("result").active = false;

        if (!this.m_isRestarted && !this.m_isStickerGuide){
            this.m_isStickerGuide = true;

            this.m_drag_guide.stopAllActions();
            this.m_drag_guide.runAction(cc.fadeOut(0.5));
        }

        this.m_drag_guide.stopAllActions();
        this.m_drag_guide.opacity = 0;

        this.m_result_part.getChildByName("Firework").getChildByName("firework").getComponent(cc.AudioSource).play();
        this.m_result_part.getChildByName("Firework").getChildByName("clap").getComponent(cc.AudioSource).play();

        // Result Action
        this.m_result_part.getChildByName("bg_light").runAction(cc.rotateBy(10, 360)).repeatForever();
        this.m_result_part.getChildByName("bg_circle1").runAction(cc.sequence(cc.fadeIn(2).easing(cc.easeIn(2)), cc.fadeTo(1.5, 150).easing(cc.easeOut(2)))).repeatForever();
        this.m_result_part.getChildByName("bg_circle2").runAction(cc.sequence(cc.fadeIn(2).easing(cc.easeIn(2)), cc.fadeTo(1.5, 150).easing(cc.easeOut(2)))).repeatForever();

        // Instantiate Object
        var result = cc.instantiate(cc.find("Canvas/play/"+this.m_main_keyword));
        if (this.m_main_keyword == "car") result.setScale(0.65);
        else result.setScale(1);

        result.parent = this.m_result_part.getChildByName("toy");

        if (this.m_main_keyword == "puppy") result.setPosition(0, 80);
        if (this.m_main_keyword == "dinosaur") result.setPosition(0, 75);
        if (this.m_main_keyword == "train") result.setPosition(45, 165);
        if (this.m_main_keyword == "robot") result.setPosition(0, 80);
        if (this.m_main_keyword == "alpaca") result.setPosition(20, 100);
        if (this.m_main_keyword == "scarecrow") result.setPosition(-20, 65);
        if (this.m_main_keyword == "snowman") result.setPosition(-15, 70);
        if (this.m_main_keyword == "car") result.setPosition(0, 40);

        this.m_result_part.active = true;

        this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function(){
            this.m_result_part.getChildByName("result").active = true;
        }, this)));
    },

    // *Show Ruler
    ShowRuler(){
        this.ClickSound();

        if (!this.m_ruler.active){
            if (!this.m_isRestarted && !this.m_onRularGuide){
                this.m_onRularGuide = true;

                this.m_onRular = true;

                this.m_guide_blind.getChildByName("onRularGuide").active = false;
                this.m_guide_blind.getChildByName("onRularDragGuide").active = true;

                this.m_guide.opacity = 0;

                this.m_drag_guide.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.25), cc.moveTo(1, 165, -245).easing(cc.easeIn(1))), cc.spawn(cc.fadeOut(0.25), cc.delayTime(0.25)), cc.callFunc(function(){
                    this.m_drag_guide.setPosition(0, -245);
                }, this)).repeatForever());
            }
            this.m_ruler.setPosition(0, -225);
            this.m_ruler.active = true;
        }
        else{
            this.m_ruler.active = false;
        }
    },

    Reset(){
        this.ClickSound();
        
        var pre_obj = cc.find("Canvas/play/"+this.m_main_keyword);
        cc.loader.loadRes("Prefabs/"+this.m_main_keyword, cc.Prefab, function(err, prefab){
            var new_obj = cc.instantiate(prefab);
            new_obj.parent = cc.find("Canvas/play");
            new_obj.setPosition(pre_obj.getPosition());
            pre_obj.destroy();
        })
    },

    IntroAni(){
        if (this.m_ClickIntroButton) return;

        this.m_ClickIntroButton = true;

        if (!cc.find("Canvas/play").active) cc.find("Canvas/bg").getComponent(cc.AudioSource).play();

        cc.find("Canvas/start").runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(function(){
            cc.find("Canvas/start").active = false;
        }, this)));

        if (!this.m_isRestarted && !this.m_onFirstGuide){
            this.m_guide.setPosition(-170, -240);

            this.m_guide.stopAllActions();
            this.m_guide.runAction(cc.fadeIn(0.5));
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (this.m_isRestarted) {
            cc.find("Canvas/start").active = false;
            this.IntroAni();
        }
        // Collider
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    update (dt) {
        if (this.m_result_start){
            cc.find("Canvas/play").getComponent(cc.AudioSource).volume -= 0.001;
            console.log(cc.find("Canvas/play").getComponent(cc.AudioSource).volume);
            if (cc.find("Canvas/play").getComponent(cc.AudioSource).volume <= 0){
                cc.find("Canvas/play").getComponent(cc.AudioSource).volume = 0
                cc.find("Canvas/play").getComponent(cc.AudioSource).stop();
                this.m_result_start = false;
            }
        }

    },
});
