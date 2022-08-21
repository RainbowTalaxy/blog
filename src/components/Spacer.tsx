interface Props {
    className?: string;
}

const Spacer = ({ className }: Props) => {
    return <div className={className} style={{ flex: '1 1 auto' }} />;
};

export default Spacer;
