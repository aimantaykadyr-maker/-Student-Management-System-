🖥️ ArchRPG — Cache Architecture Simulator

Knight of Silicon

ArchRPG — бұл процессордың кэш-жадын оқуды қызықты RPG-ойын форматына айналдыратын интерактивті білім беру платформасы. Жоба төмен деңгейдегі деректерді өңдеу процестерін визуализациялауға көмектеседі.

🚀 Негізгі мүмкіндіктер

Интерактивті симулятор:
Адрес тізбегін енгізіп, кэш күйін (HIT/MISS) бірден көру.

LRU алгоритмі:
“Least Recently Used” алгоритмі арқылы деректерді ығыстыру симуляциясы.

AI-оқытушы:
Gemini негізіндегі көмекші теорияны түсіндіреді.

Геймификация:
XP, деңгей, тапсырмалар арқылы оқу процесі қызықты өтеді.

🛠 Технологиялық стек

Frontend: React.js, Tailwind CSS (Cyberpunk стиль)
Logic: JavaScript (LRU алгоритм)
AI Integration: Google AI Studio (Gemini API)
Deployment: Google Cloud

👥 Біздің команда
| Қатысушы | Рөлі                | Үлесі                     |
| -------- | ------------------- | ------------------------- |
| Қадыр    | Project Manager     | Жобаны басқару, жоспарлау |
| Жанара   | UI/UX Designer      | Дизайн, интерфейс, UX     |
| Ақжарқын | Frontend Developer  | Интерфейс жасау (React)   |
| Аида     | Algorithm Developer | LRU алгоритмін жасау      |
| Таңбол   | AI & Logic          | AI интеграция, логика     |
| Бағжан   | DevOps              | GitHub, deploy            |
| Қанатбек | Tester              | Тестілеу, қателерді табу  |

🕹️ Қалай іске қосу

Репозиторийді жүктеу:

git clone https://github.com/your-project.git

Папкаға кіру:

cd your-project

Іске қосу:

index.html ашу
💾 Деректер архитектурасы

Persistence:
Пайдаланушы деректері браузердің LocalStorage ішінде сақталады.

Static Data:
Квесттер мен оқу материалдары JSON файлдардан жүктеледі.

Scaling:
Архитектура Data/Logic Separation принципімен жасалған, сондықтан болашақта Firebase немесе Supabase-ке көшіруге болады.
