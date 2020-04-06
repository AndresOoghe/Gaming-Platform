const { User } = require('../models/User');

module.exports = {
    findByusername: (username) => {
        return createPromise('username', username);
    },
    findByEmail: (email) => {
        return createPromise('email', email);
    }
}

const createPromise = (field, value) => {
    const query = {};
    query[field] = value;
    return new Promise((resolve, reject) => {
        User.findOne(query)
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}
