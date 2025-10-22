import React, { useState, useEffect } from "react";
import axios from "axios";

function LessonsList({ courseId, userId, userRole }) {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 3;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    status: "draft", // Padrão: rascunho
    video_url: "",
  });

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = () => {
    axios
      .get(`http://localhost:3000/lessons?course_id=${courseId}`)
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar aulas:", error);
      });
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
    if (!window.confirm("Tem certeza que deseja excluir esta aula?")) return;

    try {
      await axios.delete(`http://localhost:3000/lessons/${lessonId}`);
      alert("Aula excluída com sucesso!");
      fetchLessons();
    } catch (error) {
      console.error("Erro ao excluir aula:", error);
      alert("Erro ao excluir a aula.");
    }
  };

  const handleEditLesson = async (lesson) => {
    const newUrl = prompt("Digite a nova URL do vídeo:", lesson.video_url || "");

    if (!newUrl || newUrl.trim() === "" || newUrl === lesson.video_url) return;

    try {
      await axios.patch(`http://localhost:3000/lessons/${lesson.id}`, {
        video_url: newUrl,
      });
      alert("URL do vídeo atualizada!");
      fetchLessons();
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
      alert("Erro ao atualizar a aula.");
    }
  };

  const handleCreateLesson = async () => {
    if (!newLesson.title || !newLesson.video_url) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const lessonData = {
      ...newLesson,
      course_id: courseId,
      creator_id: userId,
      publish_date: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:3000/lessons", lessonData);
      alert("Aula criada com sucesso!");
      setShowCreateForm(false);
      fetchLessons();
    } catch (error) {
      console.error("Erro ao criar aula:", error);
      alert("Erro ao criar a aula.");
    }
  };

  return (
    <div>
      <h3 className="form-title">Aulas</h3>

      {/* Campo de busca — visível para todos */}
      <div className="login-options" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />

        {/* Filtro de status — visível apenas para instrutores ou criadores */}
        {(userRole === "instructor" || userRole === "creator") && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ marginTop: "0.5rem" }}
          >
            <option value="all">Todos os status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
          </select>
        )}
      </div>

      {/* Botão de criar aula — visível apenas para instrutores ou criadores */}
      {(userRole === "instructor") && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-login"
          style={{ marginBottom: "1rem" }}
        >
          Criar Nova Aula
        </button>
      )}

      {/* Formulário de criação — restrito */}
      {showCreateForm && (userRole === "instructor" || userRole === "creator") && (
        <div className="create-lesson-form">
          <h4>Criar Aula</h4>
          <input
            type="text"
            placeholder="Título da Aula"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            className="input-field"
            style={{ marginBottom: "0.5rem" }}
          />
          <input
            type="url"
            placeholder="URL do vídeo"
            value={newLesson.video_url}
            onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
            className="input-field"
            style={{ marginBottom: "0.5rem" }}
          />
          <select
            value={newLesson.status}
            onChange={(e) => setNewLesson({ ...newLesson, status: e.target.value })}
            className="input-field"
            style={{ marginBottom: "1rem" }}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>

          <button onClick={handleCreateLesson} className="btn-login">
            Criar Aula
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            className="btn-cancel"
            style={{ marginLeft: "1rem" }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Lista de aulas */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentLessons.length === 0 && <li>Nenhuma aula encontrada.</li>}

        {currentLessons.map((lesson) => (
          <li
            key={lesson.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              border: "1px solid var(--color-gray-300)",
              borderRadius: "0.5rem",
              padding: "0.5rem",
            }}
          >
            <img
              src={lesson.video_url}
              alt={`Miniatura da aula ${lesson.title}`}
              style={{
                width: "120px",
                height: "68px",
                borderRadius: "0.25rem",
                objectFit: "cover",
                marginRight: "1rem",
              }}
            />

            <div style={{ flexGrow: 1 }}>
              <strong>{lesson.title}</strong>
              <p style={{ fontSize: "0.85rem", color: "var(--color-gray-600)" }}>
                Status: {lesson.status === "published" ? "Publicado" : "Rascunho"}
              </p>
            </div>

            {/* Botões de edição — apenas se puder editar */}
            {canEditLesson(lesson) && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn-continue"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                  onClick={() => handleEditLesson(lesson)}
                >
                  Editar
                </button>
                <button
                  className="btn-login"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  Excluir
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Paginação */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-login"
            style={{ padding: "0.25rem 0.5rem" }}
          >
            &lt; Anterior
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`btn-login ${
                currentPage === i + 1 ? "btn-signup" : ""
              }`}
              style={{ padding: "0.25rem 0.5rem" }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-login"
            style={{ padding: "0.25rem 0.5rem" }}
          >
            Próximo &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default LessonsList;
