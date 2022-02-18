import React from 'react';

export const imageURL =
    'https://media-image1.baydn.com/storage_media_image/sfuvih/5f5e2292b80ddbcf6af3a6930abbf9b4.9596d333b69c1a1d9550fde7e2faec9a.png';

export const data = [
    { title: '教育观1/3-素质教育基本内涵', done: true },
    { title: '教育观2/3-新课改目标', done: false },
];

export const icon = (color: string = '#eee') => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
        >
            <g fill="none" fillRule="evenodd">
                <g>
                    <g transform="translate(-322 -285) translate(322 285)">
                        <circle cx="9" cy="9" r="9" fill={color} />
                        <path
                            stroke="#FFF"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.846 9.692L8.308 13.119 14.538 6.231"
                        />
                    </g>
                </g>
            </g>
        </svg>
    );
};
