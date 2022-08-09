import { NearContract, NearBindgen, near, call, view } from "near-sdk-js"

const SCORE_THRESHOLD = 10;

@NearBindgen
class ScavengerHunt extends NearContract {
    score: number;
    accountOwner: string;
    
    constructor(accountOwner: string) {
        super()
        this.accountOwner = accountOwner; //is there a way to assert this is valid
        this.score = 0;
    }

    @call
    increment() {
        let prevScore = this.score;
        this.score += 1;
        near.log(`Congrats! ${this.accountOwner} has located one item. Incrementing score from ${prevScore} to ${this.score}`)
        near.log(`One moment. Checking if ${this.accountOwner} is eligible for their rewards...`)
    }

    @call
    checkPrizeEligibility(){
        let eligibility = this.score > SCORE_THRESHOLD
        near.log(`Is ${this.accountOwner} eligible for a prize? ${eligibility}`)
        return eligibility
    }

    @view
    getScore(){
        return this.score
    }

    // METHOD HERE FOR PERFORMING CROSS CONTRACT CALL TO MINT AN NFT????
}
