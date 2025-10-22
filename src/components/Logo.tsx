import {ImageWithFallback} from "./ImageWithFallback";

interface LogoProps {
    className?: string;
    onClick?: () => void;
}


export default function Logo({className = "", onClick}: LogoProps) {

const logoPath = "/consilium-events/consiliumlogo.png";

    return (
        <div
            className={`flex items-center space-x-2 cursor-pointer ${className}`}
            onClick={onClick}
        >
            <ImageWithFallback
                src={logoPath}
                alt="Консилиум"
                className="h-6 sm:h-8 w-auto object-contain"
                fallbackSrc="/consiliumlogo.png" 
            />
        </div>
    );
}
