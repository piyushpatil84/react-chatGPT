import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
    res.status(200).send({
        message: "This is chatGPT AI App"
    })
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.input }],
            temperature: 0,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        console.log("Pass", req.body.input)
        res.status(200).send({
            bot: response.data.choices[0]?.message?.content
        })
    } catch (err) {
        console.log(err)
        console.log("Fail", req.body.input)
        res.status(500).send(err)
    }
})


app.listen(4000, () => console.log("Server is running on port 4000"))