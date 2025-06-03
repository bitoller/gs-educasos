import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Nav, Alert, Badge, Spinner, Form, Modal } from 'react-bootstrap';
import { admin, content, kits } from '../services/api';

const AdminDashboard = () => {
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
    disasterType: '',
    description: '',
    videoUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
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
      setError('Erro ao carregar dados do dashboard.');
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
      setError('Erro ao atualizar usuário.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await admin.deleteUser(userId);
        setUsers(users.filter(user => user.userId !== userId));
      } catch (err) {
        setError('Erro ao excluir usuário.');
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
        disasterType: '',
        description: '',
        videoUrl: '',
        imageUrl: ''
      });
    } catch (err) {
      setError('Erro ao adicionar conteúdo.');
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
        imageUrl: contentToEdit.imageUrl
      });
      setShowEditModal(true);
    } catch (err) {
      setError('Erro ao editar conteúdo.');
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
      setError('Erro ao atualizar conteúdo.');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Tem certeza que deseja excluir este conteúdo?')) {
      try {
        await content.delete(contentId);
        setContents(contents.filter(c => c.contentId !== contentId));
      } catch (err) {
        setError('Erro ao excluir conteúdo.');
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
      setError('Erro ao atualizar status do kit.');
    }
  };

  const renderUsersTable = () => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Papel</th>
          <th>Status</th>
          <th>Último Acesso</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.userId}>
            <td>{user.userId}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <Badge bg={user.role === 'admin' ? 'danger' : 'info'}>
                {user.role}
              </Badge>
            </td>
            <td>
              <Badge bg={user.isActive ? 'success' : 'danger'}>
                {user.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </td>
            <td>{new Date(user.lastLogin || user.createdAt).toLocaleDateString()}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => handleEditUser(user)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteUser(user.userId)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderContentTable = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Conteúdo Educacional</h4>
        <Button variant="success" onClick={() => setShowContentModal(true)}>
          Adicionar Novo Conteúdo
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Visualizações</th>
            <th>Última Atualização</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contents.map(content => (
            <tr key={content.contentId}>
              <td>{content.contentId}</td>
              <td>{content.title}</td>
              <td>{content.disasterType}</td>
              <td>{content.views || 0}</td>
              <td>{new Date(content.updatedAt).toLocaleDateString()}</td>
              <td>
                <Badge bg={content.isPublished ? 'success' : 'warning'}>
                  {content.isPublished ? 'Publicado' : 'Rascunho'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditContent(content.contentId)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteContent(content.contentId)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderKitsTable = () => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuário</th>
          <th>Tipo</th>
          <th>Região</th>
          <th>Status</th>
          <th>Criado em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {emergencyKits.map(kit => (
          <tr key={kit.kitId}>
            <td>{kit.kitId}</td>
            <td>{kit.userId}</td>
            <td>{kit.houseType}</td>
            <td>{kit.region}</td>
            <td>
              <Form.Select
                size="sm"
                value={kit.status}
                onChange={(e) => handleUpdateKitStatus(kit.kitId, e.target.value)}
              >
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </Form.Select>
            </td>
            <td>{new Date(kit.createdAt).toLocaleDateString()}</td>
            <td>
              <Button
                variant="outline-info"
                size="sm"
                className="me-2"
                onClick={() => window.location.href = `/emergency-kits/${kit.kitId}`}
              >
                Ver Detalhes
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteKit(kit.kitId)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderEditModal = () => (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingItem?.name ? `Editar Usuário: ${editingItem.name}` : 'Editar Conteúdo'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {activeTab === 'users' ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Papel</Form.Label>
              <Form.Select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Usuário Ativo"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              />
            </Form.Group>
          </Form>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Desastre</Form.Label>
              <Form.Select
                value={editForm.disasterType}
                onChange={(e) => setEditForm({ ...editForm, disasterType: e.target.value })}
              >
                <option value="">Selecione...</option>
                <option value="flood">Inundação</option>
                <option value="landslide">Deslizamento</option>
                <option value="wildfire">Incêndio Florestal</option>
                <option value="drought">Seca</option>
                <option value="earthquake">Terremoto</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL do Vídeo</Form.Label>
              <Form.Control
                type="text"
                value={editForm.videoUrl}
                onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL da Imagem</Form.Label>
              <Form.Control
                type="text"
                value={editForm.imageUrl}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={activeTab === 'users' ? handleSaveUserEdit : handleSaveContentEdit}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderAddContentModal = () => (
    <Modal show={showContentModal} onHide={() => setShowContentModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Novo Conteúdo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={contentForm.title}
              onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Desastre</Form.Label>
            <Form.Select
              value={contentForm.disasterType}
              onChange={(e) => setContentForm({ ...contentForm, disasterType: e.target.value })}
            >
              <option value="">Selecione...</option>
              <option value="flood">Inundação</option>
              <option value="landslide">Deslizamento</option>
              <option value="wildfire">Incêndio Florestal</option>
              <option value="drought">Seca</option>
              <option value="earthquake">Terremoto</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={contentForm.description}
              onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL do Vídeo</Form.Label>
            <Form.Control
              type="text"
              value={contentForm.videoUrl}
              onChange={(e) => setContentForm({ ...contentForm, videoUrl: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL da Imagem</Form.Label>
            <Form.Control
              type="text"
              value={contentForm.imageUrl}
              onChange={(e) => setContentForm({ ...contentForm, imageUrl: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowContentModal(false)}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleAddContent}>
          Adicionar
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
    <Container className="mt-5 pt-5">
      <h2 className="mb-4">Dashboard Administrativo</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
              >
                Usuários
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'content'}
                onClick={() => setActiveTab('content')}
              >
                Conteúdo
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'kits'}
                onClick={() => setActiveTab('kits')}
              >
                Kits de Emergência
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {activeTab === 'users' && renderUsersTable()}
          {activeTab === 'content' && renderContentTable()}
          {activeTab === 'kits' && renderKitsTable()}
        </Card.Body>
      </Card>

      {renderEditModal()}
      {renderAddContentModal()}

      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{users.length}</h3>
              <Card.Text>Usuários Registrados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{contents.length}</h3>
              <Card.Text>Conteúdos Publicados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{emergencyKits.length}</h3>
              <Card.Text>Kits Criados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 