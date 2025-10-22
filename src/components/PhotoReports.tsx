import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogTitle} from "./ui/dialog";
import {ImageWithFallback} from "./ImageWithFallback";
import {Camera, Calendar, MapPin, ChevronLeft, ChevronRight, Eye} from "lucide-react";

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
    views: number;
}

const gastroImg = '/consilium-events/images/gastroLeto.png';
const gastroleto1 = '/consilium-events/images/gastroleto1.jpg';
const gastroleto2 = '/consilium-events/images/gastroleto2.jpg';
const gastroleto3 = '/consilium-events/images/gastroleto3.jpg';
const gastroleto4 = '/consilium-events/images/gastroleto4.jpg';
const gastroleto5 = '/consilium-events/images/gastroleto5.jpg';
const gastroleto6 = '/consilium-events/images/gastroleto6.jpg';
const gastroleto7 = '/consilium-events/images/gastroleto7.jpg';
const gastroleto8 = '/consilium-events/images/gastroleto8.jpg';
const gastroleto9 = '/consilium-events/images/gastroleto9.jpg';
const gastroleto10 = '/consilium-events/images/gastroleto10.jpg';
const gastroleto11 = '/consilium-events/images/gastroleto11.jpg';
const gastroleto12 = '/consilium-events/images/gastroleto12.jpg';
const gastroleto13 = '/consilium-events/images/gastroleto13.jpg';
const gastroleto14 = '/consilium-events/images/gastroleto14.jpg';
const gastroleto15 = '/consilium-events/images/gastroleto15.jpg';

const mockPhotoReports: PhotoReport[] = [
    {
        id: "report_1",
        eventId: "2",
        eventTitle: `Конференция «Гастро-лето-2025 на Неве»`,
        eventDate: "2025-06-07",
        location: "Отель Введенский",
        photographer: "Анна Ткачева",
        coverPhoto: gastroImg,
        photos: [
            gastroleto1, 
            gastroleto2, 
            gastroleto3, 
            gastroleto4, 
            gastroleto5, 
            gastroleto6, 
            gastroleto7, 
            gastroleto8, 
            gastroleto9, 
            gastroleto10, 
            gastroleto11, 
            gastroleto12, 
            gastroleto13, 
            gastroleto14, 
            gastroleto15
        ],
        description: "Захватывающие моменты конференции: от докладов экспертов до живого общения участников",
        category: "event",
        views: 1247
    },
];

export default function PhotoReports() {
    const [selectedReport, setSelectedReport] = useState<PhotoReport | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 break-words text-white">
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    Мероприятия
                </h1>
                <p className="text-white/70 text-sm sm:text-base">
                    Яркие моменты наших мероприятий в профессиональных фотографиях
                </p>
            </div>

            {/* Photo Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => openGallery(report)}>
                        <div className="relative">
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
                            <CardTitle className="line-clamp-2">{report.eventTitle}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {report.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm text-muted-foreground">
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

                            <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    <span>{report.views.toLocaleString()}</span>
                                </div>
                                <Button variant="outline" size="sm">
                                    Открыть галерею
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

{/* Photo Gallery Modal */}
<Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
    <DialogContent className="w-full max-w-[95vw] h-auto max-h-[90vh] md:max-w-5xl p-0 overflow-hidden rounded-lg" aria-describedby={undefined}>
        {selectedReport && (
            <>
                <DialogTitle className="sr-only">
                    {selectedReport.eventTitle} - фото {currentPhotoIndex + 1} из {selectedReport.photos.length}
                </DialogTitle>

                <div className="relative flex flex-col h-full">
                    {/* Основное изображение - строго по ширине модального окна */}
                    <div className="flex-1 relative bg-black flex items-center justify-center min-h-[50vh] overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-full flex justify-center">
                                <ImageWithFallback
                                    src={selectedReport.photos[currentPhotoIndex]}
                                    alt={`${selectedReport.eventTitle} - фото ${currentPhotoIndex + 1}`}
                                    className="w-full h-auto object-contain"
                                    style={{ 
                                        maxWidth: '100%',
                                        maxHeight: '60vh'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        {selectedReport.photos.length > 1 && (
                            <>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black text-white z-40 rounded-full w-8 h-8 shadow-lg"
                                    onClick={prevPhoto}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black text-white z-40 rounded-full w-8 h-8 shadow-lg"
                                    onClick={nextPhoto}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </>
                        )}

                        {/* Информация о фото поверх изображения */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 z-30">
                            <div className="text-white">
                                <h3 className="font-semibold text-sm sm:text-lg mb-1 line-clamp-2">{selectedReport.eventTitle}</h3>
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span>{currentPhotoIndex + 1} / {selectedReport.photos.length}</span>
                                    <span className="text-white/70">Фотограф: {selectedReport.photographer}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Photo thumbnails */}
                    {selectedReport.photos.length > 1 && (
                        <div className="flex-shrink-0 p-3 bg-white border-t">
                            <div className="flex gap-2 overflow-x-auto">
                                {selectedReport.photos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPhotoIndex(index)}
                                        className={`flex-shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all duration-200 ${
                                            index === currentPhotoIndex 
                                                ? 'border-primary scale-105 shadow-md' 
                                                : 'border-transparent opacity-70 hover:opacity-100'
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
            </>
        )}
    </DialogContent>
</Dialog>
        </div>
    );
}
