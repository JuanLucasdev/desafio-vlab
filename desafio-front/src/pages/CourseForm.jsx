import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";

export default function CourseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEdit = Boolean(courseId);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    instructor_ids: [], 
  });

  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [feedback, setFeedback] = useState(null); 

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`http://localhost:3000/courses/${courseId}`)
        .then((res) => {
          const data = res.data;
          setCourse({
            title: data.title,
            description: data.description,
            start_date: format(parseISO(data.start_date), "yyyy-MM-dd"),
            end_date: format(parseISO(data.end_date), "yyyy-MM-dd"),
            instructor_ids: data.instructor_ids || [],
          });
        })
        .catch(() => alert("Erro ao carregar curso para edição."));
    }
  }, [courseId, isEdit]);

  const handleSearchInstructor = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users?role=instructor");
      setInstructors(res.data);
    } catch (error) {
      setFeedback({ type: "error", message: "Erro ao buscar instrutores." });
    }
  };

  const handleAddInstructor = (instructorId) => {
    if (!course.instructor_ids.includes(instructorId)) {
      setCourse((prev) => ({
        ...prev,
        instructor_ids: [...prev.instructor_ids, instructorId],
      }));
      setFeedback({ type: "success", message: "Instrutor adicionado com sucesso!" });
    } else {
      setFeedback({ type: "error", message: "Instrutor já adicionado." });
    }
  };

  const handleRemoveInstructor = (instructorId) => {
    setCourse((prev) => ({
      ...prev,
      instructor_ids: prev.instructor_ids.filter((id) => id !== instructorId),
    }));
    setFeedback({ type: "success", message: "Instrutor removido com sucesso!" });
  };

  const validate = () => {
    if (!course.title || !course.description || !course.start_date || !course.end_date) {
      alert("Todos os campos são obrigatórios.");
      return false;
    }
    if (new Date(course.end_date) <= new Date(course.start_date)) {
      alert("A data de término deve ser posterior à data de início.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    
    const payload = {
      ...course,
      course_id: isEdit ? courseId : `c-${Math.random().toString(36).substr(2, 9)}`, // Gera um ID para novo curso
      creator_id: user.id,
      instructor_ids: course.instructor_ids.map(id => String(id)), // Assegura que os IDs são strings
      status: "draft",
      publish_date: new Date().toISOString(),
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/courses/${courseId}`, payload);
        alert("Curso atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:3000/courses", payload);
        alert("Curso criado com sucesso!");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      alert("Erro ao salvar o curso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", width: "100%" }}>
      <header
        style={{
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid #e5e7eb",
          padding: "0.75rem 1rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="brand">
            <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1f2937" }}>
              {isEdit ? "Editar Curso" : "Novo Curso"}
            </span>
          </div>
          <button
            style={{
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              color: "#374151",
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            Voltar
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1rem",
          width: "100%",
        }}
      >
        <form
          style={{
            flex: 1,
            maxWidth: "448px",
            width: "100%",
            padding: "0",
            backgroundColor: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            borderRadius: "0.5rem",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "1.5rem",
            }}
          >
            {isEdit ? "Editar Curso" : "Cadastrar Curso"}
          </h2>

          <label htmlFor="title" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
            Título
          </label>
          <input
            id="title"
            type="text"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />

          <label htmlFor="description" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
            Descrição
          </label>
          <textarea
            id="description"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
            rows={3}
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />

          <label htmlFor="start_date" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
            Data de Início
          </label>
          <input
            id="start_date"
            type="date"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
            value={course.start_date}
            onChange={(e) => setCourse({ ...course, start_date: e.target.value })}
          />

          <label htmlFor="end_date" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
            Data de Término
          </label>
          <input
            id="end_date"
            type="date"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
            value={course.end_date}
            onChange={(e) => setCourse({ ...course, end_date: e.target.value })}
          />

          <label htmlFor="instructors" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
            Instrutores
          </label>
          <div>
            {course.instructor_ids.map((id) => (
              <div key={id} style={{ marginBottom: "0.5rem" }}>
                <span>Instrutor {id}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInstructor(id)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSearchInstructor}
            style={{
              border: "1px solid #6d28d9",
              backgroundColor: "#6d28d9",
              color: "white",
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Buscar Instrutores
          </button>

          <div style={{ marginTop: "1rem" }}>
            {instructors.length > 0 &&
              instructors.map((instructor) => (
                <div key={instructor.id}>
                  <span>{instructor.name}</span>
                  <button
                    type="button"
                    onClick={() => handleAddInstructor(instructor.id)}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#4caf50",
                      color: "white",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
          </div>

          {feedback && (
            <div
              style={{
                marginTop: "1rem",
                color: feedback.type === "error" ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {feedback.message}
            </div>
          )}

          <button
            style={{
              border: "1px solid #6d28d9",
              backgroundColor: "#6d28d9",
              color: "white",
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "600",
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Curso"}
          </button>
        </form>
      </main>
    </div>
  );
}
