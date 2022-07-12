const imageURL =
    'https://media-image1.baydn.com/storage_media_image/sfuvih/5f5e2292b80ddbcf6af3a6930abbf9b4.9596d333b69c1a1d9550fde7e2faec9a.png';

const data = [
    { title: '任务一', done: true },
    { title: '任务二', done: false },
];

const icon = (color = '#eee') => {
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

const TailwindDemo = () => {
    return (
        <div className="p-5 bg-black">
            <div className="flex flex-col m-[15px] w-[340px] rounded-[12px] bg-[#fff] divide-[#ececec] divide-y-[1px]">
                {data.map((section) => (
                    <div
                        className="flex items-center p-[20px] pr-[15px]"
                        key={section.title}
                    >
                        <img
                            className="w-[30px] aspect-square mr-[10px]"
                            src={imageURL}
                        />
                        <div className="grow [font-weight:bold]">
                            {section.title}
                        </div>
                        <div className="w-[18px] aspect-square">
                            {icon(section.done ? '#28d3b0' : '#eee')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TailwindDemo;
