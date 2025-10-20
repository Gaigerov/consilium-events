import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogTitle} from "./ui/dialog";
import {ImageWithFallback} from "./ImageWithFallback";
import {Camera, Calendar, MapPin, Users, ChevronLeft, ChevronRight, Eye} from "lucide-react";

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

const mockPhotoReports: PhotoReport[] = [
    {
        id: "report_1",
        eventId: "2",
        eventTitle: "Конференция по технологиям будущего",
        eventDate: "2025-01-20",
        location: "Технопарк Сколково",
        photographer: "Анна Фотографова",
        coverPhoto: "https://images.unsplash.com/photo-1733222765234-08c33d436c50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwd29ya3Nob3AlMjBhdWRpZW5jZXxlbnwxfHx8fDE3NTg5Nzg5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        photos: [
            "https://images.unsplash.com/photo-1733222765234-08c33d436c50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwd29ya3Nob3AlMjBhdWRpZW5jZXxlbnwxfHx8fDE3NTg5Nzg5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
            "https://images.unsplash.com/photo-1576085898323-218337e3e43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU4OTA1MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
            "https://images.unsplash.com/photo-1580893196685-f061a838ba99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3Nob3B8ZW58MXx8fHwxNzU4OTc4NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
        ],
        description: "Захватывающие моменты конференции: от докладов экспертов до живого общения участников",
        category: "event",
        views: 1247
    },

    // {
    //     id: "report_3",
    //     eventId: "6",
    //     eventTitle: "Балет 'Лебединое озеро'",
    //     eventDate: "2025-01-18",
    //     location: "Большой театр",
    //     photographer: "Елена Сценическая",
    //     coverPhoto: "https://images.unsplash.com/photo-1740459057005-65f000db582f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHN8ZW58MXx8fHwxNzU4ODk2MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    //     photos: [
    //         "https://images.unsplash.com/photo-1740459057005-65f000db582f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHN8ZW58MXx8fHwxNzU4ODk2MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1524330685423-3e1966445abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzU4ODk5MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    //         "https://images.unsplash.com/photo-1558634986-2103d9d53bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25jZXJ0JTIwaGFsbHxlbnwxfHx8fDE3NTg5Nzg0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    //     ],
    //     description: "Магия балета: изящество танцоров и великолепие постановки",
    //     category: "event",
    //     views: 2156
    // }
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
            {/* Hero Section
                <div className="text-center space-y-4 py-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Camera className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl font-bold">Фотоотчеты</h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Яркие моменты наших мероприятий и выставок в профессиональных фотографиях
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{mockPhotoReports.reduce((sum, report) => sum + report.views, 0).toLocaleString()} просмотров</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Camera className="w-4 h-4" />
                            <span>{mockPhotoReports.length} фотоотчетов</span>
                        </div>
                    </div>
                </div> */}

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 break-words text-white">
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    Мероприятия
                </h1>
                <p className="text-white/70 text-sm sm:text-base">
                    Яркие моменты наших мероприятий и выставок в профессиональных фотографиях
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
                <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0" aria-describedby={undefined}>
                    {selectedReport && (
                        <>
                            {/* Скрытый заголовок для доступности */}
                            <DialogTitle className="sr-only">
                                {selectedReport.eventTitle} - фото {currentPhotoIndex + 1} из {selectedReport.photos.length}
                            </DialogTitle>

                            <div className="relative">
                                <div className="aspect-[4/3] w-full relative">
                                    <ImageWithFallback
                                        src={selectedReport.photos[currentPhotoIndex]}
                                        alt={`${selectedReport.eventTitle} - фото ${currentPhotoIndex + 1}`}
                                        className="w-full h-full object-cover rounded-t-lg"
                                    />

                                    {/* Navigation buttons */}
                                    {selectedReport.photos.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                                onClick={prevPhoto}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                                onClick={nextPhoto}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Информация о фото поверх изображения */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                        <div className="text-white">
                                            <h3 className="font-semibold text-lg mb-1">{selectedReport.eventTitle}</h3>
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{currentPhotoIndex + 1} / {selectedReport.photos.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Photo thumbnails */}
                                {selectedReport.photos.length > 1 && (
                                    <div className="p-4 bg-white border-t">
                                        <div className="flex gap-2 overflow-x-auto">
                                            {selectedReport.photos.map((photo, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentPhotoIndex(index)}
                                                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${index === currentPhotoIndex ? 'border-primary' : 'border-transparent'
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
