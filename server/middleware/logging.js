const crypto = require('crypto');

const log_request = (req, res, next) => {
    const req_hash = crypto.createHash('md5').update(req.toString()).digest('hex');
    const res_hash = crypto.createHash('md5').update(res.toString()).digest('hex');

    console.log("################### REQUEST ####################")
    console.log("##################### HASH ####################")
    console.log(`#################### ${req_hash}`)
    console.log(`#################### ${req_hash}`)
    console.log(`#################### ${req_hash}\n\n`)
    console.log(req.headers)
    console.log(`\n\n`)
    console.log(`\n\n`)
    next();
  };


const content={
    
    
    log_request: log_request,
    
    asyncHandler : (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}

module.exports = content;