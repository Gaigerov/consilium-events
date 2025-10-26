import {useState} from "react";
import {Card, CardContent} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Textarea} from "./ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {Badge} from "./ui/badge";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "./ui/dialog";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "./ui/alert-dialog";
import {ImageWithFallback} from "./ImageWithFallback";
import {
    Settings,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Clock,
    MapPin,
    Users,
    Save,
} from "lucide-react";
import {toast} from "sonner";

interface Speaker {
    id: string;
    name: string;
    title: string;
    avatar: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    startTime: string;
    endTime: string;
    location: string;
    image: string;
    category: "event" | "exhibition";
    isLive: boolean;
    youtubeVideoId?: string;
    videoPlatform?: "YouTube" | "Rutube" | "VK";
    registeredCount: number;
    maxCapacity: number;
    price: number;
    speakers?: Speaker[];
}

interface AdminPanelProps {
    events: Event[];
    onEventAdd: (event: Omit<Event, 'id' | 'registeredCount'>) => void;
    onEventUpdate: (eventId: string, event: Partial<Event>) => void;
    onEventDelete: (eventId: string) => void;
}

const emptyEvent: Omit<Event, 'id' | 'registeredCount'> = {
    title: "",
    description: "",
    date: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    image: "",
    category: "event",
    isLive: false,
    youtubeVideoId: "",
    videoPlatform: "YouTube",
    maxCapacity: 100,
    price: 0
};

export default function AdminPanel({events, onEventAdd, onEventUpdate, onEventDelete}: AdminPanelProps) {
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'registeredCount'>>(emptyEvent);

    const isEventLiveNow = (event: Event) => {
        const now = new Date();
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);
        return now >= eventStart && now <= eventEnd;
    };

    const handleSaveEvent = () => {
        if (editingEvent) {
            onEventUpdate(editingEvent.id, editingEvent);
            setEditingEvent(null);
            toast.success("Мероприятие обновлено");
        }
    };

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location) {
            toast.error("Заполните все обязательные поля");
            return;
        }

        onEventAdd(newEvent);
        setNewEvent(emptyEvent);
        setIsAddModalOpen(false);
        toast.success("Мероприятие добавлено");
    };

    const handleDeleteEvent = () => {
        if (deleteEventId) {
            onEventDelete(deleteEventId);
            setDeleteEventId(null);
            toast.success("Мероприятие удалено");
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateRange = (event: Event) => {
        if (!event.endDate || event.endDate === event.date) {
            return formatDate(event.date);
        }

        const startDate = new Date(event.date);
        const endDate = new Date(event.endDate);

        // Если месяцы одинаковые
        if (startDate.getMonth() === endDate.getMonth()) {
            const startDay = startDate.getDate();
            const endDay = endDate.getDate();
            const month = endDate.toLocaleDateString('ru-RU', {month: 'short', year: 'numeric'});
            return `${startDay}-${endDay} ${month}`;
        }

        // Если разные месяцы
        return `${formatDate(event.date)} - ${formatDate(event.endDate)}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Settings className="w-8 h-8" style={{color: '#34c759'}} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Панель администратора
                        </h1>
                    </div>
                    <p className="text-white/70 text-sm sm:text-base">
                        Управление мероприятиями и выставками
                    </p>
                </div>

                <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить мероприятие
                </Button>
            </div>

            {/* Список мероприятий */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Управление мероприятиями</h2>
                <div className="grid gap-4">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardContent className="p-4">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="w-full lg:w-32 h-24 flex-shrink-0">
                                        <ImageWithFallback
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                                            {event.isLive && isEventLiveNow(event) && (
                                                <Badge variant="destructive" className="animate-pulse">
                                                    LIVE
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {event.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDateRange(event)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {event.startTime} - {event.endTime}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {event.registeredCount}/{event.maxCapacity}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row lg:flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingEvent(event)}
                                            className="flex-1 lg:flex-none text-gray-900 hover:text-gray-900"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Редактировать
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDeleteEventId(event.id)}
                                            className="flex-1 lg:flex-none text-destructive hover:text-destructive border-destructive/30"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Модальное окно добавления мероприятия */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle className="text-white">Добавить новое мероприятие</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Заполните информацию о мероприятии
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-6 overflow-y-auto space-y-4 flex-1" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                        <style>{`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Label htmlFor="title" className="mb-2 block text-white">Название *</Label>
                                <Input
                                    id="title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    placeholder="Название мероприятия"
                                    className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="description" className="mb-2 block text-white">Описание</Label>
                                <Textarea
                                    id="description"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                    placeholder="Описание мероприятия"
                                    rows={3}
                                    className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <Label htmlFor="date" className="mb-2 block text-white">Дата начала *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                    className="text-white bg-white/10 border-2 border-white/30"
                                />
                            </div>

                            <div>
                                <Label htmlFor="endDate" className="mb-2 block text-white">Дата окончания</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={newEvent.endDate || ""}
                                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                                    placeholder="Оставьте пустым для однодневного"
                                    className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <Label htmlFor="startTime" className="text-white">Время начала *</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={newEvent.startTime}
                                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                                    className="text-white bg-white/10 border-2 border-white/30"
                                />
                            </div>

                            <div>
                                <Label htmlFor="endTime" className="text-white">Время окончания *</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={newEvent.endTime}
                                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                                    className="text-white bg-white/10 border-2 border-white/30"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="location" className="text-white">Место проведения *</Label>
                                <Input
                                    id="location"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                    placeholder="Адрес или название места"
                                    className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <Label htmlFor="maxCapacity" className="text-white">Максимум участников</Label>
                                <Input
                                    id="maxCapacity"
                                    type="number"
                                    value={newEvent.maxCapacity}
                                    onChange={(e) => setNewEvent({...newEvent, maxCapacity: Number(e.target.value)})}
                                    className="text-white bg-white/10 border-2 border-white/30"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price" className="text-white">Стоимость (₽)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newEvent.price}
                                    onChange={(e) => setNewEvent({...newEvent, price: Number(e.target.value)})}
                                    className="text-white bg-white/10 border-2 border-white/30"
                                />
                            </div>

                            <div>
                                <Label htmlFor="videoPlatform" className="text-white">Видеоплатформа</Label>
                                <Select
                                    value={newEvent.videoPlatform}
                                    onValueChange={(value: "YouTube" | "Rutube" | "VK") => setNewEvent({...newEvent, videoPlatform: value})}
                                >
                                    <SelectTrigger className="text-white bg-white/10 border-2 border-white/30">
                                        <SelectValue placeholder="Выберите платформу" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="YouTube">YouTube</SelectItem>
                                        <SelectItem value="Rutube">Rutube</SelectItem>
                                        <SelectItem value="VK">VK</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="youtubeVideoId" className="text-white">Video ID</Label>
                                <Input
                                    id="youtubeVideoId"
                                    value={newEvent.youtubeVideoId}
                                    onChange={(e) => setNewEvent({...newEvent, youtubeVideoId: e.target.value})}
                                    placeholder="dQw4w9WgXcQ"
                                    className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="image" className="text-white">URL изображения</Label>
                                <Input
                                    id="image"
                                    value={newEvent.image}
                                    onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                    className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20">
                                Отмена
                            </Button>
                            <Button onClick={handleAddEvent} className="border-2 border-primary/50">
                                <Save className="w-4 h-4 mr-2" />
                                Добавить
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle className="text-white">Редактировать мероприятие</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Внесите изменения в информацию о мероприятии
                        </DialogDescription>
                    </DialogHeader>

                    {editingEvent && (
                        <div className="px-6 pb-6 overflow-y-auto space-y-4 flex-1" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Label htmlFor="edit-title" className="mb-2 block text-white">Название</Label>
                                    <Input
                                        id="edit-title"
                                        value={editingEvent.title}
                                        onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <Label htmlFor="edit-description" className="mb-2 block text-white">Описание</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={editingEvent.description}
                                        onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                                        rows={3}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-date" className="mb-2 block text-white">Дата начала</Label>
                                    <Input
                                        id="edit-date"
                                        type="date"
                                        value={editingEvent.date}
                                        onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-endDate" className="mb-2 block text-white">Дата окончания</Label>
                                    <Input
                                        id="edit-endDate"
                                        type="date"
                                        value={editingEvent.endDate || ""}
                                        onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})}
                                        placeholder="Оставьте пустым для однодневного"
                                        className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-startTime" className="mb-2 block text-white">Время начала</Label>
                                    <Input
                                        id="edit-startTime"
                                        type="time"
                                        value={editingEvent.startTime}
                                        onChange={(e) => setEditingEvent({...editingEvent, startTime: e.target.value})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-endTime" className="mb-2 block text-white">Время окончания</Label>
                                    <Input
                                        id="edit-endTime"
                                        type="time"
                                        value={editingEvent.endTime}
                                        onChange={(e) => setEditingEvent({...editingEvent, endTime: e.target.value})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <Label htmlFor="edit-location" className="mb-2 block text-white">Место проведения</Label>
                                    <Input
                                        id="edit-location"
                                        value={editingEvent.location}
                                        onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-maxCapacity" className="mb-2 block text-white">Максимум участников</Label>
                                    <Input
                                        id="edit-maxCapacity"
                                        type="number"
                                        value={editingEvent.maxCapacity}
                                        onChange={(e) => setEditingEvent({...editingEvent, maxCapacity: Number(e.target.value)})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-price" className="mb-2 block text-white">Стоимость (₽)</Label>
                                    <Input
                                        id="edit-price"
                                        type="number"
                                        value={editingEvent.price}
                                        onChange={(e) => setEditingEvent({...editingEvent, price: Number(e.target.value)})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-videoPlatform" className="mb-2 block text-white">Видеоплатформа</Label>
                                    <Select
                                        value={editingEvent.videoPlatform || "YouTube"}
                                        onValueChange={(value: "YouTube" | "Rutube" | "VK") => setEditingEvent({...editingEvent, videoPlatform: value})}
                                    >
                                        <SelectTrigger className="text-white bg-white/10 border-2 border-white/30">
                                            <SelectValue placeholder="Выберите платформу" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="YouTube">YouTube</SelectItem>
                                            <SelectItem value="Rutube">Rutube</SelectItem>
                                            <SelectItem value="VK">VK</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="edit-youtubeVideoId" className="mb-2 block text-white">Video ID</Label>
                                    <Input
                                        id="edit-youtubeVideoId"
                                        value={editingEvent.youtubeVideoId || ""}
                                        onChange={(e) => setEditingEvent({...editingEvent, youtubeVideoId: e.target.value})}
                                        className="text-white bg-white/10 border-2 border-white/30"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setEditingEvent(null)} className="text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20">
                                    Отмена
                                </Button>
                                <Button onClick={handleSaveEvent} className="border-2 border-primary/50">
                                    <Save className="w-4 h-4 mr-2" />
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <AlertDialog open={!!deleteEventId} onOpenChange={(open) => !open && setDeleteEventId(null)}>
                <AlertDialogContent className="bg-white rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Удалить мероприятие?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие нельзя отменить. Мероприятие будет удалено навсегда.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Удалить
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
