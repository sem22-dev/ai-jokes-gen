import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return(
    <Link href={'/'} className=" flex items-center gap-2">
        <Image src={'/LOGO.svg'} width={1000} height={1000} alt="logo" className="w-8 h-8"/>
        <h1 className="text-4xl font-foggyR">AIJOKE</h1>
    </Link>     
    )
}