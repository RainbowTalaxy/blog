import '@site/src/css/form.css';
import { CSSProperties, HTMLInputTypeAttribute, RefObject } from 'react';
import clsx from 'clsx';

interface Props {
    raf?: RefObject<HTMLInputElement>;
    id?: string;
    className?: string;
    style?: CSSProperties;
    name?: string;
    value?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
    raf,
    id,
    className,
    style,
    name,
    value,
    placeholder,
    type,
    defaultValue,
    onChange,
}: Props) => {
    return (
        <input
            id={id}
            className={clsx('input', className)}
            style={style}
            ref={raf}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            defaultValue={defaultValue}
            spellCheck={false}
            autoComplete="off"
            onChange={onChange}
        />
    );
};

export default Input;
