// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MyGlobal } from "./help/MyGlobal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    @property(cc.Label)
    name_lbl: cc.Label = null;

    @property(cc.Node)
    bg:cc.Node = null;

    pick_status:boolean = false;

    code:number = 0;
    show_name:string = '';

    //颜色分别对应黑红梅方
    colorArr:cc.Color[] =[cc.color(255,255,255,255),cc.color(200,200,200,255),cc.color(150,150,150,255),cc.color(100,100,100,255)];

    init(name:string,code:number,player_layer:cc.Layout){
        let parent_node_name = player_layer.node.name;
        if(parent_node_name=='player_l_layer') {this.node.angle=90;this.node.height = this.node.width}
        if(parent_node_name=='player_r_layer') {this.node.angle=-90;this.node.height = this.node.width}
        this.name_lbl.string = name;
        if(code<52){
            this.bg.color = this.colorArr[Math.floor(code/13)];
        }else{
            //大小王
            this.bg.color = cc.color(0,255,0,255);
        }
        
        this.code = code;
        this.show_name = name;
        this.node.parent = player_layer.node;
        this.node.on(cc.Node.EventType.MOUSE_DOWN,this.pickCard,this)
    }

    pickCard(event:EventSource){
        if(!MyGlobal.GameManager.game_ready)  return;
        // console.log(this.node);
        let parent_node_name = this.node.parent.name;
        
        //只能选择当前玩家的牌组
        if(MyGlobal.GameManager.player_layer_arr[MyGlobal.GameManager.curr_player].node.name != parent_node_name) return;
        this.pick_status = !this.pick_status;
        
        if(this.pick_status){
            if(parent_node_name=='player_b_layer'){
                this.node.y +=10;
            }else if(parent_node_name=='player_l_layer'){
                this.node.x +=10;
            }else if(parent_node_name=='player_r_layer'){
                this.node.x -=10;
            }
        }else{
            if(parent_node_name=='player_b_layer'){
                this.node.y -=10;
            }else if(parent_node_name=='player_l_layer'){
                this.node.x -=10;
            }else if(parent_node_name=='player_r_layer'){
                this.node.x +=10;
            }
        }
    }

}
