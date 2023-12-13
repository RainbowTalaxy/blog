import '@site/src/css/form.css';
import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

interface Props {
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

const ButtonGroup = ({ className, children, style }: Props) => {
    return (
        <div className={clsx('btn-group', className)} style={style}>
            {children}
        </div>
    );
};

export default ButtonGroup;
