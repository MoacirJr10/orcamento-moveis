@Repository

public interface ClienteRepository  extends JpaRepository<Cliente, long>{
    Option<Cliente> findByEmail(String email);
}