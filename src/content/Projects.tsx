import React from 'react';
import swiftIcon from '../assets/swift.svg';
import javaIcon from '../assets/java.svg';
import javascriptIcon from '../assets/javascript.svg';
import htmlIcon from '../assets/html.svg';
import cssIcon from '../assets/css.svg';
import reactIcon from '../assets/react.svg';
import viteIcon from '../assets/Vite.js.svg';

interface Project {
    id: number;
    name: string;
    technologies: string[];
    description: string;
    githubLink: string;
    demoLink: string;
    videoSize?: { width: number; height: number };
    videoPosition?: { x: number; y: number };
}

interface ProjectsProps {
    onOpenVideo?: (videoId: string, title: string, width?: number, height?: number, x?: number, y?: number) => void;
    onOpenBrowser?: (url: string, title: string) => void;
}

const Projects = ({ onOpenVideo, onOpenBrowser }: ProjectsProps) => {
    const iosProjects: Project[] = [
        {
            id: 1, name: 'PAMS (Platform Agnostic Music Search)',
            technologies: ['Swift'],
            description: 'A fast, no-frills way to search a song and open it on Apple Music, Spotify, TIDAL, or YouTube. Flip the artwork to see the nerdy bits, then get back to the music.',
            githubLink: 'https://github.com/leonardonapoless/PAMS',
            demoLink: 'https://youtu.be/d1w29lK44IM',
            videoSize: { width: 1020, height: 700 },
            videoPosition: { x: 100, y: 50 }
        },
        {
            id: 2, name: 'TicTak',
            technologies: ['Swift'],
            description: 'A simple tictactoe iOS app made in Swift and SwiftUI using the MVVM architecture.',
            githubLink: 'https://github.com/leonardonapoless/tictak',
            demoLink: 'https://youtube.com/shorts/sFOXO_k8Tg8?si=RTLpRh8eiyk4DQ09'
        },
    ];

    const otherProjects: Project[] = [
        {
            id: 3, name: 'Sacolão Rodrigues',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            description: 'Sacolão Rodrigues (Trabalho Final de Introdução ao Desenvolvimento Web, 1º Período)',
            githubLink: 'https://github.com/leonardonapoless/SacolaoRodrigues',
            demoLink: 'https://sacolaorodrigues.kinsta.page/'
        },
        {
            id: 4, name: 'Calc U Later',
            technologies: ['Java'],
            description: 'Simple Calculator App in Java',
            githubLink: 'https://github.com/leonardonapoless/calc_u_later',
            demoLink: ''
        },
        {
            id: 5, name: 'LeoCodes - Portfolio',
            technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite'],
            description: 'My personal Classic Mac OS style portfolio website built with React and Vite.',
            githubLink: 'https://github.com/leonardonapoless/leocodes',
            demoLink: 'https://leocodes.vercel.app'
        }
    ];

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

    const getTechnologyIcon = (techName: string) => {
        const iconMap: Record<string, string | null> = {
            'Swift': swiftIcon,
            'SwiftUI': swiftIcon,
            'MVVM': null,
            'Java': javaIcon,
            'Java Swing': javaIcon,
            'JavaScript': javascriptIcon,
            'HTML': htmlIcon,
            'CSS': cssIcon,
            'React': reactIcon,
            'Vite': viteIcon
        };
        return iconMap[techName] || null;
    };

    const renderProjectList = (projects: Project[], openByDefault = true) => (
        <ul className="tree-view">
            {projects.map(project => (
                <li key={project.id}>
                    <details open={openByDefault}>
                        <summary>
                            <b>
                                {project.name}
                                {project.technologies && (
                                    <span style={{ marginLeft: '4px', display: 'inline-block' }}>
                                        {' '}
                                        {project.technologies.map((tech: string, index: number) => {
                                            const icon = getTechnologyIcon(tech);
                                            let iconFilter = 'grayscale(100%) contrast(2) brightness(0.8)';

                                            if (tech === 'React') {
                                                iconFilter = 'brightness(0) saturate(100%)';
                                            }
                                            else if (tech === 'Swift' || tech === 'SwiftUI' || tech === 'Java') {
                                                iconFilter = 'none';
                                            }

                                            return icon ? (
                                                <img
                                                    key={index}
                                                    src={icon}
                                                    alt={tech}
                                                    title={tech}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        verticalAlign: 'middle',
                                                        paddingBottom: '4px',
                                                        marginLeft: index === 0 ? '0' : '6px',
                                                        filter: iconFilter
                                                    }}
                                                />
                                            ) : (
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
                        </ul>
                    </details>
                    <br />
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            <fieldset>
                <legend>iOS Projects</legend>
                {renderProjectList(iosProjects)}
            </fieldset>

            <br />

            <fieldset>
                <legend>Other Projects</legend>
                {renderProjectList(otherProjects, false)}
            </fieldset>
        </div>
    );
};

export default Projects;
