import { useEffect, useRef } from 'react';
import styled from 'styled-components';

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
    const isDrawingRef = useRef(false);

    return (
        <Container>
            <canvas
                ref={canvasRef}
                width="500"
                height="500"
                onMouseDown={(e) => {
                    isDrawingRef.current = true;
                }}
                onMouseMove={(e) => {
                    if (!isDrawingRef.current) return;
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
                        x: e.clientX - boundRef.current.left,
                        y: e.clientY - boundRef.current.top,
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
                onMouseUp={(e) => {
                    isDrawingRef.current = false;
                    prevPointRef.current = null;
                }}
                onMouseLeave={(e) => {
                    isDrawingRef.current = false;
                    prevPointRef.current = null;
                }}
            ></canvas>
        </Container>
    );
};

export default Page;
