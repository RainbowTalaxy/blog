import { useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    #__docusaurus {
        width: 100%;
        height: 100%;
    }
`;

const Container = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    canvas {
        border: 1px solid #000;
    }
`;

// 我要通过 canvas 实现绘画
const Page = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const boundRef = useRef<DOMRect | null>(null);
    const prevPointRef = useRef<{ x: number; y: number } | null>(null);

    return (
        <Container>
            <GlobalStyle />
            <canvas
                ref={canvasRef}
                width="300"
                height="400"
                onTouchMove={(e) => {
                    e.preventDefault();
                    if (!canvasRef.current) return;
                    if (!ctxRef.current) {
                        ctxRef.current = canvasRef.current.getContext('2d');
                        ctxRef.current.fillStyle = '#000';
                    }
                    if (!boundRef.current) {
                        boundRef.current =
                            canvasRef.current.getBoundingClientRect();
                    }
                    const ctx = ctxRef.current;
                    const point = {
                        x: e.touches[0].clientX - boundRef.current.left,
                        y: e.touches[0].clientY - boundRef.current.top,
                    };
                    console.log(point);
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'red';
                    if (prevPointRef.current) {
                        ctx.moveTo(
                            prevPointRef.current.x,
                            prevPointRef.current.y,
                        );
                        ctx.lineTo(point.x, point.y);
                        ctx.stroke();
                    }
                    prevPointRef.current = point;
                }}
                onTouchEnd={(e) => {
                    prevPointRef.current = null;
                }}
                onTouchCancel={(e) => {
                    prevPointRef.current = null;
                }}
            ></canvas>
        </Container>
    );
};

export default Page;
