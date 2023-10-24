"use client"
import React, { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { useRef } from "react";
import { colors } from "@/app/constants";
import { useAppSelector } from "@/redux/store";

interface MessageDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String
}


const Chat = ({ socket, username, roomId }: any) => {
  const userName = useAppSelector((state) => state.authReducer.value.username)

  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [chat, setChat] = useState<MessageDataTypes[]>([]);
  const [userColors, setUserColors] = useState<Object>({})

  const scroll = useRef<HTMLInputElement>(null);

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const date = new Date();
    const utcDate = date.toLocaleString('ru', { timeZone: 'UTC' })
    if (currentMsg !== "") {
      const msgData: MessageDataTypes = {
        msg: currentMsg,
        user: username,
        roomId,
        time: utcDate
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    const initialChat = localStorage.getItem('liveChat')
    if (initialChat) {
      setChat(JSON.parse(initialChat))
    }
  }, [])

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
    localStorage.setItem('liveChat', JSON.stringify(chat))
    if (chat.length > 3000) {
      const newChat = chat.slice(Math.floor(chat.length / 2), chat.length)
      setChat(newChat)
    }
  }, [chat])


  useEffect(() => {
    socket.on("receive_msg", (data: MessageDataTypes) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  const handleUserColor = (username: any) => {
    const newUserColors: any = { ...userColors }
    if (!userColors.hasOwnProperty(username)) {
      const randomIndex = Math.floor(Math.random() * 12)
      newUserColors[username] = colors[randomIndex]
      setUserColors(newUserColors)
    }
    return newUserColors[username]
  }

  const getLocalDate = (utcTimeString: String) => {
    const [ day, month, year, hours, minutes, seconds ] = [
      utcTimeString.slice(0, 2),
      utcTimeString.slice(3, 5),
      utcTimeString.slice(6, 10),
      utcTimeString.slice(12, 14),
      utcTimeString.slice(15, 17),
      utcTimeString.slice(18, 20)
    ]

    const localDate = new Date(`${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`)
    return localDate.toLocaleString('ru')
  }

  return (
    <div className={styles.chat}>
      <div className={styles.chat__wrapper}>
        <div style={{ marginBottom: '20px' }}>
          <p>
            Live Chat
          </p>
        </div>
        <div className={styles.chat__messages} ref={scroll}>
          {chat.map(({ roomId, user, msg, time }, key) => (
            <div
              key={key}
              className={`${styles.message} ${user === userName && styles.message_reversed}`}
            >
              <div
                className={styles.message__senderAvatar}
                style={{backgroundColor: handleUserColor(user)}}
              >
                {user[0]}
              </div>
              <div className={`
                  ${styles.message__body} 
                  ${user === userName ? styles.message__body_right : styles.message__body_left}
                `}
              >
                <div className={`${styles.message__heading} ${user === userName && styles.message__heading_reversed}`}>
                  <span className={styles.message__senderName} style={{color: handleUserColor(user)}}>
                    {user}
                  </span>
                  <span className={styles.message__time}>
                    {getLocalDate(time)}
                  </span>
                </div>
                <p className={styles.message__text}>
                  {msg}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.chat__formContainer}>
          <form onSubmit={handleMessageSubmit} className={styles.chat__form}>
            <input
              type="text"
              value={currentMsg}
              placeholder="Type something..."
              onChange={(e) => setCurrentMsg(e.target.value)}
              className={styles.chat__formInput}
            />
            <button className={styles.chat__formButton}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
