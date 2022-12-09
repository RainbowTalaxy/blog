import { MixBlendMode, ThemeColor } from '@site/src/constants/css';
import clsx from 'clsx';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 30px;
    flex: 1;

    .select-bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        padding: 8px 10px;
        border-radius: 6px;
        background-color: var(--theme-color-gray);

        span {
            padding: 2px 8px;
            border-radius: 5px;
            background-color: transparent;
            cursor: pointer;
        }

        span.active,
        span:hover {
            background-color: var(--theme-white);
        }
    }

    > div {
        margin-bottom: 16px;
    }

    .box {
        width: 200px;
        height: 200px;
    }

    .parent {
        position: relative;
        margin: 50px auto;
        transform: translateX(-50px);
    }

    .child {
        position: absolute;
        top: 100px;
        left: 100px;
    }
`;

const modes = Object.values(MixBlendMode);
const colors = Object.values(ThemeColor);

const Page = () => {
    const [activeMode, setMode] = useState<MixBlendMode>(MixBlendMode.Multiply);
    const [color1, setColor1] = useState<ThemeColor>(ThemeColor.Red);
    const [color2, setColor2] = useState<ThemeColor>(ThemeColor.Yellow);

    return (
        <Container>
            <h1>mix-blend-mode</h1>
            <div className="select-bar">
                {modes.map((mode) => (
                    <span
                        key={mode}
                        className={clsx(activeMode === mode && 'active')}
                        onClick={() => setMode(mode)}
                    >
                        {mode}
                    </span>
                ))}
            </div>
            <h3>Parent color</h3>
            <div className="select-bar">
                {colors.map((color) => (
                    <span
                        key={color}
                        className={clsx(color1 === color && 'active')}
                        onClick={() => setColor1(color)}
                    >
                        {color}
                    </span>
                ))}
            </div>
            <h3>Child Color</h3>
            <div className="select-bar">
                {colors.map((color) => (
                    <span
                        key={color}
                        className={clsx(color2 === color && 'active')}
                        onClick={() => setColor2(color)}
                    >
                        {color}
                    </span>
                ))}
            </div>
            <div
                className="box parent"
                style={{ backgroundColor: `var(--theme-color-${color1})` }}
            >
                <div
                    className="box child"
                    style={{
                        backgroundColor: `var(--theme-color-${color2})`,
                        mixBlendMode: activeMode,
                    }}
                ></div>
            </div>
        </Container>
    );
};

export default Page;
