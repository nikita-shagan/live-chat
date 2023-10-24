import Image from 'next/image'
import styles from './header.module.css'
import Link from "next/link";


const Header = () => {
  return (
    <header className={styles.header}>
      <Link href='/'>
        <Image src='/logo.png' alt="logo" width="167" height="61"/>
      </Link>
    </header>
  )
}

export default Header
