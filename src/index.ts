import { NearContract, NearBindgen, near, call, view, LookupMap, assert } from "near-sdk-js"
import { populateItemVector } from "./utils";

const defaultArray = [0,0,0]

@NearBindgen
class ScavengerHunt extends NearContract {
    participants: LookupMap; // map string to vector
    validItems: LookupMap;
    
    constructor() {
        super()
        this.participants = new LookupMap('ScavengerHunt-Participants-And-Items-Map')

        this.validItems = new LookupMap('ScavengerHunt-ValidItem-Map')
        this.validItems = populateItemVector(this.validItems)
    }

    default() {
        return new ScavengerHunt()
    }

    @call
    logItemFoundForUser({
        accountId,
        itemID
    }:{
        accountId: string,
        itemID: string
    }
    ){
        const predecessorAccountId = near.predecessorAccountId();
        assert(predecessorAccountId === near.currentAccountId(), "Only our account can approve scavenger hunt finds.");

        let currentUserItemTracker: number[] = []
        if(!this.participants.containsKey(accountId)){
            this.participants.set(accountId, defaultArray)
        } 
        
        currentUserItemTracker = this.participants.get(accountId)

        assert(this.participants.containsKey(itemID), "Not a valid itemID.")
        let targetItemIdx = this.validItems.get(itemID)
        if (currentUserItemTracker[targetItemIdx] === 1){
            near.log(`ERROR. This item has already been found by this user.`)
            return false
        } else {
            currentUserItemTracker[targetItemIdx] = 1
            this.participants.set(accountId, currentUserItemTracker)
        }

        return true
    }

}
