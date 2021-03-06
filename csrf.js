var crypto = require('crypto');

var generateToken = function (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
            .toString('base64')
            .slice(0, len);
};
function defaultValue(req) {
    return (req.body && req.body._csrf)
            || (req.query && req.query._csrf)
            || (req.headers['x-csrf-token']);
}
var checkToken = function (req, res, next) {
    var token = req.session._csrf || (req.session._csrf = generateToken(24));
    if ('GET' == req.method || 'HEAD' == req.method || 'OPTIONS' == req.method) {
        return next();
    }
    var val = defaultValue(req);
//    console.log(val,token);
    if (!val || val !== token) {
        return res.send({auth: false,message:"用户验证失败"});
    }
    next();
};
var newToken = function (req, res, next) {
    var token = req.session._csrf || (req.session._csrf = generateToken(24));
//    console.log(token);
    next();
};
module.exports = {
    check: checkToken,
    generate: newToken
};


