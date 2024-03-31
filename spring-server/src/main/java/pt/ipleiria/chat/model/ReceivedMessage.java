package pt.ipleiria.chat.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@Document(collection = "messages")
public class ReceivedMessage {
	@Id
	private Integer id;
	private String name;
	private String content;

	public ReceivedMessage() {
	}

	public ReceivedMessage(Integer id, String name, String content) {
		this.id = id;
		this.name = name;
		this.content = content;
	}
}
