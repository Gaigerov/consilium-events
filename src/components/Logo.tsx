import {ImageWithFallback} from "./ImageWithFallback";

interface LogoProps {
    className?: string;
    onClick?: () => void;
}

export default function Logo({className = "", onClick}: LogoProps) {
    return (
        <div
            className={`flex items-center space-x-2 cursor-pointer ${className}`}
            onClick={onClick}
        >
            <ImageWithFallback
                src="/consiliumlogo.png"
                alt="Консилиум"
                className="h-10 sm:h-18 w-auto object-contain"
            />
        </div>
    );
}
