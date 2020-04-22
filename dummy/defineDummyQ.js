var userQDummy = require('../model/userQDB.js');
var dummy = require('faker');

// sort the result from big to small
// userQDummy.find({}).sort({'id':-1}).exec(function(err, usersQ)
// const query = userQDummy.findOne({}).sort({'id':-1}).exec(function(err, usersQ){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     }else{
//         console.log("ALL THE USERS......");
//         //console.log(usersQ);
//         return usersQ;
//     }
// });
// console.log(query);

var ans = [ 'yes' , 'no' ];

for(i=1; i<=20; i++){

    if(i>=10){
        idRan = '100'+i;
        var newUserQ = new userQDummy
        ({
            id: idRan,
            filter1:{
                sameNationalityPref: 'yes',
                sameGenderPref: 'yes',
                sameLocationPref: 'yes',
                petsPref: 'yes',
                sameLangPref: 'yes',
                numRoommeePref: '2',
                ageDiffRange: [18, 19, 20, 21, 22]
            },
            filter2:{
                homeCookRate: dummy.random.number({'min': 1,'max': 10}),
                nightOwlRate: dummy.random.number({'min': 1,'max': 10}),
                playsMusicRate: dummy.random.number({'min': 1,'max': 10}),
                seekIntrovertRate: dummy.random.number({'min': 1,'max': 10}),
                seekExtrovertRate: dummy.random.number({'min': 1,'max': 10}),
                cleanlinessToleranceRate: dummy.random.number({'min': 1,'max': 10})
            }
        });
    }else{
        idRan = '1000'+i;
        var newUserQ = new userQDummy
        ({
            id: idRan,
            filter1 : {
                sameNationalityPref: dummy.random.arrayElement(ans),
                sameGenderPref: dummy.random.arrayElement(ans),
                sameLocationPref: dummy.random.arrayElement(ans),
                petsPref: dummy.random.arrayElement(ans),
                sameLangPref: dummy.random.arrayElement(ans),
                numRoommeePref: dummy.random.arrayElement(ans),
                ageDiffRange: [18, 19, 20, 21, 22]
            },
            filter2:{
                homeCookRate: dummy.random.number({'min': 1,'max': 10}),
                nightOwlRate: dummy.random.number({'min': 1,'max': 10}),
                playsMusicRate: dummy.random.number({'min': 1,'max': 10}),
                seekIntrovertRate: dummy.random.number({'min': 1,'max': 10}),
                seekExtrovertRate: dummy.random.number({'min': 1,'max': 10}),
                cleanlinessToleranceRate: dummy.random.number({'min': 1,'max': 10})
            }
        });
    }
    newUserQ.save(function (err, userDummy){
        if(err){
            console.error('err');
        }else{
            console.log(userDummy.id + " saved to User collection.");
        }
    });
};
