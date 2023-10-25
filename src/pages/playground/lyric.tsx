import styles from './lyric.module.css';
import { useEffect } from 'react';

// yield a time(milliseconds), increase by 1000 then yield again
function* timeGenerator() {
    let time = 0;
    while (true) {
        yield time;
        time += 2000;
    }
}

const timeGen = timeGenerator();
let lastTime: number | void;

// generate a srt interval, which start and end are get by timeGenerator
function* srtGenerator() {
    while (true) {
        const start = lastTime ?? timeGen.next().value;
        const end = timeGen.next().value;
        lastTime = end;
        // yield in srt range format
        yield `${start} --> ${end}`;
    }
}

const LYRIC_DATA = Array(40)
    .fill(null)
    .map((_, index) => {
        const srt = srtGenerator().next().value;
        return {
            id: index,
            text: `This is lyric ${srt}`,
            srt,
        };
    });

const UPDATE_INTERVAL = 100;

const Page = () => {
    // start a timer when page loaded, and add 'hint' when lyric item is in range
    useEffect(() => {
        let currentTime = 0;
        let currentHintId: number;
        const lyricItems = document.querySelectorAll(
            `.${styles.lyricItem}`,
        ) as NodeListOf<HTMLDivElement>;
        const timer = setInterval(() => {
            // check LYRIC_DATA, if lyric is in range, add 'hint' class
            const result = LYRIC_DATA.find((lyric) => {
                const { id, srt } = lyric;
                const [start, end] = (srt as string).split(' --> ');
                if (
                    currentTime >= Number(start) &&
                    currentTime <= Number(end)
                ) {
                    if (id !== currentHintId) {
                        const lyricItem = lyricItems[id];
                        lyricItem.classList.add(styles.hint);
                        // scroll to hint item
                        window.scrollTo({
                            top: lyricItem.offsetTop - 150,
                            behavior: 'smooth',
                        });
                        // remove 'hint' class from last hint item
                        if (currentHintId !== undefined) {
                            lyricItems[currentHintId].classList.remove(
                                styles.hint,
                            );
                        }
                        currentHintId = id;
                    }
                    return true;
                }
            });
            currentTime += UPDATE_INTERVAL;
            // if result is falsy, stop timer
            if (!result) {
                clearInterval(timer);
            }
        }, UPDATE_INTERVAL);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={styles.box}>
            {/* list lyrics */}
            <div className={styles.lyricList}>
                {LYRIC_DATA.map((lyric) => (
                    <div
                        key={lyric.id}
                        className={styles.lyricItem}
                        data-id={lyric.id}
                    >
                        {lyric.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
