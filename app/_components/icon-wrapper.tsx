export default function Icon({ icon, size = '24px' }: {icon: string; size?: string;}) {
    return (     
        <span className="material-symbols-rounded" style={{ fontSize: size }}>
            {icon}
        </span>
    )
}