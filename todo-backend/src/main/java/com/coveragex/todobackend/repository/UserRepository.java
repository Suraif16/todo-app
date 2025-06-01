package com.coveragex.todobackend.repository;

import com.coveragex.todobackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * Spring Data JPA automatically implements this interface with common CRUD operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username (for authentication)
     * @param username the username to search for
     * @return Optional containing user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email (for registration validation)
     * @param email the email to search for
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username exists (for registration validation)
     * @param username the username to check
     * @return true if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists (for registration validation)
     * @param email the email to check
     * @return true if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Custom query to find user with their tasks
     * This is an example of using JPQL (Java Persistence Query Language)
     * @param username the username
     * @return Optional containing user with tasks
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.tasks WHERE u.username = :username")
    Optional<User> findByUsernameWithTasks(@Param("username") String username);
}