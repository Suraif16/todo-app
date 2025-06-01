package com.coveragex.todobackend.service;

import com.coveragex.todobackend.dto.TaskRequest;
import com.coveragex.todobackend.dto.TaskResponse;
import com.coveragex.todobackend.entity.Task;
import com.coveragex.todobackend.entity.User;
import com.coveragex.todobackend.repository.TaskRepository;
import com.coveragex.todobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for handling task operations
 * Implements business logic for CRUD operations on tasks
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    /**
     * Get recent incomplete tasks for a user
     * @param username the username
     * @return list of recent incomplete tasks
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getRecentTasks(String username) {
        User user = getUserByUsername(username);

        // Get only the 5 most recent incomplete tasks
        Pageable pageable = PageRequest.of(0, 5);
        Page<Task> tasks = taskRepository.findByUserAndCompletedFalseOrderByCreatedAtDesc(user, pageable);

        log.info("Retrieved {} recent tasks for user: {}", tasks.getNumberOfElements(), username);

        return tasks.getContent().stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all tasks for a user with pagination
     *
     * @param username the username
     * @param page     page number (0-based)
     * @param size     page size
     * @return paginated list of tasks
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(String username, int page, int size) {
        User user = getUserByUsername(username);

        Pageable pageable = PageRequest.of(page, size);
        Page<Task> tasks = taskRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        log.info("Retrieved {} tasks for user: {} (page {}, size {})",
                tasks.getNumberOfElements(), username, page, size);

        return tasks.map(TaskResponse::fromEntity);
    }

    /**
     * Create a new task
     *
     * @param username    the username
     * @param taskRequest task details
     * @return created task
     */
    public TaskResponse createTask(String username, TaskRequest taskRequest) {
        User user = getUserByUsername(username);

        Task task = new Task(taskRequest.getTitle(), taskRequest.getDescription(), user);
        Task savedTask = taskRepository.save(task);

        log.info("Created new task with ID: {} for user: {}", savedTask.getId(), username);

        return TaskResponse.fromEntity(savedTask);
    }

    /**
     * Update an existing task
     *
     * @param username    the username
     * @param taskId      task ID
     * @param taskRequest updated task details
     * @return updated task
     */
    public TaskResponse updateTask(String username, Long taskId, TaskRequest taskRequest) {
        User user = getUserByUsername(username);

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());

        Task savedTask = taskRepository.save(task);

        log.info("Updated task with ID: {} for user: {}", taskId, username);

        return TaskResponse.fromEntity(savedTask);
    }

    /**
     * Mark a task as completed
     *
     * @param username the username
     * @param taskId   task ID
     * @return updated task
     */
    public TaskResponse markTaskAsCompleted(String username, Long taskId) {
        User user = getUserByUsername(username);

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        task.markAsCompleted();
        Task savedTask = taskRepository.save(task);

        log.info("Marked task {} as completed for user: {}", taskId, username);

        return TaskResponse.fromEntity(savedTask);
    }

    /**
     * Mark a task as pending
     *
     * @param username the username
     * @param taskId   task ID
     * @return updated task
     */
    public TaskResponse markTaskAsPending(String username, Long taskId) {
        User user = getUserByUsername(username);

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        task.markAsPending();
        Task savedTask = taskRepository.save(task);

        log.info("Marked task {} as pending for user: {}", taskId, username);

        return TaskResponse.fromEntity(savedTask);
    }

    /**
     * Delete a task
     *
     * @param username the username
     * @param taskId   task ID
     */
    public void deleteTask(String username, Long taskId) {
        User user = getUserByUsername(username);

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        taskRepository.delete(task);

        log.info("Deleted task {} for user: {}", taskId, username);
    }

    /**
     * Get task by ID (for specific user)
     *
     * @param username the username
     * @param taskId   task ID
     * @return task details
     */
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(String username, Long taskId) {
        User user = getUserByUsername(username);

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        return TaskResponse.fromEntity(task);
    }

    /**
     * Search tasks by title/description
     *
     * @param username   the username
     * @param searchTerm search term
     * @param page       page number
     * @param size       page size
     * @return matching tasks
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> searchTasks(String username, String searchTerm, int page, int size) {
        User user = getUserByUsername(username);

        Pageable pageable = PageRequest.of(page, size);
        Page<Task> tasks = taskRepository.findByUserAndTitleOrDescriptionContainingIgnoreCase(
                user, searchTerm, pageable);

        log.info("Found {} tasks matching '{}' for user: {}",
                tasks.getNumberOfElements(), searchTerm, username);

        return tasks.map(TaskResponse::fromEntity);
    }

    /**
     * Get task statistics for a user
     *
     * @param username the username
     * @return task statistics
     */
    @Transactional(readOnly = true)
    public TaskStatsResponse getTaskStats(String username) {
        User user = getUserByUsername(username);

        long totalTasks = taskRepository.countByUser(user);
        long incompleteTasks = taskRepository.countByUserAndCompletedFalse(user);
        long completedTasks = totalTasks - incompleteTasks;

        return new TaskStatsResponse(totalTasks, completedTasks, incompleteTasks);
    }

    /**
     * Helper method to get user by username
     *
     * @param username the username
     * @return user entity
     */
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    /**
     * Inner class for task statistics
     */
    public static class TaskStatsResponse {
        public final long total;
        public final long completed;
        public final long incomplete;

        public TaskStatsResponse(long total, long completed, long incomplete) {
            this.total = total;
            this.completed = completed;
            this.incomplete = incomplete;
        }
    }
}