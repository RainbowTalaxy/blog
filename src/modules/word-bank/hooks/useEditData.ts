import { Book } from '@site/src/api/word-bank';
import { AppleDate, uuid } from '@site/src/utils';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

const useEditData = (book: Book) => {
    const [data, setData] = useState(book);

    const addEmptyWord = useCallback(() => {
        const newWord = {
            id: uuid(),
            date: AppleDate(),
            name: '',
            part: '',
            def: '',
        };
        setData({
            ...data,
            words: [...data.words, newWord],
        });
    }, [data]);

    const reset = useCallback(() => {
        setData(_.cloneDeep(book));
    }, [book]);

    useEffect(() => {
        setData(_.cloneDeep(book));
    }, [book]);

    return {
        editData: data,
        addEmptyWord,
        reset,
    };
};

export default useEditData;
