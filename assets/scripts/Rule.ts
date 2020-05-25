// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 操作类，包括出牌，提示，托管等
 */
export default class Play{

    getCardsRule(cards:{}[]){
        let pick_num:number =cards.length;
        let rule:{} =null;
        switch (pick_num) {
            case 1:
                rule = this.ruleD(cards); 
                break;
            case 2:
                rule = this.ruleDz(cards); 
                break;
            case 3:
                rule = this.ruleS(cards);
                break;
            case 4:
                rule = this.ruleSi(cards);
                break;
            default:
                rule = this.rulew(cards);
                break;
        }
        return rule;
    }

    //1张规则（单张）
    ruleD(cards:{}[]):{}{
        const cardObj:{} =  cards[0];
        return {'type':'d','type_name':"单",'name':cardObj['show_name'],'card_code':cardObj['code']};
    }

    //2张规则(对子、王炸)
    ruleDz(cards:{}[]):{}{
        const cardObj1:{} =  cards[0];
        const cardObj2:{} =  cards[1];
        if(cardObj1['show_name'] == cardObj2['show_name']){
            return {'type':'dz','type_name':"对",'name':cardObj1['show_name'],'card_code':cardObj1['code']};
        }else if(cardObj1['code']>52&&cardObj2['code']>52){
            return {'type':'zd','type_name':"炸弹",'name':'王','card_code':cardObj1['code']};
        }
    }

    //三张规则(三不带)
    ruleS(cards:{}[]):{}{
        const cardObj1:{} =  cards[0];
        const cardObj2:{} =  cards[1];
        const cardObj3:{} =  cards[2];
        if(cardObj1['show_name'] == cardObj2['show_name'] && cardObj2['show_name'] == cardObj3['show_name']){
            return {'type':'s','type_name':"三不带",'name':cardObj1['show_name'],'card_code':cardObj1['code']};
        }
    }

    //四张规则（三代一，普通炸弹）
    ruleSi(cards:{}[]):{}{

        let lastCard :{}= cards[3];
        let sameCardCnt = 0;
        
        let sameCard:{} = null;
        let diffCard:{} = null;
        cards.forEach(element => {
            if(element["show_name"] == lastCard['show_name']){
                sameCardCnt++;
                sameCard = element;
            }else{
                diffCard = lastCard;
                if(sameCardCnt==2)
                    diffCard = element;
            }
            lastCard = element;
        });
        if(sameCardCnt==2){
            return {'type':'sd','type_name':"三带一",'name':sameCard['show_name']+','+diffCard['show_name'],'s_card_code':sameCard['code'],'d_card_code':diffCard['code']};
        }else if(sameCardCnt ==4){
            return {'type':'zd','type_name':"炸弹",'name':sameCard['show_name'],'card_code':sameCard['code']};
        }
    }
    
    //规则
    rulew(cards:{}[]):{}{
        let cnt = 0;
        let lastCard:{} = null;
        cards.forEach(element => {
            if(element['show_name']==2||element['code']>52){
                return;
            } 

            if(lastCard!=null&&element['code']%13 - lastCard['code']%13 ==1 ){
                cnt++;
            }
            
            lastCard = element;

        });  

        if(cnt == cards.length-1){
            return {'type':'sz','type_name':'顺子','name':cards[0]['show_name']+'-'+lastCard['show_name'],'f_card_code':cards[0]['code'],'l_card_code':lastCard['code']}
        }
    }


    isWin(playerLayer:cc.Layout):boolean{
        if(playerLayer.node.children.length == 0){
            return true;
        }
        return false;
    }

}
