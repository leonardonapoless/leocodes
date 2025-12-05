import React from 'react';
import swiftIcon from '../assets/swift.svg';
import javaIcon from '../assets/java.svg';
import javascriptIcon from '../assets/javascript.svg';
import htmlIcon from '../assets/html.svg';
import cssIcon from '../assets/css.svg';
import reactIcon from '../assets/react.svg';
import viteIcon from '../assets/Vite.js.svg';
import cppIcon from '../assets/cppIcon.svg';
import juceIcon from '../assets/juceIcon.png';
import metalIcon from '../assets/metalIcon.png';
import openglIcon from '../assets/openglIcon.png';
import trebleMakerImage from '../assets/treblemaker_demo.png';

interface Project {
    id: number;
    name: string;
    technologies: string[];
    description: string;
    githubLink: string;
    demoLink: string;
    videoSize?: { width: number; height: number };
    videoPosition?: { x: number; y: number };
    demoImage?: string;
}

interface ProjectsProps {
    onOpenVideo?: (videoId: string, title: string, width?: number, height?: number, x?: number, y?: number) => void;
    onOpenBrowser?: (url: string, title: string) => void;
    onOpenImage?: (imageUrl: string, title: string) => void;
}

const Projects = ({ onOpenVideo, onOpenBrowser, onOpenImage }: ProjectsProps) => {
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
            demoLink: 'https://youtube.com/shorts/sFOXO_k8Tg8?si=RTLpRh8eiyk4DQ09',
            videoSize: { width: 550, height: 700 },
            videoPosition: { x: 500, y: 50 }
        },
    ];

    const otherProjects: Project[] = [
        {
            id: 3, name: 'TrebleMaker',
            technologies: ['cpp', 'JUCE', 'Metal', 'OpenGL'],
            description: 'A simple high-shelf filter plugin built with JUCE.',
            githubLink: 'https://github.com/leonardonapoless/treblemaker',
            demoLink: '',
            demoImage: trebleMakerImage
        },
        {
            id: 4, name: 'Sacolão Rodrigues',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            description: 'Sacolão Rodrigues (Trabalho Final de Introdução ao Desenvolvimento Web, 1º Período)',
            githubLink: 'https://github.com/leonardonapoless/SacolaoRodrigues',
            demoLink: 'https://sacolaorodrigues.kinsta.page/'
        },
        {
            id: 5, name: 'Calc U Later',
            technologies: ['Java'],
            description: 'Simple Calculator App in Java',
            githubLink: 'https://github.com/leonardonapoless/calc_u_later',
            demoLink: ''
        },
        {
            id: 6, name: 'LeoCodes - Portfolio',
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

    const techConfig: Record<string, { src: string, style?: React.CSSProperties, filter?: string }> = {
        'Swift': { src: swiftIcon, filter: 'none', style: { height: '20px' } },
        'SwiftUI': { src: swiftIcon, filter: 'none' },
        'Java': { src: javaIcon, filter: 'none' },
        'Java Swing': { src: javaIcon, filter: 'none' },
        'JavaScript': { src: javascriptIcon },
        'HTML': { src: htmlIcon },
        'CSS': { src: cssIcon },
        'React': { src: reactIcon, filter: 'brightness(0) saturate(100%)' },
        'Vite': { src: viteIcon },
        'cpp': { src: cppIcon, filter: 'none', style: { height: '26px' } },
        'JUCE': { src: juceIcon, filter: 'none', style: { height: '25px' } },
        'Metal': { src: metalIcon, filter: 'none', style: { height: '28px' } },
        'OpenGL': { src: openglIcon, filter: 'none', style: { height: '45px' } }
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
                                                        style={{
                                                            width: 'auto',
                                                            height: '20px',
                                                            verticalAlign: 'middle',
                                                            paddingBottom: '4px',
                                                            marginLeft: index === 0 ? '0' : '8px',
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
