"use client";

export function Footer() {
    return (
        <footer className='w-full py-8 border-t border-gray-700 text-center text-gray-400 bg-gray-900'>
            <div className='max-w-7xl mx-auto px-6'>
                <p className='text-sm'>
                    © 2026 String Bonsai - Make something beautiful with words
                </p>
                <div className='mt-4 flex justify-center gap-6 text-xs'>
                    <a href='#' className='hover:text-white transition'>
                        プライバシーポリシー
                    </a>
                    <a href='#' className='hover:text-white transition'>
                        利用規約
                    </a>
                    <a href='#' className='hover:text-white transition'>
                        お問い合わせ
                    </a>
                </div>
            </div>
        </footer>
    );
}
