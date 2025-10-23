import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import "../css/CourseForm.css";

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
  const [dateError, setDateError] = useState("");

  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "instructor") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  
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
        .catch(() => {
          setFeedback({
            type: "error",
            message: "Erro ao carregar curso para edição.",
          });
        });
    }
  }, [courseId, isEdit]);

  
  const handleSearchInstructor = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users?role=instructor");
      setInstructors(res.data);
      setFeedback({ type: "success", message: "Instrutores carregados." });
    } catch {
      setFeedback({ type: "error", message: "Erro ao buscar instrutores." });
    }
  };

  // 🆕 Criar novo instrutor via API externa
  const handleCreateInstructor = async () => {
    try {
      const res = await axios.get("https://randomuser.me/api/");
      const userData = res.data.results[0];
      const newInstructor = {
        id: String(Date.now()),
        name: `${userData.name.first} ${userData.name.last}`,
        email: userData.email,
        role: "instructor",
      };

      await axios.post("http://localhost:3000/users", newInstructor);

      setInstructors((prev) => [...prev, newInstructor]);
      setFeedback({
        type: "success",
        message: `Instrutor ${newInstructor.name} criado com sucesso!`,
      });
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Erro ao criar novo instrutor." });
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
      setFeedback({ type: "error", message: "Todos os campos são obrigatórios." });
      return false;
    }
    if (new Date(course.end_date) <= new Date(course.start_date)) {
      setDateError("A data de término deve ser posterior à data de início.");
      return false;
    }
    setDateError("");
    return true;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      ...course,
      course_id: isEdit ? courseId : `c-${Math.random().toString(36).substr(2, 9)}`,
      creator_id: user.id,
      instructor_ids: course.instructor_ids.map((id) => String(id)),
      status: "draft",
      publish_date: new Date().toISOString(),
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/courses/${courseId}`, payload);
        setFeedback({ type: "success", message: "Curso atualizado com sucesso!" });
      } else {
        await axios.post("http://localhost:3000/courses", payload);
        setFeedback({ type: "success", message: "Curso criado com sucesso!" });
      }

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      setFeedback({ type: "error", message: "Erro ao salvar o curso." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-container">
      <header className="course-header">
        <div className="course-header-content">
          <span className="course-header-title">
            {isEdit ? "Editar Curso" : "Novo Curso"}
          </span>
          <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
            Voltar
          </button>
        </div>
      </header>

      <main className="course-main">
        <form onSubmit={handleSubmit} className="course-form">
          <h2 className="form-title">
            {isEdit ? "Editar Curso" : "Cadastrar Curso"}
          </h2>

          <label>Título</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />

          <label>Descrição</label>
          <textarea
            rows={3}
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />

          <label>Data de Início</label>
          <input
            type="date"
            value={course.start_date}
            onChange={(e) => setCourse({ ...course, start_date: e.target.value })}
          />

          <label>Data de Término</label>
          <input
            type="date"
            value={course.end_date}
            onChange={(e) => setCourse({ ...course, end_date: e.target.value })}
          />
          {dateError && <span className="error-text">{dateError}</span>}

          <label>Instrutores</label>
          <div>
            {course.instructor_ids.map((id) => (
              <div key={id} className="instructor-item">
                <span>Instrutor {id}</span>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => handleRemoveInstructor(id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="instructor-actions">
            <button type="button" className="btn-primary" onClick={handleSearchInstructor}>
              Buscar Instrutores
            </button>
            <button type="button" className="btn-secondary" onClick={handleCreateInstructor}>
              Novo Instrutor
            </button>
          </div>

          {instructors.length > 0 && (
            <div className="instructor-list">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="instructor-item">
                  <span>{instructor.name}</span>
                  <button
                    type="button"
                    className="btn-add"
                    onClick={() => handleAddInstructor(instructor.id)}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}

          {feedback && (
            <div className={`feedback ${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary submit">
            {loading ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Curso"}
          </button>
        </form>
      </main>
    </div>
  );
}
