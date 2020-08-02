const mongoose = require('mongoose')

// get a reference to the existing default exec function that is defined in in a query so that we override it whenever the query is executed
// stores the original to an exec func i.e the copy
const exec = mongoose.Query.prototype.exec

//
mongoose.Query.prototype.exec = function () {
    console.log("I'M ABOUT TO RUN A QUERY")

    return exec.apply(this, arguments)
}