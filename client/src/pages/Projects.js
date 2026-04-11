import { useEffect, useState } from "react";
import { api } from "../api/client";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api("/projects");
                setProjects(data);
            } catch (err) {
                console.error("プロジェクトの取得に失敗:", err);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h2>プロジェクト一覧</h2>

            {projects.map((p) => (
                <div key={p.id}>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Projects;