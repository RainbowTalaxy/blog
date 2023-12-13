import '@site/src/css/form.css';
import { ReactNode, RefObject } from 'react';
import clsx from 'clsx';

interface Props {
    className?: string;
    raf?: RefObject<HTMLSelectElement>;
    options?: Array<{
        value: string;
        label: string;
    }>;
    children?: ReactNode;
    defaultValue?: string;
    onSelect: (value: string) => void;
}

const Select = ({
    raf,
    className,
    options,
    children,
    defaultValue,
    onSelect,
}: Props) => {
    return (
        <select
            className={clsx('select', className)}
            ref={raf}
            defaultValue={defaultValue}
            onChange={(e) => onSelect(e.target.value)}
        >
            {options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
            {children}
        </select>
    );
};

export default Select;
