import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editId, setEditId] = useState(null);

  // Load data
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedTheme = JSON.parse(localStorage.getItem("theme"));

    if (savedTasks) setTasks(savedTasks);
    if (savedTheme) setDarkMode(savedTheme);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  // Add or Update Task
  const handleTask = () => {
    if (input.trim() === "") return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? {
                ...task,
                text: input,
                priority,
                category,
              }
            : task
        )
      );

      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: input,
        completed: false,
        priority,
        category,
        date: new Date().toLocaleDateString(),
      };

      setTasks([...tasks, newTask]);
    }

    setInput("");
    setPriority("Medium");
    setCategory("Personal");
  };

  // Complete Task
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit Task
  const editTask = (task) => {
    setInput(task.text);
    setPriority(task.priority);
    setCategory(task.category);
    setEditId(task.id);
  };

  // Clear Completed
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#121212" : "#f4f4f4",
        color: darkMode ? "white" : "black",
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <h1>🚀 TaskFlow Ultimate</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={styles.themeButton}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* Input Section */}
      <div style={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option>Personal</option>
          <option>Work</option>
          <option>Study</option>
        </select>

        <button onClick={handleTask} style={styles.addButton}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <p>📋 Total: {tasks.length}</p>

        <p>
          ✅ Completed:
          {tasks.filter((task) => task.completed).length}
        </p>

        <p>
          ⏳ Pending:
          {tasks.filter((task) => !task.completed).length}
        </p>
      </div>

      {/* Tasks */}
      <div style={styles.taskContainer}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              ...styles.taskCard,
              backgroundColor: darkMode ? "#1f1f1f" : "white",
              borderLeft:
                task.priority === "High"
                  ? "8px solid red"
                  : task.priority === "Medium"
                  ? "8px solid orange"
                  : "8px solid green",
            }}
          >
            <div>
              <h3
                onClick={() => toggleTask(task.id)}
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                  cursor: "pointer",
                }}
              >
                {task.text}
              </h3>

              <p>📂 {task.category}</p>
              <p>⚡ {task.priority}</p>
              <p>📅 {task.date}</p>
            </div>

            <div style={styles.buttonGroup}>
              <button
                onClick={() => editTask(task)}
                style={styles.editButton}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clear Completed */}
      {tasks.length > 0 && (
        <button
          onClick={clearCompleted}
          style={styles.clearButton}
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Arial",
    transition: "0.3s",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  themeButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  searchInput: {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },

  inputSection: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },

  select: {
    padding: "14px",
    borderRadius: "10px",
  },

  addButton: {
    padding: "14px 20px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  stats: {
    display: "flex",
    gap: "20px",
    marginTop: "25px",
    flexWrap: "wrap",
    fontWeight: "bold",
  },

  taskContainer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  taskCard: {
    padding: "20px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
  },

  editButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  clearButton: {
    marginTop: "25px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
  },
};