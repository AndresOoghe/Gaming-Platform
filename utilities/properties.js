module.exports = {
    setSharedProperties: (req, data) => {
        if(!(data instanceof Object)) {
           data = {};
        }
        data.user = req.user;
        return data;
     }
}
