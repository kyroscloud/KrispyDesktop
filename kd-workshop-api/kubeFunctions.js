const Client = require('kubernetes-client').Client
const config = require('kubernetes-client/backends/request').config
const Request = require('kubernetes-client/backends/request')
const { KubeConfig } = require('kubernetes-client')
const workshopManifest =  require('./workshop-compy.json')
const uuid = require('uuid')

/*****
* POST and PUT functions
*****/

// This is used to 
exports.applyWorkshop = async function (node, image) {
    console.log("Incoming Image: " + image)

    const kubeconfig = new KubeConfig()

    // This code block determines if the API is being run for local dev
    if (process.env.DEV == 'true') {
        kubeconfig.loadFromFile("/Users/jockdarock/jock-projects/KrispyDesktop/k3s.yaml")
        console.log("kubeconfig loaded from default dev machine")
    }
    else {
        kubeconfig.loadFromCluster()
        console.log("kubeconfig loaded from in cluster")
    }

    const backend = new Request({ kubeconfig })
    const client = new Client({ backend, version: '1.13' })

    var templateImageName = workshopManifest.spec.template.spec.containers[0].image

    console.log("Template value: " + templateImageName.toString())

    // this block updates the kubernetes manifest for the container deployment
    workshopManifest.metadata.name = 'workshop-' + node
    workshopManifest.metadata.labels.app = 'workshop-' + node
    workshopManifest.spec.template.spec.containers[0].name = 'workshop-' + node
    workshopManifest.spec.template.spec.nodeName = node
    workshopManifest.spec.template.spec.containers[0].image = image
    workshopManifest.spec.template.metadata.labels.app = 'workshop-' + node
    workshopManifest.spec.selector.matchLabels.app = 'workshop-' + node

    var newTemplateImageName = workshopManifest.spec.template.spec.containers[0].image

    console.log("New template value: " + newTemplateImageName.toString())

    try {
        const create = await client.apis.apps.v1.namespaces('default').deployments.post({ body: workshopManifest })
        console.log('Create:', create.statusCode)
        return {"successful": true}
    } catch (err) {
        const replace = await client.apis.apps.v1.namespaces('default').deployments(workshopManifest.metadata.name).put({ body: workshopManifest })
        console.log('Replace:', replace)
        return {"successful": true}
        /* if (err.code !== 409) {
            console.log(err)
            return {"successful": false}
        } else {
            const replace = await client.apis.apps.v1.namespaces('default').deployments("workshop").put({ body: workshopManifest })
            console.log('Replace:', replace)
            return {"successful": true}
        } */
    }
};


/*****
* Delete functions
*****/

// This function uses the K8s API to delete a Hades container associated with a specific room server
exports.deleteDeployRoom = async function (roomServerSerial) {
    const kubeconfig = new KubeConfig()
    
    // This code block determines if the API is being run for local dev
    if (process.env.DEV == 'true') {
        kubeconfig.loadFromDefault()
        console.log("kubeconfig loaded from default dev machine")
    }
    else {
        kubeconfig.loadFromCluster()
        console.log("kubeconfig loaded from in cluster")
    }

    const backend = new Request({ kubeconfig })
    const client = new Client({ backend, version: '1.13' })

    try {
        const create = await client.apis.apps.v1.namespaces('default').deployments(roomServerSerial).delete()
        console.log('Create:', create.statusCode)
    } catch (err) {
        if (err.code !== 409) log.error(err)
        console.log('Deployment does not exist')
    }
}


async function getWorkshopImage () {
    return process.env.PLATFORM || "jockdarock/dsktop-test:ubuntu18-04"
}

