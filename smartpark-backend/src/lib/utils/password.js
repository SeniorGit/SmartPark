const bcrypt = require('bcryptjs');

const hashPasword = async (password) => {
    const saltRounds = 2;
    return await bcrypt.hash(password, saltRounds);
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports = {hashPasword, comparePassword}