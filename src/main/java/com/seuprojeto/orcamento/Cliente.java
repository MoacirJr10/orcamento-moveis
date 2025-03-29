@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "clientes")

public class Client {
    @id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telefone;

}