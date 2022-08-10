import { LookupMap } from "near-sdk-js";

export const TOTAL_PRIZES = 3;

export function populateItemVector(map: LookupMap){
    let allowList: string[] = ["test0","test1","test2"];

    for(let i=0; i<TOTAL_PRIZES; i++){
        map.set(allowList[i], i)
    }

    return map
}


