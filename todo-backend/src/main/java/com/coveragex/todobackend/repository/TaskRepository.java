package com.coveragex.todobackend.repository;

import com.coveragex.todobackend.entity.Task;
import com.coveragex.todobackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Task entity.
 * Contains custom query methods for task-specific operations.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all incomplete tasks for a user, ordered by creation date (newest first)
     * @param user     the user whose tasks to find
     * @param pageable pagination parameters
     * @return Page of incomplete tasks
     */
    Page<Task> findByUserAndCompletedFalseOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * Find all tasks for a user (both complete and incomplete)
     *
     * @param user     the user whose tasks to find
     * @param pageable pagination parameters
     * @return Page of all tasks
     */
    Page<Task> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * Find a specific task by ID and user (for security - users can only access their own tasks)
     *
     * @param id   task ID
     * @param user the user who owns the task
     * @return Optional containing task if found and owned by user
     */
    Optional<Task> findByIdAndUser(Long id, User user);

    /**
     * Count incomplete tasks for a user
     *
     * @param user the user
     * @return number of incomplete tasks
     */
    long countByUserAndCompletedFalse(User user);

    /**
     * Custom query to find tasks by title containing search term (case-insensitive)
     * This is an additional feature for searching tasks
     *
     * @param user       the user
     * @param searchTerm the search term
     * @param pageable   pagination parameters
     * @return Page of matching tasks
     */
    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Task> findByUserAndTitleOrDescriptionContainingIgnoreCase(
            @Param("user") User user,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    /**
     * Find recent tasks for dashboard/summary
     *
     * @param user the user
     * @return List of recent tasks (limited by query)
     */
    @Query("SELECT t FROM Task t WHERE t.user = :user ORDER BY t.createdAt DESC")
    List<Task> findRecentTasksByUser(@Param("user") User user, Pageable pageable);

    /**
     * Count total tasks for a user
     * @param user the user
     * @return total number of tasks
     */
    long countByUser(User user);
}