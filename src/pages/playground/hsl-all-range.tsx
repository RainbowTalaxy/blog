import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;

    .option {
        display: flex;
        margin-bottom: 16px;
    }

    .row-box {
        display: flex;
        flex-wrap: nowrap;
    }

    .square {
        flex-grow: 1;
        width: 24px;
        height: 24px;
        border-radius: 3px;
        border: 1px solid var(--theme-color-white);
        cursor: pointer;
        transition: all 0.05s;
    }

    .square.regular {
        border: 2px solid var(--theme-color-black);
        margin-right: 4px;
    }

    .square:hover {
        transform: scale(1.5);
    }
`;

const HUE_CHUNK = 30;
const LIGHTNESS_CHUNK = 20;

const Page = () => {
    const [hueChunk, setHueChunk] = useState(0);
    const [lightnessChunk, setLightnessChunk] = useState(2);

    return (
        <Container>
            <h1>HSL 色表</h1>
            <div className="option">
                <span>色相区域：</span>
                {Array(360 / HUE_CHUNK)
                    .fill(null)
                    .map((_, chunk) => (
                        <div
                            key={chunk}
                            className="square regular"
                            style={{
                                background: `linear-gradient(to right, hsl(${
                                    chunk * HUE_CHUNK
                                }, 100%, 50%), hsl(${
                                    (chunk + 1) * HUE_CHUNK
                                }, 100%, 50%))`,
                            }}
                            onClick={() => setHueChunk(chunk)}
                        />
                    ))}
            </div>
            <div className="option">
                <span>亮度区域：</span>
                {Array(100 / LIGHTNESS_CHUNK)
                    .fill(null)
                    .map((_, chunk) => (
                        <div
                            key={chunk}
                            className="square regular"
                            style={{
                                background: `linear-gradient(to right, hsl(0, 0%, ${
                                    chunk * LIGHTNESS_CHUNK
                                }%), hsl(0, 0%, ${
                                    (chunk + 1) * LIGHTNESS_CHUNK
                                }%))`,
                            }}
                            onClick={() => setLightnessChunk(chunk)}
                        />
                    ))}
            </div>
            <div className="grid-box">
                {Array(HUE_CHUNK)
                    .fill(null)
                    .map((_, h) => (
                        <div key={h} className="row-box">
                            {Array(LIGHTNESS_CHUNK + 1)
                                .fill(null)
                                .map((_, l) => (
                                    <div
                                        key={l}
                                        className="square"
                                        style={{
                                            backgroundColor: `hsl(${
                                                h + hueChunk * HUE_CHUNK
                                            }, 50%, ${
                                                l +
                                                lightnessChunk * LIGHTNESS_CHUNK
                                            }%)`,
                                        }}
                                    ></div>
                                ))}
                        </div>
                    ))}
            </div>
        </Container>
    );
};

export default Page;
