// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MyGlobal } from "./help/MyGlobal";
import Utils from "./help/Utils";
import Card from "./Card";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property
    //玩家牌组
    player_cards :{}[][] = [];

    @property(cc.Prefab)
    card_prefab:cc.Prefab = null;
    //扑克牌的对象池
    public cardPool:cc.NodePool = new cc.NodePool();

    //出牌按钮
    @property(cc.Prefab)
    btn_layer_prefab :cc.Prefab = null;
    //出牌按钮的对象池
    public btnLayerPool:cc.NodePool = new cc.NodePool();

    @property(cc.Node)
    cards_layer :cc.Node = null;

    @property(cc.Layout)
    player_l_layer:cc.Layout = null;
    @property(cc.Layout)
    player_b_layer:cc.Layout = null;
    @property(cc.Layout)
    player_r_layer:cc.Layout = null;

    player_layer_arr:cc.Layout[] = null;
    //当前出牌的玩家
    curr_player = 1;

    //游戏是否准备好
    game_ready :boolean =false;

    onLoad(){
        this.init();

        this.dealCards();
        //发完牌后，理牌
        this.sortCards();
        this.showDealAnim();
        this.showPlayButton();
    }

    init(){
        MyGlobal.GameManager = this;
        this.player_layer_arr = [this.player_l_layer, this.player_b_layer, this.player_r_layer];
    }



    showPlayButton(){
        if(this.curr_player>2) this.curr_player = 0;
        let btnLayer:cc.Node =  Utils.getPoolNode(this.btnLayerPool,this.btn_layer_prefab);
        // let play_Btn:cc.Node =  cc.instantiate(this.playBtn_prefab);
        let curr_player_layer :cc.Layout =this.player_layer_arr[this.curr_player];
        let x = curr_player_layer.node.position.x;
        let y = curr_player_layer.node.position.y;
        if(this.curr_player == 1){
            btnLayer.angle = 0;
            y+=100;
        }
        else if(this.curr_player == 2){
            btnLayer.angle = 90;
            x-=100;
        }else if(this.curr_player == 0){
            btnLayer.angle = -90;
            x+=100;
        }
        btnLayer.setPosition(new cc.Vec2(x,y));
        btnLayer.parent = this.node;
    }



    
    showDealAnim():void{
        let index = 0;
        let the_player_layer :cc.Layout = null;
        // let player_layer_arr:cc.Layout[] = [this.player_l_layer, this.player_b_layer, this.player_r_layer];

        // let func = function(){
        //     if(index >50){
        //         console.log("牌发完了,准备关闭定时器");
        //         this.unschedule(func)
        //     }else{
        //         curr_player_layer = player_layer_arr[index%3];
        //         this.dealOneCardAnim(this.player_cards[index%3][Math.floor(index/3)],curr_player_layer,index);
        //         index++;  
        //         console.log(this.player_cards[index%3][Math.floor(index/3)]);
        //     }
        // }
        // this.schedule(func,1);


        for (let index = 0; index < 51; index++) {
            the_player_layer = this.player_layer_arr[index%3];
            this.dealOneCardAnim(this.player_cards[index%3][Math.floor(index/3)],the_player_layer,index);
            // console.log(this.player_cards[index%3][Math.floor(index/3)]);
        }

    }

    //理牌
    sortCards(){
        let sort_player_cards_arr:{}[][] = [];
        const temp_player_cards = this.player_cards;
        for (let index = 0; index < temp_player_cards.length; index++) {
            let thePlayerCards :{}[] = temp_player_cards[index];
            let new_arr:{}[] = [];
            thePlayerCards.forEach(ele1 => {
                let new_sort = 0;
                thePlayerCards.forEach(ele2 => {
                    if(ele1['code']%13>ele2['code']%13||(ele1['code']%13==ele2['code']%13&&ele1['code']>ele2['code'])){
                        new_sort++;
                    }
                });
                
                new_arr[new_sort] = ele1;
            });
            sort_player_cards_arr[index] = new_arr;
        }
        this.player_cards = sort_player_cards_arr;
    }


    //发一张牌的动画
    dealOneCardAnim(TheCard:{},player_layer:cc.Layout,index:number):void{
        let p_index = index%3;
        let card:cc.Node = null;
        card = Utils.getPoolNode(this.cardPool,this.card_prefab)
        let yPos = this.node.convertToWorldSpaceAR(this.cards_layer.position);
        let sPos = this.player_b_layer.node.convertToWorldSpaceAR(yPos);
        card.parent = player_layer.node;
        card.getComponent(Card).init(TheCard["show_name"],TheCard["code"],player_layer);
    }

    //发牌
    dealCards():void{
        let jokerCards:{}[] = [];
        let specailjokerCards = ['J','Q','K','A','BJ','SJ']
        for (let index = 0; index < 52; index++) {
            let temp = index%13;
            jokerCards.push({'code':index, 'show_name':temp>8?specailjokerCards[temp-9]:temp+2});
        }
        jokerCards.push({'code':53, 'show_name':'BJ'});
        jokerCards.push({'code':54, 'show_name':'SJ'});

        let jokerCardsNum:number = jokerCards.length;

        //确定三张底牌
        let bottom_cards:{}[] = [];
        let bottom_cards_num:number = 3;
        
        let p:number = 0;
        let isSuc :boolean = false;
        
        let isExist:boolean = false;
        let theCard:{} = null;
        for (let index = 0; index < bottom_cards_num; ) {
            let r = Math.floor( Math.random()*jokerCardsNum);
            theCard = jokerCards[r];

            isExist = this.inArray(theCard,bottom_cards)

            if(!isExist){
                bottom_cards.push(jokerCards[r]);
                index++
            }
            
        }

        
        for (let index = 0; index < jokerCardsNum; index++) {
            theCard = jokerCards[index];

            isExist = this.inArray(theCard,bottom_cards)

            if(isExist){
                continue;
            }

            p = Math.floor( Math.random()*3);
            isSuc = false;
            while (isSuc==false) {
                if(this.player_cards[p]==undefined){
                    this.player_cards[p] = [];
                }

                if(this.player_cards[p].length<17){
                    this.player_cards[p].push(jokerCards[index]);
                    isSuc = true;
                }else{
                    p++;
                    p = p>2?0:p;
                    isSuc = false;
                }
            }
            
        }

        this.game_ready =true;
    }

    inArray(obj:{}, array:{}[]):boolean{
        let isExist:boolean =false;
        //此处可封装
        for (let index = 0; index < array.length; index++) {
                
            if(obj ==array[index]){
                isExist = true;
            }
        }

        return isExist;
    }
        
}
