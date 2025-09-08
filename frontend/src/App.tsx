import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import "./App.css";
import { IoAdd, IoFilter } from "react-icons/io5";

function App() {
  const [status, setStatus] = useState("Uncompleted");
  const [tasks, setTasks] = useState([status]);
  const [showMenu, setShowMenu] = useState(false); // controla visibilidad
  const [editingTaskId, setEditingTaskId] = useState(null); // id de la tarea que se edita
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("Low");
  const toggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const url = status === "All" ? "/tasks" : `/tasks/status/${status}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [status]);

  const handleDelete = (id) => {
    if (!window.confirm("¿Deseas eliminar esta tarea?")) return;
    fetch(`/tasks/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar la tarea");
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleComplete = (id) => {
    if (!window.confirm("¿Completar esta tarea?")) return;

    const updatedTask = { completedEnum: "Completed" };
    fetch(`/tasks/changeStatus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo actualizar la tarea");
        return res.json();
      })
      .then((updatedData) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? updatedData : task))
        );
      })
      .catch((err) => console.error(err));
  };

  const openEditForm = (task) => {
    setName(task.taskName);
    setDescription(task.description);
    setDate(task.date);
    setTime(task.time.slice(0, 5)); // quitar segundos
    setPriority(task.priorityEnum);
    setEditingTaskId(task.id);
    setShowMenu(true);
  };

  const handleSave = () => {
    if (!name || !description || !date || !time) {
      alert("Por favor completa todos los campos");
      return;
    }

    const timeWithSeconds = time.includes(":") ? `${time}:00` : time;

    const taskData = {
      taskName: name,
      description: description,
      date: date,
      time: timeWithSeconds,
      priorityEnum: priority,
      ...(editingTaskId ? {} : { completedEnum: "Uncompleted" }),
    };

    const url = editingTaskId ? `/tasks/${editingTaskId}` : "/tasks";
    const method = editingTaskId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo guardar la tarea");
        return res.json();
      })
      .then((data) => {
        if (editingTaskId) {
          setTasks((prev) =>
            prev.map((task) => (task.id === editingTaskId ? data : task))
          );
        } else {
          setTasks((prev) => [...prev, data]);
        }
        setName("");
        setDescription("");
        setDate("");
        setTime("");
        setPriority("Low");
        setEditingTaskId(null);
        setShowMenu(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      {showMenu && (
        <div
          className="overlay"
          onClick={(e) => {
            if (e.target.classList.contains("overlay")) {
              setShowMenu(false);
              setEditingTaskId(null);
              // Limpiar campos
              setName("");
              setDescription("");
              setDate("");
              setTime("");
              setPriority("Low");
            }
          }}
        >
          <div className="addTask">
            <h2
              style={{
                fontSize: "32px",
                fontFamily: "Luckiest Guy",
                textAlign: "center",
              }}
            >
              {editingTaskId ? "Editar Tarea" : "Nueva Tarea"}
            </h2>

            {/* Nombre */}
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Descripción */}
            <div>
              <label>Descripción:</label>
              <textarea
                placeholder="Descripción de la tarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Fecha */}
            <div>
              <label>Fecha:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Hora */}
            <div>
              <label>Hora:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {/* Prioridad */}
            <div>
              <label>Prioridad:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Botón Guardar */}
            <div>
              <button onClick={handleSave}>
                {editingTaskId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="titulo">Tareas</h1>

      <div className="options">
        <button className="btn-add" onClick={toggleMenu}>
          <IoAdd />
        </button>

        <select
          className="filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Uncompleted">Uncompleted</option>
          <option value="Completed">Completed</option>
          <option value="All">All</option>
        </select>
      </div>

      <div className="grid_completo">
        <div className="grid">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`card ${
                task.completedEnum?.toLowerCase() || "completed"
              }`}
            >
              <div className="card_titulo">{task.taskName}</div>
              <div className="text">{task.description}</div>
              <div className="text">Fecha: {task.date}</div>
              <div className="text">Hora: {task.time}</div>

              <div className="card_footer">
                <div
                  className={`priority ${
                    task.priorityEnum?.toLowerCase() || "low"
                  }`}
                >
                  <span>{task.priorityEnum}</span>
                </div>

                <div className="prioridad">
                  <div className="buttons">
                    <button
                      className="btn-round"
                      onClick={() => openEditForm(task)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-round"
                      onClick={() => handleDelete(task.id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="btn-round"
                      onClick={() => handleComplete(task.id)}
                    >
                      <FaCheck />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
