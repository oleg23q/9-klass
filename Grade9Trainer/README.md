# 9 КЛАСС — Тренажёр

Первый рабочий MVP Windows-приложения на C#/.NET 10 и WPF. Он использует подготовленные ученические Markdown-уроки, показывает задания по шагам и хранит ответы отдельно от содержания.

## Готовая Windows-сборка

ZIP с автономной 64-битной сборкой Windows опубликован в [релизе `trainer-mvp-2026-09-06`](https://github.com/oleg23q/9-klass/releases/tag/trainer-mvp-2026-09-06). После загрузки полностью распакуйте архив и запускайте `Grade9Trainer.exe` из распакованной папки.

SHA-256 архива `9 КЛАСС — Тренажёр MVP 2026-09-06.zip`:

```text
011756CECDD9C867D121E7FE5C044C9079E84AC124783BAD74C61918AD247DD5
```

## Уже работает

- каталог физики, химии и информатики;
- десять встроенных уроков и 74 последовательных шага;
- теория и текстовое представление Mermaid-схем без подключения к интернету;
- отдельное поле ответа для каждого задания;
- кнопка раскрытия правильного разбора;
- отметка выполненных шагов и индикатор прогресса;
- автоматическое локальное сохранение ответов;
- импорт одного `.md` или ZIP с несколькими уроками;
- обновление урока без удаления ответов ученика.

## Запуск для разработки

```powershell
dotnet run --project .\src\Grade9Trainer.App\Grade9Trainer.App.csproj
```

Проверки:

```powershell
dotnet build .\Grade9Trainer.slnx
dotnet run --project .\tests\Grade9Trainer.SmokeTests\Grade9Trainer.SmokeTests.csproj
dotnet run --project .\tests\Grade9Trainer.UiSmoke\Grade9Trainer.UiSmoke.csproj -- .\artifacts\ui-smoke.png
```

## Где хранятся данные

- встроенные уроки: папка `Lessons` рядом с программой;
- добавленные уроки: `%LOCALAPPDATA%\Grade9Trainer\Lessons`;
- ответы и прогресс: `%LOCALAPPDATA%\Grade9Trainer\progress.json`.

Формат нового материала описан в [Content/LESSON_FORMAT.md](Content/LESSON_FORMAT.md).

## Следующие этапы

- визуальный редактор уроков для преподавателя;
- полноценное графическое отображение Mermaid;
- экспорт результатов ученика;
- миграция реализации хранилища прогресса на SQLite при появлении нескольких профилей;
- безопасный запуск учебных программ Python в отдельной среде.
