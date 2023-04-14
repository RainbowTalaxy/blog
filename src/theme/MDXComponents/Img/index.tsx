import clsx from 'clsx';
import styles from './styles.module.css';
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
