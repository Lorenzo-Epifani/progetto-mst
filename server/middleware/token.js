

const jwt = require('jsonwebtoken');
const fs = require('fs');



function getSecret(){
    try {
        const data =  JSON.parse(fs.readFileSync(`${__dirname}/jwt.json`, 'utf8')); // Legge il file
        if (!data['jwt_secret']){
            throw new Error("JWT secret error")
        }
        return data['jwt_secret']
    } catch (err){
        throw new Error("JWT secret error");
    }
}

function _from_token (token){
    jwt_key = getSecret()
    var decoded = jwt.verify(token, jwt_key);
    return decoded;
}

function _to_token (user_data, expiresIn=28800){
    const jwt_key = getSecret() //unsafe, just to show
    //delete user_data.password //è salted
    const to_encode={
        username:user_data.username,
    }
    const token = jwt.sign(to_encode, jwt_key, {
        expiresIn: expiresIn //8hr
    });
    
    return token;
    
}


function _isJwtValid(token) {
    const jwt_key = getSecret()
    return jwt.verify(token, jwt_key);
}

const content={
    
    to_token: _to_token,
    
    from_token: _from_token,
    
    isJwtValid: _isJwtValid,
    
    protect: (req, res, next) => {
        var payload = null
        const auth_header = req.headers['authorization']
        try{
            if (auth_header && auth_header.startsWith('Bearer ')) {
                token = auth_header.split(' ')[1];
                req.jwt_payload =  _isJwtValid(token); 
                next()
            }else{throw jwt_error}
        }catch(err){
            return res.status(401).json({ msg: err, error:"TOKEN_KO"});
        }
    },

    paginate: (req, res, next) => {
        var payload = null
        const page_token = req.headers['page_token']
        try{
            if (page_token) {
                const payload =  _isJwtValid(page_token); 
                req.paginate ={
                    skip:payload.skip,
                    limit:payload.limit,
                    has_more:payload.has_more
                }   
                next()
            }else{
                next()
            }
        }catch(err){
            return res.status(401).json({ msg: err, error:"PAGINATE_KO"});
        }
    }
    
}

module.exports = content;