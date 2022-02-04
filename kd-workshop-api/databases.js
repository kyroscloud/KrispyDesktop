const config = require('./config')
const mongoClient = require('mongodb').MongoClient
function connect (url, db) {
    return mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}).then(client => client.db(db))
}

module.exports = async function () {
  let databases = await Promise.all([connect(config.mongoUrl, config.mongoDb)])
  console.log("DB Connected")
  return {
    krispyAppDb: databases[0]
  }
}