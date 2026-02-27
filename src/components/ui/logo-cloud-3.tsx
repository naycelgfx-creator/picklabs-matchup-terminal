import { InfiniteSlider } from './infinite-slider';
import { cn } from '../../lib/utils';

type Logo = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

type LogoCloudProps = React.ComponentProps<'div'> & {
    logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
    return (
        <div
            {...props}
            className={cn(
                'overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
                className
            )}
        >
            <InfiniteSlider gap={48} reverse speed={60} speedOnHover={20}>
                {logos.map((logo) => (
                    <div
                        key={`logo-${logo.alt}`}
                        className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default hover:drop-shadow-[0_0_15px_rgba(13,242,13,0.4)] min-w-max"
                    >
                        <img
                            alt={logo.alt}
                            className="pointer-events-none h-6 md:h-7 select-none object-contain"
                            height={logo.height ?? 'auto'}
                            loading="lazy"
                            src={logo.src}
                            width={logo.width ?? 'auto'}
                        />
                    </div>
                ))}
            </InfiniteSlider>
        </div>
    );
}
