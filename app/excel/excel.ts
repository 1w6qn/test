
import { CharacterTable } from "./character_table";
import { BattleEquipTable } from "./battle_equip_table";
import { BuildingData } from "./building_data";
import { GameDataConsts } from "./gamedata_const";
import { ServerItemTable } from "./item_table";
import { StageTable } from './stage_table';
import { HandbookInfoTable } from './handbook_info_table';
import { CheckinTable } from "./checkin_table";
import { StoryReviewMetaTable } from "./story_review_meta_table";
import { GachaData } from "./gacha_table";
import { MissionTable } from './mission_table';
import { RoguelikeTopicTable } from './roguelike_topic_table';
import { UniEquipTable } from "./uniequip_table";
import { FavorTable } from "./favor_table";
import { StoryReviewTable } from "./story_review_table";
import { MedalData } from "./medal_table";
import { GachaDetailTable } from "./gacha_detail_table";
import { CharMetaTable } from "./char_meta_table";
import { SkinTable } from "./skin_table";
import { OpenServerSchedule } from "./open_server_table";

export class Excel {
    BattleEquipTable!: BattleEquipTable;
    BuildingData!: BuildingData;
    CharacterTable!: CharacterTable;
    GameDataConst!: GameDataConsts;
    ItemTable!: ServerItemTable;
    StageTable!: StageTable;
    HandbookInfoTable!: HandbookInfoTable;
    CheckinTable!: CheckinTable;
    StoryReviewMetaTable!: StoryReviewMetaTable;
    GachaTable!: GachaData;
    MissionTable!: MissionTable;
    RoguelikeTopicTable!: RoguelikeTopicTable;
    UniequipTable!:UniEquipTable
    StoryReviewTable!:StoryReviewTable
    FavorTable!:FavorTable
    MedalTable!:MedalData
    GachaDetailTable!:GachaDetailTable
    CharMetaTable!:CharMetaTable
    SkinTable!:SkinTable
    OpenServerTable!:OpenServerSchedule
    initPromise:Promise<void>;
    constructor() {
        this.initPromise=this.init()
    }
    async init():Promise<void> {
        this.MissionTable=await import("../../data/excel/mission_table.json");
        this.BattleEquipTable=(await import("../../data/excel/battle_equip_table.json")).default as BattleEquipTable;
        this.BuildingData=await import("../../data/excel/building_data.json") as BuildingData;
        this.CharacterTable=(await import("../../data/excel/character_table.json")).default as CharacterTable;
        this.GameDataConst=await import("../../data/excel/gamedata_const.json");
        this.ItemTable=await import("../../data/excel/item_table.json");
        this.StageTable=(await import("../../data/excel/stage_table.json")).default as StageTable;
        this.HandbookInfoTable=await import('../../data/excel/handbook_info_table.json');
        this.CheckinTable=await import("../../data/excel/checkin_table.json");
        this.StoryReviewMetaTable=await import("../../data/excel/story_review_meta_table.json");
        this.GachaTable=await import("../../data/excel/gacha_table.json") as GachaData;
        this.RoguelikeTopicTable=(await import('../../data/excel/roguelike_topic_table.json')).default as RoguelikeTopicTable;
        this.UniequipTable=await import('../../data/excel/uniequip_table.json');
        this.FavorTable=await import('../../data/excel/favor_table.json');
        this.StoryReviewTable=(await import('../../data/excel/story_review_table.json')).default;
        this.MedalTable=await import('../../data/excel/medal_table.json');
        this.CharMetaTable=await import('../../data/excel/char_meta_table.json');
        this.SkinTable=(await import('../../data/excel/skin_table.json')).default;
        this.OpenServerTable=(await import('../../data/excel/open_server_table.json')).default;
        
        this.GachaDetailTable=await import('../../data/gacha_detail_table.json');
    }
}
export default new Excel()
