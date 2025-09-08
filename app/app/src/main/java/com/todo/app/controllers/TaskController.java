package com.todo.app.controllers;

import java.util.ArrayList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.todo.app.models.CompletedEnum;
import com.todo.app.models.PriorityEnum;
import com.todo.app.models.TaskModel;
import com.todo.app.services.TaskService;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    public ArrayList<TaskModel> getTasks() {
        return this.taskService.getTask();
    }

    @GetMapping(path = "/priority/{priorityEnum}")
    public ArrayList<TaskModel> findByPriorityEnum(@PathVariable PriorityEnum priorityEnum) {
        return this.taskService.findByPriorityEnum(priorityEnum);
    }

    @GetMapping(path = "/status/{completedEnum}")
    public ArrayList<TaskModel> findByCompletedEnum(@PathVariable CompletedEnum completedEnum) {
        return this.taskService.findByCompletedEnum(completedEnum);
    }

    @PostMapping
    public TaskModel addTask(@RequestBody TaskModel taskModel) {
        return this.taskService.addTask(taskModel);
    }

    @PutMapping(path = "/{id}")
    public Optional<TaskModel> editTask(@RequestBody TaskModel taskModel, @PathVariable Long id) {
        return this.taskService.editTask(taskModel, id);
    }

    @DeleteMapping(path = "/{id}")
    public void deleteTask(@PathVariable Long id) {
        this.taskService.deleteTask(id);
    }

    @PutMapping(path = "/changeStatus/{id}")
    public Optional<TaskModel> editStatus(@RequestBody TaskModel taskModel, @PathVariable Long id) {
        return this.taskService.editStatus(taskModel, id);
    }
}
