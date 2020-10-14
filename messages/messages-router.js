const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        // translates to "select" * FROM messages
        const messages = await db.select("*").from("messages")
        res.json(messages)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        // translates to "SELECT * FROM MESSAGES WHERE id = ? LIMIT 1"
        const [message] = await db
            .select("*")
            .from("messages")
            .where("id", req.params.id)
            .limit(1)
        res.json(message)
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents
        }

        if (!payload.title || !payload.contents) {
            return res.status(400).json({
                message: "Need a title and contents"
            })
        }

        // translates to "INSERT INTO messages (title, conents) VALUES (?, ?);"
        const [id] = await db.insert(payload).into("messages")
        const message = await db
            .first("*")  //shortcut for destructuring the array and limit 1
            .from("messages")
            .where("id", id)

        res.status(201).json(message)
    } catch (err) {
        next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents
        }

        if (!payload.title || !payload.contents) {
            return res.status(400).json({
                message: "Need a title and contents"
            })
        } 
        // translates to "UPDATE messages SET title = ? AND contents = ? WHERE id = ?"
        await db("messages").where("id", req.params.id).update(payload)
        const message = await db
            .first("*")  //shortcut for destructuring the array and limit 1
            .from("messages")
            .where("id", req.params.id)

            res.json(message)
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        // translates to 'DELETE FROM messages WHERE id = ?'
        await db ("messages").where("id", req.params.id).del()
        
        //no longer have a resource to return, but it was deleted successfully 
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

//to write a function to be reused on a db
//destructure the fuction
// function getMessageByID(id) {
// 	return db
// 		.first("*") // a shortcut for destructuring the array and limit 1
// 		.from("messages")
// 		.where("id", id)
// }


//replace the function that was destructured
// const message = await db
//             .first("*")  //shortcut for destructuring the array and limit 1
//             .from("messages")
//             .where("id", req.params.id)

//             res.json(message)

//with
//             res.json(await getMessageByID(req.params.id))

module.exports = router