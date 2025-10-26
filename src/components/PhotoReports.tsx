import {useState, useRef, TouchEvent, useEffect} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogTitle} from "./ui/dialog";
import {Camera, Calendar, MapPin, ChevronLeft, ChevronRight} from "lucide-react";
import {ImageWithFallback} from "./ImageWithFallback";

const gastroletoCardImage = './images/gastroletoCardImage.png'
const gastroleto1 = './images/gastroleto1.png'
const gastroleto2 = './images/gastroleto2.png'
const gastroleto3 = './images/gastroleto3.png'
const gastroleto4 = './images/gastroleto4.png'

interface PhotoReport {
    id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    location: string;
    photographer: string;
    photos: string[];
    coverPhoto: string;
    description: string;
    category: "event" | "exhibition";
}

const mockPhotoReports: PhotoReport[] = [
    {
        id: "report_1",
        eventId: "2",
        eventTitle: "Конференция «Гастро-лето-2025 на Неве»",
        eventDate: "2025-06-07",
        location: "Отель Введенский",
        photographer: "Анна Ткачева",
        coverPhoto: gastroletoCardImage,
        photos: [
            gastroleto1,
            gastroleto2,
            gastroleto3,
            gastroleto4,
        ],
        description: "Захватывающие моменты конференции: от докладов экспертов до живого общения участников",
        category: "event"
    }
];

export default function PhotoReports() {
    const [selectedReport, setSelectedReport] = useState<PhotoReport | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const filteredReports = mockPhotoReports;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const openGallery = (report: PhotoReport) => {
        setSelectedReport(report);
        setCurrentPhotoIndex(0);
    };

    const nextPhoto = () => {
        if (selectedReport) {
            setCurrentPhotoIndex((prev) =>
                prev < selectedReport.photos.length - 1 ? prev + 1 : 0
            );
        }
    };

    const prevPhoto = () => {
        if (selectedReport) {
            setCurrentPhotoIndex((prev) =>
                prev > 0 ? prev - 1 : selectedReport.photos.length - 1
            );
        }
    };

    // Обработка свайпов
    const handleTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!selectedReport) return;

        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextPhoto();
            } else {
                prevPhoto();
            }
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    // Обработка клавиш клавиатуры
    useEffect(() => {
        if (!selectedReport) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevPhoto();
            } else if (e.key === 'ArrowRight') {
                nextPhoto();
            } else if (e.key === 'Escape') {
                setSelectedReport(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedReport, currentPhotoIndex]);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="space-y-4 py-6">
                <div className="flex items-center gap-3">
                    <Camera className="w-8 h-8" style={{color: '#34c759'}} />
                    <h1 className="text-4xl font-bold text-white">Фотоотчеты</h1>
                </div>
                <p className="text-xl text-white/70">
                    Яркие моменты наших мероприятий и выставок в профессиональных фотографиях
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        <span>{mockPhotoReports.length} фотоотчетов</span>
                    </div>
                </div>
            </div>

            {/* Photo Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                    <div
                        key={report.id}
                        className="p-[5px] rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                        style={{
                            background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                        }}
                        onClick={() => openGallery(report)}
                    >
                        <Card className="overflow-hidden h-full border-0">
                            <div className="relative overflow-hidden rounded-t-xl">
                                <ImageWithFallback
                                    src={report.coverPhoto}
                                    alt={report.eventTitle}
                                    className="w-full h-48 object-cover"
                                />

                                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    {report.photos.length}
                                </div>
                            </div>

                            <CardHeader className="pb-3">
                                <CardTitle className="line-clamp-2 text-white">{report.eventTitle}</CardTitle>
                                <CardDescription className="line-clamp-2 text-gray-300">
                                    {report.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="space-y-2 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(report.eventDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{report.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        <span>Фотограф: {report.photographer}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-2 border-t border-white/20">
                                    <Button variant="outline" size="sm" className="text-white hover:text-white border-white/30 bg-white/10 hover:bg-white/20">
                                        Открыть галерею
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Photo Gallery Modal */}
            <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-transparent border-0">
                    {selectedReport && (
                        <>
                            <DialogTitle className="sr-only">
                                {selectedReport.eventTitle} - фото {currentPhotoIndex + 1} из {selectedReport.photos.length}
                            </DialogTitle>

                            <div className="relative w-full h-full">
                                {/* Основной контейнер с фото */}
                                <div
                                    className="w-full h-full relative flex items-center justify-center bg-black/90"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {/* Основное фото */}
                                    <div className="flex items-center justify-center w-full h-full p-4">
                                        <ImageWithFallback
                                            src={selectedReport.photos[currentPhotoIndex]}
                                            alt={`${selectedReport.eventTitle} - фото ${currentPhotoIndex + 1}`}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>

                                    {/* Навигационные кнопки */}
                                    {selectedReport.photos.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white z-10 backdrop-blur-md shadow-lg rounded-full"
                                                onClick={prevPhoto}
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white z-10 backdrop-blur-md shadow-lg rounded-full"
                                                onClick={nextPhoto}
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Информация и миниатюры */}
                                    <div className="absolute bottom-4 left-4 right-4 z-10 space-y-3">
                                        {/* Название и счетчик */}
                                        <div className="text-white text-center">
                                            <h3 className="font-semibold text-lg mb-1 drop-shadow-lg">{selectedReport.eventTitle}</h3>
                                            <div className="flex items-center justify-center gap-2 text-sm drop-shadow-lg">
                                                <Camera className="w-4 h-4" />
                                                <span>{currentPhotoIndex + 1} / {selectedReport.photos.length}</span>
                                            </div>
                                        </div>

                                        {/* Миниатюры */}
                                        {selectedReport.photos.length > 1 && (
                                            <div className="backdrop-blur-md bg-white/30 rounded-lg p-3 shadow-lg">
                                                <div className="flex gap-2 overflow-x-auto justify-center">
                                                    {selectedReport.photos.map((photo, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentPhotoIndex(index)}
                                                            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${index === currentPhotoIndex
                                                                    ? 'border-[#34c759] scale-110'
                                                                    : 'border-transparent hover:border-white/50'
                                                                }`}
                                                        >
                                                            <ImageWithFallback
                                                                src={photo}
                                                                alt={`Превью ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
