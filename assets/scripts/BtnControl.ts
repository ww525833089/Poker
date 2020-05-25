// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Rule from "./Rule";
import { MyGlobal } from "./help/MyGlobal";
import Utils from "./help/Utils";
import Card from "./Card";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BtnControl extends cc.Component {

    @property(cc.Node)
    playBtn:cc.Node = null;

    @property(cc.Node)
    passBtn:cc.Node = null;

    pick_arr:{}[] = [];//欲出牌组
    pick_node_arr:cc.Node[] = [];//欲出牌组节点
    last_play_cards:{}[] = [];//上家已出牌组

    ruleClass:Rule =  new Rule();
    notHold:number = 0;

    playCard(){
        //获取预出牌组
        // let play:Play = new Play();
        this.getPickArrd();
        this.sortArr();
        
        const rule = this.ruleClass.getCardsRule(this.pick_arr);
        
        //判断欲出牌组是否符合规则
        if(rule!=null){
            
            if(this.notHold>=2){//其他两家要不起，自己再重新出牌
                this.last_play_cards = [];
                this.notHold = 0;
            }
            //是否要的起上家的牌
            const isHold:boolean =  this.isHoldLastCards(rule);
            
            // console.log(this.last_play_cards);
            if(isHold){
                //从手牌里拿出对应的牌组
                this.surePaly();

                const win = this.ruleClass.isWin(MyGlobal.GameManager.player_layer_arr[MyGlobal.GameManager.curr_player]);
                if(win){
                    //显示获胜弹窗
                    console.log("win");
                    cc.director.loadScene("MainGame");
                }else{
                    this.last_play_cards = this.pick_arr;//记录已出牌组和下家对比
                    //下一位准备出牌
                    MyGlobal.GameManager.curr_player++;
                    Utils.putPoolNode(this.node,MyGlobal.GameManager.btnLayerPool)
                    MyGlobal.GameManager.showPlayButton();
                }
            }else{
                console.log("要不起，换牌组");
            }
        }
        this.pick_arr = [];//清空欲出牌组
        this.pick_node_arr = [];//清空欲出对象
    }

    pass(){
        if(this.last_play_cards.length==0||this.notHold>=2) {
            console.log("头家，必须出");
            return;
        }
        
        this.notHold++;
        MyGlobal.GameManager.curr_player++;
        Utils.putPoolNode(this.node,MyGlobal.GameManager.btnLayerPool)
        MyGlobal.GameManager.showPlayButton();
        this.pick_arr = [];//清空欲出牌组
        this.pick_node_arr = [];//清空欲出对象
    }

    //是否要的起上家的牌
    isHoldLastCards(curr_rule):boolean{
        // console.log("我的牌组：↓");
        // console.log(curr_rule);
        // console.log(this.last_play_cards);
        //判断欲出牌组是否要的起上家的牌组
        if(this.last_play_cards.length>0){
            const last_rule =  this.ruleClass.getCardsRule(this.last_play_cards);
            
            // console.log("上家牌组：↓");
            // console.log(last_rule);
            const type = curr_rule['type'];
            if(curr_rule['type']==last_rule['type'])
            {
                switch (type) {
                    case 'd'://单张
                            return curr_rule['card_code']%13>last_rule['card_code']%13;
                    case 'dz'://对子
                            return curr_rule['card_code']%13>last_rule['card_code']%13;
                    case 's'://三不带
                            return curr_rule['card_code']%13>last_rule['card_code']%13;
                    case 'sd'://三代一
                            return curr_rule['s_card_code']%13>=last_rule['s_card_code']%13&& curr_rule['d_card_code']%13>last_rule['d_card_code']%13;
                    case 'sz'://顺子,长度一样，起始大
                            return (curr_rule['l_card_code']%13-curr_rule['f_card_code']%13==last_rule['l_card_code']%13-last_rule['f_card_code']%13)&& curr_rule['f_card_code']%13>last_rule['f_card_code']%13;
                    case 'zd'://炸弹
                            if(curr_rule['card_code']>52){//双王，天炸最大
                                return true;
                            }
                            return curr_rule['card_code']%13>last_rule['card_code']%13;
                    default:
                        return false;
                }

            }else if(last_rule['zd']){
                return true;
            }
            else{
                return false;
            }

        }
        return true;
    }


    surePaly(){

        this.pick_node_arr.forEach(element => {
            element.removeFromParent();
        });
    }

    getPickArrd(){
        let curr_layer_card_arr:cc.Node[] =  MyGlobal.GameManager.player_layer_arr[MyGlobal.GameManager.curr_player].node.children;
        // console.log(curr_layer_card_arr);

        for (let index = 0; index < curr_layer_card_arr.length; index++) {
            const element:cc.Node = curr_layer_card_arr[index];
            const cardObj = element.getComponent(Card);
            if(cardObj.pick_status){
                this.pick_arr.push({'code':cardObj.code,'show_name':cardObj.show_name});
                this.pick_node_arr.push(element);
            }
        }
    }

    //冒泡排列欲出牌组
    sortArr(){
        let new_arr:{}[] = [];
        this.pick_arr.forEach(ele1 => {
            let index = 0;
            this.pick_arr.forEach(ele2 => {
            if(ele1['code']%13>ele2['code']%13||(ele1['code']%13==ele2['code']%13&&ele1['code']>ele2['code']))
                index++;
            });
            new_arr[index] = ele1;
        });
        this.pick_arr = new_arr;
    }

}
