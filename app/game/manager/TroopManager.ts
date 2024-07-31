import EventEmitter from "events";
import { PlayerCharacter, PlayerSquad, PlayerSquadItem, PlayerTroop } from "../model/character";
import excel from "../../excel/excel";
import { ItemBundle } from "app/excel/character_table";
import { PlayerDataModel } from "../model/playerdata";
import { GachaResult } from "../model/gacha";
import { pick } from "lodash";

export class TroopManager {


    chars: {[key: string]: PlayerCharacter}
    squads: {[key: string]: PlayerSquad}
    _playerdata: PlayerDataModel;
    get curCharInstId(): number {
        return Object.keys(this.chars).length + 1;
    }
    get curSquadCount(): number {
        return Object.keys(this.squads).length;
    }
    _trigger: EventEmitter
    _troop: PlayerTroop
    constructor(
        playerdata: PlayerDataModel,
        trigger: EventEmitter
    ) {
        this._playerdata = playerdata;
        this._troop = playerdata.troop;
        this.chars = this._troop.chars;
        this.squads = this._troop.squads;
        this._trigger = trigger;
        this._trigger.on("gainChar", this.gainChar.bind(this))
    }

    getCharacterByCharId(charId: string): PlayerCharacter {
        return Object.values(this.chars).find(char => char.charId === charId) as PlayerCharacter;
    }
    getCharacterByInstId(instId: number): PlayerCharacter {
        return this.chars[instId] as PlayerCharacter;
    }
    gainChar(charId: string, args: {from:string}={from:"NORMAL"}): GachaResult {
        let isNew=Object.values(this.chars).some(char => char.charId === charId)?0:1
        let charInstId=0
        let items:ItemBundle[]=[]
        if (!isNew) {
            let potentId = excel.CharacterTable[charId].potentialItemId as string;
            items.push({ id: potentId, count: 1, type: "MATERIAL" })
            let t=this._playerdata.dexNav.character[charId].count>6
            switch (excel.CharacterTable[charId].rarity) {
                case "TIER_6":
                    items.push({ id: "4004", count: t? 15 : 10, type: "HGG_SHD" })
                    break;
                case "TIER_5":
                    items.push({ id: "4004", count: t? 8 : 5, type: "HGG_SHD" })
                    break;
                case "TIER_4":
                    items.push({ id: "4005", count: 30, type: "LGG_SHD" })
                    break;
                case "TIER_3":
                    items.push({ id: "4005", count: 5, type: "LGG_SHD" })
                    break;
                case "TIER_2":
                    items.push({ id: "4005", count: 1, type: "LGG_SHD" })
                    break;
                case "TIER_1":
                    items.push({ id: "4005", count: 1, type: "LGG_SHD" })
                    break;
                default:
                    break;
            }
            this._playerdata.dexNav.character[charId].count+=1
        } else {
            let charInstId=this.curCharInstId
            this.chars[this.curCharInstId]={
                "instId": charInstId,
                "charId": charId,
                "favorPoint": 0,
                "potentialRank": 0,
                "mainSkillLvl": 1,
                "skin": `${charId}#1`,
                "level": 1,
                "exp": 0,
                "evolvePhase": 0,
                "defaultSkillIndex": -1,
                "gainTime": new Date().getTime(),
                "skills": [],
                "currentEquip": null,
                "equip": {},
                "voiceLan": "CN_MANDARIN"
            } as PlayerCharacter
            this._playerdata.dexNav.character[charId]={charInstId:charInstId,count:1}
            items.push({ id: "4004", count: 1, type: "HGG_SHD" })
        }
        this._trigger.emit("gainItems", items)
        return {
            charInstId: charInstId,
            charId: charId,
            isNew: isNew,
            itemGet: items
        }
    }
    upgradeChar(instId: number, expMats: ItemBundle[]): void {
        let char = this.getCharacterByInstId(instId);
        const expMap = excel.GameDataConst.characterExpMap;
        const goldMap = excel.GameDataConst.characterUpgradeCostMap;
        const expItems = excel.ItemTable.expItems;
        let expTotal = 0, gold = 0;
        const charId = char.charId;
        const evolvePhase = char.evolvePhase;
        const rarity = parseInt(excel.CharacterTable[charId].rarity.slice(-1));
        const maxLevel = excel.GameDataConst.maxLevel[rarity - 1][evolvePhase];
        for (let i = 0; i < expMats.length; i++) {
            expTotal += expItems[expMats[i].id].gainExp * expMats[i].count;
        }
        char.exp += expTotal;
        while (true) {
            if (char.exp >= expMap[evolvePhase][char.level - 1]) {
                char.exp -= expMap[evolvePhase][char.level - 1];
                char.level += 1;
                gold += goldMap[evolvePhase][char.level - 1]
                if (char.level >= maxLevel) {
                    char.level = maxLevel;
                    char.exp = 0
                    break;
                }
            } else {
                break;
            }
        }
        //TODO
        this._trigger.emit("useItems", expMats.concat([{ id: "4001", count: gold } as ItemBundle]))
        this._trigger.emit("UpgradeChar", {})
    }
    evolveChar(instId: number, destEvolvePhase: number): void {
        let char = this.getCharacterByInstId(instId);
        const evolveCost = excel.CharacterTable[char.charId].phases[destEvolvePhase].evolveCost as ItemBundle[];
        const rarity = parseInt(excel.CharacterTable[char.charId].rarity.slice(-1));
        const goldCost = excel.GameDataConst.evolveGoldCost[rarity][destEvolvePhase];
        this._trigger.emit("useItems", evolveCost.concat([{ id: "4001", count: goldCost } as ItemBundle]))
        char.evolvePhase = destEvolvePhase;
        char.level = 1;
        char.exp = 0;
        //TODO
        if (destEvolvePhase == 2) {
            this.chars[instId].skinId = char.charId + "#2";
        }
        this._trigger.emit("CharEvolved", { instId: instId, destEvolvePhase: destEvolvePhase })
    }
    boostPotential(instId: number, itemId: string, targetRank: number): void {
        this._trigger.emit("useItems", [{ id: itemId, count: 1 }])
        this.chars[instId].potentialRank = targetRank;
        //TODO 触发事件
    }
    setDefaultSkill(instId: number, defaultSkillIndex: number): void {
        this.chars[instId].defaultSkillIndex = defaultSkillIndex;
    }
    changeCharSkin(instId: number, skinId: string): void {
        this.chars[instId].skinId = skinId;
    }
    setEquipment(instId: number, equipId: string): void {
        this.chars[instId].currentEquip = equipId;
    }
    changeCharTemplate(instId: number, templateId: string): void {
        this.chars[instId].currentTmpl = templateId;
    }
    batchSetCharVoiceLan(voiceLan: string): void {
        Object.values(this.chars).forEach(char => char.voiceLan = voiceLan);
    }
    upgradeSkill(instId: number, targetLevel: number): void {
        let char = this.getCharacterByInstId(instId);
        this._trigger.emit("useItems", excel.CharacterTable[char.charId].allSkillLvlup[targetLevel - 2].lvlUpCost as ItemBundle[])
        char.mainSkillLvl = targetLevel;
    }
    squadFormation(squadId: number, slots: PlayerSquadItem[]): void {
        this.squads[squadId].slots = slots;
    }
    changeSquadName(squadId: number, name: string): void {
        this.squads[squadId].name = name;
    }
    changeMarkStar(chrIdDict: { [key: string]: number }) {
        //TODO
    }
    changeSecretary(charInstId: number, skinId: string) {
        let charId = this.getCharacterByInstId(charInstId).charId;
        this._trigger.emit("status:change:secretary", charId, skinId)
    }
    decomposePotentialItem(charInstIdList: string[]): ItemBundle[] {
        let costs: ItemBundle[] = []
        let items: ItemBundle[] = charInstIdList.reduce((acc, charInstId) => {
            let char = this.getCharacterByInstId(parseInt(charInstId));
            let rarity = parseInt(excel.CharacterTable[char.charId].rarity.slice(-1))
            let potentialItemId = excel.CharacterTable[char.charId].potentialItemId as string
            let count = this._playerdata.inventory[potentialItemId]
            costs.push({ id: potentialItemId, count: count })
            let item = excel.GachaTable.potentialMaterialConverter.items[`${rarity - 1}`]
            acc.push({ id: item.id, count: item.count * count })
            return acc
        }, [] as ItemBundle[])
        this._trigger.emit("useItems", costs)
        this._trigger.emit("gainItems", items)
        return items
    }
    decomposeClassicPotentialItem(charInstIdList: string[]): ItemBundle[] {
        let costs: ItemBundle[] = []
        let items: ItemBundle[] = charInstIdList.reduce((acc, charInstId) => {
            let char = this.getCharacterByInstId(parseInt(charInstId));
            let rarity = parseInt(excel.CharacterTable[char.charId].rarity.slice(-1))
            let potentialItemId = excel.CharacterTable[char.charId].classicPotentialItemId as string
            let count = this._playerdata.inventory[potentialItemId]
            costs.push({ id: potentialItemId, count: count })
            let item = excel.GachaTable.classicPotentialMaterialConverter.items[`${rarity - 1}`]
            acc.push({ id: item.id, count: item.count * count })
            return acc
        }, [] as ItemBundle[])
        this._trigger.emit("useItems", costs)
        this._trigger.emit("gainItems", items)
        return items
    }
    toJSON(): PlayerTroop {
        return {
            curCharInstId: this.curCharInstId,
            curSquadCount: this.curSquadCount,
            chars: this.chars,
            squads: this.squads,
            addon: this._troop.addon,
            charMission: this._troop.charMission,
            charGroup: pick(this.chars,["favorPoint"]),
        };
    }

}