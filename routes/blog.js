const express = require('express')
const Blog = require('../models/blog')
const router = new express.Router()
const auth = require('../auth/auth')
const cleanCache = require('../auth/cleanCache')



// creating a new blog for a user
router.post('/blogs', auth, cleanCache, async (req, res) => {

    const blog = new Blog({
        ...req.body,
        owner: req.user._id
    })

    try {
        const blogs = await blog.save()
        res.status(201).send(blogs)
    } catch (e) {
        res.status(400).send(e)
    }

    //clearHash(req.user.id)
})



// GET /blogs?limit=1
// GET /blogs?sortBy=createdAt:desc
// router.get('/blogs', auth, async (req, res) => {
//
//     const sort = {}
//
//
//     if (req.query.sortBy) {
//         const parts = req.query.sortBy.split(':')
//         // grabbing the value in the first array
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }
//
//     try {
//         // or
//         // const blog = await Blog.find({ owner: req.user._id})
//
//         await req.user.populate({
//             path: 'blog',
//             options: {
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip),
//                 // property short hand syntax
//                 sort
//             }
//         }).execPopulate()
//         res.send(req.user.blog)
//     } catch (e) {
//         res.status(500).send(e)
//     }
//
//
// })



router.get('/blogs', auth, async (req, res) => {

    try {

        const blog = await Blog.find({ owner: req.user._id}).cache({
            key: req.user.id
        })

        res.send(blog)

    } catch (e) {

        res.status(500).send(e)
    }


})



// router.get('/blogs', auth, async (req, res) => {
//
//     try {
//         const redis = require("redis");
//         //const redisUrl = 'redis://127.0.0.1:6379'
//         const client = redis.createClient();
//
//         // promisify enables us to use promises in cachedBlogs so that we dont use callbacks, we use promises
//         const util = require('util')
//         client.get = util.promisify(client.get)
//
//
//         // do we have any cached data in redis related to this query?
//         const cachedBlogs = await client.get(req.user.id)
//
//         // if yes, then respond to the request right way and return
//         if (cachedBlogs){
//             console.log("Serving from cache")
//             return res.send(JSON.parse(cachedBlogs))
//         }
//
//
//         // if no, we need to respond to the request and update our cache to store the data
//
//         const blog = await Blog.find({ owner: req.user._id})
//
//         console.log("Serving from MongoDb")
//
//         res.send(blog)
//
//         client.set(req.user.id, JSON.stringify(blog))
//
//     } catch (e) {
//
//         res.status(500).send(e)
//     }
//
//
// })




// get a specific stock created by user
router.get('/blogs/:id', auth, async (req, res) => {
    //const _id = req.params.id

    try {

        const blog = await Blog.findOne({ _id: req.params.id, owner: req.user._id })

        if (!blog) {
            return res.status(404).send()
        }

        res.send(blog)

    } catch (e) {

        res.status(500).send()
    }

})



// // edit specific stock
router.patch('/blogs/:id', auth, async (req, res) => {

    try {
        // find by update bypasses mongoose hence providing a direct operation(that is why we set run validators)
        const blog = await Blog.findByIdAndUpdate({ _id: req.params.id, owner: req.user._id}, req.body, { new: true, runValidators: true }, )


        if (!blog) {
            return res.status(404).send()
        }


        // where our middleware is being executed
        await blog.save()

        res.send(blog)

    } catch (e) {

        res.status(400).send(e)
    }
})


// delete a blog
router.delete('/blogs/:id', auth, async (req, res) => {
    try {

        const blog = await Blog.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!blog) {
            res.status(404).send()
        }
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }

})







module.exports = router