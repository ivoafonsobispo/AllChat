package pt.ipleiria.chat.model;

import lombok.Getter;

@Getter
public class SentMessage {

	private String content;

	public SentMessage() {
	}

	public SentMessage(String content) {
		this.content = content;
	}

}
