import { HTMLInputTypeAttribute, RefObject } from 'react';
import '@site/src/css/form.css';
import clsx from 'clsx';

interface Props {
    raf?: RefObject<HTMLInputElement>;
    id?: string;
    className?: string;
    name?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
    raf,
    id,
    className,
    name,
    placeholder,
    type,
    defaultValue,
    onChange,
}: Props) => {
    return (
        <input
            id={id}
            className={clsx('input', className)}
            ref={raf}
            type={type}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            spellCheck={false}
            autoComplete="off"
            onChange={onChange}
        />
    );
};

export default Input;
