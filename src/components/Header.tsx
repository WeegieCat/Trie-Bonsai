"use client";

import Link from "next/link";

export function Header() {
    return (
        <header className='w-full bg-black text-white border-b border-gray-800'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
                <Link
                    href='/'
                    className='flex items-center gap-2 hover:opacity-80 transition'>
                    <span className='text-2xl font-bold'>🌿 String Bonsai</span>
                </Link>

                <nav className='flex items-center gap-6'>
                    <Link
                        href='/creating'
                        className='text-gray-300 hover:text-white transition'>
                        作成
                    </Link>
                    <Link
                        href='/#gallery'
                        className='text-gray-300 hover:text-white transition'>
                        ギャラリー
                    </Link>
                </nav>
            </div>
        </header>
    );
}
