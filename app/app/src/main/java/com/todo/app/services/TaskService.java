package com.todo.app.services;

import java.util.ArrayList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.todo.app.models.CompletedEnum;
import com.todo.app.models.PriorityEnum;
import com.todo.app.models.TaskModel;
import com.todo.app.repositories.ITask;

@Service
public class TaskService {

    @Autowired
    ITask iTask;

    public ArrayList<TaskModel> getTask() {
        return (ArrayList<TaskModel>) iTask.findAll();
    }

    public ArrayList<TaskModel> findByPriorityEnum(PriorityEnum priorityEnum) {
        return (ArrayList<TaskModel>) iTask.findByPriorityEnum(priorityEnum);
    }

    public ArrayList<TaskModel> findByCompletedEnum(CompletedEnum completedEnum) {
        return (ArrayList<TaskModel>) iTask.findByCompletedEnum(completedEnum);
    }

    public TaskModel addTask(TaskModel taskModel) {
        return iTask.save(taskModel);

    }

    public Optional<TaskModel> editStatus(TaskModel taskRequest, Long id) {
        Optional<TaskModel> task = iTask.findById(id);
        task.get().setCompletedEnum(taskRequest.getCompletedEnum());
        iTask.save(task.get());
        return task;
    }

    public Optional<TaskModel> editTask(TaskModel taskRequest, Long id) {
        Optional<TaskModel> task = iTask.findById(id);
        task.get().setTaskName(taskRequest.getTaskName());
        task.get().setDescription(taskRequest.getDescription());
        task.get().setDate(taskRequest.getDate());
        task.get().setTime(taskRequest.getTime());
        task.get().setPriorityEnum(taskRequest.getPriorityEnum());
        iTask.save(task.get());

        return task;
    }

    public void deleteTask(Long id) {
        iTask.deleteById(id);
    }
}
