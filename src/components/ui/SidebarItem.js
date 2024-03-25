import Link from "next/link"


const SidebarItem = ({icon : Icon,label, active, href})=>{
    return (
        <div className="w-full">
            <Link href={href} className={`flex h-auto items-center w-full gap-x-4 ${active? 'text-blue-800':'text-white'} ${active && 'bg-white'} text-md cursor-pointer px-12 py-2`}>
                <Icon size={26} />
                <p className="w-full truncate">{label}</p>
            </Link>
        </div>
    )
}


export default SidebarItem