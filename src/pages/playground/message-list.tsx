import clsx from 'clsx';
import { debounce, update } from 'lodash';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    #__docusaurus {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }
`;

const Container = styled.div`
    height: 100%;
    overflow: hidden;

    .app-window {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: white;
        overflow: hidden;
    }

    .message-view {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px 10px;
        width: 100%;
        border-radius: 4px;
        background-color: white;
        overflow: auto;
    }

    .hide-scrollbar {
        scrollbar-width: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .command-view {
        flex: 0 0;
        display: flex;
        padding: 10px 20px;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
    }

    .command-view > * + * {
        margin-left: 20px;
    }

    .message-input {
        flex: 1;
        padding: 0 10px;
        border: none;
        outline: none;
        border-radius: 4px;
        font-size: 16px;
        background-color: var(--theme-color-yellow);
    }

    .command-view > button {
        padding: 7px 16px;
        border: none;
        outline: none;
        border-radius: 16px;
        font-size: 16px;
        background-color: var(--theme-color-orange);
        cursor: pointer;
    }

    .message-bubble {
        margin: 8px;
        padding: 5px 12px;
        max-width: 80%;
        border-radius: 6px;
        background-color: var(--theme-color-blue);
    }

    .right-bubble {
        align-self: flex-end;
        background-color: var(--theme-color-cyan);
    }

    .message-more {
        align-self: center;
        font-size: 12px;
        cursor: pointer;
    }
`;

enum Role {
    Sender,
    Receiver,
}

enum UpdateType {
    ShowPrevious,
    NewRecord,
}

const OLD_MESSAGES = [
    {
        role: Role.Receiver,
        message: 'Old Hello World',
    },
    {
        role: Role.Sender,
        message: 'Old Hello World',
    },
];

const INIT_RECORDS = Array(2)
    .fill(null)
    .map((_, idx) => {
        return {
            role: idx % 2 === 1 ? Role.Receiver : Role.Sender,
            message: 'Hello World',
        };
    });

function getScrollBottom(element: HTMLDivElement) {
    return element.scrollHeight - element.scrollTop - element.offsetHeight;
}

const Page = () => {
    const [records, setRecords] = useState(INIT_RECORDS);
    const [attachBottom, setAttachBottom] = useState(true);
    const [text, setText] = useState('');
    const page = useRef<{
        updateType?: UpdateType;
        lastScrollHeight?: number;
        lastScrollBottom?: number;
        scrollView?: HTMLDivElement;
    }>({});

    useLayoutEffect(() => {
        const { scrollView, updateType, lastScrollHeight } = page.current;
        if (!scrollView) return;
        if (attachBottom) {
            scrollView.scrollTo({
                top: scrollView.scrollHeight,
                behavior: 'smooth',
            });
        } else {
            switch (updateType) {
                case UpdateType.ShowPrevious:
                    console.log('[Calc scroll]');
                    scrollView.scrollTop +=
                        scrollView.scrollHeight - lastScrollHeight;
            }
            page.current.updateType = undefined;
        }
    }, [records, attachBottom]);

    useEffect(() => {
        const scrollView = document.querySelector(
            '.message-view',
        ) as HTMLDivElement;
        page.current.scrollView = scrollView;
        if (!scrollView) return;
        scrollView.scrollTo({
            top: scrollView.scrollHeight,
        });
        const cb = debounce(() => {
            console.log('[mousewheel/touchmove event]');
            if (
                scrollView.scrollHeight <=
                scrollView.scrollTop + scrollView.offsetHeight + 50
            ) {
                setAttachBottom(true);
            } else {
                setAttachBottom(false);
            }
        }, 100);
        const eventTypes = ['mousewheel', 'touchmove'];
        eventTypes.forEach((type) => {
            scrollView.addEventListener(type, cb);
        });
        return () =>
            eventTypes.forEach((type) =>
                scrollView.removeEventListener(type, cb),
            );
    }, []);

    console.log('[Render]');

    return (
        <>
            <GlobalStyle />
            <Container>
                <div className="app-window">
                    <div className="message-view">
                        <div
                            className="message-more"
                            onClick={() => {
                                const { scrollView } = page.current;
                                page.current.updateType =
                                    UpdateType.ShowPrevious;
                                page.current.lastScrollHeight =
                                    scrollView.scrollHeight;
                                page.current.lastScrollBottom =
                                    getScrollBottom(scrollView);
                                setAttachBottom(false);
                                setRecords((prev) => OLD_MESSAGES.concat(prev));
                            }}
                        >
                            Show more previous messages
                        </div>
                        {records.map((record, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    'message-bubble',
                                    record.role === Role.Sender &&
                                        'right-bubble',
                                )}
                            >
                                {record.message}
                            </div>
                        ))}
                    </div>
                    <div className="command-view">
                        <input
                            className="message-input"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                if (!text.trim()) return;
                                setAttachBottom(true);
                                setRecords((prev) =>
                                    prev.concat({
                                        role: Role.Sender,
                                        message: text,
                                    }),
                                );
                                setTimeout(() => {
                                    setRecords((prev) =>
                                        prev.concat({
                                            role: Role.Receiver,
                                            message: text,
                                        }),
                                    );
                                }, 2000);
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default Page;
