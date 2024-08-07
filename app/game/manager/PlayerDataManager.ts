import { EventEmitter } from "events";
import { PlayerDataModel, TeamV2 } from '../model/playerdata';
import { InventoryManager } from "./inventory";
import { TroopManager } from "./troop";
import { DungeonManager } from "./DungeonManager";
import { HomeManager } from "./home";
import { StatusManager } from "./status";
import { CheckInManager } from "./CheckInManager";
import { StoryreviewManager } from "./StoryreviewManager";
import { MissionManager } from "./mission";
import ShopController from "../controller/ShopController";
import { RecruitManager } from "./recruit";
import { RoguelikeV2Controller } from "../controller/RoguelikeV2Controller";
import { BattleManager } from "./battle";
import { GachaController } from "../controller/GachaController";
import { accountManager, BattleInfo } from "./AccountManger";
import { SocialManager } from "./social";

export class PlayerDataManager {
    dungeon:DungeonManager
    inventory: InventoryManager
    troop: TroopManager
    status:StatusManager
    home:HomeManager
    checkIn:CheckInManager
    storyreview:StoryreviewManager
    mission!:MissionManager
    shop:ShopController
    recruit:RecruitManager
    rlv2:RoguelikeV2Controller
    gacha:GachaController
    social:SocialManager
    battle!:BattleManager
    _trigger: EventEmitter
    _playerdata: PlayerDataModel;
    get delta(){
        return {
            playerDataDelta:{
                modified:this.toJSON(),
                deleted:{},
            }
        }
    }
    get uid(){
        return this.status.uid
    }
    get loginTime(){
        return this._playerdata.pushFlags.status
    }
    getBattleInfo(battleId:string):BattleInfo{
        return accountManager.getBattleInfo(this.uid,battleId)!
    }
    constructor(playerdata:PlayerDataModel) {
        this._playerdata = playerdata;
        this._trigger = new EventEmitter();
        this._trigger.setMaxListeners(10000);
        
        this.status=new StatusManager(playerdata, this._trigger)
        this.inventory = new InventoryManager(this, this._trigger);
        this.troop=new TroopManager(playerdata, this._trigger)
        this.dungeon=new DungeonManager(playerdata.dungeon, this._trigger)
        this.home=new HomeManager(playerdata, this._trigger)
        this.checkIn=new CheckInManager(playerdata, this._trigger)
        this.storyreview=new StoryreviewManager(playerdata.storyreview, this._trigger)
        this.mission=new MissionManager(playerdata, this._trigger)
        this.shop=new ShopController(playerdata, this._trigger)
        this.battle=new BattleManager(this._playerdata, this._trigger)
        this.recruit=new RecruitManager(playerdata.recruit,this.troop, this._trigger)
        this.rlv2=new RoguelikeV2Controller(this, this._trigger)
        this.social=new SocialManager(playerdata, this._trigger)
        this.gacha=new GachaController(playerdata.gacha,this.status.uid,this.troop, this._trigger)
        this._trigger.emit("game:fix")
        this._trigger.emit("save:battle",(battleId:string, info:BattleInfo)=>{
            accountManager.saveBattleInfo(this.uid,battleId, info)
        })
    }
    get socialInfo(){
        return {
            nickName:this.status.status.nickName,
            nickNumber:this.status.status.nickNumber,
            uid:this.uid,
            registerTs:this.status.status.registerTs,
            mainStageProgress:this.status.status.mainStageProgress,
            charCnt:this.troop.curCharInstId-1,
            furnCnt:0,
            skinCnt:0,
            secretary:this.status.status.secretary,
            secretarySkinId:this.status.status.secretarySkinId,
            resume:this.status.status.resume,
            TeamV2:{},
            friendNumLimit:this.status.status.friendNumLimit,
            serverName:this.status.status.serverName,
            level:this.status.status.level,
            avatarId:this.status.status.avatarId,
            avatar:this.status.status.avatar,
            assistCharList:[],
            lastOnlineTime:this.status.status.lastOnlineTs,
            board:[],
            infoShare:-1,
            medalBoard:{},
            recentVisited:0,
            skin:this.status.nameCardStyle.skin
        }
    }
    toJSON() {
        return {
            ...this.status.toJSON(),
            ...this.inventory.toJSON(),
            troop:this.troop,
            dungeon:this.dungeon,
            activity:this._playerdata.activity,
            pushFlags:this._playerdata.pushFlags,
            equipment:{},
            ...this.shop.toJSON(),
            mission:this.mission,
            social:this.social,
            building:this._playerdata.building,
            dexNav:this._playerdata.dexNav,
            crisis:this._playerdata.crisis,
            crisisV2:this._playerdata.crisisV2,
            tshop:this._playerdata.tshop,
            gacha:this.gacha,
            backflow:this._playerdata.backflow,
            mainline:this._playerdata.mainline,
            rlv2:this.rlv2,
            deepSea:this._playerdata.deepSea,
            tower:this._playerdata.tower,
            siracusaMap:this._playerdata.siracusaMap,
            sandboxPerm:this._playerdata.sandboxPerm,
            storyreview:this.storyreview,
            medal:this._playerdata.medal,
            event:this._playerdata.event,
            retro:this._playerdata.retro,
            share:this._playerdata.share,
            roguelike:this._playerdata.roguelike,
            ticket:this._playerdata.ticket,
            aprilFool:this._playerdata.aprilFool,
            charm:this._playerdata.charm,
            carousel:this._playerdata.carousel,
            car:this._playerdata.car,
            recruit:this.recruit,
            templateTrap:this._playerdata.templateTrap,
            ...this.checkIn.toJSON(),
            campaignsV2:this._playerdata.campaignsV2,
            checkMeta:this._playerdata.checkMeta,
            limitedBuff:this._playerdata.limitedBuff,
            ...this.home.toJSON(),
            trainingGround:this._playerdata.trainingGround,
        }
    }
}