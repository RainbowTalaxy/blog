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

export function isBetween(start: number, end: number) {
    const today = dayjs();
    const startDay = dayjs(start);
    const endDay = dayjs(end).add(-1, 'day');
    const isAfterStart =
        today.isAfter(startDay, 'day') || today.isSame(startDay, 'day');
    const isBeforeEnd =
        today.isBefore(endDay, 'day') || today.isSame(endDay, 'day');
    return isAfterStart && isBeforeEnd;
}

export function uuid() {
    return uuidV4();
}

// 表单日期转为 number
export function time(form: string) {
    return dayjs(form).valueOf();
}

// 今日时间（表单用）
export function formDate(date?: number) {
    return dayjs(date).format('YYYY-MM-DD');
}

export function clone(data: any) {
    return JSON.parse(JSON.stringify(data));
}

export function queryString(query: any) {
    const queryStr = Object.keys(query)
        .filter((key) => query[key] !== undefined && query[key] !== null)
        .map((key) => `${key}=${query[key]}`)
        .join('&');
    return queryStr ? `?${queryStr}` : '';
}
