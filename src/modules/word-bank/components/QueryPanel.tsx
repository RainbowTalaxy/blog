/**
 * 写一个查词框，它有这些细节：
 * 1. 查词框在视窗的右下角浮动显示。
 * 2. 暴露一个方法 query，可以接受一个字符串参数，表示要查询的单词。
 * 3. 查词框使用 createPortal 方法挂载到 body 的一个 div 上。
 * 4. 查词框后面有一个透明的蒙层，点击蒙层可以关闭查词框，但是蒙层不会阻止事件冒泡。
 */

import { query } from 'express';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { YouDaoResponse } from '../type';
import './QueryPanel.css';

const QUERY_CONTAINER_CLASSNAME = 'query-container';

interface Props {
    word: string;
}

const QueryPanel = ({ word }: Props) => {
    const [dictInfo, setDictInfo] = useState<YouDaoResponse>();

    useEffect(() => {
        console.log(word);
        fetch(`https://blog.talaxy.cn/public-api/dictionary?word=${word}`)
            .then((res) => res.json())
            .then(setDictInfo)
            .catch(console.error);
    }, [word]);

    return (
        <div
            className="query-panel-container"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div className="query-panel">
                <div className="query-panel-term">
                    {dictInfo?.query ?? word}
                </div>
                {dictInfo?.basic && (
                    <>
                        <div className="query-pabel-phonetic">
                            {dictInfo.basic['us-phonetic'] && (
                                <>
                                    <span>美</span>/
                                    {dictInfo.basic['us-phonetic']}/
                                    <span />
                                </>
                            )}
                            {dictInfo.basic['uk-phonetic'] && (
                                <>
                                    <span>英</span>/
                                    {dictInfo.basic['uk-phonetic']}/
                                </>
                            )}
                        </div>
                        <div className="query-panel-explains">
                            {dictInfo.basic.explains.map((explain) => {
                                // 分离出词性
                                const parts = explain
                                    .split('.', 2)
                                    .map((p) => p.trim());
                                let partOfSpeech = parts[0] + '.';
                                let rest = parts[1];
                                if (parts.length === 1) {
                                    partOfSpeech = '';
                                    rest = parts[0];
                                }
                                return (
                                    <div
                                        key={explain}
                                        className="query-panel-single-explain"
                                    >
                                        {partOfSpeech && (
                                            <span>{partOfSpeech}</span>
                                        )}
                                        {rest}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// 获取容器元素，如果不存在则创建
function getContainer() {
    let container = document.querySelector(`.${QUERY_CONTAINER_CLASSNAME}`);
    if (!container) {
        container = document.createElement('div');
        container.className = QUERY_CONTAINER_CLASSNAME;
        document.body.appendChild(container);
        // 监听 body 的点击或滚动事件，如果发生了，就关闭查词框
        document.body.addEventListener('click', QueryPanel.close);
        document.body.addEventListener('scroll', QueryPanel.close);
    }
    return container;
}

// 唤起查词框
QueryPanel.lookup = (word: string) => {
    const container = getContainer();
    // 在 container 上挂载 QueryPanel 组件
    ReactDOM.render(<QueryPanel word={word} />, container);
};

// 关闭查词框
QueryPanel.close = () => {
    const container = getContainer();
    ReactDOM.unmountComponentAtNode(container);
};

export default QueryPanel;
