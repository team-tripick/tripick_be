package j02on.tripick_BE.domain.user.repository;

import j02on.tripick_BE.domain.user.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository //db 조작 가능
public interface UserRepository extends CrudRepository<User, Long> {

}
