declare type Message = {
	role: string;
	content: string;
}

declare type AIModelInfo = {
	id: string,
	name: string,
	pricing: {
		prompt: string,
		completion: string
	}
}