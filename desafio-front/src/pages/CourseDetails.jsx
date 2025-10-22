import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LessonsList from "../components/LessonsList";
import { useAuth } from "../context/AuthContext";
import MessageModal from "../components/MessageModal";
import "../css/CourseDetails.css"; 

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const { user } = useAuth();

  const [message, setMessage] = useState({ text: "", type: "" });
  const closeMessageModal = useCallback(() => {
    setMessage({ text: "", type: "" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: courses } = await axios.get("http://localhost:3000/courses");
        const foundCourse = courses.find(
          (course) => course.course_id === courseId || String(course.id) === courseId
        );

        if (!foundCourse) {
          setCourse(null);
          return;
        }

        const { data: users } = await axios.get("http://localhost:3000/users");
        const instructors = users.filter((u) =>
          (foundCourse.instructor_ids || []).includes(u.id)
        );

        const creator = users.find((u) => u.id === foundCourse.creator_id);
        if (creator && !instructors.some((i) => i.id === creator.id)) {
          instructors.unshift(creator);
        }

        setCourse({ ...foundCourse, instructors });
      } catch (error) {
        console.error("Erro ao carregar dados do curso:", error);
        setCourse(null);
      }
    };

    fetchData();
  }, [courseId]);

  const handleContinue = () => {
    setMessage({ text: "Curso iniciado com sucesso! (simulação)", type: "success" });
  };

  if (!course) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="course-container">
      <MessageModal message={message.text} type={message.type} onClose={closeMessageModal} />

      <div className="course-header">
        <div className="header-content">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>
        </div>
      </div>

      <main className="main-content">
        <div className="sidebar">
          <div className="info-card">
            <h3 className="section-title">Informações Gerais</h3>
            <p className="info-text">
              <strong>Início:</strong> {new Date(course.start_date).toLocaleDateString()}
            </p>
            <p className="info-text">
              <strong>Fim:</strong> {new Date(course.end_date).toLocaleDateString()}
            </p>

            <button className="primary-btn" onClick={handleContinue}>
              Continuar Curso
            </button>
          </div>

          <div className="info-card">
            <h3 className="section-title">Instrutores</h3>
            <ul className="instructor-list">
              {course.instructors?.length ? (
                course.instructors.map((inst) => (
                  <li key={inst.id} className="instructor-item">
                    <span className="instructor-name">
                      {inst.name}
                      {inst.id === course.creator_id && " (Criador)"}
                    </span>
                    <span className="instructor-email">({inst.email})</span>
                  </li>
                ))
              ) : (
                <li className="instructor-item">Nenhum instrutor cadastrado.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="lesson-area">
          <h2 className="section-title section-border">Conteúdo do Curso</h2>
          <LessonsList courseId={courseId} userId={user?.id} userRole={user?.role} />
        </div>
      </main>
    </div>
  );
}
