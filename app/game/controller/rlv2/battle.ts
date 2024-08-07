import { EventEmitter } from "events"
import { RoguelikeV2Controller } from '../rlv2';
import { BattleData } from "@game/model/battle";
import { decryptBattleData, decryptBattleLog } from "@utils/crypt";

export class RoguelikeBattleManager {

    _player: RoguelikeV2Controller
    _trigger: EventEmitter
    constructor(player: RoguelikeV2Controller, _trigger: EventEmitter) {
        
        this._player = player
        this._trigger = _trigger
        this._trigger.on('rlv2:battle:start', this.start.bind(this))
        this._trigger.on('rlv2:battle:finish', this.finish.bind(this))
    }
    start(stageId: string){
        let battleId="1"
        let sanity=0
        let diceRoll=[]
        if("SANCHECK" in this._player._module._modules){
            sanity=this._player._module.toJSON().san?.sanity||sanity
        }
        if("DICE" in this._player._module._modules){
            //TODO
        }
        this._trigger.emit('rlv2:event:create',"BATTLE",{
            state: 1,
            chestCnt: 2,
            goldTrapCnt: 1,
            diceRoll: [],
            boxInfo: {},
            tmpChar: [],
            sanity: sanity,
            unKeepBuff: this._player._buff._buffs
        })
        this._trigger.emit("save:battle",battleId,{stageId:stageId})
    }
    async finish(args:{battleLog:string,data:string,battleData:BattleData}){
        let battleId="1"
        const loginTime=this._player._player.loginTime
        const data=decryptBattleData(args.data,loginTime)
        //const battleLog=await decryptBattleLog(args.battleLog)
        console.log(JSON.stringify(data))
        //console.log(battleLog)
        let info=this._player._player.getBattleInfo(battleId)
        let event=this._player._status.pending.shift()
        //TODO: 处理战斗结果
        for (let buff of this._player._buff.filterBuffs("battle_extra_reward")) {
            this._trigger.emit("rlv2:get:items", [{id:buff.blackboard[0].valueStr!,count:buff.blackboard[1].value!}])
        }
        this._player._buff.filterBuffs("battle_extra_reward").forEach(b=>{
            if(b.blackboard[2].value){

            }
        })
        this._trigger.emit("rlv2:event:create","BATTLE_REWARD",{
            "earn": {
                "damage": 0,
                "hp": 0,
                "shield": 0,
                "exp": 13,
                "populationMax": 4,
                "squadCapacity": 0,
                "maxHpUp": 0
            },
            "rewards": [
                {
                    "index": 0,
                    "items": [
                        {
                            "sub": 0,
                            "id": "rogue_4_gold",
                            "count": 1
                        }
                    ],
                    "done": 0
                },
                {
                    "index": 1,
                    "items": [
                        {
                            "sub": 0,
                            "id": "rogue_4_fragment_F_13",
                            "count": 1
                        }
                    ],
                    "done": 0
                },
                {
                    "index": 2,
                    "items": [
                        {
                            "sub": 0,
                            "id": "rogue_4_fragment_D_06",
                            "count": 1
                        }
                    ],
                    "done": 0
                },
                {
                    "index": 3,
                    "items": [
                        {
                            "sub": 0,
                            "id": "rogue_4_recruit_ticket_support",
                            "count": 1
                        }
                    ],
                    "done": 0
                }
            ],
            "show": "2",
            "state": 0,
            "isPerfect": 1
        })
    }
}

