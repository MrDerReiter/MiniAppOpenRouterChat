/**
 * Обьект, инкапсулирующий реквизиты для взаимодействия с сервером провайдера AI. Требуется AI-агенту для корректной работы.
 * Данный обьект не нужно создавать с помощью конструктора; вместо этого используйте статические свойства класса (только для чтения), которые возвращают подходящий объект для определённого сервиса.
 */
export class AIRouter {
	public currentModelID: string;
	public singleCompletionUrl: string;
	public chatCompletionUrl: string;
	public modelsListUrl: string;


	/** Роутер для сервиса www.openrouter.ai */
	public static get openRouter() {
		const router = new AIRouter();
		router.singleCompletionUrl = "https://openrouter.ai/api/v1/completions";
		router.chatCompletionUrl = "https://openrouter.ai/api/v1/chat/completions";
		router.modelsListUrl = "https://openrouter.ai/api/v1/models";

		return router;
	}

	private constructor() { }
}