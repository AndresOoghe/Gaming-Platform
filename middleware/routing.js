module.exports = {
    setActive(req, res, next) {
        const pathArr = req.path.split('/');
        res.locals.active = pathArr[pathArr.length - 1];
        return next();
    }
}