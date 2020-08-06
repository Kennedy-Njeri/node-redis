const mongoose = require('mongoose')


const redis = require("redis");
const client = redis.createClient();

// promisify enables us to use promises in cachedBlogs so that we dont use callbacks, we use promises
const util = require('util')
client.hget = util.promisify(client.hget)




// get a reference to the existing default exec function that is defined in in a query so that we override it whenever the query is executed
// stores the original to an exec func i.e the copy
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true
    this.hashKey = JSON.stringify(options.key || '')

    // enable it to be chainable in a query e.g .cache()
    return this
}




//
mongoose.Query.prototype.exec = async function () {


    if (!this.useCache) {
        return exec.apply(this, arguments)
    }


    //console.log("I'M ABOUT TO RUN A QUERY")

    // console.log(this.getQuery())
    // console.log(this.mongooseCollection.name)
    // so that we can generate one consistent key and list their collections... user keys are identical but consistent with the blog one
    // therefore we combine them in one object
    // object.assign is used to copy properties from one object to another
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }))
    //console.log(key)

    // see if we have a value of 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key)


    // if we do, return that
    if (cacheValue) {
        const doc = JSON.parse(cacheValue)
        //console.log(cacheValue)

        // check if the doc is an array or object
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc)

    }



    // otherwise, issue the query and store the result in redis

    const result = await exec.apply(this, arguments)

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10)


    return result
    //console.log(result)
}


module.exports = {

    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}