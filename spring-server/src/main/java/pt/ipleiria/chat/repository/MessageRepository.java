package pt.ipleiria.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pt.ipleiria.chat.model.ReceivedMessage;

public interface MessageRepository extends MongoRepository<ReceivedMessage, Integer> {

}
