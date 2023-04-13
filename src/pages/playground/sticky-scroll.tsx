import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.main`
    padding: 30px 60px 60px;
    background-color: var(--theme-color-orange);

    .image-placeholder {
        width: 280px;
        height: 280px;
        border-radius: 20px;
        background-color: var(--theme-color-red);
    }

    section {
        position: relative;
        padding-top: 30px;

        .feature-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            grid-auto-flow: dense;
            margin-top: 30%;
        }

        .feature-list {
            margin-top: -30%;
            padding: 60px 30px 0 0;
            grid-column: 1/2;
            height: 100vh;

            transition: all 1s ease;
            opacity: 0;
        }

        .feature-list:last-of-type {
            height: 51vh;
        }

        .feature-list.active {
            opacity: 1;
        }

        .feature-stop {
            position: sticky;
            top: 50%;
            right: 0;
            grid-column: 2/3;
            transform: translateY(-50%);
        }
    }
`;

const Page = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            {
                threshold: [0.2, 1],
            },
        );
        document
            .querySelectorAll('.feature-list')
            .forEach((ele) => observer.observe(ele));
    }, []);

    return (
        <Container>
            <h1>Sticky Scroll</h1>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                dolorem, perferendis numquam non molestias similique officia
                voluptatum aperiam et deserunt cupiditate, voluptate nesciunt
                dolor doloribus veniam ex minima dolore distinctio.
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                dolorem, perferendis numquam non molestias similique officia
                voluptatum aperiam et deserunt cupiditate, voluptate nesciunt
                dolor doloribus veniam ex minima dolore distinctio.
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                dolorem, perferendis numquam non molestias similique officia
                voluptatum aperiam et deserunt cupiditate, voluptate nesciunt
                dolor doloribus veniam ex minima dolore distinctio.
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                dolorem, perferendis numquam non molestias similique officia
                voluptatum aperiam et deserunt cupiditate, voluptate nesciunt
                dolor doloribus veniam ex minima dolore distinctio.
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                dolorem, perferendis numquam non molestias similique officia
                voluptatum aperiam et deserunt cupiditate, voluptate nesciunt
                dolor doloribus veniam ex minima dolore distinctio.
            </p>
            <section>
                <h2>Section One</h2>
                <div className="feature-content">
                    <div className="feature-stop image-placeholder" />
                    <div className="feature-list">
                        <h3>Feature One</h3>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Harum cumque modi tempora. Debitis dolore
                            fugit tempore aperiam similique? Repellat nihil
                            voluptate fugit sint ab doloremque neque alias
                            quidem soluta quia?
                        </p>
                    </div>
                    <div className="feature-list">
                        <h3>Feature Two</h3>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Harum cumque modi tempora. Debitis dolore
                            fugit tempore aperiam similique? Repellat nihil
                            voluptate fugit sint ab doloremque neque alias
                            quidem soluta quia?
                        </p>
                    </div>
                    <div className="feature-list">
                        <h3>Feature Three</h3>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Harum cumque modi tempora. Debitis dolore
                            fugit tempore aperiam similique? Repellat nihil
                            voluptate fugit sint ab doloremque neque alias
                            quidem soluta quia?
                        </p>
                    </div>
                </div>
            </section>
            <h2>Section Two</h2>
            <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis,
                quasi saepe, id rem atque sit odit laudantium rerum dicta
                asperiores eos! Suscipit, odio error. Temporibus, distinctio
                beatae. Sed, saepe vitae.
            </p>
            <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis,
                quasi saepe, id rem atque sit odit laudantium rerum dicta
                asperiores eos! Suscipit, odio error. Temporibus, distinctio
                beatae. Sed, saepe vitae.
            </p>
        </Container>
    );
};

export default Page;
