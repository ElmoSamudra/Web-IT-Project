
var membersArray = [];
class Account {
    constructor(name, surName, email, password) {
        this.name = name;
        this.surName = surName;
        this.email = email;
        this.password = password;
    }
}

module.exports = {
    membersArray,
    Member: Account,
};