import React, { useState } from "react";
import axios from "axios";
import { Modal, Box, Button, TextField, Select, MenuItem, Typography } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 500,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
};

export default function LessonModal({ courseId, userId, onLessonCreated }) {
  const [open, setOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    status: "draft",
    video_url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setNewLesson({ title: "", status: "draft", video_url: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLesson({ ...newLesson, [name]: value });
  };

  const handleCreate = async () => {
    if (!newLesson.title || !newLesson.video_url) {
      
      return;
    }
    if (!courseId || !userId) {
      
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/lessons", {
        title: newLesson.title,
        status: newLesson.status,
        video_url: newLesson.video_url,
        course_id: courseId,
        creator_id: userId,
      });

    

      if (onLessonCreated) onLessonCreated();

      setNewLesson({ title: "", status: "draft", video_url: "" });
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar aula:", error);
      
    }
    setLoading(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Criar Nova Aula
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-lesson-title"
        aria-describedby="modal-lesson-description"
      >
        <Box sx={style}>
          <Typography id="modal-lesson-title" variant="h6" component="h2" mb={2}>
            Criar Nova Aula
          </Typography>

          <TextField
            fullWidth
            label="Título da Aula"
            name="title"
            value={newLesson.title}
            onChange={handleChange}
            margin="dense"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="URL do Vídeo"
            name="video_url"
            value={newLesson.video_url}
            onChange={handleChange}
            margin="dense"
            disabled={loading}
          />

          <Select
            fullWidth
            name="status"
            value={newLesson.status}
            onChange={handleChange}
            margin="dense"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            <MenuItem value="draft">Rascunho</MenuItem>
            <MenuItem value="published">Publicado</MenuItem>
          </Select>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCreate} disabled={loading}>
              {loading ? "Criando..." : "Criar Aula"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
