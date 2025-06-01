package com.coveragex.todobackend.service;

import com.coveragex.todobackend.dto.TaskRequest;
import com.coveragex.todobackend.dto.TaskResponse;
import com.coveragex.todobackend.entity.Task;
import com.coveragex.todobackend.entity.User;
import com.coveragex.todobackend.repository.TaskRepository;
import com.coveragex.todobackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TaskService
 * Tests business logic without involving the database
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setCompleted(false);
        testTask.setUser(testUser);
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void getRecentTasks_ReturnsTasksSuccessfully() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        List<Task> tasks = Arrays.asList(testTask);
        Page<Task> taskPage = new PageImpl<>(tasks);
        when(taskRepository.findByUserAndCompletedFalseOrderByCreatedAtDesc(eq(testUser), any(Pageable.class)))
            .thenReturn(taskPage);

        // Act
        List<TaskResponse> result = taskService.getRecentTasks("testuser");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Task", result.get(0).getTitle());
        assertEquals("Test Description", result.get(0).getDescription());
        assertFalse(result.get(0).getCompleted());

        verify(taskRepository).findByUserAndCompletedFalseOrderByCreatedAtDesc(eq(testUser), any(Pageable.class));
    }

    @Test
    void createTask_CreatesTaskSuccessfully() {
        // Arrange
        TaskRequest taskRequest = new TaskRequest("New Task", "New Description");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // Act
        TaskResponse result = taskService.createTask("testuser", taskRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void markTaskAsCompleted_MarksTaskSuccessfully() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(testTask)).thenReturn(testTask);

        // Act
        TaskResponse result = taskService.markTaskAsCompleted("testuser", 1L);

        // Assert
        assertNotNull(result);
        assertTrue(testTask.getCompleted());
        verify(taskRepository).save(testTask);
    }

    @Test
    void getRecentTasks_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> taskService.getRecentTasks("nonexistent"));
        
        assertEquals("User not found: nonexistent", exception.getMessage());
    }

    @Test
    void markTaskAsCompleted_TaskNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByIdAndUser(999L, testUser)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> taskService.markTaskAsCompleted("testuser", 999L));
        
        assertEquals("Task not found or access denied", exception.getMessage());
    }
}
