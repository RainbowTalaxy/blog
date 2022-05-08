import { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Emoji from '../../components/Emoji';
import style from './index.module.css';
import { GALLERY_CARDS } from '../../constants/gallery';

export default function Home(): JSX.Element {
    return (
        <Layout title="Welcome">
            <div className={style['main-body']}>
                <div className={style.title}>最新合集</div>
                <div className={style.cards}>
                    {GALLERY_CARDS.map((card) => (
                        <div
                            className={style.card}
                            onClick={() =>
                                (window.location.href = card.link)
                            }
                        >
                            <div>
                                <div className={style['card-title']}>
                                    {card.title}
                                </div>
                                <div className={style['card-subtitle']}>
                                    {card.subtitle}
                                </div>
                            </div>
                            <div className={style['card-filter']}></div>
                            <img src={card.bg} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
