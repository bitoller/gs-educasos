import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Nav, Alert, Badge, Spinner, Form, Modal } from 'react-bootstrap';
import { admin, content, kits } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaBook, FaMedkit, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import '../styles/dashboard.css';

const DISASTER_TYPES = {
  FLOOD: { name: 'Enchente', color: 'info', icon: '🌊' },
  LANDSLIDE: { name: 'Deslizamento', color: 'warning', icon: '⛰️' },
  WILDFIRE: { name: 'Queimada', color: 'danger', icon: '🔥' },
  DROUGHT: { name: 'Seca', color: 'warning', icon: '☀️' },
  STORM: { name: 'Tempestade', color: 'primary', icon: '⛈️' }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [contents, setContents] = useState([]);
  const [emergencyKits, setEmergencyKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentForm, setContentForm] = useState({
    title: '',
    disasterType: 'FLOOD',
    description: '',
    videoUrl: '',
    imageUrl: '',
    beforeTips: [''],
    duringTips: [''],
    afterTips: ['']
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Dashboard Administrativo - Disaster Awareness';
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'users':
          const usersResponse = await admin.getAllUsers();
          setUsers(usersResponse.data);
          break;
        case 'content':
          const contentResponse = await content.getAll();
          setContents(contentResponse.data);
          break;
        case 'kits':
          const kitsResponse = await kits.getAll();
          setEmergencyKits(kitsResponse.data);
          break;
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Erro ao carregar dados do dashboard. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingItem(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const handleSaveUserEdit = async () => {
    try {
      await admin.updateUser(editingItem.userId, editForm);
      setUsers(users.map(user => 
        user.userId === editingItem.userId 
          ? { ...user, ...editForm }
          : user
      ));
      setShowEditModal(false);
    } catch (err) {
      setError('Erro ao atualizar usuário. Por favor, tente novamente.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      try {
        await admin.deleteUser(userId);
        setUsers(users.filter(user => user.userId !== userId));
      } catch (err) {
        setError('Erro ao excluir usuário. Por favor, tente novamente.');
      }
    }
  };

  const handleAddContent = async () => {
    try {
      await content.create(contentForm);
      const contentResponse = await content.getAll();
      setContents(contentResponse.data);
      setShowContentModal(false);
      setContentForm({
        title: '',
        disasterType: 'FLOOD',
        description: '',
        videoUrl: '',
        imageUrl: '',
        beforeTips: [''],
        duringTips: [''],
        afterTips: ['']
      });
    } catch (err) {
      setError('Erro ao adicionar conteúdo. Por favor, tente novamente.');
    }
  };

  const handleEditContent = async (contentId) => {
    try {
      const contentToEdit = contents.find(c => c.contentId === contentId);
      setEditingItem(contentToEdit);
      setEditForm({
        title: contentToEdit.title,
        disasterType: contentToEdit.disasterType,
        description: contentToEdit.description,
        videoUrl: contentToEdit.videoUrl,
        imageUrl: contentToEdit.imageUrl,
        beforeTips: contentToEdit.beforeTips || [''],
        duringTips: contentToEdit.duringTips || [''],
        afterTips: contentToEdit.afterTips || ['']
      });
      setShowEditModal(true);
    } catch (err) {
      setError('Erro ao editar conteúdo. Por favor, tente novamente.');
    }
  };

  const handleSaveContentEdit = async () => {
    try {
      await content.update(editingItem.contentId, editForm);
      setContents(contents.map(c => 
        c.contentId === editingItem.contentId 
          ? { ...c, ...editForm }
          : c
      ));
      setShowEditModal(false);
    } catch (err) {
      setError('Erro ao atualizar conteúdo. Por favor, tente novamente.');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.')) {
      try {
        await content.delete(contentId);
        setContents(contents.filter(c => c.contentId !== contentId));
      } catch (err) {
        setError('Erro ao excluir conteúdo. Por favor, tente novamente.');
      }
    }
  };

  const handleUpdateKitStatus = async (kitId, status) => {
    try {
      await kits.update(kitId, { status });
      setEmergencyKits(emergencyKits.map(kit => 
        kit.kitId === kitId 
          ? { ...kit, status }
          : kit
      ));
    } catch (err) {
      setError('Erro ao atualizar status do kit. Por favor, tente novamente.');
    }
  };

  const handleAddTip = (type) => {
    setContentForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const handleRemoveTip = (type, index) => {
    setContentForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleTipChange = (type, index, value) => {
    setContentForm(prev => ({
      ...prev,
      [type]: prev[type].map((tip, i) => i === index ? value : tip)
    }));
  };

  const renderUsersTable = () => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Papel</th>
                <th scope="col">Status</th>
                <th scope="col">Último Acesso</th>
                <th scope="col" className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge 
                      bg={user.role === 'admin' ? 'danger' : 'info'}
                      aria-label={`Papel: ${user.role === 'admin' ? 'Administrador' : 'Usuário'}`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      bg={user.isActive ? 'success' : 'danger'}
                      aria-label={`Status: ${user.isActive ? 'Ativo' : 'Inativo'}`}
                    >
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                  <td>{new Date(user.lastLogin || user.createdAt).toLocaleDateString()}</td>
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

  const renderTipsSection = (title, type) => (
    <div className="mb-4">
      <h5>{title}</h5>
      {contentForm[type].map((tip, index) => (
        <div key={index} className="d-flex mb-2">
          <Form.Control
            type="text"
            value={tip}
            onChange={(e) => handleTipChange(type, index, e.target.value)}
            placeholder={`Digite a dica ${index + 1}`}
          />
          <Button
            variant="danger"
            className="ms-2"
            onClick={() => handleRemoveTip(type, index)}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleAddTip(type)}
        className="mt-2"
      >
        + Adicionar Dica
      </Button>
    </div>
  );

  const renderContentTable = () => {
    const filteredContents = contents.filter(content =>
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
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map(content => (
                <tr key={content.contentId}>
                  <td>{content.title}</td>
                  <td>
                    <Badge 
                      bg={DISASTER_TYPES[content.disasterType]?.color || 'secondary'}
                      className="d-flex align-items-center gap-1"
                      aria-label={`Tipo: ${DISASTER_TYPES[content.disasterType]?.name || content.disasterType}`}
                    >
                      {DISASTER_TYPES[content.disasterType]?.icon} {DISASTER_TYPES[content.disasterType]?.name || content.disasterType}
                    </Badge>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '300px' }}>
                    {content.description}
                  </td>
                  <td>
                    <Badge 
                      bg={content.isPublished ? 'success' : 'warning'}
                      aria-label={`Status: ${content.isPublished ? 'Publicado' : 'Rascunho'}`}
                    >
                      {content.isPublished ? 'Publicado' : 'Rascunho'}
                    </Badge>
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
              ))}
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
    const filteredKits = emergencyKits.filter(kit =>
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
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredKits.map(kit => (
                <tr key={kit.kitId}>
                  <td>{kit.kitId}</td>
                  <td>{kit.houseType}</td>
                  <td>{kit.region}</td>
                  <td>{kit.numResidents}</td>
                  <td>
                    <Badge 
                      bg={kit.status === 'APPROVED' ? 'success' : kit.status === 'PENDING' ? 'warning' : 'danger'}
                      aria-label={`Status: ${kit.status === 'APPROVED' ? 'Aprovado' : kit.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}`}
                    >
                      {kit.status === 'APPROVED' ? 'Aprovado' : kit.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleUpdateKitStatus(kit.kitId, 'APPROVED')}
                        disabled={kit.status === 'APPROVED'}
                        className="d-flex align-items-center gap-1"
                        aria-label="Aprovar kit"
                      >
                        <FaCheck /> Aprovar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleUpdateKitStatus(kit.kitId, 'REJECTED')}
                        disabled={kit.status === 'REJECTED'}
                        className="d-flex align-items-center gap-1"
                        aria-label="Rejeitar kit"
                      >
                        <FaTimes /> Rejeitar
                      </Button>
                    </div>
                  </td>
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
          {editingItem?.name ? `Editar Usuário: ${editingItem.name}` : 'Editar Conteúdo'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {editingItem?.name ? (
            // Formulário de edição de usuário
            <>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-name">Nome</Form.Label>
                <Form.Control
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
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
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  aria-describedby="status-help"
                />
                <Form.Text id="status-help" muted>
                  Determina se o usuário pode acessar o sistema.
                </Form.Text>
              </Form.Group>
            </>
          ) : (
            // Formulário de edição de conteúdo
            <>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-title">Título</Form.Label>
                <Form.Control
                  id="edit-title"
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  aria-describedby="title-help"
                />
                <Form.Text id="title-help" muted>
                  Título do conteúdo educativo.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="edit-disaster-type">Tipo de Desastre</Form.Label>
                <Form.Select
                  id="edit-disaster-type"
                  value={editForm.disasterType}
                  onChange={(e) => setEditForm({ ...editForm, disasterType: e.target.value })}
                  aria-describedby="disaster-type-help"
                >
                  {Object.entries(DISASTER_TYPES).map(([key, { name }]) => (
                    <option key={key} value={key}>{name}</option>
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
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
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
                  onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
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
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
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
          onClick={editingItem?.name ? handleSaveUserEdit : handleSaveContentEdit}
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
        <Modal.Title id="add-content-modal-title">Adicionar Novo Conteúdo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-title">Título</Form.Label>
            <Form.Control
              id="content-title"
              type="text"
              value={contentForm.title}
              onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
              aria-describedby="content-title-help"
            />
            <Form.Text id="content-title-help" muted>
              Título do conteúdo educativo.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="content-disaster-type">Tipo de Desastre</Form.Label>
            <Form.Select
              id="content-disaster-type"
              value={contentForm.disasterType}
              onChange={(e) => setContentForm({ ...contentForm, disasterType: e.target.value })}
              aria-describedby="content-disaster-type-help"
            >
              {Object.entries(DISASTER_TYPES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
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
              onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
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
              onChange={(e) => setContentForm({ ...contentForm, videoUrl: e.target.value })}
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
              onChange={(e) => setContentForm({ ...contentForm, imageUrl: e.target.value })}
              aria-describedby="content-image-help"
            />
            <Form.Text id="content-image-help" muted>
              Link da imagem ilustrativa.
            </Form.Text>
          </Form.Group>

          {['beforeTips', 'duringTips', 'afterTips'].map((tipType, index) => (
            <Form.Group key={tipType} className="mb-4">
              <Form.Label>
                {tipType === 'beforeTips' ? 'Dicas Antes do Desastre' :
                 tipType === 'duringTips' ? 'Dicas Durante o Desastre' :
                 'Dicas Após o Desastre'}
              </Form.Label>
              {contentForm[tipType].map((tip, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={tip}
                    onChange={(e) => handleTipChange(tipType, i, e.target.value)}
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
        <Button 
          variant="secondary" 
          onClick={() => setShowContentModal(false)}
        >
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
    <Container fluid className="mt-5 pt-5">
      <h2 className="mb-4 visually-hidden">Dashboard Administrativo</h2>

      {error && (
        <Alert variant="danger" role="alert" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <Nav 
              variant="tabs" 
              activeKey={activeTab} 
              onSelect={setActiveTab}
              role="tablist"
              className="border-0"
            >
              <Nav.Item role="presentation">
                <Nav.Link 
                  eventKey="users"
                  className="d-flex align-items-center gap-2"
                  role="tab"
                  aria-selected={activeTab === 'users'}
                >
                  <FaUsers /> Usuários
                </Nav.Link>
              </Nav.Item>
              <Nav.Item role="presentation">
                <Nav.Link 
                  eventKey="content"
                  className="d-flex align-items-center gap-2"
                  role="tab"
                  aria-selected={activeTab === 'content'}
                >
                  <FaBook /> Conteúdo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item role="presentation">
                <Nav.Link 
                  eventKey="kits"
                  className="d-flex align-items-center gap-2"
                  role="tab"
                  aria-selected={activeTab === 'kits'}
                >
                  <FaMedkit /> Kits
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Form className="d-flex align-items-center gap-2">
              <Form.Control
                type="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Campo de busca"
                className="shadow-sm"
              />
              <Button variant="outline-primary" aria-label="Buscar">
                <FaSearch />
              </Button>
            </Form>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <Spinner 
                animation="border" 
                role="status" 
                variant="primary"
                style={{ width: '3rem', height: '3rem' }}
              >
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
            </div>
          ) : (
            <div role="tabpanel">
              {activeTab === 'users' && renderUsersTable()}
              {activeTab === 'content' && renderContentTable()}
              {activeTab === 'kits' && renderKitsTable()}
            </div>
          )}
        </Card.Body>
      </Card>

      {renderEditModal()}
      {renderAddContentModal()}

      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{users.length}</h3>
              <Card.Text>Usuários Registrados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{contents.length}</h3>
              <Card.Text>Conteúdos Publicados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{emergencyKits.length}</h3>
              <Card.Text>Kits Criados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{users.reduce((total, user) => total + (user.completedQuizzes || 0), 0)}</h3>
              <Card.Text>Total de Quizzes Realizados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 