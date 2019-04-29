const axios = require('axios')
const { appendFile } = require('fs').promises
const app = require('express')()
const bodyParser = require('body-parser')
const jsonRouter = require('../json-rpc')

function formatData(data, id = '') {
    return `${id}: ${Date.now()} : ${JSON.stringify(data)}\n`
}

const controller = {
    async getUser({ id }) {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
        return response.data
    },
    async getPost({ id }) {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        return response.data
    },
    async getPhoto({ id }) {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)
        return response.data
    }
}

const beforeController = {
    getUser({ id }) {
        if (id <= 0 || id > 10) {
            throw new Error('ERROR: getUser id should be between 1 and 10')
        }
    },
    getPost({ id }) {
        if (id <= 0 || id > 100) {
            throw new Error('ERROR: getUserPosts id should be between 1 and 100')
        }
    },
    getPhoto({ id }) {
        if (id <= 0 || id > 5000) {
            throw new Error('ERROR: getUserPhotos id should be between 1 and 5000')
        }
    }
}

const afterController = {
    async getUser({ id }, execResult) {
        await appendFile("users.log", formatData(execResult, id))
    },
    async getPost({ id }, execResult) {
        await appendFile("posts.log", formatData(execResult, id))
    },
    async getPhoto({ id }, execResult) {
        await appendFile("photos.log", formatData(execResult, id))
    }
}

app.use(bodyParser.json())
app.use(jsonRouter({
    methods: controller,
    beforeMethods: beforeController,
    afterMethods: afterController,
    onError(e) {
        console.log('Omg error occurred!', e)
    }
}))
app.listen(3000, () => console.log('Example app listening on port 3000'))
