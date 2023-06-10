import dayjs from 'dayjs';
import { v4 as uuidV4 } from 'uuid';

export function getCoordinates(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

export function convertToAppleDate(timestamp: number) {
    return dayjs(new Date((timestamp + 978307200) * 1000));
}

export function AppleDate() {
    return (Date.now() - 978307200000) / 1000;
}

export function uuid() {
    return uuidV4();
}
