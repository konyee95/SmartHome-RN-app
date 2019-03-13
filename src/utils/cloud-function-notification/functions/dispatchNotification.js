const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = (req, res) => {
    if (!req.body.rpid || !req.body.requestType) {
        return res.status(422).send({
            error: 'Bad Input'
        });
    }

    const rpid = String(req.body.rpid);
    const requestType = parseInt(req.body.requestType)

    let title, body

    if (requestType === 0) {
        title = "Intruder detected!"
        body = "Launch the app to protect your home!"
    } else if (requestType === 1) {
        title = "Model Training Completed"
        body = "Face recognition is ready!"
    }

    let payload = {
        notification: {
            title: title,
            body: body,
            sound: "default",
            badge: "1"
        }
    };

    return loadUsersInOneRPID(rpid).then(userIDs => {
        return loadTokens(userIDs).then(tokens => {
            res.status(200).send({ message: "Notification dispatched" });
            return admin.messaging().sendToDevice(tokens, payload);
        });
    });

}

function loadUsersInOneRPID(rpid) {
    let dbRef = admin.database().ref(`/RPID/${rpid}`);
    let defer = new Promise((resolve, reject) => {
        dbRef.once("value", snapshot => {
            let data = snapshot.val();
            let userIDs = [];
            Object.keys(data).forEach(key => {
                userIDs.push(key);
            });
            resolve(userIDs);
        }, (err) => {
            reject(err);
        })
    })
    return defer;
}

function loadTokens(userArray) {
    let dbRef = admin.database().ref(`/Users`);
    let defer = new Promise((resolve, reject) => {
        dbRef.once("value", snapshot => {
            let data = snapshot.val();
            let tokens = [];
            Object.keys(data).forEach(key => {
                if (userArray.indexOf(key) > -1) {
                    tokens.push(data[key].pushToken);
                }
            });
            resolve(tokens);
        }, (err) => {
            reject(err);
        })
    })
    return defer;
}