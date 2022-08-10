import { NearContract, NearBindgen, near, call, view, LookupMap, assert } from "near-sdk-js"
import { currentAccountId } from "near-sdk-js/lib/api";
import { populateItemVector, TOTAL_PRIZES } from "./utils";
 
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

   @view
    verifyItemForUser({
        accountId,
        itemID
    }:{
        accountId: string,
        itemID: string
    }
    ){
        if(this.participants.containsKey(accountId)){
            let currentUserItemTracker = this.participants.get(accountId)

            assert(this.validItems.containsKey(itemID), "Not a valid itemID.")
            let targetItemIdx: number = +this.validItems.get(itemID)
            if(currentUserItemTracker[targetItemIdx] == 1) {
                return false
            }
        }

        return true
    }

    @view
    checkUserCurrentScore({
        accountId
    }:{
        accountId: string
    }
    ){
        let count: number = 0;
        if(this.participants.containsKey(accountId)){
            let currentUserItemTracker = this.participants.get(accountId)

            for(let i=0; i<TOTAL_PRIZES; i++){
                count += currentUserItemTracker[i] === 1? 1 : 0
            }
        }
        return count
    }

   @call
   logItemAndClaim({
       accountId,
       itemID
   }:{
       accountId: string,
       itemID: string
   }
   ){
       const predecessorAccountId = near.predecessorAccountId();
       assert(predecessorAccountId === near.currentAccountId(), "Only our account can approve scavenger hunt finds.");
 
       if(!this.participants.containsKey(accountId)){
           this.participants.set(accountId, defaultArray)
       }
      
       let currentUserItemTracker = this.participants.get(accountId)

       let currScoreForUser: number = this.checkUserCurrentScore({accountId: accountId}) 
       assert(currScoreForUser < TOTAL_PRIZES, "This user cannot reclaim their NFT prize.")
       
       assert(this.validItems.containsKey(itemID), "Not a valid itemID.")
       let rewardPrize: boolean = false
       if(currScoreForUser === (TOTAL_PRIZES-1)){
            near.log(`The user is claiming their final item. Reward NFT will be issued soon.`)
       }

       let targetItemIdx: number = +this.validItems.get(itemID)
       if (currentUserItemTracker[targetItemIdx] === 1){
           near.log(`ERROR. This item has already been found by this user.`)
           return false
       } else {
           currentUserItemTracker[targetItemIdx] = 1
           this.participants.set(accountId, currentUserItemTracker)
       }

       if(rewardPrize){
            near.log(`CROSS-CONTRACT CALL GOES HERE`)
       }
 
       return true
   }
 
}
