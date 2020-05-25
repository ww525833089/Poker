export default class CardRule{

    /**
     * 牌组规则：
     * 1、单张【例：单2规则码1,01，左起规则码1表示单张，01表示扑克编号】
     * 2、对子【例：对2规则码2,01，左起规则码2表示对子，01表示扑克编号】
     * 3、三张，三代一 【例：三个2带3规则码3,01,02，左起规则码3表示三代，01表示相同排扑克编号,02表示代牌编号】
     * 4、双飞 【例：三个2带4+三个3带个5规则码4,0102，0304，左起规则码4双飞，0102表示相同排扑克编号,0304表示代牌编号】
     * 5、顺子 【例：34567规则码5,0203040506，左起规则码5表示顺子，01表示扑克编号】
     * 6、连对
     * 7、炸弹，天炸
     **/

    getCardRule(pickArr:{}[]){
        let pick_num :number = pickArr.length;


    }


    isDz(card:{}){

    }
    
}


interface RuleStrategry{
    
}

class DzRuleStrategry implements RuleStrategry{
    
    constructor(pick_cards:{}[]){
        
    }
}


