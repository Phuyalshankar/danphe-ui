export const DanpheIcon = ({ name, size = 20, className = "" }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24">
        <use href={`/danphe-ui/danphe-icons.svg#icon-${name}`} />
    </svg>
);
export default DanpheIcon;
