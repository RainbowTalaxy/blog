import styled from 'styled-components';

const Container = styled.div`
    flex: 1;
    display: grid;
    align-items: center;
    justify-items: center;
    background-color: var(--theme-color-blue);

    @keyframes slide {
        0% {
            transform: translateX(0%);
            z-index: 2;
        }
        16.66% {
            transform: translateX(120%);
            z-index: 2;
        }
        16.67% {
            transform: translateX(120%);
            z-index: 1;
        }
        33.34% {
            transform: translateX(0%);
            z-index: 1;
        }
        66.33% {
            transform: translateX(0%);
            z-index: 1;
        }
        66.34% {
            transform: translateX(0%);
            z-index: 2;
        }
        100% {
            transform: translateX(0%);
            z-index: 2;
        }
    }

    @keyframes slide-last {
        0% {
            transform: translateX(0%);
            z-index: 2;
        }
        16.66% {
            transform: translateX(120%);
            z-index: 2;
        }
        16.67% {
            transform: translateX(120%);
            z-index: 1;
        }
        33.34% {
            transform: translateX(0%);
            z-index: 1;
        }
        83.33% {
            transform: translateX(0%);
            z-index: 1;
        }
        83.34% {
            transform: translateX(0%);
            z-index: 2;
        }
        100% {
            transform: translateX(0%);
            z-index: 2;
        }
    }

    .gallery {
        display: grid;
    }

    .card-item {
        grid-area: 1 / 1;
        width: 200px;
        height: 200px;
        background-color: var(--theme-color-red);
        border: 10px solid #f2f2f2;
        box-shadow: 0 0 4px #0002;
        animation: slide 8s infinite;
    }

    .card-item:nth-of-type(2) {
        background-color: var(--theme-color-orange);
        animation-delay: -2s;
    }
    .card-item:nth-of-type(3) {
        background-color: var(--theme-color-yellow);
        animation-delay: -4s;
    }
    .card-item:nth-of-type(4) {
        background-color: var(--theme-color-green);
        animation-delay: -6s;
        animation-name: slide-last;
    }
`;

const Page = () => {
    return (
        <Container>
            <div className="gallery">
                <div className="card-item" />
                <div className="card-item" />
                <div className="card-item" />
                <div className="card-item" />
            </div>
        </Container>
    );
};

export default Page;
