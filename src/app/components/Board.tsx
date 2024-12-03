import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Alert from "./Alert";
import Confetti from "react-confetti";

// Sample tasks
const initialTasks = [
  {
    id: "task11",
    text: "Complete project documentation",
    dueDate: new Date(Date.now() + 3600 * 1000), // 1 hour from now
    status: "todo",
  },
  {
    id: "task12",
    text: "Review pull requests",
    dueDate: new Date(Date.now() + 600 * 1000), // In 10 minutes
    status: "todo",
  },
  {
    id: "task1r3",
    text: "Update team on project progress",
    dueDate: new Date(Date.now() + 3600 * 1000), // In 1 hour
    status: "todo",
  },
  {
    id: "task1",
    text: "Complete project documentation",
    dueDate: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    status: "todo",
  },
  {
    id: "task2",
    text: "Review pull requests",
    dueDate: new Date(Date.now() + 600 * 1000), // In 10 minutes
    status: "todo",
  },
  {
    id: "task3",
    text: "Update team on project progress",
    dueDate: new Date(Date.now() + 3600 * 1000), // In 1 hour
    status: "todo",
  },
  {
    id: "task4",
    text: "Submit end-of-week report",
    dueDate: new Date(Date.now() - 600 * 1000), // 10 minutes ago
    status: "todo",
  },
  {
    id: "task5",
    text: "Fix bug in login feature",
    dueDate: new Date(Date.now() + 2 * 3600 * 1000), // In 2 hours
    status: "todo",
  },
  {
    id: "task6",
    text: "Prepare for client presentation",
    dueDate: new Date(Date.now() + 24 * 3600 * 1000), // In 24 hours
    status: "todo",
  },
  {
    id: "task7",
    text: "Deploy latest build to production",
    dueDate: new Date(Date.now() - 24 * 3600 * 1000), // 24 hours ago
    status: "todo",
  },
  {
    id: "task8",
    text: "Organize design review meeting",
    dueDate: new Date(Date.now() + 1800 * 1000), // In 30 minutes
    status: "todo",
  },
  {
    id: "task9",
    text: "Optimize database queries",
    dueDate: new Date(Date.now() - 1800 * 1000), // 30 minutes ago
    status: "todo",
  },
  {
    id: "task10",
    text: "Refactor authentication module",
    dueDate: new Date(Date.now() + 12 * 3600 * 1000), // In 12 hours
    status: "todo",
  },
];

// Columns for DnD
const columns = ["todo", "in-progress", "done"];

const Board = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Function to calculate the remaining time
  const getRemainingTime = (dueDate: Date): string => {
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();

    // If the task is overdue
    if (timeDiff <= 0) return "Overdue";

    // Convert the time difference into a readable format
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} hours left`;
    } else if (minutes > 0) {
      return `${minutes} minutes left`;
    } else {
      return `${seconds} seconds left`;
    }
  };

  // Check due dates and show alerts
  const checkDueDates = () => {
    const now = new Date();

    tasks.forEach((task) => {
      const timeDifference = task.dueDate.getTime() - now.getTime();

      if (timeDifference <= 0 && timeDifference > -600000) {
        // Task is overdue, within the last 10 minutes
        if (task.status === "done") {
          setAlertMessage(`${task.text} is now due!`);
          setTaskId(task.id);
          setShowAlert(true);
        }
      } else if (timeDifference > 0 && timeDifference <= 1800000) {
        // Task is almost due, within the next 30 minutes
        if (task.status === "done") {
          setAlertMessage(`${task.text} is almost due!`);
          setTaskId(task.id);
          setShowAlert(true);
        }
      }
    });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage(null);
    setTaskId(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkDueDates();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [tasks]);

  // Handle DnD functionality
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // Reordering tasks within the same column
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId; // Update task status
    updatedTasks.splice(destination.index, 0, movedTask);

    // If task is moved to "done" and is due or almost due, show confetti
    if (movedTask.status === "done") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Show confetti for 3 seconds
    }

    setTasks(updatedTasks);
  };

  return (
    <div>
      {showAlert && alertMessage && (
        <Alert message={alertMessage} onClose={handleCloseAlert} />
      )}

      {/* Confetti effect triggered when a task is completed */}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <Droppable droppableId={column} key={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={columnStyle}
              >
                <h3>{column.toUpperCase()}</h3>
                {tasks
                  .filter((task) => task.status === column)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...taskStyle,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {task.text}
                          <div style={timeLeftStyle}>
                            {getRemainingTime(task.dueDate)}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

// Styles for the board and tasks
const columnStyle: React.CSSProperties = {
  padding: "20px",
  margin: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  width: "200px",
  display: "inline-block",
  verticalAlign: "top",
};

const taskStyle: React.CSSProperties = {
  padding: "10px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
  position: "relative", // To position the time remaining text
};

const timeLeftStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#888",
  marginTop: "5px",
};

export default Board;
