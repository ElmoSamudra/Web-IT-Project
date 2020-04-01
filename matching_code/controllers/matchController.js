// get the data model for other user
var users = require('../model/users.js');
var users_ans = require('../model/users_questionaire.js');

// function to return all user that is a match
const getMatchUsers = (req, res) => {
    
    // filter 1
    const id_user = req.params.id;
    const match_user = first_filter(id_user, users, users_ans);
    res.send(match_user);
    
    // filter 2
    
    
    // iterate for every match user there is 
    //for(i=0; i<match_user.length; i++){
        // we can't show the client the user's sensitive or private information
        //res.send({"Name":match_user[i].first_name+' '+match_user[i].last_name, "Gender":match_user[i].gender, 
                  //"Nationality":match_user[i].nationality, "Hobby":match_user[i].hobby, "Finding a place to stay //in":match_user[i].prefer_stay});
    //};

};

function first_filter(id_user, users, users_ans){
    
    const user = users.find(user => user.id === id_user);
    const q_ans = users_ans.find(users_ans => users_ans.id === id_user);
    
    // get all 1st layer filters 
    const nationality_pref = q_ans.same_nationality_preference;
    const gender_pref = q_ans.same_gender_preference;
    const location_pref = q_ans.same_location_preference;
    const pets_pref = q_ans.pets_preference;
    const uni_pref = q_ans.same_uni_preference;
    const lang_pref = q_ans.same_language_preference;
    const user_num_roommee_pref = q_ans.number_of_roommee_preference;
    
    let filter_1 = users.filter(filter_1 => user.id != filter_1.id && user.roommee == "none");
    
    // find same num roommee first
    const same_num_roommee = users_ans.filter(value => value.number_of_roommee_preference === user_num_roommee_pref && user.id != value.id);
    filter_1 = id_intersect(users, same_num_roommee);
    
    // apply the rest of the filter
    if(nationality_pref=='yes'){
        filter_1 = filter_1.filter(filter_1 => filter_1.nationality === user.nationality);
    }
    if(gender_pref=='yes'){
        filter_1 = filter_1.filter(filter_1 => filter_1.gender === user.gender);
        // add here check if they want male too or not
    }
    if(location_pref != 'any'){
        filter_1 = filter_1.filter(filter_1 => filter_1.prefer_stay === user.prefer_stay);
    }
    if(pets_pref=='yes'){
        const user_pets_id = users_ans.filter(user_pets_id=>user_pets_id.pets_preference === 'yes');
        filter_1 = id_intersect(filter_1, same_num_roommee);
    }
    if(uni_pref=='yes'){
        const uni_id = users_ans.filter(uni_id=>uni_id.same_uni_preference === 'yes');
        filter_1 = id_intersect(filter_1, uni_id);
    }
    if(lang_pref=='yes'){
        const match_lang = find_match_lang(user);
        filter_1 = filter_1.filter(filter_1 => -1 !== match_lang.indexOf(filter_1));
    }
    
    return filter_1;
    
}

function find_match_lang(user){
    const match_lang = []
    const lang = user.language;
    const other_user = users.filter(other_user => user.id != other_user.id && other_user.roommee == "none");
    // iterate for every other user
    for(i=0; i<other_user.length; i++){
        const same_lang = lang.filter(value => -1 !== other_user[i].language.indexOf(value)).length;
        // if there is at least 1 same language
        if(same_lang!=0){
            match_lang.push(other_user[i]);
        }
    }
    return match_lang;
}

function id_intersect(filter, target){
    const result = []
    // iterate the target array
    for(i=0; i<target.length; i++){
        // iterate the filter array
        for(j=0; j<filter.length; j++){
            // find intersect for id
            if(target[i].id===filter[j].id){
                result.push(filter[j]);
                break;
            }
        }
    }
    return result;   
}

module.exports={
    getMatchUsers,
};