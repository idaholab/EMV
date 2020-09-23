/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*
  Function to update the JsonRep object inside the dabase
*/
export async function updateJsonRep(db, cisID) {
    const curCIS = await db.select().from(cisID.toString()).one();

    const jsToJSON = {criteriaDefault: [], name: curCIS.name, description: curCIS.description};
    let catIndex = -1;
    let charIndex = -1;
    let attIndex = -1;
    let scoreIndex = -1;

    const queryCategories = await db.select('in(category_of)').from(cisID.toString()).one();
    for (const qCat of queryCategories.in) {
        const curCat = await db.select().from(qCat.toString()).one();
        const curCatID = curCat['@rid'];
        jsToJSON.criteriaDefault.push({category: curCat.name, total_score: curCat.total_score, characteristics: []});
        catIndex++;
        const queryCharacteristics = await db.select('in(characteristic_of)').from(curCatID.toString()).one();
        for (const qChar of queryCharacteristics.in) {
            const curChar = await db.select().from(qChar.toString()).one();
            const curCharID = curChar['@rid'];
            jsToJSON.criteriaDefault[catIndex].characteristics.push({characteristic: curChar.name, total_score: curChar.total_score, weight: curChar.weight, attributes: []});
            charIndex++;
            const queryAttributes = await db.select('in(attribute_of)').from(curCharID.toString()).one();
            for (const qAtt of queryAttributes.in) {
                const curAtt = await db.select().from(qAtt.toString()).one();
                const curAttID = curAtt['@rid'];
                jsToJSON.criteriaDefault[catIndex].characteristics[charIndex].attributes.push({attribute: curAtt.name, score: curAtt.score, user_weight: curAtt.user_weight, weighted_score: curAtt.weighted_score, scores: []});
                attIndex++;
                const queryScores = await db.select('in(score_guidance_of)').from(curAttID.toString()).one();
                for (const qScore of queryScores.in) {
                    const curScore = await db.select().from(qScore.toString()).one();
                    const curScoreID = curScore['@rid'];
                    jsToJSON.criteriaDefault[catIndex].characteristics[charIndex].attributes[attIndex].scores.push({description: curScore.description, score: curScore.score, chosen: curScore.chosen});
                    scoreIndex++;
                }
                scoreIndex = -1;
            }
            attIndex = -1;
        }
        charIndex = -1;
    }

    //Update jsonRep CIS property
    const update = await db.update(cisID.toString())
    .set({
        jsonRep: JSON.stringify(jsToJSON);
    }).one();

}
