/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*
  Holds functions needed to create defaults from imported CIS (something that has been scored and exported)
*/
export async function updateUserWorkFlow(db, cisID, uid) {
    const update = await db.query(
        'UPDATE ' + uid
        + ' ADD cis_list_in_progress = ' + cisID.toString(),
    );
    console.log('Updated List in Progress');
}

export async function createDefault(db, cisName, cisDescription, cisConfigurationID, uid, cisCriteria, changeTab, scoreTabKey, setCurrentCIS) {

    let category = null;
    let categoryOf = null;
    let belongsTo = null;
    let characteristic = null;
    let characteristicOf = null;
    let attribute = null;
    let attributeOf = null;
    let score = null;
    let scoreOf = null;
    let cisID = null;
    let categoryID = null;
    let characteristicID = null;
    let attributeID = null;
    let scoreID = null;
    let cis = null;

    //Create root vertex
    cis = await db.create('VERTEX', 'CIS')
    .set({
        name: cisName,
        description: cisDescription,
        owner: uid
    }).one();
    // console.log('Created CIS: ' + cis.name);
    //Create edge
    cisID = cis['@rid'];
    belongsTo = await db.create('EDGE', 'belongs_to')
    .from(cisID).to(cisConfigurationID).one();
    // console.log(belongsTo);

    //Create categories
    for (const catObj of cisCriteria.criteriaDefault) {
        category = await db.create('VERTEX', 'Category')
        .set({
            name: catObj.category,
            total_score: 0
        }).one();

        categoryID = category['@rid'];
        categoryOf = await db.create('EDGE', 'category_of')
        .from(categoryID).to(cisID).one();

        //Create characteristics
        for (const charObj of catObj.characteristics) {
            characteristic = await db.create('VERTEX', 'Characteristic')
            .set({
                name: charObj.characteristic,
                total_score: 0,
                weight: charObj.weight
            }).one();

            characteristicID = characteristic['@rid'];
            characteristicOf = await db.create('EDGE', 'characteristic_of')
            .from(characteristicID).to('#' + categoryOf.out.cluster + ':' + categoryOf.out.position).one();

            //Create attributes
            for (const attObj of charObj.attributes) {
                attribute = await db.create('VERTEX', 'Attribute')
                .set({
                    name: attObj.attribute,
                    score: 0,
                    user_weight: 1,
                    weighted_score: 0
                }).one();

                attributeID = attribute['@rid'];
                attributeOf = await db.create('EDGE', 'attribute_of')
                .from(attributeID).to('#' + characteristicOf.out.cluster + ':' + characteristicOf.out.position).one();

                //Create Score Guidances
                for (const scoreObj of attObj.scores) {
                    score = await db.create('VERTEX', 'Score')
                    .set({
                        description: scoreObj.description,
                        score: scoreObj.score,
                        chosen: false
                    }).one();

                    scoreID = score['@rid'];
                    scoreOf = await db.create('EDGE', 'score_guidance_of')
                    .from(scoreID).to('#' + attributeOf.out.cluster + ':' + attributeOf.out.position).one().then(
                }
            }
        }
    }

    await updateUserWorkFlow(db, cisID, uid);
    await updateJsonRep(db, cisID);
    await updateCurrentCIS(db, cisID, setCurrentCIS);

    //Go to Scoring View
    changeTab(scoreTabKey);
}

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

export async function updateCurrentCIS(db, cisID, setCurrentCIS) {
    const curCIS = await db.select().from(cisID.toString()).one();

    setCurrentCIS(curCIS);
}
