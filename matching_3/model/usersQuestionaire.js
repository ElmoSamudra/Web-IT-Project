var usersAns = [
    {
        // first layer of matching (filter user based on this field)
        "id":"10001",
        "filter1":{
            "sameNationalityPref":"yes",
            "sameGenderPref":"yes",
            "sameLocationPref":"yes",
            "petsPref":"yes",
            "sameLangPref":"yes",
            "numRoommeePref":"2",
            "ageDiffRange":[18, 19, 20, 21]
        },
        "filter2":{
            // second later of matching (sort based on this rating)
            "homeCookRate":"7",
            "nightOwlRate":"6",
            "playsMusicRate":"3",
            "seekIntrovertRate":"7",
            "seekExtrovertRate":"3",
            "cleanlinessToleranceRate":"9"
        }
    },
    {
        "id":"10002",
        // first layer of matching (filter user based on this field)
        "filter1":{
            "sameNationalityPref":"yes",
            "sameGenderPref":"yes",
            "sameLocationPref":"yes",
            "petsPref":"yes",
            "sameLangPref":"yes",
            "numRoommeePref":"2",
            "ageDiffRange":[18, 19, 20, 21]
        },
       
        // second later of matching (sort based on this rating)
        "filter2":{
            "homeCookRate":"2",
            "nightOwlRate":"4",
            "playsMusicRate":"3",
            "seekIntrovertRate":"7",
            "seekExtrovertRate":"3",
            "cleanlinessToleranceRate":"9"
        }
    },
    {
        "id":"10003",
        // first layer of matching (filter user based on this field)
        "filter1":{
            "sameNationalityPref":"yes",
            "sameGenderPref":"yes",
            "sameLocationPref":"yes",
            "petsPref":"yes",
            "sameLangPref":"yes",
            "numRoommeePref":"2",
            "ageDiffRange":[18, 19, 20, 21]
        },
       
        // second later of matching (sort based on this rating)
        "filter2":{
            "homeCookRate":"9",
            "nightOwlRate":"6",
            "playsMusicRate":"3",
            "seekIntrovertRate":"7",
            "seekExtrovertRate":"3",
            "cleanlinessToleranceRate":"1"
        }
    },
    {
        "id":"10005",
        // first layer of matching (filter user based on this field)
        "filter1":{
            "sameNationalityPref":"yes",
            "sameGenderPref":"yes",
            "sameLocationPref":"yes",
            "petsPref":"yes",
            "sameLangPref":"yes",
            "numRoommeePref":"2",
            "ageDiffRange":[18, 19, 20, 21]
        },
       
        // second later of matching (sort based on this rating)
        "filter2":{
            "homeCookRate":"7",
            "nightOwlRate":"6",
            "playsMusicRate":"3",
            "seekIntrovertRate":"7",
            "seekExtrovertRate":"4",
            "cleanlinessToleranceRate":"8"
        }
    }
]

module.exports = usersAns;