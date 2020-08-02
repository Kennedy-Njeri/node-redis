const mongoose = require('mongoose')


const redis = require("redis");
const client = redis.createClient();

// promisify enables us to use promises in cachedBlogs so that we dont use callbacks, we use promises
const util = require('util')
client.get = util.promisify(client.get)




// get a reference to the existing default exec function that is defined in in a query so that we override it whenever the query is executed
// stores the original to an exec func i.e the copy
const exec = mongoose.Query.prototype.exec

//
mongoose.Query.prototype.exec = function () {
    console.log("I'M ABOUT TO RUN A QUERY")

    // console.log(this.getQuery())
    // console.log(this.mongooseCollection.name)
    // so that we can generate one consistent key and list their collections... user keys are identical but consistent with the blog one
    // therefore we combine them in one object
    // object.assign is used to copy properties from one object to another
    const key = Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    })

    console.log(key)

    return exec.apply(this, arguments)
}