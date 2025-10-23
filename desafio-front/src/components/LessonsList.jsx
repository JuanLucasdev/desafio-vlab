import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/LessonsList.css"; 
import LessonModal from '../components/LessonModal';

function LessonsList({ courseId, userId, userRole }) {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 3;

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = () => {
    axios
      .get(`http://localhost:3000/lessons?course_id=${courseId}`)
      .then((response) => setLessons(response.data))
      .catch((error) => console.error("Erro ao buscar aulas:", error));
  };

  useEffect(() => {
    let tempLessons = [...lessons];

    if (statusFilter !== "all") {
      tempLessons = tempLessons.filter(
        (lesson) => lesson.status === statusFilter
      );
    }

    if (searchTerm.trim() !== "") {
      tempLessons = tempLessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLessons(tempLessons);
    setCurrentPage(1);
  }, [lessons, searchTerm, statusFilter]);

  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredLessons.slice(
    indexOfFirstLesson,
    indexOfLastLesson
  );

  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const canEditLesson = (lesson) => {
    if (userRole === "creator") return true;
    if (userRole === "instructor" && lesson.creator_id === userId) return true;
    return false;
  };

 
  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(`http://localhost:3000/lessons/${lessonId}`);
      fetchLessons();
    } catch (error) {
      console.error("Erro ao excluir aula:", error);
     
    }
  };

  const handleEditLesson = async (lesson) => {
    const newUrl = prompt("Digite a nova URL do vídeo:", lesson.video_url || "");
    if (!newUrl || newUrl.trim() === "" || newUrl === lesson.video_url) return;

    try {
      await axios.patch(`http://localhost:3000/lessons/${lesson.id}`, {
        video_url: newUrl,
      });

      fetchLessons();
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
    }
  };

  return (
    <div className="lessons-container">
      <div className="lessons-list-wrapper">
        <h3 className="form-title">Aulas</h3>

        <div className="lesson-filter">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />

          {(userRole === "instructor" || userRole === "creator") && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field select-field"
            >
              <option value="all">Todos os status</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
            </select>
          )}
        </div>

        <ul className="lessons-list">
          {currentLessons.length === 0 && <li>Nenhuma aula encontrada.</li>}
          {currentLessons.map((lesson) => (
            <li key={lesson.id} className="lesson-item">
              <img
                src={lesson.video_url}
                alt={`Miniatura da aula ${lesson.title}`}
                className="lesson-thumb"
              />
              <div className="lesson-info">
                <strong>{lesson.title}</strong>
                <p>
                  Status:{" "}
                  {lesson.status === "published" ? "Publicado" : "Rascunho"}
                </p>
              </div>

              {canEditLesson(lesson) && (
                <div className="lesson-actions">
                  <button
                    className="btn-continue small-btn"
                    onClick={() => handleEditLesson(lesson)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-login small-btn"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Anterior
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo &gt;
            </button>
          </div>
        )}
      </div>

      
      {(userRole === "instructor"  ) && (
        <LessonModal
          courseId={courseId}
          userId={userId}
          onLessonCreated={fetchLessons}
        />
      )}
    </div>
  );
}

export default LessonsList;
