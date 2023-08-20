import {useState} from 'react';

const usePagination = (initialCurrent = 1, initialSize = 10) => {
    const [current, setCurrent] = useState(initialCurrent);
    const [size, setSize] = useState(initialSize);

    const changePage = (newPage: number) => {
        setCurrent(newPage);
    };

    const changeSize = (newSize: number) => {
        setSize(newSize);
        setCurrent(1);
    };

    return {
        current,
        size,
        changePage,
        changeSize
    };
};

export default usePagination;