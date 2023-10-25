import styles from './styles.module.css';
import clsx from 'clsx';
function transformImgClassName(className) {
    return clsx(className, styles.img);
}
export default function MDXImg(props) {
    return (
        <img
            referrerPolicy="no-referrer"
            loading="lazy"
            {...props}
            className={transformImgClassName(props.className)}
        />
    );
}
