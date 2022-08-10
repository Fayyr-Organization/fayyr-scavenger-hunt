import { LookupMap } from "near-sdk-js";

export const SCORE_THRESHOLD = 3;

export function populateItemVector(map: LookupMap){
    let allowList: string[] = ["test0","test1","test2"];

    for(let i=0; i<SCORE_THRESHOLD; i++){
        map.set(allowList[i], i)
    }

    return map
}


