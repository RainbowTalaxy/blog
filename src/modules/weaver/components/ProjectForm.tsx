import { createPortal } from 'react-dom';
import styles from '../styles/form.module.css';
import { ProjectInfo } from '@site/src/api/weaver';
import { useEffect, useRef } from 'react';
import { Button, Input } from '@site/src/components/Form';
import API from '@site/src/api';
import { formToday, time } from '@site/src/utils';
import { useHistory } from '@docusaurus/router';

interface Props {
    project?: ProjectInfo;
    onClose: (success?: boolean) => Promise<void>;
}

const ProjectForm = ({ project, onClose }: Props) => {
    const history = useHistory();
    const nameRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (project) {
            nameRef.current!.value = project.name;
        }
    }, [project]);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{project ? '项目详情' : '新建项目'}</h2>
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>标题：
                    </label>
                    <Input raf={nameRef} />
                </div>
                {!project && (
                    <div className={styles.formItem}>
                        <label>开始时间：</label>
                        <Input raf={dateRef} type="date" defaultValue={formToday()} />
                    </div>
                )}
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (!nameRef.current?.value) return alert('请输入标题');
                                try {
                                    if (project) {
                                        await API.weaver.updateProject(project.id, {
                                            name: nameRef.current.value,
                                        });
                                    } else {
                                        const firstDate = time(dateRef.current.value);
                                        await API.weaver.createProject(nameRef.current.value, firstDate);
                                    }
                                    await onClose(true);
                                } catch {
                                    alert('提交失败');
                                }
                            }}
                        >
                            {project ? '保存' : '创建'}
                        </Button>
                        <Button onClick={() => onClose()}>取消</Button>
                        {project && (
                            <Button
                                type="danger"
                                onClick={async () => {
                                    const result = confirm(`确定删除项目 ${project.name} ？`);
                                    if (!result) return;
                                    try {
                                        await API.weaver.deleteProject(project.id);
                                        await onClose(true);
                                        history.replace('/weaver');
                                    } catch {
                                        alert('删除失败');
                                    }
                                }}
                            >
                                删除
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.mask} onClick={() => onClose()} />
        </div>,
        document.body,
    );
};

export default ProjectForm;
