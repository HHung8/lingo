package com.lingo.repo;

import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    public record UserRow(long id, String email, String passwordHash, String displayName, String role) {}

    private final JdbcClient db;

    public UserRepository(JdbcClient db) {
        this.db = db;
    }

    public UserRow create(String email, String passwordHash, String displayName) {
        long id = db.sql("INSERT INTO users(email, password_hash, display_name) VALUES (:e, :p, :n) RETURNING id")
                .param("e", email).param("p", passwordHash).param("n", displayName)
                .query(Long.class).single();
        return new UserRow(id, email, passwordHash, displayName, "LEARNER");
    }

    public Optional<UserRow> findByEmail(String email) {
        return db.sql("SELECT id, email, password_hash, display_name, role FROM users WHERE email = :e")
                .param("e", email)
                .query((rs, n) -> new UserRow(rs.getLong("id"), rs.getString("email"), rs.getString("password_hash"),
                        rs.getString("display_name"), rs.getString("role")))
                .optional();
    }
}
