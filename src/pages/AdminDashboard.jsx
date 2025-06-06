import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Nav,
  Alert,
  Badge,
  Spinner,
  Form,
  Modal,
} from "react-bootstrap";
import { admin, content, kits } from "../services/api";
import {
  FaUsers,
  FaBook,
  FaMedkit,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
} from "react-icons/fa";
import "../styles/dashboard.css";
import {
  translateDisasterType,
  getDisasterDescription,
} from "../utils/translations";

const DISASTER_TYPES = {
  FLOOD: { name: "Enchente", color: "info", icon: "🌊" },
  LANDSLIDE: { name: "Deslizamento", color: "warning", icon: "⛰️" },
  WILDFIRE: { name: "Queimada", color: "danger", icon: "🔥" },
  DROUGHT: { name: "Seca", color: "warning", icon: "☀️" },
  STORM: { name: "Tempestade", color: "primary", icon: "⛈️" },
};

const getDisasterIcon = (type) => {
  // Padroniza o ícone conforme LearnDisasters
  const translatedType = translateDisasterType(type);
  const icons = {
    ENCHENTE: "💧",
    TERREMOTO: "⚡",
    INCENDIO: "🔥",
    FURACAO: "🌀",
    TORNADO: "🌪️",
    DESLIZAMENTO: "⛰️",
    SECA: "☀️",
    TSUNAMI: "🌊",
    TEMPESTADE: "⛈️",
    default: "⚠️",
  };
  return icons[translatedType] || icons.default;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [contents, setContents] = useState([]);
  const [emergencyKits, setEmergencyKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentForm, setContentForm] = useState({
    title: "",
    disasterType: "FLOOD",
    description: "",
    videoUrl: "",
    imageUrl: "",
    beforeTips: [""],
    duringTips: [""],
    afterTips: [""],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [contentsLoaded, setContentsLoaded] = useState(false);
  const [kitsLoaded, setKitsLoaded] = useState(false);

  useEffect(() => {
    document.title = "Dashboard Administrativo - Disaster Awareness";
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setError("");
    switch (activeTab) {
      case "users":
        if (!usersLoaded) {
          setLoading(true);
          try {
            const usersResponse = await admin.getAllUsers();
            setUsers(usersResponse.data);
            setUsersLoaded(true);
          } catch {
            setError(
              "Erro ao carregar dados do dashboard. Por favor, tente novamente mais tarde."
            );
          } finally {
            setLoading(false);
          }
        }
        break;
      case "content":
        if (!contentsLoaded) {
          setLoading(true);
          try {
            const contentResponse = await content.getAll();
            setContents(contentResponse.data);
            setContentsLoaded(true);
          } catch {
            setError(
              "Erro ao carregar dados do dashboard. Por favor, tente novamente mais tarde."
            );
          } finally {
            setLoading(false);
          }
        }
        break;
      case "kits":
        if (!kitsLoaded) {
          setLoading(true);
          try {
            const kitsResponse = await kits.getAll();
            setEmergencyKits(kitsResponse.data);
            setKitsLoaded(true);
          } catch {
            setError(
              "Erro ao carregar dados do dashboard. Por favor, tente novamente mais tarde."
            );
          } finally {
            setLoading(false);
          }
        }
        break;
      default:
        break;
    }
  };

  const forceReloadTab = async (tab) => {
    switch (tab) {
      case "users":
        setUsersLoaded(false);
        setLoading(true);
        try {
          const usersResponse = await admin.getAllUsers();
          setUsers(usersResponse.data);
          setUsersLoaded(true);
        } catch {
          setError("Erro ao recarregar usuários.");
        } finally {
          setLoading(false);
        }
        break;
      case "content":
        setContentsLoaded(false);
        setLoading(true);
        try {
          const contentResponse = await content.getAll();
          setContents(contentResponse.data);
          setContentsLoaded(true);
        } catch {
          setError("Erro ao recarregar conteúdos.");
        } finally {
          setLoading(false);
        }
        break;
      case "kits":
        setKitsLoaded(false);
        setLoading(true);
        try {
          const kitsResponse = await kits.getAll();
          setEmergencyKits(kitsResponse.data);
          setKitsLoaded(true);
        } catch {
          setError("Erro ao recarregar kits.");
        } finally {
          setLoading(false);
        }
        break;
      default:
        break;
    }
  };

  const handleEditUser = (user) => {
    setEditingItem(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const handleSaveUserEdit = async () => {
    try {
      await admin.updateUser(editingItem.userId, editForm);
      await forceReloadTab("users");
      setShowEditModal(false);
    } catch {
      setError("Erro ao atualizar usuário. Por favor, tente novamente.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
      )
    ) {
      setError(null);
      try {
        const response = await admin.deleteUser(userId);
        if (response.status === 200) {
          setUsers(users.filter((user) => user.userId !== userId));
          setError(null);
        }
        await forceReloadTab("users");
      } catch (err) {
        console.error("Error deleting user:", err);

        if (
          err.response?.data?.message &&
          err.response.data.message.includes("ORA-02292")
        ) {
          setError(
            "Não foi possível excluir o usuário. Este usuário possui kits de emergência associados. Por favor, exclua os kits primeiro."
          );
        } else if (err.message && err.message.includes("ORA-02292")) {
          setError(
            "Não foi possível excluir o usuário. Este usuário possui kits de emergência associados. Por favor, exclua os kits primeiro."
          );
        } else if (
          err.response?.data?.error &&
          typeof err.response.data.error === "string" &&
          err.response.data.error.includes("integrity constraint")
        ) {
          setError(
            "Não foi possível excluir o usuário. Este usuário possui dados associados (como kits de emergência). Por favor, remova os dados associados antes."
          );
        } else {
          setError("Erro ao excluir usuário. Por favor, tente novamente.");
        }
      }
    }
  };

  const handleAddContent = async () => {
    try {
      await content.create(contentForm);
      await forceReloadTab("content");
      setShowContentModal(false);
      setContentForm({
        title: "",
        disasterType: "FLOOD",
        description: "",
        videoUrl: "",
        imageUrl: "",
        beforeTips: [""],
        duringTips: [""],
        afterTips: [""],
      });
    } catch {
      setError("Erro ao adicionar conteúdo. Por favor, tente novamente.");
    }
  };

  const handleEditContent = async (contentId) => {
    try {
      const contentToEdit = contents.find((c) => c.contentId === contentId);
      setEditingItem(contentToEdit);
      setEditForm({
        title: contentToEdit.title,
        disasterType: contentToEdit.disasterType,
        description: contentToEdit.description,
        videoUrl: contentToEdit.videoUrl,
        imageUrl: contentToEdit.imageUrl,
        beforeTips: contentToEdit.beforeTips || [""],
        duringTips: contentToEdit.duringTips || [""],
        afterTips: contentToEdit.afterTips || [""],
      });
      setShowEditModal(true);
    } catch {
      setError("Erro ao editar conteúdo. Por favor, tente novamente.");
    }
  };

  const handleSaveContentEdit = async () => {
    try {
      await content.update(editingItem.contentId, editForm);
      await forceReloadTab("content");
      setShowEditModal(false);
    } catch {
      setError("Erro ao atualizar conteúdo. Por favor, tente novamente.");
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await content.delete(contentId);
        await forceReloadTab("content");
      } catch {
        setError("Erro ao excluir conteúdo. Por favor, tente novamente.");
      }
    }
  };

  const handleAddTip = (type) => {
    setContentForm((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }));
  };

  const handleRemoveTip = (type, index) => {
    setContentForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleTipChange = (type, index, value) => {
    setContentForm((prev) => ({
      ...prev,
      [type]: prev[type].map((tip, i) => (i === index ? value : tip)),
    }));
  };

  const renderUsersTable = () => {
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Usuários</h4>
          <Form
            className="w-auto"
            style={{
              background: "rgba(30,41,59,0.7)",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              padding: 4,
            }}
          >
            <Form.Control
              type="search"
              placeholder="Pesquisar usuário"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                minWidth: 220,
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                transition: "border-color 0.2s",
                "::placeholder": { color: "#fff", opacity: 1 },
              }}
              className="shadow-sm white-placeholder"
            />
          </Form>
        </div>
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Papel</th>
                <th scope="col" className="text-end">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge
                      bg={
                        user.role === "admin" || user.isAdmin
                          ? "danger"
                          : "info"
                      }
                      aria-label={`Papel: ${
                        user.role === "admin" || user.isAdmin
                          ? "Administrador"
                          : "Usuário"
                      }`}
                    >
                      {user.role === "admin" || user.isAdmin
                        ? "Administrador"
                        : "Usuário"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="d-flex align-items-center gap-1"
                        aria-label={`Editar usuário ${user.name}`}
                      >
                        <FaEdit /> Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.userId)}
                        className="d-flex align-items-center gap-1"
                        aria-label={`Excluir usuário ${user.name}`}
                      >
                        <FaTrash /> Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {filteredUsers.length === 0 && (
          <Alert variant="info" role="alert">
            Nenhum usuário encontrado com o termo "{searchTerm}".
          </Alert>
        )}
      </>
    );
  };

  const renderContentTable = () => {
    const filteredContents = contents.filter(
      (content) =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="success"
            onClick={() => setShowContentModal(true)}
            className="d-flex align-items-center gap-2"
            aria-label="Adicionar novo conteúdo"
          >
            <FaPlus /> Novo Conteúdo
          </Button>
        </div>

        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Tipo</th>
                <th scope="col">Descrição</th>
                <th scope="col" className="text-end">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((content) => {
                const translatedType = translateDisasterType(
                  content.disasterType?.toUpperCase?.() || content.disasterType
                );
                const icon = getDisasterIcon(content.disasterType);
                const name = getDisasterDescription(translatedType);
                return (
                  <tr key={content.contentId}>
                    <td>{content.title}</td>
                    <td>
                      <Badge
                        bg="secondary"
                        className="d-flex align-items-center gap-1"
                        aria-label={`Tipo: ${name}`}
                      >
                        <span style={{ fontSize: 20 }}>{icon}</span> {name}
                      </Badge>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "300px" }}>
                      {content.description}
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditContent(content.contentId)}
                          className="d-flex align-items-center gap-1"
                          aria-label={`Editar conteúdo ${content.title}`}
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteContent(content.contentId)}
                          className="d-flex align-items-center gap-1"
                          aria-label={`Excluir conteúdo ${content.title}`}
                        >
                          <FaTrash /> Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        {filteredContents.length === 0 && (
          <Alert variant="info" role="alert">
            Nenhum conteúdo encontrado com o termo "{searchTerm}".
          </Alert>
        )}
      </>
    );
  };

  const renderKitsTable = () => {
    const filteredKits = emergencyKits.filter(
      (kit) =>
        kit.houseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tipo de Casa</th>
                <th scope="col">Região</th>
                <th scope="col">Moradores</th>
              </tr>
            </thead>
            <tbody>
              {filteredKits.map((kit) => (
                <tr key={kit.kitId}>
                  <td>{kit.kitId}</td>
                  <td>{kit.houseType}</td>
                  <td>{kit.region}</td>
                  <td>{kit.numResidents || kit.residents}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {filteredKits.length === 0 && (
          <Alert variant="info" role="alert">
            Nenhum kit encontrado com o termo "{searchTerm}".
          </Alert>
        )}
      </>
    );
  };

  const renderEditModal = () => (
    <Modal
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      aria-labelledby="edit-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="edit-modal-title">
          {editingItem?.name
            ? `Editar Usuário: ${editingItem.name}`
            : "Editar Conteúdo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {editingItem?.name ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-name">Nome</Form.Label>
                <Form.Control
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  aria-describedby="name-help"
                />
                <Form.Text id="name-help" muted>
                  Nome completo do usuário.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-email">Email</Form.Label>
                <Form.Control
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  aria-describedby="email-help"
                />
                <Form.Text id="email-help" muted>
                  Email principal do usuário.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-role">Papel</Form.Label>
                <Form.Select
                  id="edit-role"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  aria-describedby="role-help"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
                <Form.Text id="role-help" muted>
                  Nível de acesso do usuário no sistema.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="edit-status"
                  label="Usuário Ativo"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.checked })
                  }
                  aria-describedby="status-help"
                />
                <Form.Text id="status-help" muted>
                  Determina se o usuário pode acessar o sistema.
                </Form.Text>
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-title">Título</Form.Label>
                <Form.Control
                  id="edit-title"
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  aria-describedby="title-help"
                />
                <Form.Text id="title-help" muted>
                  Título do conteúdo educativo.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-disaster-type">
                  Tipo de Desastre
                </Form.Label>
                <Form.Select
                  id="edit-disaster-type"
                  value={editForm.disasterType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, disasterType: e.target.value })
                  }
                  aria-describedby="disaster-type-help"
                >
                  {Object.entries(DISASTER_TYPES).map(([key, { name }]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text id="disaster-type-help" muted>
                  Categoria do desastre natural.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-description">Descrição</Form.Label>
                <Form.Control
                  id="edit-description"
                  as="textarea"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  aria-describedby="description-help"
                />
                <Form.Text id="description-help" muted>
                  Breve descrição do conteúdo.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-video">URL do Vídeo</Form.Label>
                <Form.Control
                  id="edit-video"
                  type="url"
                  value={editForm.videoUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, videoUrl: e.target.value })
                  }
                  aria-describedby="video-help"
                />
                <Form.Text id="video-help" muted>
                  Link do vídeo explicativo (YouTube, Vimeo, etc).
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-image">URL da Imagem</Form.Label>
                <Form.Control
                  id="edit-image"
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, imageUrl: e.target.value })
                  }
                  aria-describedby="image-help"
                />
                <Form.Text id="image-help" muted>
                  Link da imagem ilustrativa.
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowEditModal(false)}
          className="d-flex align-items-center gap-2"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={
            editingItem?.name ? handleSaveUserEdit : handleSaveContentEdit
          }
          className="d-flex align-items-center gap-2"
        >
          <FaCheck /> Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderAddContentModal = () => (
    <Modal
      show={showContentModal}
      onHide={() => setShowContentModal(false)}
      size="lg"
      aria-labelledby="add-content-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="add-content-modal-title">
          Adicionar Novo Conteúdo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-title">Título</Form.Label>
            <Form.Control
              id="content-title"
              type="text"
              value={contentForm.title}
              onChange={(e) =>
                setContentForm({ ...contentForm, title: e.target.value })
              }
              aria-describedby="content-title-help"
            />
            <Form.Text id="content-title-help" muted>
              Título do conteúdo educativo.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-disaster-type">
              Tipo de Desastre
            </Form.Label>
            <Form.Select
              id="content-disaster-type"
              value={contentForm.disasterType}
              onChange={(e) =>
                setContentForm({ ...contentForm, disasterType: e.target.value })
              }
              aria-describedby="content-disaster-type-help"
            >
              {Object.entries(DISASTER_TYPES).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </Form.Select>
            <Form.Text id="content-disaster-type-help" muted>
              Categoria do desastre natural.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-description">Descrição</Form.Label>
            <Form.Control
              id="content-description"
              as="textarea"
              rows={3}
              value={contentForm.description}
              onChange={(e) =>
                setContentForm({ ...contentForm, description: e.target.value })
              }
              aria-describedby="content-description-help"
            />
            <Form.Text id="content-description-help" muted>
              Breve descrição do conteúdo.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-video">URL do Vídeo</Form.Label>
            <Form.Control
              id="content-video"
              type="url"
              value={contentForm.videoUrl}
              onChange={(e) =>
                setContentForm({ ...contentForm, videoUrl: e.target.value })
              }
              aria-describedby="content-video-help"
            />
            <Form.Text id="content-video-help" muted>
              Link do vídeo explicativo (YouTube, Vimeo, etc).
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-image">URL da Imagem</Form.Label>
            <Form.Control
              id="content-image"
              type="url"
              value={contentForm.imageUrl}
              onChange={(e) =>
                setContentForm({ ...contentForm, imageUrl: e.target.value })
              }
              aria-describedby="content-image-help"
            />
            <Form.Text id="content-image-help" muted>
              Link da imagem ilustrativa.
            </Form.Text>
          </Form.Group>

          {["beforeTips", "duringTips", "afterTips"].map((tipType) => (
            <Form.Group key={tipType} className="mb-4">
              <Form.Label>
                {tipType === "beforeTips"
                  ? "Dicas Antes do Desastre"
                  : tipType === "duringTips"
                  ? "Dicas Durante o Desastre"
                  : "Dicas Após o Desastre"}
              </Form.Label>
              {contentForm[tipType].map((tip, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={tip}
                    onChange={(e) =>
                      handleTipChange(tipType, i, e.target.value)
                    }
                    placeholder="Digite uma dica..."
                    aria-label={`Dica ${i + 1}`}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveTip(tipType, i)}
                    disabled={contentForm[tipType].length === 1}
                    aria-label="Remover dica"
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleAddTip(tipType)}
                className="mt-2"
              >
                <FaPlus /> Adicionar Dica
              </Button>
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowContentModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={handleAddContent}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus /> Adicionar Conteúdo
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div
      style={{
        background: "var(--dark-bg, #0a1120)",
        minHeight: "100vh",
        paddingTop: 40,
      }}
    >
      <Container className="py-5">
        <Card
          className="shadow mb-4"
          style={{
            background: "var(--card-bg, #1e293b)",
            color: "var(--text-primary)",
            border: "none",
            borderRadius: 16,
          }}
        >
          <Card.Body>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(tab) => {
                setActiveTab(tab);
                setError("");
              }}
              className="mb-4 border-0"
              style={{ background: "transparent" }}
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="users"
                  style={{
                    color:
                      activeTab === "users"
                        ? "var(--accent-color)"
                        : "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  <FaUsers className="me-2" /> Usuários
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="content"
                  style={{
                    color:
                      activeTab === "content"
                        ? "var(--accent-color)"
                        : "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  <FaBook className="me-2" /> Conteúdo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="kits"
                  style={{
                    color:
                      activeTab === "kits"
                        ? "var(--accent-color)"
                        : "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  <FaMedkit className="me-2" /> Kits
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {error && (
              <Alert
                variant="danger"
                className="mb-4"
                style={{ fontWeight: 500 }}
              >
                {error}
              </Alert>
            )}
            {loading &&
            !(
              (activeTab === "users" && usersLoaded) ||
              (activeTab === "content" && contentsLoaded) ||
              (activeTab === "kits" && kitsLoaded)
            ) ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  role="status"
                  variant="primary"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Carregando...</span>
                </Spinner>
              </div>
            ) : (
              <div role="tabpanel">
                {activeTab === "users" && renderUsersTable()}
                {activeTab === "content" && renderContentTable()}
                {activeTab === "kits" && renderKitsTable()}
              </div>
            )}
          </Card.Body>
        </Card>
        {renderEditModal()}
        {renderAddContentModal()}
        {/* Cards de estatísticas no final do dashboard */}
        <Row className="mt-4">
          <Col md={3}>
            <Card
              className="text-center shadow-sm mb-3"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1e293b 100%)",
                color: "var(--text-primary)",
                border: "none",
                borderRadius: 16,
              }}
            >
              <Card.Body>
                <h3 style={{ fontWeight: 700 }}>{users.length}</h3>
                <Card.Text style={{ color: "var(--text-secondary)" }}>
                  Usuários Registrados
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="text-center shadow-sm mb-3"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #1e293b 100%)",
                color: "var(--text-primary)",
                border: "none",
                borderRadius: 16,
              }}
            >
              <Card.Body>
                <h3 style={{ fontWeight: 700 }}>{contents.length}</h3>
                <Card.Text style={{ color: "var(--text-secondary)" }}>
                  Conteúdos Publicados
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="text-center shadow-sm mb-3"
              style={{
                background: "linear-gradient(135deg, #0891b2 0%, #1e293b 100%)",
                color: "var(--text-primary)",
                border: "none",
                borderRadius: 16,
              }}
            >
              <Card.Body>
                <h3 style={{ fontWeight: 700 }}>{emergencyKits.length}</h3>
                <Card.Text style={{ color: "var(--text-secondary)" }}>
                  Kits Criados
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
