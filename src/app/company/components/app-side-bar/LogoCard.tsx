import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LogoCard = () => {
    return (
        <div className="flex justify-between items-center gap-2">
            <Link href="/">
               <Image
                         src="/images/logo.svg"
                         alt="Logo"
                         width={109}
                         height={54}
                    />
            </Link>
        </div>
    );
}

export default LogoCard;
