import React from 'react';
import '@site/src/css/tailwind.css';
import {
    icon,
    data,
    imageURL,
} from '@site/src/constant/tailwind-demo-constant';

const View = () => {
    return (
        <div className="p-5 bg-[#000]">
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
                        <div className="grow font-bold">{section.title}</div>
                        <div className="w-[18px] aspect-square">
                            {icon(section.done ? '#28d3b0' : '#eee')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default View;
