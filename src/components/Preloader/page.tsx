import styles from './preloader.module.css'


function Preloader({ size = 52, visible = true }) {
  return (
    <div
      className={`${styles.preloader} ${!visible && styles.preloader_hidden}`}
      style={{width: size, height: size}}
    />
  )
}

export default Preloader;
