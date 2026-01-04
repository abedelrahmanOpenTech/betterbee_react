import { useState } from "react";
import { Modal, Form, Button, ListGroup } from "react-bootstrap";
import { df } from "../../utils/lang";
import { basename } from "../../utils/utils";
import { useProjects, useCreateTask } from "../../hooks/useTaskQuery";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";

export default function AddToProjectModal({ show, onClose, message }) {
    const { data: projectsData, isLoading } = useProjects();
    const { mutate: createTask, isPending } = useCreateTask();
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const taskTitle = message?.message || (message?.file ? basename(message.file) : "");

    const handleAdd = () => {
        if (!selectedProjectId || !message) return;

        createTask({
            project_id: selectedProjectId,
            title: taskTitle, // Use the message content as the task title
            message_id: message.id
        }, {
            onSuccess: () => {
                toast.success(df('success'));
                onClose();
            },
            onError: (error) => {
                toast.error(error.message || df('error'));
            }
        });
    };

    const projects = projectsData?.projects || [];

    return (
        <Modal show={show} onHide={onClose} centered size="sm">
            <Modal.Header closeButton className="border-0 bg-theme text-white">
                <Modal.Title className="h6 fw-bold">{df('add_to_project')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div className="p-3 bg-light border-bottom">
                    <div className="small text-secondary mb-1">{df('message_preview')}:</div>
                    <div className="small fw-medium text-truncate">{taskTitle}</div>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {isLoading ? <div className="p-4 text-center"><Spinner /></div> : (
                        <ListGroup variant="flush">
                            {projects.map(project => (
                                <ListGroup.Item
                                    key={project.id}
                                    action
                                    active={selectedProjectId === project.id}
                                    onClick={() => setSelectedProjectId(project.id)}
                                    className="border-0 py-3"
                                >
                                    {project.name}
                                </ListGroup.Item>
                            ))}
                            {projects.length === 0 && (
                                <div className="p-4 text-center text-secondary small">
                                    {df('no_projects_found')}
                                </div>
                            )}
                        </ListGroup>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onClose} className="rounded-pill px-3">{df('cancel')}</Button>
                <Button
                    variant="theme"
                    onClick={handleAdd}
                    disabled={!selectedProjectId || isPending}
                    className="rounded-pill px-4"
                >
                    {isPending ? <Spinner size="sm" /> : df('add')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
