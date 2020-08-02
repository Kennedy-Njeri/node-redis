const mongoose = require('mongoose')

// get a reference to the existing default exec function that is defined in in a query so that we override it whenever the query is executed
// stores the original to an exec func i.e the copy
const exec = mongoose.Query.prototype.exec

//
mongoose.Query.prototype.exec = function () {
    console.log("I'M ABOUT TO RUN A QUERY")

    // console.log(this.getQuery())
    // console.log(this.mongooseCollection.name)
    const key = Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    })

    console.log(key)

    return exec.apply(this, arguments)
}