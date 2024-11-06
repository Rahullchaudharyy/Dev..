const AdminAuth = (req, res, next) => {
    const { Token } = req.body;
    console.log("Token Recived = ", Token)

    const IsAuthorized = Token === 'xstlnfkasd'
    if (!IsAuthorized) {

        res.status(401).send(' "Danger ⚠️" This request is not valid , We are sending the Report to the CBI For this Request for taking action !! ');
    } else {

        next();

    }
}
const UserAuth = (req, res, next) => {
    const { Token } = req.body;
    console.log("Token Recived = ", Token)

    const IsAuthorized = Token === 'xstlnfkasd'
    if (!IsAuthorized) {

        res.status(401).send('Unauthorized Request');
    } else {

        next();

    }
}

module.exports = {
    AdminAuth,
    UserAuth,


}