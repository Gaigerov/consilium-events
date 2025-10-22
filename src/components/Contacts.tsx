import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Textarea} from "./ui/textarea";
import {MapPin, Phone, Mail, Users, Calendar, Send} from "lucide-react";
import {toast} from "sonner";

export default function Contacts() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Сообщение отправлено! Мы свяжемся с вами в ближайшее время.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 break-words text-white">
                    <Send className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    Контакты
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Главный офис
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-l-4 border-primary pl-4">
                                <p className="text-muted-foreground">199034, г. Санкт-Петербург, Большой пр-т ВО, д. 16/14 лит. Б, пом. 4-Н, офис №7</p>
                                <p className="text-sm text-muted-foreground">9:00 - 18:00, пн-пт</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Связь с нами
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">+7 (812) 385-96-26</p>
                                        <p className="text-sm text-muted-foreground">Общие вопросы</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">info@consilium.ru</p>
                                        <p className="text-sm text-muted-foreground">Email поддержка</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">+7 (812) 123-45-68</p>
                                        <p className="text-sm text-muted-foreground">Корпоративные клиенты</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">events@consilium.ru</p>
                                        <p className="text-sm text-muted-foreground">Организация мероприятий</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            Написать нам
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Имя *</label>
                                    <Input placeholder="Ваше имя" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email *</label>
                                    <Input type="email" placeholder="your@email.com" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Телефон</label>
                                <Input placeholder="+7 (___) ___-__-__" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Тема обращения *</label>
                                <Input placeholder="Краткое описание вопроса" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Сообщение *</label>
                                <Textarea
                                    placeholder="Подробно опишите ваш вопрос или предложение..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-2">
                                <input type="checkbox" id="consent" className="mt-1" required />
                                <label htmlFor="consent" className="text-sm text-muted-foreground">
                                    Я согласен с обработкой персональных данных и
                                    <a href="#" className="text-primary hover:underline"> политикой конфиденциальности</a>
                                </label>
                            </div>

                            <Button type="submit" className="w-full">
                                <Send className="w-4 h-4 mr-2" />
                                Отправить сообщение
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
