import React from 'react';
import swiftIcon from '../assets/swift-96x96_2x.png';
import swiftuiIcon from '../assets/swiftui-96x96_2x.png';
import javaIcon from '../assets/java.svg';
import javafxIcon from '../assets/javafxicon.png';
import javascriptIcon from '../assets/javascript.svg';
import htmlIcon from '../assets/html.svg';
import cssIcon from '../assets/css.svg';
import reactIcon from '../assets/react.svg';
import viteIcon from '../assets/Vite.js.svg';
import cppIcon from '../assets/cppIcon.svg';
import juceIcon from '../assets/juceIcon.png';
import metalIcon from '../assets/metalIcon.png';
import openglIcon from '../assets/openglIcon.png';
import typescriptIcon from '../assets/typescriptIcon.png';
import sqliteIcon from '../assets/sqliteicon.png';
import { projectCategories, type Project } from './projectsData';

interface ProjectsProps {
    onOpenVideo?: (videoId: string, title: string, width?: number, height?: number, x?: number, y?: number) => void;
    onOpenBrowser?: (url: string, title: string) => void;
    onOpenImage?: (imageUrl: string, title: string) => void;
}

const Projects = ({ onOpenVideo, onOpenBrowser, onOpenImage }: ProjectsProps) => {
    const extractYouTubeVideoId = (url: string) => {
        const patterns = [
            { match: 'youtube.com/shorts/', extract: (u: string) => u.split('shorts/')[1].split('?')[0] },
            { match: 'v=', extract: (u: string) => u.split('v=')[1].split('&')[0] },
            { match: 'youtu.be/', extract: (u: string) => u.split('youtu.be/')[1].split('?')[0] },
            { match: 'youtube.com/embed/', extract: (u: string) => u.split('embed/')[1].split('?')[0] }
        ];

        for (const pattern of patterns) {
            if (url.includes(pattern.match)) {
                return pattern.extract(url);
            }
        }
        return '';
    };

    const handleDemoClick = (e: React.MouseEvent, project: Project) => {
        const isYouTubeLink = project.demoLink.includes('youtube.com') || project.demoLink.includes('youtu.be');

        if (isYouTubeLink) {
            e.preventDefault();
            const videoId = extractYouTubeVideoId(project.demoLink);

            if (videoId && onOpenVideo) {
                onOpenVideo(videoId, project.name, project.videoSize?.width, project.videoSize?.height, project.videoPosition?.x, project.videoPosition?.y);
            } else {
                window.open(project.demoLink, '_blank');
            }
        } else {
            if (onOpenBrowser) {
                e.preventDefault();
                onOpenBrowser(project.demoLink, project.name);
            }
        }
    };

    const techConfig: Record<string, { src: string, style?: React.CSSProperties, filter?: string }> = {
        'Swift': { src: swiftIcon, filter: 'none', style: { height: '27px' } },
        'SwiftUI': { src: swiftuiIcon, filter: 'none', style: { height: '27px' } },
        'Java': { src: javaIcon, filter: 'none' },
        'JavaFX': { src: javafxIcon, filter: 'none', style: { height: '28px', paddingBottom: '9px' } },
        'JavaScript': { src: javascriptIcon },
        'TypeScript': { src: typescriptIcon, style: { height: '26px' } },
        'HTML': { src: htmlIcon },
        'CSS': { src: cssIcon },
        'React': { src: reactIcon, filter: 'brightness(0) saturate(100%)' },
        'Vite': { src: viteIcon },
        'C++': { src: cppIcon, filter: 'none', style: { height: '26px' } },
        'JUCE': { src: juceIcon, filter: 'none', style: { height: '25px' } },
        'Metal': { src: metalIcon, filter: 'none', style: { height: '28px' } },
        'OpenGL': { src: openglIcon, filter: 'none', style: { height: '50px', paddingTop: '2px' } },
        'SQLite': { src: sqliteIcon, filter: 'none', style: { height: '22px', paddingBottom: '2px' } }
    };

    const renderProjectList = (projects: Project[], openByDefault = true) => (
        <ul className="tree-view">
            {projects.map(project => (
                <li key={project.name}>
                    <details open={openByDefault}>
                        <summary>
                            <b>
                                {project.name}
                                {project.technologies && (
                                    <span style={{ marginLeft: '8px', display: 'inline-block' }}>
                                        {' '}
                                        {project.technologies.map((tech: string, index: number) => {
                                            const config = techConfig[tech];

                                            if (config) {
                                                return (
                                                    <img
                                                        key={index}
                                                        src={config.src}
                                                        alt={tech}
                                                        title={tech}
                                                        className="tech-icon"
                                                        style={{
                                                            width: 'auto',
                                                            height: '25px',
                                                            verticalAlign: 'middle',
                                                            paddingBottom: '5px',
                                                            marginLeft: index === 0 ? '0' : '3px',
                                                            filter: config.filter || 'grayscale(100%) contrast(2) brightness(0.8)',
                                                            ...config.style
                                                        }}
                                                    />
                                                );
                                            }

                                            return (
                                                <span key={index} style={{ fontSize: '11px', color: '#555', marginLeft: '4px' }}>{tech}</span>
                                            );
                                        })}
                                    </span>
                                )}
                            </b>
                        </summary>
                        <ul>
                            <li>{project.description}</li>
                            <li><a href={project.githubLink} target="_blank" rel="noopener noreferrer">See Code</a></li>
                            {project.demoLink && <li><a href={project.demoLink} onClick={(e) => handleDemoClick(e, project)} target="_blank" rel="noopener noreferrer">See Demo</a></li>}
                            {project.demoImage && (
                                <li style={{ marginTop: '10px' }}>
                                    <div
                                        onClick={() => onOpenImage && onOpenImage(project.demoImage!, project.name)}
                                        style={{ cursor: 'pointer', display: 'inline-block' }}
                                        title="Click to enlarge"
                                    >
                                        <img
                                            src={project.demoImage}
                                            alt={`${project.name} Demo`}
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />
                                    </div>
                                </li>
                            )}
                        </ul>
                    </details>
                    <br />
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            {projectCategories.map((category) => (
                <React.Fragment key={category.label}>
                    <fieldset>
                        <legend>{category.label}</legend>
                        {renderProjectList(category.projects, category.openByDefault)}
                    </fieldset>
                    <br />
                </React.Fragment>
            ))}
        </div>
    );
};

export default Projects;
