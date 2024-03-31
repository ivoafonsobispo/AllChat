package pt.ipleiria.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.util.HtmlUtils;
import pt.ipleiria.chat.model.ReceivedMessage;
import pt.ipleiria.chat.model.SentMessage;
import pt.ipleiria.chat.repository.MessageRepository;

import java.util.List;

@Controller
public class MessageController {

	@Autowired
	private MessageRepository repository;

	@MessageMapping("/chat")
	@SendTo("/topic/chat")
	public SentMessage sendMessage(ReceivedMessage message) throws Exception {
		repository.save(message);

		Thread.sleep(500); // simulated delay
		return new SentMessage(HtmlUtils.htmlEscape(message.getName()) + ": " + HtmlUtils.htmlEscape(message.getContent()));
	}

	@GetMapping("/api/spring/messages")
	public List<ReceivedMessage> getMessages() {
		return repository.findAll();
	}

	@PostMapping("/api/spring/messages")
	public ReceivedMessage saveMessages(@RequestBody ReceivedMessage msg) {
		return repository.save(msg);
	}
}
