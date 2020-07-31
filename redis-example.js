// start
// node-redis:node
// step
//  const redis = require("redis")
//  const client = redis.createClient()

// we save the data interms of key value

// example  client.set("hi", "there")
// client.get("hi", (err, value) => console.log(value)) or client.get("hi", console.log) which returns null "there"



// Nested Hashes
// const redisValues = {
//     spanish: {
//         red: 'rojo',
//         orange: 'naranja',
//         blue: 'azlul'
//     },
//     german: {
//         red: 'rojo',
//         orange: 'naranja',
//         blue: 'azlul'
//     }
// }
//
//
// client.hset('german', 'red', 'rojo')
//
// client.hget('german', 'red', console.log)