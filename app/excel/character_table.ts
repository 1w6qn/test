export interface KeyFrame<TInput, TOutput> {
    level: number
    data: TInput
}
export type KeyFrames<TData> = KeyFrame<TData, TData>[]
export type Blackboard = BlackboardDataPair[];

export interface CharacterTable {
    [key: string]: CharacterData
}
export interface CharacterData {
    name: string;
    description: null | string;
    canUseGeneralPotentialItem: boolean;
    canUseActivityPotentialItem: boolean;
    potentialItemId: null | string;
    activityPotentialItemId: null | string;
    classicPotentialItemId: null | string;
    nationId: null | string;
    groupId: null | string;
    teamId: null | string;
    displayNumber: null | string;
    appellation: string;
    position: BuildableType;
    tagList: string[] | null;
    itemUsage: null | string;
    itemDesc: null | string;
    itemObtainApproach: string | null;
    isNotObtainable: boolean;
    isSpChar: boolean;
    maxPotentialLevel: number;
    rarity: RarityRank;
    profession: ProfessionCategory;
    subProfessionId: string;
    trait: TraitDataBundle | null;
    phases: PhaseData[];
    skills: MainSkill[];
    displayTokenDict: { [key: string]: boolean } | null;
    talents: TalentDataBundle[] | null;
    potentialRanks: PotentialRank[];
    favorKeyFrames: KeyFrames<AttributesData> | null;
    allSkillLvlup: SkillLevelCost[];
}

export interface SkillLevelCost {
    unlockCond: UnlockCondition;
    lvlUpCost: ItemBundle[] | null;
}

export interface ItemBundle {
    id: string;
    count: number;
    type?: string;
    instId?: number;
}
export enum ItemType {
    NONE = 0,
    CHAR = 1,
    CARD_EXP = 2,
    MATERIAL = 3,
    GOLD = 4,
    EXP_PLAYER = 5,
    TKT_TRY = 6,
    TKT_RECRUIT = 7,
    TKT_INST_FIN = 8,
    TKT_GACHA = 9,
    ACTIVITY_COIN = 10,
    DIAMOND = 11,
    DIAMOND_SHD = 12,
    HGG_SHD = 13,
    LGG_SHD = 14,
    FURN = 15,
    AP_GAMEPLAY = 16,
    AP_BASE = 17,
    SOCIAL_PT = 18,
    CHAR_SKIN = 19,
    TKT_GACHA_10 = 20,
    TKT_GACHA_PRSV = 21,
    AP_ITEM = 22,
    AP_SUPPLY = 23,
    RENAMING_CARD = 24,
    RENAMING_CARD_2 = 25,
    ET_STAGE = 26,
    ACTIVITY_ITEM = 27,
    VOUCHER_PICK = 28,
    VOUCHER_CGACHA = 29,
    VOUCHER_MGACHA = 30,
    CRS_SHOP_COIN = 31,
    CRS_RUNE_COIN = 32,
    LMTGS_COIN = 33,
    EPGS_COIN = 34,
    LIMITED_TKT_GACHA_10 = 35,
    LIMITED_FREE_GACHA = 36,
    REP_COIN = 37,
    ROGUELIKE = 38,
    LINKAGE_TKT_GACHA_10 = 39,
    VOUCHER_ELITE_II_4 = 40,
    VOUCHER_ELITE_II_5 = 41,
    VOUCHER_ELITE_II_6 = 42,
    VOUCHER_SKIN = 43,
    RETRO_COIN = 44,
    PLAYER_AVATAR = 45,
    UNI_COLLECTION = 46,
    VOUCHER_FULL_POTENTIAL = 47,
    RL_COIN = 48,
    RETURN_CREDIT = 49,
    MEDAL = 50,
    CHARM = 51,
    HOME_BACKGROUND = 52,
    EXTERMINATION_AGENT = 53,
    OPTIONAL_VOUCHER_PICK = 54,
    ACT_CART_COMPONENT = 55,
    VOUCHER_LEVELMAX_6 = 56,
    VOUCHER_LEVELMAX_5 = 57,
    VOUCHER_LEVELMAX_4 = 58,
    VOUCHER_SKILL_SPECIALLEVELMAX_6 = 59,
    VOUCHER_SKILL_SPECIALLEVELMAX_5 = 60,
    VOUCHER_SKILL_SPECIALLEVELMAX_4 = 61,
    ACTIVITY_POTENTIAL = 62,
    ITEM_PACK = 63,
    SANDBOX = 64,
    FAVOR_ADD_ITEM = 65,
    CLASSIC_SHD = 66,
    CLASSIC_TKT_GACHA = 67,
    CLASSIC_TKT_GACHA_10 = 68,
    LIMITED_BUFF = 69,
    CLASSIC_FES_PICK_TIER_5 = 70,
    CLASSIC_FES_PICK_TIER_6 = 71,
    RETURN_PROGRESS = 72,
    NEW_PROGRESS = 73,
    MCARD_VOUCHER = 74,
    MATERIAL_ISSUE_VOUCHER = 75,
    CRS_SHOP_COIN_V2 = 76,
    HOME_THEME = 77,
    SANDBOX_PERM = 78,
    SANDBOX_TOKEN = 79,
    TEMPLATE_TRAP = 80,
    NAME_CARD_SKIN = 81,
    EXCLUSIVE_TKT_GACHA = 82,
    EXCLUSIVE_TKT_GACHA_10 = 83,
}
export interface UnlockCondition {
    phase: string|number;
    level: number;
}


export interface AttributesData {
    maxHp: number;
    atk: number;
    def: number;
    magicResistance: number;
    cost: number;
    blockCnt: number;
    moveSpeed: number;
    attackSpeed: number;
    baseAttackTime: number;
    respawnTime: number;
    hpRecoveryPerSec: number;
    spRecoveryPerSec: number;
    maxDeployCount: number;
    maxDeckStackCnt: number;
    tauntLevel: number;
    massLevel: number;
    baseForceLevel: number;
    stunImmune: boolean;
    silenceImmune: boolean;
    sleepImmune: boolean;
    frozenImmune: boolean;
    levitateImmune: boolean;
    disarmedCombatImmune: boolean;
}


export interface PhaseData {
    characterPrefabKey: string;
    rangeId: null | string;
    maxLevel: number;
    attributesKeyFrames: KeyFrames<AttributesData>;
    evolveCost: ItemBundle[] | null;
}

export enum BuildableType {
    None = "NONE",
    Melee = "MELEE",
    Ranged = "RANGED",
    All = "ALL",
}

export interface PotentialRank {
    type: PotentialRankType;
    description: string;
    buff: ExternalBuff | null;
    equivalentCost: null;
}

export interface ExternalBuff {
    attributes: Attributes;
}

export interface Attributes {
    abnormalFlags: null;
    abnormalImmunes: null;
    abnormalAntis: null;
    abnormalCombos: null;
    abnormalComboImmunes: null;
    attributeModifiers: AttributeModifier[];

}

export interface AttributeModifier {
    attributeType: AttributeType;
    formulaItem: string;
    value: number;
    loadFromBlackboard: boolean;
    fetchBaseValueFromSourceEntity: boolean;
}

export enum AttributeType {
    Atk = "ATK",
    AttackSpeed = "ATTACK_SPEED",
    Cost = "COST",
    Def = "DEF",
    MagicResistance = "MAGIC_RESISTANCE",
    MaxHP = "MAX_HP",
    RespawnTime = "RESPAWN_TIME",
}

export enum PotentialRankType {
    Buff = "BUFF",
    Custom = "CUSTOM",
}

export enum ProfessionCategory {
    Caster = "CASTER",
    Medic = "MEDIC",
    Pioneer = "PIONEER",
    Sniper = "SNIPER",
    Special = "SPECIAL",
    Support = "SUPPORT",
    Tank = "TANK",
    Token = "TOKEN",
    Trap = "TRAP",
    Warrior = "WARRIOR",
}

export enum RarityRank {
    Tier1 = "TIER_1",
    Tier2 = "TIER_2",
    Tier3 = "TIER_3",
    Tier4 = "TIER_4",
    Tier5 = "TIER_5",
    Tier6 = "TIER_6",
}

export interface MainSkill {
    skillId: null | string;
    overridePrefabKey: null | string;
    overrideTokenKey: null | string;
    levelUpCostCond: SpecializeLevelData[];
    unlockCond: UnlockCondition;
}

export interface SpecializeLevelData {
    unlockCond: UnlockCondition;
    lvlUpTime: number;
    levelUpCost: ItemBundle[] | null;
}


export interface EquipTalentDataBundle extends TalentDataBundle {
    candidates: EquipTalentData[] | null;
}
export interface EquipTalentData extends TalentData {
    displayRangeId: boolean;
    talentIndex: number;
    upgradeDescription: string
}
export interface TalentDataBundle {
    candidates: TalentData[] | null;
}


export interface TalentData {
    unlockCondition: UnlockCondition;
    requiredPotentialRank: number;
    prefabKey: string;
    name: null | string;
    description: null | string;
    rangeId: null | string;
    blackboard: Blackboard;
    tokenKey?: null|string;
}

export interface BlackboardDataPair {
    key: string;
    value: number;
    valueStr?: null | string;
}

export interface TraitDataBundle {
    candidates: TraitData[];
}

export interface TraitData {
    unlockCondition: UnlockCondition;
    requiredPotentialRank: number;
    blackboard: Blackboard;
    overrideDescripton: null | string;
    prefabKey: null | string;
    rangeId: null | string;
}
export interface EquipTraitDataBundle {
    candidates: EquipTraitData[]|null;
}

export interface EquipTraitData extends TraitData {
    additionalDescription: string;
}