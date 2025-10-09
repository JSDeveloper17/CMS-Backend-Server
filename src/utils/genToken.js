const jwt = require("jsonwebtoken")

function generateJwtToken(admin){
    const payload = {
        sub:admin["_id"],
        email:admin.email,
        iat: Math.floor(Date.now()/1000),
        exp:Math.floor(Date.now()/1000)+ parseInt(process.env.JWT_TOKEN_EXPIRATION_TTL)
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}

module.exports =generateJwtToken