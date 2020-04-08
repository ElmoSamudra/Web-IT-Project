var idUser = "1001";

var userAns = [
    {
        "id":"1001",
        // first layer of matching (filter user based on this field)
        "filter1":{
            "same_nationality_preference":"yes",
            "same_gender_preference":"yes",
            "same_location_preference":"yes",
            "pets_preference":"yes",
            "same_uni_preference":"yes",
            "same_language_preference":"yes",
            "number_of_roommee_preference":"2",
        },
       
        // second later of matching (sort based on this rating)
        "filter2":{
            "home_cook_rating":"7",
            "night_owl_rating":"6",
            "same_hobby_rating":"5",
            "age_diff_rating":"6",
            "plays_music_rating":"3",
            "seek_introvert_rating":"7",
            "seek_extrovert_rating":"3",
            "Cleanliness_tolerance_rating":"9"
        }
    },
    {
        "id":"1002",
        // first layer of matching (filter user based on this field)
        "filter1":{
            "same_nationality_preference":"yes",
            "same_gender_preference":"yes",
            "same_location_preference":"yes",
            "pets_preference":"yes",
            "same_uni_preference":"yes",
            "same_language_preference":"yes",
            "number_of_roommee_preference":"2",
        },
       
        // second later of matching (sort based on this rating)
        "filter2":{
            "home_cook_rating":"6",
            "night_owl_rating":"8",
            "same_hobby_rating":"2",
            "age_diff_rating":"6",
            "plays_music_rating":"3",
            "seek_introvert_rating":"7",
            "seek_extrovert_rating":"1",
            "Cleanliness_tolerance_rating":"2"
        }
    },
    {
        "id":"1003",
        // first layer of matching (filter user based on this field)
        "filter1":{
            "same_nationality_preference":"yes",
            "same_gender_preference":"yes",
            "same_location_preference":"yes",
            "pets_preference":"yes",
            "same_uni_preference":"yes",
            "same_language_preference":"yes",
            "number_of_roommee_preference":"2",
        },
       
        // second later of matching (sort based on this rating)
        "filter2":{
            "home_cook_rating":"0",
            "night_owl_rating":"0",
            "same_hobby_rating":"3",
            "age_diff_rating":"0",
            "plays_music_rating":"2",
            "seek_introvert_rating":"2",
            "seek_extrovert_rating":"2",
            "Cleanliness_tolerance_rating":"2"
        }
    }
];

var filterOne = [
    {
        "id":"1003",
        "username":"manthony",
        "first_name":"Mike",
        "last_name":"Anthony",
        "gender":"Male",
        "nationality":"Indonesian",
        "hobby":["Basketball", "Cycling", "Jogging"],
        "language":["English, Indonesia"],
        "prefer_stay":"CBD",
        "roommee":"Michael Leo"
    },
    {
        "id":"1002",
        "username":"manthony",
        "first_name":"Mike",
        "last_name":"Anthony",
        "gender":"Male",
        "nationality":"Indonesian",
        "hobby":["Basketball", "Cycling", "Jogging"],
        "language":["English, Indonesia"],
        "prefer_stay":"CBD",
        "roommee":"Michael Leo"
    },

];
 


function secondFilter(idUser, usersAns, filterOne){

    //get answers for user
    let qAns = usersAns.find(ans => ans.id === idUser);
    let filterTwo = []; // store final result of compared users
    let comparedUserId; // compared user id
    let qAnsCompare; // compared user answers
    let comparison; // object of compared user distances

    //compare to each filter 1 matched users
    for(let i=0;i<filterOne.length;i++){

        //get answers for comparison
        comparedUserId = filterOne[i].id;
        qAnsCompare = usersAns.find(ans => ans.id === comparedUserId);
        
        //find euclidean distance
        comparison = {};
        comparison.id = comparedUserId;
        comparison.distance = euclidean(qAns.filter2, qAnsCompare.filter2);
        
        //push to array
        filterTwo.push(comparison);

        //sort filter_2
        filterTwo.sort(function(a,b){
            return a.distance - b.distance;
        });
    }

    return filterTwo;
}

function euclidean(user1, user2){

    var distance = 0;
    for(var key of Object.keys(user1)){
        distance += Math.pow((user1[key]-user2[key]),2);
    }
    return Math.sqrt(distance)
}

var final = secondFilter(idUser, userAns, filterOne)

console.log("object ans " + final[0].id + " " + final[0].distance);

console.log("object ans " + final[1].id + " " + final[1].distance);