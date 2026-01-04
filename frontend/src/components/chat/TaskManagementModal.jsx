import { useState } from "react";
import { Modal, Form, Button, Card, Badge } from "react-bootstrap";
import { df } from "../../utils/lang";
import { useProjects, useCreateProject, useDeleteProject, useCreateTask, useUpdateTaskStatus, useDeleteTask } from "../../hooks/useTaskQuery";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { MySwal } from "../../utils/chatUtils";

export default function TaskManagementModal({ show, onClose }) {
    const { data: projectsData, isLoading } = useProjects();
    const { mutate: createProject } = useCreateProject();
    const { mutate: deleteProject } = useDeleteProject();
    const { mutate: createTask } = useCreateTask();
    const { mutate: updateTaskStatus } = useUpdateTaskStatus();
    const { mutate: deleteTask } = useDeleteTask();

    const [projectName, setProjectName] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showAddTask, setShowAddTask] = useState(false);

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!projectName.trim()) return;
        createProject({ name: projectName }, {
            onSuccess: () => {
                setProjectName("");
                toast.success(df('success'));
            }
        });
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !selectedProjectId) return;
        createTask({ title: taskTitle, project_id: selectedProjectId }, {
            onSuccess: () => {
                setTaskTitle("");
                setShowAddTask(false);
                toast.success(df('success'));
            }
        });
    };

    const handleMoveTask = (taskId, status) => {
        updateTaskStatus({ taskId, status }, {
            onSuccess: () => {
                toast.success(df('success'));
            }
        });
    };

    const handleDeleteTask = async (taskId) => {
        const result = await MySwal.fire({
            title: df('are_you_sure'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: df('yes_delete'),
            cancelButtonText: df('cancel'),
            customClass: {
                confirmButton: 'btn btn-theme px-4 mx-2',
                cancelButton: 'btn btn-light px-4 mx-2'
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            deleteTask(taskId, {
                onSuccess: () => {
                    toast.success(df('success'));
                }
            });
        }
    };

    const handleDeleteProject = async (projectId) => {
        const result = await MySwal.fire({
            title: df('are_you_sure'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: df('yes_delete'),
            cancelButtonText: df('cancel'),
            customClass: {
                confirmButton: 'btn btn-theme px-4 mx-2',
                cancelButton: 'btn btn-light px-4 mx-2'
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            deleteProject(projectId, {
                onSuccess: () => {
                    toast.success(df('success'));
                    if (selectedProjectId === projectId) setSelectedProjectId(null);
                }
            });
        }
    };

    const handleCopyDoneTasks = () => {
        const doneTasksByProject = projects.map(p => ({
            name: p.name,
            tasks: p.tasks?.filter(t => t.status === 'done') || []
        })).filter(p => p.tasks.length > 0);

        if (doneTasksByProject.length === 0) {
            toast.error(df('no_done_tasks'));
            return;
        }

        let html = '<ul style="list-style-type: none; padding: 0;">';
        doneTasksByProject.forEach(p => {
            html += `<li style="margin-bottom: 20px;"><strong>${p.name}:</strong><ul style="margin-top: 5px;">`;
            p.tasks.forEach(t => {
                html += `<li>${t.title}</li>`;
            });
            html += '</ul></li>';
        });
        html += '</ul>';

        const blob = new Blob([html], { type: 'text/html' });
        const data = [new ClipboardItem({ 'text/html': blob })];

        navigator.clipboard.write(data).then(() => {
            toast.success(df('copied_to_clipboard'));
        }).catch(err => {
            // Fallback to plain text if HTML clipboard fails
            let text = "";
            doneTasksByProject.forEach(p => {
                text += `${p.name}:\n`;
                p.tasks.forEach(t => {
                    text += `- ${t.title}\n`;
                });
                text += '\n';
            });
            navigator.clipboard.writeText(text);
            toast.success(df('copied_to_clipboard'));
        });
    };

    const projects = projectsData?.projects || [];
    const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

    return (
        <Modal show={show} onHide={onClose} size="xl" centered className="task-modal">
            <Modal.Header closeButton className="bg-theme text-white border-0">
                <Modal.Title className="fw-bold d-flex align-items-center w-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    {df('task_management')}
                    <Button variant="outline-light" size="sm" className="ms-auto me-3 border-0" onClick={handleCopyDoneTasks} title={df('copy_done_tasks')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                        {df('copy_done_tasks')}
                    </Button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light p-0" style={{ minHeight: '80vh' }}>
                <div className="d-flex h-100" style={{ minHeight: '80vh' }}>
                    {/* Projects Sidebar */}
                    <div className="bg-white border-end d-flex flex-column" style={{ width: '250px' }}>
                        <div className="p-3 border-bottom bg-light">
                            <Form onSubmit={handleCreateProject} className="d-flex gap-2">
                                <Form.Control
                                    size="sm"
                                    placeholder={df('new_project')}
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="shadow-none border-0 bg-white"
                                />
                                <Button type="submit" variant="theme" size="sm" className="rounded-circle p-1" style={{ width: '28px', height: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </Button>
                            </Form>
                        </div>
                        <div className="flex-grow-1 overflow-auto">
                            {isLoading ? <div className="p-3 text-center"><Spinner /></div> : (
                                projects.map(project => (
                                    <div
                                        key={project.id}
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className={`p-3 cursor-pointer d-flex justify-content-between align-items-center transition-all ${selectedProjectId === project.id ? 'bg-theme text-white shadow-sm' : 'hover-bg-light'}`}
                                    >
                                        <span className="text-truncate fw-medium">{project.name}</span>
                                        <div className="d-flex align-items-center gap-2">
                                            <Badge bg={selectedProjectId === project.id ? 'light' : 'theme'} text={selectedProjectId === project.id ? 'dark' : 'white'} pill>
                                                {project.tasks?.length || 0}
                                            </Badge>
                                            <button
                                                className={`btn btn-link p-0 ${selectedProjectId === project.id ? 'text-white' : 'text-danger'} opacity-50 hover-opacity-100`}
                                                onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Tasks Board */}
                    <div className="flex-grow-1 p-4 overflow-auto">
                        {selectedProject ? (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold mb-0">{selectedProject.name}</h4>
                                    <Button variant="theme" onClick={() => setShowAddTask(true)} className="rounded-pill px-4 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        {df('add_task')}
                                    </Button>
                                </div>

                                <div className="row g-4 h-100">
                                    {['pending', 'working', 'done'].map(status => (
                                        <div key={status} className="col-md-4">
                                            <div className="kanban-column bg-white bg-opacity-50 rounded-4 p-3 h-100 border shadow-sm">
                                                <div className="d-flex align-items-center justify-content-between mb-3 px-2">
                                                    <h6 className="text-uppercase fw-bold text-secondary mb-0 letter-spacing-1">
                                                        {df(status)}
                                                    </h6>
                                                    <Badge bg={status === 'pending' ? 'warning' : status === 'working' ? 'primary' : 'success'} pill>
                                                        {selectedProject.tasks?.filter(t => t.status === status).length || 0}
                                                    </Badge>
                                                </div>
                                                <div className="task-list">
                                                    {selectedProject.tasks?.filter(t => t.status === status).map(task => (
                                                        <Card key={task.id} className="mb-3 border-0 shadow-sm rounded-3 overflow-hidden task-card">
                                                            <Card.Body className="p-3">
                                                                <div className="d-flex justify-content-between mb-2">
                                                                    <span className="x-small text-muted" style={{ fontSize: '0.7rem' }}>
                                                                        {new Date(task.created_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <Card.Text className="small fw-medium mb-3 text-dark">{task.title}</Card.Text>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="btn-group btn-group-sm bg-light rounded-pill p-1">
                                                                        {status !== 'pending' && (
                                                                            <button className="btn btn-link p-1 text-secondary" onClick={() => handleMoveTask(task.id, status === 'done' ? 'working' : 'pending')} title={df('move_back')}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-rotate-180"><polyline points="15 18 9 12 15 6" /></svg>
                                                                            </button>
                                                                        )}
                                                                        {status !== 'done' && (
                                                                            <button className="btn btn-link p-1 text-secondary" onClick={() => handleMoveTask(task.id, status === 'pending' ? 'working' : 'done')} title={df('move_forward')}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-rotate-180"><polyline points="9 18 15 12 9 6" /></svg>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteTask(task.id)}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                                    </button>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-secondary flex-column">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-25"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                <p>{df('select_or_create_project')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>

            <Modal show={showAddTask} onHide={() => setShowAddTask(false)} centered size="sm">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="h6 fw-bold">{df('add_task')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateTask}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                autoFocus
                                placeholder={df('task_title')}
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="shadow-none border-light bg-light"
                            />
                        </Form.Group>
                        <Button type="submit" variant="theme" className="w-100 rounded-pill">
                            {df('add')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Modal>
    );
}
