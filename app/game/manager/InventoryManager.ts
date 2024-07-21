import { ItemBundle } from "app/excel/character_table";
import excel from "../../excel/excel";
import EventEmitter from "events";

export class InventoryManager {
    items: { [itemId: string]: number }
    _trigger: EventEmitter
    constructor(items: { [itemId: string]: number }, _trigger: EventEmitter) {
        this.items = items
        this._trigger = _trigger
        this._trigger.on("useItems", this.useItems.bind(this))
        this._trigger.on("gainItems", this.gainItems.bind(this))
    }
    _useItem(item: ItemBundle): void {
        if (!item.type) {
            item.type = excel.ItemTable.items[item.id].itemType as string
        }
        switch (item.type) {
            case "CARD_EXP":
                this.items[item.id] -= item.count
                break;

            default:
                this._gainItem({id: item.id,count: -item.count})
                break;
        }
    }
    useItems(items: ItemBundle[]): void {
        for (const item of items) {
            this._useItem(item)
        }
    }
    _gainItem(item: ItemBundle): void {
        if (!item.type) {
            item.type = excel.ItemTable.items[item.id].itemType as string
        }
        switch (item.type) {
            case "CHAR":
                this._trigger.emit("gainChar", item.id)
                break;
            case "GOLD":
                this._trigger.emit("status:refresh")
            default:
                this.items[item.id] = (this.items[item.id] || 0) + item.count
                break;
        }
    }
    gainItems(items: ItemBundle[]): void {
        for (const item of items) {
            this._gainItem(item)
        }
    }
    toJSON(){
        return this.items
    }

}