import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        const filteredCourses = data.filter(
          (course) =>
            course.creator_id === user.id ||
            course.instructor_ids.includes(user.id)
        );
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Erro ao buscar cursos", error);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <span className="dashboard-brand">Dashboard</span>
          <div className="dashboard-user-info">
            {user?.role === "instructor" && (
              <button
                className="btn-create-course"
                onClick={() => navigate("/curso/novo")}
              >
                + Criar Curso
              </button>
            )}
            <span>
              {user?.name} ({user?.role})
            </span>
            <button className="btn-logout" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-course-list">
          <h2 className="dashboard-course-title">Seus Cursos</h2>
          {courses.length === 0 ? (
            <p>Você ainda não está associado a nenhum curso.</p>
          ) : (
            <div className="dashboard-courses-grid">
              {courses.map((course) => (
                <div key={course.course_id} className="dashboard-course-card">
                  <h3 className="dashboard-course-card-title">{course.title}</h3>
                  <p>{course.description}</p>
                  <p>
                    <strong>Início:</strong>{" "}
                    {new Date(course.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Fim:</strong>{" "}
                    {new Date(course.end_date).toLocaleDateString()}
                  </p>
                  <button
                    className="btn-view-course"
                    onClick={() => navigate(`/curso/${course.course_id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
