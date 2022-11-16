import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import '../../styles/setting/index.css';
import '../../styles/setting/toggle.css';
import SVG from '../SVG';
import 'swiper/css';
import { useRef } from 'react';

type OptionValue = string | boolean | number;

interface Props<Value extends OptionValue> {
    label: string;
    value: Value;
    options: {
        name: string;
        value: Value;
    }[];
    onChange: (value: Value) => void;
}

const Toggle = function <Value extends OptionValue>({
    options,
    value,
    onChange,
    label,
}: Props<Value>) {
    const swiperRef = useRef<SwiperCore>();

    return (
        <div className="ow-setting-box">
            <div className="ow-setting-label ow-setting-v ow-setting-h">
                {label}
            </div>
            <div className="ow-setting-toggle-box">
                <Swiper
                    className="ow-setting-toggle-ul"
                    onInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    initialSlide={options.findIndex(
                        (option) => option.value === value,
                    )}
                    onSlideChange={(core) =>
                        onChange(options[core.realIndex].value)
                    }
                    loop
                    loopAdditionalSlides={1}
                >
                    {options.map((o) => (
                        <SwiperSlide
                            key={o.name}
                            className="ow-setting-toggle-li ow-setting-v"
                        >
                            {o.name}
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="ow-setting-toggle-tap">
                    <SVG.arrow.left
                        onClick={() => swiperRef.current.slidePrev()}
                    />
                    <div
                        className="ow-spacer-h"
                        onClick={() => swiperRef.current.slideNext()}
                    />
                    <SVG.arrow.right
                        onClick={() => swiperRef.current.slideNext()}
                    />
                </div>
            </div>
        </div>
    );
};

export default Toggle;
