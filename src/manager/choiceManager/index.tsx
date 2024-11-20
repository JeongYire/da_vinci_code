import { DavinciCard } from "../../types";

class ChoiceSystemManager{

    isEmpty(target : DavinciCard | undefined){return target == undefined};
    isJoker(target : DavinciCard){return target.valueInfo.value == "joker"};

    left(targetIndex : number,targetArray : DavinciCard[]) : number{
        console.log("left 함수 사용");
        let target = targetArray[targetIndex-1];
        if(this.isEmpty(target)){
        /* 카드의 숫자는 0~11 이기때문에 -1로합니다.. -99로하든 -999로하든 상관없음 나중에 값체크할때 true가 나오는게 목적이라*/
        console.log(`결과  : -1`);
        return -1;
        };
        if(this.isJoker(target)) return this.left(targetIndex-1,targetArray);
        console.log(`결과  : ${target.valueInfo.value}`);
        return Number(target.valueInfo.value);
    }

    right(targetIndex : number,targetArray : DavinciCard[]) : number{
        console.log("right 함수 사용");
        let target = targetArray[targetIndex];
        if(this.isEmpty(target)){
        /* 카드의 숫자는 0~11 이기때문에 12로합니다.. 99로하든 999로하든 상관없음 나중에 값체크할때 true가 나오는게 목적이라*/
        console.log(`결과  : 12`);
        return 12;
        };
        if(this.isJoker(target)) return this.right(targetIndex+1,targetArray);
        console.log(`결과  : ${target.valueInfo.value}`);
        return Number(target.valueInfo.value);
    }

}

const ChoiceManager = new ChoiceSystemManager();

export {ChoiceManager};