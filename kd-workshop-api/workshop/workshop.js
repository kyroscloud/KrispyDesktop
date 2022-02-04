const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const kubeFunc = require("../kubeFunctions");
const ObjectId = require('mongodb').ObjectId;
//const databases = require('../databases');

router.use(bodyParser.json())

router.post('/singleNode', workshopDeploy);
router.post('/workshopDeploy', groupWorkshopDeploy)
router.delete('/workshopRemove', workshopRemove)

async function workshopDeploy (req, res) {
    let result = {"successful": true}
    try {
        let nodeName = req.body.nodeName
        let imageName = req.body.imageName
        let kubeSuccess = await kubeFunc.applyWorkshop(nodeName, imageName);
        if (kubeSuccess.successful){
            res.status(200).send(result);
        } else {
            result.successful = kubeSuccess.successful
            res.status(500).send(result);
        }
    }
    catch (e) {
        result.successful = false
        console.log(e)
        res.status(500).send(result)
    }
}

async function workshopRemove (req, res) {
    let result = {"successful": true}
    try {
        let nodeName = req.body.nodeName
        let imageName = req.body.imageName
        let kubeSuccess = await kubeFunc.applyWorkshop(nodeName, imageName);
        if (kubeSuccess.successful){
            res.status(200).send(result);
        } else {
            result.successful = kubeSuccess.successful
            res.status(500).send(result);
        }
    }
    catch (e) {
        result.successful = false
        console.log(e)
        res.status(500).send(result)
    }
}

async function groupWorkshopDeploy (req, res) {
    let result = {"successful": true}
    try {
        let workshopGroupId = req.body.workshopGroupId
        let imageName = req.body.imageName
        //let imageName = req.body.imageName

        //const db = databases.krispyAppDb
        const db = req.app.databases.krispyAppDb

        console.log(db)
        db.collection('nodes').find({workshopGroupId: workshopGroupId}).toArray( function (dbErr, nodeResult) {
            if (dbErr) {
                result.successful = false
                result.errorMsg = `Could not query workshopGroup`
                result.debug = err.toString()
                res.status(500).send(result)
            }
            //console.log(nodeResult)
            let nodeDeployResults = multiWsDeploy(nodeResult, imageName)
            if (nodeDeployResults.successful){
                //result.successRate = "Complete success - check nodeResults"
                result.nodeDeployResults = nodeDeployResults
            } else {
                //result.successRate = "partial - check nodeResults"
                result.nodeDeployResults = nodeDeployResults
            }

            res.status(200).send(result);
        })
    }
    catch (e) {
        result.successful = false
        console.log(e)
        res.status(500).send(result)
    }
}

async function multiWsDeploy(wsArray, dsktopImage) {
    let nodeCount = 0
    let nodeResults = {"successful": true}
    for (let ws = 0; ws < wsArray.length; ws++) {
        let kubeSuccess = await kubeFunc.applyWorkshop(wsArray[ws].name, dsktopImage);
        if (kubeSuccess.successful){
            nodeCount = nodeCount++
            let wsNodeDeploy = wsArray[ws].name + "-deploy"
            nodeResults[wsNodeDeploy] = kubeSuccess.successful
        } else {
            nodeResults.successful = false
            let wsNodeDeploy = wsArray[ws].name + "-deploy"
            nodeResults[wsNodeDeploy] = kubeSuccess.successful
            nodeResults.successful = false
        }
    }
    nodeResults["nodeResults"] = nodeCount + " out of " + wsArray.length + " workshop nodes deployed!"

    return nodeResults
}

module.exports = router