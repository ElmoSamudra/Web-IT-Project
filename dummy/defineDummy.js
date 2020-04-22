var userDummy = require('../model/userDB.js');
var userQDummy = require('../model/userQDB.js');

const userID = '10001';

const myfunction = async function(){
    
    const user = await userDummy.findOne({id:userID});
    const userQ = await userQDummy.findOne({id:userID});

    // set the query object
    let userQueryObject = {};
    let questionQueryObject = {};

    // essential data needed for other user
    userQueryObject.id = {$ne:userID};
    userQueryObject.roommee = 'none';

    // essential data needed for other user questionaire answer
    questionQueryObject.id = {$ne:userID};
    questionQueryObject['filter1.numRoommeePref'] = userQ.filter1.numRoommeePref;
    questionQueryObject['filter1.ageDiffRange'] = user.age;
    
    // single value filter
    if(userQ.filter1.sameNationalityPref==='yes'){
        userQueryObject.nationality = user.nationality;
    }
    if(userQ.filter1.sameGenderPref==='yes'){
        userQueryObject.gender = user.gender;
    }
    if(userQ.filter1.petsPref==='yes'){
        questionQueryObject['filter1.petsPref']='yes';
    }

    // multiple value filter
    if(userQ.filter1.sameLocationPref==='yes'){
        console.log('yes');
        userQueryObject.preferStay = {$in:user.preferStay};
    }
    if(userQ.filter1.sameLangPref==='yes'){
        userQueryObject.language = {$in:user.language};
    }
    
    // query the other user data
    const userMatches = await userDummy.find(userQueryObject);
    const userQMatches = await userQDummy.find(questionQueryObject);

    const idOne = userMatches.map(value => value.id);
    const idTwo = userQMatches.map(value => value.id);
    const matchID = idOne.filter(value => idTwo.includes(value));

    return matchID;
}

const myfunction2 = async function(matchID){

    const queryID = {id: {$in: matchID}};
    const user = await userQDummy.findOne({id:userID});
    const filterOneMatches = await userQDummy.find(queryID);
    let filterTwo = []
    let comparison;
    
    filterOneMatches.forEach(match => {
        comparison = {};
        comparison.id = match.id;
        comparison.distance = euclidean(user.filter2, match.filter2);
        filterTwo.push(comparison);
    })

    //sort filter_2
    filterTwo.sort(function(a,b){
        return a.distance - b.distance;
    });
    
    console.log(filterTwo);
}

function euclidean(user1, user2){

    var distance = 0;
    for(var key of Object.keys(user1)){
        distance += Math.pow((user1[key]-user2[key]),2);
    }
    return Math.sqrt(distance)
}

const filterOne = myfunction();
filterOne.then(function(res){
    myfunction2(res);
})

// const user = await userQDummy.findOne({id:userID});
// console.log(user);
// const query_object = {};
// if (user.sameGenderPref) {
//     query_object['gender'] = user.gender;
// }
// const matches = await User.find(query_object);





//var dummy = require('faker');

// coreModule = {};

// coreModule.findUser = async function(userID){
//     return await userDummy.findOne({id:userID});
// }

// const findUser = async function (params) { 
//     let v;
//     try { 
//         v = await userDummy.find(params);
//         return v;
//     } catch(err) { console.log(err) }
// }
// const findID = async function(id){
//     var result1 = await findUser({'preferStay':'CBD'});
//     try{
//         return result1.find(user => user.id==id);
//     } catch(err){
//         console.log(err);
//     }
// }
// const result = findID('10020');
// result.then(function(res){
//     result = res;
// })

//var query = userDummy.find({ id: '10001'});
//var promise = query.exec();
//promise.addBack(function (err, docs) {});
//console.log(promise);

// var result = userDummy.find({}, function(err, users){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     }else{
//         console.log("ALL THE USERS......");
//         console.log(users);
//     }
// });

// var genders = [ 'Female' , 'Male' ];
// var nationality = ['Indonesian', 'Australian', 'Chinese', 'Japanese', 'Korean'];
// var hobby = ['Basketball', 'Table Tennis', 'Tennis', 'Music', 'Jogging'];
// var language = ['English', 'Indonesian', 'Mandarin'];
// var location = ['CBD', 'Carlton', 'Toorak', 'Clayton', 'Lygon'];

// for(i=1; i<20; i++){
//     if(i>=8){
//         if(i>9){
//             idRan = '100'+i;
//         }
//         else{
//             idRan = '1000'+i;
//         }
//     }else{
//         idRan = '1000'+i;
//     }
//     const genderRan = dummy.random.arrayElement(genders);
//     var newUser = new userDummy
//     ({
//         id: idRan,
//         firstName:dummy.name.firstName(genderRan),
//         lastName:dummy.name.lastName(genderRan),
//         age:dummy.random.number({'min': 18,'max': 22}),
//         gender:genderRan,
//         nationality:dummy.random.arrayElement(nationality),
//         hobby:dummy.random.arrayElement(hobby).split(','),
//         language:dummy.random.arrayElement(language).split(','),
//         preferStay:dummy.random.arrayElement(location).split(','),
//         roommee:"none"
//     });
//     console.log(newUser);
//     newUser.save(function (err, userDummy){
//         if(err){
//             console.error('err');
//         }else{
//             console.log(userDummy.id + " saved to User collection.");
//         }
//     });
// };

// const user = await User.findById(userId);
// const query_object = {};
// if (user.wantSameGender) {
//     query_object['gender'] = user.gender;
// }
// const matches = await User.find(query_object);



const clickMatch = async function(req, res){
    //"get-match/:userID/:matchID/:answer"
    // Ex: get-match/10001/10005/yes
    
    const userID = req.params.userID;
    const matchID = req.params.matchID;
    const answer = req.params.answer;

    const findData = await usersMatch.findOne({'id':userID});

    // found user
    if(findData){
        
        // check if the user wants to alter its match status
        checkDuplicateMatch(userID, matchID, answer, findData);
        
        if(answer==='yes'){

            const checkMatchStatus = await checkMatch(userID, matchID, findData);
            console.log(checkMatchStatus);

            // still pending
            if(checkMatchStatus!=='chat'){
                findData.yes.push(matchID);
                usersMatch.updateOne({'id':userID}, {'yes':findData.yes}, (err, data) => {
                    if(err){
                        res.status(400);
                        res.send('userMatch failed update');
                    }else{
                        console.log(data);
                        console.log("Update Success");
                    }
                })
            }
            // ready to chat
            
        }else{
            findData.no.push(matchID);
            usersMatch.updateOne({'id':userID}, {'no':findData.no}, (err, data) => {
                if(err){
                    res.status(400);
                    res.send('userMatch failed update');
                }else{
                    console.log(data);
                    console.log("Update Success");
                }
            })
        };
    }else{
        console.log('userMatch not yet created');
        res.send('user not found');
    }
}

const checkDuplicateMatch = async function(userID, matchID, answer, findData){

    if(answer==='yes'){
        if(findData.no.indexOf(matchID)!==-1){
            console.log('duplicate found');
            await findData.no.splice(findData.no.indexOf(matchID), 1);
        }
    }else{
        if(findData.yes.indexOf(matchID)!==-1){
            console.log('duplicate found');
            await findData.yes.splice(findData.no.indexOf(matchID), 1);
        }
    }
}   

const checkMatch = async function(userID, matchID, findData){
    
    const matchRes = await usersMatch.findOne({'id':matchID, 'yes':{$in:userID}});
    // Enable chat 
    if(matchRes){
        const matchData = await usersMatch.findOne({'id':matchID});
        await usersMatch.updateOne({'id':userID}, {'chat':matchData.chat.push(userID)});
        await usersMatch.updateOne({'id':userID}, {'yes':findData.yes.push(matchID), 'chat':findData.chat.push(matchID)});
        console.log('chatable');
    }
    return 'chat'
}