import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Alert from "./Alert";
import Confetti from "react-confetti";
import { initialTasks } from "./tasks";

// Columns for DnD
const columns = ["todo", "in-progress", "done"];

const Board = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0); // Track the total points

  // Function to calculate the remaining time in minutes
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

  // Calculate points based on remaining time (or overdue time)
  const calculatePoints = (dueDate: Date): number => {
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const minutesLeft = Math.floor(timeDiff / 60000); // Time left in minutes

    // If the task is overdue, reduce points based on overdue time
    if (minutesLeft < 0) {
      return Math.max(-minutesLeft, 0); // Deduct points for overdue time
    } else {
      return minutesLeft; // Award points based on remaining minutes
    }
  };

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

    // If task is moved to "done", calculate points based on remaining time or overdue
    if (movedTask.status === "done") {
      const points = calculatePoints(movedTask.dueDate); // Calculate points based on due date
      movedTask.points = points; // Set points for the task
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Show confetti for 3 seconds
    }

    // Update total points, ensuring we are summing only numeric values
    const totalPoints = updatedTasks.reduce((sum, task) => {
      return sum + (isNaN(task.points) ? 0 : task.points); // Safeguard against NaN
    }, 0);
    setTotalPoints(totalPoints); // Update the total points

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

      <div style={{ marginBottom: "20px" }}>
        <h2>Total Points: {totalPoints}</h2>
      </div>

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
