import style from './index.module.css';
import Layout from '@theme/Layout';
import Emoji from '../components/Emoji';

export default function Home(): JSX.Element {
    return (
        <Layout title="Welcome">
            <div className={style['main-body']}>
                <div className={style.introduction}>
                    <img className={style.avatar} src="img/mercy.png" />
                    <div className={style.info}>
                        <div className={style.title}>Chen Siwei</div>
                        <div className={style.description}>@Talaxy</div>
                    </div>
                </div>
                <div className={style['contact-bar']}>
                    <div className={style['contact-cell']}>
                        <Emoji symbol="🏠" />
                        Nanjing, China
                    </div>
                    <div className={style['contact-cell']}>
                        <Emoji symbol="📧" />
                        fujianchensiwei@163.com
                    </div>
                    <div className={style['contact-cell']}>
                        <img src="img/github.png" />
                        <a href="https://github.com/RainbowTalaxy">
                            RainbowTalaxy
                        </a>
                    </div>
                </div>
                <p className={style.paragraph}>
                    欢迎！我是<strong>Talaxy</strong>。
                </p>
                <p className={style.paragraph}>
                    我喜欢玩<strong>守望先锋</strong>
                    ，并关注联赛，可以通过邮箱加我好友。
                </p>
                <p className={style.paragraph}>
                    我也喜欢<strong>Minecraft</strong>
                    基岩版，搭了服务器和朋友一块儿玩，可以加 QQ 一起玩。
                </p>
            </div>
        </Layout>
    );
}
