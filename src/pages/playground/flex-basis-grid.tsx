import { CSSProperties, useState } from 'react';
import styled from 'styled-components';

const COLUMNS = 12;

const Container = styled.div`
    flex: 1;
    padding: 30px;
    background-color: var(--theme-color-cyan);
    color: black;
    user-select: none;

    .add-bar {
        display: flex;
        flex-wrap: wrap;
        margin: 16px 0;
        border-radius: 10px;
    }

    .option {
        margin-right: 10px;
        padding: 0 10px;
        border-radius: 10px;
        background-color: #fff;
        cursor: pointer;
    }

    .layout {
        --columns: ${COLUMNS};
        display: flex;
        flex-wrap: wrap;
        padding: 5px;
        min-height: calc(5rem + 10px);
        border-radius: 10px;
        background-color: #fff;
    }

    .column {
        flex-basis: calc(var(--column) / var(--columns) * 100%);
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 5rem;
        border-radius: 10px;
        border: 5px solid #fff;
        background-color: var(--theme-color-red);
        cursor: pointer;
    }

    .item:hover {
        opacity: 0.7;
    }

    .item:hover::after {
        content: '删除';
        color: #ff0000;
        font-weight: bold;
    }
`;

const Page = () => {
    const [columns, setColumns] = useState([3, 3, 3, 3, 4, 4, 4, 6, 6, 12]);

    return (
        <Container>
            <h1>用 flex-basis 做栅格</h1>
            <div className="add-bar">
                增加格子：
                {Array(COLUMNS)
                    .fill(null)
                    .map((_, col) => (
                        <div
                            key={col}
                            className="option"
                            onClick={() =>
                                setColumns((prev) => {
                                    const newColumns = prev.slice();
                                    newColumns.push(col + 1);
                                    return newColumns;
                                })
                            }
                        >
                            {col + 1}
                        </div>
                    ))}
            </div>
            <div className="layout">
                {columns.map((col, idx) => (
                    <div
                        key={idx}
                        className="column item"
                        style={{ '--column': col } as CSSProperties}
                        onClick={() =>
                            setColumns((prev) => {
                                const newColumns = prev.slice();
                                newColumns.splice(idx, 1);
                                return newColumns;
                            })
                        }
                    />
                ))}
            </div>
        </Container>
    );
};

export default Page;
