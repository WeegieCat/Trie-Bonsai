"use client";

export function Footer() {
    return (
        <footer className='w-full py-8 border-t border-gray-700 text-center text-gray-400 bg-gray-900'>
            <div className='max-w-7xl mx-auto px-6'>
                <p className='text-sm'> built by feynman</p>
                <div className='mt-4 flex justify-center gap-6 text-xs'>
                    <a
                        href='https://mastodon.compositecomputer.club/@FEYNMAN1729'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-white transition-colors'>
                        Mastodon
                    </a>
                    <a
                        href='https://github.com/WeegieCat'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-white transition-colors'>
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
