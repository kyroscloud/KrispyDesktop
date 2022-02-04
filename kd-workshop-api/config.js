const mongoUrl = process.env.MONGOURL || ''
const mongoDB = process.env.MONGODB || ''

module.exports = {
    'mongoUrl': `${mongoUrl}`,
    'mongoDb': `${mongoDB}`
}