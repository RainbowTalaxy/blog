import { HTMLInputTypeAttribute, RefObject } from 'react';
import '@site/src/css/form.css';
import clsx from 'clsx';

interface Props {
    raf?: RefObject<HTMLInputElement>;
    className?: string;
    name?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    defaultValue?: string;
}

const Input = ({
    raf,
    className,
    name,
    placeholder,
    type,
    defaultValue,
}: Props) => {
    return (
        <input
            className={clsx('input', className)}
            ref={raf}
            type={type}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            autoComplete="off"
        />
    );
};

export default Input;
