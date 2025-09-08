package com.todo.app.repositories;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.app.models.CompletedEnum;
import com.todo.app.models.PriorityEnum;
import com.todo.app.models.TaskModel;

@Repository
public interface ITask extends JpaRepository<TaskModel, Long>{
    ArrayList<TaskModel> findByPriorityEnum(PriorityEnum priorityEnum);
    ArrayList<TaskModel> findByCompletedEnum(CompletedEnum completedEnum);
}
