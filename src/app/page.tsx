"use client";
import styles from "./page.module.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "@/components/Chat/page";
import Preloader from "@/components/Preloader/page";
import {AppDispatch, useAppSelector} from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logIn } from "@/redux/features/auth-slice";

const roomId = 0

export default function Home() {
  const userName = useAppSelector((state) => state.authReducer.value.username)
  const isAuth = useAppSelector((state) => state.authReducer.value.isAuth)
  const router = useRouter();
  const [value, setValue] = useState(false)

  const dispatch = useDispatch<AppDispatch>();

  const socket: any = io('https://chatapi.shagan.ru');

  useEffect(() => {
    const loggedInName = localStorage.getItem('loggedInName')
    if (loggedInName !== null) {
      dispatch(logIn(loggedInName))
    }
    if (loggedInName !== null || isAuth) {
      socket.emit('join_room', roomId);
      setValue(true)
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <main className={styles.main}>
      <section className={`${styles.section} ${!isAuth && styles.section_hidden}`}>
        <Chat socket={socket} roomId={roomId} username={userName}/>
      </section>
      <Preloader visible={!isAuth}/>
    </main>
  )
}
