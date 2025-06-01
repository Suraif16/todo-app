package com.coveragex.todobackend.controller;

import com.coveragex.todobackend.dto.ApiResponse;
import com.coveragex.todobackend.dto.TaskRequest;
import com.coveragex.todobackend.dto.TaskResponse;
import com.coveragex.todobackend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for task operations
 * Handles CRUD operations for todo tasks
 */
@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class TaskController {

    private final TaskService taskService;

    /**
     * Get recent tasks
     * GET /tasks/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getRecentTasks(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<TaskResponse> tasks = taskService.getRecentTasks(username);
            return ResponseEntity.ok(ApiResponse.success("Recent tasks retrieved successfully", tasks));
        } catch (RuntimeException e) {
            log.error("Failed to get recent tasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve tasks"));
        }
    }

    /**
     * Get all tasks with pagination
     * GET /tasks?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getAllTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            Page<TaskResponse> tasks = taskService.getAllTasks(username, page, size);
            return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
        } catch (RuntimeException e) {
            log.error("Failed to get all tasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve tasks"));
        }
    }

    /**
     * Get a specific task by ID
     * GET /tasks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String username = authentication.getName();
            TaskResponse task = taskService.getTaskById(username, id);
            return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", task));
        } catch (RuntimeException e) {
            log.error("Failed to get task {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }

    /**
     * Create a new task
     * POST /tasks
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskRequest taskRequest) {
        try {
            String username = authentication.getName();
            TaskResponse task = taskService.createTask(username, taskRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Task created successfully", task));
        } catch (RuntimeException e) {
            log.error("Failed to create task: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create task"));
        }
    }

    /**
     * Update an existing task
     * PUT /tasks/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest taskRequest) {
        try {
            String username = authentication.getName();
            TaskResponse task = taskService.updateTask(username, id, taskRequest);
            return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
        } catch (RuntimeException e) {
            log.error("Failed to update task {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found or update failed"));
        }
    }

    /**
     * Mark task as completed
     * PUT /tasks/{id}/complete
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<TaskResponse>> markTaskAsCompleted(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String username = authentication.getName();
            TaskResponse task = taskService.markTaskAsCompleted(username, id);
            return ResponseEntity.ok(ApiResponse.success("Task marked as completed", task));
        } catch (RuntimeException e) {
            log.error("Failed to mark task {} as completed: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }

    /**
     * Mark task as pending
     * PUT /tasks/{id}/pending
     */
    @PutMapping("/{id}/pending")
    public ResponseEntity<ApiResponse<TaskResponse>> markTaskAsPending(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String username = authentication.getName();
            TaskResponse task = taskService.markTaskAsPending(username, id);
            return ResponseEntity.ok(ApiResponse.success("Task marked as pending", task));
        } catch (RuntimeException e) {
            log.error("Failed to mark task {} as pending: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }

    /**
     * Delete a task
     * DELETE /tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String username = authentication.getName();
            taskService.deleteTask(username, id);
            return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
        } catch (RuntimeException e) {
            log.error("Failed to delete task {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }

    /**
     * Search tasks
     * GET /tasks/search?q=searchTerm&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> searchTasks(
            Authentication authentication,
            @RequestParam("q") String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            Page<TaskResponse> tasks = taskService.searchTasks(username, searchTerm, page, size);
            return ResponseEntity.ok(ApiResponse.success("Search completed successfully", tasks));
        } catch (RuntimeException e) {
            log.error("Failed to search tasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Search failed"));
        }
    }

    /**
     * Get task statistics
     * GET /tasks/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<TaskService.TaskStatsResponse>> getTaskStats(Authentication authentication) {
        try {
            String username = authentication.getName();
            TaskService.TaskStatsResponse stats = taskService.getTaskStats(username);
            return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", stats));
        } catch (RuntimeException e) {
            log.error("Failed to get task stats: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve statistics"));
        }
    }
}
