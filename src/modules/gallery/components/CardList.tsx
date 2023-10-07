import { GalleryCard } from '../gallery';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { throttle } from 'lodash';
import smoothscroll from 'smoothscroll-polyfill';
import style from '../index.module.css';
import clsx from 'clsx';

const getValue = (s: string) => {
    return parseFloat(s) || 0;
};

interface Props {
    id: string;
    configs: GalleryCard[];
}

const CardList = ({ id, configs }: Props) => {
    const cardCls = id + '-card';
    const cardListCls = id + '-card-list';
    const scroll = useRef(0);
    const [scrollWidth, setScrollWidth] = useState(0);
    const leftArrowRef = useRef<SVGSVGElement>(null);
    const rightArrowRef = useRef<SVGSVGElement>(null);

    const scrollContent = useMemo(() => {
        return throttle((plus: boolean) => {
            const cardElements = document.getElementsByClassName(cardCls);
            const refEle = cardElements[cardElements.length - 1];
            const { width, marginLeft } = window.getComputedStyle(refEle);
            const offsetX =
                (getValue(width) + getValue(marginLeft)) * (plus ? 1 : -1);
            const targetEle = document.getElementsByClassName(cardListCls)[0];
            targetEle.scrollBy({
                left: offsetX,
                behavior: 'smooth',
            });
            const handleFloat = plus ? Math.ceil : Math.floor;
            scroll.current = handleFloat(
                targetEle.scrollLeft + offsetX + (plus ? 100 : -100),
            );
            if (leftArrowRef.current) {
                leftArrowRef.current.classList.toggle(
                    style.hidden,
                    scroll.current <= 0,
                );
            }
            if (rightArrowRef.current) {
                rightArrowRef.current.classList.toggle(
                    style.hidden,
                    scroll.current >= scrollWidth,
                );
            }
        }, 400);
    }, [scrollWidth]);

    useLayoutEffect(() => {
        smoothscroll.polyfill();
        const targetEle = document.getElementsByClassName(cardListCls)[0];
        setScrollWidth(targetEle.scrollWidth - targetEle.clientWidth);
        window.addEventListener('resize', () => {
            const targetEle = document.getElementsByClassName(cardListCls)[0];
            setScrollWidth(targetEle.scrollWidth - targetEle.clientWidth);
        });
    }, []);

    useEffect(() => {
        if (leftArrowRef.current) {
            leftArrowRef.current.classList.toggle(
                style.hidden,
                scroll.current <= 0,
            );
        }
        if (rightArrowRef.current) {
            rightArrowRef.current.classList.toggle(
                style.hidden,
                scroll.current >= scrollWidth,
            );
        }
    }, [scrollWidth]);

    return (
        <div className={style.cards}>
            <svg
                ref={leftArrowRef}
                className={clsx(style.leftArrow, style.hidden)}
                onClick={() => scrollContent(false)}
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 330.002 330.002"
                xmlSpace="preserve"
            >
                <path
                    id="XMLID_227_"
                    fill="white"
                    d="M233.25,306.001L127.5,165.005L233.25,24.001c4.971-6.628,3.627-16.03-3-21c-6.627-4.971-16.03-3.626-21,3
	L96.75,156.005c-4,5.333-4,12.667,0,18l112.5,149.996c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001
	C236.878,322.03,238.221,312.628,233.25,306.001z"
                />
            </svg>
            <div className={clsx(style['card-list'], cardListCls)}>
                {configs.map((card) => (
                    <div
                        key={card.title}
                        className={clsx(style.card, cardCls)}
                        onClick={() => {
                            window.location.href = card.link;
                        }}
                    >
                        <div className={style['card-text']}>
                            <div className={style['card-title']}>
                                {card.title}
                            </div>
                            <div className={style['card-subtitle']}>
                                {card.subtitle}
                            </div>
                        </div>
                        <img referrerPolicy="no-referrer" src={card.bg} />
                    </div>
                ))}
            </div>
            <svg
                ref={rightArrowRef}
                className={clsx(style.rightArrow, style.hidden)}
                onClick={() => scrollContent(true)}
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 330.002 330.002"
                xmlSpace="preserve"
            >
                <path
                    id="XMLID_226_"
                    fill="white"
                    d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"
                />
            </svg>
        </div>
    );
};

export default CardList;
