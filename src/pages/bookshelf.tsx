import styles from './index.module.css';
import Layout from '@theme/Layout';

const books = [
    'Harry Potter and the Half-Blood Prince',
    'The Midnight Library',
    'The Little Prince',
];

const Page = () => {
    return (
        <Layout title="书架">
            <article className={styles['custom-page']}>
                <h1>书架</h1>
                <ul>
                    {books.map((book, id) => (
                        <li key={id}>
                            <a href={`/book?book=${encodeURIComponent(book)}`}>
                                {book}
                            </a>
                        </li>
                    ))}
                </ul>
            </article>
        </Layout>
    );
};

export default Page;
