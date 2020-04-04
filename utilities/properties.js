module.exports = {
    setSharedProperties: (req, data) => {
        if(!(data instanceof Object)) {
           data = {};
        }
        data.user = req.user;
        console.log(req.user.name);
        return data;
     }
}
