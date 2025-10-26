import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog";
import {ImageWithFallback} from "./ImageWithFallback";

interface Photo {
    id: string;
    src: string;
    alt: string;
    title?: string;
}

interface PhotoGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    photos: Photo[];
    currentPhotoIndex: number;
    onPhotoChange: (index: number) => void;
}

export default function PhotoGalleryModal({
    isOpen,
    onClose,
    photos,
    currentPhotoIndex,
    onPhotoChange
}: PhotoGalleryModalProps) {
    const currentPhoto = photos[currentPhotoIndex];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-white text-center">
                        {currentPhoto?.title || `Фото ${currentPhotoIndex + 1} из ${photos.length}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 p-6 pt-0">
                    {/* Основное изображение */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                        <ImageWithFallback
                            src={currentPhoto?.src}
                            alt={currentPhoto?.alt}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Навигация */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => onPhotoChange(currentPhotoIndex - 1)}
                            disabled={currentPhotoIndex === 0}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors"
                        >
                            Назад
                        </button>

                        <span className="text-white/70">
                            {currentPhotoIndex + 1} / {photos.length}
                        </span>

                        <button
                            onClick={() => onPhotoChange(currentPhotoIndex + 1)}
                            disabled={currentPhotoIndex === photos.length - 1}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors"
                        >
                            Вперед
                        </button>
                    </div>

                    {/* Миниатюры */}
                    {photos.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {photos.map((photo, index) => (
                                <button
                                    key={photo.id}
                                    onClick={() => onPhotoChange(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentPhotoIndex
                                            ? 'border-primary scale-105'
                                            : 'border-transparent hover:border-white/50'
                                        }`}
                                >
                                    <ImageWithFallback
                                        src={photo.src}
                                        alt={photo.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
