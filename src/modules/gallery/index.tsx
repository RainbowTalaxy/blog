import style from './index.module.css';
import Layout from '@theme/Layout';
import CardList from '@site/src/modules/gallery/components/CardList';
import { GALLERY_2021, GALLERY_2022, LATEST_CARDS } from './gallery';

export default function Home(): JSX.Element {
    return (
        <Layout title="Gallery">
            <div className={style['main-body']}>
                <div className={style.title}>最新合集</div>
                <CardList id="latest" configs={LATEST_CARDS} />
                <div className={style.title}>2022</div>
                <CardList id="2022" configs={GALLERY_2022} />
                <div className={style.title}>2021</div>
                <CardList id="2021" configs={GALLERY_2021} />
            </div>
        </Layout>
    );
}
