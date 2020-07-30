const express = require('express')
const Blog = require('../models/blog')
const router = new express.Router()
const auth = require('../auth/auth')



// creating a new stock for a user
router.post('/blogs', auth, async (req, res) => {

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

        const blog = await Blog.find({ owner: req.user._id})

        res.send(blog)
    } catch (e) {
        res.status(500).send(e)
    }


})







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