import { ReactNode, RefObject } from 'react';
import '@site/src/css/form.css';

interface Props {
    raf?: RefObject<HTMLSelectElement>;
    options?: Array<{
        value: string;
        label: string;
    }>;
    children: ReactNode;
}

const Select = ({ raf, options, children }: Props) => {
    return (
        <select className="select" ref={raf}>
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
