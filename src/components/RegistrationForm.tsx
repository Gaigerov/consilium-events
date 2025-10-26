import {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Textarea} from "./ui/textarea";
import {Label} from "./ui/label";
import {Send, UserPlus} from "lucide-react";
import {toast} from "sonner";

interface RegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
    eventTitle: string;
    eventId: string;
}

export default function RegistrationForm({isOpen, onClose, eventTitle, eventId}: RegistrationFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        comments: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Формируем данные для отправки
        const emailBody = `
Новая регистрация на мероприятие: ${eventTitle}
ID мероприятия: ${eventId}

Данные участника:
- Имя: ${formData.name}
- Email: ${formData.email}
- Телефон: ${formData.phone}
- Компания: ${formData.company || "Не указана"}
- Комментарии: ${formData.comments || "Нет"}
    `.trim();

        // Создаем mailto ссылку
        const mailtoLink = `mailto:gaigerov@gmail.com?subject=${encodeURIComponent(`Регистрация на "${eventTitle}"`)}&body=${encodeURIComponent(emailBody)}`;

        // Открываем почтовый клиент
        window.location.href = mailtoLink;

        toast.success(`Форма регистрации отправлена! Проверьте ваш почтовый клиент.`);

        // Сбрасываем форму
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            comments: ""
        });

        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <UserPlus className="w-5 h-5" />
                        Форма регистрации участника
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Заполните форму для регистрации на мероприятие: <strong className="text-white">{eventTitle}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Имя *</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Ваше имя"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Телефон</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={handleChange}
                            className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company" className="text-white">Компания/Организация</Label>
                        <Input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="Название компании"
                            value={formData.company}
                            onChange={handleChange}
                            className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comments" className="text-white">Комментарии</Label>
                        <Textarea
                            id="comments"
                            name="comments"
                            placeholder="Дополнительная информация или вопросы..."
                            className="min-h-[100px] text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400"
                            value={formData.comments}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-start gap-2">
                        <input type="checkbox" id="consent" className="mt-1" required />
                        <label htmlFor="consent" className="text-sm text-gray-300">
                            Я согласен с обработкой персональных данных и
                            <a href="#" className="text-primary hover:underline"> политикой конфиденциальности</a>
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1 border-2 border-primary/50">
                            <Send className="w-4 h-4 mr-2" />
                            Отправить заявку
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20">
                            Отмена
                        </Button>
                    </div>
                </form>

                <p className="text-sm text-gray-300 text-center px-2">
                    После отправки формы мы свяжемся с вами в течение 24 часов
                </p>
            </DialogContent>
        </Dialog>
    );
}
