import { useState } from "react";
import { Modal, Form, Button, Card, Badge } from "react-bootstrap";
import { df } from "../../utils/lang";
import { useProjects, useCreateProject, useDeleteProject } from "../../hooks/useProjectQuery";
import { useCreateTask, useUpdateTaskStatus, useDeleteTask, useUpdateTask, useReorderTasks } from "../../hooks/useTaskQuery";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { MySwal } from "../../utils/chatUtils";
import { uploadsUrl } from "../../config";
import { useRef, useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function TaskManagementModal({ show, onClose }) {
    const { data: projectsData, isLoading } = useProjects();
    const { mutate: createProject } = useCreateProject();
    const { mutate: deleteProject } = useDeleteProject();
    const { mutate: createTask } = useCreateTask();
    const { mutate: updateTaskStatus, isPending: isUpdatingStatus } = useUpdateTaskStatus();
    const { mutate: deleteTask } = useDeleteTask();

    const [projectName, setProjectName] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [taskFiles, setTaskFiles] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showEditTask, setShowEditTask] = useState(false);
    const [showViewTask, setShowViewTask] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [deletedFileIds, setDeletedFileIds] = useState([]);
    const [editingNewFiles, setEditingNewFiles] = useState([]);
    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    const { mutate: updateTask } = useUpdateTask();
    const { mutate: reorderTask, isPending: isReordering } = useReorderTasks();

    const projects = projectsData?.projects || [];
    const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

    useEffect(() => {
        if (!selectedProjectId && projects.length > 0) {
            setSelectedProjectId(projects[0].id);
        }
    }, [projects, selectedProjectId]);

    useEffect(() => {
        Fancybox.bind("[data-fancybox]", {});
        return () => {
            Fancybox.destroy();
        };
    }, []);

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
        const projectId = selectedProjectId || selectedProject?.id;
        if (!taskTitle.trim() || !projectId) return;

        const formData = new FormData();
        formData.append('title', taskTitle);
        formData.append('project_id', projectId);
        taskFiles.forEach(file => {
            formData.append('task_files[]', file);
        });

        createTask(formData, {
            onSuccess: () => {
                setTaskTitle("");
                setTaskFiles([]);
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

    const handleEditTask = (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !editingTask) return;

        const formData = new FormData();
        formData.append('title', taskTitle);
        if (deletedFileIds.length > 0) {
            formData.append('delete_files', JSON.stringify(deletedFileIds));
        }
        editingNewFiles.forEach(file => {
            formData.append('task_files[]', file);
        });

        updateTask({ taskId: editingTask.id, data: formData }, {
            onSuccess: () => {
                setTaskTitle("");
                setEditingTask(null);
                setDeletedFileIds([]);
                setEditingNewFiles([]);
                setShowEditTask(false);
                toast.success(df('success'));
            }
        });
    };

    const handleReorder = (taskId, direction, currentPosition, tasksInColumn) => {
        const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1;
        if (newPosition < 0 || newPosition >= tasksInColumn.length) return;

        reorderTask({ task_id: taskId, new_position: newPosition }, {
            onSuccess: () => {
                // query client invalidates automatically
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
            tasks: (p.tasks || []).filter(t => t.status === 'done')
        })).filter(p => p.tasks.length > 0);

        if (doneTasksByProject.length === 0) {
            toast.error(df('no_done_tasks'));
            return;
        }

        let html = '<div style="font-family: Arial, sans-serif;">';
        let plainText = "";

        doneTasksByProject.forEach(p => {
            html += `<h3 style="color: #4a4a4a; margin-bottom: 10px; border-bottom: 2px solid #eee; padding-bottom: 5px;">${p.name}</h3>`;
            html += '<ul style="padding-left: 20px; margin-bottom: 20px;">';
            plainText += `${p.name}:\n`;

            p.tasks.sort((a, b) => a.position - b.position).forEach(t => {
                html += `<li style="margin-bottom: 5px;">${t.title}</li>`;
                plainText += `- ${t.title}\n`;
            });

            html += '</ul>';
            plainText += '\n';
        });
        html += '</div>';

        const blob = new Blob([html], { type: 'text/html' });
        const data = [new ClipboardItem({
            'text/html': blob,
            'text/plain': new Blob([plainText], { type: 'text/plain' })
        })];

        navigator.clipboard.write(data).then(() => {
            toast.success(df('copied_to_clipboard'));
        }).catch(err => {
            navigator.clipboard.writeText(plainText);
            toast.success(df('copied_to_clipboard'));
        });
    };

    return (
        <Modal show={show} onHide={onClose} fullscreen={true} centered className="task-modal" contentClassName="border-0 shadow-none">
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
                    <div className="bg-white border-end d-flex flex-column" style={{ width: '250px', minWidth: '250px', maxWidth: '250px' }}>
                        <div className="p-3 border-bottom bg-light">
                            <Form onSubmit={handleCreateProject} className="d-flex gap-2">
                                <Form.Control
                                    size="sm"
                                    placeholder={df('new_project')}
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="shadow-none border-0 bg-white"
                                />
                                <Button type="submit" variant="theme" size="sm" className="rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}>
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
                                    <Button variant="theme" onClick={() => { setTaskTitle(""); setTaskFiles([]); setShowAddTask(true); }} className="rounded-theme px-4 shadow-sm btn-theme">
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
                                                    {selectedProject.tasks?.filter(t => t.status === status).map((task, index, filteredTasks) => (
                                                        <Card key={task.id} className="mb-3 border-0 shadow-sm rounded-3 overflow-hidden task-card">
                                                            <Card.Body className="p-3">
                                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                                    <span className="x-small text-muted" style={{ fontSize: '0.7rem' }}>
                                                                        {new Date(task.created_at).toLocaleDateString()}
                                                                    </span>
                                                                    <div className="d-flex gap-1">
                                                                        <button
                                                                            className="btn btn-link p-0 text-secondary hover-text-theme"
                                                                            disabled={index === 0 || isReordering}
                                                                            onClick={() => handleReorder(task.id, 'up', index, filteredTasks)}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-link p-0 text-secondary hover-text-theme"
                                                                            disabled={index === filteredTasks.length - 1 || isReordering}
                                                                            onClick={() => handleReorder(task.id, 'down', index, filteredTasks)}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <Card.Text className="small fw-medium mb-2 text-dark whitespace-pre-wrap">{task.title}</Card.Text>
                                                                {task.files && task.files.length > 0 && (
                                                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                                                        {task.files.map((fileObj, idx) => {
                                                                            const file = fileObj.file;
                                                                            const isImage = file.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                                                            return (
                                                                                <div key={idx} style={{ width: isImage ? '100%' : 'auto', maxWidth: '100%' }}>
                                                                                    {isImage ? (
                                                                                        <a href={uploadsUrl + '/' + file} data-fancybox={`gallery-${task.id}`}>
                                                                                            <img
                                                                                                src={uploadsUrl + '/' + file}
                                                                                                alt=""
                                                                                                className="img-fluid rounded border mb-1"
                                                                                                style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                                                                                            />
                                                                                        </a>
                                                                                    ) : (
                                                                                        <a href={uploadsUrl + '/' + file} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 p-2 bg-light rounded text-decoration-none text-dark border">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                                                            <span className="x-small text-truncate">{file.split('_').slice(1).join('_')}</span>
                                                                                        </a>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                                    <div className="d-flex gap-2">
                                                                        {status !== 'pending' && (
                                                                            <button
                                                                                className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center text-secondary border shadow-sm"
                                                                                style={{ width: '28px', height: '28px' }}
                                                                                onClick={() => handleMoveTask(task.id, status === 'done' ? 'working' : 'pending')}
                                                                                disabled={isUpdatingStatus}
                                                                                title={df('move_back')}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-rotate-180"><polyline points="15 18 9 12 15 6" /></svg>
                                                                            </button>
                                                                        )}
                                                                        {status !== 'done' && (
                                                                            <button
                                                                                className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center text-secondary border shadow-sm"
                                                                                style={{ width: '28px', height: '28px' }}
                                                                                onClick={() => handleMoveTask(task.id, status === 'pending' ? 'working' : 'done')}
                                                                                disabled={isUpdatingStatus}
                                                                                title={df('move_forward')}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-rotate-180"><polyline points="9 18 15 12 9 6" /></svg>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className="d-flex gap-2">
                                                                        <button
                                                                            className="btn btn-link text-secondary p-0"
                                                                            onClick={() => {
                                                                                setViewingTask(task);
                                                                                setShowViewTask(true);
                                                                            }}
                                                                            title={df('view')}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-link text-secondary p-0"
                                                                            onClick={() => {
                                                                                setEditingTask(task);
                                                                                setTaskTitle(task.title);
                                                                                setDeletedFileIds([]);
                                                                                setEditingNewFiles([]);
                                                                                setShowEditTask(true);
                                                                            }}
                                                                            title={df('edit')}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                                        </button>
                                                                        <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteTask(task.id)} title={df('delete')}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                                        </button>
                                                                    </div>
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

            <Modal show={showAddTask} onHide={() => setShowAddTask(false)} centered contentClassName="rounded-theme border-0 shadow">
                <Modal.Header closeButton className="bg-theme text-white border-0">
                    <Modal.Title className="fw-bold">{df('add_task')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0">
                    <Form onSubmit={handleCreateTask}>
                        <Form.Group className="mb-3">
                            <label className="form-label">{df('task_title')}</label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                autoFocus
                                placeholder={df('task_title')}
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="shadow-none border-light bg-light rounded-theme"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <label className="form-label">{df('attachment')}</label>
                            <div className="d-flex flex-column gap-2">
                                <Button
                                    variant="light"
                                    className="rounded-theme border d-flex align-items-center justify-content-center"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                    {df('attach_files')}
                                </Button>
                                <div className="d-flex flex-wrap gap-2">
                                    {taskFiles.map((file, idx) => (
                                        <div key={idx} className="position-relative">
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt=""
                                                    className="rounded border"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="rounded border bg-light d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm rounded-circle position-absolute p-0 d-flex align-items-center justify-content-center"
                                                style={{ top: '-5px', right: '-5px', width: '20px', height: '20px' }}
                                                onClick={() => setTaskFiles(taskFiles.filter((_, i) => i !== idx))}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="d-none"
                                multiple
                                onChange={(e) => setTaskFiles([...taskFiles, ...Array.from(e.target.files)])}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" className="rounded-theme px-4" onClick={() => setShowAddTask(false)}>
                                {df('cancel')}
                            </Button>
                            <Button type="submit" variant="theme" className="rounded-theme px-4 btn-theme" disabled={!taskTitle.trim()}>
                                {df('add')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditTask} onHide={() => { setShowEditTask(false); setEditingTask(null); }} centered contentClassName="rounded-theme border-0 shadow">
                <Modal.Header closeButton className="bg-theme text-white border-0">
                    <Modal.Title className="fw-bold">{df('edit_task')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0">
                    <Form onSubmit={handleEditTask}>
                        <Form.Group className="mb-3">
                            <label className="form-label">{df('task_title')}</label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                autoFocus
                                placeholder={df('task_title')}
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="shadow-none border-light bg-light rounded-theme"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <label className="form-label">{df('attachment')}</label>
                            <div className="d-flex flex-column gap-2">
                                {/* Existing Files */}
                                {editingTask?.files && editingTask.files.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        {editingTask.files.map((fileObj, idx) => {
                                            if (deletedFileIds.includes(fileObj.id)) return null;
                                            const file = fileObj.file;
                                            const isImg = file.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                            return (
                                                <div key={idx} className="position-relative">
                                                    {isImg ? (
                                                        <img src={uploadsUrl + '/' + file} alt="" className="rounded border" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="rounded border bg-light d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                        </div>
                                                    )}
                                                    <button type="button" className="btn btn-danger btn-sm rounded-circle position-absolute p-0 d-flex align-items-center justify-content-center" style={{ top: '-5px', right: '-5px', width: '20px', height: '20px' }} onClick={() => setDeletedFileIds([...deletedFileIds, fileObj.id])}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {/* New Files */}
                                <Button variant="light" className="rounded-theme border d-flex align-items-center justify-content-center shadow-sm" onClick={() => editFileInputRef.current?.click()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                    {df('attach_files')}
                                </Button>
                                <div className="d-flex flex-wrap gap-2">
                                    {editingNewFiles.map((file, idx) => (
                                        <div key={idx} className="position-relative">
                                            {file.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} alt="" className="rounded border shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="rounded border bg-light d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                </div>
                                            )}
                                            <button type="button" className="btn btn-danger btn-sm rounded-circle position-absolute p-0 d-flex align-items-center justify-content-center" style={{ top: '-5px', right: '-5px', width: '20px', height: '20px' }} onClick={() => setEditingNewFiles(editingNewFiles.filter((_, i) => i !== idx))}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <input type="file" ref={editFileInputRef} className="d-none" multiple onChange={(e) => setEditingNewFiles([...editingNewFiles, ...Array.from(e.target.files)])} />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" className="rounded-theme px-4" onClick={() => { setShowEditTask(false); setEditingTask(null); }}>
                                {df('cancel')}
                            </Button>
                            <Button type="submit" variant="theme" className="rounded-theme px-4 btn-theme" disabled={!taskTitle.trim()}>
                                {df('save')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* View Task Modal */}
            <Modal show={showViewTask} onHide={() => { setShowViewTask(false); setViewingTask(null); }} size="lg" centered contentClassName="rounded-theme border-0 shadow">
                <Modal.Header closeButton className="bg-theme text-white border-0">
                    <Modal.Title className="fw-bold">{df('view_task')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0 p-4">
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-1">{df('task_title')}</label>
                        <div className="fs-5 fw-medium text-dark" style={{ whiteSpace: 'pre-wrap' }}>{viewingTask?.title}</div>
                    </div>
                    {viewingTask?.files && viewingTask.files.length > 0 && (
                        <div>
                            <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-1 mb-3">{df('attachment')}</label>
                            <div className="row g-3">
                                {viewingTask.files.map((fileObj, idx) => {
                                    const file = fileObj.file;
                                    const isImage = file.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                    return (
                                        <div key={idx} className={isImage ? "col-sm-6 col-md-4" : "col-12"}>
                                            {isImage ? (
                                                <div className="view-task-img-container shadow-sm border rounded-3 overflow-hidden">
                                                    <a href={uploadsUrl + '/' + file} data-fancybox="task-gallery">
                                                        <img
                                                            src={uploadsUrl + '/' + file}
                                                            alt=""
                                                            className="img-fluid hover-scale transition-all cursor-pointer"
                                                            style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                                                        />
                                                    </a>
                                                </div>
                                            ) : (
                                                <a href={uploadsUrl + '/' + file} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 text-decoration-none text-dark border hover-bg-light-dark transition-all">
                                                    <div className="bg-white p-2 rounded-circle shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                                    </div>
                                                    <span className="small fw-medium text-truncate">{file.split('_').slice(1).join('_')}</span>
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Modal>
    );
}
