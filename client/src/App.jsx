import { useEffect, useState } from 'react'
import axios from 'axios'

import send from './assets/send.svg'
import user from './assets/user.png'
import bot from './assets/bot.png'
import loading from './assets/loader.svg'

function App() {
  const [input, setInput] = useState('')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    document.querySelector('.layout').scrollTop = document.querySelector(
      '.layout',
    ).scrollHeight
  }, [posts])

  const getBotRespone = async () => {
    const { data } = await axios.post(
      'https://chatgpt-backend-app-t5v8.onrender.com',
      { input },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return data
  }

  const onSubmit = () => {
    if (input.trim() === '') return
    updatePosts(input)
    updatePosts('loading...', false, true)
    setInput('')
    getBotRespone().then((res) => {
      console.log(res)
      updatePosts(res.bot.trim(), true)
    })
  }

  const autoTypeBotResponse = (text) => {
    let index = 0
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop()
          if (lastItem.type !== 'bot') {
            prevState.push({
              type: 'bot',
              post: text.charAt(index - 1),
            })
          } else {
            prevState.push({
              type: 'bot',
              post: lastItem.post + text.charAt(index - 1),
            })
          }
          return [...prevState]
        })
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
  }

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypeBotResponse(post)
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? 'loading' : 'user', post }]
      })
    }
  }

  const onKeyUp = (e) => {
    if (e.key === 'Enter' || e.which === 13) {
      onSubmit()
    }
  }

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, i) => (
            <div
              key={i}
              className={`chat-bubble ${
                post.type === 'bot' || post.type === 'loading' ? 'bot' : ''
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === 'bot' || post.type === 'loading' ? bot : user
                  }
                  alt="icon"
                />
              </div>
              {post.type === 'loading' ? (
                <div className="loader">
                  <img src={loading} />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
          className="composebar"
          autoFocus
          value={input}
          type="text"
          placeholder="Ask Anything!"
          onChange={(e) => {
            setInput(e.target.value)
          }}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="sendIcon" />
        </div>
      </footer>
    </main>
  )
}

export default App
