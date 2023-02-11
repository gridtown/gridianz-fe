import { api, api2 } from "../untils";

// 카드 리스트 받아오기
export const memberListUseQueryGetCardList = async (num) => {
    console.log("카드리스트get","pageNum:",num);
    const res = await api2.get(`/cards?page=${num}&size=1`);
    return res.data;
};
// 카드 상세정보 받아오기
export const memberListUseQueryGetCardInfo = async (index)=>{
    console.log("상세정보get")
    const res = await api2.get(`/cards/${index}`);
    return res.data;
}
// 수정된 카드 상세정보 보내기
export const memberListuseMutationPostCardInfo =  (editCardListUserInfo) => {
    console.log(editCardListUserInfo)
    const res =  api2.post("/cards/2", {
        statusMessage: editCardListUserInfo.statusMessage,
        field: editCardListUserInfo.field,
        skill: editCardListUserInfo.skillSet,
        introduction: editCardListUserInfo.introduction,
        snsSet: editCardListUserInfo.snsSet,
        tagSet: editCardListUserInfo.tagSet
    });
    return res.data;
};