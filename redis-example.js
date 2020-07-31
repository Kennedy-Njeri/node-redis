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


// in redis we cant store direct object

// client.set('colors', JSON.stringify({ red: 'roho' }))
//
// // we get a json hence we have to parse it
// client.get('colors', console.log)
//
// client.get('colors', (error, value) => console.log(JSON.parse(value)))

