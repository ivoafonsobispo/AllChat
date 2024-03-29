package pt.ipleiria.chat.model;

public class ReceivedMessage {

	private String name;
	private String content;

	public ReceivedMessage() {
	}

	public ReceivedMessage(String name, String content) {
		this.name = name;
		this.content = content;
	}

	public String getContent() {
		return content;
	}

	public void setMessage(String content) {
		this.content = content;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
