"use client"
import style from "./login.module.css";
import { logIn } from "@/redux/features/auth-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useState } from "react";
import { useRouter } from 'next/navigation'


const LoginPage = () => {
  const [userName, setUserName] = useState("");

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const onFormSubmit = (e: any) => {
    e.preventDefault()
    dispatch(logIn(userName))
    localStorage.setItem('loggedInName', userName)
    router.push('/')
  }

  return (
    <section className={style.login}>
      <form onSubmit={onFormSubmit} className={style.loginform}>
        <input
          className={style.loginform__input}
          type="text"
          placeholder="User name"
          onChange={(e) => setUserName(e.target.value)}
          required
          minLength={3}
          maxLength={10}
        />
        <button className={style.loginform__button} disabled={userName.length < 3 || userName.length > 10}>
            Join
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
