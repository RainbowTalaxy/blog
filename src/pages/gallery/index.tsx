import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import style from './index.module.css';
import { GALLERY_CARDS } from '../../constants/gallery';
import LeftArrow from '@site/static/svg/left-arrow.svg';
import RightArrow from '@site/static/svg/right-arrow.svg';
import { throttle } from 'lodash';

const getValue = (s: string) => {
    return parseFloat(s) || 0;
};

export default function Home(): JSX.Element {
    const [scroll, setScroll] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(0);

    const scrollContent = useMemo(() => {
        return throttle((plus: boolean) => {
            const cardEles = document.getElementsByClassName(style.card);
            const refEle = cardEles[cardEles.length - 1];
            const { width, marginLeft } = window.getComputedStyle(refEle);
            const offsetX =
                (getValue(width) + getValue(marginLeft)) * (plus ? 1 : -1);
            console.log(offsetX);
            const targetEle = document.getElementsByClassName(
                style['card-list'],
            )[0];
            targetEle.scrollBy({
                top: 0,
                left: offsetX,
                behavior: 'smooth',
            });
            const handleFloat = plus ? Math.ceil : Math.floor;
            setScroll(
                handleFloat(targetEle.scrollLeft + offsetX + (plus ? 10 : -10)),
            );
        }, 600);
    }, []);

    useEffect(() => {
        const targetEle = document.getElementsByClassName(
            style['card-list'],
        )[0];
        setScrollWidth(targetEle.scrollWidth - targetEle.clientWidth);
        window.addEventListener('resize', () => {
            const targetEle = document.getElementsByClassName(
                style['card-list'],
            )[0];
            setScrollWidth(targetEle.scrollWidth - targetEle.clientWidth);
        });
    }, []);

    return (
        <Layout title="Welcome">
            <div className={style['main-body']}>
                <div className={style.title}>最新合集</div>
                <div className={style.cards}>
                    <LeftArrow
                        className={clsx(
                            style.leftArrow,
                            scroll <= 0 && style.hidden,
                        )}
                        onClick={() => scrollContent(false)}
                    />
                    <div className={style['card-list']}>
                        {GALLERY_CARDS.map((card) => (
                            <div
                                key={card.title}
                                className={style.card}
                                onClick={() =>
                                    (window.location.href = card.link)
                                }
                            >
                                <div className={style['card-text']}>
                                    <div className={style['card-title']}>
                                        {card.title}
                                    </div>
                                    <div className={style['card-subtitle']}>
                                        {card.subtitle}
                                    </div>
                                </div>
                                <img src={card.bg} />
                            </div>
                        ))}
                    </div>
                    <RightArrow
                        className={clsx(
                            style.rightArrow,
                            scroll >= scrollWidth && style.hidden,
                        )}
                        onClick={() => scrollContent(true)}
                    />
                </div>
            </div>
        </Layout>
    );
}
