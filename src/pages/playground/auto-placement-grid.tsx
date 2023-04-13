import styled from 'styled-components';

const Container = styled.div`
    margin: 20px auto;
    width: 400px;
    background-color: #f2f2f2;
`;

const Grid = styled.div`
    display: grid;
    grid-auto-flow: column;

    > * {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
    }

    .header {
        grid-column-start: 1;
        background-color: var(--theme-color-red);
    }

    .col {
        background-color: var(--theme-color-yellow);
    }
`;

const DATA = [
    Array(5).fill('Row 3'),
    Array(2).fill('Row 3'),
    Array(3).fill('Row 3'),
];

const Page = () => {
    const row3Length = Math.max(...DATA.map((row) => row.length));
    return (
        <Container>
            <Grid>
                <div className="header">Item</div>
                <div className="header">Item</div>
                <div
                    className="header"
                    style={{
                        gridRowStart: 3,
                        gridRowEnd: 3 + row3Length,
                    }}
                >
                    Item
                </div>
                {DATA.map((data, column) => (
                    <>
                        <div
                            className="col"
                            style={{ gridColumnStart: column + 2 }}
                        >
                            Row 1
                        </div>
                        <div
                            className="col"
                            style={{ gridColumnStart: column + 2 }}
                        >
                            Row 2
                        </div>
                        {data.map((item, row) => (
                            <div
                                className="col"
                                style={{ gridRowStart: row + 3 }}
                            >
                                {item}
                            </div>
                        ))}
                    </>
                ))}
            </Grid>
        </Container>
    );
};

export default Page;
