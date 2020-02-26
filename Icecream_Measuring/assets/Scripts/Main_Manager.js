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

        m_onDragGuide : cc.Boolean,

        m_onKeypadGuide : cc.Boolean,

        m_blind : cc.Node,
    },

    ClickSound(){
        cc.find("Canvas/Main_Manager").getComponent(cc.AudioSource).play();
    },

    // *Click
    Click(event, customEventData){
        this.ClickSound();

        this.m_main_keyword = customEventData;

        console.log(this.m_main_keyword);
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

    ReturnMain(){
        cc.find("Canvas/play_res/close").active = false;

        // BG Sound Play
        cc.find("Canvas/bg").getComponent(cc.AudioSource).play();                    

        var reset = cc.find("Canvas/play/" + this.m_main_keyword);
        for (var i = 0; i < reset.children.length-1; i++){
            if (reset.children[i].getComponent(cc.Sprite) != null) reset.children[i].getComponent(cc.Sprite).enabled = true;
            if (reset.children[i].getComponent(cc.Button) != null) reset.children[i].getComponent(cc.Button).enabled = true;
            
            if (reset.children[i].children[0] != null) {
                for (var j = 0; j < reset.children[i].children.length; j++){
                    reset.children[i].children[j].active = false;
                }
            }
        }

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
            this.m_target_wood.active = true;

            this.m_question_part.active = true;

            // Debug
            this.m_answer.string = this.m_current_part_answer[0];
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
            this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function(){
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
            this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function(){
                this.m_question_part.getChildByName("wrong").active = false;
                //this.m_question_part.active = false;

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
        console.log(this.m_clear_num +"!!!!!!!!!!!!"+ this.m_current_clear_num);
        if (this.m_clear_num <= this.m_current_clear_num){
            cc.loader.loadRes("Prefabs/"+this.m_main_keyword+"_sticker", cc.Prefab, function(err, prefab){
                cc.find("Canvas/play_res/close").active = false;

                var prefab = cc.instantiate(prefab);
                console.log(prefab.name);
                prefab.parent = cc.find("Canvas/play_res");
                cc.find("Canvas/play_res/reset").active = true;
                cc.find("Canvas/btn_clear").active = true;
            });
        }
    },

    ShowResult(){
        this.ClickSound();

        this.m_result_part.getChildByName("Firework").getChildByName("firework").getComponent(cc.AudioSource).play();
        this.m_result_part.getChildByName("Firework").getChildByName("clap").getComponent(cc.AudioSource).play();

        // Result Action
        this.m_result_part.getChildByName("bg_light").runAction(cc.rotateBy(10, 360)).repeatForever();
        this.m_result_part.getChildByName("bg_circle1").runAction(cc.sequence(cc.fadeIn(2).easing(cc.easeIn(2)), cc.fadeTo(1.5, 150).easing(cc.easeOut(2)))).repeatForever();
        this.m_result_part.getChildByName("bg_circle2").runAction(cc.sequence(cc.fadeIn(2).easing(cc.easeIn(2)), cc.fadeTo(1.5, 150).easing(cc.easeOut(2)))).repeatForever();

        // Instantiate Object
        var result = cc.instantiate(cc.find("Canvas/play/"+this.m_main_keyword));
        result.setScale(0.8);
        result.parent = this.m_result_part;
        if (this.m_main_keyword == "train") result.setPosition(10, 125);
        this.m_result_part.active = true;
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
        cc.loader.loadRes("Prefabs/"+this.m_main_keyword    , cc.Prefab, function(err, prefab){
            var new_obj = cc.instantiate(prefab);
            new_obj.parent = cc.find("Canvas/play");
            new_obj.setPosition(pre_obj.getPosition());
            pre_obj.destroy();
        })
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // Collider
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        if (!this.m_isRestarted && !this.m_onFirstGuide){
            this.m_guide.setPosition(-170, -240);

            this.m_guide.stopAllActions();
            this.m_guide.runAction(cc.fadeIn(0.5));
        }

        /*
        for (var i = 0; i < 8; i++){
            let main = cc.find("Canvas/question").children[i + 6];
            console.log("<<<<<"+main.name);
            for (var j = 0; j < main.children.length; j++){
                if (main.children[j].name != "wheel"){
                    if (main.children[j].width > 30 && main.children[j].width < 45){
                        main.children[j].width = 40;
                    }
                    else if (main.children[j].width > 40) {
                        var initial = parseInt(main.children[j].width / 40);
                        console.log(initial + " = " + main.children[j].width + " / 40");
                        var temp = main.children[j].width % 40;
                        console.log(temp + " = " + main.children[j].width + " % 40");
                        if (temp >= 20) initial += 1;
                        main.children[j].width = initial * 40;
                        console.log(main.children[j].name + " = " + main.children[j].width);
                    }
                }
                
            }
        }
        */
    },

    //update (dt) {},
});
