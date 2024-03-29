package pt.ipleiria.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import pt.ipleiria.chat.model.ReceivedMessage;
import pt.ipleiria.chat.model.SentMessage;

@Controller
public class MessageController {


	@MessageMapping("/chat")
	@SendTo("/topic/chat")
	public SentMessage sendMessage(ReceivedMessage message) throws Exception {
		Thread.sleep(500); // simulated delay
		return new SentMessage(HtmlUtils.htmlEscape(message.getName()) + ": " + HtmlUtils.htmlEscape(message.getContent()));
	}

}
